"use client";

import { useEffect, useState } from "react";
import { FiBarChart2, FiDatabase, FiGitBranch, FiHome, FiLayers, FiShield } from "react-icons/fi";
import { FaAws } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import type { Locale } from "@/components/portfolio";

export const shortenerNavItems = [
  { id: "overview", number: "00", label: { pt: "Visão geral", en: "Overview" }, icon: FiHome },
  { id: "architecture", number: "01", label: { pt: "Arquitetura do fluxo", en: "Flow architecture" }, icon: FiLayers },
  { id: "benchmarks", number: "02", label: { pt: "Experimentos e medições", en: "Experiments and measurements" }, icon: FiBarChart2 },
  { id: "cache", number: "03", label: { pt: "Cache e filtro de Bloom", en: "Cache and Bloom filter" }, icon: FiDatabase },
  { id: "distributed", number: "04", label: { pt: "Modelos distribuídos", en: "Distributed models" }, icon: FiGitBranch },
  { id: "resilience", number: "05", label: { pt: "Matriz de resiliência", en: "Resilience matrix" }, icon: FiShield },
  { id: "final-architecture", number: "06", label: { pt: "Arquitetura final", en: "Final architecture" }, icon: FaAws },
];

export function ShortenerSidebar({ locale }: { locale: Locale }) {
  const [active, setActive] = useState("architecture");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      for (const item of [...shortenerNavItems].reverse()) {
        const section = document.getElementById(item.id);
        if (section && section.offsetTop <= scrollPosition) {
          setActive(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-20 space-y-3">
      <div className="text-sm sm:text-[15px] font-bold text-slate-900 pb-2.5 border-b border-slate-200">
        <span>{locale === "pt" ? "Índice do projeto" : "Project index"}</span>
      </div>

      <nav
        aria-label={locale === "pt" ? "Seções do estudo de caso" : "Case study sections"}
        className="flex flex-col space-y-1"
      >
        {shortenerNavItems.map((item) => {
          const isSelected = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                setActive(item.id);
                const target = document.getElementById(item.id);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all text-left",
                isSelected
                  ? "bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600 rounded-l-none shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
              )}
            >
              <span
                className={cn(
                  "font-mono text-xs font-semibold",
                  isSelected ? "text-sky-700" : "text-slate-400"
                )}
              >
                {item.number}
              </span>
              <span className="truncate">{item.label[locale]}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
