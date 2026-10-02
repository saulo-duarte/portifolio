"use client";

import Image from "next/image";
import { FiActivity, FiCheckCircle, FiClock, FiDatabase, FiShield, FiTerminal, FiZap } from "react-icons/fi";
import { SiKubernetes } from "react-icons/si";
import type { Locale } from "@/components/portfolio";

export function ResilienceSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";

  return (
    <section id="resilience" className="scroll-mt-28 space-y-12">
      {/* 1. Top Header: 2 Columns with Cartoon Gopher on Operations / Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-sm font-medium text-slate-500 block">
            05 · {pt ? "Matriz de resiliência" : "Resilience matrix"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            {pt ? (
              <>
                Como o serviço reage
                <br />
                a <span className="text-sky-600">falhas locais</span>
              </>
            ) : (
              <>
                How the service reacts
                <br />
                to <span className="text-sky-600">local failures</span>
              </>
            )}
          </h2>
          <p className="pt-1 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {pt
              ? "Os testes locais cobrem Redis indisponível, timeout de PostgreSQL, limitação de concorrência e read repair modelado. Redis falha aberto; limiter e limite de concorrência são opt-in e ficam desligados por padrão."
              : "Local tests cover Redis unavailability, PostgreSQL timeouts, concurrency limiting, and modeled read repair. Redis fails open; the limiter and concurrency limit are opt-in and disabled by default."}
          </p>
        </div>

        {/* Right Illustration: Gopher in Monitoring Ops Room */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/3]">
            <Image
              src="/images/url-shortener-ops-gopher.jpg"
              alt={
                pt
                  ? "Ilustração do Gopher operador monitorando dashboards de resiliência e Kubernetes"
                  : "Illustration of Gopher ops engineer monitoring resilience dashboards and Kubernetes"
              }
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* 2. Editorial 2x2 Grid with Cross Separator */}
      <div className="grid grid-cols-1 md:grid-cols-2 pt-2">
        {/* Quadrant 1: Redis Unavailable (Fail-Open) */}
        <div className="pb-10 md:pb-12 md:pr-12 border-b border-slate-300 md:border-r space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiDatabase />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                01
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Redis Indisponível (Fail-Open)" : "Redis Outage (Fail-Open)"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Quando Redis está indisponível no teste local, a leitura segue para o PostgreSQL. O rate limiter em Lua também foi desenhado para falhar aberto, evitando transformar uma falha do cache em bloqueio de requisições."
              : "When Redis is unavailable in the local test, the read proceeds to PostgreSQL. The Lua rate limiter is also designed to fail open, avoiding turning a cache failure into blocked requests."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Resultado observado localmente" : "Locally observed result"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>O cenário verifica o fallback e expõe um contador de degradação na telemetria; não mede disponibilidade do serviço.</>
              ) : (
                <>The scenario verifies fallback and exposes a degraded-state counter in telemetry; it does not measure service availability.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 2: Slow Postgres (Context Deadline) */}
        <div className="pt-10 md:pt-0 pb-10 md:pb-12 md:pl-12 border-b border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiClock />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                02
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "PostgreSQL Lento (Context Deadline)" : "Slow Database (Context Deadline)"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "No cenário de PostgreSQL lento, uma consulta usa deadline de 50 ms e é cancelada em torno desse limite. O objetivo é limitar quanto tempo uma operação pode ocupar recursos; o teste não mede saturação de produção."
              : "In the slow-PostgreSQL scenario, a query uses a 50 ms deadline and is canceled around that limit. The goal is to bound how long an operation can occupy resources; the test does not measure production saturation."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Limite do teste" : "Test limit"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>O deadline é verificado localmente; o comportamento sob locks, carga prolongada e múltiplos hosts não foi medido.</>
              ) : (
                <>The deadline is verified locally; behavior under locks, prolonged load, and multiple hosts was not measured.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 3: Surges & Load Shedding */}
        <div className="pt-10 md:pt-12 pb-10 md:pb-0 md:pr-12 border-b md:border-b-0 md:border-r border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiShield />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                03
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Pico Súbito & Load Shedding" : "Sudden Surge & Load Shedding"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Quando ativado, o limitador rejeita requisições acima do limite sem criar fila: responde HTTP 503 com Retry-After e X-Load-Shed. A configuração padrão mantém esse controle desligado."
              : "When enabled, the limiter rejects requests above the limit without creating a queue: it returns HTTP 503 with Retry-After and X-Load-Shed. The default configuration keeps this control disabled."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Comportamento sob sobrecarga" : "Behavior under overload"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>O comportamento validado é a rejeição acima do limite configurado; não há conclusão sobre picos de produção.</>
              ) : (
                <>The validated behavior is rejection above the configured limit; there is no conclusion about production spikes.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 4: Read Repair & Replica Healing */}
        <div className="pt-10 md:pt-12 md:pl-12 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiCheckCircle />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                04
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Réplica Dessincronizada (Read Repair)" : "Stale Replica (Read Repair)"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "No modelo in-process de replicação, uma leitura de quórum identifica versões antigas e agenda read repair para a réplica representada. Isso ilustra a sequência de recuperação; não há réplicas de banco em execução."
              : "In the in-process replication model, a quorum read identifies old versions and schedules read repair for the represented replica. This illustrates the recovery sequence; no database replicas are running."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Escopo do read repair" : "Read-repair scope"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>O teste verifica a atualização do estado modelado, não convergência ou recuperação de um cluster real.</>
              ) : (
                <>The test verifies modeled-state updates, not convergence or recovery in a real cluster.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function KubernetesSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";

  return (
    <section id="kubernetes" className="scroll-mt-28 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-slate-500 block">
          06 · {pt ? "Infraestrutura & Kubernetes" : "Infrastructure & Kubernetes"}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
          {pt ? (
            <>
              Execução local com
              <br />
              <span className="text-sky-600">Kubernetes e Helm</span>
            </>
          ) : (
            <>
              Local execution with
              <br />
              <span className="text-sky-600">Kubernetes and Helm</span>
            </>
          )}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          {pt
              ? "Um cluster Docker Desktop de um nó serve como ambiente de prática para Deployment, Service, probes, ConfigMap e Secret. Ele não representa uma topologia corporativa ou um ambiente de produção."
              : "A one-node Docker Desktop cluster is a practice environment for Deployment, Service, probes, ConfigMap, and Secret. It does not represent an enterprise topology or production environment."}
        </p>
      </div>

      {/* Kubernetes 2-Column Editorial Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        {/* Left: Manifest & Deployment Details */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-300 bg-white p-6 sm:p-7 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-xl grid place-items-center shrink-0">
                <SiKubernetes />
              </span>
              <div>
                <strong className="text-slate-950 font-bold text-base block">url-shortener chart</strong>
                <p className="text-xs font-mono text-slate-500">
                  {pt ? "Helm v3 · Docker Desktop Kubernetes · 1 node lab" : "Helm v3 · Docker Desktop Kubernetes · 1 node lab"}
                </p>
              </div>
            </div>

            {/* 4 Feature Spec Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <strong className="block text-xs font-bold text-slate-950">Deployment + Service</strong>
                <span className="mt-1 block font-mono text-[11px] text-slate-500">ClusterIP · port 8080</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <strong className="block text-xs font-bold text-slate-950">Health Probes</strong>
                <span className="mt-1 block font-mono text-[11px] text-slate-500">/healthz · /readyz</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <strong className="block text-xs font-bold text-slate-950">ConfigMap & Secrets</strong>
                <span className="mt-1 block font-mono text-[11px] text-slate-500">{pt ? "Injeção externa segura" : "Secure external injection"}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <strong className="block text-xs font-bold text-slate-950">Security Context</strong>
                <span className="mt-1 block font-mono text-[11px] text-slate-500">non-root user · read-only root</span>
              </div>
            </div>
          </div>

          {/* Terminal Command */}
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <FiTerminal className="text-sky-400 text-sm" />
              <span className="text-sky-300 font-semibold">{pt ? "Comando de deploy / upgrade" : "Deploy / upgrade command"}</span>
            </div>
            <code className="text-slate-300 block overflow-x-auto text-[11px] leading-relaxed">
              helm upgrade --install url-shortener ./deploy/helm/url-shortener -n url-shortener -f ./deploy/helm/values-local.yaml
            </code>
          </div>
        </div>

        {/* Right: Architectural Rationales */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs space-y-2">
            <span className="text-xs font-bold text-sky-700 block">
              {pt ? "Dependências locais" : "Local dependencies"}
            </span>
            <h4 className="text-base font-bold text-slate-950">
              {pt ? "Aplicação no cluster; dados fora dele" : "App in cluster; data outside it"}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {pt
                ? "PostgreSQL, Redis e MiniStack são dependências locais fora do cluster. O Pod da aplicação as acessa durante os testes; não há serviços gerenciados nem infraestrutura de nuvem neste ambiente."
                : "PostgreSQL, Redis, and MiniStack are local dependencies outside the cluster. The application Pod accesses them during tests; there are no managed services or cloud infrastructure in this environment."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              {pt ? "Escopo explícito de infraestrutura" : "Explicit infrastructure scope"}
            </span>
            <h4 className="text-base font-bold text-slate-950">
              {pt ? "Limites do ambiente" : "Environment limits"}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {pt
                ? "O cluster de um nó permite praticar o ciclo de vida do Helm, probes de liveness/readiness e injeção de configuração. Ele não prova HA, autoscaling, balanceamento externo ou IAM de workload."
                : "The one-node cluster supports practicing the Helm lifecycle, liveness/readiness probes, and configuration injection. It does not prove HA, autoscaling, external load balancing, or workload IAM."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
