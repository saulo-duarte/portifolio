"use client";

import Image from "next/image";
import { FiCheck, FiClock, FiDatabase, FiLayers, FiShield, FiZap } from "react-icons/fi";
import { SiRedis } from "react-icons/si";
import type { Locale } from "@/components/portfolio";

export function CacheSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";

  return (
    <section id="cache" className="scroll-mt-28 space-y-12">
      {/* 1. Header: 2 Columns with Cartoon Gopher managing Caching */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-sm font-medium text-slate-500 block">
            03 · {pt ? "Cache e filtro de Bloom" : "Cache and Bloom filter"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            {pt ? (
              <>
                Como o cache reduz
                <br />
                <span className="text-sky-600">leituras ao banco</span>
              </>
            ) : (
              <>
                How caching reduces
                <br />
                <span className="text-sky-600">database reads</span>
              </>
            )}
          </h2>
          <p className="pt-1 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {pt
              ? "Cache Aside consulta o Redis antes do PostgreSQL; o Bloom filter pode interromper buscas de códigos certamente ausentes. Os números abaixo pertencem a workloads locais específicos."
              : "Cache Aside checks Redis before PostgreSQL; the Bloom filter can stop lookups for definitely absent codes. The figures below belong to specific local workloads."}
          </p>
        </div>

        {/* Right Illustration: Gopher with memory cube */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/3]">
            <Image
              src="/images/url-shortener-cache-gopher.jpg"
              alt={
                pt
                  ? "Ilustração do Gopher gerenciando cache em memória e Redis"
                  : "Illustration of Gopher managing in-memory cache and Redis"
              }
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* 2. Editorial 2x2 Grid with Clean Cross Separator (No flat cards, no uppercase tracking) */}
      <div className="grid grid-cols-1 md:grid-cols-2 pt-2">
        {/* Quadrant 1: Cache Aside & Hit Ratio */}
        <div className="pb-10 md:pb-12 md:pr-12 border-b border-slate-300 md:border-r space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <SiRedis />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                01
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Cache Aside e leituras no PostgreSQL" : "Cache Aside and PostgreSQL reads"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "No EXP-0004, com 1.000 requisições, 20 workers, 50 de aquecimento e uma hot key, Cache Aside reduziu as consultas de 1.050 para 5. O hit ratio observado foi 99,52% e o throughput passou de 10.582 para 12.230 req/s nesta execução local."
              : "In EXP-0004, with 1,000 requests, 20 workers, 50 warm-up requests, and one hot key, Cache Aside reduced queries from 1,050 to 5. The observed hit ratio was 99.52%, and throughput went from 10,582 to 12,230 req/s in this local run."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Evidência empírica (EXP-0004)" : "Empirical evidence (EXP-0004)"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Neste workload, as queries ao PostgreSQL caíram de <strong className="text-emerald-700 font-bold">1.050 para 5</strong>.</>
              ) : (
                <>In this workload, PostgreSQL queries dropped from <strong className="text-emerald-700 font-bold">1,050 to 5</strong>.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 2: Tiered Cache L1 vs L2 */}
        <div className="pt-10 md:pt-0 pb-10 md:pb-12 md:pl-12 border-b border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiLayers />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                02
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Cache em camadas: L1 e Redis" : "Tiered cache: L1 and Redis"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "Em microbenchmarks isolados de adapter, um hit no L1 teve mediana de 54,8 ns/op, contra 62,1 µs/op no Redis. Na carga HTTP ponta a ponta, o L1 não mostrou ganho conclusivo: a comparação mediu 16.167 contra 16.398 req/s."
              : "In isolated adapter microbenchmarks, an L1 hit had a 54.8 ns/op median, versus 62.1 µs/op for Redis. In end-to-end HTTP load, L1 showed no conclusive gain: the comparison measured 16,167 versus 16,398 req/s."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Racional de engenharia (EXP-0005)" : "Engineering rationale (EXP-0005)"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>L1 permanece opt-in; este experimento não demonstra benefício no HTTP completo.</>
              ) : (
                <>L1 remains opt-in; this experiment does not demonstrate a full HTTP benefit.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 3: Bloom Filter Miss Defense */}
        <div className="pt-10 md:pt-12 pb-10 md:pb-0 md:pr-12 border-b md:border-b-0 md:border-r border-slate-300 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiShield />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                03
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Filtro de Bloom e códigos ausentes" : "Bloom filter and absent codes"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "No EXP-0010, cinco rodadas de 10.000 códigos inexistentes e únicos foram bloqueadas antes de Redis ou PostgreSQL quando o filtro estava pronto. A mediana foi 19.327 req/s, contra 9.565 sem o filtro; o resultado não representa tráfego misto."
              : "In EXP-0010, five rounds of 10,000 unique nonexistent codes were stopped before Redis or PostgreSQL when the filter was ready. Median throughput was 19,327 req/s, versus 9,565 without it; this result does not represent mixed traffic."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Resultado local (EXP-0010)" : "Local result (EXP-0010)"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <><strong className="text-sky-700 font-bold">2,02× mais throughput</strong> nesse workload de misses; Redis e PostgreSQL não foram consultados.</>
              ) : (
                <><strong className="text-sky-700 font-bold">2.02× higher throughput</strong> in this misses workload; Redis and PostgreSQL were not queried.</>
              )}
            </p>
          </div>
        </div>

        {/* Quadrant 4: Streaming Rebuild */}
        <div className="pt-10 md:pt-12 md:pl-12 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 grid place-items-center text-lg shrink-0">
              <FiZap />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight select-none">
                04
              </span>
              <span className="text-slate-400 font-bold select-none">—</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {pt ? "Reconstrução do filtro por streaming" : "Streaming filter rebuild"}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pt
              ? "No EXP-0012 local, o scanner da aplicação leu 10 milhões de registros de um PostgreSQL 16 indexado em 3,283 s e preencheu um bit array de 11,42 MiB. A taxa observada de falsos positivos foi 0,853% em 100 mil probes."
              : "In local EXP-0012, the application scanner read 10 million records from indexed PostgreSQL 16 in 3.283 s and filled an 11.42 MiB bit array. The observed false-positive rate was 0.853% across 100k probes."}
          </p>

          <div className="border-l-3 border-sky-500 bg-sky-50/60 rounded-r-xl p-3.5 mt-2.5 shadow-2xs">
            <span className="text-xs font-bold text-sky-950 block mb-1">
              {pt ? "Métricas de rebuild (EXP-0012)" : "Rebuild metrics (EXP-0012)"}
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {pt ? (
                <>Tempo de rebuild de <strong className="text-emerald-700 font-bold">3,283 s</strong> para 10M de chaves; pegada de memória de apenas 11,42 MiB.</>
              ) : (
                <>Rebuild duration of <strong className="text-emerald-700 font-bold">3.283 s</strong> for 10M keys; memory footprint of only 11.42 MiB.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
