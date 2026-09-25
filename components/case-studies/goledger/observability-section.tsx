"use client";

import type { Locale } from "@/components/portfolio";
import { FiCheckCircle } from "react-icons/fi";

export function ObservabilitySection({ locale }: { locale: Locale }) {
  const pillars = [
    {
      num: "01",
      title: {
        pt: "Distributed Tracing & Context Propagation",
        en: "Distributed Tracing & Context Propagation",
      },
      tech: "OpenTelemetry → Jaeger",
      tag: "W3C trace context",
      question: {
        pt: "Onde a transação ficou lenta ou falhou?",
        en: "Where did the transaction slow down or fail?",
      },
      desc: {
        pt: "Cada requisição recebe ou herda um trace_id, propagado pelo context.Context do Go entre HTTP, Saga, PostgreSQL, Outbox, SNS e consumidores SQS. Assim, uma única operação financeira pode ser reconstruída ponta a ponta mesmo atravessando fronteiras assíncronas.",
        en: "Every request receives or inherits a trace_id, propagated via Go's context.Context across HTTP, Saga, PostgreSQL, Outbox, SNS, and SQS consumers. A single financial operation can be reconstructed end-to-end even across asynchronous boundaries.",
      },
      benefits: [
        { pt: "Localização rápida da etapa responsável pela latência", en: "Rapid localization of the stage causing latency" },
        { pt: "Correlação entre processamento síncrono e assíncrono", en: "Correlation between synchronous and asynchronous processing" },
        { pt: "Rastreamento de uma operação através de serviços, banco e filas", en: "Tracing a single operation across services, databases, and queues" },
      ],
    },
    {
      num: "02",
      title: {
        pt: "Structured Logs & Correlation",
        en: "Structured Logs & Correlation",
      },
      tech: "Go slog · JSON",
      tag: "PII Sanitization",
      question: {
        pt: "O que aconteceu com esta operação?",
        en: "What happened to this operation?",
      },
      desc: {
        pt: "Logs JSON carregam identificadores de negócio e contexto técnico — como wallet_id, idempotency_key, hold_id e trace_id — permitindo correlacionar eventos operacionais sem depender de mensagens de texto livres. Campos sensíveis são sanitizados antes da emissão.",
        en: "JSON logs carry business identifiers and technical context — such as wallet_id, idempotency_key, hold_id, and trace_id — enabling operational correlation without relying on unstructured text. Sensitive fields are masked prior to emission.",
      },
      benefits: [
        { pt: "Investigação por identificadores de negócio", en: "Troubleshooting by business domain identifiers" },
        { pt: "Correlação direta com traces", en: "Direct correlation with distributed traces" },
        { pt: "Suporte à investigação de incidentes e reconciliação operacional", en: "Incident investigation and operational reconciliation support" },
      ],
    },
    {
      num: "03",
      title: {
        pt: "Metrics, SLOs & Resilience Signals",
        en: "Metrics, SLOs & Resilience Signals",
      },
      tech: "Prometheus · RED",
      tag: "Circuit Breaker",
      question: {
        pt: "O sistema está degradando?",
        en: "Is the system degrading?",
      },
      desc: {
        pt: "Métricas RED — Rate, Errors e Duration — acompanham os caminhos críticos da aplicação. Quando dependências externas apresentam degradação persistente, o Circuit Breaker interrompe temporariamente novas chamadas, protegendo capacidade, conexões e goroutines enquanto a dependência se recupera.",
        en: "RED metrics — Rate, Errors, and Duration — monitor critical application paths. When external dependencies suffer persistent degradation, the Circuit Breaker temporarily halts downstream calls, protecting capacity, connections, and goroutines while the dependency recovers.",
      },
      benefits: [
        { pt: "Rate, error rate e latency dos caminhos críticos", en: "Rate, error rate, and latency across critical paths" },
        { pt: "Estado e transições do Circuit Breaker", en: "Circuit Breaker states and state transitions" },
        { pt: "Métricas para alertas, SLOs e dashboards", en: "Telemetry for alerts, SLO monitoring, and dashboards" },
        { pt: "Visibilidade da saúde do pipeline assíncrono", en: "Health visibility of asynchronous messaging pipelines" },
      ],
    },
  ];

  return (
    <section id="observability" className="scroll-mt-28">
      {/* Section Header */}
      <div className="mb-10">
        <span className="text-sm font-medium text-slate-500 block mb-1.5">
          07 · {locale === "pt" ? "Operação & Observabilidade" : "Operations & Observability"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          {locale === "pt"
            ? "Observabilidade como parte da arquitetura"
            : "Observability as part of the architecture"}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {locale === "pt"
            ? "Visibilidade ponta a ponta e resiliência sob carga"
            : "End-to-end visibility and resilience under load"}
        </p>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {locale === "pt"
            ? "Em um sistema distribuído, uma transação atravessa múltiplas fronteiras antes de ser concluída. O GoLedger propaga contexto, correlaciona eventos e instrumenta seus caminhos críticos para permitir diagnóstico de falhas, auditoria operacional e detecção de degradação."
            : "In a distributed system, a transaction crosses multiple boundaries before completion. GoLedger propagates context, correlates events, and instruments critical paths to enable root cause diagnosis, operational auditability, and degradation detection."}
        </p>
      </div>

      {/* 3 Operational Question Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => {
          return (
            <div
              key={pillar.num}
              className="rounded-2xl border border-slate-300 bg-slate-50/50 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-400 hover:bg-white transition-all shadow-2xs space-y-5 group"
            >
              <div className="space-y-4">
                {/* Tech / Standard Badge Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200/80 px-2.5 py-1 rounded-md">
                    {pillar.tech}
                  </span>
                  <span className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                    {pillar.tag}
                  </span>
                </div>

                {/* Number & Title */}
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-xl sm:text-2xl font-black text-slate-950 tracking-tighter select-none flex-shrink-0 group-hover:text-sky-600 transition-colors">
                    {pillar.num}
                  </span>
                  <span className="text-slate-400 font-bold select-none">—</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
                    {pillar.title[locale]}
                  </h3>
                </div>

                {/* Operational Question */}
                <div className="bg-sky-50/80 border border-sky-200/70 rounded-lg px-3 py-2">
                  <span className="text-[11px] font-bold text-sky-900 block font-mono uppercase tracking-wider mb-0.5">
                    {locale === "pt" ? "Pergunta Operacional" : "Operational Question"}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    &ldquo;{pillar.question[locale]}&rdquo;
                  </p>
                </div>

                {/* Technical Explanation */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.desc[locale]}
                </p>
              </div>

              {/* Signals / Benefits Checklist */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono">
                  {locale === "pt" ? "Garantias & Sinais" : "Guarantees & Signals"}
                </span>
                {pillar.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <FiCheckCircle className="text-sky-600 mt-0.5 flex-shrink-0 text-sm" />
                    <span>{b[locale]}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
