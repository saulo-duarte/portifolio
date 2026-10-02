import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  number,
  label,
  title,
  description,
  children,
  className,
}: {
  id: string;
  number: string;
  label: string;
  title: string | ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28", className)}>
      <div className="mb-8 sm:mb-10 space-y-2.5">
        <span className="text-sm font-medium text-slate-500 block">
          {number} · {label}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-slate-950 leading-[1.18]">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:border-slate-300/90 transition-all">
      <strong className="block font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-sky-600">
        {value}
      </strong>
      <span className="mt-1.5 block text-sm font-bold text-slate-950">
        {label}
      </span>
      <span className="mt-1 block text-xs font-mono text-slate-500 leading-relaxed">
        {detail}
      </span>
    </div>
  );
}

export function DetailCard({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between",
        className
      )}
    >
      <div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200/80">
          {eyebrow}
        </span>
        <h3 className="mt-2.5 text-base sm:text-lg font-bold tracking-tight text-slate-950">
          {title}
        </h3>
        <div className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
          {children}
        </div>
      </div>
    </article>
  );
}
