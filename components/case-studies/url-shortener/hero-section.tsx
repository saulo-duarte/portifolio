"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa6";
import { FiActivity, FiDatabase, FiLayers, FiShield } from "react-icons/fi";
import { SiKubernetes, SiOpentelemetry, SiPostgresql, SiRedis } from "react-icons/si";
import { TbBrandGolang, TbGitBranch, TbRoute2 } from "react-icons/tb";
import type { Locale } from "@/components/portfolio";
import { MetricCard } from "./shared";

const URL_SHORTENER_REPO_URL = "https://github.com/saulo-duarte/url-shortener";

export function ShortenerHero({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  const root = pt ? "/pt" : "/en";

  return (
    <section id="overview" className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
      {/* 2-Column Main Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-8 sm:mb-10">
        {/* Left Column: Information & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-slate-900 transition-colors"
                href={root}
              >
                <span>←</span>
                <span>{pt ? "Todos os projetos" : "All projects"}</span>
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              URL Shortener
            </h1>
          </div>

          <p className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight leading-snug">
            {pt
              ? "Um encurtador de URLs para estudar a evolução de um caminho de leitura"
              : "A URL shortener used to study how a read path evolves"}
          </p>

          <p className="text-sm sm:text-[14.5px] text-slate-600 leading-relaxed">
            {pt ? (
              <>
                Serviço em <strong className="text-sky-700 font-semibold">Go</strong>, com{" "}
                <strong className="text-sky-700 font-semibold">PostgreSQL</strong> como fonte durável e{" "}
                <strong className="text-sky-700 font-semibold">Redis</strong> como camada de cache. O laboratório mede
                mudanças no caminho de leitura com <strong className="text-sky-700 font-semibold">Cache Aside</strong> e{" "}
                <strong className="text-sky-700 font-semibold">Bloom filter</strong>, além de usar simuladores locais para
                estudar <strong className="text-sky-700 font-semibold">sharding e quorum</strong>.
              </>
            ) : (
              <>
                A service in <strong className="text-sky-700 font-semibold">Go</strong>, with{" "}
                <strong className="text-sky-700 font-semibold">PostgreSQL</strong> as the durable source and{" "}
                <strong className="text-sky-700 font-semibold">Redis</strong> as a cache layer. The lab measures
                read-path changes with <strong className="text-sky-700 font-semibold">Cache Aside</strong> and{" "}
                <strong className="text-sky-700 font-semibold">Bloom filters</strong>, and uses local simulators to study{" "}
                <strong className="text-sky-700 font-semibold">sharding and quorum</strong>.
              </>
            )}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#architecture"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-sky-600 bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer active:scale-98"
            >
              <TbGitBranch className="text-sm text-white" />
              <span className="text-white">{pt ? "Explorar arquitetura" : "Explore architecture"}</span>
              <span className="text-white">→</span>
            </a>

            <a
              href={URL_SHORTENER_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
            >
              <FaGithub className="text-sm text-slate-900" />
              <span>{pt ? "Ver no GitHub" : "View on GitHub"}</span>
              <span className="text-xs text-slate-400">↗</span>
            </a>
          </div>
        </motion.div>

        {/* Right Column: Panoramic Architecture Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center items-stretch"
        >
          <div className="relative w-full min-h-[280px] lg:min-h-full rounded-2xl overflow-hidden bg-slate-950 shadow-xs group">
            <Image
              src="/images/url-shortener-cover-cartoon.png"
              alt={
                pt
                  ? "Ilustração cartoon do laboratório de URL Shortener, Redis, Base62 e PostgreSQL"
                  : "Cartoon illustration of the URL Shortener lab with Redis, Base62, and PostgreSQL"
              }
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
              quality={95}
            />
          </div>
        </motion.div>
      </div>

      {/* Clean Centered Horizontal Tech & Architecture Strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="pt-6 border-t border-slate-300"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-6 gap-y-3 py-1 text-center">
          {/* Go */}
          <div className="inline-flex items-center gap-2 text-slate-800 text-xs sm:text-sm font-semibold">
            <TbBrandGolang className="text-lg text-cyan-600" />
            <span>Go</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* PostgreSQL */}
          <div className="inline-flex items-center gap-2 text-slate-800 text-xs sm:text-sm font-semibold">
            <SiPostgresql className="text-base text-sky-700" />
            <span>PostgreSQL (SQLC)</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Redis */}
          <div className="inline-flex items-center gap-2 text-slate-800 text-xs sm:text-sm font-semibold">
            <SiRedis className="text-base text-red-600" />
            <span>Redis L1/L2</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Bloom Filter */}
          <div className="inline-flex items-center gap-2 text-slate-800 text-xs sm:text-sm font-semibold">
            <FiShield className="text-base text-emerald-600" />
            <span>Bloom Filter</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Kubernetes */}
          <div className="inline-flex items-center gap-2 text-slate-800 text-xs sm:text-sm font-semibold">
            <SiKubernetes className="text-base text-blue-600" />
            <span>Kubernetes + Helm</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* OpenTelemetry */}
          <div className="inline-flex items-center gap-2 text-slate-800 text-xs sm:text-sm font-semibold">
            <SiOpentelemetry className="text-base text-violet-600" />
            <span>OpenTelemetry</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
