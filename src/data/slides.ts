export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  visual?: 'journey' | 'priorities' | 'flow';
  bullets: string[];
  stat?: { value: string; label: string }[];
  notes: string[];
}

export const slides: Slide[] = [
  {
    id: 1,
    title: 'What we heard',
    subtitle: 'Your current security response process – from your whiteboard',
    visual: 'journey',
    bullets: [],
    notes: [
      'Walk the journey left to right. Quote the customer: "2–3 hrs to find what\'s impacted".',
      'The lowest point is Validation for Lab (after hours, weekends); Assessment and Risk are heavy on tribal knowledge.',
      'Ops owns ~27 apps, 95% on-prem / private cloud; engineers are app specialists, not security experts.',
    ],
  },
  {
    id: 2,
    title: 'Your top 3 priorities',
    subtitle: 'Dot voting – Jay\'s super votes weighted x2',
    visual: 'priorities',
    bullets: [],
    notes: ['Read from the whiteboard photo – confirm the counts with the room.', 'The top 3 jobs frame the Phase 0 POC; the phased start is CVE Intake, Asset Discovery, then Security Incident Assessment. Adjust votes live if they change.'],
  },
  {
    id: 3,
    title: 'The AI-assisted flow',
    subtitle: 'Same 8 stages – an agent and a human checkpoint at each',
    visual: 'flow',
    bullets: [],
    notes: ['Humans stay in control: Jay approves the brief, app owners confirm risk, CAB approves production.', 'The Coordinator Agent runs across all stages.'],
  },
  {
    id: 4,
    title: 'Scenario: a CVE in OpenSSL',
    subtitle: 'Illustrative CVE-2026-31337 hitting 9 of the 27 apps',
    bullets: [
      'CVE Intake Agent merges 5 alarms into 1 event; no approval needed',
      'Impact found in 8 minutes: 9 apps, 7 actually use it, 3 are public-facing',
      'Test Agent catches 3 lab failures before production – fixed in the lab, not after a failed change',
      'Staged rollout inside business hours; closure brief to leadership posted by the Coordinator Agent',
    ],
    stat: [
      { value: '8 min', label: 'to find what\'s impacted (vs 2–3 hrs)' },
      { value: '0', label: 'production failures sent back to lab' },
    ],
    notes: ['Walk the 9-step scenario; point out the loop-back stays in the lab.', 'Numbers other than "2–3 hrs" are illustrative.'],
  },
  {
    id: 5,
    title: 'KPIs',
    subtitle: 'Only the 2–3 hr baseline is customer-quoted – the rest is illustrative, to be validated',
    bullets: [
      'Time to find what\'s impacted: 2–3 hrs → < 10 min',
      'Assets discovered vs CMDB and % of version checks automated',
      'Assessment brief turnaround; leadership update effort',
      'After-hours / weekend hours; production failures looped back to lab',
      'End-to-end MTTR: 30 → 7 days (illustrative)',
    ],
    stat: [
      { value: '< 10 min', label: 'target for finding what\'s impacted' },
      { value: '7 days', label: 'illustrative end-to-end MTTR' },
    ],
    notes: ['Be explicit that the POC will validate baselines.', 'Tailor the lead KPI to the persona in the room.'],
  },
  {
    id: 6,
    title: 'Architecture',
    subtitle: 'On-prem / private-cloud connectors via Azure Arc',
    bullets: [
      'Sources: CMDB, hypervisor/VM inventory, package manifests, scanners, vendor advisories',
      'Azure Arc and read-only Ansible reach the 95% on-prem / private-cloud estate',
      'Foundry agents with a knowledge graph of apps, owners, infra and dependencies',
      'Teams approvals; Entra ID, Key Vault, audit trail and Responsible AI guardrails',
    ],
    notes: ['Open the Reference Architecture section and move the autonomy slider.', 'All collection is read-only; no production change without human approval.'],
  },
  {
    id: 7,
    title: 'The ask: 30-day POC',
    subtitle: 'On your top 3 jobs',
    bullets: [
      'Phased start: CVE Intake → Asset Discovery → Security Incident Assessment Agents',
      'Identify all our assets – Asset Discovery + Security Incident Assessment Agents',
      'Log in to asset / detect vulnerability – read-only assessment automation',
      'Need: sponsor, read-only access to CMDB / inventory / scanners, 3–4 application owners',
    ],
    stat: [{ value: '30 days', label: 'to prove value on the top 3 jobs' }],
    notes: ['Close by agreeing the POC kickoff date and the readout date.'],
  },
];
