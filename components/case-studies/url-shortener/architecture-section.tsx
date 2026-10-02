"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiDatabase, FiExternalLink, FiInfo, FiLayers, FiPlay, FiRefreshCw, FiSearch, FiShield, FiX, FiZap } from "react-icons/fi";
import { SiPostgresql, SiRedis } from "react-icons/si";
import { TbBrandGolang, TbGitBranch, TbRoute2 } from "react-icons/tb";
import { cn } from "@/lib/utils";
import type { Locale } from "@/components/portfolio";

type FlowMode = "read" | "write";

type NodeStatus = "idle" | "running" | "hit" | "miss" | "success" | "skipped";

interface NodeDetailInfo {
  title: { pt: string; en: string };
  category: { pt: string; en: string };
  tech: string;
  role: { pt: string; en: string };
  behavior: { pt: string; en: string };
}

const nodeDetails: Record<string, NodeDetailInfo> = {
  // Read Path Nodes
  client_read: {
    title: { pt: "Receber o código", en: "Receive code" },
    category: { pt: "Entrada · leitura", en: "Ingress · read" },
    tech: "HTTP/1.1 · GET /{code}",
    role: {
      pt: "Originador da requisição pública de resolução e redirecionamento de URL.",
      en: "Originator of the public short URL resolution and redirect request."
    },
    behavior: {
      pt: "Envia o código curto no path. Aguarda resposta 302 com o header 'Location' apontando para a URL original durável.",
      en: "Dispatches the short code in URL path. Awaits 302 Found response with Location header targeting original URL."
    }
  },
  bloom_filter: {
    title: { pt: "Verificar o filtro de Bloom", en: "Check Bloom filter" },
    category: { pt: "Pré-verificação · códigos ausentes", en: "Pre-check · absent codes" },
    tech: "FNV-based hashing · 11.42 MiB bit array",
    role: {
      pt: "Interceptação probabilística em O(k) de códigos inexistentes antes de tocar rede ou disco.",
      en: "Probabilistic O(k) interception of nonexistent keys before touching network or storage."
    },
    behavior: {
      pt: "Depois que o filtro termina a carga inicial, uma resposta de ausência permite retornar 404 sem consultar Redis ou PostgreSQL. Antes disso, o caminho segue normalmente.",
      en: "After the filter finishes its initial rebuild, a definite absence can return 404 without querying Redis or PostgreSQL. Until then, requests follow the normal path."
    }
  },
  l1_cache: {
    title: { pt: "Procurar no cache L1", en: "Look up L1 cache" },
    category: { pt: "Memória local · opcional", en: "Local memory · optional" },
    tech: "Local memory cache · 54.8 ns/op adapter median",
    role: {
      pt: "Cache em memória local para códigos repetidos na mesma instância.",
      en: "Local in-memory cache for codes repeated on the same instance."
    },
    behavior: {
      pt: "No benchmark isolado, o hit no cache L1 do adapter em camadas teve mediana de 54,8 ns/op. Esse número não mede o redirect HTTP completo.",
      en: "In an isolated benchmark, an L1 hit in the tiered-cache adapter had a 54.8 ns/op median. This does not measure the full HTTP redirect."
    }
  },
  singleflight: {
    title: { pt: "Agrupar buscas simultâneas", en: "Coalesce simultaneous lookups" },
    category: { pt: "Leituras concorrentes", en: "Concurrent reads" },
    tech: "golang.org/x/sync/singleflight",
    role: {
      pt: "Agrupador de requisições concorrentes em voo para a mesma chave de URL.",
      en: "Coalesces concurrent inflight requests for the identical short code into a single fetch."
    },
    behavior: {
      pt: "Em uma mesma instância, chamadas simultâneas para a mesma chave compartilham a leitura ao cache L2. A consulta ao PostgreSQL não é agrupada por esse mecanismo.",
      en: "Within one process, simultaneous calls for the same key share the L2 cache read. PostgreSQL queries are not coalesced by this mechanism."
    }
  },
  l2_redis: {
    title: { pt: "Procurar no Redis", en: "Look up Redis" },
    category: { pt: "Cache compartilhado · fail-open", en: "Shared cache · fail-open" },
    tech: "Redis 7 · Cache Aside / SWR",
    role: {
      pt: "Cache compartilhado usado antes da consulta ao banco no ambiente local.",
      en: "Shared cache used before the database lookup in the local environment."
    },
    behavior: {
      pt: "Armazena a resolução com TTL configurado. Se Redis estiver indisponível, a leitura tenta o PostgreSQL.",
      en: "Stores the resolution with a configured TTL. If Redis is unavailable, the read tries PostgreSQL."
    }
  },
  postgres_read: {
    title: { pt: "Consultar o banco", en: "Query database" },
    category: { pt: "Armazenamento durável", en: "Durable storage" },
    tech: "PostgreSQL 16 · B-Tree Index",
    role: {
      pt: "Fonte durável dos mapeamentos de URL.",
      en: "Durable source for URL mappings."
    },
    behavior: {
      pt: "Consulta indexada por short_code com deadline configurado de 50 ms. SWR é experimental e desligado por padrão.",
      en: "Indexed lookup by short_code with a configured 50 ms deadline. SWR is experimental and disabled by default."
    }
  },
  client_redirect: {
    title: { pt: "Redirecionar para a URL", en: "Redirect to URL" },
    category: { pt: "Saída · resposta", en: "Output · response" },
    tech: "HTTP/1.1 302 Found · Location Header",
    role: {
      pt: "Redirecionamento do navegador ou cliente HTTP para a URL final.",
      en: "Dispatches HTTP redirect header instructing browser/client to open original destination URL."
    },
    behavior: {
      pt: "No EXP-0004 local, o p95 com cache ligado foi 2,766 ms; esse valor depende do workload e da máquina.",
      en: "In local EXP-0004, p95 with cache enabled was 2.766 ms; this value depends on the workload and machine."
    }
  },

  // Write Path Nodes
  client_write: {
    title: { pt: "Receber a URL", en: "Receive URL" },
    category: { pt: "Entrada · criação", en: "Ingress · creation" },
    tech: "HTTP POST /urls · JSON Payload",
    role: {
      pt: "Originador da solicitação de encurtamento com payload contendo url original.",
      en: "Client submitting URL to be shortened with original URL payload."
    },
    behavior: {
      pt: "Envia requisição POST com a URL de destino. Aguarda HTTP 201 Created com o código gerado.",
      en: "Submits POST request with destination URL. Awaits HTTP 201 Created with generated code."
    }
  },
  validation: {
    title: { pt: "Validar a URL", en: "Validate URL" },
    category: { pt: "Edge Layer · Domínio", en: "Edge Layer · Domain" },
    tech: "Go net/url · RFC 3986",
    role: {
      pt: "Verifica sintaxe, esquema e tamanho da URL antes do processamento.",
      en: "Checks URL syntax, scheme, and size before processing."
    },
    behavior: {
      pt: "Rejeita URLs maliciosas, loops locais, esquemas inválidos e strings com tamanho excessivo.",
      en: "Rejects malicious URLs, local loops, invalid schemes, and oversize payloads with HTTP 400."
    }
  },
  id_generator: {
    title: { pt: "Gerar o identificador", en: "Generate identifier" },
    category: { pt: "Identificação Única", en: "Unique Identification" },
    tech: "Snowflake / Range Allocator / Sequence",
    role: {
      pt: "Gera o identificador usado para formar o código curto.",
      en: "Generates the identifier used to form the short code."
    },
    behavior: {
      pt: "Sequence é a referência padrão. Range allocation e Snowflake-like são alternativas medidas em benchmark isolado de geração.",
      en: "Sequence is the default reference. Range allocation and Snowflake-like are alternatives measured in an isolated generation benchmark."
    }
  },
  base62_encoder: {
    title: { pt: "Codificar em Base62", en: "Encode as Base62" },
    category: { pt: "Transformação de Domínio", en: "Domain Transformation" },
    tech: "Alfabeto [0-9a-zA-Z] · O(1)",
    role: {
      pt: "Converte o número inteiro de 64 bits em uma string curta legível de até 7 caracteres.",
      en: "Converts 64-bit integer into a compact URL-safe string up to 7 characters."
    },
    behavior: {
      pt: "Mapeamento bijetivo estrito sem colisões determinísticas: suporta 62^7 = 3.52 trilhões de códigos únicos.",
      en: "Deterministic bijective bijection without collisions: supports 62^7 = 3.52 trillion unique codes."
    }
  },
  postgres_write: {
    title: { pt: "Salvar no PostgreSQL", en: "Save to PostgreSQL" },
    category: { pt: "Persistência durável · ACID", en: "Durable persistence · ACID" },
    tech: "PostgreSQL 16 · UNIQUE (short_code)",
    role: {
      pt: "Grava o registro de mapeamento da URL com garantias de durabilidade transacional.",
      en: "Commits the URL mapping record in a durable ACID transaction."
    },
    behavior: {
      pt: "Constraint UNIQUE no short_code previne duplicações mesmo sob corridas concorrentes; grava timestamp de criação e metadados.",
      en: "A UNIQUE constraint prevents duplicate short codes during concurrent writes; it records creation time and metadata."
    }
  },
  bloom_populate: {
    title: { pt: "Atualizar filtro e cache", en: "Update filter and cache" },
    category: { pt: "Atualização do caminho de leitura", en: "Read-path update" },
    tech: "Bit Array Update · O(k) + Redis SET",
    role: {
      pt: "Adiciona o novo código ao Filtro de Bloom em memória e pré-aquece o cache.",
      en: "Registers the new code into the in-memory Bloom filter and warms Redis."
    },
    behavior: {
      pt: "Atualiza as estruturas locais depois da criação. O Bloom filter pode ter falsos positivos, mas não falsos negativos após a atualização.",
      en: "Updates local structures after creation. The Bloom filter can have false positives, but not false negatives after the update."
    }
  },
  response_201: {
    title: { pt: "HTTP 201 Created", en: "HTTP 201 Created" },
    category: { pt: "Saída · resposta", en: "Output · response" },
    tech: "HTTP/1.1 201 Created · JSON",
    role: {
      pt: "Retorna a URL curta encurtada com link completo para o usuário.",
      en: "Returns the shortened URL payload with full redirection link."
    },
    behavior: {
      pt: "Contém código encurtado, URL original, timestamp e status de durabilidade.",
      en: "Contains shortened code, original target URL, timestamp and durability status."
    }
  },
};

export function ArchitectureSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  const [simRunning, setSimRunning] = useState(false);
  const [readScenario, setReadScenario] = useState<"hit_l1" | "hit_redis" | "bloom_miss" | "stampede_pg">("hit_l1");
  const [activePopover, setActivePopover] = useState<string | null>(null);

  const [readNodes, setReadNodes] = useState<Record<string, NodeStatus>>({
    client_read: "idle",
    bloom_filter: "idle",
    l1_cache: "idle",
    singleflight: "idle",
    l2_redis: "idle",
    postgres_read: "idle",
    client_redirect: "idle",
  });

  const [writeNodes, setWriteNodes] = useState<Record<string, NodeStatus>>({
    client_write: "idle",
    validation: "idle",
    id_generator: "idle",
    base62_encoder: "idle",
    postgres_write: "idle",
    bloom_populate: "idle",
    response_201: "idle",
  });

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runReadSimulation = async (scenario: typeof readScenario) => {
    if (simRunning) return;
    setSimRunning(true);
    setReadScenario(scenario);

    // Reset
    setReadNodes({
      client_read: "idle",
      bloom_filter: "idle",
      l1_cache: "idle",
      singleflight: "idle",
      l2_redis: "idle",
      postgres_read: "idle",
      client_redirect: "idle",
    });

    // 1. Client
    setReadNodes((s) => ({ ...s, client_read: "running" }));
    await delay(350);
    setReadNodes((s) => ({ ...s, client_read: "success", bloom_filter: "running" }));
    await delay(400);

    if (scenario === "bloom_miss") {
      setReadNodes((s) => ({
        ...s,
        bloom_filter: "miss",
        l1_cache: "skipped",
        singleflight: "skipped",
        l2_redis: "skipped",
        postgres_read: "skipped",
        client_redirect: "miss",
      }));
      setSimRunning(false);
      return;
    }

    setReadNodes((s) => ({ ...s, bloom_filter: "hit", l1_cache: "running" }));
    await delay(450);

    if (scenario === "hit_l1") {
      setReadNodes((s) => ({
        ...s,
        l1_cache: "hit",
        singleflight: "skipped",
        l2_redis: "skipped",
        postgres_read: "skipped",
        client_redirect: "success",
      }));
      setSimRunning(false);
      return;
    }

    // L1 Miss -> Singleflight
    setReadNodes((s) => ({ ...s, l1_cache: "miss", singleflight: "running" }));
    await delay(400);
    setReadNodes((s) => ({ ...s, singleflight: "success", l2_redis: "running" }));
    await delay(450);

    if (scenario === "hit_redis") {
      setReadNodes((s) => ({
        ...s,
        l2_redis: "hit",
        postgres_read: "skipped",
        client_redirect: "success",
      }));
      setSimRunning(false);
      return;
    }

    // Stampede / Cache Miss -> Fallback Postgres
    setReadNodes((s) => ({ ...s, l2_redis: "miss", postgres_read: "running" }));
    await delay(500);
    setReadNodes((s) => ({
      ...s,
      postgres_read: "success",
      client_redirect: "success",
    }));
    setSimRunning(false);
  };

  const runWriteSimulation = async () => {
    if (simRunning) return;
    setSimRunning(true);

    // Reset
    setWriteNodes({
      client_write: "idle",
      validation: "idle",
      id_generator: "idle",
      base62_encoder: "idle",
      postgres_write: "idle",
      bloom_populate: "idle",
      response_201: "idle",
    });

    setWriteNodes((s) => ({ ...s, client_write: "running" }));
    await delay(350);
    setWriteNodes((s) => ({ ...s, client_write: "success", validation: "running" }));
    await delay(350);
    setWriteNodes((s) => ({ ...s, validation: "success", id_generator: "running" }));
    await delay(400);
    setWriteNodes((s) => ({ ...s, id_generator: "success", base62_encoder: "running" }));
    await delay(350);
    setWriteNodes((s) => ({ ...s, base62_encoder: "success", postgres_write: "running" }));
    await delay(500);
    setWriteNodes((s) => ({ ...s, postgres_write: "success", bloom_populate: "running" }));
    await delay(400);
    setWriteNodes((s) => ({ ...s, bloom_populate: "success", response_201: "success" }));
    setSimRunning(false);
  };

  const getNodeStateStyle = (status: NodeStatus) => {
    switch (status) {
      case "running":
        return "border-sky-500 bg-sky-50/90 text-sky-900 ring-2 ring-sky-500/40 shadow-md scale-[1.02] animate-pulse";
      case "hit":
      case "success":
        return "border-emerald-500 bg-emerald-50/90 text-emerald-950 ring-1 ring-emerald-500/30 shadow-xs";
      case "miss":
        return "border-rose-500 bg-rose-50/90 text-rose-950 ring-1 ring-rose-500/30 shadow-xs";
      case "skipped":
        return "border-slate-200/80 bg-slate-100/40 text-slate-400 opacity-40";
      default:
        return "border-slate-300 bg-white text-slate-800 hover:border-sky-400 hover:shadow-xs";
    }
  };

  const renderPopoverCard = (nodeKey: string) => {
    const info = nodeDetails[nodeKey];
    if (!info) return null;

    return (
      <AnimatePresence>
        {activePopover === nodeKey && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 sm:w-80 bg-white rounded-xl border border-slate-300 p-4 shadow-2xl z-50 text-left pointer-events-none"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="text-[10px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                {info.category[locale]}
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {info.tech}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-950 mb-1">
              {info.title[locale]}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              {info.role[locale]}
            </p>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-900 block mb-0.5">
                {pt ? "Comportamento e limite:" : "Behavior and limit:"}
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {info.behavior[locale]}
              </p>
            </div>

            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <section id="architecture" className="scroll-mt-28 space-y-12">
      {/* 1. Header: Arquitetura de Fluxo (2 Columns with Cartoon Gopher Architect) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-sm font-medium text-slate-500 block">
            01 · {pt ? "Arquitetura do fluxo" : "Flow architecture"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            {pt ? (
              <>
                Um código curto,
                <br />
                <span className="text-sky-600">um redirecionamento</span>
              </>
            ) : (
              <>
                One short code,
                <br />
                <span className="text-sky-600">one redirect</span>
              </>
            )}
          </h2>
          <p className="pt-1 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {pt
              ? "Veja como o serviço encontra a URL original, quando consulta os caches e em quais situações recorre ao PostgreSQL."
              : "See how the service finds the original URL, checks its caches, and falls back to PostgreSQL."}
          </p>
        </div>

        {/* Right Illustration: Gopher Architect with Blueprint (Clean, without border container) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/3]">
            <Image
              src="/images/url-shortener-arch-gopher.jpg"
              alt={
                pt
                  ? "Ilustração do Gopher arquiteto analisando a arquitetura do encurtador de URLs"
                  : "Illustration of Gopher architect analyzing URL shortener flow architecture"
              }
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2. Interactive Pipeline Simulator Box */}
      <div className="rounded-2xl border border-slate-300 bg-white shadow-xs">
        {/* Frame Top Bar */}
        <div className="rounded-t-2xl border-b border-slate-300 bg-slate-100/90 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Clean input line without "Cenário de simulação" label */}
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <select
                value={readScenario}
                onChange={(e) => setReadScenario(e.target.value as any)}
                disabled={simRunning}
                className="w-full bg-transparent border-0 border-b-2 border-slate-300 group-hover:border-sky-500 py-1.5 pr-8 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-600 transition-colors cursor-pointer appearance-none"
              >
                <option value="hit_l1">{pt ? "Encontrar no L1 (benchmark de adapter)" : "Find in L1 (adapter benchmark)"}</option>
                <option value="hit_redis">{pt ? "Encontrar no Redis" : "Find in Redis"}</option>
                <option value="bloom_miss">{pt ? "Código ausente no filtro de Bloom" : "Code absent in Bloom filter"}</option>
                <option value="stampede_pg">{pt ? "Consultar PostgreSQL após misses" : "Query PostgreSQL after misses"}</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-sky-600 transition-colors">
                ▾
              </div>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => runReadSimulation(readScenario)}
              disabled={simRunning}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs active:scale-98 disabled:opacity-60 transition-all cursor-pointer"
            >
              {simRunning ? (
                <><FiRefreshCw className="animate-spin text-xs" /> {pt ? "Simulando..." : "Running..."}</>
              ) : (
                <><FiPlay className="text-xs" /> {pt ? "Executar simulação" : "Run simulation"}</>
              )}
            </button>
          </div>
        </div>

        {/* Pipeline Canvas: Connected Node Diagram with Visible Directional Arrows */}
        <div className="p-4 sm:p-6 bg-white space-y-10">
          {/* SECTION A: READ PATH DIAGRAM */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
                <span>{pt ? "1. Caminho de leitura (GET /{code} → HTTP 302)" : "1. Read path (GET /{code} → HTTP 302)"}</span>
              </span>
            </div>

            {/* Responsive Connected Node Pipeline */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-1.5 py-4">
              {/* Node 1: Client Read */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("client_read")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("client_read")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(readNodes.client_read))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">01</span>
                    <TbRoute2 className="text-sky-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">{pt ? "Receber código" : "Receive code"}</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">GET /{`{code}`}</span>
                  </div>
                </div>
              </div>

              {/* Arrow 1 -> 2 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 2: Bloom Filter */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("bloom_filter")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("bloom_filter")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(readNodes.bloom_filter))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">02</span>
                    <FiShield className="text-emerald-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">{pt ? "Verificar Bloom" : "Check Bloom"}</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">Pre-check O(k)</span>
                  </div>
                </div>
              </div>

              {/* Arrow 2 -> 3 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 3: L1 Cache */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("l1_cache")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("l1_cache")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(readNodes.l1_cache))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">03</span>
                    <FiLayers className="text-cyan-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">{pt ? "Procurar no L1" : "Look up L1"}</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">54.8 ns/op</span>
                  </div>
                </div>
              </div>

              {/* Arrow 3 -> 4 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 4: Singleflight */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("singleflight")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("singleflight")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(readNodes.singleflight))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">04</span>
                    <TbGitBranch className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">{pt ? "Agrupar buscas" : "Coalesce lookups"}</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">{pt ? "Coalescer" : "Coalescing"}</span>
                  </div>
                </div>
              </div>

              {/* Arrow 4 -> 5 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 5: L2 Redis */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("l2_redis")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("l2_redis")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(readNodes.l2_redis))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">05</span>
                    <SiRedis className="text-rose-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">{pt ? "Procurar no Redis" : "Look up Redis"}</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">Cache Aside</span>
                  </div>
                </div>
              </div>

              {/* Arrow 5 -> 6 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 6: Postgres Read */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("postgres_read")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("postgres_read")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(readNodes.postgres_read))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">06</span>
                    <SiPostgresql className="text-blue-700 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">{pt ? "Consultar banco" : "Query database"}</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">{pt ? "Leitura durável" : "Durable read"}</span>
                  </div>
                </div>
              </div>

              {/* Arrow 6 -> 7 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 7: Client Redirect */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("client_redirect")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("client_redirect")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(readNodes.client_redirect))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">07</span>
                    {readNodes.client_redirect === "miss" ? (
                      <FiX className="text-rose-600 text-sm" />
                    ) : (
                      <FiCheck className="text-emerald-600 text-sm" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">
                      {readNodes.client_redirect === "miss" ? "HTTP 404" : "HTTP 302"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">
                      {readNodes.client_redirect === "miss" ? (pt ? "Não encontrado" : "Not Found") : "Location Header"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: WRITE PATH DIAGRAM (With continuous grey strip with "2") */}
          <div className="space-y-4 pt-2">
            {/* Continuous Grey Strip Divider with "2" in the middle */}
            <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-slate-100 border-y border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-black grid place-items-center shadow-2xs">
                  2
                </span>
                <span>{pt ? "2. Criar URL curta (POST /urls)" : "2. Create short URL (POST /urls)"}</span>
              </span>
            </div>

            {/* Responsive Connected Node Pipeline */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-1.5 py-4">
              {/* Node 1: Client Write */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("client_write")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("client_write")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(writeNodes.client_write))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">01</span>
                    <TbRoute2 className="text-sky-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">Client</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">POST /urls</span>
                  </div>
                </div>
              </div>

              {/* Arrow 1 -> 2 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 2: Validation */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("validation")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("validation")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(writeNodes.validation))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">02</span>
                    <FiSearch className="text-amber-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">{pt ? "Validação" : "Validation"}</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">RFC 3986</span>
                  </div>
                </div>
              </div>

              {/* Arrow 2 -> 3 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 3: ID Generator */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("id_generator")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("id_generator")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(writeNodes.id_generator))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">03</span>
                    <TbBrandGolang className="text-cyan-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">ID Generator</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">Range / Snowflake</span>
                  </div>
                </div>
              </div>

              {/* Arrow 3 -> 4 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 4: Base62 Encoder */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("base62_encoder")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("base62_encoder")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(writeNodes.base62_encoder))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">04</span>
                    <TbGitBranch className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">Base62</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">{pt ? "Bijetivo O(1)" : "Bijective O(1)"}</span>
                  </div>
                </div>
              </div>

              {/* Arrow 4 -> 5 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 5: Postgres Write */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("postgres_write")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("postgres_write")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(writeNodes.postgres_write))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">05</span>
                    <SiPostgresql className="text-blue-700 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">PostgreSQL</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">ACID Insert</span>
                  </div>
                </div>
              </div>

              {/* Arrow 5 -> 6 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 6: Bloom Populate */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("bloom_populate")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("bloom_populate")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(writeNodes.bloom_populate))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">06</span>
                    <FiZap className="text-amber-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">Bloom Add</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">{pt ? "Atualizar estruturas" : "Update structures"}</span>
                  </div>
                </div>
              </div>

              {/* Arrow 6 -> 7 */}
              <div className="text-slate-400 font-extrabold text-sm select-none shrink-0 px-0.5">
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">↓</span>
              </div>

              {/* Node 7: Response 201 */}
              <div
                className="relative flex-1 w-full lg:w-auto"
                onMouseEnter={() => setActivePopover("response_201")}
                onMouseLeave={() => setActivePopover(null)}
              >
                {renderPopoverCard("response_201")}
                <div className={cn("p-3 rounded-xl border flex flex-col justify-between min-h-[88px] transition-all cursor-help", getNodeStateStyle(writeNodes.response_201))}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">07</span>
                    <FiCheck className="text-emerald-600 text-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-950 block truncate">HTTP 201</span>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">{pt ? "URL Criada" : "Created"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Note Footer */}
        <div className="border-t border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
          <FiInfo className="text-sky-600 text-sm shrink-0 mt-0.5" />
              <p className="text-slate-600 text-xs">
            {pt
              ? "Passe o cursor ou foque cada etapa para ver detalhes do fluxo. Os tempos exibidos são referências de experimentos locais, não medições do redirect completo."
              : "Hover over or focus each step for details. Displayed timings come from local experiments, not measurements of the complete redirect."}
          </p>
        </div>
      </div>
      

      {/* Key decisions in an open editorial layout. */}
      <div className="pt-2">
        <div className="mb-6 max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            {pt ? "Decisões ao longo do caminho" : "Decisions along the request path"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {pt
              ? "O fluxo combina verificações locais e cache antes de consultar a fonte durável. Cada escolha responde a um problema diferente."
              : "The flow combines local checks and caching before reaching the durable source. Each choice addresses a different problem."}
          </p>
        </div>

        <div className="border-y border-slate-300 divide-y divide-slate-300">
          <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="font-mono text-2xl font-extrabold tracking-tight text-sky-700">01</span>
            <div>
              <h4 className="text-lg font-bold text-slate-950">{pt ? "Códigos que não existem" : "Codes that do not exist"}</h4>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                {pt
                  ? "Depois que termina o rebuild, o Bloom filter pode identificar códigos certamente ausentes e evitar consultas ao Redis e ao PostgreSQL. Antes disso, o serviço segue pelo caminho normal."
                  : "After its rebuild completes, the Bloom filter can identify codes that are definitely absent and skip Redis and PostgreSQL. Until then, the service follows the normal path."}
              </p>
              <p className="mt-2 text-xs text-slate-500">{pt ? "Dimensionado para 10 milhões de códigos · bit array de 11,42 MiB" : "Sized for 10 million codes · 11.42 MiB bit array"}</p>
            </div>
          </article>

          <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="font-mono text-2xl font-extrabold tracking-tight text-sky-700">02</span>
            <div>
              <h4 className="text-lg font-bold text-slate-950">{pt ? "URLs acessadas com frequência" : "Frequently accessed URLs"}</h4>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                {pt
                  ? "O cache consulta primeiro a memória local (L1), depois o Redis compartilhado (L2) e, se necessário, o PostgreSQL. O banco permanece como fonte durável."
                  : "The cache checks local memory (L1), then shared Redis (L2), and PostgreSQL when needed. The database remains the durable source."}
              </p>
              <p className="mt-2 text-xs text-slate-500">{pt ? "L1 e L2 têm TTLs próprios; falhas no cache permitem seguir para o banco." : "L1 and L2 have separate TTLs; cache failures allow the request to fall back to the database."}</p>
            </div>
          </article>

          <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="font-mono text-2xl font-extrabold tracking-tight text-sky-700">03</span>
            <div>
              <h4 className="text-lg font-bold text-slate-950">{pt ? "Várias requisições pela mesma chave" : "Concurrent requests for the same key"}</h4>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                {pt
                  ? "Dentro de um processo, chamadas simultâneas compartilham a leitura ao cache L2. Esse mecanismo não agrupa as consultas ao PostgreSQL."
                  : "Within one process, simultaneous calls share the L2 cache read. This mechanism does not coalesce PostgreSQL queries."}
              </p>
              <p className="mt-2 text-xs text-slate-500">{pt ? "Request coalescing · 32 chamadas concorrentes validadas no adapter" : "Request coalescing · 32 concurrent calls validated at the adapter level"}</p>
            </div>
          </article>

          <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
            <span className="font-mono text-2xl font-extrabold tracking-tight text-sky-700">04</span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h4 className="text-lg font-bold text-slate-950">Stale-While-Revalidate (SWR)</h4>
                <span className="text-xs font-medium text-slate-500">{pt ? "opcional · desligado por padrão" : "optional · disabled by default"}</span>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                {pt
                  ? "Durante uma janela curta após o TTL normal, o serviço pode responder com o valor em cache enquanto atualiza a cópia em segundo plano. É uma estratégia experimental."
                  : "For a short window after the normal TTL, the service can return the cached value while refreshing it in the background. This strategy is experimental."}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
