"use client";

import type { Locale } from "@/components/portfolio";
import { SectionHeading } from "./shared";

type Experiment = {
  id: string;
  title: string;
  tab: string;
  summary: string;
  columns: string[];
  rows: string[][];
  note: string;
};

function getExperiments(pt: boolean): Experiment[] {
  return pt
    ? [
        {
          id: "EXP-0003",
          tab: "HTTP baseline",
          title: "Baseline HTTP por perfil de acesso",
          summary: "1.000 requests por workload, concorrência 20, um container e PostgreSQL local; todos os redirects responderam 302.",
          columns: ["Workload", "req/s", "p95", "p99"],
          rows: [
            ["Uniforme", "12.596", "2,726 ms", "3,797 ms"],
            ["80/20", "14.406", "2,218 ms", "2,961 ms"],
            ["Hot key", "12.548", "2,992 ms", "6,926 ms"],
          ],
          note: "Baseline de uma máquina. Não mede múltiplas réplicas nem saturação de produção.",
        },
        {
          id: "EXP-0002",
          tab: "Geração de IDs",
          title: "Custo de coordenação na geração",
          summary: "Benchmark sequencial por operação. Range mede geração local depois de reservar blocos de 1.000; Snowflake usou relógio controlado.",
          columns: ["Estratégia", "ns/op", "Leitura"],
          rows: [
            ["PostgreSQL sequence", "920.887", "Uma operação coordenada por ID"],
            ["Redis INCR", "582.268", "Incremento remoto por ID"],
            ["Range allocation", "2.147", "Custo amortizado após reservar 1.000"],
            ["Snowflake-like", "47,68", "Geração local; relógio controlado"],
          ],
          note: "O resultado não é um teste HTTP e não inclui persistência da URL. Sequence continua como baseline padrão.",
        },
        {
          id: "EXP-0004",
          tab: "Cache Aside",
          title: "Menos leituras ao PostgreSQL",
          summary: "1.000 requests medidas, 20 workers, 50 requests de aquecimento e uma hot key. As contagens abaixo incluem o aquecimento.",
          columns: ["Métrica", "Cache desligado", "Cache ligado"],
          rows: [
            ["Throughput", "10.582 req/s", "12.230 req/s"],
            ["p95", "3,184 ms", "2,766 ms"],
            ["Queries PostgreSQL", "1.050", "5"],
            ["Hit ratio observado", "—", "99,52%"],
          ],
          note: "+15,6% de throughput e 1.045 queries a menos nesta execução local. Cache continua sendo otimização; PostgreSQL é a fonte durável.",
        },
        {
          id: "EXP-0005",
          tab: "Tiered cache",
          title: "L1 muito rápido; ganho HTTP não comprovado",
          summary: "Mediana de dez benchmarks isolados dos adapters e duas comparações end-to-end.",
          columns: ["Medição", "Redis-only", "Tiered cache"],
          rows: [
            ["Get de L1 hit", "—", "54,8 ns/op"],
            ["Get L2 hit", "62,1 µs/op", "62,5 µs/op"],
            ["Throughput · 10k req · 50 workers", "16.398 req/s", "16.167 req/s"],
            ["p95 · 10k req · 50 workers", "5,328 ms", "6,160 ms"],
          ],
          note: "O adapter L1 é cerca de três ordens de grandeza mais rápido que Redis nesse microbenchmark; a carga HTTP não demonstrou ganho conclusivo.",
        },
        {
          id: "EXP-0006",
          tab: "Cache stampede",
          title: "Resultado HTTP inconclusivo",
          summary: "Smoke test de 50 requests e 10 workers, com processos reiniciados entre os modos.",
          columns: ["Modo", "DB queries", "L2 GETs", "Erros HTTP"],
          rows: [
            ["Coalescing desligado", "5", "11", "0"],
            ["Coalescing ligado", "10", "14", "0"],
          ],
          note: "A amostra é ruidosa e não permite atribuir melhora ao coalescing. Em nível de adapter, 32 chamadas simultâneas à mesma chave fizeram uma única consulta ao L2.",
        },
        {
          id: "EXP-0009",
          tab: "SWR",
          title: "SWR reduziu latência nesta carga",
          summary: "Cinco repetições de 10.000 requests por modo (50 mil por condição), TTL fresco de 2 s, stale de 30 s e 100 workers.",
          columns: ["Mediana", "Expiração estrita", "SWR"],
          rows: [
            ["Throughput", "15.587 req/s", "20.651 req/s"],
            ["p50", "3,936 ms", "3,176 ms"],
            ["p95", "12,987 ms", "10,406 ms"],
            ["p99", "31,992 ms", "27,661 ms"],
            ["L2 GETs/rodada", "2", "0"],
          ],
          note: "Os intervalos de p99 se sobrepõem parcialmente. SWR permanece desligado por padrão até validação em ambiente com múltiplos Pods.",
        },
        {
          id: "EXP-0010",
          tab: "Bloom misses",
          title: "Filtro Bloom protege misses únicos",
          summary: "Cinco repetições de 10.000 códigos inexistentes e únicos por cenário; concorrência 100. Todos os 100 mil requests responderam 404.",
          columns: ["Mediana", "Sem Bloom", "Bloom pronto"],
          rows: [
            ["Throughput", "9.565 req/s", "19.327 req/s"],
            ["p50", "8,565 ms", "3,722 ms"],
            ["p95", "16,716 ms", "9,581 ms"],
            ["Queries PostgreSQL / 10k", "10.000", "0"],
            ["GETs Redis / 10k", "10.000", "0"],
          ],
          note: "Throughput mediano 2,02× maior nesta máquina. O benchmark mede misses inexistentes, não tráfego misto.",
        },
        {
          id: "EXP-0011/12",
          tab: "Bloom rebuild",
          title: "Rebuild em 10 milhões de códigos",
          summary: "EXP-0011 usa scanner sintético; EXP-0012 usa PostgreSQL 16 local, índice real e scanner streaming da aplicação.",
          columns: ["Métrica", "Sintético · EXP-0011", "PostgreSQL · EXP-0012"],
          rows: [
            ["Linhas", "10.000.000", "10.000.000"],
            ["Duração", "2,10 s", "3,283 s"],
            ["Bit array", "11,42 MiB", "11,42 MiB"],
            ["Pico RSS", "Não medido", "80,43 MiB"],
            ["Falsos positivos", "Não medido", "0,853% · 100k probes"],
          ],
          note: "Uma execução local sem limites artificiais de CPU/memória. RSS inclui o processo todo.",
        },
      ]
    : [
        {
          id: "EXP-0003",
          tab: "HTTP baseline",
          title: "HTTP baseline by access pattern",
          summary: "1,000 requests per workload, concurrency 20, one container, and local PostgreSQL; every redirect returned 302.",
          columns: ["Workload", "req/s", "p95", "p99"],
          rows: [
            ["Uniform", "12,596", "2.726 ms", "3.797 ms"],
            ["80/20", "14,406", "2.218 ms", "2.961 ms"],
            ["Hot key", "12,548", "2.992 ms", "6.926 ms"],
          ],
          note: "Single-machine baseline. It does not measure multiple replicas or production saturation.",
        },
        {
          id: "EXP-0002",
          tab: "ID generation",
          title: "Coordination cost in ID generation",
          summary: "Sequential benchmark per operation. Range measures local generation after reserving blocks of 1,000; Snowflake used a controlled clock.",
          columns: ["Strategy", "ns/op", "Interpretation"],
          rows: [
            ["PostgreSQL sequence", "920,887", "One coordinated operation per ID"],
            ["Redis INCR", "582,268", "Remote increment per ID"],
            ["Range allocation", "2,147", "Amortized after reserving 1,000"],
            ["Snowflake-like", "47.68", "Local generation; controlled clock"],
          ],
          note: "This is not an HTTP test and excludes URL persistence. Sequence remains the default baseline.",
        },
        {
          id: "EXP-0004",
          tab: "Cache Aside",
          title: "Fewer PostgreSQL reads",
          summary: "1,000 measured requests, 20 workers, 50 warm-up requests, and one hot key. Counts below include warm-up.",
          columns: ["Metric", "Cache disabled", "Cache enabled"],
          rows: [
            ["Throughput", "10,582 req/s", "12,230 req/s"],
            ["p95", "3.184 ms", "2.766 ms"],
            ["PostgreSQL queries", "1,050", "5"],
            ["Observed hit ratio", "—", "99.52%"],
          ],
          note: "+15.6% throughput and 1,045 fewer queries in this local run. Cache remains an optimization; PostgreSQL is the durable source.",
        },
        {
          id: "EXP-0005",
          tab: "Tiered cache",
          title: "Fast L1; end-to-end gain not proven",
          summary: "Median of ten isolated adapter benchmarks and two end-to-end comparisons.",
          columns: ["Measurement", "Redis-only", "Tiered cache"],
          rows: [
            ["L1-hit Get", "—", "54.8 ns/op"],
            ["L2-hit Get", "62.1 µs/op", "62.5 µs/op"],
            ["Throughput · 10k req · 50 workers", "16,398 req/s", "16,167 req/s"],
            ["p95 · 10k req · 50 workers", "5.328 ms", "6.160 ms"],
          ],
          note: "The L1 adapter is about three orders of magnitude faster than Redis in this microbenchmark; HTTP load showed no conclusive gain.",
        },
        {
          id: "EXP-0006",
          tab: "Cache stampede",
          title: "HTTP result is inconclusive",
          summary: "Smoke test with 50 requests and 10 workers; process restarted between modes.",
          columns: ["Mode", "DB queries", "L2 GETs", "HTTP errors"],
          rows: [
            ["Coalescing off", "5", "11", "0"],
            ["Coalescing on", "10", "14", "0"],
          ],
          note: "The sample is noisy and cannot attribute an improvement to coalescing. At adapter level, 32 concurrent calls made one L2 query.",
        },
        {
          id: "EXP-0009",
          tab: "SWR",
          title: "SWR lowered latency in this workload",
          summary: "Five repetitions of 10,000 requests per mode (50k per condition), fresh TTL 2 s, stale TTL 30 s, and 100 workers.",
          columns: ["Median", "Strict expiry", "SWR"],
          rows: [
            ["Throughput", "15,587 req/s", "20,651 req/s"],
            ["p50", "3.936 ms", "3.176 ms"],
            ["p95", "12.987 ms", "10.406 ms"],
            ["p99", "31.992 ms", "27.661 ms"],
            ["L2 GETs/run", "2", "0"],
          ],
          note: "The p99 intervals partially overlap. SWR remains off by default pending multi-Pod validation.",
        },
        {
          id: "EXP-0010",
          tab: "Bloom misses",
          title: "Bloom filter protects unique misses",
          summary: "Five repetitions of 10,000 unique missing codes per scenario; concurrency 100. All 100k requests returned 404.",
          columns: ["Median", "Bloom off", "Bloom ready"],
          rows: [
            ["Throughput", "9,565 req/s", "19,327 req/s"],
            ["p50", "8.565 ms", "3.722 ms"],
            ["p95", "16.716 ms", "9.581 ms"],
            ["PostgreSQL queries / 10k", "10,000", "0"],
            ["Redis GETs / 10k", "10,000", "0"],
          ],
          note: "Median throughput was 2.02× higher on this machine. This benchmark measures misses, not mixed traffic.",
        },
        {
          id: "EXP-0011/12",
          tab: "Bloom rebuild",
          title: "Rebuild with 10 million codes",
          summary: "EXP-0011 uses a synthetic scanner; EXP-0012 uses local PostgreSQL 16, a real index, and the application's streaming scanner.",
          columns: ["Metric", "Synthetic · EXP-0011", "PostgreSQL · EXP-0012"],
          rows: [
            ["Rows", "10,000,000", "10,000,000"],
            ["Duration", "2.10 s", "3.283 s"],
            ["Bit array", "11.42 MiB", "11.42 MiB"],
            ["Peak RSS", "Not measured", "80.43 MiB"],
            ["False positives", "Not measured", "0.853% · 100k probes"],
          ],
          note: "One local run without artificial CPU/memory limits. RSS covers the full process.",
        },
      ];
}

export function BenchmarksSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  const experiments = getExperiments(pt);

  return (
    <SectionHeading
      id="benchmarks"
      number="02"
      label={pt ? "Evidências de performance" : "Performance evidence"}
      title={
        pt ? (
          <>
            O que os experimentos <span className="text-sky-600">mostraram</span>
          </>
        ) : (
          <>
            What the experiments <span className="text-sky-600">showed</span>
          </>
        )
      }
      description={
        pt
          ? "Experimentos locais comparam mudanças por meio de cargas e métricas explícitas. Os resultados abaixo não representam metas de produção."
          : "Local experiments compare changes using explicit workloads and metrics. These results are not production targets."
      }
    >
      <div className="border-y border-slate-300 divide-y divide-slate-300">
        {experiments.map((item, index) => (
          <article key={item.id} className="grid gap-6 py-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xl font-extrabold text-sky-700">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-xs font-mono font-semibold text-slate-500">{item.id}</span>
              </div>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-950">{item.title}</h3>
              <div className="mt-3 border-l-2 border-sky-200 pl-4">
                <span className="text-xs font-semibold text-slate-900">{pt ? "O que foi testado e em quais condições" : "What was tested and under which conditions"}</span>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.summary}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.note}</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[360px] text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-300">
                      {item.columns.map((column, columnIndex) => (
                        <th key={column} className={`px-2 py-2 font-semibold text-slate-500 ${columnIndex > 0 ? "text-right" : ""}`}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {item.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, cellIndex) => (
                          <td key={`${row[0]}-${cellIndex}`} className={`px-2 py-2.5 leading-relaxed ${cellIndex === 0 ? "text-slate-700" : "text-right font-mono font-semibold text-slate-900"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </article>
        ))}
      </div>
    </SectionHeading>
  );
}
