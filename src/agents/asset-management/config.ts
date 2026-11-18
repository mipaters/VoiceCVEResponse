// All content for the Asset Management Agent architecture view. Static, illustrative data only.

export type Phase = 'crawl' | 'walk' | 'run';

export const assetAgentConfig = {
  title: 'Asset Management Agent – Architecture',
  agentName: 'Asset Management Agent (Inventory Manager Assistant – VID)',
  job: {
    role: 'Manage the inventory of voice assets (software, hardware, on-prem, etc.) across the whole environment',
    reportsTo: 'Director of Voice Security & Tools',
    kpi: '100% accuracy of all voice assets',
    problem: 'Reduce time spent on asset discovery',
  },

  // Each layer lists the phases that light it up in the stepper.
  layers: [
    {
      id: 'experience',
      name: 'Experience',
      color: '#38bdf8',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Teams / M365 Copilot', detail: 'Where voice engineers and the Director interact' },
        { label: 'Copilot Studio agent', detail: 'Questions, approvals, exception alerts' },
      ],
    },
    {
      id: 'orchestration',
      name: 'Orchestration',
      color: '#818cf8',
      phases: ['crawl', 'walk'] as Phase[],
      blocks: [
        { label: 'Connected agent', detail: 'Copilot Studio calls the Foundry asset agent' },
        { label: 'Agent flows', detail: 'Approval flows for CMDB changes' },
      ],
    },
    {
      id: 'engine',
      name: 'Agent engine – Azure AI Foundry',
      color: '#a78bfa',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'Ingest (Crawl)', detail: 'Build an accurate inventory', phase: 'crawl' as Phase },
        { label: 'Lifecycle (Walk)', detail: 'Ongoing management, auto updates', phase: 'walk' as Phase },
        { label: 'Audit (Run)', detail: 'Find missing assets, run autonomously', phase: 'run' as Phase },
      ],
      tools: ['Azure Functions', 'Logic Apps', 'Code interpreter', 'Foundry evaluations'],
    },
    {
      id: 'data',
      name: 'Data',
      color: '#34d399',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [{ label: 'Microsoft Fabric lakehouse', detail: 'Voice-asset golden record' }],
    },
    {
      id: 'sources',
      name: 'Sources & actions',
      color: '#fbbf24',
      phases: ['crawl', 'walk', 'run'] as Phase[],
      blocks: [
        { label: 'ServiceNow CMDB', detail: 'System of record; receives approved write-back' },
        { label: 'SBC / CUCM / voice platform exports', detail: 'Hardware, software, firmware' },
        { label: 'Network discovery scans', detail: 'What is actually on the network' },
        { label: 'Procurement / licensing', detail: 'Contracts, entitlements, end-of-support' },
      ],
    },
  ],

  governance: ['Entra Agent ID', 'Agent 365', 'Key Vault', 'Azure Monitor'],

  flows: { up: 'Data flows up: sources → golden record → agent → Teams', down: 'Approved updates flow down: Teams approval → ServiceNow CMDB' },

  whyTable: [
    { capability: 'Multi-source ingestion', builtIn: 'Foundry + Fabric', why: 'High volume, scheduled, custom code' },
    { capability: 'Reconciliation and missing-asset detection', builtIn: 'Foundry', why: 'Multi-step reasoning, eval harness for the 100% KPI' },
    { capability: 'Autonomous audits', builtIn: 'Foundry + triggers', why: 'Runs in the background without a user' },
    { capability: 'Team Q&A', builtIn: 'Copilot Studio in Teams', why: 'Fast to build, native M365' },
    { capability: 'Approvals and CMDB updates', builtIn: 'Copilot Studio flows + ServiceNow connector', why: 'Business-maintainable' },
    { capability: 'Governance', builtIn: 'Entra Agent ID + Agent 365', why: 'One identity and audit trail' },
  ],

  steps: [
    {
      phase: 'crawl' as Phase,
      label: 'CRAWL – Ingest',
      summary: 'Inventory built from 2–3 sources; accuracy baseline.',
      prompt: 'How many SBCs do we have in the Northeast and which are end-of-support?',
    },
    {
      phase: 'walk' as Phase,
      label: 'WALK – Lifecycle management',
      summary: 'Agent detects drift, proposes an update, a human approves in Teams, and the CMDB is updated.',
      prompt: '3 CUCM nodes have firmware drift – approve CMDB update?',
    },
    {
      phase: 'run' as Phase,
      label: 'RUN – Audit',
      summary: 'Daily autonomous audit; only exceptions are surfaced.',
      prompt: '12 assets on the network are not in the CMDB; accuracy 98.7% → 99.4%',
    },
  ],

  kpiNote: 'Illustrative data – to be validated',
  kpis: [
    { label: 'Inventory accuracy', value: '98.7%', target: 'Target 100%' },
    { label: 'Discovery hours saved', value: '38 h / month', target: 'vs manual discovery' },
    { label: 'Missing assets found', value: '12', target: 'not in the CMDB' },
    { label: 'CMDB update time', value: '2 days → 15 min', target: 'with Teams approval' },
  ],
};
