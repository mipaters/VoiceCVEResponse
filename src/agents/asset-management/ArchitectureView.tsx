import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Bot, MessageSquare, ShieldCheck } from 'lucide-react';
import { assetAgentConfig as cfg } from './config';
import { Badge, SectionHeader } from '../../components/ui';

export default function AssetAgentArchitecture({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const active = cfg.steps[step];

  return (
    <div>
      <style>{`
        @keyframes flow-up { 0% { transform: translateY(8px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-8px); opacity: 0; } }
        @keyframes flow-down { 0% { transform: translateY(-8px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(8px); opacity: 0; } }
      `}</style>
      <button className="btn mb-4" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back to Agent Catalogue</button>
      <SectionHeader title={cfg.title} subtitle={cfg.agentName} right={<Badge kind="illustrative" />} />

      <div className="card mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[['Role', cfg.job.role], ['Reports to', cfg.job.reportsTo], ['KPI', cfg.job.kpi], ['Problem solved', cfg.job.problem]].map(([k, v]) => (
          <div key={k}>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k}</div>
            <div className="mt-1 text-slate-100">{v}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-4">
        <div className="space-y-1 xl:col-span-3">
          {cfg.layers.map((layer, i) => {
            const lit = layer.phases.includes(active.phase);
            return (
              <div key={layer.id}>
                <div
                  className={`rounded-xl border p-4 transition ${lit ? '' : 'opacity-35'}`}
                  style={{ borderColor: `${layer.color}88`, background: `${layer.color}12` }}
                >
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
                  <div className="flex justify-center gap-16 py-1" aria-hidden>
                    <ArrowUp className="h-5 w-5 text-sky-400" style={{ animation: 'flow-up 1.6s ease-in-out infinite' }} />
                    <ArrowDown className="h-5 w-5 text-emerald-400" style={{ animation: 'flow-down 1.6s ease-in-out infinite' }} />
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm">
            <span className="flex items-center gap-1 text-sky-300"><ArrowUp className="h-4 w-4" /> {cfg.flows.up}</span>
            <span className="flex items-center gap-1 text-emerald-300"><ArrowDown className="h-4 w-4" /> {cfg.flows.down}</span>
          </div>
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
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> <span className="italic">“{active.prompt}”</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">The matching parts of the diagram above are highlighted.</p>
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
