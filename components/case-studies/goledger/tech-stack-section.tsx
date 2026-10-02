"use client";

import { SiJaeger, SiPostgresql, SiTerraform } from "react-icons/si";
import { TbBrandAws, TbBrandGolang, TbDatabase } from "react-icons/tb";
import type { Locale } from "@/components/portfolio";

export function TechStackSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";

  return (
    <section id="tech-stack" className="scroll-mt-28">
      {/* Header */}
      <div className="mb-10">
        <span className="text-sm font-medium text-slate-500 block mb-1.5">
          05 · {pt ? "Stack Tecnológico" : "Tech Stack"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          {pt ? "A escolha da stack" : "The stack choice"}
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {pt
            ? "Cada tecnologia foi escolhida por justificativas concretas de engenharia: eficiência sob alta concorrência, garantias transacionais estritas, infraestrutura reproduzível e rastreabilidade distribuída."
            : "Every technology was selected based on concrete engineering criteria: efficiency under high concurrency, strict transactional guarantees, reproducible infrastructure, and distributed traceability."}
        </p>
      </div>

      {/* 3x2 Open Layout with Continuous Cross Separator */}
      <div className="grid grid-cols-1 md:grid-cols-2 pt-2">
        {/* Item 1: Top-Left - Go */}
        <div className="pb-10 md:pb-12 md:pr-12 border-b border-slate-300 md:border-r space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 grid place-items-center text-lg shrink-0">
              <TbBrandGolang />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                01
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                Go (net/http + chi)
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Linguagem compilada de tipagem estática que gera binários enxutos empacotados em contêineres distroless de apenas ~18MB. Seu modelo de concorrência com goroutines (~2KB de stack inicial) e channels processa milhares de conexões simultâneas com uso mínimo de memória, enquanto a biblioteca padrão madura (net/http, context, sync) dispensa frameworks pesados."
              : "Compiled statically-typed language producing lightweight ~18MB distroless containers. Native concurrency via lightweight goroutines (~2KB stack) and channels handles thousands of concurrent requests with low memory footprint, while a mature standard library (net/http, context, sync) avoids bulky frameworks."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Por que foi escolhido" : "Why it was chosen"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Alta vazão com latência determinística. O Garbage Collector moderno do Go foca em pausas sub-milissegundo (&lt;1ms) e a linguagem favorece alocação em stack via <em>escape analysis</em>, reduzindo drasticamente a pressão no heap durante transferências financeiras críticas.</>
              ) : (
                <>High throughput with deterministic latencies. Go's modern GC achieves sub-millisecond pauses (&lt;1ms) while value types and escape analysis keep memory allocations on the stack, minimizing heap pressure during high-throughput financial workflows.</>
              )}
            </p>
          </div>
        </div>

        {/* Item 2: Top-Right - PostgreSQL */}
        <div className="pt-10 md:pt-0 pb-10 md:pb-12 md:pl-12 border-b border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 grid place-items-center text-lg shrink-0">
              <SiPostgresql />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                02
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                PostgreSQL (pgx + SQLC)
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "A modelagem relacional do PostgreSQL é imbatível para o domínio financeiro: permite constraints de integridade referencial rígidas (FKs), check constraints para garantir saldos não negativos, índices parciais para idempotência e tipos monetários exatos. O driver pgx com SQLC compila SQL puro em código Go tipado, eliminando a lentidão e imprevisibilidade de ORMs."
              : "PostgreSQL's relational modeling is unmatched for financial ledgers: strict foreign keys, check constraints preventing negative balance states, partial indexes for idempotency, and exact monetary types. The pgx driver and SQLC compile pure SQL into type-safe Go code, eliminating the overhead and unpredictability of ORMs."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Por que foi escolhido" : "Why it was chosen"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Conformidade ACID estrita com locks pessimistas (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded border border-sky-200/60">SELECT FOR UPDATE</code>) e gravação atômica na tabela <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded border border-sky-200/60">outbox_events</code> dentro da mesma transação, garantindo consistência sem distributed transactions.</>
              ) : (
                <>Strict ACID compliance with row-level locks (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded border border-sky-200/60">SELECT FOR UPDATE</code>) and atomic writes to <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded border border-sky-200/60">outbox_events</code> in the same transaction, ensuring consistency without distributed transactions.</>
              )}
            </p>
          </div>
        </div>

        {/* Item 3: Middle-Left - AWS SNS + SQS */}
        <div className="pt-10 md:pt-12 pb-10 md:pb-12 md:pr-12 border-b border-slate-300 md:border-r space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 grid place-items-center text-lg shrink-0">
              <TbBrandAws />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                03
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                AWS SNS + SQS
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Dupla serverless totalmente gerenciada que fornece mensageria assíncrona desacoplada de altíssima durabilidade (multi-AZ) sem o fardo operacional de configurar, clusterizar e manter corretores Kafka. O SNS faz fanout instantâneo de cada evento contábil para múltiplos tópicos assinantes, enquanto as filas SQS garantem bufferização elástica contra picos de tráfego."
              : "Fully managed serverless messaging pair delivering multi-AZ durability without the operational burden of provisioning and maintaining Kafka clusters. SNS instantly fans out domain events to multiple decoupled subscribers, while SQS queues buffer traffic spikes elastically."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Por que foi escolhido" : "Why it was chosen"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Isolamento de falhas e resiliência: retentativas automáticas exponenciais com jitter e Dead Letter Queues (DLQ) garantem que falhas temporárias em consumidores secundários nunca travem o write path do ledger financeiro.</>
              ) : (
                <>Fault isolation and resilience: automated exponential backoff with jitter and Dead Letter Queues (DLQ) ensure downstream consumer disruptions never block the primary ledger write path.</>
              )}
            </p>
          </div>
        </div>

        {/* Item 4: Middle-Right - DynamoDB */}
        <div className="pt-10 md:pt-12 pb-10 md:pb-12 md:pl-12 border-b border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 grid place-items-center text-lg shrink-0">
              <TbDatabase />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                04
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                Amazon DynamoDB
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Banco NoSQL chave-valor desenhado para responder com latência previsível de sub-milissegundo em leituras de chave primária, independentemente de ter 1 milhão ou 1 bilhão de registros. Sua escalabilidade horizontal automática particionada por hash e capacidade on-demand dispensam dimensionamento manual de instâncias."
              : "NoSQL key-value database engineered for predictable sub-millisecond primary key lookups, whether storing 1 million or 1 billion records. Its hash-partitioned horizontal scalability and on-demand capacity eliminate manual cluster provisioning and sizing."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Por que foi escolhido" : "Why it was chosen"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Desacoplamento absoluto de leitura (CQRS): milhões de consultas de saldo e extrato são atendidas pelo DynamoDB via escritas condicionais versionadas (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded border border-sky-200/60">version + 1</code>), sem consumir pool de conexões nem IOPS do PostgreSQL contábil.</>
              ) : (
                <>Complete read decoupling (CQRS): millions of balance and statement queries are served with single-digit millisecond latency via versioned conditional writes (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded border border-sky-200/60">version + 1</code>), shielding PostgreSQL from read saturation.</>
              )}
            </p>
          </div>
        </div>

        {/* Item 5: Bottom-Left - Terraform */}
        <div className="pt-10 md:pt-12 pb-10 md:pb-0 md:pr-12 border-b md:border-b-0 md:border-r border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 grid place-items-center text-lg shrink-0">
              <SiTerraform />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                05
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                Terraform (IaC)
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Toda a infraestrutura de nuvem é declarada como código de forma reprodutível, versionável e imutável. Módulos dedicados provisionam filas SQS, tópicos SNS, tabelas DynamoDB, políticas IAM com privilégio mínimo e recursos de rede sem intervenção manual no console da AWS."
              : "Entire cloud infrastructure is declared as reproducible, version-controlled, immutable code. Dedicated modules provision SQS queues, SNS topics, DynamoDB tables, least-privilege IAM policies, and VPC networking without manual AWS console interventions."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Por que foi escolhido" : "Why it was chosen"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Confiabilidade de provisionamento: previne drift de configuração entre ambientes (staging/produção), viabiliza auditoria de infraestrutura via Git e permite recriar o ambiente financeiro inteiro de forma determinística em minutos.</>
              ) : (
                <>Provisioning predictability: prevents configuration drift across staging and production environments, enables infrastructure GitOps auditability, and provisions complete environments deterministically in minutes.</>
              )}
            </p>
          </div>
        </div>

        {/* Item 6: Bottom-Right - Jaeger */}
        <div className="pt-10 md:pt-12 md:pl-12 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 grid place-items-center text-lg shrink-0">
              <SiJaeger />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                06
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                Jaeger (Distributed Tracing)
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Plataforma de tracing distribuído padrão CNCF integrada via OpenTelemetry SDK em Go. Permite rastrear o caminho completo de cada centavo em tempo real: desde o handshake HTTP na API, passando pelos locks e queries do PostgreSQL, até a entrega nas filas SQS e gravação no DynamoDB."
              : "CNCF-standard distributed tracing platform integrated via OpenTelemetry Go SDK. Tracks the end-to-end journey of each transactional call in real time: from HTTP ingress API handshakes, through PostgreSQL row-locks and queries, to asynchronous SQS dispatch and DynamoDB projection writes."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Por que foi escolhido" : "Why it was chosen"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Visibilidade ponta a ponta e depuração de latência: correlaciona <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded border border-sky-200/60">trace_id</code> entre fronteiras assíncronas, identificando gargalos em milissegundos e eliminando pontos cegos em orquestrações complexas.</>
              ) : (
                <>End-to-end visibility and latency profiling: correlates <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded border border-sky-200/60">trace_id</code> across asynchronous boundaries, surfacing microsecond bottlenecks and eliminating blind spots in complex orchestrations.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
