export interface Phase {
  id: string;
  name: string;
  timing: string;
  outcomes: string[];
  kpis: string[];
  prerequisites: string[];
}

export const roadmap: Phase[] = [
  {
    id: 'p0',
    name: 'Phase 0 – Discovery & POC',
    timing: '30 days',
    outcomes: ['Working Intake, Impact and Risk agents on the SBC estate', 'Validated baseline for all KPIs', 'Backlog and architecture agreed'],
    kpis: ['MTTT 5 days → < 4 hours', 'CMDB accuracy for SBCs ≥ 95%', 'Risk score agreement with analysts ≥ 90%'],
    prerequisites: ['Read-only access to CMDB, NetBox and scanners', 'Named SecOps and NetOps sponsors', 'Azure subscription and Foundry access'],
  },
  {
    id: 'p1',
    name: 'Phase 1 – Mitigation & change automation',
    timing: 'Q1–Q2',
    outcomes: ['Mitigation Agent with SIP ACL / header-manipulation templates', 'Auto-generated ServiceNow change requests', 'Teams approvals for CAB'],
    kpis: ['Approval time 7 days → < 1 hour', 'Exposure window 45 → 21 days', 'Analyst hours per CVE 22 → 12'],
    prerequisites: ['ServiceNow change API integration', 'Approver matrix and policy thresholds', 'MOP library digitised in AI Search'],
  },
  {
    id: 'p2',
    name: 'Phase 2 – Testing, digital twin & canary',
    timing: 'Q3–Q4',
    outcomes: ['Automated regression suites (SIP, codec, E911, Teams DR)', 'Lab digital twin of the SBC estate', 'Canary deployment with auto-pause / rollback'],
    kpis: ['Change success 91% → 98.5%', 'Voice outages per quarter 7 → 1', 'MTTR 38 → 6 days'],
    prerequisites: ['Lab environment and test harness', 'KPI telemetry access (ASR, PDD, MOS)', 'Ansible / NSO automation coverage'],
  },
  {
    id: 'p3',
    name: 'Phase 3 – Closed-loop remediation',
    timing: 'Year 2',
    outcomes: ['Policy-governed autonomous remediation of low-risk CVEs', 'Extension to IMS core, BroadWorks, CUCM and media servers', 'Continuous compliance reporting'],
    kpis: ['84% auto-triaged', 'Patch compliance 72% → 96%', 'Analyst hours per CVE 4'],
    prerequisites: ['Proven L3 track record', 'Risk and audit sign-off on autonomy thresholds', 'Responsible AI review'],
  },
];
