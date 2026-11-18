import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from 'lucide-react';
import { Bot, UserCheck } from 'lucide-react';
import { slides } from '../data/slides';
import { currentStages } from '../data/currentProcess';
import { aiStages } from '../data/aiProcess';
import { phase0Scope } from '../data/priorities';
import JourneyMap from '../components/JourneyMap';
import PrioritiesBoard from '../components/PrioritiesBoard';
import { usePriorities } from '../components/PersonaContext';
import { Badge } from '../components/ui';

export default function Presenter({ onExit }: { onExit: () => void }) {
  const [i, setI] = useState(0);
  const [notes, setNotes] = useState(true);
  const slide = slides[i];
  const { items } = usePriorities();
  const { agents: phase0Agents } = phase0Scope(items);

  const next = useCallback(() => setI((v) => Math.min(v + 1, slides.length - 1)), []);
  const prev = useCallback(() => setI((v) => Math.max(v - 1, 0)), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
      if (e.key === 'Escape') onExit();
      if (e.key === 'n' || e.key === 'N') setNotes((v) => !v);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next, prev, onExit]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-noc-950">
      <div className="flex items-center justify-between px-8 py-4 text-sm text-slate-500">
        <span className="font-semibold tracking-widest text-accent">VOICESHIELD AI · CVE RESPONSE</span>
        <span>{i + 1} / {slides.length}</span>
        <button className="btn" onClick={onExit}><X className="h-4 w-4" /> Exit (Esc)</button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto px-8 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-6xl"
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-white lg:text-6xl">{slide.title}</h1>
            {slide.subtitle && <p className="mt-3 text-2xl text-accent">{slide.subtitle}</p>}
            {(slide.visual === 'journey' || slide.visual === 'priorities') && <div className="mt-3"><Badge kind="customer" /></div>}
            {slide.visual === 'journey' && <div className="mt-6 text-left"><JourneyMap mode="today" compact /></div>}
            {slide.visual === 'priorities' && (
              <div className="mt-6 text-base">
                <PrioritiesBoard limit={5} />
                <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-accent">Phase 0 POC scope:</span>{phase0Agents.map((a) => <span key={a} className="chip border-accent/60 text-accent">{a}</span>)}</div>
              </div>
            )}
            {slide.visual === 'flow' && (
              <div className="mt-8 grid grid-cols-2 gap-3 text-base lg:grid-cols-4">
                {currentStages.map((s, k) => (
                  <div key={s.id} className="rounded-lg border border-noc-600 bg-noc-800/70 p-3">
                    <div className="font-semibold text-white">{s.id}. {s.name}</div>
                    {aiStages[k].agents.map((a) => <div key={a} className="mt-1 flex items-center gap-1 text-sm text-emerald-300"><Bot className="h-4 w-4" />{a}</div>)}
                    <div className="mt-1 flex items-start gap-1 text-sm text-amber-300"><UserCheck className="mt-0.5 h-4 w-4 shrink-0" />{aiStages[k].human ?? 'No approval – alerts only'}</div>
                  </div>
                ))}
              </div>
            )}
            <ul className="mt-8 space-y-4 text-2xl leading-snug text-slate-200 lg:text-3xl">
              {slide.bullets.map((b) => (
                <li key={b} className="flex gap-4"><span className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />{b}</li>
              ))}
            </ul>
            {slide.stat && (
              <div className="mt-10 flex flex-wrap gap-6">
                {slide.stat.map((s) => (
                  <div key={s.label} className="rounded-xl border border-noc-600 bg-noc-800/70 px-8 py-5">
                    <div className="text-5xl font-bold text-emerald-400">{s.value}</div>
                    <div className="mt-1 text-base text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-t border-noc-600 bg-noc-900/90">
        <div className="flex items-center justify-between px-8 py-2">
          <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-white" onClick={() => setNotes((v) => !v)}>
            {notes ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />} Speaker notes (N)
          </button>
          <div className="flex gap-2">
            <button className="btn" onClick={prev} disabled={i === 0}><ChevronLeft className="h-4 w-4" /> Prev</button>
            <button className="btn-primary" onClick={next} disabled={i === slides.length - 1}>Next <ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        {notes && (
          <ul className="max-h-40 list-disc space-y-1 overflow-y-auto px-14 pb-4 text-sm text-slate-300">
            {slide.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        )}
        <div className="px-8 pb-2 text-center text-[11px] text-slate-600">Illustrative demo – mock data and fictional CVE identifiers</div>
      </div>
    </div>
  );
}

