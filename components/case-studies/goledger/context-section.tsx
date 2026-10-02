"use client";

import Image from "next/image";
import { FiArrowRight, FiCheck, FiLock, FiMinus, FiPlus, FiSearch, FiShield } from "react-icons/fi";
import { TbScale } from "react-icons/tb";
import type { Locale } from "@/components/portfolio";

export function ContextSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";

  return (
    <section id="context" className="scroll-mt-28">
      {/* 1. Header: 2 Columns (Text left 8-cols, 2D Cartoon Gopher right 4-cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-10 sm:mb-14">
        <div className="lg:col-span-8 space-y-3.5">
          <span className="text-sm font-medium text-slate-500 block">
            01 · {pt ? "Contexto do domínio" : "Domain context"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-slate-950 leading-[1.18]">
            {pt ? (
              <>
                Consistência contábil e modelo de lançamentos{" "}
                <span className="text-sky-600">balanceados (double-entry)</span>
              </>
            ) : (
              <>
                Accounting consistency and balanced{" "}
                <span className="text-sky-600">double-entry ledger model</span>
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {pt
              ? "O GoLedger gerencia contas e registra cada transação por meio de lançamentos contábeis imutáveis. O saldo real nunca é alterado diretamente em um campo numérico: ele é derivado do histórico acumulado de débitos e créditos, enquanto reservas temporárias (holds) controlam a liquidez disponível em tempo real."
              : "GoLedger manages accounts and records every transaction through immutable ledger entries. The real balance is never mutated directly on a numeric column: it is strictly derived from the accumulated history of debits and credits, while temporary holds isolate available liquidity in real time."}
          </p>

          {/* Core Architectural Badges / Key Principles */}
          <div className="pt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 font-mono">
              <TbScale className="text-sky-600 text-sm" />
              <span>{pt ? "Partidas dobradas (Débitos = Créditos)" : "Double-entry (Debits = Credits)"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 font-mono">
              <FiShield className="text-sky-600 text-xs" />
              <span>{pt ? "PostgreSQL Append-Only" : "Append-Only PostgreSQL"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 font-mono">
              <FiCheck className="text-emerald-600 text-xs" />
              <span>{pt ? "Idempotência no banco" : "Database-level Idempotency"}</span>
            </span>
          </div>
        </div>

        {/* Right Illustration: Cartoon Accountant Gopher (Adjusted size to avoid empty whitespace) */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-[4/3]">
            <Image
              src="/images/goledger-context-gopher.png"
              alt={
                pt
                  ? "Ilustração cartoon do Gopher contábil com balança e livro-razão"
                  : "Cartoon illustration of the accounting Gopher with ledger and scales"
              }
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2. Visual Ledger Diagram (2-Column Balanced Layout: Theory & Technical Reality vs Sleek Visual Flow) */}
      <div className="mb-14 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (5 cols): Technical Rationale & Ledger Invariants */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs font-semibold text-sky-600 block mb-1">
                {pt ? "Modelo de partidas dobradas" : "Double-entry accounting"}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                {pt ? "Anatomia de um lançamento contábil" : "Anatomy of a ledger posting"}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {pt
                ? "Em sistemas financeiros formais, o saldo nunca é uma coluna alterada via UPDATE direto. Cada evento de negócio gera no mínimo dois lançamentos opostos (postings) que somam zero, preservando a verdade histórica contra race conditions."
                : "In formal financial systems, balance is never mutated via direct UPDATE. Every business event produces at least two opposing postings that sum to zero, defending historical truth against race conditions."}
            </p>

            {/* Invariant Equation Box */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                {pt ? "Invariante de consistência" : "Consistency invariant"}
              </span>
              <div className="font-mono text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>∑ Débitos + ∑ Créditos</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">= 0,00</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {pt
                  ? "Rejeição imediata em nível de domínio caso a transação tente gerar ou destruir centavos."
                  : "Immediate domain-level rejection if any transaction attempts to create or destroy funds."}
              </p>
            </div>
          </div>

          {/* Right Column (7 cols): Visual Flow matching the inspiration diagram */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Top Central Posting Card */}
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs relative z-10">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {pt ? "Lançamento contábil" : "Ledger entry"}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <FiCheck className="text-xs" />
                  {pt ? "Balanceado" : "Balanced"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100 text-center">
                  <span className="text-[11px] font-medium text-rose-700 block">
                    {pt ? "Débito" : "Debit"}
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    R$ 100,00
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-center">
                  <span className="text-[11px] font-medium text-emerald-700 block">
                    {pt ? "Crédito" : "Credit"}
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    R$ 100,00
                  </span>
                </div>
              </div>
            </div>

            {/* Curved SVG Connector Lines */}
            <div className="w-full max-w-md h-10 sm:h-12 relative -my-1">
              <svg
                className="w-full h-full text-slate-300"
                viewBox="0 0 400 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Left Branch to Origin */}
                <path
                  d="M 170 0 V 16 C 170 34 100 24 100 48"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Right Branch to Destination */}
                <path
                  d="M 230 0 V 16 C 230 34 300 24 300 48"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>

            {/* Bottom 2 Accounts: Origin (Source) & Destination */}
            <div className="w-full max-w-md grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
              {/* Conta Origem */}
              <div className="rounded-xl border border-sky-200/80 bg-white p-3.5 sm:p-4 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 font-bold grid place-items-center shrink-0 text-sm">
                  ↓
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-medium text-slate-500 block truncate">
                    {pt ? "Conta origem" : "Source account"}
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                    - R$ 100,00
                  </span>
                </div>
              </div>

              {/* Conta Destino */}
              <div className="rounded-xl border border-emerald-200/80 bg-white p-3.5 sm:p-4 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold grid place-items-center shrink-0 text-sm">
                  ↑
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-medium text-slate-500 block truncate">
                    {pt ? "Conta destino" : "Destination account"}
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                    + R$ 100,00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 2x2 Cross Grid with Domain Principles (Consistent with ChallengesSection & TechStack) */}
      <div className="mb-14">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 mb-6">
          {pt ? "Pilares do livro-razão financeiro" : "Ledger engineering pillars"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-slate-300">
          {/* Quadrant 01: Imutabilidade */}
          <div className="p-6 sm:p-8 border-b md:border-r border-slate-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sky-600 font-bold text-sm tracking-wide">
                  01 —
                </span>
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                  <FiShield className="text-base" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {pt ? "Imutabilidade estrita" : "Strict immutability"}
                </h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {pt
                  ? "Lançamentos nunca sofrem UPDATE ou DELETE. Erros ou estornos são corrigidos exclusivamente por contra-lançamentos (reversals), preservando a auditoria contábil e a linha temporal exata."
                  : "Entries never suffer UPDATE or DELETE. Corrections or chargebacks occur exclusively through compensating reversal postings, keeping full legal auditability and temporal trace."}
              </p>
            </div>
            <div className="mt-5 border-l-3 border-sky-500 bg-sky-50/60 p-3 rounded-r-lg">
              <span className="text-[11px] font-semibold text-sky-900 uppercase tracking-wider block mb-0.5">
                {pt ? "Garantia no banco" : "Database guarantee"}
              </span>
              <p className="text-xs text-sky-800">
                {pt
                  ? "Tabelas append-only no PostgreSQL impedem sobrescrita física de registros históricos."
                  : "Append-only PostgreSQL tables prevent physical overwrites of financial history."}
              </p>
            </div>
          </div>

          {/* Quadrant 02: Rastreabilidade */}
          <div className="p-6 sm:p-8 border-b border-slate-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sky-600 font-bold text-sm tracking-wide">
                  02 —
                </span>
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                  <FiSearch className="text-base" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {pt ? "Rastreabilidade de ponta a ponta" : "End-to-end auditability"}
                </h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {pt
                  ? "Cada lançamento armazena sua chave de idempotência original, transaction ID e correlation ID gerado pelo API Gateway, permitindo reconstruir toda a linhagem desde a requisição HTTP até o banco."
                  : "Every posting stores its original idempotency key, transaction ID, and correlation ID issued by the gateway, making it possible to reconstruct the complete lineage from HTTP to the database."}
              </p>
            </div>
            <div className="mt-5 border-l-3 border-sky-500 bg-sky-50/60 p-3 rounded-r-lg">
              <span className="text-[11px] font-semibold text-sky-900 uppercase tracking-wider block mb-0.5">
                {pt ? "Correlação" : "Correlation"}
              </span>
              <p className="text-xs text-sky-800">
                {pt
                  ? "Vinculação direta com OpenTelemetry spans (`trace_id`) injetados nos logs estruturados."
                  : "Direct binding with OpenTelemetry spans (`trace_id`) injected in structured logs."}
              </p>
            </div>
          </div>

          {/* Quadrant 03: Balanceamento */}
          <div className="p-6 sm:p-8 md:border-r border-b md:border-b-0 border-slate-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sky-600 font-bold text-sm tracking-wide">
                  03 —
                </span>
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                  <TbScale className="text-base" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {pt ? "Balanceamento e soma zero" : "Zero-sum balancing"}
                </h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {pt
                  ? "A integridade contábil exige que a soma algébrica de todas as pernas de uma transação seja exatamente zero: Débitos = Créditos. Operações não balanceadas são rejeitadas na camada de domínio."
                  : "Accounting integrity requires that the algebraic sum of all transaction legs equals zero: Debits = Credits. Unbalanced operations are immediately rejected by domain validation."}
              </p>
            </div>
            <div className="mt-5 border-l-3 border-sky-500 bg-sky-50/60 p-3 rounded-r-lg">
              <span className="text-[11px] font-semibold text-sky-900 uppercase tracking-wider block mb-0.5">
                {pt ? "Validação de domínio" : "Domain validation"}
              </span>
              <p className="text-xs text-sky-800">
                {pt
                  ? "Cálculos estritamente em inteiros (centavos), eliminando imprecisões de ponto flutuante."
                  : "Integer-only math (cents/minor units), eliminating floating-point rounding errors."}
              </p>
            </div>
          </div>

          {/* Quadrant 04: Holds e Liquidez */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sky-600 font-bold text-sm tracking-wide">
                  04 —
                </span>
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                  <FiLock className="text-base" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {pt ? "Holds e controle de liquidez" : "Holds & liquidity isolation"}
                </h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {pt
                  ? "Para fluxos assíncronos (antifraude e autorização de cartão), fundos são congelados via holds com TTL. O saldo contábil não muda até a liquidação, mas a liquidez disponível é protegida contra gasto duplo."
                  : "For asynchronous payment flows, funds are frozen via TTL-backed holds. The ledger balance remains intact until settlement, but available liquidity is safeguarded against double-spending."}
              </p>
            </div>
            <div className="mt-5 border-l-3 border-sky-500 bg-sky-50/60 p-3 rounded-r-lg">
              <span className="text-[11px] font-semibold text-sky-900 uppercase tracking-wider block mb-0.5">
                {pt ? "Fórmula do saldo" : "Balance equation"}
              </span>
              <p className="text-xs text-sky-800 font-mono">
                {pt
                  ? "Saldo Disponível = Saldo Contábil − ∑ Holds Ativos"
                  : "Available = Ledger Balance − ∑ Active Holds"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Lower 3 Columns: Depósito, Saque/Transferência, Hold/Captura */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-300 py-6 mb-8 border-y border-slate-300">
        {/* Column 1: Depósito */}
        <div className="md:pr-8 py-4 md:py-0 flex flex-col justify-between">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-950 mb-2">
              {pt ? "Depósito" : "Deposit"}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              {pt
                ? "Cria lançamentos contábeis opostos entre a conta de liquidação e a carteira do usuário. O saldo contábil cresce pelo registro histórico, nunca por um UPDATE direto."
                : "Creates opposing postings between settlement and the user wallet. The ledger balance grows strictly through journal entries, never via direct UPDATE."}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="rounded-md bg-slate-100 px-2.5 py-1">{pt ? "Liquidação" : "Settlement"}</span>
            <FiArrowRight className="text-slate-400" aria-hidden="true" />
            <span className="rounded-md bg-slate-100 px-2.5 py-1">{pt ? "Carteira" : "Wallet"}</span>
          </div>
        </div>

        {/* Column 2: Saque e Transferência */}
        <div className="md:px-8 py-4 md:py-0 flex flex-col justify-between">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-950 mb-2">
              {pt ? "Saque e transferência" : "Withdrawal and transfer"}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              {pt
                ? "O saque só é lançado se houver saldo disponível suficiente. Na transferência, a conta de origem é debitada e a de destino creditada atomicamente."
                : "Withdrawals post only when available funds are sufficient. Transfers debit origin and credit destination atomically in the same database transaction."}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="rounded-md bg-slate-100 px-2.5 py-1">{pt ? "Origem" : "Source"}</span>
            <FiArrowRight className="text-slate-400" aria-hidden="true" />
            <span className="rounded-md bg-slate-100 px-2.5 py-1">{pt ? "Destino" : "Destination"}</span>
            <FiCheck className="ml-auto text-emerald-600" aria-label={pt ? "Operação balanceada" : "Balanced operation"} />
          </div>
        </div>

        {/* Column 3: Hold, Captura e Liberação */}
        <div className="md:pl-8 py-4 md:py-0 flex flex-col justify-between">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-950 mb-2">
              {pt ? "Hold, captura e liberação" : "Hold, capture, and release"}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              {pt
                ? "O hold reserva o valor durante a autorização externa, sem gerar lançamento contábil. A captura consolida o movimento final; a expiração libera a liquidez."
                : "A hold reserves the amount during external authorization without posting. Capture commits the final movement; expiration restores liquidity."}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="rounded-md bg-slate-100 px-2.5 py-1">{pt ? "Disponível" : "Available"}</span>
            <FiMinus className="text-slate-400" aria-hidden="true" />
            <span className="rounded-md bg-amber-50 px-2.5 py-1 text-amber-800 border border-amber-200/60">{pt ? "Hold ativo" : "Active hold"}</span>
            <FiPlus className="text-slate-400" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* 5. Footer Note */}
      <p className="border-l-2 border-sky-500 pl-4 text-xs sm:text-sm leading-relaxed text-slate-600">
        {pt
          ? "Tudo é registrado em centavos inteiros e gravado no PostgreSQL com chave de idempotência. Repetir a mesma solicitação não duplica o lançamento."
          : "Amounts use integer minor units and are committed to PostgreSQL with an idempotency key. Repeating the same request does not duplicate the posting."}
      </p>
    </section>
  );
}
