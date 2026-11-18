// Scenario walkthrough data – all CVE identifiers are fictional / illustrative.
import { scenarioFacts as f } from './kpis';

export type Tone = 'good' | 'warn' | 'bad' | 'neutral';

export interface Wave {
  name: string;
  nodes: string;
  asr: number;
  mos: number;
  pdd: number;
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

export interface ScenarioStep {
  id: number;
  time: string;
  title: string;
  agent: string;
  summary: string;
  log: string[];
  decision: {
    prompt: string;
    approve: string;
    modify: string;
    reject: string;
    approveOutcome: string;
    modifyOutcome: string;
    rejectOutcome: string;
    approver: string;
  };
  artefacts: Artefact[];
  today: { days: string; people: string; detail: string };
}

export const scenarioTitle =
  'Critical SIP pre-auth RCE in SBC firmware (illustrative CVE-2026-41877, CVSS 9.8, added to CISA KEV)';

export const scenarioSteps: ScenarioStep[] = [
  {
    id: 1,
    time: 'T+0:12',
    title: 'Intake & normalisation',
    agent: 'Intake Agent',
    summary: 'KEV listing detected 12 minutes after publication; advisory normalised and matched to the voice estate.',
    log: [
      'poll cisa-kev → new entry CVE-2026-41877 (added 2026-03-10T02:14Z)',
      'fetch nvd/2.0 → CVSS 9.8 AV:N/AC:L/PR:N/UI:N, CWE-121 stack overflow in SIP INVITE parser',
      'fetch vendor-psirt (Ribbon / Oracle SBC) → fixed in firmware 9.4.2p3; workaround: SIP header size limit',
      'dedupe → merged 3 duplicate advisories (NVD, PSIRT, mailing list)',
      'cpe-match → "Session Border Controller firmware < 9.4.2p3" mapped to product family SBC-CORE',
      `flag → ${f.sbcsVulnerable} of ${f.sbcsTotal} SBCs on vulnerable firmware; ${f.sbcsInternetFacing} internet-facing`,
      'notify → #voice-secops Teams channel + on-call analyst paged',
    ],
    decision: {
      prompt: 'Confirm this CVE is in scope and start the response workflow?',
      approve: 'Approve – start workflow',
      modify: 'Modify – widen to Teams edge SBCs',
      reject: 'Reject – out of scope',
      approveOutcome: 'Workflow opened. Impact Agent dispatched.',
      modifyOutcome: 'Scope widened to include Teams Direct Routing edge SBCs. No change to affected count (already included).',
      rejectOutcome: 'Rejected cases are logged with rationale; the agent would keep monitoring for new exploit intel. (Demo continues on the approved path.)',
      approver: 'On-call SecOps analyst',
    },
    artefacts: [
      {
        kind: 'kv',
        title: 'Intake summary (illustrative)',
        rows: [
          ['CVE', f.cveId, 'bad'],
          ['CVSS v3.1', `${f.cvss} (Critical)`, 'bad'],
          ['CISA KEV', 'Yes – exploited in the wild', 'bad'],
          ['EPSS', '0.94 (top 0.5%)', 'bad'],
          ['Vulnerable SBCs', `${f.sbcsVulnerable} of ${f.sbcsTotal}`, 'warn'],
          ['Internet-facing', `${f.sbcsInternetFacing} SBCs`, 'bad'],
        ],
      },
    ],
    today: { days: '~5 days', people: '3 people', detail: 'Analyst notices advisory via email list, a second analyst validates, a third raises the ticket.' },
  },
  {
    id: 2,
    time: 'T+0:45',
    title: 'Impact & blast radius',
    agent: 'Impact Agent',
    summary: 'CMDB, firmware inventory and live config combined into a customer-level blast radius.',
    log: [
      'query cmdb → 3,800 CIs; 41 SBC-related CIs, 3 with stale records',
      'reconcile netbox + live ssh show-version → corrected 3 CIs (2 nodes on older firmware than recorded)',
      'graph traverse sbc → trunk groups → enterprise tenants → seats',
      'join e911-routing table → customers whose emergency calls traverse affected SBCs',
      `result → ${f.customers.toLocaleString()} customers, ${f.seats.toLocaleString()} seats, ${f.e911Customers} E911-dependent`,
      'join billing → monthly recurring revenue exposed',
    ],
    decision: {
      prompt: 'Accept the impact report as the basis for risk scoring?',
      approve: 'Approve report',
      modify: 'Modify – add MVNO wholesale tenants',
      reject: 'Reject – re-run inventory',
      approveOutcome: 'Impact report signed off by NetOps lead.',
      modifyOutcome: 'Wholesale tenants added; agent recomputed – customer count unchanged, seats +2%.',
      rejectOutcome: 'Agent would trigger a live inventory refresh and re-run. (Demo continues on the approved path.)',
      approver: 'NetOps Duty Manager',
    },
    artefacts: [
      {
        kind: 'kv',
        title: 'Blast-radius report',
        rows: [
          ['Enterprise customers', f.customers.toLocaleString(), 'warn'],
          ['Seats affected', f.seats.toLocaleString(), 'warn'],
          ['E911-dependent customers', String(f.e911Customers), 'bad'],
          ['MRR exposed', `$${(f.mrrExposed / 1e6).toFixed(1)}M`, 'bad'],
          ['Data quality fixes', '3 CMDB CIs corrected', 'good'],
        ],
      },
      {
        kind: 'table',
        title: 'Affected SBC clusters (sample)',
        columns: ['Cluster', 'Nodes', 'Exposure', 'Customers', 'E911'],
        rows: [
          ['SBC-EDGE-EAST (Teams DR)', '4', 'Internet-facing', '380', '12'],
          ['SBC-EDGE-WEST (SIP trunking)', '2', 'Internet-facing', '310', '14'],
          ['SBC-CORE-NORTH (IMS peering)', '6', 'Internal', '240', '9'],
          ['SBC-CORE-SOUTH (BroadWorks)', '6', 'Internal', '210', '6'],
        ],
        toneCol: 2,
      },
    ],
    today: { days: '~4 days', people: '4 people', detail: 'Spreadsheet lookups against an incomplete CMDB, chasing regional engineers for firmware versions.' },
  },
  {
    id: 3,
    time: 'T+1:30',
    title: 'Contextual risk scoring',
    agent: 'Risk Agent',
    summary: 'CVSS combined with exploitability, exposure, compensating controls and customer criticality.',
    log: [
      'load cvss=9.8, epss=0.94, kev=true',
      'exposure → 6 internet-facing SBCs, SIP/5061 reachable from public internet',
      'controls → no SIP-aware IPS in front of 4 of 6 edge nodes',
      'criticality → 41 E911 customers + 12 government / healthcare tenants',
      `score → ${f.riskScore}/100 → policy "emergency-change" threshold (≥90) exceeded`,
    ],
    decision: {
      prompt: 'Approve the 96/100 score and the emergency change recommendation?',
      approve: 'Approve – emergency change',
      modify: 'Modify – normal change',
      reject: 'Reject score',
      approveOutcome: 'Emergency change track selected.',
      modifyOutcome: 'Downgrading would breach policy-as-code threshold (≥90); CISO override required. (Demo continues on the approved path.)',
      rejectOutcome: 'Score challenge recorded; agent shows factor weights for review. (Demo continues on the approved path.)',
      approver: 'CISO delegate',
    },
    artefacts: [
      {
        kind: 'score',
        title: 'Contextual risk score',
        total: f.riskScore,
        verdict: 'Emergency change recommended',
        factors: [
          { label: 'CVSS base', value: 25, max: 25, note: '9.8 – network, no auth, no interaction' },
          { label: 'Exploit likelihood (EPSS)', value: 19, max: 20, note: 'EPSS 0.94' },
          { label: 'CISA KEV', value: 15, max: 15, note: 'Exploited in the wild' },
          { label: 'Exposure', value: 18, max: 20, note: '6 internet-facing SBCs' },
          { label: 'Compensating controls', value: 9, max: 10, note: 'Limited SIP IPS coverage' },
          { label: 'Customer criticality', value: 10, max: 10, note: 'E911, government, healthcare' },
        ],
      },
    ],
    today: { days: '~2 days', people: '2 people', detail: 'CVSS-only prioritisation; debate in email about whether the SBCs are really exposed.' },
  },
  {
    id: 4,
    time: 'T+4:00',
    title: 'Mitigation strategy & virtual patch',
    agent: 'Mitigation Agent',
    summary: 'Options grounded in vendor docs and past changes; SIP ACL + header-manipulation rule deployed within 4 hours.',
    log: [
      'search ai-search → vendor PSIRT, 6 prior SBC firmware MOPs, 2 prior SIP header rules',
      'draft option A → SIP ACL restricting 5060/5061 to known carrier and enterprise prefixes',
      'draft option B → header-manipulation rule capping INVITE header length (virtual patch)',
      'draft option C → firmware upgrade 9.4.2p3 (needs lab validation)',
      'recommend → A + B immediately (T+4h), C scheduled for T+5d',
      'generate rollback → config snapshot + one-command revert',
    ],
    decision: {
      prompt: 'Approve the SIP ACL and header-manipulation virtual patch on the 6 internet-facing SBCs?',
      approve: 'Approve virtual patch',
      modify: 'Modify – add carrier allow-list',
      reject: 'Reject – patch only',
      approveOutcome: 'Virtual patch pushed via Ansible to 6 internet-facing SBCs; exposure closed at T+4h.',
      modifyOutcome: 'Carrier allow-list merged; agent re-validated the ACL against live peering prefixes.',
      rejectOutcome: 'Patch-only path would leave the 6 SBCs exposed for 5 more days. (Demo continues on the approved path.)',
      approver: 'NetOps Engineering Lead',
    },
    artefacts: [
      {
        kind: 'table',
        title: 'Mitigation options',
        columns: ['Option', 'Time to apply', 'Pros', 'Cons / risk'],
        rows: [
          ['A. SIP ACL', '1 h', 'Fast, low risk', 'Does not cover unknown peers'],
          ['B. Header-manipulation virtual patch', '4 h', 'Blocks exploit pattern', 'Needs regression on Teams DR'],
          ['C. Firmware 9.4.2p3', '5 d', 'Permanent fix', 'Requires lab, canary, window'],
        ],
      },
    ],
    today: { days: '~6 days', people: '5 people', detail: 'Tribal knowledge; senior engineer on leave; options debated across email and bridge calls.' },
  },
  {
    id: 5,
    time: 'T+4:35',
    title: 'Change request & CAB approval',
    agent: 'Change Agent',
    summary: 'ServiceNow emergency change auto-created and approved in Teams in 35 minutes.',
    log: [
      'create servicenow CHG0041877 (type=Emergency)',
      'attach risk breakdown, impact report, MOP, rollback plan',
      'route approvers → NetOps Director, CISO delegate, Voice Service Owner, Change Manager',
      'post teams adaptive card to CAB channel',
      'approval 1/4 +6 min · 2/4 +14 min · 3/4 +22 min · 4/4 +35 min',
      'schedule firmware window → Tue 00:00–05:00 (T+5d)',
    ],
    decision: {
      prompt: 'CAB approvers: approve the emergency change in Teams?',
      approve: 'Approve in Teams',
      modify: 'Modify – request more testing',
      reject: 'Reject change',
      approveOutcome: 'All four approvers signed – elapsed 35 minutes (vs ~7 days for weekly CAB).',
      modifyOutcome: 'Test scope extended by agent; approval time unchanged.',
      rejectOutcome: 'Change returns to Draft with reviewer comments. (Demo continues on the approved path.)',
      approver: 'CAB (4 approvers)',
    },
    artefacts: [
      {
        kind: 'kv',
        title: 'CHG0041877 – Emergency change',
        rows: [
          ['Type', 'Emergency', 'bad'],
          ['Risk', 'High (mitigated by canary + rollback)', 'warn'],
          ['Impact', `${f.customers.toLocaleString()} customers / ${(f.seats / 1000).toFixed(0)}k seats`, 'warn'],
          ['Approval time', '35 minutes', 'good'],
          ['Window', 'Tue 00:00–05:00', 'neutral'],
        ],
      },
      {
        kind: 'doc',
        title: 'Method of Procedure (excerpt)',
        lines: [
          '1. Verify config snapshot and HA pair status (active/standby in sync).',
          '2. Drain standby node; upgrade to firmware 9.4.2p3; verify SIP registration and TLS.',
          '3. Switch over; upgrade former active; confirm media anchoring and E911 test call.',
          '4. Hold 10 min on KPI guardrails (ASR, PDD, MOS) before next SBC pair.',
          'Rollback: boot previous image slot, restore config snapshot, re-verify (≈ 12 min per node).',
        ],
      },
    ],
    today: { days: '~7 days', people: '8 people', detail: 'Email chains and the weekly CAB; chasing approvers; manual MOP and rollback write-up.' },
  },
  {
    id: 6,
    time: 'T+1d',
    title: 'Test generation & lab deploy',
    agent: 'Test Agent',
    summary: `Regression suite of ${f.testCases} cases generated from SIP call flows, run in the lab digital twin.`,
    log: [
      'generate suite → SIP basic/forked/transfer, codec negotiation, TLS/SRTP, failover, E911, Teams Direct Routing',
      'deploy 9.4.2p3 to lab twin (mirrors SBC-EDGE-EAST config)',
      'baseline KPIs: ASR 99.3%, NER 99.5%, PDD 1.8s, MOS 4.35, registration success 99.9%',
      `execute ${f.testCases} automated cases (~3h 20m)`,
    ],
    decision: {
      prompt: 'Approve the generated test scope?',
      approve: 'Approve scope',
      modify: 'Modify – add SIPREC cases',
      reject: 'Reject scope',
      approveOutcome: 'Suite approved and executing in the lab twin.',
      modifyOutcome: '12 SIPREC recording cases appended; suite is now 226 cases (demo keeps 214 for clarity).',
      rejectOutcome: 'Agent would regenerate with feedback. (Demo continues on the approved path.)',
      approver: 'Voice QA Lead',
    },
    artefacts: [
      {
        kind: 'table',
        title: 'Generated regression suite',
        columns: ['Area', 'Cases'],
        rows: [
          ['SIP signalling & forking', '48'],
          ['Codec negotiation (G.711/G.722/Opus)', '36'],
          ['TLS / SRTP', '32'],
          ['HA failover & survivability', '28'],
          ['E911 test calls', '24'],
          ['Teams Direct Routing / Operator Connect', '30'],
          ['Voicemail / IVR hand-off', '16'],
          [`Total`, String(f.testCases)],
        ],
      },
    ],
    today: { days: '~6 days', people: '4 people', detail: 'Manual test plans; lab slots booked by email; partial coverage of Teams Direct Routing.' },
  },
  {
    id: 7,
    time: 'T+2d',
    title: 'Test results & automated fix',
    agent: 'Test Agent + Mitigation Agent',
    summary: 'Two Teams Direct Routing TLS cipher failures found; agent proposes a config fix; re-test passes.',
    log: [
      `result → ${f.testCases - f.testFailures} pass, ${f.testFailures} fail`,
      'root cause → firmware default removes TLS_ECDHE_RSA_AES256_CBC_SHA384 required by Teams DR',
      'propose → add AES-GCM suite ordering to TLS profile "teams-dr"',
      'apply to lab twin, re-run failed + related cases (14 cases)',
      `re-test → ${f.testCases}/${f.testCases} pass; KPIs within ±0.1 of baseline`,
      'update MOP v2 and CHG0041877 with the TLS profile step',
    ],
    decision: {
      prompt: 'Approve the TLS profile configuration fix for production?',
      approve: 'Approve fix',
      modify: 'Modify – keep legacy cipher too',
      reject: 'Reject fix',
      approveOutcome: 'Fix approved and merged into MOP v2.',
      modifyOutcome: 'Legacy cipher retained for 90 days with a sunset ticket auto-created.',
      rejectOutcome: 'Deployment blocked until Teams DR TLS issue is resolved. (Demo continues on the approved path.)',
      approver: 'NetOps Engineering Lead',
    },
    artefacts: [
      {
        kind: 'table',
        title: 'Test results',
        columns: ['Run', 'Executed', 'Passed', 'Failed', 'Notes'],
        rows: [
          ['Run 1', String(f.testCases), String(f.testCases - f.testFailures), String(f.testFailures), 'Teams DR TLS cipher regression'],
          ['Run 2 (after fix)', String(f.testCases), String(f.testCases), '0', 'All green; KPI deltas < 0.1'],
        ],
      },
      {
        kind: 'kv',
        title: 'Lab KPI comparison (before → after)',
        rows: [
          ['ASR', '99.3% → 99.3%', 'good'],
          ['NER', '99.5% → 99.5%', 'good'],
          ['PDD', '1.8 s → 1.8 s', 'good'],
          ['MOS', '4.35 → 4.34', 'good'],
          ['Registration success', '99.9% → 99.9%', 'good'],
        ],
      },
    ],
    today: { days: '~5 days', people: '4 people', detail: 'TLS regression typically found in production, causing a Teams outage and an emergency rollback.' },
  },
  {
    id: 8,
    time: 'T+5d',
    title: 'Production canary – wave 1',
    agent: 'Deploy Agent',
    summary: 'Firmware upgrade on 2 canary SBCs inside the maintenance window with live KPI guardrails.',
    log: [
      'window open → Tue 00:00; pre-check HA pairs, config snapshots, E911 test call',
      'wave 1 → SBC-EDGE-EAST-01/02 upgraded (standby first, then switchover)',
      'health-check @ +10 min → ASR 99.2%, MOS 4.3, PDD 1.9 s – within guardrails',
      'health-check @ +30 min → registration success 99.9% – GREEN',
      'customer comms → pre-notification sent to affected enterprise admins',
    ],
    decision: {
      prompt: 'Canary healthy – promote to wave 2?',
      approve: 'Approve – promote wave 2',
      modify: 'Modify – extend soak to 60 min',
      reject: 'Reject – hold',
      approveOutcome: 'Wave 2 released (8 SBCs).',
      modifyOutcome: 'Soak extended to 60 min; still within the window.',
      rejectOutcome: 'Rollout held; the 2 canary nodes remain upgraded. (Demo continues on the approved path.)',
      approver: 'NOC Shift Lead',
    },
    artefacts: [
      {
        kind: 'canary',
        title: 'Canary dashboard – wave 1',
        waves: [
          { name: 'Wave 1 (canary)', nodes: '2 SBCs', asr: 99.2, mos: 4.3, pdd: 1.9, status: 'green' },
        ],
      },
    ],
    today: { days: '~3 days', people: '6 people', detail: 'Big-bang upgrade in the window; KPIs checked by eye from several dashboards.' },
  },
  {
    id: 9,
    time: 'T+5d 03:10',
    title: 'Waves 2–3 with auto-pause',
    agent: 'Deploy Agent',
    summary: 'A PDD spike triggers an automatic pause; root-caused to a trunk group, fixed and resumed.',
    log: [
      'wave 2 → 8 SBCs upgraded in 4 HA pairs',
      'ALERT → PDD 3.4 s on SBC pair 5 (> 2.5 s guardrail) – AUTO-PAUSE',
      'root-cause → DNS SRV cache stale for one carrier trunk after switchover',
      'remediate → flush SRV cache, re-verify peering; PDD back to 1.9 s',
      'resume → approved by NOC Shift Lead (4 min pause)',
      'wave 3 → remaining 8 SBCs upgraded; all guardrails green',
    ],
    decision: {
      prompt: 'Resume rollout after the PDD spike is root-caused?',
      approve: 'Approve – resume',
      modify: 'Modify – resume with smaller waves',
      reject: 'Reject – roll back wave 2',
      approveOutcome: 'Rollout resumed and completed. No customer-impacting incident.',
      modifyOutcome: 'Remaining nodes split into 4 pairs per wave; completion still inside window.',
      rejectOutcome: 'Rollback of wave 2 would take ≈ 12 min/node; rollback plan is pre-staged. (Demo continues on the approved path.)',
      approver: 'NOC Shift Lead',
    },
    artefacts: [
      {
        kind: 'canary',
        title: 'Canary dashboard – waves 2 and 3',
        waves: [
          { name: 'Wave 2', nodes: '8 SBCs', asr: 99.1, mos: 4.3, pdd: 3.4, status: 'paused', note: 'Auto-paused on PDD spike (pair 5)' },
          { name: 'Wave 2 (resumed)', nodes: '8 SBCs', asr: 99.2, mos: 4.3, pdd: 1.9, status: 'resumed', note: 'Stale DNS SRV cache flushed' },
          { name: 'Wave 3', nodes: '8 SBCs', asr: 99.3, mos: 4.3, pdd: 1.8, status: 'green' },
        ],
      },
    ],
    today: { days: '~4 days', people: '7 people', detail: 'A PDD spike is spotted late, escalated by phone, and usually triggers a full rollback.' },
  },
  {
    id: 10,
    time: 'T+6d',
    title: 'Verification, closure & customer notice',
    agent: 'Compliance Agent',
    summary: 'Re-scan confirms 24/24 remediated; CMDB updated; audit evidence pack and customer notifications sent.',
    log: [
      'trigger tenable re-scan on all 24 SBCs → CVE-2026-41877 not detected',
      'update cmdb → firmware version and patch date on 24 CIs',
      'generate evidence pack → advisory, approvals, MOP, test results, KPI traces, re-scan',
      'send customer notices to 1,140 enterprise admins',
      'write lessons learned → knowledge base (TLS profile pre-check for Teams DR)',
      'close CHG0041877',
    ],
    decision: {
      prompt: 'Approve closure and release the audit evidence pack?',
      approve: 'Approve closure',
      modify: 'Modify – request extra evidence',
      reject: 'Reject – reopen',
      approveOutcome: 'CVE closed in 6 days vs 38 days today.',
      modifyOutcome: 'Agent adds the packet-capture sample and re-issues the pack.',
      rejectOutcome: 'Change reopened for investigation. (Demo continues on the approved path.)',
      approver: 'Compliance Officer',
    },
    artefacts: [
      {
        kind: 'checklist',
        title: 'Audit evidence pack',
        items: [
          'Advisory & KEV listing snapshot',
          'Contextual risk score breakdown',
          'CAB approvals with timestamps',
          'MOP v2 and rollback plan',
          '214/214 regression results',
          'Canary KPI traces incl. auto-pause',
          'Post-remediation scan: 24/24 clean',
        ],
      },
      {
        kind: 'doc',
        title: 'Customer notice (excerpt)',
        lines: [
          'Subject: Completed – security maintenance on your voice service (SBC firmware)',
          'We have completed a critical security update on our session border controllers. No action is required on your side.',
          'Emergency services (E911) routing was verified with test calls before and after the update.',
          'If you notice any call quality issue, contact your service desk quoting reference CHG0041877.',
        ],
      },
    ],
    today: { days: '~3 days', people: '4 people', detail: 'Manual re-scan, spreadsheet evidence for auditors, customer comms drafted after the fact.' },
  },
];
