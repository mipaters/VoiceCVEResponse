import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bot, Clock, Sparkles, UserCheck, Wrench, Users } from 'lucide-react';
import { stages } from '../data/stages';
import { SectionHeader } from '../components/ui';

type Mode = 'pain' | 'value';

export default function Comparison() {
  const [mode, setMode] = useState<Mode>('pain');

  return (
    <div>
      <SectionHeader
        title="Today vs AI-Assisted"
        subtitle="Swimlane across the nine stages of the CVE lifecycle for the enterprise voice network."
        right={
          <div className="flex rounded-lg border border-noc-600 bg-noc-900 p-0.5">
            <button onClick={() => setMode('pain')} className={`rounded-md px-4 py-2 text-sm font-medium ${mode === 'pain' ? 'bg-rose-500 text-white' : 'text-slate-300'}`}>Show pain points</button>
            <button onClick={() => setMode('value')} className={`rounded-md px-4 py-2 text-sm font-medium ${mode === 'value' ? 'bg-emerald-500 text-noc-950' : 'text-slate-300'}`}>Show AI value</button>
          </div>
        }
      />

      <div className="hidden grid-cols-2 gap-4 pb-2 text-sm font-semibold uppercase tracking-wide lg:grid">
        <div className="text-rose-300">Today – manual process</div>
        <div className="text-emerald-300">AI-assisted</div>
      </div>

      <div className="space-y-4">
        {stages.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-noc-950">{s.id}</span>
              <h3 className="text-lg font-semibold text-white">{s.name}</h3>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="card border-rose-500/30">
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-200">
                  {s.today.steps.map((x) => <li key={x}>{x}</li>)}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="chip gap-1"><Users className="h-3 w-3" /> {s.today.roles.join(', ')}</span>
                  <span className="chip gap-1"><Wrench className="h-3 w-3" /> {s.today.tools.join(', ')}</span>
                  <span className="chip gap-1 border-rose-500/50 text-rose-300"><Clock className="h-3 w-3" /> {s.today.elapsed}</span>
                </div>
                {mode === 'pain' && (
                  <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-1 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200">
                    {s.today.pain.map((p) => (
                      <li key={p} className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {p}</li>
                    ))}
                  </motion.ul>
                )}
              </div>
              <div className="card border-emerald-500/30">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-300"><Bot className="h-4 w-4" /> {s.ai.agent}</div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-200">
                  {s.ai.steps.map((x) => <li key={x}>{x}</li>)}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="chip gap-1 border-amber-500/50 text-amber-300"><UserCheck className="h-3 w-3" /> {s.ai.checkpoint}</span>
                  <span className="chip gap-1 border-emerald-500/50 text-emerald-300"><Clock className="h-3 w-3" /> {s.ai.elapsed}</span>
                </div>
                {mode === 'value' && (
                  <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-1 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-200">
                    {s.ai.value.map((p) => (
                      <li key={p} className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0" /> {p}</li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
