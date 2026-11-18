export interface Stage {
  id: number;
  name: string;
  today: {
    steps: string[];
    roles: string[];
    tools: string[];
    elapsed: string;
    pain: string[];
  };
  ai: {
    agent: string;
    steps: string[];
    checkpoint: string;
    elapsed: string;
    value: string[];
  };
}

export const stages: Stage[] = [
  {
    id: 1,
    name: 'CVE capture / intake',
    today: {
      steps: ['Analysts manually monitor NVD, vendor PSIRTs (Cisco, Oracle, Ribbon, Microsoft) and email lists', 'Copy details into a ticket and spreadsheet'],
      roles: ['Vulnerability analyst', 'SecOps duty analyst'],
      tools: ['Browser, email lists', 'Excel', 'ServiceNow'],
      elapsed: '~5 days',
      pain: ['Business-hours only coverage', 'Duplicate advisories across sources', 'Inconsistent product naming'],
    },
    ai: {
      agent: 'Intake Agent',
      steps: ['Ingests NVD, CISA KEV, vendor advisories and threat intel 24x7', 'Dedupes, normalises and maps to CPEs'],
      checkpoint: 'Analyst confirms scope of high-severity items',
      elapsed: '~12 minutes',
      value: ['24x7 coverage', 'Single normalised record per CVE', '84% auto-triaged'],
    },
  },
  {
    id: 2,
    name: 'Asset matching / impact',
    today: {
      steps: ['Look up affected products in spreadsheets', 'Ask regional engineers for firmware versions', 'Estimate customer impact by hand'],
      roles: ['Network engineer', 'Service owner', 'Account manager'],
      tools: ['CMDB (incomplete)', 'Spreadsheets', 'Email'],
      elapsed: '~4 days',
      pain: ['CMDB gaps (stale firmware data)', 'No view of customers, seats or E911 dependency', 'Chasing multiple teams'],
    },
    ai: {
      agent: 'Impact Agent',
      steps: ['Matches CPEs to CMDB plus live config / firmware inventory', 'Builds blast-radius graph: customers, seats, E911 dependency, revenue at risk'],
      checkpoint: 'NetOps duty manager signs off the impact report',
      elapsed: '~30 minutes',
      value: ['Accurate asset inventory', 'Customer-level blast radius', 'E911 dependencies surfaced'],
    },
  },
  {
    id: 3,
    name: 'Risk scoring',
    today: {
      steps: ['Rank by CVSS base score', 'Debate exposure by email'],
      roles: ['Security analyst', 'CISO delegate'],
      tools: ['CVSS calculators', 'Email'],
      elapsed: '~2 days',
      pain: ['CVSS ignores exploitation and exposure', 'Everything "critical" competes for the same windows', 'Inconsistent rationale'],
    },
    ai: {
      agent: 'Risk Agent',
      steps: ['Contextual score = CVSS + EPSS + KEV + exposure + compensating controls + customer criticality', 'Recommends change track (emergency / standard)'],
      checkpoint: 'CISO delegate approves score and track',
      elapsed: '~1 hour',
      value: ['Risk-based prioritisation', 'Explainable factor breakdown', 'Policy-as-code thresholds'],
    },
  },
  {
    id: 4,
    name: 'Mitigation strategy',
    today: {
      steps: ['Engineers recall similar past changes', 'Check vendor docs by hand', 'Agree approach on bridge calls'],
      roles: ['Senior network engineer', 'Vendor TAC', 'Architect'],
      tools: ['Vendor portals', 'Wiki', 'Teams calls'],
      elapsed: '~6 days',
      pain: ['Tribal knowledge', 'Key-person dependency', 'Workarounds rarely considered'],
    },
    ai: {
      agent: 'Mitigation Agent',
      steps: ['Drafts options: patch, config workaround, SIP ACL / header rule, SBC virtual patch', 'Lists pros, cons and rollback, grounded in vendor docs and past changes'],
      checkpoint: 'NetOps engineering lead selects the option',
      elapsed: '~2 hours',
      value: ['Interim protection in hours', 'Reuse of past MOPs', 'Rollback always defined'],
    },
  },
  {
    id: 5,
    name: 'Internal plan approval',
    today: {
      steps: ['Write change request and MOP manually', 'Email chains for approvals', 'Wait for the weekly CAB'],
      roles: ['Change manager', 'NetOps director', 'CISO', 'Service owners'],
      tools: ['ServiceNow', 'Email', 'Weekly CAB meeting'],
      elapsed: '~7 days',
      pain: ['Waiting for weekly cadence', 'Incomplete risk / rollback info', 'Chasing approvers'],
    },
    ai: {
      agent: 'Change Agent',
      steps: ['Auto-generates ServiceNow change request with risk, impact, MOP, rollback and customer comms', 'Routes to right approvers; CISO / NetOps approve in Teams'],
      checkpoint: 'CAB approves via Teams adaptive card',
      elapsed: '~35 minutes',
      value: ['Complete change records', 'Right approvers first time', 'Emergency path without chaos'],
    },
  },
  {
    id: 6,
    name: 'Testing',
    today: {
      steps: ['Write test plan manually', 'Book lab slots', 'Run SIP / codec / failover tests by hand'],
      roles: ['Voice QA engineer', 'Lab manager'],
      tools: ['Test spreadsheets', 'SIP test sets', 'Lab booking by email'],
      elapsed: '~6 days',
      pain: ['Partial coverage', 'Teams Direct Routing rarely re-tested', 'Slow feedback'],
    },
    ai: {
      agent: 'Test Agent',
      steps: ['Generates regression suite: SIP call flows, codec negotiation, failover, E911 test calls, Teams Direct Routing', 'Runs it via the test automation harness'],
      checkpoint: 'Voice QA lead approves test scope',
      elapsed: '~4 hours',
      value: ['214+ cases per CVE', 'Consistent coverage', 'Regression found before production'],
    },
  },
  {
    id: 7,
    name: 'Lab deployment',
    today: {
      steps: ['Stage firmware manually in the lab', 'Compare KPIs from screenshots'],
      roles: ['Lab engineer', 'Voice QA engineer'],
      tools: ['Lab SBCs', 'CLI', 'KPI dashboards'],
      elapsed: '~3 days',
      pain: ['Lab differs from production', 'Manual KPI comparison', 'Config drift'],
    },
    ai: {
      agent: 'Deploy Agent (lab)',
      steps: ['Automated lab deploy with digital-twin validation', 'Compares KPIs before and after: ASR, NER, PDD, MOS, registration success'],
      checkpoint: 'NetOps engineering lead approves go / no-go',
      elapsed: '~3 hours',
      value: ['Production-faithful twin', 'Objective KPI deltas', 'Config fixes proposed automatically'],
    },
  },
  {
    id: 8,
    name: 'Production implementation & change management',
    today: {
      steps: ['Big-bang upgrade in the maintenance window', 'Watch dashboards manually', 'Draft customer notices after the fact'],
      roles: ['NOC engineers', 'Change implementer', 'Service desk'],
      tools: ['SBC CLI', 'NMS dashboards', 'Email'],
      elapsed: '~3 days',
      pain: ['Risk of voice outage', 'Late detection of KPI breaches', 'Window overruns'],
    },
    ai: {
      agent: 'Deploy Agent',
      steps: ['Canary rollout by region / SBC pair inside the Tue/Thu window', 'Automated health checks, auto-pause and rollback on KPI breach', 'Auto-generated enterprise customer notifications'],
      checkpoint: 'NOC shift lead promotes each wave',
      elapsed: '~5 hours',
      value: ['Blast radius contained', 'Automatic rollback', 'Customers informed proactively'],
    },
  },
  {
    id: 9,
    name: 'Verification & closure',
    today: {
      steps: ['Manual re-scan', 'Update CMDB by hand', 'Assemble audit evidence in spreadsheets'],
      roles: ['Vulnerability analyst', 'Compliance officer'],
      tools: ['Tenable / Qualys', 'Spreadsheets', 'ServiceNow'],
      elapsed: '~3 days',
      pain: ['Evidence scattered', 'CMDB not updated', 'Lessons not captured'],
    },
    ai: {
      agent: 'Compliance Agent',
      steps: ['Re-scan confirms remediation', 'CMDB updated; audit evidence pack generated', 'Lessons learned fed back into the knowledge base'],
      checkpoint: 'Compliance officer approves closure',
      elapsed: '~2 hours',
      value: ['Audit-ready evidence', 'CMDB self-heals', 'Knowledge compounds'],
    },
  },
];
