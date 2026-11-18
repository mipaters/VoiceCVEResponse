export interface PainResolution {
  pain: string; // must match a currentProcess painPoint exactly
  agent: string;
  how: string;
}

export interface AiStage {
  id: number;
  agents: string[];
  actions: string[];
  human: string | null; // null = no human gate
  humanNote?: string;
  kpi?: string;
  aiSentiment: number; // illustrative
  resolutions: PainResolution[];
}

export const aiStages: AiStage[] = [
  {
    id: 1,
    agents: ['Intake Agent'],
    actions: [
      'Ingests NVD, CISA KEV, EPSS and vendor PSIRTs 24x7',
      'Dedupes alarms and correlates with scanner findings',
      'Suppresses noise to handle the rising event frequency',
    ],
    human: null,
    humanNote: 'None (auto-triage), with alerts to the security lead',
    aiSentiment: 3,
    resolutions: [
      { pain: 'Alarms / CVE', agent: 'Intake Agent', how: 'Deduped and correlated with scanner findings' },
      { pain: 'Increasing frequency of events', agent: 'Intake Agent', how: 'Noise suppressed; only actionable events surface' },
    ],
  },
  {
    id: 2,
    agents: ['Asset Discovery Agent', 'Assessment Agent', 'Brief Agent'],
    actions: [
      'Builds a unified asset / software inventory across the 27 apps and on-prem private cloud (CMDB + hypervisor/VM inventory + package manifests + scanners)',
      'Collects OS and package versions through read-only automation (Ansible / agents) in parallel – no manual log-ins',
      'Checks whether the vulnerable component is actually in use',
      'Captures tribal knowledge in a knowledge graph (app → owner → infra → dependencies)',
      'Brief Agent auto-drafts the Development Assessment Brief + exec summary of exposure',
    ],
    human: 'Jay reviews and approves in Teams',
    kpi: '2–3 hrs → <10 min to find what\'s impacted',
    aiSentiment: 2,
    resolutions: [
      { pain: 'Ops owns 27 apps, different infra environments', agent: 'Asset Discovery Agent', how: 'One unified inventory across all 27 apps and environments' },
      { pain: 'Fragmented process, data, tribal knowledge', agent: 'Asset Discovery Agent', how: 'Knowledge graph: app → owner → infra → dependencies' },
      { pain: 'Human error can happen – engineers are app specialists, not security experts', agent: 'Assessment Agent', how: 'Version and usage checks run by read-only automation, not by hand' },
      { pain: '95% on-prem private cloud', agent: 'Asset Discovery Agent', how: 'Read-only connectors reach on-prem / private cloud (Azure Arc, Ansible)' },
      { pain: '2–3 hrs to find what\'s impacted', agent: 'Assessment Agent', how: 'Parallel collection – target < 10 min' },
      { pain: 'Discovery / system knowledge scattered', agent: 'Asset Discovery Agent', how: 'CMDB, hypervisor/VM inventory, manifests and scanners merged' },
    ],
  },
  {
    id: 3,
    agents: ['Risk Agent'],
    actions: [
      'Contextual score: CVSS + EPSS + KEV + public-facing exposure + business criticality',
      'Maps affected packages to application owners automatically',
      'Flags project delivery impact',
    ],
    human: 'Application owners confirm via Teams',
    aiSentiment: 2,
    resolutions: [
      { pain: 'Identify software packages at risk', agent: 'Risk Agent', how: 'Package-level match from the unified inventory' },
      { pain: 'Application owners across Jay\'s org – tribal knowledge', agent: 'Risk Agent', how: 'Owners resolved from the knowledge graph and asked in Teams' },
      { pain: 'Delays to projects', agent: 'Risk Agent', how: 'Project delivery impact flagged up front' },
      { pain: 'Evaluate vulnerability exposure', agent: 'Risk Agent', how: 'Contextual score with factor breakdown' },
      { pain: 'Potential impact – public-facing exposure', agent: 'Risk Agent', how: 'Public-facing exposure is a scored factor' },
    ],
  },
  {
    id: 4,
    agents: ['Mitigation Agent'],
    actions: [
      'Recommends mitigation vs remediation',
      'Drafts the step-by-step plan grounded in vendor advisories and past changes',
      'Auto-drafts the vendor engagement (case details, contract / support entitlement lookup across multiple vendors)',
      'Checks version compatibility before upgrading',
      'Replaces "email + action plan" with a structured plan',
    ],
    human: 'Jay / engineering lead approves',
    aiSentiment: 2,
    resolutions: [
      { pain: 'Depends on level of criticality / high impact', agent: 'Mitigation Agent', how: 'Option ranking driven by the contextual risk score' },
      { pain: 'Multiple vendors, contracts', agent: 'Mitigation Agent', how: 'Entitlement lookup and vendor case auto-drafted' },
      { pain: 'Output: email + action plan', agent: 'Mitigation Agent', how: 'Structured, step-by-step plan' },
      { pain: 'Mitigation or remediation?', agent: 'Mitigation Agent', how: 'Recommendation with pros, cons and rollback' },
    ],
  },
  {
    id: 5,
    agents: ['Scheduling Agent'],
    actions: [
      'Picks lab and change windows by impact level and SME availability',
      'Cuts after-hours / weekend work by pre-staging and automating validation runs',
    ],
    human: null,
    humanNote: 'Window proposed; SMEs notified by the Coordinator Agent',
    aiSentiment: 1,
    resolutions: [
      { pain: 'Timing & level of impact', agent: 'Scheduling Agent', how: 'Windows chosen by impact level and SME availability' },
      { pain: 'After hours, weekends', agent: 'Scheduling Agent', how: 'Pre-staged, automated validation runs' },
    ],
  },
  {
    id: 6,
    agents: ['Deploy Agent', 'Test Agent'],
    actions: [
      'Automated code deploy to lab assets',
      'Test Agent generates and runs regression tests and compares before / after',
    ],
    human: null,
    humanNote: 'Fix proposals go to the engineering lead',
    aiSentiment: 3,
    resolutions: [],
  },
  {
    id: 7,
    agents: ['Change Agent', 'Deploy Agent'],
    actions: [
      'Auto-generates the change ticket, MOP, rollback and approvals routing with time-of-day / window rules',
      'Staged rollout with health checks and auto-pause',
      'Lab-failure prediction: lab results feed back so fewer production failures loop back to the lab',
    ],
    human: 'CAB / approvers approve in Teams; engineer executes or supervises',
    aiSentiment: 2,
    resolutions: [
      { pain: 'Failures go back to lab', agent: 'Test Agent', how: 'Lab regression + failure prediction catch issues before production' },
    ],
  },
  {
    id: 8,
    agents: ['Compliance Agent'],
    actions: [
      'Automated re-scan, transaction / health reporting',
      'Version management and CMDB updates',
      'Auto-drafted post-mortem / incident report and documentation',
    ],
    human: null,
    humanNote: 'Closure brief shared with the security lead',
    aiSentiment: 3,
    resolutions: [],
  },
];

export const coordinatorAgent = {
  name: 'Coordinator Agent',
  actions: [
    'Assigns the right SMEs per stage',
    'Posts status updates and leadership briefs to Teams automatically',
    'Produces the "actions taken on mitigation" brief at closure',
  ],
};
