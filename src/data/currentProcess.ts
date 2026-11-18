// Source: customer whiteboard (journey map, jobs-to-be-done, dot voting). Wording is the customer's own.

export const BADGE_CUSTOMER = 'Customer-validated (workshop)';

export const customerContext = [
  { label: 'Applications owned by Ops', value: '~27', detail: 'on different infrastructure environments' },
  { label: 'Hosting', value: '95%', detail: 'on-prem / private cloud' },
  { label: 'Application owners', value: 'Across Jay\'s org', detail: 'heavy reliance on tribal knowledge' },
  { label: 'Engineers', value: 'App specialists', detail: 'not security experts' },
  { label: 'CVE alarms / events', value: 'Increasing', detail: 'frequency is rising' },
];

export const quotedMetric = {
  text: '2–3 hrs to find what\'s impacted',
  scope: 'per CVE, assessment only',
};

export interface CurrentStage {
  id: number;
  name: string;
  jobsToBeDone: string[]; // blue stickies
  painPoints: string[]; // green stickies
  sentiment: number; // +3 … -3
  note?: string;
  loopBackTo?: number;
  loopBackLabel?: string;
}

export const currentStages: CurrentStage[] = [
  {
    id: 1,
    name: 'Identify Incident',
    jobsToBeDone: [],
    painPoints: ['Alarms / CVE', 'Increasing frequency of events'],
    sentiment: 3,
  },
  {
    id: 2,
    name: 'Assessment',
    jobsToBeDone: [
      'Identify all our assets',
      'Log in to asset / detect vulnerability',
      'Identify the right version of OS',
      'Develop assessment brief',
      'Exec summary of exposure',
    ],
    painPoints: [
      'Ops owns 27 apps, different infra environments',
      'Fragmented process, data, tribal knowledge',
      'Human error can happen – engineers are app specialists, not security experts',
      '95% on-prem private cloud',
      '2–3 hrs to find what\'s impacted',
      'Discovery / system knowledge scattered',
    ],
    sentiment: -2,
    note: 'Not really validation – just an assessment brief we give to Jay',
  },
  {
    id: 3,
    name: 'Risk',
    jobsToBeDone: [],
    painPoints: [
      'Identify software packages at risk',
      'Application owners across Jay\'s org – tribal knowledge',
      'Delays to projects',
      'Evaluate vulnerability exposure',
      'Potential impact – public-facing exposure',
    ],
    sentiment: -2,
  },
  {
    id: 4,
    name: 'Develop Strategy',
    jobsToBeDone: [
      'Mitigation execute – define the steps that need to be taken',
      'Engage a vendor',
      'Verify the new version will work (i.e. the upgrade)',
    ],
    painPoints: [
      'Depends on level of criticality / high impact',
      'Multiple vendors, contracts',
      'Output: email + action plan',
      'Mitigation or remediation?',
    ],
    sentiment: -1,
  },
  {
    id: 5,
    name: 'Validation for Lab',
    jobsToBeDone: [],
    painPoints: ['Timing & level of impact', 'After hours, weekends'],
    sentiment: -3,
  },
  {
    id: 6,
    name: 'Integrate into Lab',
    jobsToBeDone: ['Deploy code to assets'],
    painPoints: [],
    sentiment: 1,
  },
  {
    id: 7,
    name: 'Deploy into Production',
    jobsToBeDone: [
      'Approval process',
      'MOP creation',
      'Change management tickets, approvals, time of day',
      'Execute the change (i.e. SW upgrade)',
    ],
    painPoints: ['Failures go back to lab'],
    sentiment: -1,
    loopBackTo: 6,
    loopBackLabel: 'Failures go back to lab',
  },
  {
    id: 8,
    name: 'Validation',
    jobsToBeDone: [
      'Transaction reporting, scanners, manual test cases',
      'Good documentation, version mgmt, design documents',
      'Post-mortem incident report',
    ],
    painPoints: [],
    sentiment: 2,
    note: 'Re-scan, no impact',
  },
];

export const crossStageJobs = [
  'Stage coordination – right SMEs to do the upgrade',
  'Communication on updates + follow-up to leadership',
  'Upon completion – brief on actions taken on mitigation',
];
