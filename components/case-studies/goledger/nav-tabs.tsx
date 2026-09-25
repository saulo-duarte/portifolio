"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiActivity, FiBox, FiDatabase, FiHome, FiLayers, FiPlay, FiSliders, FiTarget } from "react-icons/fi";
import { FaGithub } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import type { Locale } from "@/components/portfolio";

interface TabItem {
  id: string;
  label: { pt: string; en: string };
  icon: React.ElementType;
}

const navTabs: TabItem[] = [
  { id: "overview", label: { pt: "Visão geral", en: "Overview" }, icon: FiHome },
  { id: "problem", label: { pt: "Desafios", en: "Challenges" }, icon: FiTarget },
  { id: "architecture", label: { pt: "Arquitetura", en: "Architecture" }, icon: FiLayers },
  { id: "simulator", label: { pt: "Simulador", en: "Simulator" }, icon: FiPlay },
  { id: "cap-theorem", label: { pt: "Trade-offs", en: "Trade-offs" }, icon: FiSliders },
  { id: "tech-stack", label: { pt: "Stack", en: "Stack" }, icon: FiBox },
  { id: "domain-mdx", label: { pt: "Domínio", en: "Domain" }, icon: FiDatabase },
  { id: "observability", label: { pt: "Observabilidade", en: "Observability" }, icon: FiActivity },
];

export function GoledgerHeader({ locale }: { locale: Locale }) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const root = locale === "pt" ? "/pt" : "/en";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollPosition = scrollY + 220;
      for (const tab of [...navTabs].reverse()) {
        const el = document.getElementById(tab.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveTab(tab.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const target = document.getElementById("overview");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs transition-all">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        
        {/* Left: Brand logo + GoLedger Pill */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link className="flex items-center gap-2 group" href={root} title={locale === "pt" ? "Página inicial" : "Home page"}>
            <span className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200/80 text-sky-700 font-bold text-xs grid place-items-center shadow-2xs group-hover:bg-sky-200/70 transition-colors">
              SL
            </span>
            <span className="font-bold text-slate-900 text-sm tracking-tight hidden sm:inline">saulo.dev</span>
          </Link>

          <span className="h-4 w-px bg-slate-200 hidden md:block" />

          {/* GoLedger Thumbnail Pill that scrolls to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-102"
            title={locale === "pt" ? "Voltar ao topo do projeto" : "Back to top of project"}
          >
            <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-200/80 flex-shrink-0 shadow-2xs bg-slate-900">
              <Image
                src="/images/goledge-hero.png"
                alt="GoLedger"
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-950 flex items-center whitespace-nowrap">
              <span>Go</span>
              <span className="text-sky-600">Ledger</span>
            </span>
          </button>
        </div>

        {/* Center: Case Study Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 flex-1 justify-center overflow-x-auto no-scrollbar py-0.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.id);
                  const target = document.getElementById(tab.id);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-medium transition-all whitespace-nowrap cursor-pointer border-b-2 rounded-none",
                  isActive
                    ? "border-sky-600 text-sky-700 font-semibold"
                    : "border-transparent text-slate-600 hover:text-slate-950 hover:border-slate-300"
                )}
              >
                <Icon className={cn("text-sm flex-shrink-0", isActive ? "text-sky-600" : "text-slate-400")} />
                <span>{tab.label[locale]}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: GitHub & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <a
            href="https://github.com/saulo-duarte/distributed-wallet-ledger"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-2xs transition-all"
          >
            <FaGithub className="text-xs text-slate-800" />
            <span>GitHub</span>
          </a>

          <div className="h-4 w-px bg-slate-200 hidden lg:block" />

          {/* Lang switcher pill with country flags */}
          <div className="inline-flex p-0.5 rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold shadow-2xs">
            <Link
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-xs font-medium",
                locale === "pt"
                  ? "bg-white text-slate-950 font-bold shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              )}
              href="/pt/projects/goledge"
            >
              <BrazilFlag className="w-4 h-3 rounded-2xs overflow-hidden shadow-2xs" />
              <span>PT</span>
            </Link>
            <Link
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-xs font-medium",
                locale === "en"
                  ? "bg-white text-slate-950 font-bold shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              )}
              href="/en/projects/goledge"
            >
              <UsaFlag className="w-4 h-3 rounded-2xs overflow-hidden shadow-2xs" />
              <span>EN</span>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}

export function BrazilFlag({ className = "w-4 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" width="16" height="12">
      <path fill="#009c3b" d="M0 0h640v480H0z"/>
      <path fill="#ffdf00" d="M320 54 594 240 320 426 46 240z"/>
      <circle fill="#002776" cx="320" cy="240" r="110"/>
      <path fill="#fff" d="M211 254c30-18 69-28 109-28 35 0 68 8 96 22-5-18-20-33-39-44-18-10-38-15-57-15-40 0-77 17-109 65z"/>
    </svg>
  );
}

export function UsaFlag({ className = "w-4 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" width="16" height="12">
      <path fill="#bd3d44" d="M0 0h640v480H0z"/>
      <path stroke="#fff" strokeWidth="37" d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
      <path fill="#192f5d" d="M0 0h260v259H0z"/>
      <circle fill="#fff" cx="30" cy="30" r="8"/>
      <circle fill="#fff" cx="70" cy="30" r="8"/>
      <circle fill="#fff" cx="110" cy="30" r="8"/>
      <circle fill="#fff" cx="150" cy="30" r="8"/>
      <circle fill="#fff" cx="190" cy="30" r="8"/>
      <circle fill="#fff" cx="230" cy="30" r="8"/>
      <circle fill="#fff" cx="50" cy="65" r="8"/>
      <circle fill="#fff" cx="90" cy="65" r="8"/>
      <circle fill="#fff" cx="130" cy="65" r="8"/>
      <circle fill="#fff" cx="170" cy="65" r="8"/>
      <circle fill="#fff" cx="210" cy="65" r="8"/>
    </svg>
  );
}

// Export NavTabs as alias for backwards compatibility
export const NavTabs = GoledgerHeader;

