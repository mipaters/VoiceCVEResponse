import { Minus, Plus, RotateCcw, Crown } from 'lucide-react';
import { PRIORITIES_NOTE, SUPER_VOTE_WEIGHT, phase0Scope, rank, score } from '../data/priorities';
import { usePriorities } from './PersonaContext';
import { Badge } from './ui';

function Stepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex items-center gap-1" aria-label={label}>
      <button className="btn px-1.5 py-1" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Decrease ${label}`}><Minus className="h-3 w-3" /></button>
      <span className="w-6 text-center font-semibold text-white">{value}</span>
      <button className="btn px-1.5 py-1" onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`}><Plus className="h-3 w-3" /></button>
    </div>
  );
}

export default function PrioritiesBoard({ editable = true, limit }: { editable?: boolean; limit?: number }) {
  const { items, setVotes, reset } = usePriorities();
  const ranked = rank(items);
  const shown = limit ? ranked.slice(0, limit) : ranked;
  const { top } = phase0Scope(items);
  const topIds = new Set(top.map((t) => t.id));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge kind="customer" />
        <span className="chip border-amber-500/50 text-amber-300">{PRIORITIES_NOTE}</span>
        <span className="text-xs text-slate-500">Score = team votes + {SUPER_VOTE_WEIGHT} × Jay's super votes</span>
        {editable && (
          <button className="btn ml-auto" onClick={reset}><RotateCcw className="h-3.5 w-3.5" /> Reset to board</button>
        )}
      </div>
      <div className="space-y-2">
        {shown.map((p, i) => {
          const s = score(p);
          const isTop = topIds.has(p.id);
          return (
            <div key={p.id} className={`flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2 ${isTop ? 'border-accent/60 bg-accent/5' : 'border-noc-600 bg-noc-800/40'}`}>
              <span className="w-6 text-center text-lg font-bold text-slate-500">{i + 1}</span>
              <div className="min-w-[220px] flex-1">
                <div className="font-medium text-white">{p.job}{i === 0 && s > 0 && <Crown className="ml-2 inline h-4 w-4 text-amber-300" aria-label="Top priority" />}</div>
                <div className="text-xs text-slate-500">{p.agents.join(' · ')}</div>
              </div>
              {editable ? (
                <>
                  <div className="text-xs text-slate-400">Team <Stepper label={`team votes for ${p.job}`} value={p.teamVotes} onChange={(v) => setVotes(p.id, 'teamVotes', v)} /></div>
                  <div className="text-xs text-slate-400">Jay (×2) <Stepper label={`super votes for ${p.job}`} value={p.superVotes} onChange={(v) => setVotes(p.id, 'superVotes', v)} /></div>
                </>
              ) : (
                <div className="text-xs text-slate-400">{p.teamVotes} team + {p.superVotes} super</div>
              )}
              <div className="w-16 text-right"><span className="text-2xl font-bold text-accent">{s}</span><div className="text-[10px] uppercase text-slate-500">score</div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
