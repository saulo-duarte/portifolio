"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiDocker,
  SiGithubactions,
  SiKubernetes,
  SiMongodb,
  SiMysql,
  SiOpentelemetry,
  SiPostgresql,
  SiPrometheus,
  SiRedis,
  SiTerraform,
  SiTypescript,
} from "react-icons/si";
import { FaJava, FaGithub, FaLinkedin, FaAws } from "react-icons/fa6";
import { TbBrandAws, TbBrandGolang, TbGitBranch, TbRoute2 } from "react-icons/tb";
import { FiActivity, FiBarChart2, FiBox, FiCheck, FiCloud, FiCode, FiDatabase, FiGitPullRequest, FiLayers, FiPlay, FiRefreshCw, FiShield, FiTrendingUp } from "react-icons/fi";
import { cn } from "@/lib/utils";

import { GoledgerCaseStudy } from "@/components/case-studies/goledger";
import { UrlShortenerCaseStudy } from "@/components/case-studies/url-shortener";
import { GoledgerHeader, BrazilFlag, UsaFlag } from "@/components/case-studies/goledger/nav-tabs";
import { UrlShortenerHeader } from "@/components/case-studies/url-shortener/nav-header";

export type Locale = "pt" | "en";
type Slug = "goledge" | "url-shortener";

const wording = {
  pt: {
    projects: "Projetos",
    profile: "Stack & Bio",
    cv: "CV",
    viewProject: "Explorar case study",
    caseStudies: "Case Studies",
    caseTitle: "Casos de Estudo & Engenharia de Sistemas",
    caseLead: "",
    bioTitle: "Saulo Duarte",
    bioSubtitle: "Software Engineer · Distributed Systems & Backend",
    bioText: "Engenheiro de software focado em sistemas distribuídos, serviços em Go e arquitetura de nuvem na AWS. Construo projetos com foco prático em integridade e consistência de dados, resiliência a falhas, concorrência e observabilidade em produção.",
    stackHeader: "engineering.stack",
    stackSub: "runtime & infrastructure profile",
    contactTitle: "Vamos conversar sobre engenharia de sistemas.",
    contactText: "Aberto para discutir arquitetura, sistemas distribuídos, oportunidades e trocar ideias técnicas.",
    footerLead: "Engenharia de software focada em sistemas distribuídos, Go, PostgreSQL e infraestrutura cloud resiliente.",
    architecture: "Arquitetura interativa",
    evidence: "Evidências",
    implementation: "Implementação",
    decision: "Decisão",
    repository: "Ver repositório",
    allProjects: "← Todos os projetos",
    context: "Contexto",
    stack: "Stack",
    selectedNode: "Componente selecionado",
    source: "Fonte",
    readFlow: "Redirect path",
    writeFlow: "Create path",
  },
  en: {
    projects: "Projects",
    profile: "Stack & Bio",
    cv: "CV",
    viewProject: "Explore case study",
    caseStudies: "Case Studies",
    caseTitle: "Engineering Case Studies & System Design",
    caseLead: "",
    bioTitle: "Saulo Duarte",
    bioSubtitle: "Software Engineer · Distributed Systems & Backend",
    bioText: "Software engineer focused on distributed systems, Go services, and cloud architecture on AWS. I build projects emphasizing data consistency, failure resilience, concurrency, and production observability.",
    stackHeader: "engineering.stack",
    stackSub: "runtime & infrastructure profile",
    contactTitle: "Let's talk about systems engineering.",
    contactText: "Open to discussing software architecture, distributed systems, opportunities, and technical exchange.",
    footerLead: "Software engineering focused on distributed systems, Go, PostgreSQL, and resilient cloud infrastructure.",
    architecture: "Interactive architecture",
    evidence: "Evidence",
    implementation: "Implementation",
    decision: "Decision",
    repository: "View repository",
    allProjects: "← All projects",
    context: "Context",
    stack: "Stack",
    selectedNode: "Selected component",
    source: "Source",
    readFlow: "Redirect path",
    writeFlow: "Create path",
  },
};

const techLayers = [
  {
    layer: "Languages & Core",
    icon: FiCode,
    items: [
      { name: "Go", icon: TbBrandGolang, color: "text-cyan-400" },
      { name: "Java", icon: FaJava, color: "text-orange-400" },
      { name: "TypeScript", icon: SiTypescript, color: "text-blue-400" },
    ],
  },
  {
    layer: "Databases & Storage",
    icon: FiDatabase,
    items: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "text-sky-400" },
      { name: "MySQL", icon: SiMysql, color: "text-blue-300" },
      { name: "DynamoDB", icon: FaAws, color: "text-amber-400" },
      { name: "Redis", icon: SiRedis, color: "text-red-400" },
      { name: "MongoDB", icon: SiMongodb, color: "text-emerald-400" },
    ],
  },
  {
    layer: "Cloud & Infrastructure",
    icon: FiCloud,
    items: [
      { name: "AWS", icon: TbBrandAws, color: "text-amber-400" },
      { name: "Kubernetes", icon: SiKubernetes, color: "text-blue-400" },
      { name: "Docker", icon: SiDocker, color: "text-sky-400" },
      { name: "Terraform", icon: SiTerraform, color: "text-purple-400" },
    ],
  },
  {
    layer: "Observability & Reliability",
    icon: FiBarChart2,
    items: [
      { name: "GitHub Actions", icon: SiGithubactions, color: "text-slate-200" },
      { name: "OpenTelemetry", icon: SiOpentelemetry, color: "text-blue-400" },
      { name: "Prometheus", icon: SiPrometheus, color: "text-orange-500" },
    ],
  },
];

const projects = {
  goledge: {
    title: "GoLedger",
    kicker: {
      pt: "Ledger financeiro distribuído",
      en: "Distributed financial ledger",
    },
    categories: ["Distributed Systems", "Event-Driven", "Financial Systems"],
    cover: "/images/goledge-hero.png",
    alt: "Ilustração editorial de um ledger distribuído com eventos confiáveis",
    role: "Backend & Platform Engineering",
    format: "Distributed systems case study",
    focus: "Financial correctness & event delivery",
    techEvidence: "Go · PostgreSQL · DynamoDB · AWS",
    tags: [["Go", TbBrandGolang], ["PostgreSQL", SiPostgresql], ["AWS", TbBrandAws], ["Kubernetes", SiKubernetes], ["Terraform", SiTerraform]] as [string, IconType][],
    copy: {
      pt: {
        summary: "Ledger imutável, Saga de pagamento persistida e failover seguro entre gateways simulados, com reconciliação idempotente de resultados incertos.",
        problem: "Operações financeiras não podem duplicar efeitos, perder eventos ou tratar uma projeção otimizada como verdade contábil. O projeto separa a consistência crítica do ledger das leituras derivadas e dos efeitos assíncronos.",
        architecture: "PostgreSQL persiste ledger, holds, tentativas idempotentes e outbox. Falha antes do envio permite usar o standby; após timeout, a Saga consulta o mesmo provedor e conserva o hold até reconciliar ou exigir revisão.",
        stack: "Go, net/http, chi, PostgreSQL, pgx, SQLC, SNS/SQS, DynamoDB, OpenTelemetry, Prometheus, Terraform, Kubernetes e Helm."
      },
      en: {
        summary: "An immutable ledger and persistent payment Saga with safe failover between mock gateways and idempotent reconciliation of uncertain outcomes.",
        problem: "Financial operations cannot duplicate effects, lose events or treat an optimized projection as accounting truth. The project separates critical ledger consistency from derived reads and asynchronous effects.",
        architecture: "PostgreSQL persists the ledger, holds, idempotent attempts, and outbox. A failure before submission can use standby; after a timeout, the Saga queries the same provider and keeps the hold until it reconciles or requires review.",
        stack: "Go, net/http, chi, PostgreSQL, pgx, SQLC, SNS/SQS, DynamoDB, OpenTelemetry, Prometheus, Terraform, Kubernetes and Helm."
      },
    },
    evidence: [["ACID ledger", "Balanced postings, immutable financial facts and compensating reversals."], ["Safe retries", "Idempotency keys reuse valid results and reject conflicting requests."], ["Async delivery", "Transactional outbox avoids a database-write-plus-publish dual write."]],
  },
  "url-shortener": {
    title: "URL Shortener",
    kicker: {
      pt: "Laboratório de sistemas distribuídos",
      en: "Distributed systems laboratory",
    },
    categories: ["Go", "Caching", "Resilience"],
    cover: "/images/url-shortener-cover-cartoon.png",
    alt: "Ilustração de um encurtador de URLs e seu caminho de redirect",
    role: "Backend Engineering",
    format: "Distributed systems case study",
    focus: "Read-heavy redirect path",
    techEvidence: "Go · PostgreSQL · Redis · Kubernetes · Helm",
    tags: [["Go", TbBrandGolang], ["Redis", SiRedis], ["PostgreSQL", SiPostgresql], ["Kubernetes", SiKubernetes], ["Terraform", SiTerraform]] as [string, IconType][],
    copy: {
      pt: {
        summary: "Encurtador em Go usado para estudar um caminho de leitura: cache, filtro de Bloom, controles opt-in e simuladores locais de sharding, quorum e roteamento regional.",
        problem: "O redirect é muito mais frequente que a criação de URLs. O desafio é reduzir leituras no PostgreSQL sem tornar o Redis fonte da verdade, e estudar como distribuição, carga e falhas mudam as garantias do sistema.",
        architecture: "O write path valida a URL, gera um ID, codifica um short code Base62 e persiste no PostgreSQL. O redirect consulta cache e faz fallback ao PostgreSQL. Simulações isoladas comparam sharding, quorum, rate limiting e roteamento regional sem apresentá-los como um cluster de produção.",
        stack: "Go, PostgreSQL, Redis, SQLC, MiniStack, Terraform, Docker, OpenTelemetry, Prometheus, Kubernetes e Helm."
      },
      en: {
        summary: "A Go URL shortener used to study a read path: caching, Bloom filters, opt-in controls, and local simulators for sharding, quorum, and regional routing.",
        problem: "Redirects greatly outnumber URL creation. The challenge is to reduce PostgreSQL reads without making Redis the source of truth, while studying how distribution, load, and failures change system guarantees.",
        architecture: "The write path validates a URL, generates an ID, encodes a Base62 short code, and persists it in PostgreSQL. Redirects check cache and fall back to PostgreSQL. Isolated simulations compare sharding, quorum, rate limiting, and regional routing without presenting them as a production cluster.",
        stack: "Go, PostgreSQL, Redis, SQLC, MiniStack, Terraform, Docker, OpenTelemetry, Prometheus, Kubernetes, and Helm."
      },
    },
    evidence: [["99.52%", "Observed cache hit ratio in the local hot-key run (EXP-0004)."], ["1,050 → 5", "PostgreSQL queries with Cache Aside enabled in that same run."], ["15.6%", "Local throughput increase after warm-up; machine-specific, not an SLO."]],
  },
} as const;

export function Header({ locale }: { locale: Locale }) {
  const c = wording[locale];
  const root = locale === "pt" ? "/pt" : "/en";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs transition-all">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between pointer-events-auto transition-all">
        {/* Left: Brand logo */}
        <Link className="flex items-center gap-2.5 group" href={root}>
          <span className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200/80 text-sky-700 font-bold text-xs grid place-items-center shadow-2xs group-hover:bg-sky-200/70 transition-colors">
            SL
          </span>
          <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">saulo.dev</span>
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Main navigation">
          <Link href={`${root}#projects`} className="hover:text-slate-950 transition-colors">
            {c.projects}
          </Link>
          <Link href={`${root}#profile`} className="hover:text-slate-950 transition-colors">
            {c.profile}
          </Link>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-950 transition-colors inline-flex items-center gap-1"
          >
            <span>{c.cv}</span>
            <span className="text-[11px] text-slate-400">↗</span>
          </a>
        </nav>

        {/* Right: GitHub & Language Switcher */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/saulo-duarte"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-2xs transition-all"
          >
            <FaGithub className="text-sm text-slate-800" />
            <span>GitHub</span>
          </a>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Lang switcher pill with country flags */}
          <div className="inline-flex p-0.5 rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold shadow-2xs">
            <Link
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-xs font-medium",
                locale === "pt"
                  ? "bg-white text-slate-950 font-bold shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              )}
              href="/pt"
            >
              <BrazilFlag className="w-4 h-3 rounded-2xs overflow-hidden shadow-2xs" />
              <span>PT</span>
            </Link>
            <Link
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-xs font-medium",
                locale === "en"
                  ? "bg-white text-slate-950 font-bold shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              )}
              href="/en"
            >
              <UsaFlag className="w-4 h-3 rounded-2xs overflow-hidden shadow-2xs" />
              <span>EN</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer({ locale = "pt" }: { locale?: Locale }) {
  const root = locale === "pt" ? "/pt" : "/en";
  const c = wording[locale];
  return (
    <footer className="border-t border-slate-300 bg-slate-100/80 text-slate-600 mt-12 sm:mt-16">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-950 font-mono text-base">
                saulo.dev
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-xs font-mono text-slate-500">
                Software Engineer
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              {c.footerLead}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
            <Link
              href={`${root}/projects/goledge`}
              className="text-slate-600 hover:text-slate-950 transition-colors"
            >
              GoLedger
            </Link>
            <Link
              href={`${root}/projects/url-shortener`}
              className="text-slate-600 hover:text-slate-950 transition-colors"
            >
              URL Shortener
            </Link>
            <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />
            <a
              href="https://github.com/saulo-duarte"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-slate-950 transition-colors inline-flex items-center gap-1"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/sauloduart/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-slate-950 transition-colors inline-flex items-center gap-1"
            >
              LinkedIn ↗
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-950 transition-colors inline-flex items-center gap-1"
            >
              {c.cv} ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const c = wording[locale];
  const root = locale === "pt" ? "/pt" : "/en";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-sky-100 selection:text-sky-900">
      <Header locale={locale} />
      <main className="pt-20 sm:pt-24">
        {/* DIRECT PROFILE & TECH STACK SECTION */}
        <section id="profile" className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8 items-stretch">
            {/* Left Column: Direct Bio & Photo */}
            <div className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-xs">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mb-5">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-900 shrink-0 shadow-sm ring-4 ring-slate-100">
                    <Image
                      src="/images/saulo.png"
                      alt="Saulo Leandro Ferreira Duarte"
                      fill
                      priority
                      unoptimized
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-mono text-slate-500 font-medium">
                      saulo.dev · perfil
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                      Saulo Leandro Ferreira Duarte
                    </h1>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-sky-700 bg-sky-50 border border-sky-200/90 px-2.5 py-1 rounded-lg mt-1 w-fit shadow-2xs">
                      <span className="text-sky-600 font-bold">&gt;_</span>
                      <span>{c.bioSubtitle}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-[14.5px] leading-relaxed text-slate-600 mb-6">
                  {c.bioText}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-slate-100 mt-auto">
                <a
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
                  href="https://github.com/saulo-duarte"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub className="text-sm text-slate-900" />
                  <span>GitHub</span>
                  <span className="text-xs opacity-75">↗</span>
                </a>
                <a
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
                  href="https://www.linkedin.com/in/sauloduart/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin className="text-sm text-sky-700" />
                  <span>LinkedIn</span>
                  <span className="text-xs opacity-75">↗</span>
                </a>
              </div>
            </div>

            {/* Right Column: Engineering Tech Stack Panel */}
            <div
              className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-800/90 bg-slate-950 text-slate-100 shadow-sm"
              aria-label="Technical stack overview"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-slate-600 mx-1">|</span>
                  <code className="text-sky-400 text-xs font-semibold font-mono">{c.stackHeader}</code>
                </div>
                <small className="font-mono text-xs text-slate-400">{c.stackSub}</small>
              </div>

              <div className="flex flex-col gap-4 justify-between h-full">
                {techLayers.map((layer) => (
                  <div
                    key={layer.layer}
                    className="flex items-start gap-3.5 pb-3 border-b border-slate-800/60 last:border-b-0 last:pb-0"
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-sky-400 shrink-0 mt-0.5 shadow-2xs">
                      <layer.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-300 mb-2 font-mono tracking-tight">
                        {layer.layer}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {layer.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <span
                              key={item.name}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg font-mono hover:border-slate-600 transition-colors shadow-2xs"
                            >
                              <ItemIcon className={cn("text-xs sm:text-sm shrink-0", item.color)} />
                              <span>{item.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CASE STUDIES SECTION */}
        <section id="projects" className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-mono font-medium text-sky-700">
                // {c.caseStudies}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 mt-1">
                {c.caseTitle}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <ProjectCard locale={locale} slug="goledge" />
            <ProjectCard locale={locale} slug="url-shortener" />
          </div>
        </section>

      </main>
      <Footer locale={locale} />
    </div>
  );
}

function ProjectCard({ locale, slug }: { locale: Locale; slug: Slug }) {
  const p = projects[slug];
  const root = locale === "pt" ? "/pt" : "/en";
  const pt = locale === "pt";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        className="group flex flex-col h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white hover:border-sky-400/80 hover:shadow-xl transition-all duration-300"
        href={`${root}/projects/${slug}`}
      >
        {/* Cover Image Container with Floating Meta Pill */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-950">
          <Image
            src={p.cover}
            alt={p.alt}
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            priority={slug === "goledge"}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

          {/* Floating Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="text-[11px] font-mono font-bold text-white bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 shadow-sm">
              CASE 0{slug === "goledge" ? "1" : "2"}
            </span>
            <span className="text-[11px] font-mono font-medium text-sky-200 bg-sky-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-sky-400/20 shadow-sm">
              {p.role}
            </span>
          </div>

          {/* Bottom Floating Kicker */}
          <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
            <span className="text-xs font-mono font-semibold text-white/90 drop-shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>{p.kicker[locale]}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-1 p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-950 group-hover:text-sky-700 transition-colors">
              {p.title}
            </h3>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            {p.copy[locale].summary}
          </p>

          {/* Bottom Tech Badges and CTA */}
          <div className="flex items-center justify-between gap-3 mt-auto pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              {p.tags.map(([name, TagIcon]) => {
                const iconColor =
                  name === "Go"
                    ? "text-[#00ADD8]"
                    : name === "PostgreSQL"
                    ? "text-[#4169E1]"
                    : name === "AWS"
                    ? "text-[#FF9900]"
                    : name === "Kubernetes"
                    ? "text-[#326CE5]"
                    : name === "Terraform"
                    ? "text-[#7B42BC]"
                    : name === "Redis"
                    ? "text-[#DC382D]"
                    : "text-slate-700";

                return (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200/90 px-2.5 py-1 rounded-md shadow-2xs"
                  >
                    <TagIcon className={cn("text-sm shrink-0", iconColor)} />
                    <span>{name}</span>
                  </span>
                );
              })}
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform shrink-0">
              <span>{wording[locale].viewProject}</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectPage({ locale, slug }: { locale: Locale; slug: Slug }) {
  return slug === "goledge" ? <CaseFrame locale={locale} slug="goledge"><GoledgerCaseStudy locale={locale} /></CaseFrame> : <ShortenerCaseStudy locale={locale} />;
}

function CaseFrame({ locale, slug, children }: { locale: Locale; slug: Slug; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-sky-100 selection:text-sky-900">
      {slug === "goledge" ? (
        <GoledgerHeader locale={locale} />
      ) : (
        <UrlShortenerHeader locale={locale} />
      )}
      <main className="pt-14 sm:pt-16">
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}

function ShortenerCaseStudy({ locale }: { locale: Locale }) {
  return <CaseFrame locale={locale} slug="url-shortener"><UrlShortenerCaseStudy locale={locale}/></CaseFrame>;
}
