// All content for the Security Incident Assessment Agent architecture view. Static, illustrative data only.

export type Phase = 'crawl' | 'walk' | 'run';

export const assessmentAgentConfig = {
  title: 'Security Incident Assessment Agent – Architecture',
  agentName: 'Security Incident Assessment Agent (Security Incident Assessor) – VID #2',
  job: {
    role: 'Log in to assets and identify vulnerable assets',
    reportsTo: 'Kenny',
    kpi: '100% accuracy in identifying the assets affected by a CVE',
    problem: 'Reduce time spent finding the right SMEs and the affected assets',
    failureMode: "Inaccuracy caused by a deployment or upgrade that wasn't disclosed",
  },
  duties: ['Log in to the asset', 'Pull down version info', 'Analyse that info to find which assets the CVE affects'],
  inventoryLink: 'Uses inventory from Asset Management Agent',

  // Layers listed top (what the user sees) to bottom; each lights up for the listed phases.
  layers: [
    {
      id: 'trigger',
      name: 'Trigger',
      color: '#f87171',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'New CVE', detail: 'NVD, vendor security advisories, Microsoft Defender Threat Intelligence' },
        { label: 'Manual request', detail: 'Asked in Teams' },
      ],
    },
    {
      id: 'experience',
      name: 'Experience',
      color: '#38bdf8',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Teams / M365 Copilot', detail: 'Where the team and leadership interact' },
        { label: 'Copilot Studio agent', detail: 'Ask “Are we exposed to CVE-XXXX?”, view status, request a readout' },
      ],
    },
    {
      id: 'orchestration',
      name: 'Orchestration',
      color: '#818cf8',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Connected agent', detail: 'Copilot Studio calls the Foundry assessment agent' },
        { label: 'Agent flows', detail: 'Send email and Teams alerts' },
      ],
    },
    {
      id: 'engine',
      name: 'Agent engine – Azure AI Foundry',
      color: '#a78bfa',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Scope', detail: 'Match the CVE to candidate assets from the inventory' },
        { label: 'Verify', detail: 'Log in to each asset read-only and pull live version/config info' },
        { label: 'Assess', detail: "Compare versions to the CVE's affected ranges; confidence score; flag drift from inventory" },
      ],
      tools: ['Azure Functions / Automation runbooks (SSH/API version collectors)', 'Code interpreter', 'Foundry evaluations'],
    },
    {
      id: 'data',
      name: 'Data',
      color: '#34d399',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Asset inventory (golden record)', detail: 'From the Asset Management Agent in Microsoft Fabric – read-only' },
        { label: 'CVE knowledge store', detail: 'Affected ranges, advisories' },
        { label: 'Assessment history', detail: 'Past assessments and evidence' },
      ],
    },
    {
      id: 'access',
      name: 'Access & security',
      color: '#fbbf24',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Privileged access vault', detail: 'Azure Key Vault / customer PAM' },
        { label: 'Read-only service accounts', detail: 'Just-in-time access' },
        { label: 'Every login logged', detail: 'Full audit trail per asset' },
      ],
    },
    {
      id: 'comms',
      name: 'Communications output',
      color: '#f472b6',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Exec brief', detail: 'Outlook email', phase: 'crawl' as Phase },
        { label: 'Technical readout', detail: 'Word/PDF report + Teams post', phase: 'walk' as Phase },
        { label: 'Podcast', detail: 'Azure AI Speech audio summary', phase: 'run' as Phase },
        { label: 'Instant alert', detail: "Teams/email to Jay's LT", phase: 'run' as Phase },
      ],
    },
  ],

  governance: [
    'Entra Agent ID',
    'Agent 365',
    'Microsoft Sentinel / Azure Monitor audit trail',
    'Human approval before any action beyond read-only',
  ],

  flow: ['CVE in', 'Scope', 'Log in and verify', 'Assess', 'Comms out'],
  feedback: 'Undisclosed deployment or upgrade findings are sent back to the Asset Management Agent (addresses the failure mode)',

  whyTable: [
    { capability: 'CVE intake and asset scoping', builtIn: 'Foundry + Fabric', why: 'Joins external CVE data with the internal inventory' },
    { capability: 'Logging in to assets / pulling versions', builtIn: 'Foundry + Functions + vault', why: 'Privileged, scripted, auditable access; never in a low-code chat layer' },
    { capability: 'Impact analysis', builtIn: 'Foundry', why: 'Multi-step reasoning, confidence scoring, eval harness for the 100% KPI' },
    { capability: 'Exec brief, readout, podcast', builtIn: 'Copilot Studio flows + Azure AI Speech', why: 'Fast M365 delivery, business-maintainable templates' },
    { capability: 'Questions and instant alerts', builtIn: 'Copilot Studio in Teams', why: 'Native Teams/Outlook channels' },
    { capability: 'Governance', builtIn: 'Entra Agent ID + Agent 365 + Sentinel', why: 'Every agent login is traceable' },
  ],

  steps: [
    {
      phase: 'crawl' as Phase,
      label: 'CRAWL – Exec brief',
      summary: 'CVE published → report of affected assets emailed in under 1 hour (accurate and timely).',
      sample: 'Email subject: “CVE-2026-XXXX: 14 voice assets affected (exec brief)”',
    },
    {
      phase: 'walk' as Phase,
      label: 'WALK – Technical readout',
      summary: 'Technical readout with per-asset version evidence, confidence and suggested SMEs; posted to Teams.',
      sample: '“SBC-NE-07 runs 9.2.1 (affected ≤ 9.2.3) – verified by live login 10:42”',
    },
    {
      phase: 'run' as Phase,
      label: 'RUN – Instant notification',
      summary: "Instant notification to Jay's LT plus an optional podcast summary; undisclosed changes sent back to Asset Management.",
      sample: 'Alert: “Critical CVE: 3 assets exposed; 1 undisclosed upgrade found and inventory updated”',
    },
  ],

  kpiNote: 'Illustrative data – to be validated',
  kpis: [
    { label: 'Affected-asset accuracy', value: '96%', target: 'Target 100%' },
    { label: 'CVE → exec brief', value: '42 min', target: 'Target < 1 hr' },
    { label: 'SME hours saved', value: '24 h / CVE', target: 'vs manual search' },
    { label: 'Undisclosed changes caught', value: '1 of 14', target: 'assets in sample CVE' },
  ],
};
