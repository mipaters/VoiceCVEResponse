// Scenario walkthrough – illustrative CVE ID, built on the customer's 8-stage process.
import { scenarioFacts as f } from './kpis';

export type Tone = 'good' | 'warn' | 'bad' | 'neutral';

export interface Wave {
  name: string;
  apps: string;
  availability: number;
  errorRate: number;
  p95: number;
  status: 'green' | 'paused' | 'resumed';
  note?: string;
}

export type Artefact =
  | { kind: 'kv'; title: string; rows: [string, string, Tone?][] }
  | { kind: 'table'; title: string; columns: string[]; rows: string[][]; toneCol?: number }
  | { kind: 'score'; title: string; total: number; verdict: string; factors: { label: string; value: number; max: number; note: string }[] }
  | { kind: 'doc'; title: string; lines: string[] }
  | { kind: 'canary'; title: string; waves: Wave[] }
  | { kind: 'checklist'; title: string; items: string[] };

export interface Decision {
  prompt: string;
  approve: string;
  modify: string;
  reject: string;
  approveOutcome: string;
  modifyOutcome: string;
  rejectOutcome: string;
  approver: string;
}

export interface ScenarioStep {
  id: number;
  stageId: number; // 1–8 in the customer's process
  stageName: string;
  loopBack?: boolean;
  time: string;
  title: string;
  agent: string;
  summary: string;
  log: string[];
  decision?: Decision;
  autoNote?: string;
  artefacts: Artefact[];
  today: { days: string; people: string; detail: string };
}

export const scenarioTitle =
  'Critical heap overflow in a common package – OpenSSL 3.x (illustrative CVE-2026-31337, CVSS 9.1, on CISA KEV) hitting several of the 27 on-prem / private-cloud applications';

export const scenarioSteps: ScenarioStep[] = [
  {
    id: 1,
    stageId: 1,
    stageName: 'Identify Incident',
    time: 'T+0:08',
    title: 'Alarm triaged automatically',
    agent: 'Intake Agent',
    summary: 'Five alarms and two scanner findings collapse into one actionable event.',
    log: [
      'poll cisa-kev → new entry CVE-2026-31337 (OpenSSL 3.0.0–3.0.15)',
      'fetch nvd + vendor PSIRTs → CVSS 9.1, heap overflow in TLS handshake; fixed in 3.0.17',
      'fetch epss → 0.91',
      'dedupe → merged 5 alarms (NVD, 2 vendor PSIRTs, 2 scanner alerts) into 1 event',
      'correlate scanner findings → 14 hosts flagged across 4 environments',
      'suppress → 11 low-signal alarms for the same package grouped under this event',
      'notify → security lead alerted (auto-triage, no approval needed)',
    ],
    autoNote: 'No human gate – auto-triage, with an alert to the security lead.',
    artefacts: [
      {
        kind: 'kv',
        title: 'Triaged event (illustrative)',
        rows: [
          ['CVE', f.cveId, 'bad'],
          ['CVSS v3.1', `${f.cvss} (Critical)`, 'bad'],
          ['CISA KEV', 'Yes', 'bad'],
          ['EPSS', '0.91', 'bad'],
          ['Alarms merged', '5 → 1', 'good'],
          ['Noise suppressed', '11 alarms', 'good'],
        ],
      },
    ],
    today: { days: '~1 day', people: '2 people', detail: 'Alarms and CVE emails arrive separately, with rising event frequency each month.' },
  },
  {
    id: 2,
    stageId: 2,
    stageName: 'Assessment',
    time: 'T+0:25',
    title: 'Impact found in minutes, brief drafted',
    agent: 'Asset Discovery + Assessment + Brief Agents',
    summary: `Unified inventory finds ${f.appsAffected} of ${f.appsTotal} apps with the affected package in 8 minutes – no manual log-ins.`,
    log: [
      'asset-discovery → merge cmdb + hypervisor/VM inventory + package manifests + scanners',
      'cmdb gaps → 6 hosts found that are missing from the CMDB',
      'assessment → read-only Ansible collection, 64 hosts in parallel (OS + package versions)',
      `assessment → ${f.appsAffected} apps on affected OpenSSL; ${f.appsInUse} actually load the vulnerable library`,
      `knowledge graph → owners, infra and dependencies resolved for ${f.appsAffected} apps`,
      'result delivered in 8 min (assessment-only time today: 2–3 hrs)',
      'brief-agent → Development Assessment Brief + exec summary of exposure drafted',
    ],
    decision: {
      prompt: 'Jay: review the assessment brief and exec summary of exposure?',
      approve: 'Approve brief',
      modify: 'Modify – add app C to scope',
      reject: 'Reject – re-collect',
      approveOutcome: 'Brief approved in Teams and shared with application owners.',
      modifyOutcome: 'Agent re-checked the added app: one more host in scope; brief regenerated.',
      rejectOutcome: 'Agent would re-run collection with Jay\'s feedback. (Demo continues on the approved path.)',
      approver: 'Jay (in Teams)',
    },
    artefacts: [
      {
        kind: 'kv',
        title: 'Assessment brief – exposure summary',
        rows: [
          ['Applications affected', `${f.appsAffected} of ${f.appsTotal}`, 'warn'],
          ['Actually using vulnerable component', String(f.appsInUse), 'bad'],
          ['Public-facing apps', String(f.appsPublicFacing), 'bad'],
          ['Hosts assessed', String(f.hosts), 'neutral'],
          ['Time to find what\'s impacted', '8 min (vs 2–3 hrs)', 'good'],
          ['CMDB gaps found', '6 hosts', 'warn'],
        ],
      },
      {
        kind: 'table',
        title: 'Affected applications (illustrative)',
        columns: ['Application', 'Environment', 'OpenSSL', 'In use', 'Exposure'],
        rows: [
          ['Customer Portal', 'Private cloud A', '3.0.12', 'Yes', 'Public-facing'],
          ['Partner API Gateway', 'Private cloud B', '3.0.14', 'Yes', 'Public-facing'],
          ['Self-service Web', 'On-prem DC1', '3.0.13', 'Yes', 'Public-facing'],
          ['Billing Mediation', 'On-prem DC1', '3.0.11', 'Yes', 'Internal'],
          ['Order Management', 'Private cloud A', '3.0.15', 'Yes', 'Internal'],
          ['Reporting Hub', 'On-prem DC2', '3.0.10', 'Yes', 'Internal'],
          ['Provisioning Engine', 'On-prem DC2', '3.0.12', 'Yes', 'Internal'],
          ['Archive Service', 'On-prem DC2', '3.0.9', 'No', 'Internal'],
          ['Test Harness', 'Private cloud B', '3.0.11', 'No', 'Internal'],
        ],
        toneCol: 4,
      },
    ],
    today: { days: '~4 days', people: '3 people', detail: '2–3 hrs just to find what\'s impacted per CVE, with manual log-ins and knowledge scattered across teams.' },
  },
  {
    id: 3,
    stageId: 3,
    stageName: 'Risk',
    time: 'T+2:00',
    title: 'Contextual risk and owner confirmation',
    agent: 'Risk Agent',
    summary: 'Packages at risk mapped to owners; public-facing exposure scored; project impact flagged.',
    log: [
      'load cvss=9.1, epss=0.91, kev=true',
      `exposure → ${f.appsPublicFacing} public-facing apps reachable from the internet`,
      'criticality → Customer Portal and Partner API Gateway are tier-1',
      'owners → mapped 9 apps to 6 owners via the knowledge graph; Teams cards sent',
      'delivery impact → 2 in-flight projects share affected hosts; flagged',
      `score → ${f.riskScore}/100`,
    ],
    decision: {
      prompt: 'Application owners: confirm the risk score and affected scope?',
      approve: 'Confirm in Teams',
      modify: 'Modify – lower criticality of Reporting Hub',
      reject: 'Reject score',
      approveOutcome: '6 of 6 owners confirmed in under 90 minutes.',
      modifyOutcome: 'Reporting Hub criticality lowered; overall score unchanged (91).',
      rejectOutcome: 'Score challenge logged; the agent shows factor weights. (Demo continues on the approved path.)',
      approver: 'Application owners',
    },
    artefacts: [
      {
        kind: 'score',
        title: 'Contextual risk score',
        total: f.riskScore,
        verdict: 'High priority – act within the week',
        factors: [
          { label: 'CVSS base', value: 23, max: 25, note: '9.1 – network, no user interaction' },
          { label: 'Exploit likelihood (EPSS)', value: 17, max: 20, note: 'EPSS 0.91' },
          { label: 'CISA KEV', value: 15, max: 15, note: 'Exploited in the wild' },
          { label: 'Public-facing exposure', value: 18, max: 20, note: '3 public-facing apps' },
          { label: 'Compensating controls', value: 8, max: 10, note: 'WAF on 2 of 3' },
          { label: 'Business criticality', value: 10, max: 10, note: 'Two tier-1 apps' },
        ],
      },
    ],
    today: { days: '~3 days', people: '6 people', detail: 'Application owners across Jay\'s org chased one by one; tribal knowledge decides who owns what.' },
  },
  {
    id: 4,
    stageId: 4,
    stageName: 'Develop Strategy',
    time: 'T+1d',
    title: 'Mitigation vs remediation plan',
    agent: 'Mitigation Agent',
    summary: 'Interim mitigation for public-facing apps, remediation by upgrade; vendor engagement drafted.',
    log: [
      'search ai-search → vendor advisories, 5 past OpenSSL upgrades, 2 past vendor cases',
      'option A → mitigation: restrict affected TLS feature + WAF rule on public-facing apps',
      'option B → remediation: upgrade to OpenSSL 3.0.17 via vendor-packaged builds',
      'recommend → A now for 3 public-facing apps, then B for all 7 in-use apps',
      'entitlements → 2 vendors identified; support contracts verified; cases pre-filled',
      'compatibility → 168 regression cases selected; 1 vendor build needs a config change',
    ],
    decision: {
      prompt: 'Jay / engineering lead: approve the structured plan (replaces "email + action plan")?',
      approve: 'Approve plan',
      modify: 'Modify – remediation only',
      reject: 'Reject plan',
      approveOutcome: 'Plan approved; vendor cases opened and interim mitigation scheduled.',
      modifyOutcome: 'Remediation-only plan keeps the 3 public-facing apps exposed longer; the agent shows the added exposure.',
      rejectOutcome: 'Agent re-plans with feedback. (Demo continues on the approved path.)',
      approver: 'Jay / engineering lead',
    },
    artefacts: [
      {
        kind: 'table',
        title: 'Mitigation or remediation?',
        columns: ['Option', 'Scope', 'Pros', 'Cons / risk'],
        rows: [
          ['A. Mitigation', '3 public-facing apps', 'Fast, reversible', 'Not a permanent fix'],
          ['B. Remediation (upgrade)', '7 in-use apps', 'Permanent fix', 'Needs lab validation and windows'],
        ],
      },
      {
        kind: 'doc',
        title: 'Vendor engagement (auto-drafted)',
        lines: [
          'Vendors: 2 (OS vendor, middleware vendor) – support entitlement confirmed for both.',
          'Case summary: CVE-2026-31337, OpenSSL 3.0.x, 7 hosts per vendor, requested fixed build.',
          'Attachments: package inventory, config diff, test plan.',
        ],
      },
    ],
    today: { days: '~6 days', people: '5 people', detail: 'Multiple vendors and contracts; output is an email plus an action plan; depends on criticality.' },
  },
  {
    id: 5,
    stageId: 5,
    stageName: 'Validation for Lab',
    time: 'T+2d',
    title: 'Lab and change windows scheduled',
    agent: 'Scheduling Agent',
    summary: 'Windows picked by impact and SME availability; validation pre-staged to avoid after-hours work.',
    log: [
      'impact level → tier-1 apps first, internal apps second',
      'sme calendars → 4 SMEs available Wed–Thu business hours',
      'lab capacity → 2 slots free; remaining apps queued',
      'pre-stage → lab images and test data prepared automatically',
      'plan → validation runs overnight unattended; reviewed in business hours',
      'notify → Coordinator Agent posts schedule to Teams',
    ],
    autoNote: 'No human gate – window proposed, SMEs notified by the Coordinator Agent.',
    artefacts: [
      {
        kind: 'kv',
        title: 'Schedule proposal',
        rows: [
          ['Lab slots', 'Wed 09:00, Thu 09:00', 'good'],
          ['Production windows', 'Next Tue/Wed business hours', 'good'],
          ['After-hours / weekend work', '0 planned (vs 14 h today)', 'good'],
          ['SMEs assigned', '4 (via Coordinator Agent)', 'neutral'],
        ],
      },
    ],
    today: { days: '~4 days', people: '4 people', detail: 'Timing and level of impact negotiated by hand; work lands after hours and on weekends.' },
  },
  {
    id: 6,
    stageId: 6,
    stageName: 'Integrate into Lab',
    time: 'T+3d',
    title: 'Lab deploy – Test Agent catches 3 failures',
    agent: 'Deploy Agent + Test Agent',
    summary: `Code deployed to lab assets automatically; ${f.labFailures} of ${f.labTests} regression tests fail before production.`,
    log: [
      'deploy-agent → OpenSSL 3.0.17 builds deployed to 7 lab assets',
      `test-agent → generated and ran ${f.labTests} regression cases (TLS, auth, batch jobs, integrations)`,
      `result → ${f.labTests - f.labFailures} pass, ${f.labFailures} fail`,
      'failure 1–2 → Billing Mediation: legacy provider no longer loaded by default',
      'failure 3 → Partner API Gateway: older partner client fails on cipher negotiation',
      'compare before/after → latency and error rate otherwise within ±2%',
      'block → promotion to production blocked automatically',
    ],
    autoNote: 'No human gate – the failure is caught in the lab; fix proposals go to the engineering lead next.',
    artefacts: [
      {
        kind: 'table',
        title: 'Lab regression – run 1',
        columns: ['Application', 'Cases', 'Passed', 'Failed', 'Cause'],
        rows: [
          ['Billing Mediation', '34', '32', '2', 'Legacy provider not loaded'],
          ['Partner API Gateway', '28', '27', '1', 'Cipher negotiation, older client'],
          ['Other 5 apps', '106', '106', '0', '–'],
          ['Total', String(f.labTests), String(f.labTests - f.labFailures), String(f.labFailures), 'Blocked before production'],
        ],
      },
    ],
    today: { days: '~3 days', people: '4 people', detail: 'Manual deploy and manual test cases; issues often surface later in production.' },
  },
  {
    id: 7,
    stageId: 6,
    stageName: 'Integrate into Lab',
    loopBack: true,
    time: 'T+4d',
    title: 'Loop back to lab – fix and re-test',
    agent: 'Test Agent + Mitigation Agent',
    summary: 'Loop-back stays in the lab: config fixes proposed, applied and re-tested; production untouched.',
    log: [
      'root cause → Billing Mediation relies on the OpenSSL legacy provider',
      'propose → explicit legacy-provider load in the app config; keep cipher list for the partner profile',
      'apply to lab assets and re-run the failed + related cases',
      `re-test → ${f.labTests}/${f.labTests} pass; latency and error rate within ±2%`,
      'lab-failure prediction → pattern stored: "OpenSSL 3.0.x upgrade → check legacy provider"',
      'update MOP v2 and plan with the config changes',
    ],
    decision: {
      prompt: 'Engineering lead: approve the config fixes for production?',
      approve: 'Approve fixes',
      modify: 'Modify – retire partner cipher later',
      reject: 'Reject fixes',
      approveOutcome: 'Fixes merged into MOP v2. A production failure loop-back is avoided.',
      modifyOutcome: 'Cipher retirement ticketed with the partner; fix still approved for this change.',
      rejectOutcome: 'Production deploy stays blocked. (Demo continues on the approved path.)',
      approver: 'Engineering lead',
    },
    artefacts: [
      {
        kind: 'table',
        title: 'Lab regression – run 2 (after fix)',
        columns: ['Run', 'Executed', 'Passed', 'Failed', 'Notes'],
        rows: [
          ['Run 1', String(f.labTests), String(f.labTests - f.labFailures), String(f.labFailures), 'Caught in lab'],
          ['Run 2', String(f.labTests), String(f.labTests), '0', 'All green; deltas within ±2%'],
        ],
      },
    ],
    today: { days: '~7 days', people: '5 people', detail: 'When this is found in production, "failures go back to lab" and the whole change repeats.' },
  },
  {
    id: 8,
    stageId: 7,
    stageName: 'Deploy into Production',
    time: 'T+5d',
    title: 'Change ticket, approvals and staged rollout',
    agent: 'Change Agent + Deploy Agent',
    summary: 'Change ticket, MOP and rollback generated; approved in Teams; staged rollout with health checks.',
    log: [
      'change-agent → create ticket CHG0031337 with risk, impact, MOP v2, rollback',
      'approvals routing → CAB, Jay, 3 application owners; time-of-day rules applied',
      'teams cards → 5/5 approved in 40 min',
      'rollout wave 1 → 3 public-facing apps; health checks green',
      'rollout wave 2 → 2 tier-1 internal apps; health checks green',
      'rollout wave 3 → remaining 2 apps; health checks green',
      'coordinator → status posted to Teams after each wave',
    ],
    decision: {
      prompt: 'CAB / approvers: approve the change in Teams (engineer executes or supervises)?',
      approve: 'Approve in Teams',
      modify: 'Modify – move wave 3 to next window',
      reject: 'Reject change',
      approveOutcome: 'Approved; engineer supervised the staged rollout – no failures sent back to lab.',
      modifyOutcome: 'Wave 3 moved to the next business-hours window; waves 1–2 proceed.',
      rejectOutcome: 'Change returns to draft with comments. (Demo continues on the approved path.)',
      approver: 'CAB / approvers',
    },
    artefacts: [
      {
        kind: 'kv',
        title: 'CHG0031337 – generated change',
        rows: [
          ['Risk', 'Medium (validated in lab, staged rollout)', 'warn'],
          ['Approvals', '5 of 5 in 40 min', 'good'],
          ['MOP / rollback', 'Generated (v2)', 'good'],
          ['Window rules', 'Business hours, time-of-day enforced', 'neutral'],
        ],
      },
      {
        kind: 'canary',
        title: 'Staged rollout health',
        waves: [
          { name: 'Wave 1', apps: '3 public-facing apps', availability: 99.98, errorRate: 0.2, p95: 182, status: 'green' },
          { name: 'Wave 2', apps: '2 tier-1 internal apps', availability: 99.97, errorRate: 0.3, p95: 210, status: 'green' },
          { name: 'Wave 3', apps: '2 remaining apps', availability: 99.99, errorRate: 0.2, p95: 175, status: 'green' },
        ],
      },
    ],
    today: { days: '~7 days', people: '8 people', detail: 'MOP created by hand; approval process, tickets and time-of-day coordinated manually.' },
  },
  {
    id: 9,
    stageId: 8,
    stageName: 'Validation',
    time: 'T+7d',
    title: 'Validation, documentation and closure brief',
    agent: 'Compliance Agent + Coordinator Agent',
    summary: 'Re-scan confirms no impact; CMDB updated; post-mortem and "actions taken on mitigation" brief drafted.',
    log: [
      'compliance → re-scan all 9 affected apps: CVE-2026-31337 not detected',
      'reporting → transaction and health reports compared with baseline: no impact',
      'cmdb → versions updated; 6 missing hosts added',
      'documentation → design docs and version management updated',
      'post-mortem → incident report auto-drafted',
      'coordinator → "actions taken on mitigation" brief posted to Teams for leadership',
    ],
    autoNote: 'No human gate – closure brief shared with the security lead and leadership.',
    artefacts: [
      {
        kind: 'checklist',
        title: 'Closure pack',
        items: [
          'Re-scan: 9 of 9 apps clean',
          'Transaction / health report – no impact',
          'CMDB updated (+6 hosts)',
          'Design documents and versions updated',
          'Post-mortem incident report (drafted)',
          'Leadership brief – actions taken on mitigation',
        ],
      },
    ],
    today: { days: '~2 days', people: '4 people', detail: 'Scanner re-run, manual test cases, documentation and post-mortem written afterwards.' },
  },
];
