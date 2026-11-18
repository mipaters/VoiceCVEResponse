// Single source of truth for the numbers shown in the demo.
// Only the baseline marked `quoted: true` comes from the customer; everything else is
// "Illustrative – to be validated".

export const DISCLAIMER_FIGURES = 'Illustrative – to be validated';
export const BADGE_QUOTED = 'Customer-quoted baseline';

export const network = {
  applications: 27,
  onPremPct: 95,
};

export interface Kpi {
  id: string;
  name: string;
  today: number;
  ai: number;
  unit: string;
  lowerIsBetter: boolean;
  todayLabel: string;
  aiLabel: string;
  quoted?: boolean;
  note?: string;
}

export const kpis: Kpi[] = [
  { id: 'discover', name: 'Time to find what\'s impacted (per CVE)', today: 150, ai: 10, unit: 'min', lowerIsBetter: true, todayLabel: '2–3 hrs', aiLabel: '< 10 min', quoted: true, note: 'Baseline quoted by the customer; assessment only' },
  { id: 'coverage', name: 'Assets discovered vs CMDB', today: 78, ai: 98, unit: '%', lowerIsBetter: false, todayLabel: '78%', aiLabel: '98%', note: 'Share of real assets/packages known and verified' },
  { id: 'versions', name: '% of version checks automated', today: 10, ai: 90, unit: '%', lowerIsBetter: false, todayLabel: '10%', aiLabel: '90%' },
  { id: 'brief', name: 'Assessment brief turnaround', today: 48, ai: 2, unit: 'hours', lowerIsBetter: true, todayLabel: '2 days', aiLabel: '2 hours' },
  { id: 'afterhours', name: 'After-hours / weekend hours per critical CVE', today: 14, ai: 3, unit: 'hours', lowerIsBetter: true, todayLabel: '14 h', aiLabel: '3 h' },
  { id: 'looped', name: 'Production failures looped back to lab (per quarter)', today: 6, ai: 1, unit: 'failures', lowerIsBetter: true, todayLabel: '6', aiLabel: '1' },
  { id: 'mttr', name: 'End-to-end MTTR (critical CVEs)', today: 30, ai: 7, unit: 'days', lowerIsBetter: true, todayLabel: '30 days', aiLabel: '7 days' },
  { id: 'leadership', name: 'Leadership update effort (per CVE)', today: 6, ai: 1, unit: 'hours', lowerIsBetter: true, todayLabel: '6 h', aiLabel: '1 h' },
];

export const valueModel = {
  cveEventsPerYear: 120,
  engineerHourlyCost: 95,
  assessHoursToday: 2.5,
  assessHoursAi: 10 / 60,
  afterHoursToday: 14,
  afterHoursAi: 3,
  leadershipToday: 6,
  leadershipAi: 1,
  briefHoursToday: 6,
  briefHoursAi: 0.5,
};

export const headline = {
  title: 'From 2–3 hours to under 10 minutes to find what\'s impacted – AI-assisted CVE response for 27 applications',
  daysToday: 30,
  daysAi: 7,
};

export const scenarioSummary = {
  elapsedToday: '30 days',
  elapsedAi: '7 days',
  findToday: '2–3 hrs',
  findAi: '8 min',
  afterHoursToday: '14 h',
  afterHoursAi: '3 h',
  productionFailures: 0,
};

export const scenarioFacts = {
  cveId: 'CVE-2026-31337',
  cvss: 9.1,
  appsTotal: 27,
  appsAffected: 9,
  appsInUse: 7,
  appsPublicFacing: 3,
  hosts: 64,
  riskScore: 91,
  labTests: 168,
  labFailures: 3,
};

// Illustrative elapsed days per stage – end-to-end MTTR build-up
export const mttrByStage = [
  { stage: 'Identify Incident', today: 1, ai: 0.1 },
  { stage: 'Assessment', today: 4, ai: 0.5 },
  { stage: 'Risk', today: 3, ai: 0.5 },
  { stage: 'Develop Strategy', today: 6, ai: 1 },
  { stage: 'Validation for Lab', today: 4, ai: 1 },
  { stage: 'Integrate into Lab', today: 3, ai: 1.5 },
  { stage: 'Deploy into Production', today: 7, ai: 2 },
  { stage: 'Validation', today: 2, ai: 0.4 },
];

export const verifiedInventory = [
  'Wk 0', 'Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8',
].map((week, i) => ({
  week,
  today: 11,
  ai: [11, 14, 18, 21, 24, 25, 26, 27, 27][i],
}));

export const versionChecks = { today: 10, ai: 90 };

export const kpiDefinitions = [
  { kpi: 'Time to find what\'s impacted', definition: 'Elapsed time from validated CVE to a confirmed list of impacted assets (assessment only)', formula: 'avg(impact_list_ts − triage_ts)', source: 'Agent audit trail, assessment brief', today: '2–3 hrs (customer-quoted)', target: '< 10 min' },
  { kpi: 'Assets discovered vs CMDB', definition: 'Share of real hosts / packages in the live estate that are known and verified', formula: 'verified_assets / discovered_assets', source: 'CMDB, hypervisor/VM inventory, package manifests', today: '78%', target: '98%' },
  { kpi: '% version checks automated', definition: 'OS and package version checks performed by read-only automation instead of manual log-in', formula: 'automated_checks / total_checks', source: 'Ansible / agent logs', today: '10%', target: '90%' },
  { kpi: 'Assessment brief turnaround', definition: 'Time from impact confirmed to the Development Assessment Brief reaching Jay', formula: 'avg(brief_sent_ts − impact_confirmed_ts)', source: 'Teams, ServiceNow', today: '2 days', target: '2 hours' },
  { kpi: 'After-hours / weekend hours', definition: 'Engineer hours outside business hours per critical CVE', formula: 'sum(after_hours_effort) / critical CVEs', source: 'Change tickets, time tracking', today: '14 h', target: '3 h' },
  { kpi: 'Production failures looped back to lab', definition: 'Production changes that fail and return to the lab', formula: 'count(failed_prod_changes → lab) per quarter', source: 'ServiceNow Change', today: '6 / qtr', target: '1 / qtr' },
  { kpi: 'End-to-end MTTR', definition: 'Time from incident identified to verified remediation', formula: 'avg(validated_ts − identified_ts)', source: 'ServiceNow, scanners', today: '30 days', target: '7 days' },
  { kpi: 'Leadership update effort', definition: 'Engineer hours spent on updates and follow-up to leadership per CVE', formula: 'sum(comms_effort) / CVE count', source: 'Time tracking, Teams', today: '6 h', target: '1 h' },
];

export const personas = ['CTO', 'CISO', 'NetOps', 'Change Manager'] as const;
export type Persona = (typeof personas)[number];

export const personaKpiOrder: Record<Persona, string[]> = {
  CTO: ['mttr', 'discover', 'coverage', 'leadership', 'versions', 'brief', 'afterhours', 'looped'],
  CISO: ['discover', 'coverage', 'mttr', 'versions', 'brief', 'leadership', 'looped', 'afterhours'],
  NetOps: ['looped', 'afterhours', 'discover', 'versions', 'coverage', 'mttr', 'brief', 'leadership'],
  'Change Manager': ['looped', 'brief', 'leadership', 'afterhours', 'mttr', 'versions', 'discover', 'coverage'],
};

export const personaFocus: Record<Persona, string> = {
  CTO: 'Speed and efficiency – less time on assessment, a reusable agent platform across 27 applications.',
  CISO: 'Exposure – know exactly what is impacted in minutes, with public-facing risk surfaced first.',
  NetOps: 'Operations – fewer after-hours changes and fewer production failures looping back to the lab.',
  'Change Manager': 'Governance – auto-built tickets, MOPs and approvals with time-of-day rules.',
};
