// All content for the Coordinator Agent architecture view. Static, illustrative data only.

export type Phase = 'crawl' | 'walk' | 'run';
export type LinkedAgent = 'asset' | 'assessment';

export const coordinatorAgentConfig = {
  title: 'Coordinator Agent – Architecture',
  agentName: 'Coordinator Agent (Voice Security Operations Coordinator) – VID #3',
  job: {
    role: 'Orchestrate the voice security agent team. Route requests and events to the right agent (Asset Management, Security Incident Assessment), sequence their work, track each incident end to end, and keep humans informed and in control.',
    reportsTo: 'Director of Voice Security & Tools',
    kpi: '100% of incidents tracked end to end with no dropped hand-offs; time from CVE to LT notification',
    problem: 'Reduce manual hand-offs, follow-ups and status-chasing between asset, security and SME teams during a CVE/incident',
    failureMode: 'An agent hand-off stalls or conflicting data between agents is not raised to a human',
  },
  duties: [
    'Receive and triage: take in triggers and decide which agent(s) to call',
    'Orchestrate and track: sequence the agents, track status, retry or escalate',
    'Close the loop: combine results, route approvals, send comms, send findings back',
  ],

  // Layers top to bottom; "phases" lists the stepper phases that light the layer up.
  layers: [
    {
      id: 'triggers',
      name: 'Triggers',
      color: '#f87171',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'New CVE feed', detail: 'Automatic start', phase: 'walk' as Phase },
        { label: 'Teams / M365 Copilot request', detail: 'A human starts the run', phase: 'crawl' as Phase },
        { label: 'Scheduled audit results', detail: 'From the daily audit', phase: 'run' as Phase },
        { label: 'Asset Management drift alerts', detail: 'Inventory changes', phase: 'run' as Phase },
      ],
    },
    {
      id: 'experience',
      name: 'Experience',
      color: '#38bdf8',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Teams / M365 Copilot', detail: 'Where the team and leadership interact' },
        { label: 'Copilot Studio Coordinator agent', detail: 'Single front door: “What’s our exposure to CVE-XXXX?”, “Status of incident 42?”' },
      ],
    },
    {
      id: 'orchestration',
      name: 'Orchestration – Coordinator Agent',
      color: '#22d3ee',
      centre: true,
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Multi-agent orchestration', detail: 'Copilot Studio generative orchestration + connected agents' },
        { label: 'Agent flows', detail: 'Approvals, escalations, SLA timers', phase: 'walk' as Phase },
        { label: 'Incident state tracker', detail: 'Dataverse table: incident, step, owner, status, SLA', phase: 'walk' as Phase },
      ],
    },
    {
      id: 'agents',
      name: 'Connected agents – Azure AI Foundry',
      color: '#a78bfa',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      note: 'Agent-to-agent calls using Foundry connected agents / A2A',
      blocks: [],
    },
    {
      id: 'data',
      name: 'Data',
      color: '#34d399',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Shared Fabric voice-asset golden record', detail: 'Read by both agents' },
        { label: 'CVE knowledge store', detail: 'Affected ranges, advisories' },
        { label: 'Incident history (Dataverse)', detail: 'Every incident, step and decision' },
      ],
    },
    {
      id: 'outputs',
      name: 'Outputs',
      color: '#f472b6',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Exec brief email', detail: 'Outlook', phase: 'crawl' as Phase },
        { label: 'Technical readout', detail: 'Report + Teams post', phase: 'crawl' as Phase },
        { label: 'Podcast', detail: 'Azure AI Speech summary', phase: 'run' as Phase },
        { label: "Instant alert to Jay's LT", detail: 'Teams / email', phase: 'run' as Phase },
        { label: 'ServiceNow updates', detail: 'Incident and CMDB', phase: 'walk' as Phase },
      ],
    },
  ],

  connectedAgents: [
    { id: 'asset' as LinkedAgent, name: 'Asset Management Agent', skills: ['Ingest', 'Lifecycle', 'Audit'], link: 'Open Asset Management architecture' },
    { id: 'assessment' as LinkedAgent, name: 'Security Incident Assessment Agent', skills: ['Scope', 'Verify', 'Assess'], link: 'Open Security Incident Assessment architecture' },
  ],

  governance: [
    'Entra Agent ID for each agent',
    'Agent 365 (agent registry, observability)',
    'Sentinel / Azure Monitor audit trail',
    'Human-in-the-loop checkpoints',
  ],

  flow: ['Trigger', 'Coordinator', 'Asset Management (refresh scope)', 'Security Incident Assessment (verify / assess)', 'Coordinator', 'Approvals', 'Comms out'],
  feedback: 'Feedback: Assessment findings (e.g. undisclosed upgrades) go back to Asset Management, through the Coordinator',

  whyTable: [
    { capability: 'Single front door and routing', builtIn: 'Copilot Studio', why: 'Native Teams/M365, generative orchestration across agents' },
    { capability: 'Incident tracking, SLAs, escalation', builtIn: 'Copilot Studio flows + Dataverse', why: 'Business-maintainable state and approvals' },
    { capability: 'Specialist reasoning (inventory, CVE impact)', builtIn: 'Foundry connected agents', why: 'Heavy data and logic stay in the pro-code engine' },
    { capability: 'Agent-to-agent hand-offs', builtIn: 'Studio connected agents + Foundry A2A', why: 'Loosely coupled; each agent can be swapped or upgraded' },
    { capability: 'Approvals and ServiceNow updates', builtIn: 'Copilot Studio connectors', why: 'Ready-made, auditable' },
    { capability: 'Governance', builtIn: 'Entra Agent ID + Agent 365', why: 'One registry, identity and audit trail for the whole agent team' },
  ],

  steps: [
    {
      phase: 'crawl' as Phase,
      label: 'CRAWL – Single front door',
      summary: 'Single front door in Teams. The Coordinator routes questions to the right agent and returns a combined answer; a human starts each run.',
      sample: '“Are we exposed to CVE-2026-XXXX?” → “Asset Management found 22 candidate assets; Assessment confirmed 14 affected. Exec brief sent.”',
    },
    {
      phase: 'walk' as Phase,
      label: 'WALK – Event-driven',
      summary: 'A new CVE automatically starts the agent chain; incidents are tracked with SLAs; approvals and escalations happen in Teams.',
      sample: '“Incident #42: Assessment step overdue 20 min – escalated to on-call SME”',
    },
    {
      phase: 'run' as Phase,
      label: 'RUN – Autonomous',
      summary: 'Runs on its own end to end. Instant LT notification, a feedback loop keeps inventory accurate, and only exceptions go to humans.',
      sample: 'Alert: “CVE triaged in 38 min: 3 critical assets, 1 undisclosed upgrade found and inventory updated, LT notified”',
    },
  ],

  demo: {
    title: 'Live demo – replay of incident #42 (simulated)',
    steps: [
      { at: '00:00', agent: 'Coordinator Agent', status: 'Triggered by new CVE-2026-XXXX; incident #42 opened', elapsed: '0 min' },
      { at: '00:02', agent: 'Asset Management Agent', status: 'Refreshed scope: 22 candidate assets from the golden record', elapsed: '2 min' },
      { at: '00:09', agent: 'Security Incident Assessment Agent', status: 'Read-only login and version check on 22 assets; 14 affected', elapsed: '9 min' },
      { at: '00:21', agent: 'Security Incident Assessment Agent', status: '1 undisclosed upgrade found; finding sent back via Coordinator', elapsed: '21 min' },
      { at: '00:23', agent: 'Asset Management Agent', status: 'Inventory updated with the undisclosed upgrade', elapsed: '23 min' },
      { at: '00:30', agent: 'Coordinator Agent', status: 'Combined results; approval requested in Teams', elapsed: '30 min' },
      { at: '00:38', agent: 'Coordinator Agent', status: "Approved; exec brief sent and Jay's LT notified", elapsed: '38 min' },
    ],
  },

  kpiNote: 'Illustrative data – to be validated',
  kpis: [
    { label: 'Incidents tracked end to end', value: '100%', target: 'Target 100%' },
    { label: 'CVE → LT notification', value: '38 min', target: 'vs hours of manual follow-up' },
    { label: 'Hand-offs automated', value: '92%', target: 'between agents and teams' },
    { label: 'Human escalations', value: '2 per incident', target: 'exceptions only' },
  ],
};
