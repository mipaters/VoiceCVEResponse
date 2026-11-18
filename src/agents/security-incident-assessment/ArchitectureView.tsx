import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Bot, CornerUpLeft, Link2, MessageSquare, ShieldCheck } from 'lucide-react';
import { assessmentAgentConfig as cfg } from './config';
import { Badge, SectionHeader } from '../../components/ui';

export default function AssessmentAgentArchitecture({ onBack, onOpenInventory }: { onBack: () => void; onOpenInventory: () => void }) {
  const [step, setStep] = useState(0);
  const active = cfg.steps[step];

  return (
    <div>
      <style>{`
        @keyframes flow-pulse { 0%, 100% { opacity: 0.3; transform: translateX(0); } 50% { opacity: 1; transform: translateX(4px); } }
        @keyframes flow-down-a { 0% { transform: translateY(-6px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(6px); opacity: 0; } }
      `}</style>
      <button className="btn mb-4" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back to Agent Catalogue</button>
      <SectionHeader title={cfg.title} subtitle={cfg.agentName} right={<Badge kind="illustrative" />} />

      <div className="card mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[['Role', cfg.job.role], ['Reports to', cfg.job.reportsTo], ['KPI', cfg.job.kpi], ['Problem solved', cfg.job.problem], ['Failure mode', cfg.job.failureMode]].map(([k, v]) => (
          <div key={k}>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k}</div>
            <div className="mt-1 text-slate-100">{v}</div>
          </div>
        ))}
        <div className="md:col-span-2 xl:col-span-5 flex flex-wrap items-center gap-3 border-t border-noc-600 pt-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Core duties</span>
          {cfg.duties.map((d, i) => <span key={d} className="chip">{i + 1}. {d}</span>)}
          <button className="btn ml-auto" onClick={onOpenInventory}><Link2 className="h-4 w-4" /> {cfg.inventoryLink}</button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">
          {cfg.flow.map((f, i) => (
            <span key={f} className="flex items-center gap-2">
              <span className="rounded-lg border border-accent/60 bg-noc-800 px-3 py-1.5 text-white">{f}</span>
              {i < cfg.flow.length - 1 && <ArrowRight className="h-4 w-4 text-accent" style={{ animation: `flow-pulse 1.6s ease-in-out ${i * 0.25}s infinite` }} />}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-amber-400/60 px-3 py-2 text-sm text-amber-200">
          <CornerUpLeft className="h-4 w-4 shrink-0" /> {cfg.feedback}
        </div>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-4">
        <div className="space-y-1 xl:col-span-3">
          {cfg.layers.map((layer, i) => {
            const lit = layer.phases.includes(active.phase);
            return (
              <div key={layer.id}>
                <div className={`rounded-xl border p-4 transition ${lit ? '' : 'opacity-35'}`} style={{ borderColor: `${layer.color}88`, background: `${layer.color}12` }}>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: layer.color }}>{layer.name}</div>
                  <div className="flex flex-wrap gap-3">
                    {layer.blocks.map((b) => {
                      const own = 'phase' in b ? b.phase === active.phase : lit;
                      return (
                        <div
                          key={b.label}
                          className={`min-w-[200px] flex-1 rounded-lg border bg-noc-800 px-3 py-2 transition ${own ? 'ring-2' : 'opacity-50'}`}
                          style={{ borderColor: layer.color, ['--tw-ring-color' as string]: layer.color }}
                        >
                          <div className="font-semibold text-white">{b.label}</div>
                          <div className="text-sm text-slate-400">{b.detail}</div>
                        </div>
                      );
                    })}
                  </div>
                  {'tools' in layer && layer.tools && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-slate-500">Tools:</span>
                      {layer.tools.map((t) => <span key={t} className="chip">{t}</span>)}
                    </div>
                  )}
                </div>
                {i < cfg.layers.length - 1 && (
                  <div className="flex justify-center py-1" aria-hidden>
                    <ArrowDown className="h-5 w-5 text-accent" style={{ animation: 'flow-down-a 1.6s ease-in-out infinite' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="card h-fit border-pink-400/40">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pink-300"><ShieldCheck className="h-4 w-4" /> Governance</div>
          <div className="space-y-2">
            {cfg.governance.map((g) => <div key={g} className="rounded-lg border border-pink-400/40 bg-noc-800 px-3 py-2 text-white">{g}</div>)}
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="mb-3 text-lg font-semibold text-white">Crawl → Walk → Run</h2>
        <div className="mb-4 flex flex-wrap gap-2" role="tablist">
          {cfg.steps.map((s, i) => (
            <button
              key={s.phase}
              role="tab"
              aria-selected={i === step}
              onClick={() => setStep(i)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${i === step ? 'bg-accent text-noc-950' : 'bg-noc-800 text-slate-300 hover:text-white'}`}
            >
              {i + 1}. {s.label}
            </button>
          ))}
        </div>
        <p className="text-lg text-slate-200">{active.summary}</p>
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-noc-600 bg-noc-900 p-3 text-slate-100">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> <span className="italic">{active.sample}</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">The matching outputs in the Communications layer above are highlighted.</p>
      </div>

      <div className="card mb-6 overflow-x-auto p-0">
        <div className="flex items-center gap-2 border-b border-noc-600 px-4 py-3 text-lg font-semibold text-white"><Bot className="h-5 w-5 text-accent" /> Why Studio + Foundry</div>
        <table className="w-full">
          <thead><tr>{['Capability', 'Built in', 'Why'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>
            {cfg.whyTable.map((r) => (
              <tr key={r.capability} className="border-t border-noc-700">
                <td className="td font-semibold text-white">{r.capability}</td>
                <td className="td text-accent">{r.builtIn}</td>
                <td className="td">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-2 flex items-center gap-2"><h2 className="text-lg font-semibold text-white">KPIs</h2><span className="chip border-amber-500/50 text-amber-300">{cfg.kpiNote}</span></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cfg.kpis.map((k) => (
          <div key={k.label} className="card">
            <div className="text-sm text-slate-400">{k.label}</div>
            <div className="mt-1 text-3xl font-bold text-emerald-400">{k.value}</div>
            <div className="text-xs text-slate-500">{k.target}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
