"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import { SiGithubactions, SiKubernetes, SiOpentelemetry, SiPostgresql, SiPrometheus, SiRedis, SiTerraform } from "react-icons/si";
import { TbBrandAws, TbBrandGolang, TbGitBranch, TbRoute2 } from "react-icons/tb";
import { FiActivity, FiBox, FiCheck, FiDatabase, FiGitPullRequest, FiLayers, FiPlay, FiRefreshCw, FiShield, FiTrendingUp } from "react-icons/fi";
import { cn } from "@/lib/utils";

import { FaGithub } from "react-icons/fa6";
import { GoledgerCaseStudy } from "@/components/case-studies/goledger";
import { GoledgerHeader, BrazilFlag, UsaFlag } from "@/components/case-studies/goledger/nav-tabs";

export type Locale = "pt" | "en";
type Slug = "goledge" | "url-shortener";

const wording = {
  pt: { projects: "Projetos", skills: "Especialidades", cv: "CV", viewProject: "Explorar estudo de caso", caseStudies: "Estudos de caso", caseTitle: "Projetos que tornam decisões de engenharia visíveis.", caseLead: "Arquitetura, trade-offs, telemetria e resultados mensurados — sem transformar complexidade em discurso vazio.", expertise: "Foco técnico", architecture: "Arquitetura interativa", evidence: "Evidências", implementation: "Implementação", decision: "Decisão", repository: "Ver repositório", allProjects: "← Todos os projetos", context: "Contexto", stack: "Stack", selectedNode: "Componente selecionado", source: "Fonte", readFlow: "Redirect path", writeFlow: "Create path" },
  en: { projects: "Projects", skills: "Expertise", cv: "CV", viewProject: "Explore case study", caseStudies: "Case studies", caseTitle: "Projects that make engineering decisions visible.", caseLead: "Architecture, trade-offs, telemetry and measured outcomes — without turning complexity into empty talk.", expertise: "Technical focus", architecture: "Interactive architecture", evidence: "Evidence", implementation: "Implementation", decision: "Decision", repository: "View repository", allProjects: "← All projects", context: "Context", stack: "Stack", selectedNode: "Selected component", source: "Source", readFlow: "Redirect path", writeFlow: "Create path" },
};

const expertise: { label: string; icon: IconType; tone: string }[] = [
  { label: "Software Engineer", icon: FiBox, tone: "lime" },
  { label: "Golang", icon: TbBrandGolang, tone: "mint" },
  { label: "AWS", icon: TbBrandAws, tone: "orange" },
  { label: "CI/CD", icon: SiGithubactions, tone: "violet" },
  { label: "Terraform", icon: SiTerraform, tone: "purple" },
  { label: "Kubernetes", icon: SiKubernetes, tone: "blue" },
];

const projects = {
  goledge: {
    title: "Goledger", kicker: "Distributed wallet ledger", cover: "/images/goledge-hero.png", alt: "Ilustração editorial de um ledger distribuído com eventos confiáveis",
    role: "Backend & Platform Engineering", format: "Distributed systems case study", focus: "Financial correctness & event delivery",
    tags: [["Go", TbBrandGolang], ["PostgreSQL", SiPostgresql], ["AWS", TbBrandAws], ["Kubernetes", SiKubernetes], ["Terraform", SiTerraform]] as [string, IconType][],
    copy: {
      pt: { summary: "Ledger de carteiras com partidas dobradas, fonte financeira imutável e fluxos de pagamento que assumem falhas como parte do contrato.", problem: "Operações financeiras não podem duplicar efeitos, perder eventos ou tratar uma projeção otimizada como verdade contábil. O projeto separa a consistência crítica do ledger das leituras derivadas e dos efeitos assíncronos.", architecture: "O write path consolida postings, wallets, holds, idempotência e outbox na mesma transação PostgreSQL. A partir daí, eventos seguem para SNS/SQS e atualizam uma projeção DynamoDB sem mudar a fonte da verdade.", stack: "Go, net/http, chi, PostgreSQL, pgx, SQLC, SNS/SQS, DynamoDB, OpenTelemetry, Prometheus, Terraform, Kubernetes e Helm." },
      en: { summary: "A double-entry wallet ledger with immutable financial facts and payment flows designed around failure as a first-class contract.", problem: "Financial operations cannot duplicate effects, lose events or treat an optimized projection as accounting truth. The project separates critical ledger consistency from derived reads and asynchronous effects.", architecture: "The write path commits postings, wallets, holds, idempotency and outbox records in one PostgreSQL transaction. Events then flow through SNS/SQS and update a DynamoDB projection without changing the source of truth.", stack: "Go, net/http, chi, PostgreSQL, pgx, SQLC, SNS/SQS, DynamoDB, OpenTelemetry, Prometheus, Terraform, Kubernetes and Helm." },
    },
    evidence: [["ACID ledger", "Balanced postings, immutable financial facts and compensating reversals."], ["Safe retries", "Idempotency keys reuse valid results and reject conflicting requests."], ["Async delivery", "Transactional outbox avoids a database-write-plus-publish dual write."]],
  },
  "url-shortener": {
    title: "URL Shortener", kicker: "Performance & distributed systems lab", cover: "/images/url-shortener-cover-cartoon.png", alt: "Ilustração editorial de um encurtador de URLs com cache e fallback",
    role: "Backend Engineering", format: "Performance experiment", focus: "Read-heavy redirect path",
    tags: [["Go", TbBrandGolang], ["Redis", SiRedis], ["PostgreSQL", SiPostgresql], ["Prometheus", SiPrometheus], ["Terraform", SiTerraform]] as [string, IconType][],
    copy: {
      pt: { summary: "Serviço de encurtamento de URLs construído como laboratório: cada otimização começa com baseline, hipótese, métrica e ADR.", problem: "Um redirect read-heavy precisa escalar sem transformar o cache em ponto único de falha. O projeto compara estratégias de ID e introduz Cache Aside somente depois de medir o caminho direto ao PostgreSQL.", architecture: "O write path valida a URL, gera o ID, codifica Base62 e persiste no PostgreSQL. O redirect tenta Redis primeiro e faz fallback fail-open para PostgreSQL, populando o cache depois de um miss.", stack: "Go, PostgreSQL, Redis, SQLC, Terraform, MiniStack, OpenTelemetry, Prometheus, testes de integração, fuzzing e load testing." },
      en: { summary: "A URL-shortening service built as a lab: each optimization begins with a baseline, hypothesis, metric and ADR.", problem: "A read-heavy redirect path must scale without making the cache a single point of failure. The project compares ID strategies and introduces Cache Aside only after measuring the direct PostgreSQL path.", architecture: "The write path validates the URL, generates an ID, encodes Base62 and persists in PostgreSQL. Redirects try Redis first and fail open to PostgreSQL, populating the cache after a miss.", stack: "Go, PostgreSQL, Redis, SQLC, Terraform, MiniStack, OpenTelemetry, Prometheus, integration tests, fuzzing and load testing." },
    },
    evidence: [["99.52%", "Observed cache hit ratio after warm-up in the hot-key experiment."], ["1,050 → 5", "PostgreSQL queries with Cache Aside enabled in the measured scenario."], ["15.6%", "Local throughput gain measured after cache warm-up; not a production claim."]],
  },
} as const;

type NodeDetail = { id: string; label: string; short: string; icon: IconType; responsibility: string; decision: string; source: string; code: string };

const goledgeNodes: NodeDetail[] = [
  { id: "client", label: "HTTP Client", short: "POST /checkout", icon: TbRoute2, responsibility: "Envia requisições de pagamento ou consultas de saldo com header Idempotency-Key estável.", decision: "Permite retries seguros na rede sem risco de duplicação contábil.", source: "cmd/api/main.go", code: "POST /payments/checkout HTTP/1.1\nHost: api.goledger.local\nIdempotency-Key: req_98a3bf20\nContent-Type: application/json\n\n{\n  \"wallet_id\": \"w_alice_01\",\n  \"amount_cents\": 15000\n}" },
  { id: "api", label: "Go HTTP API", short: "chi router + mw", icon: TbBrandGolang, responsibility: "Roteia endpoints, propaga trace_id e valida tokens/schemas no limite HTTP.", decision: "Desacopla os handlers HTTP do core de domínio financeiro através de interfaces e DTOs.", source: "internal/ledger/adapters/http/routes.go", code: "r.Route(\"/payments\", func(r chi.Router) {\n  r.Use(httpx.WithIdempotency)\n  r.Post(\"/checkout\", h.HandleCheckout)\n})\nr.Get(\"/wallets/{id}/balance\", h.HandleGetBalance)" },
  { id: "saga", label: "Payment Saga", short: "orchestrator", icon: TbGitBranch, responsibility: "Coordena o workflow distribuído: Hold → Antifraude → Gateway → Capture, acionando Rollback em qualquer falha.", decision: "A orquestração explícita garante compensação imediata sem deixar saldos bloqueados.", source: "internal/ledger/application/saga/payment_saga.go", code: "func (s *PaymentSagaOrchestrator) Execute(ctx context.Context, cmd CheckoutCommand) (*PaymentResult, error) {\n  hold, err := s.holdRepo.CreateHold(ctx, cmd.WalletID, cmd.Amount)\n  if err != nil { return nil, err }\n  \n  if err := s.antiFraud.Evaluate(ctx, hold); err != nil {\n    _ = s.holdRepo.ReleaseHold(ctx, hold.ID) // Compensação\n    return nil, ErrAntiFraudRejected\n  }\n  \n  if err := s.gateway.Charge(ctx, hold); err != nil {\n    _ = s.holdRepo.ReleaseHold(ctx, hold.ID) // Compensação\n    return nil, ErrGatewayFailed\n  }\n  \n  return s.ledger.CaptureHold(ctx, hold.ID)\n}" },
  { id: "breaker", label: "Circuit Breaker", short: "gateway guard", icon: FiShield, responsibility: "Monitora taxa de erro do gateway de pagamento externo e isola falhas em cascata com half-open probing.", decision: "3 falhas consecutivas acionam fail-fast (503 em 0.1ms) protegendo threads e conexões.", source: "internal/platform/resilience/circuit_breaker.go", code: "type CircuitBreaker struct {\n  maxFailures int\n  state       State // Closed | Open | HalfOpen\n  timeout     time.Duration\n}\n// Open: rejeita requisição imediatamente sem onerar dependência externa" },
  { id: "postgres", label: "PostgreSQL", short: "source of truth", icon: SiPostgresql, responsibility: "Única fonte da verdade financeira. Persiste journal entries balanceados (∑ = 0), holds, idempotência e eventos de outbox em uma única transação ACID.", decision: "Elimina dual-write gravando o evento de mensageria dentro do mesmo commit contábil.", source: "internal/ledger/adapters/postgres/transaction_repository.go", code: "BEGIN;\n  -- 1. Cria transação contábil\n  INSERT INTO transactions (id, status) VALUES ($1, 'posted');\n  -- 2. Postings dobrados (Débito e Crédito balanceados)\n  INSERT INTO postings (account_id, amount, direction) VALUES ($2, 15000, 'DEBIT'), ($3, 15000, 'CREDIT');\n  -- 3. Grava evento na tabela outbox no mesmo commit\n  INSERT INTO outbox_events (id, topic, payload) VALUES ($4, 'ledger-events', $5);\nCOMMIT;" },
  { id: "outbox", label: "Outbox Relay", short: "reliable publish", icon: FiGitPullRequest, responsibility: "Worker assíncrono que reivindica eventos pendentes do PostgreSQL e publica no SNS com retry e backoff.", decision: "Evita perda de mensagens mesmo se o broker ou a aplicação caírem.", source: "internal/ledger/application/outbox/relay.go", code: "func (r *Relay) ProcessPending(ctx context.Context) error {\n  events, err := r.repo.ClaimPending(ctx, batchSize, lockTimeout)\n  for _, evt := range events {\n    if err := r.publisher.Publish(ctx, evt); err == nil {\n      r.repo.MarkPublished(ctx, evt.ID)\n    } else {\n      r.repo.ScheduleRetry(ctx, evt.ID, backoff)\n    }\n  }\n}" },
  { id: "sns", label: "AWS SNS", short: "ledger-events topic", icon: TbBrandAws, responsibility: "Tópico de mensageria pub/sub para fanout de eventos contábeis ('wallet.payment.captured').", decision: "Permite adicionar novos serviços consumidores sem alterar o write path financeiro.", source: "internal/ledger/adapters/sns/publisher.go", code: "sns.Publish(ctx, &sns.PublishInput{\n  TopicArn: aws.String(\"arn:aws:sns:us-east-1:000:ledger-events\"),\n  Message:  aws.String(payload),\n  MessageAttributes: map[string]types.MessageAttributeValue{\n    \"event_type\": {DataType: \"String\", StringValue: \"wallet.captured\"},\n  },\n})" },
  { id: "sqs", label: "AWS SQS + DLQ", short: "projection queue", icon: FiLayers, responsibility: "Fila de mensagens com retry automático, visibilidade controlada e Dead Letter Queue após 3 falhas.", decision: "Isola falhas de consumo sem impactar o processamento dos demais eventos.", source: "internal/ledger/adapters/sqs/consumer.go", code: "sqs.ReceiveMessage(ctx, &sqs.ReceiveMessageInput{\n  QueueUrl:            aws.String(queueURL),\n  MaxNumberOfMessages: 10,\n  WaitTimeSeconds:     20,\n})\n// Falhas repetidas > 3 tentativas são direcionadas à DLQ para auditoria" },
  { id: "dynamo", label: "DynamoDB", short: "read projection", icon: FiDatabase, responsibility: "Projeção de leitura CQRS otimizada para consultas sub-milissegundo com controle de versão condicional.", decision: "Read-model desacoplado do PostgreSQL; fallback automático para o PostgreSQL em miss ou leitura forte.", source: "internal/ledger/adapters/dynamo/wallet_balance_repository.go", code: "dynamo.PutItem(ctx, &dynamodb.PutItemInput{\n  TableName: aws.String(\"wallet_balances\"),\n  Item:      item,\n  ConditionExpression: aws.String(\"version < :new_version\"),\n})\n// Fallback: se consistency=strong ou miss, consulta PostgreSQL diretamente" },
];

const shortenerReadNodes: NodeDetail[] = [
  { id: "request", label: "Redirect request", short: "GET /:code", icon: TbRoute2, responsibility: "Valida o short code e inicia o caminho de leitura.", decision: "O endpoint retorna 302 e não segue a URL original durante os experimentos.", source: "internal/adapters/http/handler.go", code: "GET /0000001\n→ 302 Found + Location" },
  { id: "redis", label: "Redis cache", short: "hot path", icon: SiRedis, responsibility: "Procura a URL pela chave url:v1:<short_code>.", decision: "Cache Aside reduz carga no PostgreSQL, mas falha aberta preserva disponibilidade.", source: "internal/adapters/redis/url_cache.go", code: "GET url:v1:<short_code>\nhit → redirect" },
  { id: "fallback", label: "PostgreSQL fallback", short: "source of record", icon: SiPostgresql, responsibility: "Atende misses ou indisponibilidade do Redis e valida expiração.", decision: "Redis é otimização do redirect path; PostgreSQL permanece atendível.", source: "internal/adapters/postgres/repository.go", code: "cache miss → SELECT original_url\nthen populate Redis" },
  { id: "metrics", label: "Telemetry", short: "p50 · p95 · hit ratio", icon: SiPrometheus, responsibility: "Expõe métricas de Redis, HTTP e PostgreSQL para comparar as hipóteses.", decision: "A melhoria é aceita apenas se aparecer em carga reproduzível.", source: "internal/platform/observability", code: "redis_get_total{status=hit|miss}\nhttp_duration_seconds" },
];
const shortenerWriteNodes: NodeDetail[] = [
  { id: "create", label: "Create URL", short: "POST /urls", icon: TbRoute2, responsibility: "Valida URL, expiração opcional e alias customizado.", decision: "O contrato diferencia conflitos, validação e persistência.", source: "internal/adapters/http/handler.go", code: "POST /urls\noriginal_url + custom_code?" },
  { id: "id", label: "ID strategy", short: "sequence · range · snowflake", icon: FiActivity, responsibility: "Compara geração por sequence, range allocation, Redis INCR e Snowflake-like.", decision: "Sequence segue como baseline; alternativas entram para testar o custo de coordenação.", source: "internal/platform/id/snowflake/generator.go", code: "range: reserve 1000 IDs\nsnowflake: node + sequence + time" },
  { id: "base62", label: "Base62", short: "7-char code", icon: TbGitBranch, responsibility: "Converte o ID em um short code compacto de sete caracteres.", decision: "Base62 é codificação explícita, não segurança ou ofuscação.", source: "internal/domain/short_code.go", code: "id → base62\nalphabet: 0-9 a-z A-Z" },
  { id: "store", label: "PostgreSQL", short: "durable record", icon: SiPostgresql, responsibility: "Armazena o registro canônico da URL e suas regras de expiração.", decision: "O registro durável continua independente das otimizações de leitura.", source: "internal/adapters/postgres/repository.go", code: "INSERT urls\nRETURNING short_code" },
];

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
          <Link href={`${root}#projects`} className="text-slate-950 font-semibold border-b-2 border-sky-600 pb-0.5 hover:text-sky-700 transition-colors">
            {c.projects}
          </Link>
          <Link href={`${root}#expertise`} className="hover:text-slate-950 transition-colors">
            {c.skills}
          </Link>
          <Link href={`${root}/cv`} className="hover:text-slate-950 transition-colors">
            {c.cv}
          </Link>
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

export function Footer() {
  return (
    <footer className="border-t border-slate-300 bg-slate-100/80 text-slate-600 mt-16">
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
              Engenharia de software focada em sistemas distribuídos, Go, PostgreSQL e infraestrutura cloud resiliente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
            <Link
              href="/pt/projects/goledge"
              className="text-slate-600 hover:text-slate-950 transition-colors"
            >
              GoLedger
            </Link>
            <Link
              href="/pt/projects/url-shortener"
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
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const c = wording[locale];
  return <div className="site-shell"><Header locale={locale}/><main><section className="container hero hero-professional"><div><div className="eyebrow">Saulo Leandro Ferreira Duarte · Software Engineer</div><h1>{locale === "pt" ? <>Backend distribuído, <em>feito para operar.</em></> : <>Distributed backend, <em>built to operate.</em></>}</h1><p className="hero-lede">{locale === "pt" ? "Especializado em Go, AWS e engenharia de plataformas. Projeto serviços resilientes, observáveis e preparados para evoluir sob carga — da regra de domínio ao deploy." : "Specialized in Go, AWS and platform engineering. I build resilient, observable services designed to evolve under load — from domain rules to deployment."}</p><div className="hero-actions"><a className="button" href="#projects">{locale === "pt" ? "Ver estudos de caso" : "View case studies"} <span className="arrow">↘</span></a><a className="button secondary" href="https://github.com/saulo-duarte" target="_blank" rel="noreferrer">GitHub <span className="arrow">↗</span></a></div></div><div className="hero-terminal" aria-label="Engineering capability summary"><div className="terminal-top"><span/><span/><span/><code>system.profile</code></div><div className="terminal-line"><span>role</span><strong>Software Engineer</strong></div><div className="terminal-line"><span>focus</span><strong>Go · AWS · Distributed Systems</strong></div><div className="terminal-line"><span>practice</span><strong>CI/CD · IaC · Observability</strong></div><div className="terminal-signal"><i/><i/><i/><i/><i/></div><small>production-minded engineering</small></div></section><section id="expertise" className="container expertise-section"><div className="eyebrow">{c.expertise}</div><div className="expertise-grid">{expertise.map(({ label, icon: Icon, tone })=><div className={`expertise-item ${tone}`} key={label}><Icon aria-hidden="true"/><span>{label}</span></div>)}</div></section><section id="projects" className="container section"><div className="section-top"><div><div className="eyebrow">{c.caseStudies}</div><h2 className="section-title">{c.caseTitle}</h2></div><p className="section-intro">{c.caseLead}</p></div><div className="project-grid project-grid-rich"><ProjectCard locale={locale} slug="goledge"/><ProjectCard locale={locale} slug="url-shortener"/></div></section><section className="container section"><div className="cta"><div><div className="eyebrow">{locale === "pt" ? "Disponível para desafios complexos" : "Available for complex challenges"}</div><h2>{locale === "pt" ? "Vamos falar sobre sistemas que precisam continuar funcionando." : "Let’s talk about systems that need to keep working."}</h2></div><a className="button" href="https://www.linkedin.com/in/sauloduart/" target="_blank" rel="noreferrer">LinkedIn <span className="arrow">↗</span></a></div></section></main><Footer/></div>;
}

function ProjectCard({ locale, slug }: { locale: Locale; slug: Slug }) {
  const p = projects[slug]; const root = locale === "pt" ? "" : "/en";
  return <Link className={`project-card project-card-cover ${slug}`} href={`${root}/projects/${slug}`}><div className="project-cover"><Image src={p.cover} alt={p.alt} fill sizes="(max-width: 800px) 100vw, 50vw" priority={slug === "goledge"}/></div><div className="card-content"><div className="card-top"><span className="index">0{slug === "goledge" ? "1" : "2"}</span><span className="card-kicker">{p.kicker}</span></div><h3>{p.title}</h3><p>{p.copy[locale].summary}</p><div className="tech-icons">{p.tags.slice(0, 4).map(([name, Icon])=><span title={name} key={name}><Icon aria-hidden="true"/></span>)}</div><div className="card-link"><span>{wording[locale].viewProject}</span><span className="arrow">↗</span></div></div></Link>;
}

export function ProjectPage({ locale, slug }: { locale: Locale; slug: Slug }) {
  return slug === "goledge" ? <CaseFrame locale={locale} slug="goledge"><GoledgerCaseStudy locale={locale} /></CaseFrame> : <ShortenerCaseStudy locale={locale} />;
}

function CaseFrame({ locale, slug, children }: { locale: Locale; slug: Slug; children: React.ReactNode }) {
  const p = projects[slug];
  const root = locale === "pt" ? "/pt" : "/en";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {slug === "goledge" ? (
        <GoledgerHeader locale={locale} />
      ) : (
        <Header locale={locale} />
      )}
      <main className="pt-20 sm:pt-24">
        {slug !== "goledge" && (
          <section className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <div className="mb-4">
              <Link
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-slate-900 transition-colors"
                href={root}
              >
                ← {locale === "pt" ? "Todos os projetos" : "All projects"}
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-xs">
              <Image
                className="w-full h-auto object-cover max-h-[420px]"
                src={p.cover}
                alt={p.alt}
                width={1480}
                height={440}
                priority
              />
            </div>
          </section>
        )}

        {children}
      </main>
      <Footer />
    </div>
  );
}

function Section({ id, number, label, title, children }: { id: string; number: string; label: string; title: string; children: React.ReactNode }) { return <section id={id} className="case-section"><div className="case-section-label">{number} · {label}</div><h2>{title}</h2>{children}</section>; }
function AssuranceCard({ icon: Icon, title, children }: { icon: IconType; title: string; children: React.ReactNode }) { return <div className="assurance-card"><Icon/><div><strong>{title}</strong><p>{children}</p></div></div>; }

function ShortenerCaseStudy({ locale }: { locale: Locale }) { return <CaseFrame locale={locale} slug="url-shortener"><div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 py-8"><article className="case-article"><Section id="problem" number="01" label="CONTEXTO" title="Otimização é hipótese, não fé."><p className="case-lead">O serviço trata o redirect como caminho quente, mas preserva o PostgreSQL como registro durável. Cache entra depois da medição, e sempre com fallback.</p><div className="assurance-grid"><AssuranceCard icon={FiTrendingUp} title="Medir antes de otimizar">Cada hipótese é registrada em ADR, baseline e experimento reproduzível.</AssuranceCard><AssuranceCard icon={FiActivity} title="Cache sem indisponibilidade">Redis acelera hits; cache miss e falha aberta retornam ao registro canônico.</AssuranceCard><AssuranceCard icon={FiDatabase} title="Dados duráveis">URLs, expiração e códigos persistem no PostgreSQL.</AssuranceCard></div></Section><Section id="architecture" number="02" label="ARQUITETURA" title="Redirect path, cache aside & fallback"><ArchitectureExplorer locale={locale} slug="url-shortener"/></Section><Section id="decisions" number="03" label="DECISÕES" title="Hipóteses transformadas em decisões."><div className="decision-grid">{[["Cache Aside", "Reduz queries no caminho quente sem tornar o cache fonte de verdade."], ["Base62", "Transforma identificadores em códigos compactos e previsíveis."], ["Estratégias de ID", "Compara sequence, range allocation, Redis INCR e Snowflake-like."], ["Telemetry", "P50, p95 e hit ratio decidem se a melhoria continua."], ["Ports & adapters", "Mantém infraestrutura substituível e regras de domínio testáveis."], ["Fail-open", "Indisponibilidade de Redis não impede redirecionamentos."]].map(([title, text], i) => <div key={title}><span>0{i + 1}</span><FiCheck/><strong>{title}</strong><p>{text}</p></div>)}</div></Section><Section id="failures" number="04" label="FALHAS" title="A rota rápida não é um ponto único de falha."><div className="failure-grid"><div><b>1</b><strong>Cache miss</strong><span>PostgreSQL fallback</span><p>Busca o registro canônico e repopula Redis após a leitura.</p></div><div><b>2</b><strong>Redis indisponível</strong><span>Fail-open</span><p>Redirect segue disponível através do banco sem simular um sucesso em cache.</p></div><div><b>3</b><strong>Código inválido</strong><span>Contrato explícito</span><p>Validação, 404 e expiração são tratados antes de qualquer redirect.</p></div></div></Section><Section id="observability" number="05" label="OBSERVABILIDADE" title="O experimento explica cada melhoria."><div className="telemetry"><div className="trace-view"><div><i/> redirect request <small>1ms</small></div><div><i/> Redis get: hit/miss <small>0.4ms</small></div><div><i/> PostgreSQL fallback <small>3.9ms</small></div><div><i/> redirect response <small>302</small></div></div></div></Section><StackSection slug="url-shortener"/><Repository locale={locale} slug="url-shortener"/></article></div></CaseFrame>; }

function StackSection({ slug }: { slug: Slug }) { const rows = [[TbBrandGolang,"Go","API e domínio."],[SiRedis,"Redis","Caminho quente de redirects."],[SiPostgresql,"PostgreSQL","Registro durável."],[SiPrometheus,"OpenTelemetry","Métricas para experimentos."],[SiTerraform,"Terraform","Ambiente reproduzível."]]; return <Section id="stack" number="06" label="STACK" title="Tecnologias com responsabilidade definida."><div className="responsibility-stack">{rows.map(([Icon, name, text]) => { const Tech = Icon as IconType; return <div key={name as string}><Tech/><strong>{name as string}</strong><span>{text as string}</span></div>; })}</div></Section>; }
function Repository({ slug }: { locale?: Locale; slug: Slug }) { const href = slug === "goledge" ? "https://github.com/saulo-duarte/distributed-wallet-ledger" : "https://github.com/saulo-duarte/url-shortener"; return <section className="repository-callout"><div><div className="eyebrow">Source code</div><strong>Veja a implementação e a documentação completa.</strong></div><a className="button secondary" href={href} target="_blank" rel="noreferrer">Ver repositório <span className="arrow">↗</span></a></section>; }

function ArchitectureExplorer({ locale, slug }: { locale: Locale; slug: Slug }) {
  const [flow, setFlow] = useState<"read" | "write">("read");
  const nodes = useMemo(() => flow === "read" ? shortenerReadNodes : shortenerWriteNodes, [flow]);
  const [selectedId, setSelectedId] = useState(nodes[0].id);
  const selected = nodes.find(node => node.id === selectedId) ?? nodes[0]; const SelectedIcon = selected.icon; const c = wording[locale];
  const selectFlow = (next: "read" | "write") => { setFlow(next); setSelectedId((next === "read" ? shortenerReadNodes : shortenerWriteNodes)[0].id); };
  return <div className="architecture-explorer"><div className="architecture-head"><div><div className="eyebrow">{c.architecture}</div><h3>{flow === "read" ? "Redirect with Cache Aside" : "Create URL & short-code generation"}</h3></div>{slug === "url-shortener" && <div className="flow-toggle"><button onClick={() => selectFlow("read")} className={flow === "read" ? "active" : ""}>{c.readFlow}</button><button onClick={() => selectFlow("write")} className={flow === "write" ? "active" : ""}>{c.writeFlow}</button></div>}</div><div className={`architecture-map ${slug}`}><div className="primary-flow">{nodes.slice(0, nodes.length).map((node, index)=><NodeButton key={node.id} node={node} active={selected.id === node.id} onClick={() => setSelectedId(node.id)} connector={index < nodes.length - 1}/>)}</div></div><div className="architecture-detail"><div className="detail-copy"><span className="eyebrow">{c.selectedNode}</span><h4><SelectedIcon aria-hidden="true"/>{selected.label}</h4><p><strong>{locale === "pt" ? "Responsabilidade:" : "Responsibility:"}</strong> {selected.responsibility}</p><div className="decision-box"><span>{c.decision}</span><p>{selected.decision}</p></div></div><div className="code-card"><div><span className="eyebrow">{c.implementation}</span><small>{c.source}: {selected.source}</small></div><pre><code>{selected.code}</code></pre></div></div></div>;
}
function NodeButton({ node, active, onClick, connector }: { node: NodeDetail; active: boolean; onClick: () => void; connector?: boolean }) { const Icon = node.icon; return <><button className={`architecture-node ${active ? "active" : ""}`} onClick={onClick} aria-pressed={active}><Icon aria-hidden="true"/><strong>{node.label}</strong><small>{node.short}</small></button>{connector && <span className="architecture-connector" aria-hidden="true"/>}</>; }

export function CVPage({ locale }: { locale: Locale }) { const root = locale === "pt" ? "/pt" : "/en"; return <div className="site-shell"><Header locale={locale}/><main className="container"><div className="cv-card"><div className="eyebrow">Curriculum vitae</div><h1>{locale === "pt" ? "O próximo capítulo está sendo preparado." : "The next chapter is being prepared."}</h1><p>{locale === "pt" ? "O CV entra aqui assim que você enviar o PDF. A estrutura já está pronta para receber o arquivo sem mudar a navegação." : "The CV will live here as soon as you send the PDF. The structure is ready to receive it without changing the navigation."}</p><Link className="button secondary" href={root}>{locale === "pt" ? "Voltar ao início" : "Back home"} <span className="arrow">↗</span></Link></div></main><Footer/></div>; }
