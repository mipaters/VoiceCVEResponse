import { useState } from 'react';
import { ArrowDown, Bot, UserCheck } from 'lucide-react';
import { archLayers, autonomyLevels, type ArchNode } from '../data/architecture';
import { currentStages as stages } from '../data/currentProcess';
import { Badge, SectionHeader } from '../components/ui';

export default function Architecture() {
  const [selected, setSelected] = useState<ArchNode>(archLayers[2].nodes[0]);
  const [level, setLevel] = useState(3);
  const auto = autonomyLevels.find((l) => l.level === level)!;

  const needsHuman = (n: ArchNode) => !!n.humanStages?.some((s) => auto.humanStages.includes(s));

  return (
    <div>
      <SectionHeader
        title="Reference Architecture"
        subtitle="Click any component to see its role. Move the autonomy slider to see which of your 8 stages stay human-approved. On-prem / private-cloud estate connects via Azure Arc."
        right={<Badge kind="illustrative" />}
      />

      <div className="card mb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">Autonomy level</div>
            <div className="text-xl font-bold text-white">{auto.name}</div>
            <p className="max-w-2xl text-sm text-slate-400">{auto.description}</p>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            aria-label="Autonomy level"
            className="w-64 accent-cyan-400"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-8">
          {stages.map((s) => {
            const human = auto.humanStages.includes(s.id);
            return (
              <div key={s.id} className={`rounded-lg border p-2 text-xs transition ${human ? 'border-amber-500/60 bg-amber-500/10 text-amber-200' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'}`}>
                <div className="mb-1 flex items-center gap-1 font-semibold">
                  {human ? <UserCheck className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  {s.id}. {human ? 'Human approves' : 'Autonomous'}
                </div>
                <div className="text-slate-300">{s.name}</div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">Guardrail: at L1–L3 no production change is made without human approval; L4 applies only to low-risk CVEs within policy-as-code thresholds.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-2 xl:col-span-2">
          {archLayers.map((layer, i) => (
            <div key={layer.id}>
              <div className="rounded-xl border p-4" style={{ borderColor: `${layer.color}55`, background: `${layer.color}0d` }}>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: layer.color }}>{layer.name}</div>
                <div className="flex flex-wrap gap-2">
                  {layer.nodes.map((n) => {
                    const active = selected.id === n.id;
                    const human = needsHuman(n);
                    return (
                      <button
                        key={n.id}
                        onClick={() => setSelected(n)}
                        className={`rounded-lg border px-3 py-2 text-sm transition ${active ? 'text-noc-950' : 'bg-noc-800 text-slate-200 hover:text-white'} ${human && !active ? 'ring-1 ring-amber-400/70' : ''}`}
                        style={{ borderColor: layer.color, background: active ? layer.color : undefined }}
                      >
                        {n.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {i < archLayers.length - 1 && (
                <div className="flex justify-center py-1 text-slate-600"><ArrowDown className="h-4 w-4" /></div>
              )}
            </div>
          ))}
          <p className="pt-2 text-xs text-slate-500">Components outlined in amber include a human approval step at the selected autonomy level.</p>
        </div>

        <div className="card h-fit xl:sticky xl:top-24">
          <div className="text-xs uppercase tracking-widest text-accent">Selected component</div>
          <h3 className="mt-1 text-2xl font-bold text-white">{selected.label}</h3>
          <p className="mt-2 text-slate-300">{selected.description}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-400">
            {selected.detail.map((d) => <li key={d}>{d}</li>)}
          </ul>
          {needsHuman(selected) && (
            <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
              At {auto.name.split(' – ')[0]}, outputs of this component require human approval.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

