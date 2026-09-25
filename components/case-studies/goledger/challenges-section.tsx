"use client";

import type { Locale } from "@/components/portfolio";

export function ChallengesSection({ locale }: { locale: Locale }) {
  return (
    <section id="problem" className="scroll-mt-28">
      <div className="mb-10">
        <span className="text-sm font-medium text-slate-500 block mb-1.5">
          01 · {locale === "pt" ? "Desafios de Engenharia" : "Engineering Challenges"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          {locale === "pt"
            ? "Desafios críticos em sistemas financeiros distribuídos"
            : "Critical challenges in distributed financial systems"}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {locale === "pt"
            ? "Operações financeiras distribuídas não toleram inconsistências, perda de eventos ou efeitos duplicados. Esta seção apresenta quatro desafios centrais do domínio e as decisões arquiteturais adotadas para tratá-los."
            : "Distributed financial operations cannot tolerate inconsistencies, lost events, or duplicate effects. This section presents four core domain challenges and the architectural decisions adopted to address them."}
        </p>
      </div>

      {/* 2x2 Open Layout with Continuous Cross Separator */}
      <div className="grid grid-cols-1 md:grid-cols-2 pt-2">
        {/* Quadrant 1: Top-Left */}
        <div className="pb-8 md:pb-10 md:pr-10 border-b border-slate-300 md:border-r space-y-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xl sm:text-2xl font-black text-slate-950 tracking-tighter select-none">
              01
            </span>
            <span className="text-slate-400 font-bold select-none">—</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
              {locale === "pt"
                ? "Dual-write entre banco e broker"
                : "Dual-write between database and broker"}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "pt"
              ? "Persistir o estado contábil no banco de dados e publicar o evento no broker em etapas separadas introduz risco de inconsistência. Se a publicação falhar após o commit, o evento se perde; se o commit falhar após a publicação, gera-se um evento fantasma."
              : "Persisting accounting state in the database and publishing the event to the broker in separate steps introduces severe inconsistency risks. If publishing fails after commit, the event is lost; if commit fails after publishing, a phantom event is produced."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {locale === "pt" ? "Solução arquitetural" : "Architectural solution"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {locale === "pt" ? (
                <>Gravação atômica do evento na tabela <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">outbox_events</code> dentro da mesma transação ACID do ledger, garantindo entrega confiável sem depender de distributed transactions.</>
              ) : (
                <>Atomic write of the event to the <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">outbox_events</code> table within the same ACID transaction as the ledger, guaranteeing reliable delivery without relying on distributed transactions.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 2: Top-Right */}
        <div className="pt-8 md:pt-0 pb-8 md:pb-10 md:pl-10 border-b border-slate-300 space-y-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xl sm:text-2xl font-black text-slate-950 tracking-tighter select-none">
              02
            </span>
            <span className="text-slate-400 font-bold select-none">—</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
              {locale === "pt"
                ? "Precisão monetária e perda de trilha contábil"
                : "Monetary precision and audit trail loss"}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "pt"
              ? "O uso de tipos de ponto flutuante introduz erros de arredondamento cumulativos em cálculos financeiros. Além disso, mutações diretas de saldo eliminam a rastreabilidade histórica das movimentações."
              : "Using floating-point types introduces cumulative rounding errors in financial math. Furthermore, direct balance mutations eliminate the historical audit trail of transactions."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {locale === "pt" ? "Solução arquitetural" : "Architectural solution"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {locale === "pt" ? (
                <>Adoção de partidas dobradas imutáveis com representação inteira em centavos (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">int64</code>), assegurando que a soma dos lançamentos seja sempre nula (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">∑ postings = 0</code>) e preservando a trilha contábil completa.</>
              ) : (
                <>Adoption of immutable double-entry bookkeeping with integer cent representation (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">int64</code>), ensuring the sum of postings is always balanced (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">∑ postings = 0</code>) and preserving a complete audit trail.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 3: Bottom-Left */}
        <div className="pt-8 md:pt-10 pb-8 md:pb-0 md:pr-10 border-b md:border-b-0 md:border-r border-slate-300 space-y-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xl sm:text-2xl font-black text-slate-950 tracking-tighter select-none">
              03
            </span>
            <span className="text-slate-400 font-bold select-none">—</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
              {locale === "pt"
                ? "Falhas parciais em fluxos distribuídos"
                : "Partial failures in distributed workflows"}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "pt"
              ? "Fluxos de pagamento dependem de múltiplas etapas, como reserva de fundos, análise de risco e confirmação com serviços externos. Falhas de rede ou recusas em etapas intermediárias podem deixar saldos bloqueados indevidamente."
              : "Payment workflows span multiple stages, such as funds reservation, risk evaluation, and confirmation with external gateways. Network failures or rejections in intermediate stages can leave balances locked indefinitely."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {locale === "pt" ? "Solução arquitetural" : "Architectural solution"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {locale === "pt" ? (
                <>Implementação de <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">PaymentSagaOrchestrator</code> com reservas temporárias (holds) e transações de compensação automáticas (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">releaseHold</code>) para garantir consistência eventual em caso de falha.</>
              ) : (
                <>Implementation of <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">PaymentSagaOrchestrator</code> with temporary holds and automatic compensating transactions (<code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">releaseHold</code>) to guarantee eventual consistency in case of failure.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 4: Bottom-Right */}
        <div className="pt-8 md:pt-10 md:pl-10 space-y-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xl sm:text-2xl font-black text-slate-950 tracking-tighter select-none">
              04
            </span>
            <span className="text-slate-400 font-bold select-none">—</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
              {locale === "pt"
                ? "Retentativas de rede e cobranças duplicadas"
                : "Network retries and duplicate charges"}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "pt"
              ? "Clientes e serviços de rede frequentemente realizam novas tentativas quando enfrentam timeouts ou falhas transitórias. Sem proteção adequada, requisições repetidas podem debitar valores mais de uma vez."
              : "Clients and network services frequently retry requests upon timeouts or transient network errors. Without proper protection, repeated requests can debit funds multiple times."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {locale === "pt" ? "Solução arquitetural" : "Architectural solution"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {locale === "pt" ? (
                <>Middleware de idempotência baseado em <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">Idempotency-Key</code> com lock transacional no PostgreSQL, retornando a resposta original em requisições duplicadas sem reexecutar o processamento financeiro.</>
              ) : (
                <>Idempotency middleware based on <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1.5 py-0.5 rounded border border-sky-200/60">Idempotency-Key</code> with transactional lock in PostgreSQL, returning the original response on duplicate requests without re-executing financial processing.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
