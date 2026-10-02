"use client";

import type { Locale } from "@/components/portfolio";
import { FiCheckCircle } from "react-icons/fi";
import { SiPostgresql } from "react-icons/si";
import { TbDatabase } from "react-icons/tb";

export function CapTheoremSection({ locale }: { locale: Locale }) {
  return (
    <section
      id="cap-theorem"
      className="scroll-mt-28 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-14 sm:py-20 bg-slate-100/80 border-y border-slate-300"
    >
      {/* Section Header */}
      <div className="mb-10">
        <span className="text-sm font-medium text-slate-500 block mb-1.5">
          04 · {locale === "pt" ? "Trade-offs Arquiteturais" : "Architectural Trade-offs"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          {locale === "pt"
            ? "Trade-offs entre consistência transacional e escalabilidade de leitura"
            : "Trade-offs between transactional consistency and read scalability"}
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {locale === "pt"
            ? "O GoLedger não exige as mesmas garantias de consistência em todos os caminhos. Escritas financeiras priorizam integridade e serialização, enquanto consultas podem aceitar projeções eventualmente consistentes em troca de escalabilidade e menor acoplamento com o ledger transacional."
            : "GoLedger does not require identical consistency guarantees across all paths. Financial writes prioritize integrity and serialization, while queries can accept eventually consistent projections in exchange for scalability and looser coupling with the transactional ledger."}
        </p>
      </div>

      {/* Cross Confrontation Layout with Central VS Pill */}
      <div className="relative py-6">
        {/* Floating Center VS Badge on Desktop */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <span className="w-10 h-10 rounded-full bg-slate-950 border-2 border-white text-white font-mono text-xs font-black grid place-items-center shadow-md">
            VS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-300">
          
          {/* Left Column: Write Path - Estado Financeiro Autoritativo */}
          <div className="pb-8 md:pb-0 md:pr-10 lg:pr-12 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md">
                  Transactional Consistency
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  <SiPostgresql className="text-blue-700 text-xs" />
                  PostgreSQL
                </span>
              </div>

              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-2xl sm:text-3xl font-black text-slate-950 tracking-tighter select-none">
                  01
                </span>
                <span className="text-slate-400 font-bold select-none">—</span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                  {locale === "pt"
                    ? "Write Path · Estado Financeiro Autoritativo"
                    : "Write Path · Authoritative Financial State"}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt"
                ? "Operações que alteram dinheiro exigem garantias mais fortes. Débitos, créditos e reservas são processados no PostgreSQL dentro de transações ACID, garantindo que uma operação seja aceita integralmente ou rejeitada sem produzir estado financeiro parcial."
                : "Operations that alter money demand stronger guarantees. Debits, credits, and holds are processed in PostgreSQL within ACID transactions, guaranteeing an operation is either accepted in full or rejected without producing partial financial state."}
            </p>

            {/* Invariant / Guarantees Box */}
            <div className="border-l-3 border-emerald-500 bg-emerald-50/70 rounded-r-xl p-3.5 space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-emerald-950 block">
                {locale === "pt" ? "Garantias:" : "Guarantees:"}
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-mono">
                ACID · Row-level locking · Double-entry invariant · Idempotency
              </p>
            </div>

            {/* Bullet List of 3 Key Architectural Decisions */}
            <div className="space-y-3 pt-1 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0 text-sm" />
                <span>
                  <strong className="text-slate-950 block sm:inline">
                    {locale === "pt" ? "Serialização de operações concorrentes: " : "Serialization of concurrent operations: "}
                  </strong>
                  {locale === "pt"
                    ? "Row locks protegem carteiras contra débitos concorrentes incompatíveis."
                    : "Row locks protect accounts against incompatible concurrent debits."}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0 text-sm" />
                <span>
                  <strong className="text-slate-950 block sm:inline">
                    {locale === "pt" ? "Commit atômico com Outbox: " : "Atomic commit with Outbox: "}
                  </strong>
                  {locale === "pt"
                    ? "Ledger e evento são persistidos na mesma transação, eliminando a janela de dual-write."
                    : "Ledger postings and domain events are persisted in the same transaction, eliminating dual-write windows."}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0 text-sm" />
                <span>
                  <strong className="text-slate-950 block sm:inline">
                    {locale === "pt" ? "Fail-safe na escrita: " : "Fail-safe on writes: "}
                  </strong>
                  {locale === "pt"
                    ? "Na ausência das garantias necessárias para realizar a mutação, a operação falha em vez de aceitar estado financeiro inconsistente."
                    : "In the absence of required guarantees to perform a mutation, operations fail rather than accepting inconsistent ledger state."}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Read Path - Projeção Assíncrona */}
          <div className="pt-8 md:pt-0 md:pl-10 lg:pl-12 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200/80 px-2.5 py-1 rounded-md">
                  Eventually Consistent
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  <TbDatabase className="text-sky-600 text-xs" />
                  DynamoDB
                </span>
              </div>

              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-2xl sm:text-3xl font-black text-slate-950 tracking-tighter select-none">
                  02
                </span>
                <span className="text-slate-400 font-bold select-none">—</span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                  {locale === "pt"
                    ? "Read Path · Projeção Assíncrona"
                    : "Read Path · Asynchronous Projection"}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {locale === "pt"
                ? "Consultas de saldo e histórico não precisam participar da mesma fronteira transacional da escrita. Eventos do ledger alimentam uma projeção no DynamoDB, permitindo que o tráfego de leitura escale independentemente do banco autoritativo."
                : "Balance and statement queries do not need to participate in the same transactional boundary as writes. Ledger events feed a DynamoDB projection, allowing read traffic to scale independently of the authoritative database."}
            </p>

            {/* Invariant / Guarantees Box */}
            <div className="border-l-3 border-sky-500 bg-sky-50/70 rounded-r-xl p-3.5 space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-sky-950 block">
                {locale === "pt" ? "Garantias:" : "Guarantees:"}
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-mono">
                CQRS · Eventual Consistency · Conditional Writes · Versioning
              </p>
            </div>

            {/* Bullet List of 3 Key Architectural Decisions */}
            <div className="space-y-3 pt-1 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-sky-600 mt-0.5 flex-shrink-0 text-sm" />
                <span>
                  <strong className="text-slate-950 block sm:inline">
                    {locale === "pt" ? "Desacoplamento de carga: " : "Workload decoupling: "}
                  </strong>
                  {locale === "pt"
                    ? "Consultas não competem pelas mesmas conexões e recursos utilizados pelas operações financeiras."
                    : "Queries never compete for the database connections and resources utilized by critical financial mutations."}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-sky-600 mt-0.5 flex-shrink-0 text-sm" />
                <span>
                  <strong className="text-slate-950 block sm:inline">
                    {locale === "pt" ? "Versionamento monotônico: " : "Monotonic versioning: "}
                  </strong>
                  {locale === "pt"
                    ? "Conditional writes impedem que eventos antigos substituam projeções mais recentes."
                    : "Conditional writes prevent out-of-order broker events from overwriting fresher projection states."}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-sky-600 mt-0.5 flex-shrink-0 text-sm" />
                <span>
                  <strong className="text-slate-950 block sm:inline">
                    {locale === "pt" ? "Reconstrução da projeção: " : "Projection reconstruction: "}
                  </strong>
                  {locale === "pt"
                    ? "Como o ledger permanece autoritativo, o read model pode ser reconstruído a partir dos eventos quando necessário."
                    : "Because the ledger remains authoritative, the read model can be reconstructed from events whenever necessary."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
