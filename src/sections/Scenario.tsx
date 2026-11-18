import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Check, ChevronLeft, ChevronRight, Clock, Pencil, RotateCcw, Terminal, Undo2, Users, X } from 'lucide-react';
import { scenarioSteps, scenarioTitle } from '../data/scenario';
import { scenarioSummary } from '../data/kpis';
import { Badge, SectionHeader } from '../components/ui';
import ArtefactView from '../components/ArtefactView';

type Choice = 'approve' | 'modify' | 'reject';

function AgentLog({ lines, stepKey }: { lines: string[]; stepKey: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    const t = setInterval(() => {
      setShown((s) => {
        if (s >= lines.length) {
          clearInterval(t);
          return s;
        }
        return s + 1;
      });
    }, 450);
    return () => clearInterval(t);
  }, [stepKey, lines.length]);

  return (
    <div className="rounded-lg border border-noc-600 bg-black/50 p-4 font-mono text-[13px] leading-relaxed">
      {lines.slice(0, shown).map((l, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-300">
          <span className="text-slate-600">{String(i + 1).padStart(2, '0')} </span>
          <span className="text-slate-500">&gt; </span>
          {l}
        </motion.div>
      ))}
      {shown < lines.length && <span className="inline-block h-4 w-2 animate-pulse bg-emerald-400 align-middle" />}
    </div>
  );
}

export default function Scenario() {
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState<Record<number, Choice>>({});
  const step = scenarioSteps[idx];
  const last = idx === scenarioSteps.length - 1;
  const showSummary = last && (!step.decision || choices[step.id] === 'approve');

  const next = useCallback(() => setIdx((i) => Math.min(i + 1, scenarioSteps.length - 1)), []);
  const back = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') back();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next, back]);

  const choice = choices[step.id];
  const outcome = choice && step.decision ? step.decision[`${choice}Outcome` as const] : undefined;

  return (
    <div>
      <SectionHeader title="Scenario Walkthrough" subtitle={scenarioTitle} right={
        <div className="flex items-center gap-2"><Badge kind="illustrative" /><button className="btn" onClick={() => { setChoices({}); setIdx(0); }}><RotateCcw className="h-4 w-4" /> Restart</button></div>
      } />

      <div className="mb-6 overflow-x-auto">
        <ol className="flex min-w-max items-center gap-1">
          {scenarioSteps.map((s, i) => (
            <li key={s.id} className="flex items-center">
              <button
                onClick={() => setIdx(i)}
                className={`flex flex-col items-center rounded-lg px-3 py-2 text-xs transition ${
                  i === idx ? 'bg-accent text-noc-950' : s.loopBack ? 'bg-red-500/15 text-red-300' : choices[s.id] ? 'bg-emerald-500/15 text-emerald-300' : 'bg-noc-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-mono font-semibold">{s.time}</span>
                <span className="mt-0.5 max-w-[110px] truncate">{s.id}. {s.title}</span><span className="text-[10px] opacity-70">Stage {s.stageId}</span>
              </button>
              {i < scenarioSteps.length - 1 && <span className="mx-1 h-px w-4 bg-noc-600" />}
            </li>
          ))}
        </ol>
      </div>

      <motion.div key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-3">
          <div className="card">
            <div className="mb-1 flex items-center gap-3">
              <span className="rounded-md bg-accent/15 px-2 py-1 font-mono text-sm font-bold text-accent">{step.time}</span>
              <span className="text-sm text-slate-400">Step {step.id} of {scenarioSteps.length}</span>
              <span className="chip">Stage {step.stageId} · {step.stageName}</span>
              {step.loopBack && <span className="chip border-red-500/60 text-red-300"><Undo2 className="mr-1 inline h-3 w-3" />Lab failure loop-back</span>}
              <Badge kind="customer" />
            </div>
            <h2 className="text-2xl font-bold text-white">{step.title}</h2>
            <p className="mt-1 text-slate-300">{step.summary}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Terminal className="h-4 w-4 text-accent" /> What the AI did – <span className="text-accent">{step.agent}</span>
            </div>
            <AgentLog lines={step.log} stepKey={step.id} />
          </div>

          <div className="space-y-4">
            {step.artefacts.map((a) => <ArtefactView key={a.title} a={a} />)}
          </div>
        </div>

        <div className="space-y-5 xl:col-span-2">
          {step.decision ? (
          <div className="card border-amber-500/40">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-300">
              <Users className="h-4 w-4" /> What the human decided – {step.decision.approver}
            </div>
            <p className="mb-4 text-slate-200">{step.decision.prompt}</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={() => setChoices((c) => ({ ...c, [step.id]: 'approve' }))}><Check className="h-4 w-4" /> {step.decision.approve}</button>
              <button className="btn" onClick={() => setChoices((c) => ({ ...c, [step.id]: 'modify' }))}><Pencil className="h-4 w-4" /> {step.decision.modify}</button>
              <button className="btn" onClick={() => setChoices((c) => ({ ...c, [step.id]: 'reject' }))}><X className="h-4 w-4" /> {step.decision.reject}</button>
            </div>
            {outcome && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-4 rounded-lg border p-3 text-sm ${choice === 'approve' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-amber-500/40 bg-amber-500/10 text-amber-200'}`}>
                {outcome}
              </motion.div>
            )}
          </div>
          ) : (
          <div className="card border-emerald-500/40">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-300"><Bot className="h-4 w-4" /> Automatic – no approval needed</div>
            <p className="text-slate-200">{step.autoNote}</p>
          </div>
          )}

          <div className="card border-rose-500/30">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-300">
              <Clock className="h-4 w-4" /> Today comparison
            </div>
            <p className="text-slate-200">
              In your current process this stage takes <span className="font-bold text-rose-300">{step.today.days}</span> and involves <span className="font-bold text-rose-300">{step.today.people}</span>.
            </p>
            <p className="mt-2 text-sm text-slate-400">{step.today.detail}</p>
          </div>
        </div>
      </motion.div>

      {showSummary && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mt-6 border-emerald-500/40">
          <h3 className="mb-4 text-xl font-bold text-white">Scenario summary</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Compare label="Time to find what's impacted" today={scenarioSummary.findToday} ai={scenarioSummary.findAi} />
            <Compare label="After-hours / weekend" today={scenarioSummary.afterHoursToday} ai={scenarioSummary.afterHoursAi} />
            <div className="rounded-lg bg-noc-900 p-4 text-center">
              <div className="text-sm text-slate-400">Production failures looped back to lab</div>
              <div className="mt-1 text-4xl font-bold text-emerald-400">{scenarioSummary.productionFailures}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-amber-300">Only the 2–3 hrs baseline is customer-quoted; all other figures are illustrative – to be validated</p>
        </motion.div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button className="btn" onClick={back} disabled={idx === 0}><ChevronLeft className="h-4 w-4" /> Back</button>
        <span className="text-xs text-slate-500">Use ← → keys</span>
        <button className="btn-primary" onClick={next} disabled={last}>Next <ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function Compare({ label, today, ai }: { label: string; today: string; ai: string }) {
  return (
    <div className="rounded-lg bg-noc-900 p-4 text-center">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-1 flex items-center justify-center gap-3">
        <span className="text-2xl font-semibold text-rose-400 line-through decoration-1">{today}</span>
        <span className="text-slate-500">→</span>
        <span className="text-4xl font-bold text-emerald-400">{ai}</span>
      </div>
    </div>
  );
}


