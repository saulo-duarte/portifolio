"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import type { Locale } from "@/components/portfolio";
import { BrazilFlag, UsaFlag } from "@/components/case-studies/goledger/nav-tabs";

export function UrlShortenerHeader({ locale }: { locale: Locale }) {
  const root = locale === "pt" ? "/pt" : "/en";

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
        {/* Left: Brand logo + URL Shortener Pill */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link
            className="flex items-center gap-2 group"
            href={root}
            title={locale === "pt" ? "Página inicial" : "Home page"}
          >
            <span className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200/80 text-sky-700 font-bold text-xs grid place-items-center shadow-2xs group-hover:bg-sky-200/70 transition-colors">
              SL
            </span>
            <span className="font-bold text-slate-900 text-sm tracking-tight hidden sm:inline">
              saulo.dev
            </span>
          </Link>

          <span className="h-4 w-px bg-slate-200 hidden md:block" />

          {/* URL Shortener Thumbnail Pill that scrolls to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-102"
            title={locale === "pt" ? "Voltar ao topo do projeto" : "Back to top of project"}
          >
            <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-200/80 flex-shrink-0 shadow-2xs bg-slate-900">
              <Image
                src="/images/url-shortener-cover-cartoon.png"
                alt="URL Shortener"
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-950 flex items-center whitespace-nowrap">
              <span>URL</span>
              <span className="text-sky-600 ml-1">Shortener</span>
            </span>
          </button>
        </div>

        {/* Right: GitHub & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <a
            href="https://github.com/saulo-duarte/url-shortener"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-2xs transition-all"
          >
            <FaGithub className="text-sm text-slate-800" />
            <span>GitHub</span>
          </a>

          <div className="h-4 w-px bg-slate-200" />

          {/* Lang switcher pill with country flags */}
          <div className="inline-flex p-0.5 rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold shadow-2xs">
            <Link
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-xs font-medium",
                locale === "pt"
                  ? "bg-white text-slate-950 font-bold shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              )}
              href="/pt/projects/url-shortener"
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
              href="/en/projects/url-shortener"
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
