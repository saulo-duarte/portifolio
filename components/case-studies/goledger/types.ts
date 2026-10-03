export type NodeSimState = "idle" | "running" | "success" | "error" | "compensated" | "reserved" | "blocked";

export type ScenarioId = "success" | "antifraud_block" | "gateway_declined" | "timeout" | "circuit_breaker" | "reconciled" | "capture_retry" | "not_processed";

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
    label: { pt: "Recusa no antifraude", en: "Antifraud rejection" },
    tag: { pt: "Compensação Saga", en: "Saga Compensation" },
    desc: {
      pt: "O antifraude rejeita a tentativa: a Saga marca failed e libera o hold na mesma transação. Um erro temporário de consulta pode gerar retry, em vez de recusa.",
      en: "Antifraud rejects the attempt: the Saga marks it failed and releases the hold in one transaction. A temporary lookup error can schedule a retry instead of rejection."
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
    label: { pt: "Circuito aberto → secondary", en: "Open circuit → secondary" },
    tag: { pt: "Failover seguro", en: "Safe failover" },
    desc: {
      pt: "O breaker do primary já está aberto e devolve ErrGatewayNotSubmitted. A Saga persiste a troca para secondary, que possui seu próprio breaker.",
      en: "The primary breaker is already open and returns ErrGatewayNotSubmitted. The Saga persists the switch to secondary, which has its own breaker."
    }
  },
  {
    id: "reconciled",
    num: "06",
    label: { pt: "Timeout → sucesso reconciliado", en: "Timeout → reconciled success" },
    tag: { pt: "Lookup no mesmo provedor", en: "Same-provider lookup" },
    desc: {
      pt: "O primary aceita a cobrança, mas a resposta se perde. LookupPayment confirma succeeded com a mesma chave; a Saga captura o hold sem enviar ao secondary.",
      en: "Primary accepts the charge but the response is lost. LookupPayment confirms succeeded with the same key; the Saga captures the hold without submitting to secondary."
    }
  },
  {
    id: "capture_retry",
    num: "07",
    label: { pt: "Falha local → retry da captura", en: "Local failure → capture retry" },
    tag: { pt: "Gateway já confirmado", en: "Gateway already confirmed" },
    desc: {
      pt: "Após o sucesso externo, a captura falha localmente. A Saga mantém o hold e retoma apenas capture; não chama o gateway novamente nem torna o saldo disponível.",
      en: "After external success, capture fails locally. The Saga keeps the hold and resumes only capture; it does not call the gateway again or make the funds available."
    }
  },
  {
    id: "not_processed",
    num: "08",
    label: { pt: "Lookup not_processed → secondary", en: "Lookup not_processed → secondary" },
    tag: { pt: "Failover confirmado", en: "Confirmed failover" },
    desc: {
      pt: "Após resultado incerto, o primary confirma not_processed. Só então a Saga persiste secondary como próximo provedor e envia uma nova tentativa com a chave desse provedor.",
      en: "After an uncertain outcome, primary confirms not_processed. Only then does the Saga persist secondary as the next provider and submit with that provider's key."
    }
  }
] as const;

export const GOLEDGER_REPO_URL = "https://github.com/saulo-duarte/distributed-wallet-ledger";
