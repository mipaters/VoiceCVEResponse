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
    name: 'Phase 0 – POC on the top 3 jobs',
    timing: '30 days',
    outcomes: [
      'CVE Intake Agent feeding the Security Incident Assessment Agent, which checks the Asset Discovery inventory first',
      'Asset Discovery + Security Incident Assessment Agents on the ~27 applications',
      'Validated baselines for every KPI',
    ],
    kpis: ['2–3 hrs → < 10 min to find what\'s impacted', 'Assets discovered vs CMDB', '% version checks automated'],
    prerequisites: ['Read-only access to CMDB, hypervisor/VM inventory and scanners', 'Azure Arc / Ansible read-only connectivity', 'Named sponsor (Jay) and application owners'],
  },
  {
    id: 'p1',
    name: 'Phase 1 – Risk, brief and strategy',
    timing: 'Q1–Q2',
    outcomes: ['Coordinator Agent assigning SMEs and posting updates in Teams', 'Risk Agent', 'Briefing Agent for exec briefs, LT alerts and podcast summaries', 'Mitigation Agent with structured plans and vendor drafts', 'Teams approvals'],
    kpis: ['Assessment brief turnaround', 'Leadership update effort', 'End-to-end MTTR'],
    prerequisites: ['Knowledge graph seeded with application owners', 'Vendor / contract data accessible', 'Approver matrix'],
  },
  {
    id: 'p2',
    name: 'Phase 2 – Lab automation and change',
    timing: 'Q3–Q4',
    outcomes: ['Scheduling, Deploy and Test Agents', 'Change Agent: tickets, MOPs, rollback', 'Staged rollout with health checks and auto-pause'],
    kpis: ['After-hours / weekend hours', 'Production failures looped back to lab', 'End-to-end MTTR'],
    prerequisites: ['Lab environment and automation', 'ServiceNow Change integration', 'Window and time-of-day policy'],
  },
  {
    id: 'p3',
    name: 'Phase 3 – Closed loop',
    timing: 'Year 2',
    outcomes: ['Compliance Agent: re-scan, CMDB updates, post-mortems', 'Lab-failure prediction', 'Policy-governed autonomy for low-risk CVEs'],
    kpis: ['End-to-end MTTR 30 → 7 days', 'Production failures looped back to lab', 'Assets discovered vs CMDB'],
    prerequisites: ['Proven L3 track record', 'Risk sign-off on autonomy thresholds'],
  },
];
