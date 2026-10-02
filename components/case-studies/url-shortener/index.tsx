"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/components/portfolio";
import { ShortenerHero } from "./hero-section";
import { ShortenerSidebar } from "./sidebar";
import { ArchitectureSection } from "./architecture-section";
import { BenchmarksSection } from "./benchmarks-section";
import { CacheSection } from "./cache-section";
import { DistributedSection } from "./distributed-section";
import { ResilienceSection } from "./operations-section";
import { FinalArchitectureSection } from "./final-architecture-section";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function UrlShortenerCaseStudy({ locale }: { locale: Locale }) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full bg-slate-100/80 border-b border-slate-300/80">
        <ShortenerHero locale={locale} />
      </div>

      {/* Main Content with Sticky Sidebar */}
      <div className="w-full bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 flex items-start">
          {/* Sticky Left Sidebar */}
          <div className="hidden lg:block w-64 shrink-0 pr-8 border-r border-slate-200 self-stretch">
            <ShortenerSidebar locale={locale} />
          </div>

          {/* Main Case Study Stream */}
          <div className="flex-1 min-w-0 lg:pl-10 space-y-16 lg:space-y-20">
            {/* 01. Arquitetura (White) */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <ArchitectureSection locale={locale} />
            </motion.div>

            {/* 02. Experimentos e medições (Alternated Slate-100) */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="-mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-12 sm:py-16 bg-slate-100/80 border-y border-slate-300"
            >
              <BenchmarksSection locale={locale} />
            </motion.div>

            {/* 03. Cache e filtro de Bloom (White) */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <CacheSection locale={locale} />
            </motion.div>

            {/* 04. Modelos Distribuídos (Alternated Slate-100) */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="-mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-12 sm:py-16 bg-slate-100/80 border-y border-slate-300"
            >
              <DistributedSection locale={locale} />
            </motion.div>

            {/* 05. Matriz de Resiliência (White) */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <ResilienceSection locale={locale} />
            </motion.div>

            {/* 06. Arquitetura final (Alternated Slate-100) */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="-mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-12 sm:py-16 bg-slate-100/80 border-y border-slate-300"
            >
              <FinalArchitectureSection locale={locale} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
