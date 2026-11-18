import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Bot, Undo2, UserCheck } from 'lucide-react';
import { currentStages, crossStageJobs } from '../data/currentProcess';
import { aiStages, coordinatorAgent } from '../data/aiProcess';
import { Badge } from './ui';

const LEFT = 44;
const COL = 'min-w-[170px]';

export default function JourneyMap({ mode, compact = false }: { mode: 'today' | 'ai'; compact?: boolean }) {
  const ai = mode === 'ai';
  const data = currentStages.map((s, i) => ({
    stage: `${s.id}. ${s.name}`,
    today: s.sentiment,
    ai: aiStages[i].aiSentiment,
  }));

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: LEFT + 8 * 170 }}>
        <div className="flex justify-end pb-1">
          <span className="text-[11px] text-slate-500">
            {ai ? 'AI sentiment is illustrative – to be validated' : 'Sentiment curve as drawn on the customer whiteboard'}
          </span>
        </div>
        <div style={{ height: compact ? 150 : 190 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#1e2a3a" strokeDasharray="3 3" />
              <XAxis dataKey="stage" scale="band" hide />
              <YAxis domain={[-3, 3]} ticks={[-3, -2, -1, 0, 1, 2, 3]} width={LEFT} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: number) => (v > 0 ? `+${v}` : `${v}`)} />
              <ReferenceLine y={0} stroke="#475569" />
              <Tooltip contentStyle={{ background: '#0b1220', border: '1px solid #334155', fontSize: 12 }} />
              <Line type="monotone" dataKey="today" name="Today" stroke={ai ? '#64748b' : '#f87171'} strokeDasharray={ai ? '5 4' : undefined} strokeWidth={ai ? 2 : 3} dot={{ r: 4 }} isAnimationActive={false} />
              {ai && <Line type="monotone" dataKey="ai" name="With AI (illustrative)" stroke="#34d399" strokeWidth={3} dot={{ r: 5 }} isAnimationActive={false} />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: `${LEFT}px repeat(8, minmax(0, 1fr))` }}>
          <div />
          {currentStages.map((s, i) => {
            const a = aiStages[i];
            return (
              <div key={s.id} className={`${COL} space-y-2`}>
                <div className="rounded-md bg-red-500/90 px-2 py-2 text-center text-sm font-semibold leading-tight text-white">
                  {s.id}. {s.name}
                </div>
                {s.note && <div className="rounded-md bg-amber-300/90 px-2 py-1.5 text-xs italic text-slate-900">{s.note}</div>}
                {ai && (
                  <div className="space-y-1 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-1.5">
                    {a.agents.map((ag) => (
                      <div key={ag} className="flex items-center gap-1 text-[11px] font-medium text-emerald-300">
                        <Bot className="h-3 w-3 shrink-0" /> {ag}
                      </div>
                    ))}
                    <div className="flex items-start gap-1 text-[11px] text-amber-300">
                      <UserCheck className="mt-0.5 h-3 w-3 shrink-0" /> {a.human ?? a.humanNote ?? 'None'}
                    </div>
                  </div>
                )}
                {s.jobsToBeDone.map((j) => (
                  <div key={j} className="rounded-md bg-sky-400/90 px-2 py-1.5 text-xs font-medium leading-snug text-slate-900">{j}</div>
                ))}
                {s.painPoints.map((p) => {
                  const r = a.resolutions.find((x) => x.pain === p);
                  return (
                    <div key={p} className="rounded-md bg-lime-400/90 px-2 py-1.5 text-xs font-medium leading-snug text-slate-900">
                      {p}
                      {ai && r && (
                        <div className="mt-1 border-t border-slate-900/30 pt-1 text-[11px] font-normal">
                          <span className="font-semibold">→ {r.agent}:</span> {r.how}
                        </div>
                      )}
                    </div>
                  );
                })}
                {ai && a.kpi && <div className="rounded-md border border-emerald-500/50 px-2 py-1 text-[11px] font-semibold text-emerald-300">KPI: {a.kpi}</div>}
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `${LEFT}px repeat(8, minmax(0, 1fr))` }}>
          <div />
          <div style={{ gridColumn: '2 / span 5' }} />
          <div style={{ gridColumn: '7 / span 2' }} className="flex items-center gap-2 rounded-md border border-dashed border-red-400/70 bg-red-500/10 px-2 py-1.5 text-xs text-red-200">
            <Undo2 className="h-4 w-4 shrink-0" />
            <span>Failures go back to lab (stage 7 → 6){ai && <span className="text-emerald-300"> – Test Agent catches these in the lab first</span>}</span>
          </div>
        </div>

        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `${LEFT}px 1fr` }}>
          <div className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500 [writing-mode:vertical-rl]">All stages</div>
          <div className="flex flex-wrap items-stretch gap-2 rounded-lg border border-sky-400/40 bg-sky-400/5 p-2">
            {crossStageJobs.map((j) => (
              <div key={j} className="flex-1 basis-56 rounded-md bg-sky-400/90 px-2 py-1.5 text-xs font-medium text-slate-900">{j}</div>
            ))}
            {ai && (
              <div className="flex-1 basis-72 rounded-md border border-emerald-500/50 bg-emerald-500/10 px-2 py-1.5 text-xs text-emerald-200">
                <div className="flex items-center gap-1 font-semibold"><Bot className="h-3.5 w-3.5" /> {coordinatorAgent.name}</div>
                <ul className="mt-1 list-disc pl-4">
                  {coordinatorAgent.actions.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <Legend c="bg-red-500" t="Stage" />
          <Legend c="bg-sky-400" t="Job to be done" />
          <Legend c="bg-lime-400" t="Pain point" />
          <Legend c="bg-amber-300" t="Note" />
          <Badge kind="customer" />
        </div>
      </div>
    </div>
  );
}

function Legend({ c, t }: { c: string; t: string }) {
  return <span className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded-sm ${c}`} />{t}</span>;
}
