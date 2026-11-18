import { useEffect, useMemo, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { ArrowRight, Clock, DollarSign, RotateCcw } from 'lucide-react';
import { customerContext } from '../data/currentProcess';
import { DISCLAIMER_FIGURES, headline, kpis, personaKpiOrder, valueModel, type Kpi } from '../data/kpis';
import { Badge, Disclaimer, SectionHeader } from '../components/ui';
import { usePersona } from '../components/PersonaContext';

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const money = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n / 1e3)}K`);

function KpiCard({ kpi, runKey, primary }: { kpi: Kpi; runKey: number; primary: boolean }) {
  const [value, setValue] = useState(kpi.today);

  useEffect(() => {
    setValue(kpi.today);
    const c = animate(kpi.today, kpi.ai, { duration: 1.8, delay: 0.4, ease: 'easeInOut', onUpdate: setValue });
    return () => c.stop();
  }, [runKey, kpi]);

  const improvement = Math.abs(((kpi.ai - kpi.today) / kpi.today) * 100);

  return (
    <div className={`card ${primary ? 'border-accent/70 shadow-[0_0_24px_-8px_#22d3ee]' : ''}`}>
      <div className="flex items-start justify-between gap-2"><div className="text-sm font-medium text-slate-400">{kpi.name}</div><Badge kind={kpi.quoted ? 'quoted' : 'illustrative'} /></div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-5xl font-bold tabular-nums text-white">{fmt(value)}</span>
        <span className="text-lg text-slate-400">{kpi.unit}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="text-rose-400 line-through">{kpi.todayLabel}</span>
        <ArrowRight className="h-4 w-4 text-slate-500" />
        <span className="font-semibold text-emerald-400">{kpi.aiLabel}</span>
        <span className="chip ml-auto">{kpi.lowerIsBetter ? '−' : '+'}{improvement.toFixed(0)}%</span>
      </div>
      {kpi.note && <div className="mt-2 text-xs text-slate-400">{kpi.note}</div>}
    </div>
  );
}

export default function ExecutiveSummary() {
  const persona = usePersona();
  const [runKey, setRunKey] = useState(0);
  const [events, setEvents] = useState(valueModel.cveEventsPerYear);
  const [rate, setRate] = useState(valueModel.engineerHourlyCost);

  const ordered = useMemo(
    () => personaKpiOrder[persona].map((id) => kpis.find((k) => k.id === id)!),
    [persona],
  );

  const v = valueModel;
  const perCve =
    v.assessHoursToday - v.assessHoursAi + (v.afterHoursToday - v.afterHoursAi) + (v.leadershipToday - v.leadershipAi) + (v.briefHoursToday - v.briefHoursAi);
  const hoursSaved = Math.round(events * perCve);
  const labourSaved = hoursSaved * rate;
  const assessSaved = Math.round(events * (v.assessHoursToday - v.assessHoursAi));
  return (
    <div>
      <SectionHeader
        title="Executive Summary"
        subtitle={headline.title}
        right={
          <div className="flex items-center gap-3">
            <Disclaimer>{DISCLAIMER_FIGURES}</Disclaimer>
            <button className="btn" onClick={() => setRunKey((k) => k + 1)}><RotateCcw className="h-4 w-4" /> Replay</button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge kind="customer" />
        {customerContext.map((x) => <span key={x.label} className="chip">{x.value} {x.detail}</span>)}
      </div>

      <div className="card mb-6 flex flex-wrap items-center justify-center gap-8 py-8 text-center">
        <div>
          <div className="text-6xl font-extrabold text-rose-400">{headline.daysToday}<span className="text-2xl"> days</span></div>
          <div className="mt-1 text-sm text-slate-400">Today – end-to-end MTTR (illustrative)</div>
        </div>
        <ArrowRight className="h-10 w-10 text-accent" />
        <div>
          <div className="text-6xl font-extrabold text-emerald-400">{headline.daysAi}<span className="text-2xl"> days</span></div>
          <div className="mt-1 text-sm text-slate-400">AI-assisted (illustrative)</div>
        </div>
      </div>

      <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ordered.map((k, i) => (
          <motion.div layout key={k.id}><KpiCard kpi={k} runKey={runKey} primary={i === 0} /></motion.div>
        ))}
      </motion.div>

      <h2 className="mb-3 mt-10 text-xl font-bold text-white">Value at stake <span className="text-sm font-normal text-slate-500">(annual, illustrative – editable assumptions)</span></h2>
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="card">
          <Clock className="mb-2 h-5 w-5 text-accent" />
          <div className="text-3xl font-bold text-white">{hoursSaved.toLocaleString()} h</div>
          <div className="text-sm text-slate-400">engineer hours saved per year across assessment, brief, after-hours and leadership updates</div>
        </div>
        <div className="card">
          <DollarSign className="mb-2 h-5 w-5 text-emerald-400" />
          <div className="text-3xl font-bold text-white">{money(labourSaved)}</div>
          <div className="text-sm text-slate-400">labour value at ${rate}/h</div>
        </div>
        <div className="card">
          <Clock className="mb-2 h-5 w-5 text-sky-400" />
          <div className="text-3xl font-bold text-white">{assessSaved.toLocaleString()} h</div>
          <div className="text-sm text-slate-400">of that from assessment alone (2–3 hrs → &lt; 10 min per CVE)</div>
        </div>
        <div className="card space-y-3">
          <label className="block text-sm font-medium text-slate-300">CVE events per year
            <input type="number" min={0} value={events} onChange={(e) => setEvents(Math.max(0, Number(e.target.value) || 0))} className="mt-1 w-full rounded-lg border border-noc-600 bg-noc-900 px-3 py-1.5 text-white focus:border-accent focus:outline-none" />
          </label>
          <label className="block text-sm font-medium text-slate-300">Engineer cost per hour ($)
            <input type="number" min={0} value={rate} onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))} className="mt-1 w-full rounded-lg border border-noc-600 bg-noc-900 px-3 py-1.5 text-white focus:border-accent focus:outline-none" />
          </label>
        </div>
      </div>
    </div>
  );
}
