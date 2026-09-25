import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiDatabase, FiGitPullRequest, FiInfo, FiLayers, FiPlay, FiRefreshCw, FiShield, FiX } from "react-icons/fi";
import { SiPostgresql } from "react-icons/si";
import { TbBrandAws, TbBrandGolang, TbGitBranch, TbRoute2 } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { type NodeSimState, type ScenarioId, simulationScenarios } from "./types";
import type { Locale } from "@/components/portfolio";

interface NodeDetailInfo {
  title: { pt: string; en: string };
  category: { pt: string; en: string };
  tech: string;
  role: { pt: string; en: string };
  behavior: { pt: string; en: string };
}

const nodeDetails: Record<string, NodeDetailInfo> = {
  client: {
    title: { pt: "HTTP Client & Idempotency", en: "HTTP Client & Idempotency" },
    category: { pt: "Entrada · Write Path", en: "Input · Write Path" },
    tech: "REST / JSON · HTTP/2",
    role: {
      pt: "Originador da requisição transacional de checkout ou pagamento.",
      en: "Originator of the transactional checkout or payment request."
    },
    behavior: {
      pt: "Injeta o cabeçalho 'Idempotency-Key' único para garantir que retries de rede nunca gerem cobranças duplicadas ou transações fantasmas.",
      en: "Injects a unique 'Idempotency-Key' header ensuring network retries never produce duplicate charges or phantom postings."
    }
  },
  api: {
    title: { pt: "Go HTTP API Gateway", en: "Go HTTP API Gateway" },
    category: { pt: "Roteamento & Validação", en: "Routing & Validation" },
    tech: "Go 1.23 · Chi Router",
    role: {
      pt: "Camada de entrada com validação estrita e middlewares de observabilidade.",
      en: "Edge layer with strict validation and observability middlewares."
    },
    behavior: {
      pt: "Valida schemas com validator/v10, faz lock de idempotência atômico e propaga trace_id OpenTelemetry para rastreamento ponta a ponta.",
      en: "Validates schemas, acquires atomic idempotency locks, and injects OpenTelemetry trace_id for end-to-end distributed tracing."
    }
  },
  saga: {
    title: { pt: "Payment Saga Orchestrator", en: "Payment Saga Orchestrator" },
    category: { pt: "Orquestração Transacional", en: "Transactional Orchestration" },
    tech: "Go State Machine · Saga Pattern",
    role: {
      pt: "Máquina de estados que orquestra reservas, antifraude, cobranças e compensações.",
      en: "State machine orchestrating holds, fraud evaluation, charging, and compensating rollbacks."
    },
    behavior: {
      pt: "Garante que falhas ou recusas no gateway acionem compensações seguras (ReleaseHold) sem deixar saldos inconsistentes.",
      en: "Guarantees that downstream failures trigger compensating actions (ReleaseHold) maintaining ledger integrity."
    }
  },
  breaker: {
    title: { pt: "Circuit Breaker Gateway Guard", en: "Circuit Breaker Gateway Guard" },
    category: { pt: "Resiliência & Fail-Fast", en: "Resilience & Fail-Fast" },
    tech: "Sonyflake / Go Breaker · Sub-ms",
    role: {
      pt: "Protege o ledger contra degradação de PSPs e serviços de terceiros.",
      en: "Protects the ledger against downstream PSP and third-party degradation."
    },
    behavior: {
      pt: "Após 3 falhas consecutivas, abre o circuito (OPEN) e responde instantaneamente com 503 em 0.1ms, poupando goroutines e conexões.",
      en: "After 3 consecutive failures, trips to OPEN state responding in 0.1ms, conserving memory and network pools."
    }
  },
  postgres: {
    title: { pt: "PostgreSQL Contábil (CP)", en: "PostgreSQL Ledger (CP)" },
    category: { pt: "Fonte da Verdade · ACID", en: "Source of Truth · ACID" },
    tech: "PostgreSQL 16 · Partidas Dobradas",
    role: {
      pt: "Armazenamento imutável e transacional de todas as contas e eventos contábeis.",
      en: "Immutable transactional storage of all accounts and financial postings."
    },
    behavior: {
      pt: "Executa débitos e créditos balanceados (∑ = 0) com locks FOR UPDATE e grava eventos na tabela Outbox no mesmo commit atômico.",
      en: "Executes balanced double-entry entries (∑ = 0) with row-level locks, atomically persisting domain events to the Outbox table."
    }
  },
  outbox: {
    title: { pt: "Outbox Relay Worker", en: "Outbox Relay Worker" },
    category: { pt: "Garantia de Entrega", en: "Delivery Guarantee" },
    tech: "Go Worker · Transactional Outbox",
    role: {
      pt: "Publicador assíncrono garantido de eventos de domínio contábeis.",
      en: "Guaranteed asynchronous publisher of domain accounting events."
    },
    behavior: {
      pt: "Lê eventos pendentes no PostgreSQL via FOR UPDATE SKIP LOCKED e despacha para o broker com garantia At-Least-Once.",
      en: "Reads pending outbox records via FOR UPDATE SKIP LOCKED and dispatches to the broker with At-Least-Once guarantees."
    }
  },
  sns: {
    title: { pt: "AWS SNS (Topic Fanout)", en: "AWS SNS (Topic Fanout)" },
    category: { pt: "Broker de Mensageria", en: "Message Broker" },
    tech: "AWS SNS · Multi-AZ",
    role: {
      pt: "Distribuição assíncrona dos eventos contábeis para múltiplos assinantes.",
      en: "Asynchronous broadcast of ledger events across multiple decoupled subscribers."
    },
    behavior: {
      pt: "Recebe o evento 'wallet.payment.captured' e faz fanout instantâneo para filas SQS de projeção e microsserviços.",
      en: "Receives 'wallet.payment.captured' and fans out immediately to projection SQS queues and downstream microservices."
    }
  },
  sqs: {
    title: { pt: "AWS SQS (Queue + DLQ)", en: "AWS SQS (Queue + DLQ)" },
    category: { pt: "Fila de Buffer & Resiliência", en: "Buffer Queue & Resilience" },
    tech: "AWS SQS · DLQ Redrive",
    role: {
      pt: "Bufferização e desacoplamento do pipeline de leitura CQRS.",
      en: "Buffering and decoupling of the read-side CQRS projection pipeline."
    },
    behavior: {
      pt: "Controla vazão de consumo, executa retries exponenciais e isola mensagens venenosas na Dead Letter Queue (DLQ).",
      en: "Manages throughput rates, performs exponential retries, and quarantines poison pills into the Dead Letter Queue."
    }
  },
  dynamo: {
    title: { pt: "DynamoDB (Projeção CQRS · AP)", en: "DynamoDB (CQRS Projection · AP)" },
    category: { pt: "Read Model · O(1)", en: "Read Model · O(1)" },
    tech: "Amazon DynamoDB · Sub-ms",
    role: {
      pt: "Armazenamento otimizado para consultas de saldo e extratos em altíssima escala.",
      en: "Optimized read model for ultra-low latency balance and statement queries."
    },
    behavior: {
      pt: "Atualiza projeções com escrita condicional baseada em versionamento para evitar leituras inconsistentes fora de ordem.",
      en: "Updates projections with conditional versioning preventing out-of-order mutations, delivering sub-millisecond lookups."
    }
  }
};

export function SimulatorSection({ locale }: { locale: Locale }) {
  const [simScenario, setSimScenario] = useState<ScenarioId>("success");
  const [modalSelectedScenario, setModalSelectedScenario] = useState<ScenarioId>("success");
  const [simRunning, setSimRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePopoverNode, setActivePopoverNode] = useState<string | null>(null);

  const [nodeStates, setNodeStates] = useState<Record<string, NodeSimState>>({
    client: "idle",
    api: "idle",
    saga: "idle",
    breaker: "idle",
    postgres: "idle",
    outbox: "idle",
    sns: "idle",
    sqs: "idle",
    dynamo: "idle",
  });

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
    setSimRunning(true);
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const reset: Record<string, NodeSimState> = {
      client: "idle",
      api: "idle",
      saga: "idle",
      breaker: "idle",
      postgres: "idle",
      outbox: "idle",
      sns: "idle",
      sqs: "idle",
      dynamo: "idle",
    };
    setNodeStates(reset);

    // Step 1: HTTP Client
    setNodeStates((s) => ({ ...s, client: "running" }));
    await delay(450);

    // Step 2: Go HTTP API (Chi Router)
    setNodeStates((s) => ({ ...s, client: "success", api: "running" }));
    await delay(450);

    // Step 3: Payment Saga Orchestrator
    setNodeStates((s) => ({ ...s, api: "success", saga: "running" }));
    await delay(450);

    // Step 4: PostgreSQL Hold
    setNodeStates((s) => ({ ...s, postgres: "running" }));
    await delay(500);

    if (targetScenario === "antifraud_block") {
      setNodeStates((s) => ({ ...s, saga: "error" }));
      await delay(550);
      setNodeStates((s) => ({ ...s, postgres: "compensated", saga: "compensated" }));
      setSimRunning(false);
      return;
    }

    if (targetScenario === "circuit_breaker") {
      setNodeStates((s) => ({ ...s, breaker: "running" }));
      await delay(400);
      setNodeStates((s) => ({ ...s, breaker: "error", saga: "error" }));
      await delay(550);
      setNodeStates((s) => ({ ...s, postgres: "compensated", saga: "compensated" }));
      setSimRunning(false);
      return;
    }

    if (targetScenario === "gateway_declined") {
      setNodeStates((s) => ({ ...s, breaker: "running" }));
      await delay(450);
      setNodeStates((s) => ({ ...s, breaker: "error", saga: "error" }));
      await delay(550);
      setNodeStates((s) => ({ ...s, postgres: "compensated", saga: "compensated" }));
      setSimRunning(false);
      return;
    }

    if (targetScenario === "timeout") {
      setNodeStates((s) => ({ ...s, breaker: "running" }));
      await delay(550);
      setNodeStates((s) => ({ ...s, breaker: "error", saga: "error" }));
      await delay(450);
      setNodeStates((s) => ({ ...s, postgres: "compensated", saga: "compensated" }));
      setSimRunning(false);
      return;
    }

    // Step 5: Success Flow - PostgreSQL Atomic Commit (Postings + Outbox)
    setNodeStates((s) => ({ ...s, saga: "success", breaker: "success", postgres: "running" }));
    await delay(600);

    // Step 6: Outbox Relay Worker
    setNodeStates((s) => ({ ...s, postgres: "success", outbox: "running" }));
    await delay(500);

    // Step 7: AWS SNS Topic
    setNodeStates((s) => ({ ...s, outbox: "success", sns: "running" }));
    await delay(450);

    // Step 8: AWS SQS Queue & DLQ
    setNodeStates((s) => ({ ...s, sns: "success", sqs: "running" }));
    await delay(450);

    // Step 9: DynamoDB Read Projection
    setNodeStates((s) => ({ ...s, sqs: "success", dynamo: "running" }));
    await delay(500);

    setNodeStates((s) => ({ ...s, dynamo: "success" }));
    setSimRunning(false);
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
      default:
        return "border-slate-200 bg-white hover:border-slate-300";
    }
  };

  const renderPopoverCard = (nodeKey: string) => {
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
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-72 sm:w-80 p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-xl z-50 pointer-events-none text-left"
          >
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <strong className="text-xs font-bold text-slate-950">
                {info.title[locale]}
              </strong>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                {info.tech}
              </span>
            </div>

            <div className="pt-2 space-y-1.5 text-xs text-slate-600">
              <p className="font-medium text-slate-800">
                {info.role[locale]}
              </p>
              <p className="text-[11.5px] leading-relaxed text-slate-600">
                {info.behavior[locale]}
              </p>
            </div>

            {/* Popover bottom pointer arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <section id="simulator" className="scroll-mt-28">
      {/* Section Header */}
      <div className="mb-6">
        <span className="text-sm font-medium text-slate-500 block mb-1">
          03 · {locale === "pt" ? "Simulador Interativo" : "Interactive Simulator"}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
          {locale === "pt" ? "Simulador de fluxo da arquitetura" : "Architecture flow simulator"}
        </h2>
        <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {locale === "pt"
            ? "Navegue pelos fluxos do GoLedger e observe como a arquitetura reage em cenários de sucesso, falha parcial e processamento assíncrono. Passe o mouse sobre cada nó para inspecionar responsabilidades, contratos e garantias arquiteturais."
            : "Navigate GoLedger workflows and observe how the architecture reacts across success, partial failure, and asynchronous processing scenarios. Hover over each node to inspect responsibilities, contracts, and architectural guarantees."}
        </p>
      </div>

      {/* Dynamic Architecture Diagram Box */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {/* Frame Top Bar: Clean & Direct Scenario Header */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-900">
              {locale === "pt" ? "Cenário" : "Scenario"} - {activeScenarioObj.label[locale]}
            </span>
            <span
              className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded border font-medium",
                activeScenarioObj.id === "success" && "bg-emerald-50 text-emerald-800 border-emerald-200",
                (activeScenarioObj.id === "antifraud_block" || activeScenarioObj.id === "gateway_declined") && "bg-amber-50 text-amber-800 border-amber-200",
                activeScenarioObj.id === "timeout" && "bg-sky-50 text-sky-800 border-sky-200",
                activeScenarioObj.id === "circuit_breaker" && "bg-rose-50 text-rose-800 border-rose-200"
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

        {/* Architecture Canvas: Balanced Stages with Popover on Hover */}
        <div className="p-4 sm:p-5 overflow-x-auto bg-white">
          <div className="min-w-[1060px] flex items-stretch gap-3">
            
            {/* STAGE 1: Write Path & Saga (CP) */}
            <div className="flex-[4.2] rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  1. Write Path & Saga
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Consistência CP
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                {/* 1. Client */}
                <div 
                  className="relative flex-1"
                  onMouseEnter={() => setActivePopoverNode("client")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("client")}
                  <div className={cn("p-2.5 rounded-xl border flex items-center gap-2.5 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.client))}>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 grid place-items-center text-sm flex-shrink-0">
                      <TbRoute2 />
                    </div>
                    <div className="min-w-0">
                      <strong className="block text-xs font-bold text-slate-950 whitespace-nowrap">HTTP Client</strong>
                      <small className="block text-[9.5px] font-mono text-slate-500 whitespace-nowrap">POST /checkout</small>
                    </div>
                  </div>
                </div>

                <span className="text-slate-300 font-bold px-0.5 flex-shrink-0">→</span>

                {/* 2. Go API */}
                <div 
                  className="relative flex-1"
                  onMouseEnter={() => setActivePopoverNode("api")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("api")}
                  <div className={cn("p-2.5 rounded-xl border flex items-center gap-2.5 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.api))}>
                    <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 text-sky-600 grid place-items-center text-sm flex-shrink-0">
                      <TbBrandGolang />
                    </div>
                    <div className="min-w-0">
                      <strong className="block text-xs font-bold text-slate-950 whitespace-nowrap">Go HTTP API</strong>
                      <small className="block text-[9.5px] font-mono text-slate-500 whitespace-nowrap">chi + router</small>
                    </div>
                  </div>
                </div>

                <span className="text-slate-300 font-bold px-0.5 flex-shrink-0">→</span>

                {/* 3. Saga & Breaker */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-[145px]">
                  <div 
                    className="relative"
                    onMouseEnter={() => setActivePopoverNode("saga")}
                    onMouseLeave={() => setActivePopoverNode(null)}
                  >
                    {renderPopoverCard("saga")}
                    <div className={cn("p-1.5 rounded-lg border flex items-center gap-2 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.saga))}>
                      <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 text-purple-700 grid place-items-center text-xs flex-shrink-0">
                        <TbGitBranch />
                      </div>
                      <div className="min-w-0">
                        <strong className="block text-[10.5px] font-bold text-slate-950 whitespace-nowrap">Payment Saga</strong>
                        <small className="block text-[9px] font-mono text-slate-500 whitespace-nowrap">Orquestrador</small>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="relative"
                    onMouseEnter={() => setActivePopoverNode("breaker")}
                    onMouseLeave={() => setActivePopoverNode(null)}
                  >
                    {renderPopoverCard("breaker")}
                    <div className={cn("p-1.5 rounded-lg border flex items-center gap-2 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.breaker))}>
                      <div className="w-6 h-6 rounded-md bg-amber-50 border border-amber-200 text-amber-700 grid place-items-center text-xs flex-shrink-0">
                        <FiShield />
                      </div>
                      <div className="min-w-0">
                        <strong className="block text-[10.5px] font-bold text-slate-950 whitespace-nowrap">Circuit Breaker</strong>
                        <small className="block text-[9px] font-mono text-slate-500 whitespace-nowrap">Gateway Guard</small>
                      </div>
                    </div>
                  </div>
                </div>

                <span className="text-slate-300 font-bold px-0.5 flex-shrink-0">→</span>

                {/* 4. PostgreSQL */}
                <div 
                  className="relative flex-1"
                  onMouseEnter={() => setActivePopoverNode("postgres")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("postgres")}
                  <div className={cn("p-2.5 rounded-xl border flex items-center gap-2.5 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.postgres))}>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 grid place-items-center text-sm flex-shrink-0">
                      <SiPostgresql />
                    </div>
                    <div className="min-w-0">
                      <strong className="block text-xs font-bold text-slate-950 whitespace-nowrap">PostgreSQL</strong>
                      <small className="block text-[9.5px] font-mono text-slate-500 whitespace-nowrap">Ledger + Outbox</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Conduit Separator */}
            <div className="flex items-center text-slate-400 font-bold text-base px-0.5 flex-shrink-0">
              →
            </div>

            {/* STAGE 2: Mensageria & Fanout (Async) */}
            <div className="flex-[2.8] rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  2. Mensageria & Fanout
                </span>
                <span className="text-[10px] font-mono text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  Async Pipeline
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                {/* 5. Outbox Worker */}
                <div 
                  className="relative flex-1 min-w-[130px]"
                  onMouseEnter={() => setActivePopoverNode("outbox")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("outbox")}
                  <div className={cn("p-2.5 rounded-xl border flex items-center gap-2.5 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.outbox))}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 grid place-items-center text-sm flex-shrink-0">
                      <FiGitPullRequest />
                    </div>
                    <div className="min-w-0">
                      <strong className="block text-xs font-bold text-slate-950 whitespace-nowrap">Outbox Worker</strong>
                      <small className="block text-[9.5px] font-mono text-slate-500 whitespace-nowrap">Relay Assíncrono</small>
                    </div>
                  </div>
                </div>

                <span className="text-slate-300 font-bold px-0.5 flex-shrink-0">→</span>

                {/* 6. SNS */}
                <div 
                  className="relative min-w-[85px]"
                  onMouseEnter={() => setActivePopoverNode("sns")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("sns")}
                  <div className={cn("p-2 rounded-xl border flex items-center gap-2 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.sns))}>
                    <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 grid place-items-center text-xs flex-shrink-0">
                      <TbBrandAws />
                    </div>
                    <div className="min-w-0">
                      <strong className="block text-[11px] font-bold text-slate-950 whitespace-nowrap">AWS SNS</strong>
                      <small className="block text-[8.5px] font-mono text-slate-500 whitespace-nowrap">Fanout</small>
                    </div>
                  </div>
                </div>

                <span className="text-slate-300 font-bold px-0.5 flex-shrink-0">→</span>

                {/* 7. SQS */}
                <div 
                  className="relative min-w-[85px]"
                  onMouseEnter={() => setActivePopoverNode("sqs")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("sqs")}
                  <div className={cn("p-2 rounded-xl border flex items-center gap-2 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.sqs))}>
                    <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 grid place-items-center text-xs flex-shrink-0">
                      <FiLayers />
                    </div>
                    <div className="min-w-0">
                      <strong className="block text-[11px] font-bold text-slate-950 whitespace-nowrap">AWS SQS</strong>
                      <small className="block text-[8.5px] font-mono text-slate-500 whitespace-nowrap">Queue + DLQ</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Conduit Separator */}
            <div className="flex items-center text-slate-400 font-bold text-base px-0.5 flex-shrink-0">
              →
            </div>

            {/* STAGE 3: Read Path CQRS (AP) */}
            <div className="flex-[1.5] rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 flex flex-col justify-between min-w-[170px]">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  3. Read Path
                </span>
                <span className="text-[10px] font-mono text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded whitespace-nowrap">
                  AP · O(1)
                </span>
              </div>

              {/* 8. DynamoDB */}
              <div 
                className="relative w-full"
                onMouseEnter={() => setActivePopoverNode("dynamo")}
                onMouseLeave={() => setActivePopoverNode(null)}
              >
                {renderPopoverCard("dynamo")}
                <div className={cn("p-2.5 rounded-xl border flex items-center gap-2.5 transition-all shadow-2xs cursor-help w-full", getNodeStateStyle(nodeStates.dynamo))}>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 grid place-items-center text-sm flex-shrink-0">
                    <FiDatabase />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-950 whitespace-nowrap">DynamoDB</strong>
                    <small className="block text-[9.5px] font-mono text-slate-500 whitespace-nowrap">Projeção CQRS</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informative Note with Blue Vertical Accent Bar */}
      <div className="mt-4 border-l-4 border-sky-500 bg-sky-50/50 rounded-r-xl p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-3 shadow-2xs">
        <FiInfo className="text-sky-600 text-base flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold text-slate-950 block">
            {locale === "pt" ? "Nota de Demonstração Arquitetural" : "Architectural Demonstration Note"}
          </strong>
          <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed">
            {locale === "pt"
              ? "Este simulador é uma representação conceitual interativa do GoLedger, criada para demonstrar estados, transições e fluxos de compensação da arquitetura. Ele não executa chamadas reais contra o backend, mas reproduz o comportamento esperado dos principais fluxos distribuídos."
              : "This simulator is an interactive conceptual representation of GoLedger, created to demonstrate architecture states, transitions, and compensating workflows. It does not execute live calls against a production backend, but accurately reproduces the expected behavior of key distributed workflows."}
          </p>
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
                                scen.id === "circuit_breaker" && "bg-rose-50 text-rose-700 border-rose-200/80"
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
