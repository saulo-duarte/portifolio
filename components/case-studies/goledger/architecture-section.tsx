"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiDatabase, FiGitPullRequest, FiInfo, FiLayers, FiPlay, FiRefreshCw, FiShield, FiX } from "react-icons/fi";
import { SiPostgresql } from "react-icons/si";
import { TbBrandAws, TbBrandGolang, TbDatabase, TbGitBranch, TbRoute2 } from "react-icons/tb";
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
      pt: "Originador da requisição transacional de checkout ou transferência.",
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
    tech: "Go · Chi Router",
    role: {
      pt: "Camada de entrada com validação estrita e middlewares de observabilidade.",
      en: "Edge layer with strict validation and observability middlewares."
    },
    behavior: {
      pt: "Valida o payload do checkout, exige Idempotency-Key e repassa a execução diretamente para o PaymentSagaOrchestrator.",
      en: "Validates checkout payload, requires an Idempotency-Key, and forwards execution to PaymentSagaOrchestrator."
    }
  },
  hold: {
    title: { pt: "Step 1: Hold Authorization", en: "Step 1: Hold Authorization" },
    category: { pt: "Saga Step 1 · PostgreSQL", en: "Saga Step 1 · PostgreSQL" },
    tech: "PostgreSQL · SELECT FOR UPDATE",
    role: {
      pt: "Reserva atômica e temporária de saldo da carteira pagadora no banco.",
      en: "Atomic and temporary balance hold on payer wallet in database."
    },
    behavior: {
      pt: "Trava a linha da conta pagadora com lock pessimista, verifica fundos suficientes e cria o registro de Hold. Se a saga falhar adiante, este hold é compensado e liberado.",
      en: "Acquires pessimistic row lock, checks for sufficient funds, and writes the Hold record. Compensated and released if downstream saga steps fail."
    }
  },
  antifraud: {
    title: { pt: "Step 2: Antifraud Evaluation", en: "Step 2: Antifraud Evaluation" },
    category: { pt: "Saga Step 2 · Risco", en: "Saga Step 2 · Risk" },
    tech: "Internal Risk Engine · AntiFraudChecker",
    role: {
      pt: "Avaliação em tempo real de padrões de risco e fraude antes de chamar o gateway.",
      en: "Real-time risk scoring and fraud evaluation prior to hitting the external gateway."
    },
    behavior: {
      pt: "Se rejeitado (ex: usuário em lista de fraude), aciona a compensação imediata do Hold (liberando a reserva no PostgreSQL) e interrompe o checkout com erro explícito.",
      en: "If rejected, triggers immediate Hold compensation in PostgreSQL and stops checkout execution with explicit rejection error."
    }
  },
  gateway: {
    title: { pt: "Step 3: Gateway & Circuit Breaker", en: "Step 3: Gateway & Circuit Breaker" },
    category: { pt: "Saga Step 3 · PSP", en: "Saga Step 3 · PSP" },
    tech: "Circuit Breaker · PSP Primary/Standby",
    role: {
      pt: "Processamento externo da cobrança de cartão/PIX com tolerância a falhas.",
      en: "External charge processing via payment gateway with fault-tolerant guardrails."
    },
    behavior: {
      pt: "Protegido por Circuit Breaker. Se o circuito estiver aberto, realiza failover seguro para o gateway standby. Se houver recusa definitiva, compensa o hold; em caso de timeout pós-envio, retém o hold para reconciliação.",
      en: "Protected by a Circuit Breaker with standby gateway failover. Definite declines release holds; post-submission timeouts preserve holds for reconciliation."
    }
  },
  capture: {
    title: { pt: "Step 4: Hold Capture & Postings", en: "Step 4: Hold Capture & Postings" },
    category: { pt: "Saga Step 4 · Finalização", en: "Saga Step 4 · Finalization" },
    tech: "PostgreSQL · Double-Entry Core",
    role: {
      pt: "Conversão do Hold em lançamento contábil definitivo e imutável.",
      en: "Converts temporary Hold into finalized, immutable double-entry journal postings."
    },
    behavior: {
      pt: "Debita a conta pagadora, credita a conta de liquidação (clearing) e grava o evento de domínio na tabela outbox_events na mesma transação atômica.",
      en: "Debits payer wallet, credits settlement account, and inserts domain event into outbox_events table within the same transaction."
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

export function ArchitectureSection({ locale }: { locale: Locale }) {
  const [simScenario, setSimScenario] = useState<ScenarioId>("success");
  const [modalSelectedScenario, setModalSelectedScenario] = useState<ScenarioId>("success");
  const [simRunning, setSimRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePopoverNode, setActivePopoverNode] = useState<string | null>(null);

  const [nodeStates, setNodeStates] = useState<Record<string, NodeSimState>>({
    client: "idle",
    api: "idle",
    hold: "idle",
    antifraud: "idle",
    gateway: "idle",
    capture: "idle",
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

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const reset: Record<string, NodeSimState> = {
      client: "idle",
      api: "idle",
      hold: "idle",
      antifraud: "idle",
      gateway: "idle",
      capture: "idle",
      postgres: "idle",
      outbox: "idle",
      sns: "idle",
      sqs: "idle",
      dynamo: "idle",
    };
    setNodeStates(reset);

    // Step 1: HTTP Client
    setNodeStates((s) => ({ ...s, client: "running" }));
    await delay(400);

    // Step 2: Go HTTP API (Chi Router)
    setNodeStates((s) => ({ ...s, client: "success", api: "running" }));
    await delay(400);

    // Step 3: Saga Step 1 - Hold Authorization
    setNodeStates((s) => ({ ...s, api: "success", hold: "running" }));
    await delay(500);
    setNodeStates((s) => ({ ...s, hold: "success" }));

    // Step 4: Saga Step 2 - Antifraud Evaluation
    setNodeStates((s) => ({ ...s, antifraud: "running" }));
    await delay(450);

    if (targetScenario === "antifraud_block") {
      setNodeStates((s) => ({ ...s, antifraud: "error" }));
      await delay(500);
      // Compensate hold
      setNodeStates((s) => ({ ...s, hold: "compensated" }));
      setSimRunning(false);
      return;
    }
    setNodeStates((s) => ({ ...s, antifraud: "success" }));

    // Step 5: Saga Step 3 - Gateway & Circuit Breaker
    setNodeStates((s) => ({ ...s, gateway: "running" }));
    await delay(500);

    if (targetScenario === "circuit_breaker") {
      // Circuit Breaker opens, fallback to standby
      setNodeStates((s) => ({ ...s, gateway: "error" }));
      await delay(400);
      setNodeStates((s) => ({ ...s, gateway: "success" })); // standby succeeded
    } else if (targetScenario === "gateway_declined") {
      setNodeStates((s) => ({ ...s, gateway: "error" }));
      await delay(500);
      // Compensate hold
      setNodeStates((s) => ({ ...s, hold: "compensated" }));
      setSimRunning(false);
      return;
    } else if (targetScenario === "timeout") {
      setNodeStates((s) => ({ ...s, gateway: "error" }));
      await delay(500);
      // Hold is maintained for reconciliation (not released)
      setNodeStates((s) => ({ ...s, hold: "running" }));
      setSimRunning(false);
      return;
    } else {
      setNodeStates((s) => ({ ...s, gateway: "success" }));
    }

    // Step 6: Saga Step 4 - Hold Capture
    setNodeStates((s) => ({ ...s, capture: "running" }));
    await delay(450);
    setNodeStates((s) => ({ ...s, capture: "success", postgres: "running" }));
    await delay(500);

    // Step 7: Database & Outbox
    setNodeStates((s) => ({ ...s, postgres: "success", outbox: "running" }));
    await delay(450);

    // Step 8: AWS SNS Topic Fanout
    setNodeStates((s) => ({ ...s, outbox: "success", sns: "running" }));
    await delay(400);

    // Step 9: AWS SQS Queue
    setNodeStates((s) => ({ ...s, sns: "success", sqs: "running" }));
    await delay(400);

    // Step 10: DynamoDB CQRS Projection
    setNodeStates((s) => ({ ...s, sqs: "success", dynamo: "running" }));
    await delay(450);

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
              ? "Orquestração de escrita com consistência forte, persistência atômica via outbox e projeções desacopladas em tempo real."
              : "Strong consistency write orchestration, atomic outbox persistence, and real-time decoupled projections."}
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
      <div id="architecture-simulator-block" className="rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-xs">
        {/* Frame Top Bar with Stronger Grey Contrast */}
        <div className="border-b border-slate-300 bg-slate-200/90 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-900">
              {locale === "pt" ? "Cenário" : "Scenario"}: {activeScenarioObj.label[locale]}
            </span>
            <span
              className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded border font-medium",
                activeScenarioObj.id === "success" && "bg-emerald-50 text-emerald-800 border-emerald-300",
                (activeScenarioObj.id === "antifraud_block" || activeScenarioObj.id === "gateway_declined") && "bg-amber-50 text-amber-800 border-amber-300",
                activeScenarioObj.id === "timeout" && "bg-sky-50 text-sky-800 border-sky-300",
                activeScenarioObj.id === "circuit_breaker" && "bg-rose-50 text-rose-800 border-rose-300"
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

        {/* 3-Group Architecture Canvas with Vertical Saga Steps */}
        <div className="p-3 sm:p-5 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch min-h-[330px]">
            
            {/* GROUP 1: Write Path & Payment Saga (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  1. Write Path & Saga Orchestrator
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  Consistência CP
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2.5 items-stretch flex-1">
                {/* Ingress Column (Client & API Gateway) */}
                <div className="col-span-4 flex flex-col justify-around gap-2">
                  {/* Client */}
                  <div 
                    className="relative flex-1 flex flex-col justify-center"
                    onMouseEnter={() => setActivePopoverNode("client")}
                    onMouseLeave={() => setActivePopoverNode(null)}
                  >
                    {renderPopoverCard("client")}
                    <div className={cn("p-2 rounded-lg border flex flex-col justify-center transition-all shadow-2xs cursor-help text-center", getNodeStateStyle(nodeStates.client))}>
                      <span className="text-[11px] font-bold text-slate-950 truncate block">Client</span>
                      <span className="text-[9px] font-mono text-slate-500 truncate block">POST /checkout</span>
                    </div>
                  </div>

                  <div className="text-center text-slate-300 font-bold text-xs select-none">↓</div>

                  {/* Go API */}
                  <div 
                    className="relative flex-1 flex flex-col justify-center"
                    onMouseEnter={() => setActivePopoverNode("api")}
                    onMouseLeave={() => setActivePopoverNode(null)}
                  >
                    {renderPopoverCard("api")}
                    <div className={cn("p-2 rounded-lg border flex flex-col justify-center transition-all shadow-2xs cursor-help text-center", getNodeStateStyle(nodeStates.api))}>
                      <span className="text-[11px] font-bold text-slate-950 truncate block">Go API</span>
                      <span className="text-[9px] font-mono text-slate-500 truncate block">chi router</span>
                    </div>
                  </div>
                </div>

                {/* Arrow to Saga */}
                <div className="col-span-1 flex items-center justify-center text-slate-300 font-bold text-xs select-none">
                  →
                </div>

                {/* Saga Steps Column (Top to Bottom with indicator arrow) */}
                <div className="col-span-7 flex flex-col justify-between gap-1.5 bg-white/70 p-2 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 border-b border-slate-100 pb-1 mb-0.5">
                    <span className="flex items-center gap-1">
                      <TbGitBranch className="text-purple-600 text-xs" />
                      Payment Saga
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">Fluxo ↓</span>
                  </div>

                  {/* Step 1: Hold */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setActivePopoverNode("hold")}
                    onMouseLeave={() => setActivePopoverNode(null)}
                  >
                    {renderPopoverCard("hold")}
                    <div className={cn("px-2 py-1.5 rounded-md border flex items-center justify-between gap-1 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.hold))}>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-950 block truncate">1. Hold (Reserva)</span>
                        <span className="text-[9px] font-mono text-slate-500 block truncate">lock pessimista</span>
                      </div>
                      <SiPostgresql className="text-blue-700 text-xs shrink-0" />
                    </div>
                  </div>

                  {/* Step 2: Antifraud */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setActivePopoverNode("antifraud")}
                    onMouseLeave={() => setActivePopoverNode(null)}
                  >
                    {renderPopoverCard("antifraud")}
                    <div className={cn("px-2 py-1.5 rounded-md border flex items-center justify-between gap-1 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.antifraud))}>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-950 block truncate">2. Antifraude</span>
                        <span className="text-[9px] font-mono text-slate-500 block truncate">risk evaluation</span>
                      </div>
                      <FiShield className="text-amber-600 text-xs shrink-0" />
                    </div>
                  </div>

                  {/* Step 3: Gateway & Breaker */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setActivePopoverNode("gateway")}
                    onMouseLeave={() => setActivePopoverNode(null)}
                  >
                    {renderPopoverCard("gateway")}
                    <div className={cn("px-2 py-1.5 rounded-md border flex items-center justify-between gap-1 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.gateway))}>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-950 block truncate">3. Gateway & Breaker</span>
                        <span className="text-[9px] font-mono text-slate-500 block truncate">primary / standby</span>
                      </div>
                      <TbRoute2 className="text-cyan-600 text-xs shrink-0" />
                    </div>
                  </div>

                  {/* Step 4: Capture */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setActivePopoverNode("capture")}
                    onMouseLeave={() => setActivePopoverNode(null)}
                  >
                    {renderPopoverCard("capture")}
                    <div className={cn("px-2 py-1.5 rounded-md border flex items-center justify-between gap-1 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.capture))}>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-950 block truncate">4. Captura Contábil</span>
                        <span className="text-[9px] font-mono text-slate-500 block truncate">partidas dobradas</span>
                      </div>
                      <FiCheck className="text-emerald-600 text-xs shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 2: Database & Outbox (3 cols) */}
            <div className="lg:col-span-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  2. Database · ACID
                </span>
                <span className="text-[10px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                  Ledger CP
                </span>
              </div>

              <div className="flex flex-col justify-around gap-2 flex-1">
                {/* PostgreSQL */}
                <div 
                  className="relative flex-1 flex flex-col justify-center"
                  onMouseEnter={() => setActivePopoverNode("postgres")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("postgres")}
                  <div className={cn("p-2.5 rounded-lg border flex items-center gap-3 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.postgres))}>
                    <SiPostgresql className="text-blue-700 text-xl shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-bold text-slate-950 truncate block">PostgreSQL</span>
                      <span className="text-[9px] font-mono text-slate-500 truncate block">Fonte da Verdade</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-slate-300 font-bold text-xs select-none">↓</div>

                {/* Outbox Relay */}
                <div 
                  className="relative flex-1 flex flex-col justify-center"
                  onMouseEnter={() => setActivePopoverNode("outbox")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("outbox")}
                  <div className={cn("p-2.5 rounded-lg border flex items-center gap-3 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.outbox))}>
                    <FiGitPullRequest className="text-emerald-700 text-xl shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-bold text-slate-950 truncate block">Outbox Relay</span>
                      <span className="text-[9px] font-mono text-slate-500 truncate block">Worker At-Least-Once</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 3: Read Path & Fanout (4 cols) */}
            <div className="lg:col-span-4 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  3. Read Path & Fanout
                </span>
                <span className="text-[10px] font-mono text-indigo-800 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                  Async · AP
                </span>
              </div>

              <div className="flex flex-col justify-between gap-1.5 flex-1">
                {/* SNS */}
                <div 
                  className="relative flex-1 flex flex-col justify-center"
                  onMouseEnter={() => setActivePopoverNode("sns")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("sns")}
                  <div className={cn("p-2 rounded-lg border flex items-center gap-2.5 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.sns))}>
                    <TbBrandAws className="text-orange-600 text-lg shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-bold text-slate-950 truncate block">AWS SNS</span>
                      <span className="text-[9px] font-mono text-slate-500 truncate block">Topic Fanout</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-slate-300 font-bold text-xs select-none">↓</div>

                {/* SQS */}
                <div 
                  className="relative flex-1 flex flex-col justify-center"
                  onMouseEnter={() => setActivePopoverNode("sqs")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("sqs")}
                  <div className={cn("p-2 rounded-lg border flex items-center gap-2.5 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.sqs))}>
                    <FiLayers className="text-amber-600 text-lg shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-bold text-slate-950 truncate block">AWS SQS</span>
                      <span className="text-[9px] font-mono text-slate-500 truncate block">Queue + DLQ</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-slate-300 font-bold text-xs select-none">↓</div>

                {/* DynamoDB */}
                <div 
                  className="relative flex-1 flex flex-col justify-center"
                  onMouseEnter={() => setActivePopoverNode("dynamo")}
                  onMouseLeave={() => setActivePopoverNode(null)}
                >
                  {renderPopoverCard("dynamo")}
                  <div className={cn("p-2 rounded-lg border flex items-center gap-2.5 transition-all shadow-2xs cursor-help", getNodeStateStyle(nodeStates.dynamo))}>
                    <TbDatabase className="text-indigo-600 text-lg shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-bold text-slate-950 truncate block">DynamoDB</span>
                      <span className="text-[9px] font-mono text-slate-500 truncate block">CQRS Read Model O(1)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Informative Note */}
        <div className="border-t border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
          <FiInfo className="text-sky-600 text-sm flex-shrink-0 mt-0.5" />
          <p className="text-slate-600 text-xs">
            {locale === "pt"
              ? "Simulação baseada no pacote internal/ledger/application/saga: bloqueio de antifraude e recusa de gateway compensam e liberam o hold imediatamente; timeout mantém a reserva aguardando reconciliação."
              : "Simulation based on internal/ledger/application/saga: antifraud blocks and gateway declines immediately compensate and release holds; timeouts preserve holds awaiting reconciliation."}
          </p>
        </div>
      </div>

      {/* 3. Architectural Decision Layer - 4 Core Patterns (Vertical Separators Only) */}
      <div className="pt-2">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            {locale === "pt" ? "Padrões de resiliência e desacoplamento" : "Resilience and decoupling patterns"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {locale === "pt"
              ? "Decisões arquiteturais fundamentais adotadas no GoLedger e testadas no simulador acima:"
              : "Fundamental architectural decisions adopted in GoLedger and tested in the simulator above:"}
          </p>
        </div>

        {/* 4 Patterns Grid: Vertical Separators ONLY, NO Horizontal Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:divide-x divide-slate-300 py-4">
          {/* Pattern 1 */}
          <div className="px-0 md:px-5 lg:px-6 first:pl-0 last:pr-0 py-4 md:py-0 space-y-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-base sm:text-lg font-extrabold text-slate-950 select-none">01</span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h4 className="text-base font-bold text-slate-950 tracking-tight">
                {locale === "pt" ? "Saga Orquestrada" : "Orchestrated Saga"}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt" ? (
                <>Uma tentativa persistida coordena <code className="font-mono text-xs text-indigo-950 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200/60">Hold → Antifraude → Gateway → Capture</code>. Recusa definitiva libera o hold; timeout mantém a reserva durante reconciliação e retries.</>
              ) : (
                <>A persisted attempt coordinates <code className="font-mono text-xs text-indigo-950 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200/60">Hold → Antifraud → Gateway → Capture</code>. A definitive decline releases the hold; a timeout keeps it reserved during reconciliation and retries.</>
              )}
            </p>
          </div>

          {/* Pattern 2 */}
          <div className="px-0 md:px-5 lg:px-6 first:pl-0 last:pr-0 py-4 md:py-0 space-y-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-base sm:text-lg font-extrabold text-slate-950 select-none">02</span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h4 className="text-base font-bold text-slate-950 tracking-tight">
                Transactional Outbox
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt" ? (
                <>Resolve o risco de dual-write entre banco e broker com persistência atômica no commit. Um worker assíncrono publica os eventos com retry e backoff.</>
              ) : (
                <>Solves the dual-write risk between database and broker with atomic persistence at commit. An asynchronous worker publishes events with retry and backoff.</>
              )}
            </p>
          </div>

          {/* Pattern 3 */}
          <div className="px-0 md:px-5 lg:px-6 first:pl-0 last:pr-0 py-4 md:py-0 space-y-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-base sm:text-lg font-extrabold text-slate-950 select-none">03</span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h4 className="text-base font-bold text-slate-950 tracking-tight">
                {locale === "pt" ? "Fanout de Eventos" : "Event Fanout"}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt" ? (
                <>Distribui eventos de domínio para múltiplos consumidores sem acoplamento direto. No GoLedger, o SNS alimenta filas SQS para projeções, notificações e relatórios.</>
              ) : (
                <>Distributes domain events to multiple consumers without direct coupling. In GoLedger, SNS feeds SQS queues for projections, notifications, and reporting.</>
              )}
            </p>
          </div>

          {/* Pattern 4 */}
          <div className="px-0 md:px-5 lg:px-6 first:pl-0 last:pr-0 py-4 md:py-0 space-y-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-base sm:text-lg font-extrabold text-slate-950 select-none">04</span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h4 className="text-base font-bold text-slate-950 tracking-tight">
                CQRS & {locale === "pt" ? "Projeções" : "Projections"}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt" ? (
                <>Separa escrita transacional de leitura otimizada para escala e consulta. As leituras são projetadas no DynamoDB, preservando fallback para PostgreSQL.</>
              ) : (
                <>Separates transactional writes from queries optimized for scale and read performance. Reads are projected into DynamoDB, preserving fallback to PostgreSQL.</>
              )}
            </p>
          </div>
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
