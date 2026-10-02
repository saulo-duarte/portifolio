export type NodeSimState = "idle" | "running" | "success" | "error" | "compensated";

export type ScenarioId = "success" | "antifraud_block" | "gateway_declined" | "timeout" | "circuit_breaker";

export interface SimulationScenario {
  id: ScenarioId;
  num: string;
  label: { pt: string; en: string };
  tag: { pt: string; en: string };
  desc: { pt: string; en: string };
}

export const simulationScenarios: readonly SimulationScenario[] = [
  {
    id: "success",
    num: "01",
    label: { pt: "Sucesso Total", en: "Full Success" },
    tag: { pt: "Happy Path", en: "Happy Path" },
    desc: {
      pt: "Fluxo transacional ponta a ponta com persistência atômica no PostgreSQL, outbox relay e projeção CQRS no DynamoDB.",
      en: "End-to-end transactional workflow with atomic PostgreSQL persistence, outbox relay, and DynamoDB CQRS projection."
    }
  },
  {
    id: "antifraud_block",
    num: "02",
    label: { pt: "Falha no Antifraude", en: "Antifraud Failure" },
    tag: { pt: "Compensação Saga", en: "Saga Compensation" },
    desc: {
      pt: "Score de risco elevado detectado: a PaymentSaga dispara releaseHold e cancela a reserva sem travar saldos.",
      en: "High fraud risk score: PaymentSaga executes releaseHold and safely aborts without locking user balance."
    }
  },
  {
    id: "gateway_declined",
    num: "03",
    label: { pt: "Recusa no Gateway", en: "Gateway Decline" },
    tag: { pt: "Compensação Saga", en: "Saga Compensation" },
    desc: {
      pt: "Recusa definitiva no gateway mock: a Saga registra a falha e libera o hold; não tenta outro provedor para uma transação recusada.",
      en: "Definitive decline from the mock gateway: the Saga records the failure and releases the hold; it does not retry the declined payment through another provider."
    }
  },
  {
    id: "timeout",
    num: "04",
    label: { pt: "Timeout no Gateway", en: "Gateway Timeout" },
    tag: { pt: "Idempotência & Hold", en: "Idempotency & Hold" },
    desc: {
      pt: "Após o envio, o resultado é incerto: a Saga consulta o mesmo provedor com a mesma chave e mantém o hold durante as tentativas. Sem reconciliação segura, exige revisão.",
      en: "After submission, the outcome is uncertain: the Saga queries the same provider with the same key and keeps the hold during retries. If it cannot reconcile safely, it requires review."
    }
  },
  {
    id: "circuit_breaker",
    num: "05",
    label: { pt: "Circuito aberto → standby", en: "Open circuit → standby" },
    tag: { pt: "Failover seguro", en: "Safe failover" },
    desc: {
      pt: "O circuito aberto impede o envio ao primário; a tentativa persistida pode seguir para o standby porque a cobrança ainda não foi submetida.",
      en: "An open circuit prevents submission to the primary; the persisted attempt can proceed to standby because the payment was never submitted."
    }
  }
] as const;

export const GOLEDGER_REPO_URL = "https://github.com/saulo-duarte/distributed-wallet-ledger";
