import { useState } from 'react';
import { Bot, ShieldCheck, Target, UserCheck, Wrench } from 'lucide-react';
import { agents } from '../data/agents';
import { phase0Scope } from '../data/priorities';
import { usePriorities } from '../components/PersonaContext';
import { Badge, SectionHeader } from '../components/ui';
import AssetAgentArchitecture from '../agents/asset-management/ArchitectureView';
import AssessmentAgentArchitecture from '../agents/security-incident-assessment/ArchitectureView';
import CoordinatorAgentArchitecture from '../agents/coordinator/ArchitectureView';
import CveIntakeAgentArchitecture from '../agents/cve-intake/ArchitectureView';

function List({ items }: { items: string[] }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {items.map((i) => <span key={i} className="chip">{i}</span>)}
    </div>
  );
}

export default function AgentCatalogue() {
  const { items } = usePriorities();
  const phase0 = new Set(phase0Scope(items).agents);
  const [view, setView] = useState<'list' | 'asset' | 'assessment' | 'coordinator' | 'intake'>('list');
  if (view === 'intake') return <CveIntakeAgentArchitecture onBack={() => setView('list')} onOpenCoordinator={() => setView('coordinator')} />;
  if (view === 'coordinator') return <CoordinatorAgentArchitecture onBack={() => setView('list')} onOpenAgent={(id) => setView(id)} />;
  if (view === 'asset') return <AssetAgentArchitecture onBack={() => setView('list')} />;
  if (view === 'assessment') return <AssessmentAgentArchitecture onBack={() => setView('list')} onOpenInventory={() => setView('asset')} />;
  return (
    <div>
      <SectionHeader title="Agent Catalogue" subtitle="One agent per stage of your process plus a Coordinator, each with a human checkpoint and explicit guardrails." right={<Badge kind="illustrative" />} />
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {agents.map((a) => (
          <div key={a.name} className={`card flex flex-col gap-3 ${phase0.has(a.name) ? 'border-accent/60' : ''}`}>
            <div className="flex flex-wrap items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-white">{a.name}</h3>
              {phase0.has(a.name) && <span className="chip border-accent/60 text-accent">Phase 0 POC</span>}
            </div>
            <div className="text-xs text-slate-500">Stage: {a.stages}</div>
            <p className="text-sm text-slate-300">{a.purpose}</p>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Inputs</div>
              <List items={a.inputs} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Outputs</div>
              <List items={a.outputs} />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><Wrench className="h-3 w-3" /> Tools / actions</div>
              <List items={a.tools} />
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-sm text-amber-200">
              <UserCheck className="mr-1 inline h-4 w-4" /> {a.checkpoint}
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><ShieldCheck className="h-3 w-3" /> Guardrails</div>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-300">
                {a.guardrails.map((g) => <li key={g}>{g}</li>)}
              </ul>
            </div>
            {a.name === 'Asset Discovery Agent' && (
              <button className="btn btn-primary self-start" onClick={() => setView('asset')}>View Architecture</button>
            )}
            {a.name === 'Security Incident Assessment Agent' && (
              <button className="btn btn-primary self-start" onClick={() => setView('assessment')}>View Architecture</button>
            )}
            {a.name === 'CVE Intake Agent' && (
              <button className="btn btn-primary self-start" onClick={() => setView('intake')}>View Architecture</button>
            )}
            {a.name === 'Coordinator Agent' && (
              <button className="btn btn-primary self-start" onClick={() => setView('coordinator')}>View Architecture</button>
            )}
            <div className="mt-auto flex items-center gap-2 border-t border-noc-600 pt-3 text-sm">
              <Target className="h-4 w-4 text-emerald-400" /> <span className="text-slate-400">KPI owned:</span> <span className="font-semibold text-emerald-300">{a.kpi}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
