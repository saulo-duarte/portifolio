"use client";

import Image from "next/image";
import type { Locale } from "@/components/portfolio";

export function ChallengesSection({ locale }: { locale: Locale }) {
  return (
    <section
      id="problem"
      className="scroll-mt-28 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-14 sm:py-20 bg-slate-100/80 border-y border-slate-300"
    >
      {/* Top Header: 2 Columns (Text + Gopher Illustration) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-sm font-medium text-slate-500 block">
            02 · {locale === "pt" ? "Desafios de Engenharia" : "Engineering Challenges"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            {locale === "pt" ? (
              <>
                Desafios de concorrência e
                <br />
                tolerância a falhas em
                <br />
                <span className="text-red-600">sistemas contábeis</span>
              </>
            ) : (
              <>
                Concurrency and fault-tolerance
                <br />
                challenges in
                <br />
                <span className="text-red-600">accounting systems</span>
              </>
            )}
          </h2>
          <p className="pt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {locale === "pt"
              ? "Operações financeiras distribuídas não toleram inconsistências, perda de eventos ou efeitos duplicados. Esta seção apresenta quatro desafios centrais do domínio e as decisões arquiteturais adotadas para tratá-los."
              : "Distributed financial operations cannot tolerate inconsistencies, lost events, or duplicate effects. This section presents four core domain challenges and the architectural decisions adopted to address them."}
          </p>
        </div>

        {/* Right Illustration: Stressed Gopher (Transparent Background) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-[4/3]">
            <Image
              src="/images/goledger-stressed-gopher.png"
              alt={
                locale === "pt"
                  ? "Ilustração de engenheiro Gopher estressado com alertas de sistema"
                  : "Illustration of stressed Gopher engineer dealing with system alerts"
              }
              fill
              sizes="(max-width: 768px) 100vw, 440px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2x2 Open Layout with Continuous Cross Separator */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Quadrant 1: Top-Left */}
        <div className="pb-10 md:pb-12 md:pr-12 border-b border-slate-300 md:border-r space-y-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
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

          <div className="border-l-4 border-sky-500 bg-sky-50/70 rounded-r-xl p-4">
            <span className="text-xs font-bold text-slate-950 block mb-1">
              {locale === "pt" ? "Solução arquitetural" : "Architectural solution"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {locale === "pt" ? (
                <>
                  Gravação atômica do evento na tabela{" "}
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    outbox_events
                  </code>{" "}
                  dentro da mesma transação ACID do ledger, garantindo entrega confiável sem depender de distributed transactions.
                </>
              ) : (
                <>
                  Atomic write of the event to the{" "}
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    outbox_events
                  </code>{" "}
                  table within the same ACID transaction as the ledger, guaranteeing reliable delivery without relying on distributed transactions.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 2: Top-Right */}
        <div className="pt-10 md:pt-0 pb-10 md:pb-12 md:pl-12 border-b border-slate-300 space-y-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
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

          <div className="border-l-4 border-sky-500 bg-sky-50/70 rounded-r-xl p-4">
            <span className="text-xs font-bold text-slate-950 block mb-1">
              {locale === "pt" ? "Solução arquitetural" : "Architectural solution"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {locale === "pt" ? (
                <>
                  Adoção de partidas dobradas imutáveis com representação inteira em centavos (
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    int64
                  </code>
                  ), assegurando que a soma dos lançamentos seja sempre nula (
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    ∑ postings = 0
                  </code>
                  ) e preservando a trilha contábil completa.
                </>
              ) : (
                <>
                  Adoption of immutable double-entry bookkeeping with integer cent representation (
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    int64
                  </code>
                  ), ensuring the sum of postings is always balanced (
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    ∑ postings = 0
                  </code>
                  ) and preserving a complete audit trail.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 3: Bottom-Left */}
        <div className="pt-10 md:pt-12 pb-10 md:pb-0 md:pr-12 border-b md:border-b-0 md:border-r border-slate-300 space-y-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
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
              ? "O gateway pode recusar, falhar antes do envio ou aceitar a cobrança e perder a resposta. Um resultado incerto não permite liberar saldo nem cobrar às cegas por outro provedor."
              : "A gateway can decline, fail before submission, or accept a charge while its response is lost. An uncertain result permits neither releasing funds nor blindly charging through another provider."}
          </p>

          <div className="border-l-4 border-sky-500 bg-sky-50/70 rounded-r-xl p-4">
            <span className="text-xs font-bold text-slate-950 block mb-1">
              {locale === "pt" ? "Solução arquitetural" : "Architectural solution"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {locale === "pt" ? (
                <>
                  Uma Saga persistida mantém o estado da tentativa e a chave por provedor. Falha antes do envio permite failover; timeout após envio vira{" "}
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    gateway_unknown
                  </code>{" "}
                  e reconcilia com o mesmo provedor. Só recusa definitiva libera o hold; resultado não conciliado permanece reservado para revisão.
                </>
              ) : (
                <>
                  A persisted Saga stores attempt progress and a provider-scoped key. A failure before submission permits standby failover; a timeout after submission becomes{" "}
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    gateway_unknown
                  </code>{" "}
                  and is reconciled with the same provider. Only a definitive decline releases the hold; an unreconciled outcome stays reserved for review.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 4: Bottom-Right */}
        <div className="pt-10 md:pt-12 md:pl-12 space-y-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
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

          <div className="border-l-4 border-sky-500 bg-sky-50/70 rounded-r-xl p-4">
            <span className="text-xs font-bold text-slate-950 block mb-1">
              {locale === "pt" ? "Solução arquitetural" : "Architectural solution"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {locale === "pt" ? (
                <>
                  Middleware de idempotência baseado em{" "}
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    Idempotency-Key
                  </code>{" "}
                  com lock transacional no PostgreSQL, retornando a resposta original em requisições duplicadas sem reexecutar o processamento financeiro.
                </>
              ) : (
                <>
                  Idempotency middleware based on{" "}
                  <code className="font-mono text-xs text-sky-950 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-200/70">
                    Idempotency-Key
                  </code>{" "}
                  with transactional lock in PostgreSQL, returning the original response on duplicate requests without re-executing financial processing.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
