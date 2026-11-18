import type { ReactNode } from 'react';

export function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 max-w-4xl text-base text-slate-400">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
      {children}
    </span>
  );
}

const badgeStyles = {
  customer: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  quoted: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  illustrative: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
} as const;

export function Badge({ kind, children }: { kind: keyof typeof badgeStyles; children?: ReactNode }) {
  const text = children ?? (kind === 'customer' ? 'Customer-validated (workshop)' : kind === 'quoted' ? 'Customer-quoted baseline' : 'Illustrative – to be validated');
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badgeStyles[kind]}`}>
      {text}
    </span>
  );
}
