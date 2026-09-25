"use client";

import { FiShield } from "react-icons/fi";
import { GOLEDGER_REPO_URL } from "./types";
import type { Locale } from "@/components/portfolio";

export function CalloutSection({ locale }: { locale: Locale }) {
  return (
    <section className="pt-4">
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 text-emerald-600 grid place-items-center text-2xl flex-shrink-0 shadow-2xs">
            <FiShield />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-emerald-950 mb-1">
              {locale === "pt" ? "Código aberto e pronto para inspeção" : "Open source and ready for inspection"}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-xl">
              {locale === "pt"
                ? "Explore o repositório no GitHub para conferir os testes de integração, migrações SQLC, orquestração de Saga e manifests de Kubernetes e Terraform."
                : "Explore the GitHub repository for integration tests, SQLC migrations, Saga orchestration, and Kubernetes/Terraform manifests."}
            </p>
          </div>
        </div>
        <a
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex-shrink-0"
          href={GOLEDGER_REPO_URL}
          target="_blank"
          rel="noreferrer"
        >
          <span>{locale === "pt" ? "Ver no GitHub" : "View on GitHub"}</span>
          <span>→</span>
        </a>
      </div>
    </section>
  );
}
