import type { ReactNode } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  DISCLAIMER_FIGURES, autoTriage, backlogBurndown, changeSuccess, effortByStage, exposureTrend, kpiDefinitions, mttrBySeverity,
} from '../data/kpis';
import { Disclaimer, SectionHeader } from '../components/ui';

const TODAY = '#fb7185';
const AI = '#34d399';
const STAGE_COLORS = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#fb7185', '#fbbf24', '#a3e635', '#34d399', '#2dd4bf'];
const effortStacked = [
  { name: 'Today', ...Object.fromEntries(effortByStage.map((s) => [s.stage, s.today])) },
  { name: 'AI-assisted', ...Object.fromEntries(effortByStage.map((s) => [s.stage, s.ai])) },
];
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

function Donut({ value, color, label }: { value: number; color: string; label: string }) {
  const data = [{ v: value }, { v: 100 - value }];
  return (
    <div className="relative h-full flex-1">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="v" innerRadius="60%" outerRadius="85%" stroke="none" startAngle={90} endAngle={-270}>
            <Cell fill={color} />
            <Cell fill="#243049" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
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
        subtitle="Today (manual process) versus AI-assisted across the CVE lifecycle."
        right={<Disclaimer>{DISCLAIMER_FIGURES}</Disclaimer>}
      />

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <Panel title="MTTR by severity (days)">
          <ResponsiveContainer>
            <BarChart data={mttrBySeverity}>
              <CartesianGrid stroke="#243049" strokeDasharray="3 3" />
              <XAxis dataKey="severity" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="today" name="Today" fill={TODAY} radius={[4, 4, 0, 0]} />
              <Bar dataKey="ai" name="AI-assisted" fill={AI} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Exposure window trend – critical, internet-facing (days, 12 months)">
          <ResponsiveContainer>
            <LineChart data={exposureTrend}>
              <CartesianGrid stroke="#243049" strokeDasharray="3 3" />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="today" name="Today" stroke={TODAY} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="ai" name="AI-assisted" stroke={AI} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="CVE backlog burndown (open CVEs, 48 weeks)">
          <ResponsiveContainer>
            <AreaChart data={backlogBurndown}>
              <CartesianGrid stroke="#243049" strokeDasharray="3 3" />
              <XAxis dataKey="week" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="today" name="Today" stroke={TODAY} fill={TODAY} fillOpacity={0.25} />
              <Area type="monotone" dataKey="ai" name="AI-assisted" stroke={AI} fill={AI} fillOpacity={0.35} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Change success rate">
          <div className="flex h-full">
            <Gauge value={changeSuccess.today} color={TODAY} label="Today" />
            <Gauge value={changeSuccess.ai} color={AI} label="AI-assisted" />
          </div>
        </Panel>

        <Panel title="Effort hours by stage (per CVE)">
          <ResponsiveContainer>
            <BarChart data={effortStacked} layout="vertical">
              <CartesianGrid stroke="#243049" strokeDasharray="3 3" />
              <XAxis type="number" {...axis} />
              <YAxis type="category" dataKey="name" {...axis} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {effortByStage.map((s, i) => (
                <Bar key={s.stage} dataKey={s.stage} stackId="effort" fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="% of CVEs auto-triaged">
          <div className="flex h-full">
            <Donut value={autoTriage[0].today} color={TODAY} label="Today" />
            <Donut value={autoTriage[0].ai} color={AI} label="AI-assisted" />
          </div>
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
