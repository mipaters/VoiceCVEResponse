import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3, Bot, ClipboardList, GitCompare, LayoutDashboard, Layers, Map, Presentation, Route, ShieldCheck,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { personas, personaFocus, type Persona } from './data/kpis';
import { PersonaContext, PrioritiesContext } from './components/PersonaContext';
import { initialPriorities, type Priority } from './data/priorities';
import WhatYouToldUs from './sections/WhatYouToldUs';
import ExecutiveSummary from './sections/ExecutiveSummary';
import Comparison from './sections/Comparison';
import Scenario from './sections/Scenario';
import Dashboard from './sections/Dashboard';
import Architecture from './sections/Architecture';
import AgentCatalogue from './sections/AgentCatalogue';
import Roadmap from './sections/Roadmap';
import Presenter from './sections/Presenter';

type SectionId = 'summary' | 'told' | 'compare' | 'scenario' | 'dashboard' | 'arch' | 'agents' | 'roadmap' | 'present';

const sections: { id: SectionId; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'summary', label: 'Executive Summary', icon: LayoutDashboard },
  { id: 'told', label: 'What you told us', icon: ClipboardList },
  { id: 'compare', label: 'Today vs AI-Assisted', icon: GitCompare },
  { id: 'scenario', label: 'Scenario Walkthrough', icon: Route },
  { id: 'dashboard', label: 'KPI Dashboard', icon: BarChart3 },
  { id: 'arch', label: 'Reference Architecture', icon: Layers },
  { id: 'agents', label: 'Agent Catalogue', icon: Bot },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'present', label: 'Executive Walkthrough', icon: Presentation },
];

export default function App() {
  const [active, setActive] = useState<SectionId>('summary');
  const [persona, setPersona] = useState<Persona>('CTO');

  const [items, setItems] = useState<Priority[]>(initialPriorities);
  const setVotes = useCallback((id: string, field: 'teamVotes' | 'superVotes', value: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }, []);
  const reset = useCallback(() => setItems(initialPriorities), []);

  if (active === 'present') {
    return (
      <PrioritiesContext.Provider value={{ items, setVotes, reset }}>
        <Presenter onExit={() => setActive('summary')} />
      </PrioritiesContext.Provider>
    );
  }

  return (
    <PrioritiesContext.Provider value={{ items, setVotes, reset }}>
    <PersonaContext.Provider value={persona}>
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-noc-600/60 bg-noc-900/80 p-4 md:flex">
          <div className="mb-6 flex items-center gap-2 px-2">
            <ShieldCheck className="h-7 w-7 text-accent" />
            <div>
              <div className="text-lg font-bold leading-tight text-white">VoiceShield AI</div>
              <div className="text-[11px] uppercase tracking-widest text-slate-500">CVE lifecycle demo</div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  active === s.id ? 'bg-accent/15 text-accent' : 'text-slate-400 hover:bg-noc-700 hover:text-white'
                }`}
              >
                <s.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{s.label}</span>
                <span className="text-xs text-slate-600">{i + 1}</span>
              </button>
            ))}
          </nav>
          <p className="px-2 text-[11px] leading-snug text-slate-600">Tip: use ← → in the Scenario Walkthrough and presenter mode.</p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-noc-600/60 bg-noc-950/85 px-6 py-3 backdrop-blur">
            <select
              className="rounded-lg border border-noc-600 bg-noc-800 px-3 py-2 text-sm md:hidden"
              value={active}
              onChange={(e) => setActive(e.target.value as SectionId)}
              aria-label="Section"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <p className="hidden max-w-xl text-xs text-slate-400 lg:block">
              <span className="font-semibold text-accent">{persona} focus:</span> {personaFocus[persona]}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-slate-500">Persona</span>
              <div className="flex rounded-lg border border-noc-600 bg-noc-900 p-0.5" role="group" aria-label="Persona">
                {personas.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPersona(p)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      persona === p ? 'bg-accent text-noc-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-8 lg:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {active === 'summary' && <ExecutiveSummary />}
                {active === 'told' && <WhatYouToldUs />}
                {active === 'compare' && <Comparison />}
                {active === 'scenario' && <Scenario />}
                {active === 'dashboard' && <Dashboard />}
                {active === 'arch' && <Architecture />}
                {active === 'agents' && <AgentCatalogue />}
                {active === 'roadmap' && <Roadmap />}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="border-t border-noc-600/60 px-6 py-3 text-center text-xs text-slate-500">
            Illustrative demo – mock data and fictional CVE identifiers
          </footer>
        </div>
      </div>
    </PersonaContext.Provider>
    </PrioritiesContext.Provider>
  );
}

