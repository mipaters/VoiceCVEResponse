export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  stat?: { value: string; label: string }[];
  notes: string[];
}

export const slides: Slide[] = [
  {
    id: 1,
    title: 'The problem',
    subtitle: 'Voice is critical infrastructure – and the SBC edge is under attack',
    bullets: [
      '4,200 enterprise customers and 1.1M seats depend on our voice platform',
      'Critical SIP vulnerabilities are now exploited within days of disclosure',
      'Our process is manual, sequential and calendar-driven',
    ],
    stat: [
      { value: '38 days', label: 'mean time to remediate critical CVEs' },
      { value: '45 days', label: 'exposure window, internet-facing' },
    ],
    notes: [
      'Open with the stakes: this is not an IT patching problem, it is emergency-services-grade infrastructure.',
      'Mention that KEV listings mean exploitation is already happening.',
      'Ask: how long did the last critical SBC CVE take end to end?',
    ],
  },
  {
    id: 2,
    title: 'The cost of the status quo',
    subtitle: 'Slow, expensive and risky',
    bullets: [
      '22 analyst hours per CVE, across 5–8 people',
      '7 change-related voice outages per quarter',
      '72% SLA / regulatory patch compliance',
    ],
    stat: [
      { value: '22 h', label: 'analyst effort per CVE' },
      { value: '7', label: 'change-related outages per quarter' },
    ],
    notes: [
      'Use the editable value model on the Executive Summary to quote avoided outage cost.',
      'Emphasise regulatory exposure and E911 obligations.',
    ],
  },
  {
    id: 3,
    title: 'A day in the life – before and after',
    subtitle: 'Same CVE, two realities',
    bullets: [
      'Before: email → spreadsheet → weekly CAB → big-bang window → manual evidence (38 days)',
      'After: 24x7 intake → blast radius in 30 min → virtual patch in 4 h → Teams CAB in 35 min → canary rollout (6 days)',
      'Humans decide; agents prepare, test and execute',
    ],
    stat: [
      { value: '12 min', label: 'KEV listing to flagged' },
      { value: '4 h', label: 'virtual patch on internet-facing SBCs' },
    ],
    notes: ['Use the Today vs AI-Assisted section; toggle between pain points and AI value.', 'Stress human-in-the-loop checkpoints at every stage.'],
  },
  {
    id: 4,
    title: 'Scenario highlights',
    subtitle: 'Illustrative CVE-2026-41877 – SIP pre-auth RCE, CVSS 9.8, in CISA KEV',
    bullets: [
      '18 of 24 SBCs vulnerable; 6 internet-facing; 1,140 customers; 41 E911-dependent',
      'Risk score 96/100 → emergency change approved in 35 minutes',
      '214 automated tests found a Teams TLS regression before production',
      'Canary rollout auto-paused on a PDD spike – zero customer-impacting incidents',
    ],
    stat: [
      { value: '6 days', label: 'vs 38 days' },
      { value: '31 h', label: 'analyst hours vs 140' },
    ],
    notes: ['Walk the 10 steps; click Approve at each human checkpoint.', 'Highlight the auto-pause as proof of safety, not just speed.'],
  },
  {
    id: 5,
    title: 'KPIs',
    subtitle: 'Illustrative targets – to be validated in discovery',
    bullets: [
      'MTTT: 5 days → 2 hours',
      'MTTR (critical): 38 → 6 days; exposure window 45 → 7 days',
      'Change success 91% → 98.5%; outages per quarter 7 → 1',
      'Compliance 72% → 96%',
    ],
    stat: [
      { value: '84%', label: 'CVEs auto-triaged' },
      { value: '−82%', label: 'analyst hours per CVE' },
    ],
    notes: ['Be explicit these are targets; Phase 0 validates baselines.', 'Tailor the lead KPI to the persona in the room.'],
  },
  {
    id: 6,
    title: 'Reference architecture',
    subtitle: 'Built on Azure, integrated with your tools',
    bullets: [
      'Sources → Event Hubs / Fabric / AI Search → Foundry agents → ServiceNow, pipelines, Ansible / NSO',
      'Teams adaptive-card approvals keep humans in control',
      'Entra ID, Key Vault, Purview and an agent audit trail provide governance',
      'Autonomy dial: L1 assist → L4 autonomous for low-risk changes',
    ],
    notes: ['Open the Reference Architecture section and move the autonomy slider.', 'No production change without human approval at L1–L3.'],
  },
  {
    id: 7,
    title: 'Roadmap & the ask',
    subtitle: 'Approve the 30-day Phase 0 POC',
    bullets: [
      'Phase 0 (30 days): Intake, Impact and Risk agents on the SBC estate',
      'Phase 1 (Q1–Q2): mitigation, change automation, Teams approvals',
      'Phase 2 (Q3–Q4): automated testing, digital twin, canary deployment',
      'Phase 3: policy-governed autonomous remediation for low-risk CVEs',
    ],
    stat: [{ value: '30 days', label: 'to prove value on the SBC estate' }],
    notes: ['The ask: approve Phase 0, name sponsors from SecOps and NetOps, grant read-only access.', 'Close by agreeing the date for the Phase 0 readout.'],
  },
];
