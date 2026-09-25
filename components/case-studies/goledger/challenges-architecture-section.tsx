"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiDatabase, FiGitPullRequest, FiLayers, FiShield, FiXCircle } from "react-icons/fi";
import { SiPostgresql } from "react-icons/si";
import { TbBrandAws, TbBrandGolang, TbGitBranch, TbRoute2 } from "react-icons/tb";
import { cn } from "@/lib/utils";
import type { Locale } from "@/components/portfolio";

interface ChallengeItem {
  id: "dual-write" | "float-point" | "multi-step" | "idempotency";
  num: string;
  title: { pt: string; en: string };
  problemDesc: { pt: string; en: string };
  solutionDesc: { pt: string; en: string };
  codeComparison: {
    problemCode: string;
    solutionCode: string;
  };
  highlightNodeId: "outbox" | "postgres" | "saga" | "api";
}

const challengesData: ChallengeItem[] = [
  {
    id: "dual-write",
    num: "01",
    title: {
      pt: "O Perigo do Dual-Write entre Banco e Broker",
      en: "The Dual-Write Hazard Between Database and Broker",
    },
    problemDesc: {
      pt: "Gravar o saldo no banco de dados e publicar o evento no broker em duas etapas separadas deixa o sistema vulnerável: se a publicação falhar após o commit, o evento é perdido; se o commit falhar após publicar, cria-se dinheiro fantasma e inconsistência contábil.",
      en: "Writing balance to the database and publishing to the broker in separate steps leaves the system vulnerable: if publishing fails after commit, the event is lost; if commit fails after publishing, phantom money and corruption occur.",
    },
    solutionDesc: {
      pt: "Gravação atômica do evento na tabela outbox_events dentro da mesma transação ACID do ledger.",
      en: "Atomic persistence of the domain event into the outbox_events table within the exact same ACID ledger transaction.",
    },
    codeComparison: {
      problemCode: `// ❌ DUAL-WRITE INSEGURO
tx.Commit() // Se a rede cair aqui...
broker.Publish("wallet.paid", evt) // ...evento perdido!`,
      solutionCode: `// ✅ TRANSACTIONAL OUTBOX (ATÔMICO)
tx.Exec("INSERT INTO postings ...")
tx.Exec("INSERT INTO outbox_events ...")
tx.Commit() // 100% atômico`,
    },
    highlightNodeId: "outbox",
  },
  {
    id: "float-point",
    num: "02",
    title: {
      pt: "Imprecisão de Ponto Flutuante e Perda de Histórico",
      en: "Floating Point Inaccuracy & Lost Historical Audit",
    },
    problemDesc: {
      pt: "Tipos float causam perdas cumulativas de centavos por arredondamento binário. Além disso, mutar saldos diretamente com UPDATE balance = balance + 10 destrói o histórico contábil, inviabilizando auditorias e conciliações regulatórias.",
      en: "Float types cause cumulative cent losses due to binary rounding. Furthermore, mutating balances directly with UPDATE balance = balance + 10 destroys audit history, crippling reconciliations.",
    },
    solutionDesc: {
      pt: "Partidas dobradas imutáveis com valores em inteiros (int64 cents) e invariante matemática estrita ∑ postings = 0.",
      en: "Immutable double-entry ledger with integer cents (int64) and strict mathematical invariant ∑ postings = 0.",
    },
    codeComparison: {
      problemCode: `// ❌ FLOAT E MUTABILIDADE DE SALDO
var balance float64 = 0.1 + 0.2 // 0.30000000000000004
UPDATE wallets SET balance = balance + 150.00`,
      solutionCode: `// ✅ INT64 + PARTIDAS DOBRADAS (∑ = 0)
type Amount int64 // R$ 150,00 -> 15000 cents
INSERT INTO postings (debit, credit) -- Invariante zero-sum`,
    },
    highlightNodeId: "postgres",
  },
  {
    id: "multi-step",
    num: "03",
    title: {
      pt: "Falhas Parciais em Fluxos Multi-Etapa",
      en: "Partial Failures in Multi-Step Workflows",
    },
    problemDesc: {
      pt: "Um pagamento envolve reserva temporária de saldo, análise de risco antifraude e chamada de rede ao gateway externo. Se o gateway atingir timeout ou o antifraude recusar o comprador, o saldo não pode ficar bloqueado indefinidamente na conta.",
      en: "A payment involves temporary balance holds, antifraud risk scoring, and external PSP gateway calls. If the gateway times out or antifraud rejects, the balance must not remain permanently locked.",
    },
    solutionDesc: {
      pt: "PaymentSagaOrchestrator com reservas temporárias (Holds) e compensação automática (ReleaseHold).",
      en: "PaymentSagaOrchestrator with temporary holds and automated compensating transactions (ReleaseHold).",
    },
    codeComparison: {
      problemCode: `// ❌ SEM ORQUESTRAÇÃO DE COMPENSAÇÃO
hold := CreateHold(amount)
chargeErr := psp.Charge() // Falha na adquirente!
// Hold fica órfão e saldo do usuário permanece bloqueado`,
      solutionCode: `// ✅ SAGA ORCHESTRATOR COM ROLLBACK
if err := psp.Charge(); err != nil {
  saga.Compensate(ctx, ReleaseHold(hold.ID))
  return ErrPaymentFailed
}`,
    },
    highlightNodeId: "saga",
  },
  {
    id: "idempotency",
    num: "04",
    title: {
      pt: "Retentativas de Rede e Cobrança Duplicada",
      en: "Network Retries & Duplicate Charges",
    },
    problemDesc: {
      pt: "Em conexões instáveis, clientes repetem requisições HTTP quando a resposta demora. Sem controle estrito de idempotência, uma mesma compra pode debitar o usuário múltiplas vezes consecutivas.",
      en: "Under shaky network connections, clients retry HTTP requests upon timeouts. Without strict idempotency, a single purchase can charge the user multiple times consecutively.",
    },
    solutionDesc: {
      pt: "Middleware de Idempotency-Key com lock transacional no PostgreSQL devolvendo a resposta original em retries.",
      en: "Idempotency-Key middleware with atomic PostgreSQL locks replaying original responses on identical retries.",
    },
    codeComparison: {
      problemCode: `// ❌ SEM CONTROLE DE IDEMPOTÊNCIA
POST /payments/checkout (req 1) -> 200 OK (R$ 150 debitado)
POST /payments/checkout (retry) -> 200 OK (R$ 300 debitado!)`,
      solutionCode: `// ✅ IDEMPOTENCY-KEY LOCK ATÔMICO
tx.Lock("idemp:" + key) // Se já existe,
return cachedResponse // retorna resultado anterior sem debitar`,
    },
    highlightNodeId: "api",
  },
];

export function ChallengesArchitectureSection({ locale }: { locale: Locale }) {
  const [activeChallenge, setActiveChallenge] = useState<ChallengeItem["id"]>("dual-write");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const triggerOffset = scrollY + 300;

      for (const item of [...challengesData].reverse()) {
        const el = sectionRefs.current[item.id];
        if (el && el.offsetTop <= triggerOffset) {
          setActiveChallenge(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeItem = challengesData.find((c) => c.id === activeChallenge) || challengesData[0];

  return (
    <section id="architecture" className="scroll-mt-24">
      {/* Anchor targets */}
      <div id="problem" className="relative -top-24" />

      {/* Section Header */}
      <div className="mb-10">
        <span className="text-sm font-medium text-slate-500 block mb-1">
          01 · {locale === "pt" ? "Desafios & Arquitetura" : "Challenges & Architecture"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          {locale === "pt"
            ? "Desafios críticos em sistemas financeiros distribuídos"
            : "Critical challenges in distributed financial systems"}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {locale === "pt"
            ? "Como a arquitetura do GoLedger resolve falhas parciais, concorrência bancária, dual-write e idempotência através de padrões distribuídos comprovados."
            : "How GoLedger's architecture eliminates partial failures, concurrency hazards, dual-write and non-idempotent mutations via battle-tested patterns."}
        </p>
      </div>

      {/* 50/50 Split Layout: Sticky Architecture Visual (Left) + Challenge Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: Sticky Interactive Architectural Map */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-xs overflow-hidden relative">
            
            {/* Top Bar of Diagram Box */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {locale === "pt" ? "Mapa Arquitetural Ativo" : "Active Architectural Map"}
                </span>
              </div>
              <span className="text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-sky-700 shadow-2xs">
                {activeItem.num} · {activeItem.highlightNodeId.toUpperCase()}
              </span>
            </div>

            {/* Visual Node Graph with Dynamic Glow on Active Component */}
            <div className="space-y-4">
              
              {/* Row 1: Client & API Gateway */}
              <div className="grid grid-cols-2 gap-3 items-center">
                {/* Client Node */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 grid place-items-center text-xs flex-shrink-0">
                    <TbRoute2 />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-900 truncate">HTTP Client</strong>
                    <small className="block text-[9.5px] font-mono text-slate-500 truncate">Idempotency Key</small>
                  </div>
                </div>

                {/* API Gateway (Chi) */}
                <motion.div 
                  animate={{
                    borderColor: activeItem.highlightNodeId === "api" ? "#0284c7" : "#e2e8f0",
                    backgroundColor: activeItem.highlightNodeId === "api" ? "#f0f9ff" : "#ffffff",
                    scale: activeItem.highlightNodeId === "api" ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-xl border shadow-2xs flex items-center gap-2.5 relative"
                >
                  {activeItem.highlightNodeId === "api" && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-sky-500 rounded-full ring-4 ring-sky-100" />
                  )}
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 grid place-items-center text-xs flex-shrink-0">
                    <TbBrandGolang />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-900 truncate">API Gateway</strong>
                    <small className="block text-[9.5px] font-mono text-sky-700 font-semibold truncate">Lock & Validate</small>
                  </div>
                </motion.div>
              </div>

              {/* Connecting Conduits */}
              <div className="flex justify-around text-slate-300 text-xs font-mono font-bold px-4">
                <span>↓</span>
                <span>↓</span>
              </div>

              {/* Row 2: PostgreSQL ACID Ledger & Outbox Table */}
              <div className="grid grid-cols-2 gap-3 items-center">
                {/* PostgreSQL ACID Ledger */}
                <motion.div 
                  animate={{
                    borderColor: activeItem.highlightNodeId === "postgres" ? "#0284c7" : "#e2e8f0",
                    backgroundColor: activeItem.highlightNodeId === "postgres" ? "#f0f9ff" : "#ffffff",
                    scale: activeItem.highlightNodeId === "postgres" ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-xl border shadow-2xs flex items-center gap-2.5 relative"
                >
                  {activeItem.highlightNodeId === "postgres" && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-sky-500 rounded-full ring-4 ring-sky-100" />
                  )}
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 grid place-items-center text-xs flex-shrink-0">
                    <SiPostgresql />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-900 truncate">ACID Ledger DB</strong>
                    <small className="block text-[9.5px] font-mono text-blue-700 font-semibold truncate">∑ Postings = 0</small>
                  </div>
                </motion.div>

                {/* Outbox Table */}
                <motion.div 
                  animate={{
                    borderColor: activeItem.highlightNodeId === "outbox" ? "#0284c7" : "#e2e8f0",
                    backgroundColor: activeItem.highlightNodeId === "outbox" ? "#f0f9ff" : "#ffffff",
                    scale: activeItem.highlightNodeId === "outbox" ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-xl border shadow-2xs flex items-center gap-2.5 relative"
                >
                  {activeItem.highlightNodeId === "outbox" && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-sky-500 rounded-full ring-4 ring-sky-100" />
                  )}
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center text-xs flex-shrink-0">
                    <FiGitPullRequest />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-900 truncate">Outbox Table</strong>
                    <small className="block text-[9.5px] font-mono text-emerald-700 font-semibold truncate">No Dual-Write</small>
                  </div>
                </motion.div>
              </div>

              {/* Connecting Conduits */}
              <div className="flex justify-around text-slate-300 text-xs font-mono font-bold px-4">
                <span>↓</span>
                <span>↓</span>
              </div>

              {/* Row 3: Saga Orchestrator & Async Broker */}
              <div className="grid grid-cols-2 gap-3 items-center">
                {/* Saga Orchestrator */}
                <motion.div 
                  animate={{
                    borderColor: activeItem.highlightNodeId === "saga" ? "#0284c7" : "#e2e8f0",
                    backgroundColor: activeItem.highlightNodeId === "saga" ? "#f0f9ff" : "#ffffff",
                    scale: activeItem.highlightNodeId === "saga" ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-xl border shadow-2xs flex items-center gap-2.5 relative"
                >
                  {activeItem.highlightNodeId === "saga" && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-sky-500 rounded-full ring-4 ring-sky-100" />
                  )}
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 grid place-items-center text-xs flex-shrink-0">
                    <TbGitBranch />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-900 truncate">Saga Orchestrator</strong>
                    <small className="block text-[9.5px] font-mono text-purple-700 font-semibold truncate">Holds & Rollback</small>
                  </div>
                </motion.div>

                {/* Message Broker (SNS/SQS) */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 grid place-items-center text-xs flex-shrink-0">
                    <TbBrandAws />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-900 truncate">Message Broker</strong>
                    <small className="block text-[9.5px] font-mono text-slate-500 truncate">SNS Fanout + SQS</small>
                  </div>
                </div>
              </div>

            </div>

            {/* Highlighted Pattern Explanation Pill */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-slate-950 block mb-0.5">
                {locale === "pt" ? "Garantia Arquitetural Focada:" : "Focused Architectural Guarantee:"}
              </span>
              <p className="text-[11.5px] text-slate-600 leading-relaxed font-mono">
                {activeItem.solutionDesc[locale]}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrolling Feed of 4 Challenges with Crosshair (+) Separators */}
        <div className="lg:col-span-7 space-y-10">
          {challengesData.map((item, idx) => {
            const isActive = activeChallenge === item.id;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  sectionRefs.current[item.id] = el;
                }}
                className={cn(
                  "relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 bg-white shadow-xs",
                  isActive
                    ? "border-sky-500/80 ring-1 ring-sky-500/20"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                {/* Minimalist Crosshair (+) Grid Markers on 4 corners */}
                <span className="absolute -top-1.5 -left-1.5 text-slate-400 font-mono text-xs select-none font-light leading-none">+</span>
                <span className="absolute -top-1.5 -right-1.5 text-slate-400 font-mono text-xs select-none font-light leading-none">+</span>
                <span className="absolute -bottom-1.5 -left-1.5 text-slate-400 font-mono text-xs select-none font-light leading-none">+</span>
                <span className="absolute -bottom-1.5 -right-1.5 text-slate-400 font-mono text-xs select-none font-light leading-none">+</span>

                {/* Challenge Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={cn(
                    "font-mono text-xs font-bold px-2 py-1 rounded-md border shadow-2xs",
                    isActive
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  )}>
                    {item.num}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-950">
                    {item.title[locale]}
                  </h3>
                </div>

                {/* Problem Statement */}
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {item.problemDesc[locale]}
                </p>

                {/* Comparative Code Snippets (Problem vs Solution) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                  {/* Problem Snippet */}
                  <div className="rounded-xl border border-rose-200/80 bg-rose-50/40 p-3 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-rose-700 font-semibold mb-1 text-[10px] uppercase">
                      <FiXCircle className="text-xs" />
                      <span>{locale === "pt" ? "Cenário Vulnerável" : "Vulnerable Path"}</span>
                    </div>
                    <pre className="text-slate-700 whitespace-pre-wrap leading-tight">
                      {item.codeComparison.problemCode}
                    </pre>
                  </div>

                  {/* Solution Snippet */}
                  <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1 text-[10px] uppercase">
                      <FiCheck className="text-xs" />
                      <span>{locale === "pt" ? "Solução GoLedger" : "GoLedger Solution"}</span>
                    </div>
                    <pre className="text-slate-800 whitespace-pre-wrap leading-tight">
                      {item.codeComparison.solutionCode}
                    </pre>
                  </div>
                </div>

                {/* Solution Callout with Left Blue Vertical Accent Bar */}
                <div className="mt-4 border-l-4 border-sky-500 bg-sky-50/50 rounded-r-xl p-3.5 sm:p-4 text-xs sm:text-sm text-slate-800 leading-relaxed shadow-2xs">
                  <span className="font-bold text-sky-800 uppercase tracking-wide text-[10px] block mb-1 font-mono">
                    {locale === "pt" ? "SOLUÇÃO ARQUITETURAL" : "ARCHITECTURAL SOLUTION"}
                  </span>
                  <p className="text-slate-700">
                    {item.solutionDesc[locale]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
