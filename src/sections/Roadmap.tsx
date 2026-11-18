import { CheckCircle2, ClipboardList, Gauge } from 'lucide-react';
import { roadmap } from '../data/roadmap';
import { phase0Scope } from '../data/priorities';
import { usePriorities } from '../components/PersonaContext';
import { Badge, SectionHeader } from '../components/ui';

export default function Roadmap() {
  const { items } = usePriorities();
  const { top, agents } = phase0Scope(items);
  return (
    <div>
      <SectionHeader title="Roadmap" subtitle="From a 30-day proof of concept on your top 3 jobs to closed-loop, policy-governed remediation." right={<Badge kind="illustrative" />} />
      <div className="card mb-4 border-accent/50">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-white">Phase 0 POC scope – your top voted jobs, delivered by the first three agents</h2>
          <Badge kind="customer" />
        </div>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-200">{top.map((t) => <li key={t.id}>{t.job}</li>)}</ol>
        <div className="mt-2 flex flex-wrap gap-2">{agents.map((a) => <span key={a} className="chip border-accent/60 text-accent">{a}</span>)}</div>
      </div>
      <div className="relative grid gap-4 lg:grid-cols-4">
        {roadmap.map((p, i) => (
          <div key={p.id} className="card flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-noc-950">{i}</span>
                <span className="chip">{p.timing}</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-white">{p.name}</h3>
            </div>
            <section>
              <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> Outcomes</div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-200">{p.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
            </section>
            <section>
              <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent"><Gauge className="h-3.5 w-3.5" /> KPIs</div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-200">{p.kpis.map((o) => <li key={o}>{o}</li>)}</ul>
            </section>
            <section>
              <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-300"><ClipboardList className="h-3.5 w-3.5" /> Prerequisites</div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">{p.prerequisites.map((o) => <li key={o}>{o}</li>)}</ul>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}
