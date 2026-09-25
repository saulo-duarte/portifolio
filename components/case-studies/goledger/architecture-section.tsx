"use client";

import { FiDatabase, FiLayers, FiShield } from "react-icons/fi";
import { TbGitBranch } from "react-icons/tb";
import type { Locale } from "@/components/portfolio";

export function ArchitectureSection({ locale }: { locale: Locale }) {
  return (
    <section id="architecture" className="scroll-mt-28">
      <div className="mb-10">
        <span className="text-sm font-medium text-slate-500 block mb-1.5">
          02 · {locale === "pt" ? "Arquitetura" : "Architecture"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          {locale === "pt" ? "Padrões distribuídos e resiliência transacional" : "Distributed patterns and transactional resilience"}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {locale === "pt"
            ? "Esta seção apresenta os padrões arquiteturais que sustentam a consistência transacional, a mensageria assíncrona e a separação entre write path e read path no GoLedger."
            : "This section presents the architectural patterns that underpin transactional consistency, asynchronous messaging, and the separation between write path and read path in GoLedger."}
        </p>
      </div>

      {/* 4 Patterns - Architectural Decision Layer with Clean Dividers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-300 border-y border-slate-300 py-8 mb-16">
        {/* Pattern 1 - Coordination */}
        <div className="px-0 md:px-6 lg:px-7 first:pl-0 last:pr-0 py-5 md:py-1 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded">
              Coordination
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 grid place-items-center text-base flex-shrink-0">
              <TbGitBranch />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-950 tracking-tight">
            {locale === "pt" ? "Saga Orquestrada" : "Orchestrated Saga"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "pt" ? (
              <>Coordena fluxos multi-etapa com compensação automática em caso de falha. No GoLedger, orquestra <code className="font-mono text-xs text-indigo-950 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200/60">Hold → Antifraude → Gateway → Capture</code> sem deixar saldos presos.</>
            ) : (
              <>Coordinates multi-step workflows with automatic compensation upon failure. In GoLedger, it orchestrates <code className="font-mono text-xs text-indigo-950 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200/60">Hold → Antifraud → Gateway → Capture</code> without leaving balances locked.</>
            )}
          </p>
        </div>

        {/* Pattern 2 - Reliability */}
        <div className="px-0 md:px-6 lg:px-7 first:pl-0 last:pr-0 py-5 md:py-1 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded">
              Reliability
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center text-base flex-shrink-0">
              <FiDatabase />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-950 tracking-tight">
            Transactional Outbox
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "pt" ? (
              <>Resolve o risco de dual-write entre banco e broker com persistência atômica no commit. Um worker assíncrono publica os eventos com retry e backoff.</>
            ) : (
              <>Solves the dual-write risk between database and broker with atomic persistence at commit. An asynchronous worker publishes events with retry and backoff.</>
            )}
          </p>
        </div>

        {/* Pattern 3 - Messaging */}
        <div className="px-0 md:px-6 lg:px-7 first:pl-0 last:pr-0 py-5 md:py-1 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded">
              Messaging
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 grid place-items-center text-base flex-shrink-0">
              <FiLayers />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-950 tracking-tight">
            {locale === "pt" ? "Fanout de Eventos" : "Event Fanout"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "pt" ? (
              <>Distribui eventos de domínio para múltiplos consumidores sem acoplamento direto. No GoLedger, o SNS alimenta filas SQS para projeções, notificações e relatórios.</>
            ) : (
              <>Distributes domain events to multiple consumers without direct coupling. In GoLedger, SNS feeds SQS queues for projections, notifications, and reporting.</>
            )}
          </p>
        </div>

        {/* Pattern 4 - Read Model */}
        <div className="px-0 md:px-6 lg:px-7 first:pl-0 last:pr-0 py-5 md:py-1 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded">
              Read Model
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 grid place-items-center text-base flex-shrink-0">
              <FiShield />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-950 tracking-tight">
            CQRS & {locale === "pt" ? "Projeções" : "Projections"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "pt" ? (
              <>Separa escrita transacional de leitura otimizada para escala e consulta. As leituras são projetadas no DynamoDB, preservando fallback para PostgreSQL.</>
            ) : (
              <>Separates transactional writes from queries optimized for scale and read performance. Reads are projected into DynamoDB, preserving fallback to PostgreSQL.</>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
