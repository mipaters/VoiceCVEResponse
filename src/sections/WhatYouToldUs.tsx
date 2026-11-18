import { Users } from 'lucide-react';
import { customerContext, quotedMetric } from '../data/currentProcess';
import { phase0Scope } from '../data/priorities';
import JourneyMap from '../components/JourneyMap';
import PrioritiesBoard from '../components/PrioritiesBoard';
import { usePriorities } from '../components/PersonaContext';
import { Badge, SectionHeader } from '../components/ui';

export default function WhatYouToldUs() {
  const { items } = usePriorities();
  const { agents } = phase0Scope(items);
  return (
    <div className="space-y-8">
      <SectionHeader
        title="What you told us"
        subtitle="Your current security response process, recreated from the whiteboard – in your own words."
        right={<Badge kind="customer" />}
      />

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {customerContext.map((c) => (
          <div key={c.label} className="card">
            <div className="text-xs uppercase tracking-wide text-slate-500">{c.label}</div>
            <div className="mt-1 text-2xl font-bold text-white">{c.value}</div>
            <div className="text-sm text-slate-400">{c.detail}</div>
          </div>
        ))}
      </div>

      <div className="card flex flex-wrap items-center gap-3 border-sky-500/40">
        <Badge kind="quoted" />
        <span className="text-xl font-semibold text-white">"{quotedMetric.text}"</span>
        <span className="text-sm text-slate-400">({quotedMetric.scope})</span>
      </div>

      <section className="card">
        <h2 className="mb-3 text-lg font-semibold text-white">Current security response process</h2>
        <JourneyMap mode="today" />
      </section>

      <section className="card">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white"><Users className="h-5 w-5 text-accent" /> Dot-voting results</h2>
        <PrioritiesBoard />
        <div className="mt-4 rounded-lg border border-accent/50 bg-accent/10 p-3">
          <div className="text-sm font-semibold text-accent">Phase 0 POC scope (phased start: Intake → Asset → Assessment)</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {agents.map((a) => <span key={a} className="chip border-accent/60 text-accent">{a}</span>)}
          </div>
        </div>
      </section>
    </div>
  );
}
