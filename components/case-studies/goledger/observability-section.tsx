"use client";

import Image from "next/image";
import { FiActivity, FiFileText, FiSearch, FiSliders } from "react-icons/fi";
import { SiJaeger, SiOpentelemetry, SiPrometheus } from "react-icons/si";
import type { Locale } from "@/components/portfolio";

export function ObservabilitySection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";

  return (
    <section id="observability" className="scroll-mt-28">
      {/* Top Header: 2 Columns (Text + Gopher Observability Specialist) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-sm font-medium text-slate-500 block">
            07 · {pt ? "Operação & Observabilidade" : "Operations & Observability"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            {pt ? (
              <>
                Telemetria contínua e
                <br />
                visibilidade ponta a ponta
                <br />
                <span className="text-sky-600">em sistemas distribuídos</span>
              </>
            ) : (
              <>
                Continuous telemetry and
                <br />
                end-to-end visibility
                <br />
                <span className="text-sky-600">in distributed systems</span>
              </>
            )}
          </h2>
          <p className="pt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {pt
              ? "Implementada no pacote internal/platform/observability como pilar fundamental de governança financeira: cada transação tem seu ciclo de vida rastreado por traces W3C, logs estruturados em JSON com correlação automática e métricas RED instrumentadas via Prometheus."
              : "Implemented within internal/platform/observability as a critical financial governance pillar: every transaction lifecycle is traced via W3C trace contexts, correlated structured JSON logs, and RED pattern metrics instrumented through Prometheus."}
          </p>
        </div>

        {/* Right Illustration: Gopher with Monitoring Center */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/3]">
            <Image
              src="/images/goledger-observability-gopher.png"
              alt={
                pt
                  ? "Ilustração do Gopher especialista em observabilidade monitorando dashboards de métricas e traces"
                  : "Illustration of Gopher observability specialist monitoring metric dashboards and traces"
              }
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2x2 Open Layout with Continuous Cross Separator */}
      <div className="grid grid-cols-1 md:grid-cols-2 pt-2">
        {/* Quadrant 1: Top-Left - Distributed Tracing */}
        <div className="pb-10 md:pb-12 md:pr-12 border-b border-slate-300 md:border-r space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 grid place-items-center text-lg shrink-0">
              <SiJaeger />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                01
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                Distributed Tracing (OpenTelemetry & Jaeger)
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Propagação ininterrupta de contexto W3C (trace_id e span_id) através do context.Context em todas as fronteiras assíncronas do sistema: entrada HTTP na API, passos compensatórios da Saga, execução de queries SQL no PostgreSQL, descarte no Outbox e consumo nas filas AWS SQS."
              : "Uninterrupted W3C context propagation (trace_id and span_id) via context.Context across all async system boundaries: HTTP ingress APIs, Saga compensating steps, SQL queries on PostgreSQL, Outbox relay, and AWS SQS message consumption."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Implementado no repositório" : "Implemented in repository"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Tracer provider configurado em <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">internal/platform/observability/tracer.go</code> exportando spans OTLP para o Jaeger, permitindo reconstituir a linha do tempo exata de qualquer transação financeira em milissegundos.</>
              ) : (
                <>Tracer provider configured in <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">internal/platform/observability/tracer.go</code> exporting OTLP spans to Jaeger, reconstructing transaction lifecycles in single-digit milliseconds.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 2: Top-Right - Structured Logging */}
        <div className="pt-10 md:pt-0 pb-10 md:pb-12 md:pl-12 border-b border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiFileText />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                02
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                Structured Logging (Go slog & JSON)
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Uso do pacote nativo log/slog com handler customizado (traceContextHandler) que extrai automaticamente o trace_id do context e o injeta em todas as linhas de log em formato JSON estruturado. Metadados do domínio (wallet_id, idempotency_key, hold_id) acompanham as operações contábeis com sanitização de dados sensíveis."
              : "Adoption of Go's native log/slog with a custom traceContextHandler that automatically extracts trace_id from the context into structured JSON logs. Domain metadata (wallet_id, idempotency_key, hold_id) tracks accounting operations with strict PII sanitization."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Implementado no repositório" : "Implemented in repository"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Implementado em <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">internal/platform/observability/logging.go</code> com correlação direta entre logs e traces, permitindo filtrar no agregador de logs todo o histórico de um pagamento com apenas uma chave de busca.</>
              ) : (
                <>Implemented in <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">internal/platform/observability/logging.go</code> tying logs directly to traces, enabling instant query correlation across high-throughput distributed log aggregators.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 3: Bottom-Left - Métricas RED & Prometheus */}
        <div className="pt-10 md:pt-12 pb-10 md:pb-0 md:pr-12 border-b md:border-b-0 md:border-r border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 grid place-items-center text-lg shrink-0">
              <SiPrometheus />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                03
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                Métricas RED & Prometheus
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Instrumentação com padrão RED (Rate, Errors, Duration) expondo endpoint nativo /metrics para raspagem do Prometheus. Histogramas detalhados registram latências de requisições HTTP, contadores monitoram transações contábeis por moeda e status, e gauges vigiam o volume de reservas ativas (ledger_active_holds_count)."
              : "Instrumentation using the RED pattern (Rate, Errors, Duration) exposing a native /metrics endpoint for Prometheus scraping. Fine-grained histograms capture HTTP latency distribution, counters track posted transactions by status and currency, and gauges monitor ledger_active_holds_count."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Implementado no repositório" : "Implemented in repository"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Estrutura completa em <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">internal/platform/observability/metrics.go</code> com buckets calibrados para latência financeira (de 5ms a 5s) e scrapers configurados em <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">deploy/prometheus/prometheus.yml</code>.</>
              ) : (
                <>Constructed in <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">internal/platform/observability/metrics.go</code> with latency buckets calibrated for financial APIs (5ms to 5s) and scrapers defined in <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">deploy/prometheus/prometheus.yml</code>.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 4: Bottom-Right - Telemetria de Resiliência & Circuit Breaker */}
        <div className="pt-10 md:pt-12 md:pl-12 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 grid place-items-center text-lg shrink-0">
              <FiActivity />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                04
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                Telemetria de Resiliência & Circuit Breaker
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Observabilidade não apenas para diagnóstico, mas como mecanismo ativo de defesa operacional. Métricas dedicadas expõem o estado de abertura dos Circuit Breakers de gateways de pagamento (closed, open, half-open), contagem de mensagens consumidas do SQS e eventos despachados pelo Outbox Relay Worker."
              : "Observability as an active operational defense mechanism, not just post-mortem diagnosis. Dedicated metrics expose payment gateway Circuit Breaker states (closed, open, half-open), SQS consumed throughput, and Outbox Relay Worker dispatch velocity."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Implementado no repositório" : "Implemented in repository"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Gauges <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">ledger_circuit_breaker_state</code> e contadores de <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">circuit_breaker_rejections_total</code> permitindo alertas proativos antes que degradações de parceiros afetem a experiência do usuário.</>
              ) : (
                <>Exposes <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">ledger_circuit_breaker_state</code> gauges and <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">circuit_breaker_rejections_total</code> counters enabling proactive alerts before partner degradation cascades into service outages.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
