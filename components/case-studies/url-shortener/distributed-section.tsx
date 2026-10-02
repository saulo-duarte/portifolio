"use client";

import Image from "next/image";
import { FiActivity, FiGlobe, FiLayers, FiShield, FiTrendingUp } from "react-icons/fi";
import { TbGitBranch, TbServer2 } from "react-icons/tb";
import type { Locale } from "@/components/portfolio";

export function DistributedSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";

  return (
    <section id="distributed" className="scroll-mt-28 space-y-12">
      {/* 1. Top Header: 2 Columns with Cartoon Gopher on Consistent Hashing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-sm font-medium text-slate-500 block">
            04 · {pt ? "Simulador de sistemas distribuídos" : "Distributed systems simulator"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            {pt ? (
              <>
                O que as simulações mostram
                <br />
                sobre <span className="text-sky-600">distribuição</span>
              </>
            ) : (
              <>
                What the simulations show
                <br />
                about <span className="text-sky-600">distribution</span>
              </>
            )}
          </h2>
          <p className="pt-1 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {pt
              ? "O pacote internal/lab usa modelos determinísticos in-process para comparar distribuição de chaves, quórum, atraso de réplicas, rate limiting e roteamento regional. Não há cluster, consenso ou recuperação regional reais."
              : "The internal/lab package uses deterministic in-process models to compare key distribution, quorum, replica lag, rate limiting, and regional routing. There is no real cluster, consensus, or regional recovery."}
          </p>
        </div>

        {/* Right Illustration: Gopher with Consistent Hashing Ring */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/3]">
            <Image
              src="/images/url-shortener-dist-gopher-transparent.png"
              alt={
                pt
                  ? "Ilustração do Gopher orquestrando o anel de consistent hashing"
                  : "Illustration of Gopher orchestrating consistent hashing ring"
              }
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* 2. Editorial 2x2 Grid with Cross Separator (No flat cards, no uppercase tracking) */}
      <div className="grid grid-cols-1 md:grid-cols-2 pt-2">
        {/* Quadrant 1: Consistent Hashing Ring vs Modulo */}
        <div className="pb-10 md:pb-12 md:pr-12 border-b border-slate-300 md:border-r space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <TbGitBranch />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                01
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Consistent Hashing & Nós Virtuais" : "Consistent Hashing & Virtual Nodes"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "No modelo com 100 mil chaves e entrada de um quarto nó, hashing por módulo remapeou 74,989% das chaves. O anel com 100 nós virtuais remapeou 15,29%, embora a distribuição ainda tenha desequilíbrio."
              : "In the model with 100,000 keys and a fourth node joining, modulo hashing remapped 74.989% of keys. The ring with 100 virtual nodes remapped 15.29%, though the distribution still has imbalance."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Resultado do modelo (EXP-0014)" : "Model result (EXP-0014)"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>O remapeamento foi de <strong className="text-rose-600 font-bold">74,989%</strong> para <strong className="text-emerald-700 font-bold">15,29%</strong> das chaves nesse simulador.</>
              ) : (
                <>Key remapping went from <strong className="text-rose-600 font-bold">74.989%</strong> to <strong className="text-emerald-700 font-bold">15.29%</strong> in this simulator.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 2: Quorum Models & Trade-offs */}
        <div className="pt-10 md:pt-0 pb-10 md:pb-12 md:pl-12 border-b border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <TbServer2 />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                02
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Modelagem de Quórum (R + W > N)" : "Quorum Modeling (R + W > N)"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "O modelo usa N=3 réplicas e uma matriz de RTTs controlados (3 ms, 20 ms e 45 ms). Com R=2 e W=2, ele calcula 20 ms; com R=1 e W=1, 3 ms, aceitando leituras potencialmente desatualizadas. São valores do modelo, não medições de rede."
              : "The model uses N=3 replicas and a controlled RTT matrix (3 ms, 20 ms, and 45 ms). With R=2 and W=2 it calculates 20 ms; with R=1 and W=1, 3 ms, accepting potentially stale reads. These are model values, not network measurements."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Limite do simulador" : "Simulator limit"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>O modelo ilustra o trade-off entre leituras, escritas e réplicas; não implementa consenso distribuído.</>
              ) : (
                <>The model illustrates the reads, writes, and replicas trade-off; it does not implement distributed consensus.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 3: Geo Routing & Replica Lag */}
        <div className="pt-10 md:pt-12 pb-10 md:pb-0 md:pr-12 border-b md:border-b-0 md:border-r border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiGlobe />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                03
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Roteamento Geo-Distribuído & Replica Lag" : "Geo Routing & Replication Lag"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "O simulador representa sa-east, us-east e eu-west, com roteamento pelo menor RTT modelado e atraso de réplica de 250 ms. Ele permite examinar leituras potencialmente defasadas e uma troca de região representada em memória."
              : "The simulator represents sa-east, us-east, and eu-west, with routing by the lowest modeled RTT and 250 ms replica lag. It lets us examine potentially stale reads and an in-memory representation of a regional switch."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Escopo do modelo regional" : "Regional model scope"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>As regiões e o failover são estados do simulador; não há serviços regionais em execução.</>
              ) : (
                <>Regions and failover are simulator states; no regional services are running.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 4: Rate Limiting & Load Shedding */}
        <div className="pt-10 md:pt-12 md:pl-12 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiTrendingUp />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                04
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Controle de Tráfego & Load Shedding (Lua)" : "Traffic Control & Load Shedding (Lua)"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "O laboratório compara fixed window, sliding window, leaky bucket e token bucket. Há também um token bucket Redis com Lua, limiter de concorrência sem fila e load shedding; essas opções são opt-in e ficam desligadas por padrão."
              : "The lab compares fixed window, sliding window, leaky bucket, and token bucket. It also includes a Redis Lua token bucket, a queue-free concurrency limiter, and load shedding; these options are opt-in and disabled by default."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Comportamento configurável" : "Configurable behavior"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Quando ativado, o load shedding devolve <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded">503</code> com <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded">Retry-After</code> para requisições acima do limite.</>
              ) : (
                <>When enabled, load shedding returns <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded">503</code> with <code className="font-mono text-xs text-sky-950 bg-sky-100/80 px-1 py-0.5 rounded">Retry-After</code> for requests above the limit.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
