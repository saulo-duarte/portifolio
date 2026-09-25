"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiActivity, FiDatabase, FiLayers } from "react-icons/fi";
import { SiKubernetes, SiOpentelemetry, SiPostgresql, SiTerraform } from "react-icons/si";
import { TbBrandAws, TbBrandGolang, TbGitBranch } from "react-icons/tb";
import { FaGithub } from "react-icons/fa6";
import { GOLEDGER_REPO_URL } from "./types";
import type { Locale } from "@/components/portfolio";

export function HeroSection({ locale }: { locale: Locale }) {
  const root = locale === "pt" ? "/pt" : "/en";

  return (
    <section id="overview" className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Information & Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-7 space-y-5"
        >
          <div>
            <Link
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
              href={root}
            >
              ← {locale === "pt" ? "Todos os projetos" : "All projects"}
            </Link>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 flex items-center">
              <span>Go</span>
              <span className="text-sky-600">Ledger</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-950 tracking-tight leading-snug">
            {locale === "pt"
              ? "Ledger financeiro distribuído com consistência, idempotência e processamento orientado a eventos"
              : "Distributed financial ledger with consistency, idempotency and event-driven processing"}
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            {locale === "pt"
              ? "Simulação de um ledger financeiro distribuído projetado para lidar com consistência contábil, idempotência, falhas parciais e processamento assíncrono em operações críticas. O projeto explora Event Sourcing, CQRS e arquitetura orientada a eventos em um ecossistema cloud-native com Go."
              : "Simulation of a distributed financial ledger designed to handle accounting consistency, idempotency, partial failures, and asynchronous processing in mission-critical operations. The project explores Event Sourcing, CQRS, and event-driven architecture within a cloud-native Go ecosystem."}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#architecture"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-sky-600/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
            >
              <TbGitBranch className="text-base" />
              <span>{locale === "pt" ? "Ver arquitetura" : "View architecture"}</span>
              <span>→</span>
            </a>

            <a
              href={GOLEDGER_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs transition-all"
            >
              <FaGithub className="text-sm" />
              <span>{locale === "pt" ? "Ver no GitHub" : "View on GitHub"}</span>
              <span className="text-xs">↗</span>
            </a>
          </div>

          {/* Categorized Tech Badges */}
          <div className="space-y-2.5 pt-3 border-t border-slate-200/80">
            {/* Core */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
              <span className="text-[11px] font-semibold text-slate-600 w-24 shrink-0">
                Core:
              </span>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-sky-200 bg-sky-50/70 text-[11px] font-semibold text-sky-900 shadow-2xs">
                  <TbBrandGolang className="text-sm text-sky-600" />
                  <span>Go</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/70 text-[11px] font-semibold text-blue-900 shadow-2xs">
                  <SiPostgresql className="text-sm text-blue-700" />
                  <span>PostgreSQL</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/70 text-[11px] font-semibold text-blue-900 shadow-2xs">
                  <FiDatabase className="text-sm text-blue-600" />
                  <span>DynamoDB</span>
                </div>
              </div>
            </div>

            {/* Architecture */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
              <span className="text-[11px] font-semibold text-slate-600 w-24 shrink-0">
                {locale === "pt" ? "Arquitetura:" : "Architecture:"}
              </span>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50/70 text-[11px] font-semibold text-emerald-900 shadow-2xs">
                  <FiActivity className="text-sm text-emerald-600" />
                  <span>Event Sourcing</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50/70 text-[11px] font-semibold text-indigo-900 shadow-2xs">
                  <FiLayers className="text-sm text-indigo-600" />
                  <span>CQRS</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-orange-200 bg-orange-50/70 text-[11px] font-semibold text-orange-900 shadow-2xs">
                  <TbBrandAws className="text-sm text-orange-600" />
                  <span>AWS SNS</span>
                </div>
              </div>
            </div>

            {/* Infrastructure */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
              <span className="text-[11px] font-semibold text-slate-600 w-24 shrink-0">
                {locale === "pt" ? "Infraestrutura:" : "Infrastructure:"}
              </span>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-sky-200 bg-sky-50/70 text-[11px] font-semibold text-sky-900 shadow-2xs">
                  <SiKubernetes className="text-sm text-sky-700" />
                  <span>Kubernetes</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50/70 text-[11px] font-semibold text-purple-900 shadow-2xs">
                  <SiTerraform className="text-sm text-purple-600" />
                  <span>Terraform</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-violet-200 bg-violet-50/70 text-[11px] font-semibold text-violet-900 shadow-2xs">
                  <SiOpentelemetry className="text-sm text-violet-600" />
                  <span>OpenTelemetry</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Editorial Architecture Illustration (Scaled down 15-20%) */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[500px] aspect-[16/11] max-h-[380px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-900 group">
            <Image
              src="/images/goledge-hero.png"
              alt="Ilustração editorial do GoLedger com mascotes Gophers em arquitetura financeira distribuída"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-102"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
