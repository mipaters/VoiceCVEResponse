export interface Agent {
  name: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  tools: string[];
  checkpoint: string;
  guardrails: string[];
  kpi: string;
}

export const agents: Agent[] = [
  {
    name: 'Intake Agent',
    purpose: 'Continuously capture, deduplicate and normalise CVEs relevant to the enterprise voice estate.',
    inputs: ['NVD', 'CISA KEV', 'EPSS', 'Vendor PSIRTs', 'Defender Threat Intelligence'],
    outputs: ['Normalised CVE record', 'CPE mapping', 'Priority flag'],
    tools: ['Feed connectors', 'CPE matcher', 'Teams notifier'],
    checkpoint: 'Analyst confirms scope for critical / KEV items',
    guardrails: ['Read-only access to sources', 'Cites every source document', 'Low-confidence matches escalated'],
    kpi: 'MTTT',
  },
  {
    name: 'Impact Agent',
    purpose: 'Match CVEs to real assets and compute customer-level blast radius.',
    inputs: ['CMDB', 'NetBox / firmware DB', 'Live device config', 'Billing and E911 routing'],
    outputs: ['Impact report', 'Blast-radius graph', 'CMDB correction proposals'],
    tools: ['Graph query', 'Device read-only CLI', 'CMDB API'],
    checkpoint: 'NetOps duty manager signs off the impact report',
    guardrails: ['Read-only device access', 'PII minimisation in customer data', 'CMDB writes require approval'],
    kpi: 'Analyst hours per CVE',
  },
  {
    name: 'Risk Agent',
    purpose: 'Compute an explainable contextual risk score and recommend the change track.',
    inputs: ['CVSS', 'EPSS', 'KEV', 'Exposure data', 'Compensating controls', 'Customer criticality'],
    outputs: ['Risk score 0–100', 'Factor breakdown', 'Change-track recommendation'],
    tools: ['Scoring model', 'Policy engine'],
    checkpoint: 'CISO delegate approves score and track',
    guardrails: ['Policy-as-code thresholds', 'Overrides need CISO approval and are logged'],
    kpi: 'Exposure window',
  },
  {
    name: 'Mitigation Agent',
    purpose: 'Draft mitigation options with pros, cons and rollback, grounded in vendor docs and past changes.',
    inputs: ['Vendor advisories', 'Past MOPs and changes', 'Impact report', 'Risk score'],
    outputs: ['Ranked mitigation options', 'SIP ACL / header-manipulation rules', 'Rollback plan'],
    tools: ['Azure AI Search', 'Config generator', 'Ansible / NSO (via pipeline)'],
    checkpoint: 'NetOps engineering lead selects and approves',
    guardrails: ['Grounded citations required', 'Config syntax validated in lab twin', 'No direct production writes'],
    kpi: 'Exposure window',
  },
  {
    name: 'Change Agent',
    purpose: 'Create complete change requests and route approvals in Teams.',
    inputs: ['Risk, impact and mitigation artefacts', 'Maintenance windows', 'Approver matrix'],
    outputs: ['ServiceNow change request', 'MOP', 'Customer comms drafts'],
    tools: ['ServiceNow API', 'Teams adaptive cards'],
    checkpoint: 'CAB approves in Teams',
    guardrails: ['Cannot self-approve', 'Windows enforced (Tue/Thu 00:00–05:00 unless emergency)'],
    kpi: 'Change success rate',
  },
  {
    name: 'Test Agent',
    purpose: 'Generate and run the regression suite for SIP, media, failover, E911 and Teams Direct Routing.',
    inputs: ['Device config', 'Past regression suites', 'Call-flow library'],
    outputs: ['Test plan', 'Test results', 'Config fix proposals'],
    tools: ['Test automation harness', 'SIP simulators', 'E911 test-call tooling'],
    checkpoint: 'Voice QA lead approves scope',
    guardrails: ['Lab-only execution', 'Test calls to E911 use designated test numbers'],
    kpi: 'Change success rate',
  },
  {
    name: 'Deploy Agent',
    purpose: 'Run lab deployments and canary rollouts with live KPI guardrails and auto-rollback.',
    inputs: ['Approved change', 'MOP', 'Voice KPIs', 'Maintenance window'],
    outputs: ['Deployment log', 'Wave health reports', 'Customer notifications'],
    tools: ['Ansible / NSO', 'Azure DevOps / GitHub Actions', 'Azure Monitor'],
    checkpoint: 'NOC shift lead promotes each wave',
    guardrails: ['Production only inside approved window', 'Auto-pause on KPI breach', 'Pre-staged rollback'],
    kpi: 'Voice outages per quarter',
  },
  {
    name: 'Compliance Agent',
    purpose: 'Verify remediation, update CMDB, assemble audit evidence and capture lessons learned.',
    inputs: ['Scanner results', 'Change record', 'Test and KPI evidence'],
    outputs: ['Evidence pack', 'CMDB updates', 'Knowledge-base entries'],
    tools: ['Tenable / Qualys API', 'ServiceNow API', 'Purview'],
    checkpoint: 'Compliance officer approves closure',
    guardrails: ['Immutable evidence store', 'Closure requires clean re-scan'],
    kpi: 'Patch compliance',
  },
  {
    name: 'Supervisor Agent',
    purpose: 'Orchestrate the specialist agents, track workflow state and enforce policy.',
    inputs: ['All agent outputs', 'Policy rules', 'Autonomy level'],
    outputs: ['Workflow state', 'Escalations', 'Audit entries'],
    tools: ['Azure AI Foundry orchestration', 'Policy engine'],
    checkpoint: 'Escalates to the owning role on low confidence',
    guardrails: ['Least-privilege tool access per agent', 'Full audit trail'],
    kpi: 'MTTR',
  },
];
