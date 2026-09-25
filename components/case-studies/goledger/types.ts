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
      pt: "Cartão recusado pelo adquirente externo: compensação automática libera o saldo bloqueado no ledger.",
      en: "Card declined by external acquirer: automated compensating transaction releases locked ledger balance."
    }
  },
  {
    id: "timeout",
    num: "04",
    label: { pt: "Timeout no Gateway", en: "Gateway Timeout" },
    tag: { pt: "Idempotência & Hold", en: "Idempotency & Hold" },
    desc: {
      pt: "Timeout transitório de rede: retries com Idempotency-Key evitam duplicidade e transação de compensação destrava o hold.",
      en: "Transient network timeout: Idempotency-Key retries prevent duplicates and compensating transaction releases hold."
    }
  },
  {
    id: "circuit_breaker",
    num: "05",
    label: { pt: "Circuit Breaker", en: "Circuit Breaker" },
    tag: { pt: "Fail-Fast (0.1ms)", en: "Fail-Fast (0.1ms)" },
    desc: {
      pt: "Isolamento preventivo de PSP degradado, rejeitando chamadas em 0.1ms para blindar goroutines e pools de conexão.",
      en: "Preventive circuit tripping under downstream failure, failing fast in 0.1ms to guard goroutines and pools."
    }
  }
] as const;

export const GOLEDGER_REPO_URL = "https://github.com/saulo-duarte/distributed-wallet-ledger";
