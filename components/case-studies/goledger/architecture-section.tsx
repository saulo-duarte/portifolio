"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { FiActivity, FiBox, FiCheck, FiFileText, FiGitPullRequest, FiInfo, FiLayers, FiPlay, FiRefreshCw, FiShield, FiX } from "react-icons/fi";
import { SiJaeger, SiOpentelemetry, SiPostgresql, SiPrometheus } from "react-icons/si";
import { TbBrandAws, TbBrandGolang, TbDatabase, TbGitBranch, TbRoute2 } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { type NodeSimState, type ScenarioId, simulationScenarios } from "./types";
import { buildSimulationSteps, createIdleStates, type DiagramNodeId, type SimulationStep } from "./simulation";
import type { Locale } from "@/components/portfolio";

interface NodeDetailInfo {
  title: { pt: string; en: string };
  category: { pt: string; en: string };
  tech: string;
  role: { pt: string; en: string };
  behavior: { pt: string; en: string };
}

type Copy = { pt: string; en: string };

function nodeDetail(title: string, stage: "checkout" | "saga" | "projection", tech: string, role: Copy, behavior: Copy): NodeDetailInfo {
  const category = {
    checkout: { pt: "01 · Checkout durável", en: "01 · Durable checkout" },
    saga: { pt: "02 · Saga persistida", en: "02 · Persisted Saga" },
    projection: { pt: "03 · Projeção do saldo", en: "03 · Balance projection" },
  }[stage];
  return { title: { pt: title, en: title }, category, tech, role, behavior };
}

const nodeDetails: Record<DiagramNodeId, NodeDetailInfo> = {
  client: nodeDetail("HTTP client", "checkout", "REST / JSON",
    { pt: "Envia POST /payments/checkout com Idempotency-Key.", en: "Sends POST /payments/checkout with Idempotency-Key." },
    { pt: "GET /payments/{paymentID} acompanha o resultado assíncrono. Repetir a chave com payload conflitante é rejeitado.", en: "GET /payments/{paymentID} tracks the asynchronous outcome. Reusing the key with a conflicting payload is rejected." }),
  api: nodeDetail("Go API", "checkout", "Go · chi",
    { pt: "Valida a requisição e inicia a transação de checkout.", en: "Validates the request and starts the checkout transaction." },
    { pt: "Responde 202 Accepted após persistir hold, payment_attempts e PaymentRequested; o pagamento ainda não está completed.", en: "Returns 202 Accepted after persisting the hold, payment_attempts, and PaymentRequested; payment is not yet completed." }),
  hold: nodeDetail("Hold", "checkout", "PostgreSQL · row lock",
    { pt: "Reserva saldo disponível sob lock da carteira.", en: "Reserves available funds under a wallet lock." },
    { pt: "Recusa definitiva libera a reserva. Timeout incerto, retry de captura e requires_review mantêm o hold protegido.", en: "A definitive rejection releases the reservation. Uncertain timeouts, capture retries, and requires_review keep the hold protected." }),
  attempt: nodeDetail("payment_attempts", "checkout", "PostgreSQL · durable state",
    { pt: "Armazena etapa, provedor, request hash, retries e próximo horário.", en: "Stores the step, provider, request hash, retries, and next execution time." },
    { pt: "Workers reivindicam leases e retomam o passo persistido. Estado terminal completed só aparece no commit da captura.", en: "Workers claim leases and resume the persisted step. Terminal completed appears only in the capture commit." }),
  request_outbox: nodeDetail("PaymentRequested", "checkout", "Transactional Outbox",
    { pt: "Evento gravado junto com o hold e a tentativa.", en: "Event written together with the hold and attempt." },
    { pt: "O mesmo commit torna duráveis a reserva e o pedido de processamento; a publicação ocorre depois.", en: "The same commit makes the reservation and processing request durable; publication happens later." }),
  request_relay: nodeDetail("Outbox Relay · PaymentRequested", "checkout", "SKIP LOCKED · backoff",
    { pt: "Publica eventos de pagamento após o commit.", en: "Publishes payment events after commit." },
    { pt: "Claims antigos são recuperados, falhas recebem retry com backoff e mensagens podem ser entregues mais de uma vez.", en: "Stale claims are recovered, failures retry with backoff, and messages can be delivered more than once." }),
  request_sns: nodeDetail("SNS · PaymentRequested", "checkout", "Filtered subscription",
    { pt: "Encaminha o evento à fila da Saga.", en: "Routes the event to the Saga queue." },
    { pt: "A fila de pagamentos é independente da fila de projeção de saldo.", en: "The payment queue is separate from the balance projection queue." }),
  payment_queue: nodeDetail("SQS · payment-saga", "checkout", "Queue + DLQ",
    { pt: "Entrega payment_id ao worker para reivindicar a tentativa.", en: "Delivers payment_id so the worker can claim the attempt." },
    { pt: "SQS acelera o processamento. Tentativas devidas também são recuperadas diretamente no PostgreSQL.", en: "SQS speeds up processing. Due attempts are also recovered directly from PostgreSQL." }),
  worker: nodeDetail("PaymentSagaWorker", "saga", "SQS + PostgreSQL lease",
    { pt: "Carrega a tentativa persistida e executa antifraude, gateway ou captura.", en: "Loads the persisted attempt and runs antifraud, gateway, or capture." },
    { pt: "A retomada respeita current_step. Capture confirmado pendente não passa novamente pelo gateway.", en: "Resumption respects current_step. A pending capture after confirmed payment does not call the gateway again." }),
  sweeper: nodeDetail("PostgreSQL sweeper", "saga", "ClaimDue · lease",
    { pt: "Consulta tentativas com next_attempt_at vencido e lease disponível.", en: "Queries attempts with a due next_attempt_at and an available lease." },
    { pt: "Recupera trabalho mesmo com atraso ou falha na entrega SQS e retoma retries persistidos.", en: "Recovers work despite delayed or failed SQS delivery and resumes persisted retries." }),
  antifraud: nodeDetail("AntiFraudChecker · mock", "saga", "Risk evaluation",
    { pt: "Avalia o risco antes da cobrança.", en: "Evaluates risk before charging." },
    { pt: "Recusa definitiva marca failed e libera hold atomicamente. Erro de avaliação agenda retry.", en: "A definitive rejection atomically marks failed and releases the hold. An evaluation error schedules a retry." }),
  router: nodeDetail("GatewayRouter", "saga", "Priority: primary → secondary",
    { pt: "Expõe Primary, Get e Next à Saga.", en: "Exposes Primary, Get, and Next to the Saga." },
    { pt: "A Saga decide o failover: somente ErrGatewayNotSubmitted ou lookup not_processed permitem mudar de provedor.", en: "The Saga decides failover: only ErrGatewayNotSubmitted or lookup not_processed allow switching providers." }),
  primary_cb: nodeDetail("Circuit breaker · primary", "saga", "3 failures · 5s · 2 successes",
    { pt: "Protege ProcessPayment do gateway primary.", en: "Protects ProcessPayment on the primary gateway." },
    { pt: "Aberto retorna ErrGatewayNotSubmitted sem chamar o gateway. Após 5s passa a half_open; 2 sucessos fecham. Uma recusa sem erro não abre o circuito.", en: "Open returns ErrGatewayNotSubmitted without calling the gateway. After 5s it becomes half_open; 2 successes close it. A decline without an error does not open the circuit." }),
  primary_gateway: nodeDetail("Gateway primary · mock", "saga", "paymentID:primary",
    { pt: "Processa a cobrança com chave estável por provedor.", en: "Processes the charge with a stable provider-scoped key." },
    { pt: "Timeout pós-envio mantém gateway_unknown e o hold reservado. A Saga consulta este mesmo provedor antes de decidir o próximo passo.", en: "A post-submission timeout keeps gateway_unknown and the hold reserved. The Saga queries this same provider before deciding the next step." }),
  secondary_cb: nodeDetail("Circuit breaker · secondary", "saga", "Independent · 3 / 5s / 2",
    { pt: "Protege ProcessPayment do gateway secondary.", en: "Protects ProcessPayment on the secondary gateway." },
    { pt: "Estado e contadores independentes do breaker primary. Aberto também impede envio; não garante disponibilidade do standby.", en: "State and counters are independent of the primary breaker. Open also blocks submission; standby availability is not guaranteed." }),
  secondary_gateway: nodeDetail("Gateway secondary · mock", "saga", "paymentID:secondary",
    { pt: "Provedor seguinte na prioridade configurada.", en: "Next provider in configured priority order." },
    { pt: "Só recebe envio após a Saga persistir a troca segura. Usa chave própria, distinta da chave de primary.", en: "Receives a submission only after the Saga persists a safe switch. Uses its own key, distinct from primary's key." }),
  lookup: nodeDetail("LookupPayment", "saga", "Same provider · bypass breaker",
    { pt: "Reconcilia o resultado incerto usando a mesma chave do provedor.", en: "Reconciles an uncertain outcome using the same provider key." },
    { pt: "Consulta fora do breaker: succeeded captura; declined libera; not_processed permite failover; pending/unknown agenda retry. Sem reconciliação segura: requires_review com hold.", en: "Queries outside the breaker: succeeded captures; declined releases; not_processed allows failover; pending/unknown retries. Without safe reconciliation: requires_review with the hold." }),
  capture: nodeDetail("CaptureHold", "saga", "Persisted capture step",
    { pt: "Converte a cobrança confirmada em lançamento contábil.", en: "Converts the confirmed charge into a ledger posting." },
    { pt: "Falha local mantém o hold e retenta capture; não libera fundos já cobrados nem reenvia a cobrança ao gateway.", en: "Local failure keeps the hold and retries capture; it neither releases charged funds nor resubmits to the gateway." }),
  commit: nodeDetail("PostgreSQL · capture commit", "projection", "ACID · double entry",
    { pt: "Bloqueia carteira e hold e valida débitos e créditos balanceados.", en: "Locks the wallet and hold and validates balanced debits and credits." },
    { pt: "Postings, hold captured, tentativa completed e WalletBalanceUpdated são confirmados juntos; falha local sofre rollback.", en: "Postings, captured hold, completed attempt, and WalletBalanceUpdated commit together; a local failure rolls back." }),
  projection_outbox: nodeDetail("WalletBalanceUpdated", "projection", "Same PostgreSQL Outbox",
    { pt: "Evento de reprojeção gravado no commit contábil.", en: "Reprojection event written in the ledger commit." },
    { pt: "É a segunda passagem pelo mesmo pipeline Outbox/SNS, não uma segunda infraestrutura.", en: "This is the second pass through the same Outbox/SNS pipeline, not a second infrastructure." }),
  projection_relay: nodeDetail("Outbox Relay · WalletBalanceUpdated", "projection", "SKIP LOCKED · retries",
    { pt: "Publica o evento após a confirmação financeira.", en: "Publishes the event after financial confirmation." },
    { pt: "O pagamento já está completed; atraso na publicação não desfaz o commit do ledger.", en: "Payment is already completed; a publication delay does not undo the ledger commit." }),
  projection_sns: nodeDetail("SNS · WalletBalanceUpdated", "projection", "Filtered subscription",
    { pt: "Encaminha eventos de carteira à fila de projeção.", en: "Routes wallet events to the projection queue." },
    { pt: "Compartilha o tópico com PaymentRequested, usando outra assinatura filtrada.", en: "Shares the topic with PaymentRequested, using another filtered subscription." }),
  projection_queue: nodeDetail("SQS · wallet-balance-projections", "projection", "Queue + DLQ",
    { pt: "Entrega wallet_id ao consumidor de projeção.", en: "Delivers wallet_id to the projection consumer." },
    { pt: "A mensagem só é removida após a atualização da projeção; falhas permitem nova entrega.", en: "The message is deleted only after projection update; failures allow redelivery." }),
  projector: nodeDetail("WalletBalanceProjector", "projection", "Read current PostgreSQL balance",
    { pt: "Recalcula o saldo atual no ledger.", en: "Recalculates the current ledger balance." },
    { pt: "Reprojeta a carteira em vez de aplicar deltas repetidos do evento.", en: "Reprojects the wallet instead of applying repeated event deltas." }),
  dynamo: nodeDetail("DynamoDB · balance projection", "projection", "Conditional write",
    { pt: "Armazena a cópia de leitura do saldo.", en: "Stores the balance read-model copy." },
    { pt: "Pode haver defasagem. Projeção ausente ou indisponível usa fallback PostgreSQL; consistency=strong consulta o ledger diretamente.", en: "The projection can lag. Missing or unavailable projections fall back to PostgreSQL; consistency=strong queries the ledger directly." }),
};

export function ArchitectureSection({ locale }: { locale: Locale }) {
  const [simScenario, setSimScenario] = useState<ScenarioId>("success");
  const [modalSelectedScenario, setModalSelectedScenario] = useState<ScenarioId>("success");
  const [simRunning, setSimRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePopoverNode, setActivePopoverNode] = useState<string | null>(null);

  const [simulationStep, setSimulationStep] = useState<SimulationStep | null>(null);
  const simulationRun = useRef(0);
  const nodeStates = simulationStep?.nodes ?? createIdleStates();

  useEffect(() => () => { simulationRun.current += 1; }, []);

  const activeScenarioObj = simulationScenarios.find((s) => s.id === simScenario) || simulationScenarios[0];

  const handleOpenModal = () => {
    setModalSelectedScenario(simScenario);
    setIsModalOpen(true);
  };

  const handleConfirmAndRun = (idToRun?: ScenarioId) => {
    const target = idToRun || modalSelectedScenario;
    setSimScenario(target);
    setIsModalOpen(false);
    executeSimulationWithScenario(target);
  };

  const executeSimulationWithScenario = async (targetScenario: ScenarioId) => {
    if (simRunning) return;
    const run = ++simulationRun.current;
    setSimRunning(true);
    setSimulationStep(null);
    for (const step of buildSimulationSteps(targetScenario)) {
      if (simulationRun.current !== run) return;
      setSimulationStep(step);
      await new Promise((resolve) => setTimeout(resolve, 420));
    }
    if (simulationRun.current === run) setSimRunning(false);
  };

  const getNodeStateStyle = (state: NodeSimState) => {
    switch (state) {
      case "running":
        return "border-sky-500 bg-sky-50 ring-2 ring-sky-500/30 animate-pulse shadow-sm";
      case "success":
        return "border-emerald-500 bg-emerald-50/90 ring-1 ring-emerald-500/25";
      case "error":
        return "border-rose-500 bg-rose-50/90 ring-1 ring-rose-500/25";
      case "compensated":
        return "border-amber-500 bg-amber-50/90 ring-1 ring-amber-500/25";
      case "reserved":
        return "border-sky-500 bg-sky-50";
      case "blocked":
        return "border-amber-500 bg-amber-50";
      default:
        return "border-slate-300 bg-white hover:border-sky-500";
    }
  };

  const renderPopoverCard = (nodeKey: DiagramNodeId) => {
    const info = nodeDetails[nodeKey];
    if (!info) return null;

    return (
      <AnimatePresence>
        {activePopoverNode === nodeKey && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            id={`architecture-detail-${nodeKey}`}
            role="tooltip"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 bg-white rounded-xl border border-slate-200 p-4 shadow-xl z-30 pointer-events-none text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                {info.category[locale]}
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {info.tech}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-950 mb-1">
              {info.title[locale]}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              {info.role[locale]}
            </p>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-900 block mb-0.5">
                {locale === "pt" ? "Garantia / Comportamento:" : "Guarantee / Behavior:"}
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {info.behavior[locale]}
              </p>
            </div>

            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderFlowArrow = (horizontal = false, betweenGroups = false) => (
    <div aria-hidden="true" className="flex items-center justify-center text-base font-bold text-slate-600">
      {horizontal ? (
        <>
          <span className={betweenGroups ? "hidden lg:inline" : "hidden sm:inline"}>→</span>
          <span className={betweenGroups ? "lg:hidden" : "sm:hidden"}>↓</span>
        </>
      ) : "↓"}
    </div>
  );

  const renderDiagramNode = (
    nodeKey: DiagramNodeId,
    label: string,
    detail: string,
    Icon: IconType,
    accent = "text-sky-700",
  ) => (
    <div
      className="relative min-w-0"
      onMouseEnter={() => setActivePopoverNode(nodeKey)}
      onMouseLeave={() => setActivePopoverNode(null)}
    >
      {renderPopoverCard(nodeKey)}
      <button
        type="button"
        onFocus={() => setActivePopoverNode(nodeKey)}
        onBlur={() => setActivePopoverNode(null)}
        onClick={() => setActivePopoverNode(nodeKey)}
        onKeyDown={(event) => { if (event.key === "Escape") setActivePopoverNode(null); }}
        aria-describedby={activePopoverNode === nodeKey ? `architecture-detail-${nodeKey}` : undefined}
        data-node={nodeKey}
        data-state={nodeStates[nodeKey]}
        className={cn(
          "flex w-full items-start gap-2 border p-2.5 text-left transition-colors cursor-help focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600",
          getNodeStateStyle(nodeStates[nodeKey]),
        )}
      >
        <Icon className={cn("mt-0.5 shrink-0 text-sm", accent)} />
        <span className="min-w-0">
          <strong className="block text-xs font-bold leading-snug text-slate-950">{label}</strong>
          <span className="mt-1 block text-[11px] leading-snug text-slate-600">{detail}</span>
          {(nodeKey === "primary_cb" || nodeKey === "secondary_cb") && (
            <span className="mt-1 block font-mono text-[10px] text-slate-700">
              {nodeStates[nodeKey] === "blocked" || (nodeKey === "primary_cb" && simScenario === "circuit_breaker") ? "open · ErrGatewayNotSubmitted" : "closed"}
            </span>
          )}
        </span>
      </button>
    </div>
  );

  return (
    <section id="architecture" className="scroll-mt-28 space-y-12">
      {/* 1. Header: Entendendo a Arquitetura (2 Columns with Gopher Architect) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-sm font-medium text-slate-500 block">
            03 · {locale === "pt" ? "Entendendo a Arquitetura" : "Understanding the Architecture"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            {locale === "pt" ? (
              <>
                Fluxo transacional e
                <br />
                garantias de consistência
                <br />
                <span className="text-sky-600">ponta a ponta</span>
              </>
            ) : (
              <>
                Transactional flow and
                <br />
                consistency guarantees
                <br />
                <span className="text-sky-600">end-to-end</span>
              </>
            )}
          </h2>
          <p className="pt-1 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {locale === "pt"
              ? "Checkout durável, Saga assíncrona com reconciliação por provedor e captura atômica no ledger. A Outbox conecta processamento e projeção de saldo."
              : "Durable checkout, asynchronous Saga with provider-scoped reconciliation, and atomic ledger capture. The Outbox connects processing and balance projection."}
          </p>
        </div>

        {/* Right Illustration: Gopher Architect */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/3]">
            <Image
              src="/images/goledger-architecture-gopher.png"
              alt={
                locale === "pt"
                  ? "Ilustração do Gopher arquiteto conectando servidores e microsserviços"
                  : "Illustration of Gopher architect orchestrating servers and microservices"
              }
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2. Dynamic Architecture Simulator Box */}
      <div id="architecture-simulator-block" className="border border-slate-300 bg-white">
        {/* Frame Top Bar with Stronger Grey Contrast */}
        <div className="border-b border-slate-300 bg-slate-100 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-900">
              {locale === "pt" ? "Cenário" : "Scenario"}: {activeScenarioObj.label[locale]}
            </span>
            <span
              className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded border font-medium",
                activeScenarioObj.id === "success" && "bg-emerald-50 text-emerald-800 border-emerald-300",
                (activeScenarioObj.id === "antifraud_block" || activeScenarioObj.id === "gateway_declined") && "bg-amber-50 text-amber-800 border-amber-300",
                activeScenarioObj.id === "timeout" && "bg-sky-50 text-sky-800 border-sky-300",
                activeScenarioObj.id === "circuit_breaker" && "bg-rose-50 text-rose-800 border-rose-300",
                (activeScenarioObj.id === "reconciled" || activeScenarioObj.id === "capture_retry" || activeScenarioObj.id === "not_processed") && "bg-sky-50 text-sky-800 border-sky-300"
              )}
            >
              {activeScenarioObj.tag[locale]}
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            disabled={simRunning}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs active:scale-98 disabled:opacity-60 transition-all cursor-pointer"
          >
            {simRunning ? (
              <><FiRefreshCw className="animate-spin text-xs" /> {locale === "pt" ? "Executando..." : "Running..."}</>
            ) : (
              <><FiPlay className="text-xs" /> {locale === "pt" ? "Executar simulação" : "Run simulation"}</>
            )}
          </button>
        </div>

        {/* The same PostgreSQL, Outbox relay and SNS topic appear in two event passes. */}
        <div className="space-y-6 bg-white p-4 sm:p-6" aria-label={locale === "pt" ? "Diagrama da arquitetura do GoLedger" : "GoLedger architecture diagram"}>
          <div className="border border-sky-300 bg-sky-50/40 p-3 text-xs leading-relaxed text-slate-700" role="status" aria-live="polite" aria-atomic="true">
            <p className="font-semibold text-slate-950">
              {simulationStep?.phase[locale] ?? (locale === "pt" ? "Escolha um cenário para acompanhar cada etapa do pagamento." : "Choose a scenario to follow each payment step.")}
            </p>
            {simulationStep && (
              <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]">
                <span>payment: {simulationStep.paymentStatus}</span>
                <span>hold: {simulationStep.holdStatus}</span>
                <span>{locale === "pt" ? "provedor" : "provider"}: {simulationStep.selectedProvider ?? "—"}</span>
              </p>
            )}
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-sky-900">
                01 · {locale === "pt" ? "Checkout durável → início da Saga" : "Durable checkout → start the Saga"}
              </span>
              <span className="text-[11px] text-slate-600">PaymentRequested · 202 Accepted</span>
            </div>
            <div className="grid items-stretch gap-2.5 lg:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1.3fr)_1rem_minmax(0,0.8fr)_1rem_minmax(0,0.8fr)_1rem_minmax(0,1fr)]">
              <div className="flex flex-col justify-center gap-2">
                {renderDiagramNode("client", locale === "pt" ? "Cliente HTTP" : "HTTP client", "POST /payments/checkout", FiBox)}
                {renderFlowArrow()}
                {renderDiagramNode("api", "Go API", "Idempotency-Key · 202", TbBrandGolang)}
              </div>
              {renderFlowArrow(true, true)}
              <div className="min-w-0 space-y-2 border border-slate-300 p-3">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-sky-900"><SiPostgresql /> PostgreSQL · ACID</span>
                {renderDiagramNode("hold", "Hold", locale === "pt" ? "Saldo reservado" : "Reserved funds", SiPostgresql)}
                {renderDiagramNode("attempt", "payment_attempts", locale === "pt" ? "Etapa, provedor e retries" : "Step, provider, retries", TbGitBranch)}
                {renderDiagramNode("request_outbox", "PaymentRequested", "outbox_events", FiLayers)}
                <p className="text-[11px] leading-relaxed text-slate-600">{locale === "pt" ? "Os três registros no mesmo commit." : "All three records in one commit."}</p>
              </div>
              {renderFlowArrow(true, true)}
              <div className="flex items-center">{renderDiagramNode("request_relay", "Outbox Relay", "PaymentRequested", FiGitPullRequest)}</div>
              {renderFlowArrow(true, true)}
              <div className="flex items-center">{renderDiagramNode("request_sns", "SNS", locale === "pt" ? "Assinatura filtrada" : "Filtered subscription", TbBrandAws, "text-amber-700")}</div>
              {renderFlowArrow(true, true)}
              <div className="flex items-center">{renderDiagramNode("payment_queue", "SQS · payment-saga", "PaymentRequested · DLQ", FiLayers, "text-amber-700")}</div>
            </div>
          </div>

          <div className="relative px-3 pb-4 text-center text-[11px] text-slate-700">
            <span>{locale === "pt" ? "Fila de pagamentos → PaymentSagaWorker" : "Payment queue → PaymentSagaWorker"}</span>
            <div aria-hidden="true" className="h-3 border-r border-b border-slate-400" />
            <span aria-hidden="true" className="absolute bottom-0 left-1.5 text-base font-bold text-slate-600">↓</span>
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-sky-900">02 · {locale === "pt" ? "Saga persistida & provedores mock" : "Persisted Saga & mock providers"}</span>
              <span className="text-[11px] text-slate-600">{locale === "pt" ? "A Saga decide o failover" : "The Saga decides failover"}</span>
            </div>
            <div className="grid items-stretch gap-2.5 lg:grid-cols-[minmax(0,1fr)_1rem_minmax(0,0.8fr)_1rem_minmax(0,1.8fr)_1rem_minmax(0,0.9fr)]">
              <div className="flex flex-col justify-center gap-3">
                {renderDiagramNode("worker", "PaymentSagaWorker", locale === "pt" ? "Lease · retoma current_step" : "Lease · resumes current_step", TbBrandGolang)}
                <div className="border-t border-dashed border-sky-400 pt-3">
                  {renderDiagramNode("sweeper", "PostgreSQL sweeper", "ClaimDue · next_attempt_at", FiRefreshCw)}
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{locale === "pt" ? "Retomada alternativa ao SQS, incluindo retries." : "Alternative to SQS for resumption, including retries."}</p>
                </div>
              </div>
              {renderFlowArrow(true, true)}
              <div className="flex items-center">{renderDiagramNode("antifraud", locale === "pt" ? "Antifraude" : "Antifraud", "AntiFraudChecker · mock", FiShield, "text-amber-700")}</div>
              {renderFlowArrow(true, true)}
              <div className="min-w-0 space-y-3 border border-slate-300 p-3">
                {renderDiagramNode("router", "GatewayRouter", "Primary · Get · Next", TbRoute2)}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    {renderDiagramNode("primary_cb", "Breaker primary", locale === "pt" ? "3 falhas · 5s · 2 sucessos" : "3 failures · 5s · 2 successes", FiShield)}
                    {renderFlowArrow()}
                    {renderDiagramNode("primary_gateway", "Gateway primary", "paymentID:primary · mock", TbRoute2)}
                  </div>
                  <div className="space-y-2">
                    {renderDiagramNode("secondary_cb", "Breaker secondary", locale === "pt" ? "Estado independente · 3 / 5s / 2" : "Independent state · 3 / 5s / 2", FiShield)}
                    {renderFlowArrow()}
                    {renderDiagramNode("secondary_gateway", "Gateway secondary", "paymentID:secondary · mock", TbRoute2)}
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {locale === "pt" ? "Troca persistida somente após ErrGatewayNotSubmitted ou lookup not_processed." : "Persisted switch only after ErrGatewayNotSubmitted or lookup not_processed."}
                </p>
                <div className="border-t border-dashed border-sky-400 pt-3">
                  {renderDiagramNode("lookup", "LookupPayment", locale === "pt" ? "Mesmo provedor · fora do breaker" : "Same provider · bypass breaker", FiRefreshCw)}
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                    {locale === "pt" ? "Gateway incerto → consulta pela mesma chave; succeeded → capture; declined → libera hold; unknown → retry ou requires_review." : "Uncertain gateway → same-key lookup; succeeded → capture; declined → release hold; unknown → retry or requires_review."}
                  </p>
                </div>
              </div>
              {renderFlowArrow(true, true)}
              <div className="flex flex-col justify-center gap-3">
                {renderDiagramNode("capture", "CaptureHold", locale === "pt" ? "Somente com sucesso confirmado" : "Only with confirmed success", FiCheck, "text-emerald-700")}
                <p className="border-l-2 border-dashed border-sky-400 pl-2.5 text-[11px] leading-relaxed text-slate-600">
                  {locale === "pt" ? "Falha local → retry apenas de capture, mantendo hold e sem nova cobrança." : "Local failure → retry only capture, keeping the hold and without a new charge."}
                </p>
              </div>
            </div>
          </div>

          <div className="relative px-3 pb-4 text-center text-[11px] text-slate-700">
            <span>{locale === "pt" ? "CaptureHold → commit PostgreSQL" : "CaptureHold → PostgreSQL commit"}</span>
            <div aria-hidden="true" className="h-3 border-r border-b border-slate-400" />
            <span aria-hidden="true" className="absolute bottom-0 left-1.5 text-base font-bold text-slate-600">↓</span>
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-sky-900">03 · {locale === "pt" ? "Captura atômica → projeção do saldo" : "Atomic capture → balance projection"}</span>
              <span className="text-[11px] text-slate-600">WalletBalanceUpdated · CQRS</span>
            </div>
            <div className="grid items-stretch gap-2.5 lg:grid-cols-[minmax(0,1.3fr)_1rem_minmax(0,0.8fr)_1rem_minmax(0,0.8fr)_1rem_minmax(0,1.2fr)_1rem_minmax(0,0.9fr)]">
              <div className="min-w-0 space-y-2 border border-slate-300 p-3">
                {renderDiagramNode("commit", "PostgreSQL · ACID", locale === "pt" ? "Postings + hold captured + completed" : "Postings + captured hold + completed", SiPostgresql)}
                {renderDiagramNode("projection_outbox", "WalletBalanceUpdated", locale === "pt" ? "Evento no mesmo commit" : "Event in the same commit", FiLayers)}
              </div>
              {renderFlowArrow(true, true)}
              <div className="flex items-center">{renderDiagramNode("projection_relay", "Outbox Relay", "WalletBalanceUpdated", FiGitPullRequest)}</div>
              {renderFlowArrow(true, true)}
              <div className="flex items-center">{renderDiagramNode("projection_sns", "SNS", locale === "pt" ? "Assinatura de projeção" : "Projection subscription", TbBrandAws, "text-amber-700")}</div>
              {renderFlowArrow(true, true)}
              <div className="flex flex-col justify-center gap-2">
                {renderDiagramNode("projection_queue", "SQS · projections", locale === "pt" ? "Fila separada · DLQ" : "Separate queue · DLQ", FiLayers, "text-amber-700")}
                {renderFlowArrow()}
                {renderDiagramNode("projector", "BalanceProjector", locale === "pt" ? "Recalcula no ledger" : "Recalculates from ledger", TbBrandGolang)}
              </div>
              {renderFlowArrow(true, true)}
              <div className="flex items-center">{renderDiagramNode("dynamo", "DynamoDB", locale === "pt" ? "Projeção assíncrona" : "Asynchronous projection", TbDatabase)}</div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
              {locale === "pt" ? "As faixas 01 e 03 reutilizam o mesmo PostgreSQL, Outbox Relay e tópico SNS; as filas SQS são distintas. Completed é confirmado antes da projeção. Leituras com consistency=strong e fallback consultam o ledger." : "Lanes 01 and 03 reuse the same PostgreSQL, Outbox Relay, and SNS topic; SQS queues are distinct. Completed is committed before projection. Reads with consistency=strong and fallback query the ledger."}
            </p>
          </div>

          {/* Horizontal observability layer, shared across the application. */}
          <div className="mt-5 border-t border-dashed border-slate-400 pt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-900">
                <FiActivity className="text-sky-700" />
                {locale === "pt" ? "Observabilidade · API, Saga e workers" : "Observability · API, Saga, and workers"}
              </span>
              <span className="text-[11px] text-slate-600">
                {locale === "pt" ? "Tracejado: caminhos auxiliares e telemetria" : "Dashed: auxiliary paths and telemetry"}
              </span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "OpenTelemetry", detail: locale === "pt" ? "Instrumentação de spans · OTLP" : "Span instrumentation · OTLP", Icon: SiOpentelemetry },
                { label: "Jaeger", detail: locale === "pt" ? "Consulta e visualização de traces" : "Trace search and visualization", Icon: SiJaeger },
                { label: "Prometheus", detail: locale === "pt" ? "HTTP, Saga, Outbox e circuit breaker" : "HTTP, Saga, Outbox, and circuit breaker", Icon: SiPrometheus },
                { label: "Logs JSON · slog", detail: locale === "pt" ? "Correlação por trace_id e span_id" : "Correlation via trace_id and span_id", Icon: FiFileText },
              ].map(({ label, detail, Icon }) => (
                <div key={label} className="min-w-0 border border-slate-300 bg-white p-3">
                  <div className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 shrink-0 text-sm text-sky-700" />
                    <div className="min-w-0">
                      <strong className="block text-xs font-bold text-slate-950">{label}</strong>
                      <span className="mt-1 block text-[11px] leading-relaxed text-slate-600">{detail}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informative Note */}
        <div className="border-t border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
          <FiInfo className="text-sky-600 text-sm flex-shrink-0 mt-0.5" />
          <p className="text-slate-600 text-xs">
            {locale === "pt"
              ? "Simulação ilustrativa do fluxo persistido: tempos de animação não são medições. Os cenários de timeout e captura preservam o hold; failover exige confirmação de não envio ou not_processed. Passe o cursor, toque ou foque as caixas para ver detalhes."
              : "Illustrative simulation of the persisted workflow: animation timings are not measurements. Timeout and capture-retry scenarios preserve the hold; failover requires confirmed non-submission or not_processed. Hover, tap, or focus cards for details."}
          </p>
        </div>
      </div>

      {/* 3. Architectural decisions and end-to-end consistency guarantees */}
      <div className="pt-2">
        <div className="mb-6 max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            {locale === "pt" ? "Decisões ao longo do fluxo" : "Decisions along the transaction flow"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {locale === "pt"
              ? "O GoLedger mantém o ledger financeiro em um monólito modular: o PostgreSQL é a fonte da verdade, enquanto a Saga persistida e o pipeline assíncrono tratam falhas e atualizam as projeções."
              : "GoLedger keeps the financial ledger in a modular monolith: PostgreSQL is the source of truth, while the persisted Saga and asynchronous pipeline handle failures and update projections."}
          </p>
        </div>

        <div className="border-y border-slate-300 divide-y divide-slate-300">
          <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="font-mono text-2xl font-extrabold tracking-tight text-sky-700">01</span>
            <div>
              <h4 className="text-lg font-bold text-slate-950">
                {locale === "pt" ? "Checkout durável e Saga assíncrona" : "Durable checkout and asynchronous Saga"}
              </h4>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                {locale === "pt"
                  ? "No checkout, o GoLedger valida saldo e idempotência e grava o hold, a tentativa de pagamento e o evento PaymentRequested em uma única transação PostgreSQL. A API responde 202 Accepted; workers acionados por SQS retomam a tentativa pelo passo persistido, enquanto um sweeper consulta tentativas vencidas para recuperar mensagens atrasadas ou indisponibilidade."
                  : "At checkout, GoLedger validates the balance and idempotency key, then writes the hold, payment attempt, and PaymentRequested event in one PostgreSQL transaction. The API returns 202 Accepted; SQS-triggered workers resume from the persisted step, while a sweeper scans due attempts to recover delayed messages or outages."}
              </p>
            </div>
          </article>

          <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="font-mono text-2xl font-extrabold tracking-tight text-sky-700">02</span>
            <div>
              <h4 className="text-lg font-bold text-slate-950">
                {locale === "pt" ? "Falhas externas sem cobrança duplicada" : "External failures without duplicate charges"}
              </h4>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                {locale === "pt"
                  ? "A tentativa registra provedor, chave estável, etapa atual, retries e próximo horário de execução. O standby só é usado quando há confirmação de que o primário não processou a cobrança. Se o timeout deixa o resultado incerto, a Saga consulta o mesmo provedor com a mesma chave; após esgotar retries sem reconciliação, marca requires_review e mantém o hold reservado."
                  : "Each attempt records its provider, stable key, current step, retries, and next execution time. The standby is used only when the primary is confirmed not to have processed the charge. If a timeout leaves the outcome uncertain, the Saga queries the same provider with the same key; after retries are exhausted without reconciliation, it marks requires_review and keeps the hold reserved."}
              </p>
            </div>
          </article>

          <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="font-mono text-2xl font-extrabold tracking-tight text-sky-700">03</span>
            <div>
              <h4 className="text-lg font-bold text-slate-950">
                {locale === "pt" ? "Captura contábil atômica" : "Atomic ledger capture"}
              </h4>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                {locale === "pt"
                  ? "Depois da confirmação do gateway, a captura bloqueia carteira e hold, valida o estado da reserva e grava a transação de partidas dobradas: débito na carteira, crédito na conta de liquidação e soma zero. A captura do hold, os lançamentos, a conclusão da tentativa e o evento de atualização do saldo são confirmados juntos; em caso de falha, nenhum deles fica parcialmente aplicado."
                  : "After gateway confirmation, capture locks the wallet and hold, validates the reservation state, and writes the double-entry transaction: a wallet debit, a settlement-account credit, and a zero sum. Hold capture, postings, attempt completion, and the balance-update event commit together; on failure, none is partially applied."}
              </p>
            </div>
          </article>

          <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="font-mono text-2xl font-extrabold tracking-tight text-sky-700">04</span>
            <div>
              <h4 className="text-lg font-bold text-slate-950">
                {locale === "pt" ? "Outbox, relay e recuperação" : "Outbox, relay, and recovery"}
              </h4>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                {locale === "pt"
                  ? "O relay reivindica eventos pendentes com FOR UPDATE SKIP LOCKED, publica no SNS e registra sucesso ou falha com backoff. Claims antigos são recuperados para que uma queda do worker não esconda o evento permanentemente. O SNS distribui para filas SQS independentes de projeção de saldo e processamento da Saga; a entrega acelera o trabalho, mas o estado durável continua no PostgreSQL."
                  : "The relay claims pending events with FOR UPDATE SKIP LOCKED, publishes them to SNS, and records success or failure with backoff. Stale claims are recovered so a worker crash cannot hide an event permanently. SNS fans out to separate SQS queues for balance projection and Saga processing; delivery speeds up work, while durable state remains in PostgreSQL."}
              </p>
            </div>
          </article>

          <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="font-mono text-2xl font-extrabold tracking-tight text-sky-700">05</span>
            <div>
              <h4 className="text-lg font-bold text-slate-950">CQRS &amp; {locale === "pt" ? "consistência de leitura" : "read consistency"}</h4>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                {locale === "pt"
                  ? "O evento SQS carrega a carteira a reprojetar; o consumidor consulta o saldo atual no ledger, em vez de aplicar um delta possivelmente repetido. A gravação no DynamoDB é condicional e a projeção é assíncrona, então pode haver defasagem. Se ela estiver ausente ou indisponível, a leitura recorre ao PostgreSQL; o cliente também pode pedir consistência forte explicitamente."
                  : "The SQS event identifies the wallet to reproject; the consumer reads the current ledger balance instead of applying a potentially repeated delta. DynamoDB writes are conditional and the projection is asynchronous, so it can lag. If the projection is missing or unavailable, reads fall back to PostgreSQL; clients can also explicitly request strong consistency."}
              </p>
            </div>
          </article>
        </div>
      </div>

      {/* Scenario Selection & Execution Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-950">
                    {locale === "pt" ? "Escolha o Cenário de Simulação" : "Select Simulation Scenario"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {locale === "pt"
                      ? "Selecione um cenário abaixo e clique em 'Confirmar e Executar' para iniciar o fluxo."
                      : "Select a scenario below and click 'Confirm & Run' to initiate the flow."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                  title="Fechar"
                >
                  <FiX className="text-base" />
                </button>
              </div>

              {/* Modal Scenarios List */}
              <div className="p-6 space-y-2.5 max-h-[60vh] overflow-y-auto">
                {simulationScenarios.map((scen) => {
                  const isSelected = modalSelectedScenario === scen.id;
                  return (
                    <button
                      key={scen.id}
                      type="button"
                      onClick={() => setModalSelectedScenario(scen.id)}
                      className={cn(
                        "w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer group shadow-2xs",
                        isSelected
                          ? "border-sky-600 bg-sky-50/50 ring-2 ring-sky-600/10"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
                      )}
                    >
                      <div className="flex items-start gap-3.5">
                        <span className={cn(
                          "font-mono text-xs font-bold px-2 py-1 rounded-md border flex-shrink-0 mt-0.5",
                          isSelected ? "bg-sky-600 text-white border-sky-600" : "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                          {scen.num}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-950 group-hover:text-sky-700 transition-colors">
                              {scen.label[locale]}
                            </h4>
                            <span
                              className={cn(
                                "text-[10px] font-mono font-medium px-2 py-0.5 rounded border",
                                scen.id === "success" && "bg-emerald-50 text-emerald-700 border-emerald-200/80",
                                (scen.id === "antifraud_block" || scen.id === "gateway_declined") && "bg-amber-50 text-amber-700 border-amber-200/80",
                                scen.id === "timeout" && "bg-sky-50 text-sky-700 border-sky-200/80",
                                scen.id === "circuit_breaker" && "bg-rose-50 text-rose-700 border-rose-200/80",
                                (scen.id === "reconciled" || scen.id === "capture_retry" || scen.id === "not_processed") && "bg-sky-50 text-sky-700 border-sky-200/80"
                              )}
                            >
                              {scen.tag[locale]}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {scen.desc[locale]}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-sky-600 text-white grid place-items-center text-xs">
                            <FiCheck />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-slate-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Modal Footer with Confirm Button */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {locale === "pt" ? "Cancelar" : "Cancel"}
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmAndRun()}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-98 transition-all cursor-pointer"
                >
                  <FiPlay className="text-sm" />
                  <span>{locale === "pt" ? "Confirmar e Executar" : "Confirm & Run"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
