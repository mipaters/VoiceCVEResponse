import { useEffect, useMemo, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { ArrowRight, Clock, DollarSign, RotateCcw, ShieldAlert } from 'lucide-react';
import { DISCLAIMER_FIGURES, headline, kpis, personaKpiOrder, valueModel, type Kpi } from '../data/kpis';
import { Disclaimer, SectionHeader } from '../components/ui';
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
      <div className="text-sm font-medium text-slate-400">{kpi.name}</div>
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
  const [outageCost, setOutageCost] = useState(valueModel.outageCostPerMinute);

  const ordered = useMemo(
    () => personaKpiOrder[persona].map((id) => kpis.find((k) => k.id === id)!),
    [persona],
  );

  const v = valueModel;
  const hoursSaved = v.cvesPerYear * (v.hoursPerCveToday - v.hoursPerCveAi);
  const labourSaved = hoursSaved * v.analystHourlyCost;
  const outagesAvoided = v.outagesPerYearToday - v.outagesPerYearAi;
  const outageSaved = outagesAvoided * v.avgOutageMinutes * outageCost;

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

      <div className="card mb-6 flex flex-wrap items-center justify-center gap-8 py-8 text-center">
        <div>
          <div className="text-6xl font-extrabold text-rose-400">{headline.daysToday}<span className="text-2xl"> days</span></div>
          <div className="mt-1 text-sm text-slate-400">Today (manual process)</div>
        </div>
        <ArrowRight className="h-10 w-10 text-accent" />
        <div>
          <div className="text-6xl font-extrabold text-emerald-400">{headline.daysAi}<span className="text-2xl"> days</span></div>
          <div className="mt-1 text-sm text-slate-400">AI-assisted</div>
        </div>
      </div>

      <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ordered.map((k, i) => (
          <motion.div layout key={k.id}><KpiCard kpi={k} runKey={runKey} primary={i === 0} /></motion.div>
        ))}
      </motion.div>

      <h2 className="mb-3 mt-10 text-xl font-bold text-white">Value at stake <span className="text-sm font-normal text-slate-500">(annual, illustrative)</span></h2>
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="card">
          <Clock className="mb-2 h-5 w-5 text-accent" />
          <div className="text-3xl font-bold text-white">{hoursSaved.toLocaleString()} h</div>
          <div className="text-sm text-slate-400">analyst hours saved ({money(labourSaved)} at ${v.analystHourlyCost}/h)</div>
        </div>
        <div className="card">
          <DollarSign className="mb-2 h-5 w-5 text-emerald-400" />
          <div className="text-3xl font-bold text-white">{money(outageSaved)}</div>
          <div className="text-sm text-slate-400">avoided outage cost ({outagesAvoided} fewer outages × {v.avgOutageMinutes} min)</div>
        </div>
        <div className="card">
          <ShieldAlert className="mb-2 h-5 w-5 text-rose-400" />
          <div className="text-3xl font-bold text-white">−84%</div>
          <div className="text-sm text-slate-400">exposure window for critical, internet-facing CVEs (45 → 7 days)</div>
        </div>
        <div className="card">
          <label className="text-sm font-medium text-slate-300" htmlFor="outage-cost">Cost per enterprise outage-minute</label>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-slate-400">$</span>
            <input
              id="outage-cost"
              type="number"
              min={0}
              step={1000}
              value={outageCost}
              onChange={(e) => setOutageCost(Math.max(0, Number(e.target.value) || 0))}
              className="w-full rounded-lg border border-noc-600 bg-noc-900 px-3 py-2 text-lg text-white focus:border-accent focus:outline-none"
            />
          </div>
          <div className="mt-2 text-xs text-slate-500">Editable assumption – defaults in src/data/kpis.ts</div>
        </div>
      </div>
    </div>
  );
}
