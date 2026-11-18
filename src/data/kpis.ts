// Single source of truth for every number shown in the demo.
// All figures are illustrative targets – to be validated in discovery.

export const DISCLAIMER_FIGURES = 'Illustrative targets – to be validated in discovery';

export const network = {
  enterpriseCustomers: 4200,
  seats: 1_100_000,
  sbcNodes: 24,
  cmdbCIs: 3800,
  maintenanceWindow: 'Tue/Thu 00:00–05:00',
};

export interface Kpi {
  id: string;
  name: string;
  short: string;
  today: number;
  ai: number;
  unit: string;
  lowerIsBetter: boolean;
  todayLabel: string;
  aiLabel: string;
  note?: string;
}

export const kpis: Kpi[] = [
  { id: 'mttt', name: 'Mean time to triage (MTTT)', short: 'MTTT', today: 120, ai: 2, unit: 'hours', lowerIsBetter: true, todayLabel: '5 days', aiLabel: '2 hours' },
  { id: 'mttr', name: 'Mean time to remediate – critical CVEs (MTTR)', short: 'MTTR', today: 38, ai: 6, unit: 'days', lowerIsBetter: true, todayLabel: '38 days', aiLabel: '6 days' },
  { id: 'exposure', name: 'Exposure window (critical, internet-facing)', short: 'Exposure', today: 45, ai: 7, unit: 'days', lowerIsBetter: true, todayLabel: '45 days', aiLabel: '7 days' },
  { id: 'hours', name: 'Analyst hours per CVE', short: 'Analyst hrs', today: 22, ai: 4, unit: 'hours', lowerIsBetter: true, todayLabel: '22 h', aiLabel: '4 h' },
  { id: 'change', name: 'Change success rate', short: 'Change success', today: 91, ai: 98.5, unit: '%', lowerIsBetter: false, todayLabel: '91%', aiLabel: '98.5%', note: 'Change-related voice outages per quarter: 7 → 1' },
  { id: 'compliance', name: 'SLA / regulatory patch compliance', short: 'Compliance', today: 72, ai: 96, unit: '%', lowerIsBetter: false, todayLabel: '72%', aiLabel: '96%' },
];

export const outagesPerQuarter = { today: 7, ai: 1 };

// Value-at-stake model (editable in the UI)
export const valueModel = {
  outageCostPerMinute: 18_000, // $ per enterprise-voice outage-minute (assumption)
  avgOutageMinutes: 42,
  cvesPerYear: 1_450,
  analystHourlyCost: 95,
  hoursPerCveToday: 22,
  hoursPerCveAi: 4,
  outagesPerYearToday: outagesPerQuarter.today * 4,
  outagesPerYearAi: outagesPerQuarter.ai * 4,
};

export const headline = {
  title: 'From 38 days to 6 days: AI-assisted vulnerability remediation for enterprise voice',
  daysToday: 38,
  daysAi: 6,
};

export const scenarioSummary = {
  elapsedToday: '38 days',
  elapsedAi: '6 days',
  analystHoursToday: 140,
  analystHoursAi: 31,
  incidents: 0,
};

export const scenarioFacts = {
  cveId: 'CVE-2026-41877',
  cvss: 9.8,
  sbcsTotal: 24,
  sbcsVulnerable: 18,
  sbcsInternetFacing: 6,
  customers: 1140,
  seats: 312_000,
  e911Customers: 41,
  mrrExposed: 2_300_000,
  riskScore: 96,
  testCases: 214,
  testFailures: 2,
};

export const mttrBySeverity = [
  { severity: 'Critical', today: 38, ai: 6 },
  { severity: 'High', today: 52, ai: 14 },
  { severity: 'Medium', today: 78, ai: 30 },
  { severity: 'Low', today: 110, ai: 45 },
];

export const exposureTrend = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
].map((month, i) => ({
  month,
  today: [46, 44, 47, 45, 48, 45, 44, 46, 45, 47, 45, 45][i],
  ai: [45, 40, 31, 24, 18, 14, 11, 9, 8, 7, 7, 7][i],
}));

export const backlogBurndown = [
  'W0', 'W4', 'W8', 'W12', 'W16', 'W20', 'W24', 'W28', 'W32', 'W36', 'W40', 'W44', 'W48',
].map((week, i) => ({
  week,
  today: [412, 420, 428, 431, 436, 440, 445, 441, 447, 452, 449, 455, 458][i],
  ai: [412, 380, 322, 265, 210, 166, 128, 96, 71, 52, 40, 31, 24][i],
}));

export const changeSuccess = { today: 91, ai: 98.5 };

export const effortByStage = [
  { stage: 'Intake', today: 2.0, ai: 0.2 },
  { stage: 'Impact', today: 4.5, ai: 0.5 },
  { stage: 'Risk', today: 2.0, ai: 0.3 },
  { stage: 'Mitigation', today: 3.0, ai: 0.6 },
  { stage: 'Approval', today: 2.5, ai: 0.4 },
  { stage: 'Testing', today: 3.0, ai: 0.8 },
  { stage: 'Lab', today: 1.5, ai: 0.4 },
  { stage: 'Production', today: 2.5, ai: 0.6 },
  { stage: 'Closure', today: 1.0, ai: 0.2 },
];

export const autoTriage = [
  { name: 'Auto-triaged', today: 18, ai: 84 },
  { name: 'Analyst-reviewed', today: 82, ai: 16 },
];

export const kpiDefinitions = [
  { kpi: 'MTTT', definition: 'Time from advisory publication to a validated triage decision', formula: 'avg(triage_decision_ts − advisory_published_ts)', source: 'NVD / PSIRT feeds, ServiceNow', today: '5 days', target: '2 hours' },
  { kpi: 'MTTR (critical)', definition: 'Time from advisory publication to verified remediation of all affected CIs', formula: 'avg(rescan_clean_ts − advisory_published_ts)', source: 'ServiceNow, Tenable/Qualys', today: '38 days', target: '6 days' },
  { kpi: 'Exposure window', definition: 'Days a critical, internet-facing voice CI remains vulnerable after a KEV listing', formula: 'avg(remediated_ts − kev_added_ts) for internet-facing CIs', source: 'CISA KEV, CMDB, scanners', today: '45 days', target: '7 days' },
  { kpi: 'Analyst hours / CVE', definition: 'Human effort across all lifecycle stages per CVE', formula: 'sum(timesheet + ticket effort) / CVE count', source: 'ServiceNow, time tracking', today: '22 h', target: '4 h' },
  { kpi: 'Change success rate', definition: 'Share of security changes closed without rollback or incident', formula: 'successful_changes / total_changes', source: 'ServiceNow Change', today: '91%', target: '98.5%' },
  { kpi: 'Patch compliance', definition: 'Share of CVEs remediated inside regulatory / contractual SLA', formula: 'cves_within_sla / cves_due', source: 'ServiceNow, audit evidence store', today: '72%', target: '96%' },
  { kpi: '% auto-triaged', definition: 'CVEs triaged by agents without analyst rework', formula: 'auto_triaged / total_cves', source: 'Agent audit trail', today: '18%', target: '84%' },
];

export const personas = ['CTO', 'CISO', 'NetOps', 'Change Manager'] as const;
export type Persona = (typeof personas)[number];

// KPI ordering and emphasis per persona
export const personaKpiOrder: Record<Persona, string[]> = {
  CTO: ['mttr', 'hours', 'change', 'exposure', 'compliance', 'mttt'],
  CISO: ['exposure', 'mttt', 'mttr', 'compliance', 'change', 'hours'],
  NetOps: ['change', 'mttr', 'hours', 'exposure', 'mttt', 'compliance'],
  'Change Manager': ['change', 'compliance', 'mttr', 'hours', 'mttt', 'exposure'],
};

export const personaFocus: Record<Persona, string> = {
  CTO: 'Cost, speed and platform strategy – fewer analyst hours, faster delivery, a reusable agent platform.',
  CISO: 'Risk reduction – shrink exposure windows for KEV-listed and internet-facing assets, with audit-ready evidence.',
  NetOps: 'Service protection – canary rollouts, KPI guardrails (ASR, PDD, MOS) and automatic rollback.',
  'Change Manager': 'Governance – auto-built change requests, right approvers, Teams approvals, audit trail.',
};
