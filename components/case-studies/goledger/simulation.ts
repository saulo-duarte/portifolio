import type { NodeSimState, ScenarioId } from "./types";

export const diagramNodeIds = [
  "client", "api", "hold", "attempt", "request_outbox", "request_relay",
  "request_sns", "payment_queue", "worker", "sweeper", "antifraud", "router",
  "primary_cb", "primary_gateway", "secondary_cb", "secondary_gateway",
  "lookup", "capture", "commit", "projection_outbox", "projection_relay",
  "projection_sns", "projection_queue", "projector", "dynamo",
] as const;

export type DiagramNodeId = typeof diagramNodeIds[number];
export type DiagramStates = Record<DiagramNodeId, NodeSimState>;
export type PaymentStatus = "not_submitted" | "pending" | "processing" | "gateway_unknown" | "retry_scheduled" | "completed" | "failed" | "requires_review";

export interface SimulationStep {
  nodes: DiagramStates;
  phase: { pt: string; en: string };
  paymentStatus: PaymentStatus;
  holdStatus: "not_created" | "authorized" | "captured" | "released";
  selectedProvider: "primary" | "secondary" | null;
}

export function createIdleStates(): DiagramStates {
  return Object.fromEntries(diagramNodeIds.map((id) => [id, "idle"])) as DiagramStates;
}

// An illustrative timeline of the persisted workflow, not a payment execution.
export function buildSimulationSteps(scenario: ScenarioId): SimulationStep[] {
  let nodes = createIdleStates();
  let paymentStatus: PaymentStatus = "not_submitted";
  let holdStatus: SimulationStep["holdStatus"] = "not_created";
  let selectedProvider: SimulationStep["selectedProvider"] = null;
  const steps: SimulationStep[] = [];
  const add = (pt: string, en: string, changes: Partial<DiagramStates>) => {
    nodes = { ...nodes, ...changes };
    steps.push({ nodes: { ...nodes }, phase: { pt, en }, paymentStatus, holdStatus, selectedProvider });
  };

  add("Cliente envia POST /payments/checkout.", "Client sends POST /payments/checkout.", { client: "running" });
  add("API valida payload e Idempotency-Key.", "API validates the payload and Idempotency-Key.", { client: "success", api: "running" });
  add("Uma transação reserva saldo, cria a tentativa e PaymentRequested.", "One transaction reserves funds and creates the attempt and PaymentRequested.", {
    hold: "running", attempt: "running", request_outbox: "running",
  });
  paymentStatus = "pending";
  holdStatus = "authorized";
  add("Commit do checkout: hold autorizado, tentativa durável e resposta 202 Accepted.", "Checkout commit: authorized hold, durable attempt, and 202 Accepted.", {
    api: "success", hold: "reserved", attempt: "success", request_outbox: "success",
  });
  add("Primeira passagem pela Outbox: publica PaymentRequested.", "First Outbox pass: publish PaymentRequested.", { request_relay: "running" });
  add("SNS encaminha o evento à fila de pagamentos.", "SNS routes the event to the payment queue.", { request_relay: "success", request_sns: "running" });
  add("SQS entrega o identificador da tentativa à Saga.", "SQS delivers the attempt ID to the Saga.", { request_sns: "success", payment_queue: "running" });
  paymentStatus = "processing";
  add("Worker reivindica a tentativa com lease; sweeper recupera tentativas devidas.", "Worker claims the attempt with a lease; the sweeper recovers due attempts.", {
    payment_queue: "success", worker: "running",
  });
  add("Saga executa a avaliação de antifraude.", "Saga runs the antifraud evaluation.", { antifraud: "running" });
  if (scenario === "antifraud_block") {
    add("Recusa definitiva no antifraude: finalizar falha.", "Definitive antifraud rejection: finalize failure.", { antifraud: "error", commit: "running" });
    paymentStatus = "failed";
    holdStatus = "released";
    add("Failed + hold liberado no mesmo commit; nenhum gateway chamado.", "Failed + hold released in one commit; no gateway called.", {
      worker: "error", commit: "success", hold: "compensated", attempt: "error",
    });
    return steps;
  }
  selectedProvider = "primary";
  add("Antifraude aprovado; GatewayRouter seleciona primary.", "Antifraud approved; GatewayRouter selects primary.", { antifraud: "success", router: "running" });
  if (scenario === "circuit_breaker") {
    add("Breaker primary já aberto: ErrGatewayNotSubmitted, sem envio.", "Primary breaker already open: ErrGatewayNotSubmitted, no submission.", { router: "success", primary_cb: "blocked" });
    paymentStatus = "retry_scheduled";
    selectedProvider = "secondary";
    add("Saga persiste secondary antes de executar a próxima tentativa.", "Saga persists secondary before executing the next attempt.", { attempt: "running" });
    paymentStatus = "gateway_unknown";
    add("Breaker secondary permite envio com paymentID:secondary.", "Secondary breaker permits submission with paymentID:secondary.", {
      attempt: "success", secondary_cb: "success", secondary_gateway: "running",
    });
    add("Secondary confirma succeeded.", "Secondary confirms succeeded.", { secondary_gateway: "success" });
  } else {
    paymentStatus = "gateway_unknown";
    add("Antes do envio, Saga persiste primary e gateway_unknown; usa paymentID:primary.", "Before submission, the Saga persists primary and gateway_unknown; it uses paymentID:primary.", {
      router: "success", primary_cb: "success", primary_gateway: "running",
    });
    if (scenario === "gateway_declined") {
      add("Gateway retorna recusa definitiva; breaker permanece fechado.", "Gateway returns a definitive decline; the breaker stays closed.", { primary_gateway: "error", commit: "running" });
      paymentStatus = "failed";
      holdStatus = "released";
      add("Recusa marca failed e libera hold; secondary não é chamado.", "Decline marks failed and releases the hold; secondary is not called.", {
        commit: "success", worker: "error", hold: "compensated", attempt: "error",
      });
      return steps;
    }
    if (scenario === "timeout" || scenario === "reconciled" || scenario === "not_processed") {
      add("Timeout pós-envio: hold reservado, sem failover automático.", "Post-submission timeout: hold reserved, no automatic failover.", { primary_gateway: "error", hold: "reserved" });
      add("LookupPayment consulta primary com a mesma chave, fora do breaker.", "LookupPayment queries primary with the same key, outside the breaker.", { lookup: "running" });
      if (scenario === "timeout") {
        add("Resultado continua unknown; retries com backoff no mesmo provedor.", "Outcome remains unknown; retries with backoff on the same provider.", { lookup: "error", sweeper: "running" });
        paymentStatus = "requires_review";
        add("Retries esgotados: requires_review; hold continua reservado.", "Retries exhausted: requires_review; hold stays reserved.", {
          sweeper: "success", worker: "blocked", attempt: "blocked",
        });
        return steps;
      }
      if (scenario === "not_processed") {
        add("Primary confirma not_processed: agora o failover é seguro.", "Primary confirms not_processed: failover is now safe.", { lookup: "success" });
        selectedProvider = "secondary";
        paymentStatus = "retry_scheduled";
        add("Saga persiste a troca para secondary.", "Saga persists the switch to secondary.", { attempt: "running" });
        paymentStatus = "gateway_unknown";
        add("Secondary envia com sua própria chave paymentID:secondary.", "Secondary submits with its own paymentID:secondary key.", {
          attempt: "success", secondary_cb: "success", secondary_gateway: "running",
        });
        add("Secondary confirma succeeded.", "Secondary confirms succeeded.", { secondary_gateway: "success" });
      } else {
        add("Lookup confirma succeeded; nenhuma segunda cobrança é enviada.", "Lookup confirms succeeded; no second charge is submitted.", {
          lookup: "success", primary_gateway: "success",
        });
      }
    } else {
      add("Primary confirma succeeded.", "Primary confirms succeeded.", { primary_gateway: "success" });
    }
  }

  paymentStatus = "processing";
  add("Saga persiste o passo capture com o resultado externo confirmado.", "Saga persists the capture step with the confirmed external result.", { capture: "running", commit: "running" });
  if (scenario === "capture_retry") {
    paymentStatus = "retry_scheduled";
    add("Captura local falha e sofre rollback; hold continua reservado.", "Local capture fails and rolls back; the hold stays reserved.", { capture: "error", commit: "error", hold: "reserved" });
    add("Sweeper retoma apenas capture; nenhuma nova chamada ao gateway.", "Sweeper resumes only capture; no new gateway call.", { sweeper: "running" });
    paymentStatus = "processing";
    add("Retry idempotente da captura no PostgreSQL.", "Idempotent capture retry in PostgreSQL.", { capture: "running", commit: "running", sweeper: "success" });
  }
  paymentStatus = "completed";
  holdStatus = "captured";
  add("Commit único: postings, hold capturado, completed e WalletBalanceUpdated.", "One commit: postings, captured hold, completed, and WalletBalanceUpdated.", {
    capture: "success", commit: "success", hold: "success", attempt: "success", worker: "success", projection_outbox: "success",
  });
  add("Segunda passagem pela Outbox: publica WalletBalanceUpdated.", "Second Outbox pass: publish WalletBalanceUpdated.", { projection_relay: "running" });
  add("SNS encaminha à fila de projeção, separada da fila da Saga.", "SNS routes to the projection queue, separate from the Saga queue.", {
    projection_relay: "success", projection_sns: "running",
  });
  add("SQS entrega o evento ao consumidor de projeção.", "SQS delivers the event to the projection consumer.", {
    projection_sns: "success", projection_queue: "running",
  });
  add("Projector recalcula o saldo atual no PostgreSQL.", "Projector recalculates the current balance in PostgreSQL.", {
    projection_queue: "success", projector: "running",
  });
  add("DynamoDB recebe a projeção; completed já foi confirmado no ledger.", "DynamoDB receives the projection; completed was already committed in the ledger.", { projector: "success", dynamo: "running" });
  add("Fluxo concluído. Leituras da projeção podem ter defasagem.", "Flow completed. Projection reads can lag.", { dynamo: "success" });
  return steps;
}
