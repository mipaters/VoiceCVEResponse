import type { ReactNode } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  DISCLAIMER_FIGURES, kpiDefinitions, kpis, mttrByStage, verifiedInventory, versionChecks,
} from '../data/kpis';
import { currentStages } from '../data/currentProcess';
import { aiStages } from '../data/aiProcess';
import { Badge, Disclaimer, SectionHeader } from '../components/ui';

const TODAY = '#fb7185';
const AI = '#34d399';
const STAGE_COLORS = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#fb7185', '#fbbf24', '#a3e635', '#34d399'];
const effortStacked = [
  { name: 'Today', ...Object.fromEntries(mttrByStage.map((s) => [s.stage, s.today])) },
  { name: 'AI-assisted', ...Object.fromEntries(mttrByStage.map((s) => [s.stage, s.ai])) },
];
const sentiment = currentStages.map((s, i) => ({ stage: `${s.id}`, today: s.sentiment, ai: aiStages[i].aiSentiment }));
const kpi = (id: string) => kpis.find((k) => k.id === id)!;
const pair = (id: string) => [{ name: 'Today', v: kpi(id).today }, { name: 'AI-assisted', v: kpi(id).ai }];
const axis = { stroke: '#64748b', fontSize: 12 };
const tooltipStyle = { background: '#101828', border: '1px solid #243049', borderRadius: 8, color: '#e2e8f0' };

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}

function Gauge({ value, color, label }: { value: number; color: string; label: string }) {
  const data = [{ v: value }, { v: 100 - value }];
  return (
    <div className="relative h-full flex-1">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="v" startAngle={180} endAngle={0} cx="50%" cy="80%" innerRadius="70%" outerRadius="100%" stroke="none">
            <Cell fill={color} />
            <Cell fill="#243049" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-x-0 bottom-6 text-center">
        <div className="text-2xl font-bold text-white">{value}%</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div>
      <SectionHeader
        title="KPI Dashboard"
        subtitle="Today versus AI-assisted across your 8-stage process. Only the 2–3 hrs baseline is customer-quoted."
        right={<div className="flex flex-wrap items-center gap-2"><Badge kind="quoted" /><Disclaimer>{DISCLAIMER_FIGURES}</Disclaimer></div>}
      />

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <Panel title="Time to find what's impacted (minutes, per CVE) – customer-quoted baseline">
          <ResponsiveContainer>
            <BarChart data={pair('discover')}>
              <CartesianGrid stroke="#243049" strokeDasharray="3 3" />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} min`} />
              <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                <Cell fill={TODAY} />
                <Cell fill={AI} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Sentiment by stage (+3 … −3)">
          <ResponsiveContainer>
            <LineChart data={sentiment}>
              <CartesianGrid stroke="#243049" strokeDasharray="3 3" />
              <XAxis dataKey="stage" {...axis} />
              <YAxis domain={[-3, 3]} ticks={[-3, -2, -1, 0, 1, 2, 3]} {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="today" name="Today" stroke={TODAY} strokeWidth={2.5} />
              <Line type="monotone" dataKey="ai" name="AI-assisted" stroke={AI} strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Assets verified vs 27 applications (weeks)">
          <ResponsiveContainer>
            <AreaChart data={verifiedInventory}>
              <CartesianGrid stroke="#243049" strokeDasharray="3 3" />
              <XAxis dataKey="week" {...axis} />
              <YAxis domain={[0, 27]} {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="today" name="Today" stroke={TODAY} fill={TODAY} fillOpacity={0.25} />
              <Area type="monotone" dataKey="ai" name="AI-assisted" stroke={AI} fill={AI} fillOpacity={0.35} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="% of version checks automated">
          <div className="flex h-full">
            <Gauge value={versionChecks.today} color={TODAY} label="Today" />
            <Gauge value={versionChecks.ai} color={AI} label="AI-assisted" />
          </div>
        </Panel>

        <Panel title="End-to-end MTTR by stage (days)">
          <ResponsiveContainer>
            <BarChart data={effortStacked} layout="vertical">
              <CartesianGrid stroke="#243049" strokeDasharray="3 3" />
              <XAxis type="number" {...axis} />
              <YAxis type="category" dataKey="name" {...axis} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {mttrByStage.map((s, i) => (
                <Bar key={s.stage} dataKey={s.stage} stackId="mttr" fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="After-hours hours · production failures looped back to lab · leadership update hours">
          <ResponsiveContainer>
            <BarChart data={[
              { name: 'After-hours h', today: kpi('afterhours').today, ai: kpi('afterhours').ai },
              { name: 'Looped to lab', today: kpi('looped').today, ai: kpi('looped').ai },
              { name: 'Leadership h', today: kpi('leadership').today, ai: kpi('leadership').ai },
            ]}>
              <CartesianGrid stroke="#243049" strokeDasharray="3 3" />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="today" name="Today" fill={TODAY} radius={[4, 4, 0, 0]} />
              <Bar dataKey="ai" name="AI-assisted" fill={AI} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <h2 className="mb-3 mt-10 text-xl font-bold text-white">KPI definitions</h2>
      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead className="border-b border-noc-600">
            <tr>
              {['KPI', 'Definition', 'Formula', 'Data source', 'Today baseline', 'Target'].map((h) => <th key={h} className="th">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {kpiDefinitions.map((r) => (
              <tr key={r.kpi} className="border-t border-noc-700 align-top">
                <td className="td font-semibold text-white">{r.kpi}</td>
                <td className="td">{r.definition}</td>
                <td className="td font-mono text-xs text-slate-400">{r.formula}</td>
                <td className="td">{r.source}</td>
                <td className="td text-rose-300">{r.today}</td>
                <td className="td text-emerald-300">{r.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


