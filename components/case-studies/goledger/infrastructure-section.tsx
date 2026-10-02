"use client";

import Image from "next/image";
import { FiLock, FiTrendingUp } from "react-icons/fi";
import { SiHelm, SiKubernetes } from "react-icons/si";
import type { Locale } from "@/components/portfolio";

export function InfrastructureSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";

  return (
    <section
      id="infrastructure"
      className="scroll-mt-28 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-14 sm:py-20 bg-slate-100/80 border-y border-slate-300"
    >
      {/* Top Header: 2 Columns (Text + Gopher Captain Illustration) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-sm font-medium text-slate-500 block">
            06 · {pt ? "Infraestrutura & Kubernetes" : "Infrastructure & Kubernetes"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            {pt ? (
              <>
                Deploy resiliente e
                <br />
                orquestração prática
                <br />
                <span className="text-sky-600">com Kubernetes & Helm</span>
              </>
            ) : (
              <>
                Resilient deployment and
                <br />
                hands-on orchestration
                <br />
                <span className="text-sky-600">with Kubernetes & Helm</span>
              </>
            )}
          </h2>
          <p className="pt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {pt
              ? "Mais do que apenas rodar containers, a camada de orquestração foi construída como um laboratório prático no repositório para dominar padrões reais de produção: probes de ciclo de vida com drenagem zero-loss, empacotamento declarativo com Helm, auto-scaling horizontal e segurança de defesa em profundidade."
              : "More than just running containers, the orchestration layer was implemented as a hands-on exploration to master production standards: zero-loss pod lifecycle draining, declarative Helm packaging, horizontal auto-scaling, and defense-in-depth security."}
          </p>
        </div>

        {/* Right Illustration: Gopher Captain with Container Ship */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/3]">
            <Image
              src="/images/goledger-k8s-gopher.png"
              alt={
                pt
                  ? "Ilustração do Gopher capitão no navio de containers do Kubernetes"
                  : "Illustration of Gopher captain on a Kubernetes container cargo ship"
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
        {/* Quadrant 1: Top-Left - Probes & Graceful Shutdown */}
        <div className="pb-10 md:pb-12 md:pr-12 border-b border-slate-300 md:border-r space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 grid place-items-center text-lg shrink-0">
              <SiKubernetes />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                01
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Probes & Graceful Shutdown" : "Probes & Graceful Shutdown"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Handlers dedicados em Go atendem às Startup, Liveness e Readiness probes (/healthz/ready e /healthz/live). Durante um rollout, o Kubernetes envia o sinal SIGTERM e dispara o hook preStop (sleep 5) para que o Ingress remova o pod do balanceamento antes que o processo pare de aceitar conexões, concedendo até 30s de terminação graciosa para drenar transações atômicas pendentes."
              : "Dedicated Go handlers serve Startup, Liveness, and Readiness probes (/healthz/ready and /healthz/live). During a rolling update, Kubernetes sends SIGTERM and triggers a preStop hook (sleep 5) to remove the pod from Ingress routing tables before terminating, allowing a 30s graceful grace period to drain in-flight atomic transactions."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Implementado no repositório" : "Implemented in repository"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Configurado em <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">deploy/k8s/deployment.yaml</code> com <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">terminationGracePeriodSeconds: 30</code>, garantindo zero transações cortadas no meio durante atualizações contínuas.</>
              ) : (
                <>Configured in <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">deploy/k8s/deployment.yaml</code> with <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">terminationGracePeriodSeconds: 30</code>, preventing aborted financial transactions during zero-downtime deploys.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 2: Top-Right - Helm Chart Packaging */}
        <div className="pt-10 md:pt-0 pb-10 md:pb-12 md:pl-12 border-b border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <SiHelm />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                02
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Empacotamento com Helm" : "Helm Chart Packaging"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Para evitar a duplicação de dezenas de arquivos YAML estáticos entre ambientes, foi construído um Chart Helm modular. Todas as variáveis de réplicas, limites de CPU/memória, anotações de Ingress e endpoints de serviços são parametrizadas centralmente no values.yaml, viabilizando deploys automatizados e reprodutíveis em um único comando."
              : "To eliminate duplicating dozens of static YAML files across environments, a modular Helm chart was created. Replicas, CPU/memory limits, Ingress annotations, and service endpoints are parameterized through values.yaml, enabling automated, reproducible deployments with a single command."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Implementado no repositório" : "Implemented in repository"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Estrutura completa em <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">deploy/helm/goledge</code> contendo templates parametrizados de Deployment, Service, HPA, PDB, ConfigMap e Secrets para isolamento entre dev, staging e prod.</>
              ) : (
                <>Complete chart under <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">deploy/helm/goledge</code> templating Deployment, Service, HPA, PDB, ConfigMap, and Secrets for clean dev/staging/prod isolation.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 3: Bottom-Left - Elasticidade com HPA & PDB */}
        <div className="pt-10 md:pt-12 pb-10 md:pb-0 md:pr-12 border-b md:border-b-0 md:border-r border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 grid place-items-center text-lg shrink-0">
              <FiTrendingUp />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                03
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Elasticidade & Alta Disponibilidade (HPA & PDB)" : "Elasticity & High Availability (HPA & PDB)"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "O Horizontal Pod Autoscaler ajusta a contagem de réplicas da API com base no consumo real de CPU e memória. Para garantir que manutenções no nó ou atualizações do cluster nunca causem indisponibilidade temporária no serviço financeiro, um PodDisruptionBudget impõe que sempre exista ao menos uma réplica saudável em execução."
              : "The Horizontal Pod Autoscaler dynamically scales API pod replicas based on CPU and memory utilization. To ensure cluster node drains or cloud maintenance events never degrade financial availability, a PodDisruptionBudget enforces that at least one healthy replica remains operational at all times."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Implementado no repositório" : "Implemented in repository"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Manifestos <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">hpa.yaml</code> (escala automática de 2 a 10 réplicas sob 70% CPU) e <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">pdb.yaml</code> (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">minAvailable: 1</code>) para SLA contínuo.</>
              ) : (
                <>Configured in <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">hpa.yaml</code> (auto-scales 2-10 replicas at 70% CPU target) and <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">pdb.yaml</code> (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">minAvailable: 1</code>) for continuous SLA.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 4: Bottom-Right - ConfigMaps, Secrets & Segurança */}
        <div className="pt-10 md:pt-12 md:pl-12 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 grid place-items-center text-lg shrink-0">
              <FiLock />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                04
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "ConfigMaps, Secrets & Segurança Não-Root" : "ConfigMaps, Secrets & Non-Root Security"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Prática rigorosa do princípio de menor privilégio (Least Privilege): credenciais do PostgreSQL e chaves de acesso AWS nunca são hardcoded nem mantidas na imagem Docker, sendo injetadas como Secrets criptografadas. Parâmetros de portas, logs e timeouts são carregados via ConfigMaps, enquanto os containers executam como usuário não-root com filesystem somente leitura."
              : "Strict enforcement of the Least Privilege principle: PostgreSQL credentials and AWS keys are never hardcoded in Docker images, mounted as encrypted Secrets. Ports, logging levels, and timeouts load via ConfigMaps, while pods execute under non-root user contexts with read-only root filesystems."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Implementado no repositório" : "Implemented in repository"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Manifestos <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">configmap.yaml</code> e <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">secret.yaml</code> com <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">securityContext.runAsNonRoot: true</code>, em total conformidade com padrões de conformidade bancária.</>
              ) : (
                <>Configured via <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">configmap.yaml</code> and <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">secret.yaml</code> with <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">securityContext.runAsNonRoot: true</code>, meeting modern fintech security benchmarks.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
