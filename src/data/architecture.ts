export interface ArchNode {
  id: string;
  label: string;
  description: string;
  detail: string[];
  // steps (1–9 lifecycle) at which a human must approve this component's output
  humanStepsAffected?: number[];
}

export interface ArchLayer {
  id: string;
  name: string;
  color: string;
  nodes: ArchNode[];
}

export const archLayers: ArchLayer[] = [
  {
    id: 'sources',
    name: 'Sources',
    color: '#38bdf8',
    nodes: [
      { id: 'nvd', label: 'NVD', description: 'National Vulnerability Database feed – baseline CVE and CVSS data.', detail: ['Polled continuously via API 2.0', 'CPE configuration used for asset matching'] },
      { id: 'kev', label: 'CISA KEV', description: 'Known Exploited Vulnerabilities catalogue; strongest signal for emergency changes.', detail: ['KEV listing triggers priority workflow'] },
      { id: 'epss', label: 'EPSS', description: 'Exploit Prediction Scoring System probability for each CVE.', detail: ['Refreshed daily', 'Input to contextual risk score'] },
      { id: 'psirt', label: 'Vendor PSIRTs', description: 'Cisco, Oracle, Ribbon and Microsoft security advisories.', detail: ['Fixed-in versions and workarounds', 'Parsed from CSAF / RSS / HTML'] },
      { id: 'mdti', label: 'Defender Threat Intelligence', description: 'Microsoft Defender Threat Intelligence for exploit activity and actor context.', detail: ['Enriches exploit likelihood'] },
      { id: 'scanners', label: 'Tenable / Qualys', description: 'Vulnerability scanners providing authenticated findings and re-scan evidence.', detail: ['Used for closure verification'] },
      { id: 'cmdb', label: 'CMDB (ServiceNow)', description: '3,800 CIs with relationships to services and customers.', detail: ['Reconciled with live inventory by Impact Agent'] },
      { id: 'netbox', label: 'NetBox / firmware DB', description: 'Network inventory, configuration and firmware baselines.', detail: ['Source of truth for SBC firmware versions'] },
      { id: 'telemetry', label: 'Voice KPIs / telemetry', description: 'ASR, NER, PDD, MOS and registration success from SBCs and probes.', detail: ['Used for canary guardrails'] },
    ],
  },
  {
    id: 'data',
    name: 'Data & integration',
    color: '#818cf8',
    nodes: [
      { id: 'eh', label: 'Azure Event Hubs', description: 'Streaming ingestion of advisories, scanner findings and telemetry.', detail: ['Decouples sources from agents'] },
      { id: 'adf', label: 'Azure Data Factory', description: 'Batch pipelines for CMDB, NetBox and scanner extracts.', detail: ['Scheduled reconciliation'] },
      { id: 'fabric', label: 'Microsoft Fabric (OneLake)', description: 'Unified lakehouse for vulnerability, asset and KPI data.', detail: ['Basis for dashboards and KPI computation'] },
      { id: 'aisearch', label: 'Azure AI Search', description: 'Vector + keyword index over vendor docs, MOPs and past changes.', detail: ['Grounding for Mitigation and Change agents'] },
    ],
  },
  {
    id: 'intel',
    name: 'Intelligence',
    color: '#a78bfa',
    nodes: [
      { id: 'foundry', label: 'Azure AI Foundry agents', description: 'Intake, Impact, Risk, Mitigation, Change, Test, Deploy and Compliance agents.', detail: ['Each agent has scoped tools and guardrails'], humanStepsAffected: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { id: 'supervisor', label: 'Supervisor agent', description: 'Orchestrates the agents, tracks workflow state and enforces policy.', detail: ['Escalates to humans on low confidence'] },
      { id: 'graph', label: 'Blast-radius graph', description: 'Graph of SBCs, trunks, tenants, seats and E911 routes.', detail: ['Answers "who is affected?" in seconds'] },
      { id: 'sentinel', label: 'Sentinel + Security Copilot', description: 'SOC correlation: exploitation attempts against affected SBCs.', detail: ['Escalates active exploitation to SOC'] },
    ],
  },
  {
    id: 'action',
    name: 'Action & automation',
    color: '#34d399',
    nodes: [
      { id: 'snow', label: 'ServiceNow Change', description: 'Change records, approvals and CMDB updates.', detail: ['Emergency / standard change templates'], humanStepsAffected: [5] },
      { id: 'pipelines', label: 'Azure DevOps / GitHub Actions', description: 'Pipelines for config-as-code and firmware deployment.', detail: ['Policy gates before production'], humanStepsAffected: [8] },
      { id: 'ansible', label: 'Ansible / NSO', description: 'Applies SBC config, ACLs and firmware upgrades.', detail: ['Idempotent, with pre-staged rollback'], humanStepsAffected: [4, 8] },
      { id: 'harness', label: 'Test automation harness', description: 'Executes SIP call-flow, codec, failover and E911 test cases.', detail: ['214+ cases per CVE'], humanStepsAffected: [6] },
      { id: 'twin', label: 'Lab digital twin', description: 'Production-faithful SBC lab for pre-change validation.', detail: ['Mirrors config and routing'], humanStepsAffected: [7] },
    ],
  },
  {
    id: 'human',
    name: 'Human-in-the-loop',
    color: '#fbbf24',
    nodes: [
      { id: 'teams', label: 'Teams adaptive-card approvals', description: 'Approvers act in Teams – CAB approval in minutes, not days.', detail: ['Full audit trail'], humanStepsAffected: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { id: 'copilot', label: 'Copilot for NOC / SOC analysts', description: 'Conversational access to impact, status and KPIs.', detail: ['"Which E911 customers are still exposed?"'] },
    ],
  },
  {
    id: 'gov',
    name: 'Governance',
    color: '#f472b6',
    nodes: [
      { id: 'entra', label: 'Entra ID', description: 'Identity and role-based access for people and agents.', detail: ['Managed identities per agent'] },
      { id: 'kv', label: 'Key Vault', description: 'Secrets and certificates for device and API access.', detail: ['No secrets in prompts'] },
      { id: 'purview', label: 'Purview', description: 'Data classification and lineage.', detail: ['Customer data governance'] },
      { id: 'monitor', label: 'Azure Monitor', description: 'Observability for agents and pipelines.', detail: ['Alerts on agent failures and drift'] },
      { id: 'audit', label: 'Agent audit trail', description: 'Immutable log of agent decisions, tools called and approvals.', detail: ['Feeds evidence packs'] },
      { id: 'rai', label: 'Responsible AI guardrails', description: 'No production change without human approval; policy-as-code risk thresholds.', detail: ['Content safety and grounding checks'] },
    ],
  },
];

export interface AutonomyLevel {
  level: number;
  name: string;
  description: string;
  // lifecycle stage ids that need human approval at this level
  humanStages: number[];
}

export const autonomyLevels: AutonomyLevel[] = [
  { level: 1, name: 'L1 – Assist', description: 'Agents recommend; humans perform and approve every step.', humanStages: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  { level: 2, name: 'L2 – Co-pilot', description: 'Agents prepare artefacts and execute read-only work; humans approve every decision gate.', humanStages: [3, 4, 5, 6, 7, 8, 9] },
  { level: 3, name: 'L3 – Supervised', description: 'Agents execute lab work and canary waves; humans approve risk, plan and production promotion.', humanStages: [3, 5, 8] },
  { level: 4, name: 'L4 – Autonomous (low-risk)', description: 'Low-risk CVEs inside policy thresholds are remediated end to end; humans approve exceptions and emergency changes.', humanStages: [5] },
];
