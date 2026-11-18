import { AlertTriangle, CheckCircle2, PauseCircle, RotateCw } from 'lucide-react';
import type { Artefact, Tone } from '../data/scenario';

const toneClass: Record<Tone, string> = {
  good: 'text-emerald-400',
  warn: 'text-amber-400',
  bad: 'text-rose-400',
  neutral: 'text-slate-200',
};

const cellTone = (v: string): string => {
  if (/internet/i.test(v)) return 'text-rose-400';
  if (/internal/i.test(v)) return 'text-slate-300';
  return '';
};

export default function ArtefactView({ a }: { a: Artefact }) {
  return (
    <div className="rounded-lg border border-noc-600 bg-noc-900/70 p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent">{a.title}</div>
      {a.kind === 'kv' && (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {a.rows.map(([k, v, t]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 border-b border-noc-700 pb-1">
              <dt className="text-sm text-slate-400">{k}</dt>
              <dd className={`text-sm font-semibold ${toneClass[t ?? 'neutral']}`}>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {a.kind === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>{a.columns.map((c) => <th key={c} className="th">{c}</th>)}</tr>
            </thead>
            <tbody>
              {a.rows.map((r, i) => (
                <tr key={i} className="border-t border-noc-700">
                  {r.map((c, j) => (
                    <td key={j} className={`td ${a.toneCol === j ? cellTone(c) : ''} ${r[0] === 'Total' ? 'font-bold' : ''}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {a.kind === 'score' && (
        <div>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-rose-500 text-3xl font-bold text-white">
              {a.total}
            </div>
            <div>
              <div className="text-lg font-semibold text-rose-400">{a.verdict}</div>
              <div className="text-sm text-slate-400">out of 100 · policy threshold for emergency change ≥ 90</div>
            </div>
          </div>
          <div className="space-y-2">
            {a.factors.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{f.label} <span className="text-slate-500">· {f.note}</span></span>
                  <span className="font-mono text-slate-200">{f.value}/{f.max}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-noc-700">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500" style={{ width: `${(f.value / f.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {a.kind === 'doc' && (
        <ul className="space-y-1.5 font-mono text-[13px] leading-relaxed text-slate-300">
          {a.lines.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      )}
      {a.kind === 'checklist' && (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {a.items.map((i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> {i}
            </li>
          ))}
        </ul>
      )}
      {a.kind === 'canary' && (
        <div className="space-y-3">
          {a.waves.map((w) => (
            <div key={w.name} className={`rounded-lg border p-3 ${w.status === 'paused' ? 'border-amber-500/60 bg-amber-500/5' : 'border-noc-600'}`}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-white">
                  {w.status === 'green' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  {w.status === 'paused' && <PauseCircle className="h-4 w-4 text-amber-400" />}
                  {w.status === 'resumed' && <RotateCw className="h-4 w-4 text-sky-400" />}
                  {w.name} <span className="text-sm font-normal text-slate-400">· {w.nodes}</span>
                </div>
                <span className={`chip ${w.status === 'paused' ? 'border-amber-500 text-amber-300' : ''}`}>{w.status.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <Metric label="ASR" value={`${w.asr}%`} ok={w.asr >= 98.5} />
                <Metric label="MOS" value={w.mos.toFixed(1)} ok={w.mos >= 4.0} />
                <Metric label="PDD" value={`${w.pdd.toFixed(1)} s`} ok={w.pdd <= 2.5} />
              </div>
              {w.note && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" /> {w.note}
                </div>
              )}
            </div>
          ))}
          <div className="text-xs text-slate-500">Guardrails: ASR ≥ 98.5%, MOS ≥ 4.0, PDD ≤ 2.5 s</div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-md bg-noc-800 py-2">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-xl font-bold ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>{value}</div>
    </div>
  );
}
