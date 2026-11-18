import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Bot, Link2, MessageSquare, Pause, Play, ShieldCheck } from 'lucide-react';
import { briefingAgentConfig as cfg } from './config';
import { Badge, SectionHeader } from '../../components/ui';

export default function BriefingAgentArchitecture({ onBack, onOpenCoordinator }: { onBack: () => void; onOpenCoordinator: () => void }) {
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const active = cfg.steps[step];

  return (
    <div>
      <style>{`
        @keyframes flow-pulse-b { 0%, 100% { opacity: 0.3; transform: translateX(0); } 50% { opacity: 1; transform: translateX(4px); } }
        @keyframes flow-down-b { 0% { transform: translateY(-6px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(6px); opacity: 0; } }
        @keyframes wave-b { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
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
        <div className="md:col-span-2 xl:col-span-5 border-t border-noc-600 pt-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Core duties</div>
          <ol className="list-decimal space-y-1 pl-5 text-slate-200">{cfg.duties.map((d) => <li key={d}>{d}</li>)}</ol>
          <button className="btn mt-3" onClick={onOpenCoordinator}><Link2 className="h-4 w-4" /> {cfg.coordinatorLink}</button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">
          {cfg.flow.map((f, i) => (
            <span key={f} className="flex items-center gap-2">
              <span className="rounded-lg border border-accent/60 bg-noc-800 px-3 py-1.5 text-white">{f}</span>
              {i < cfg.flow.length - 1 && <ArrowRight className="h-4 w-4 text-accent" style={{ animation: `flow-pulse-b 1.6s ease-in-out ${i * 0.2}s infinite` }} />}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-amber-400/60 px-3 py-2 text-sm text-amber-200">
          <ShieldCheck className="h-4 w-4 shrink-0" /> {cfg.rule}
        </div>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-4">
        <div className="space-y-1 xl:col-span-3">
          {cfg.layers.map((layer, i) => {
            const lit = layer.phases.includes(active.phase);
            const centre = 'centre' in layer && layer.centre;
            return (
              <div key={layer.id}>
                <div
                  className={`rounded-xl border p-4 transition ${lit ? '' : 'opacity-35'} ${centre ? 'border-2' : ''}`}
                  style={{ borderColor: `${layer.color}${centre ? 'ff' : '88'}`, background: `${layer.color}${centre ? '22' : '12'}`, boxShadow: centre ? `0 0 24px ${layer.color}55` : undefined }}
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
                  <div className="flex justify-center py-1" aria-hidden>
                    <ArrowDown className="h-5 w-5 text-accent" style={{ animation: 'flow-down-b 1.6s ease-in-out infinite' }} />
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
        <p className="mt-2 text-xs text-slate-500">The matching parts of the diagram above are highlighted.</p>
      </div>

      <div className="card mb-6">
        <h2 className="mb-1 text-lg font-semibold text-white">{cfg.demo.title}</h2>
        <p className="mb-3 text-sm text-slate-400">Hover a number in the brief to see its source field in the spec.</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-noc-600 bg-noc-900 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Technical Assessment Spec (JSON)</div>
            <pre className="font-mono text-sm leading-7 text-slate-300">
              {'{\n'}
              {cfg.demo.spec.map((f, i) => (
                <div key={f.id} className={`rounded px-2 transition ${hover === f.id ? 'bg-accent/25 text-white ring-1 ring-accent' : ''}`}>
                  {'  '}<span className="text-sky-300">"{f.key}"</span>: <span className="text-emerald-300">{f.value}</span>{i < cfg.demo.spec.length - 1 ? ',' : ''}
                </div>
              ))}
              {'}'}
            </pre>
          </div>
          <div className="rounded-lg border border-noc-600 bg-noc-900 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Generated exec brief</div>
            <div className="whitespace-pre-wrap leading-7 text-slate-100">
              {cfg.demo.brief.map((s, i) => s.field ? (
                <span
                  key={i}
                  onMouseEnter={() => setHover(s.field!)}
                  onMouseLeave={() => setHover(null)}
                  className={`cursor-help rounded px-0.5 font-semibold underline decoration-dotted transition ${hover === s.field ? 'bg-accent/25 text-white' : 'text-accent'}`}
                >{s.text}</span>
              ) : <span key={i}>{s.text}</span>)}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-noc-600 bg-noc-800 p-3">
          <button className="btn btn-primary" onClick={() => setPlaying((p) => !p)}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? 'Pause podcast' : 'Play podcast'}</button>
          <div>
            <div className="font-semibold text-white">{cfg.demo.podcast.title}</div>
            <div className="text-xs text-slate-500">{cfg.demo.podcast.note}</div>
          </div>
          <div className="ml-auto flex h-8 items-end gap-1" aria-hidden>
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="w-1 rounded bg-accent" style={{ height: '100%', transformOrigin: 'bottom', transform: 'scaleY(0.3)', animation: playing ? `wave-b ${0.6 + (i % 5) * 0.15}s ease-in-out ${i * 0.04}s infinite` : undefined }} />
            ))}
          </div>
        </div>
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
