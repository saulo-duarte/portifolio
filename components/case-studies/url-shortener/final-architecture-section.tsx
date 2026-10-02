"use client";

import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa6";
import { FiActivity, FiBox, FiCloud, FiLock, FiServer, FiShield } from "react-icons/fi";
import { SiGrafana, SiKubernetes, SiOpentelemetry, SiPostgresql, SiPrometheus, SiRedis } from "react-icons/si";
import type { Locale } from "@/components/portfolio";

type Copy = { pt: string; en: string };
type Node = { label: Copy; detail: Copy; icon: IconType; tone?: "aws" | "blue" };

const edge: Node[] = [
  { label: { pt: "Route 53", en: "Route 53" }, detail: { pt: "DNS", en: "DNS" }, icon: FaAws, tone: "aws" },
  { label: { pt: "CloudFront", en: "CloudFront" }, detail: { pt: "Cache na borda", en: "Edge cache" }, icon: FiCloud, tone: "aws" },
  { label: { pt: "AWS WAF", en: "AWS WAF" }, detail: { pt: "Proteção HTTP", en: "HTTP protection" }, icon: FiShield, tone: "aws" },
  { label: { pt: "ALB", en: "ALB" }, detail: { pt: "Entrada HTTP", en: "HTTP entry" }, icon: FiServer, tone: "aws" },
];

const telemetry: Node[] = [
  { label: { pt: "OTel Collector", en: "OTel Collector" }, detail: { pt: "Sinais da API", en: "API signals" }, icon: SiOpentelemetry },
  { label: { pt: "CloudWatch", en: "CloudWatch" }, detail: { pt: "Logs e alarmes", en: "Logs and alarms" }, icon: FaAws, tone: "aws" },
  { label: { pt: "Managed Prometheus", en: "Managed Prometheus" }, detail: { pt: "Métricas", en: "Metrics" }, icon: SiPrometheus },
  { label: { pt: "Managed Grafana", en: "Managed Grafana" }, detail: { pt: "Dashboards", en: "Dashboards" }, icon: SiGrafana },
];

function NodeCard({ node, locale }: { node: Node; locale: Locale }) {
  const Icon = node.icon;
  const accent = node.tone === "aws" ? "text-amber-700" : "text-sky-700";
  return (
    <div className="min-w-0 border border-slate-300 bg-white p-2.5">
      <div className="flex items-center gap-2.5">
        <Icon className={`shrink-0 text-sm ${accent}`} />
        <div className="min-w-0">
          <strong className="block text-xs font-bold leading-tight text-slate-950">{node.label[locale]}</strong>
          <span className="block text-[11px] leading-tight text-slate-600">{node.detail[locale]}</span>
        </div>
      </div>
    </div>
  );
}

export function FinalArchitectureSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";

  return (
    <section id="final-architecture" className="scroll-mt-28 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="block text-sm font-medium text-slate-500">06 · {pt ? "Arquitetura final" : "Final architecture"}</span>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {pt ? <>Proposta de <span className="text-sky-600">produção na AWS</span></> : <>AWS <span className="text-sky-600">production proposal</span></>}
          </h2>
        </div>
        <span className="border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
          {pt ? "Referência · Não provisionada" : "Reference · Not provisioned"}
        </span>
      </div>

      <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
        {pt
          ? "O laboratório praticou Helm, Deployment, Service, probes, ConfigMap e Secret em um nó local. Este desenho compacto mostra a evolução proposta, não recursos já implementados."
          : "The lab practiced Helm, Deployment, Service, probes, ConfigMap, and Secret on one local node. This compact design shows the proposed evolution, not implemented resources."}
      </p>

      {/* Main Square Card Container without Shadow */}
      <div className="border border-slate-300 bg-white p-5 sm:p-6" aria-label={pt ? "Diagrama de arquitetura AWS proposta" : "Proposed AWS architecture diagram"}>
        <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_1.35fr_1fr]">
          {/* Borda */}
          <div className="space-y-2.5">
            <span className="block text-[11px] font-bold text-amber-900">{pt ? "Borda" : "Edge"}</span>
            <div className="grid grid-cols-2 gap-2.5">
              {edge.map((node) => (
                <NodeCard key={node.label.en} node={node} locale={locale} />
              ))}
            </div>
          </div>

          {/* Amazon EKS */}
          <div className="border-y border-slate-300 py-4 lg:border-y-0 lg:border-x lg:border-dashed lg:border-sky-400 lg:px-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-900">
                <SiKubernetes className="text-sky-700" /> Amazon EKS · Multi-AZ
              </span>
              <span className="text-[11px] font-medium text-slate-500">{pt ? "privado" : "private"}</span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-[1.25fr_1fr]">
              <div className="border border-slate-300 bg-white p-3">
                <div className="flex items-center gap-2">
                  <FiBox className="text-sky-700 shrink-0" />
                  <strong className="text-xs font-bold text-slate-950">URL Shortener API</strong>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                  {pt
                    ? "Deployment + ClusterIP. Mínimo de duas réplicas distribuídas entre zonas."
                    : "Deployment + ClusterIP. At least two replicas distributed across zones."}
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="border border-slate-300 bg-white p-2.5 text-[11px] text-slate-600">
                  <strong className="flex items-center gap-1.5 font-bold text-slate-900">
                    <FiActivity className="text-sky-700" /> HPA
                  </strong>
                  <span className="mt-0.5 block">{pt ? "CPU e taxa de requisições" : "CPU and request rate"}</span>
                </div>
                <div className="border border-slate-300 bg-white p-2.5 text-[11px] text-slate-600">
                  <strong className="block font-bold text-slate-900">PDB + IRSA + ECR</strong>
                  <span className="mt-0.5 block">{pt ? "continuidade, IAM e imagens" : "continuity, IAM, and images"}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-dashed border-slate-300 pt-2.5 text-[11px] text-slate-600">
              <FiLock className="text-sky-700 shrink-0" />
              <span>
                <strong className="text-slate-900">Secrets Manager + External Secrets</strong> · {pt ? "segredos fora da imagem" : "secrets outside the image"}
              </span>
            </div>
          </div>

          {/* Dados */}
          <div className="space-y-2.5">
            <span className="block text-[11px] font-bold text-sky-900">{pt ? "Dados" : "Data"}</span>
            <div className="border border-slate-300 bg-white p-3">
              <div className="flex items-start gap-2.5">
                <SiPostgresql className="mt-0.5 text-blue-700 shrink-0" />
                <div>
                  <strong className="block text-xs font-bold text-slate-950">Amazon RDS PostgreSQL</strong>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-600">
                    {pt ? "Writer Multi-AZ + standby síncrono." : "Multi-AZ writer + synchronous standby."}
                  </span>
                </div>
              </div>
              <div className="ml-1 mt-2.5 border-l-2 border-dashed border-sky-400 pl-2.5 text-[11px] leading-snug text-slate-600">
                <strong className="text-slate-900">Read replicas</strong> · {pt ? "analytics e leituras que aceitam lag." : "analytics and lag-tolerant reads."}
              </div>
            </div>
            <NodeCard
              node={{
                label: { pt: "ElastiCache Redis", en: "ElastiCache Redis" },
                detail: { pt: "Replication group para o cache", en: "Replication group for cache" },
                icon: SiRedis,
              }}
              locale={locale}
            />
          </div>
        </div>

        {/* Observabilidade */}
        <div className="mt-5 border-t border-dashed border-slate-300 pt-4">
          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold text-sky-900">
            <FiActivity className="text-sky-700" />
            <span>{pt ? "Observabilidade · Linhas tracejadas" : "Observability · Dashed signals"}</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {telemetry.map((node) => (
              <NodeCard key={node.label.en} node={node} locale={locale} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        {pt
          ? "Conexões tracejadas representam automação, replicação assíncrona ou telemetria. A topologia não afirma disponibilidade, latência ou infraestrutura existentes."
          : "Dashed connections represent automation, asynchronous replication, or telemetry. The topology does not claim existing availability, latency, or infrastructure."}
      </p>
    </section>
  );
}
