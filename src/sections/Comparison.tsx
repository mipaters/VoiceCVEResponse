import { useState } from 'react';
import { currentStages } from '../data/currentProcess';
import JourneyMap from '../components/JourneyMap';
import { Badge, SectionHeader } from '../components/ui';

export default function Comparison() {
  const [mode, setMode] = useState<'today' | 'ai'>('today');
  const lowest = currentStages.reduce((a, b) => (b.sentiment < a.sentiment ? b : a));

  return (
    <div>
      <SectionHeader
        title="Today vs AI-Assisted"
        subtitle="Your 8-stage journey map. Switch to 'With AI' to see the sentiment curve lift and the agent that resolves each pain point."
        right={
          <div className="flex flex-col items-end gap-2">
            <Badge kind="customer" />
            <div className="flex rounded-lg border border-noc-600 bg-noc-900 p-0.5" role="group" aria-label="View">
              <button onClick={() => setMode('today')} className={`rounded-md px-4 py-2 text-sm font-medium ${mode === 'today' ? 'bg-rose-500 text-white' : 'text-slate-300'}`}>Today</button>
              <button onClick={() => setMode('ai')} className={`rounded-md px-4 py-2 text-sm font-medium ${mode === 'ai' ? 'bg-emerald-500 text-noc-950' : 'text-slate-300'}`}>With AI</button>
            </div>
          </div>
        }
      />
      <div className="card">
        <JourneyMap mode={mode} />
      </div>
      <p className="mt-3 text-sm text-slate-400">
        Lowest point today: <span className="font-semibold text-white">{lowest.id}. {lowest.name}</span> ({lowest.sentiment}). With-AI sentiment is illustrative – to be validated.
      </p>
    </div>
  );
}
