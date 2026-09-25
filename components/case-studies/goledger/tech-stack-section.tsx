"use client";

import { FiDatabase, FiLayers } from "react-icons/fi";
import { SiOpentelemetry, SiPostgresql } from "react-icons/si";
import { TbBrandAws, TbBrandGolang } from "react-icons/tb";
import type { Locale } from "@/components/portfolio";

export function TechStackSection({ locale }: { locale: Locale }) {
  return (
    <section id="tech-stack" className="scroll-mt-28">
      <div className="mb-10">
        <span className="text-sm font-medium text-slate-500 block mb-1.5">
          05 · {locale === "pt" ? "Stack Tecnológico" : "Tech Stack"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          {locale === "pt"
            ? "Tecnologias com papéis arquiteturais explícitos"
            : "Technologies with explicit architectural roles"}
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {locale === "pt"
            ? "A stack foi organizada por responsabilidade arquitetural: domínio e orquestração permanecem independentes, enquanto persistência, mensageria, projeções e observabilidade são tratadas por adapters especializados."
            : "The stack is organized by architectural responsibility: domain and orchestration remain independent, while persistence, messaging, projections, and observability are handled by specialized adapters."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Go */}
        <div className="rounded-2xl border border-slate-300 bg-slate-50/40 p-6 hover:border-slate-400 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 grid place-items-center text-xl flex-shrink-0">
                <TbBrandGolang />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-base font-bold text-slate-950">Go (net/http + chi)</h4>
                <span className="text-[11px] font-mono text-slate-500 block truncate">internal/ledger/domain & app</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt"
                ? "Implementa o domínio contábil, invariantes matemáticas e a camada de aplicação/orquestração (Sagas). Mantém a infraestrutura e integrações externas desacopladas atrás de adapters e interfaces estritas."
                : "Implements core accounting domain, mathematical invariants, and application orchestration (Sagas). Keeps infrastructure and external integrations decoupled behind strict adapters and interfaces."}
            </p>
          </div>
        </div>

        {/* PostgreSQL */}
        <div className="rounded-2xl border border-slate-300 bg-slate-50/40 p-6 hover:border-slate-400 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 grid place-items-center text-xl flex-shrink-0">
                <SiPostgresql />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-base font-bold text-slate-950">PostgreSQL (pgx + SQLC)</h4>
                <span className="text-[11px] font-mono text-slate-500 block truncate">internal/ledger/adapters/postgres</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt"
                ? "Fonte autoritativa do estado financeiro e fronteira transacional única do ledger contábil. Centraliza partidas dobradas, reservas temporárias (holds), idempotência e a tabela de Transactional Outbox em transações ACID."
                : "Authoritative financial source of truth and transactional boundary for ledger postings, holds, idempotency, and the Transactional Outbox table within ACID transactions."}
            </p>
          </div>
        </div>

        {/* AWS SNS */}
        <div className="rounded-2xl border border-slate-300 bg-slate-50/40 p-6 hover:border-slate-400 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 grid place-items-center text-xl flex-shrink-0">
                <TbBrandAws />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-base font-bold text-slate-950">AWS SNS (Fanout)</h4>
                <span className="text-[11px] font-mono text-slate-500 block truncate">internal/ledger/adapters/sns</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt"
                ? "Responsável por fanout e desacoplamento assíncrono. Distribui eventos de domínio contábeis para múltiplos consumidores independentes sem acoplamento direto ou concorrência com o caminho de escrita."
                : "Handles asynchronous fanout and pub/sub decoupling. Distributes domain events to multiple independent consumers without direct coupling or write-path contention."}
            </p>
          </div>
        </div>

        {/* AWS SQS */}
        <div className="rounded-2xl border border-slate-300 bg-slate-50/40 p-6 hover:border-slate-400 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 grid place-items-center text-xl flex-shrink-0">
                <FiLayers />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-base font-bold text-slate-950">AWS SQS (+ DLQ)</h4>
                <span className="text-[11px] font-mono text-slate-500 block truncate">internal/ledger/adapters/sqs</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt"
                ? "Buffer de vazão e isolamento de consumidores. Oferece retries exponenciais e segregação automática de mensagens venenosas na Dead Letter Queue, impedindo que falhas em projeções travem o processamento contábil."
                : "Provides buffering and consumer isolation. Enables exponential retries and automatic poison message quarantine in Dead Letter Queues, protecting the core flow from downstream failure."}
            </p>
          </div>
        </div>

        {/* DynamoDB */}
        <div className="rounded-2xl border border-slate-300 bg-slate-50/40 p-6 hover:border-slate-400 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 grid place-items-center text-xl flex-shrink-0">
                <FiDatabase />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-base font-bold text-slate-950">DynamoDB (CQRS)</h4>
                <span className="text-[11px] font-mono text-slate-500 block truncate">internal/ledger/adapters/dynamo</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt"
                ? "Read model do CQRS para consultas frequentes de saldo e histórico. Projeta visões desnormalizadas com escrita condicional e versionamento monotônico, escalando leituras sem onerar o banco transacional."
                : "CQRS read model for high-concurrency balance and statement lookups. Projects denormalized views with conditional versioning, scaling reads independently from the transactional ledger."}
            </p>
          </div>
        </div>

        {/* OpenTelemetry */}
        <div className="rounded-2xl border border-slate-300 bg-slate-50/40 p-6 hover:border-slate-400 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 grid place-items-center text-xl flex-shrink-0">
                <SiOpentelemetry />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-base font-bold text-slate-950">OpenTelemetry + slog</h4>
                <span className="text-[11px] font-mono text-slate-500 block truncate">internal/platform/observability</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt"
                ? "Correlação contextual ponta a ponta. Propaga trace context através da requisição HTTP, orquestração de Saga, relay do Outbox e consumidores SQS assíncronos com structured logging em Go."
                : "End-to-end distributed context correlation. Injects and propagates trace contexts across HTTP requests, Saga orchestration, Outbox relay, and async SQS consumers with Go structured logging."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
