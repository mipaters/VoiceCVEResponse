export const PRIORITIES_NOTE = 'Read from whiteboard photo – confirm counts';
export const SUPER_VOTE_WEIGHT = 2; // Jay's super votes count x2

export interface Priority {
  id: string;
  job: string;
  teamVotes: number;
  superVotes: number;
  agents: string[]; // agents that deliver this job
}

// Seeded from the board; editable live by the presenter.
export const initialPriorities: Priority[] = [
  { id: 'assets', job: 'Identify all our assets', teamVotes: 3, superVotes: 1, agents: ['Asset Discovery Agent', 'Security Incident Assessment Agent'] },
  { id: 'coordination', job: 'Stage coordination – right SMEs to do the upgrade', teamVotes: 2, superVotes: 1, agents: ['Coordinator Agent'] },
  { id: 'detect', job: 'Log in to asset / detect vulnerability', teamVotes: 1, superVotes: 1, agents: ['Security Incident Assessment Agent'] },
  { id: 'osversion', job: 'Identify the right version of OS', teamVotes: 0, superVotes: 0, agents: ['Security Incident Assessment Agent'] },
  { id: 'brief', job: 'Develop assessment brief', teamVotes: 0, superVotes: 0, agents: ['Brief Agent'] },
  { id: 'vendor', job: 'Engage a vendor', teamVotes: 0, superVotes: 0, agents: ['Mitigation Agent'] },
  { id: 'verify', job: 'Verify the new version will work (i.e. the upgrade)', teamVotes: 0, superVotes: 0, agents: ['Mitigation Agent', 'Test Agent'] },
  { id: 'mop', job: 'MOP creation', teamVotes: 0, superVotes: 0, agents: ['Change Agent'] },
  { id: 'change', job: 'Change management tickets, approvals, time of day', teamVotes: 0, superVotes: 0, agents: ['Change Agent'] },
  { id: 'comms', job: 'Communication on updates + follow-up to leadership', teamVotes: 0, superVotes: 0, agents: ['Coordinator Agent'] },
  { id: 'postmortem', job: 'Post-mortem incident report', teamVotes: 0, superVotes: 0, agents: ['Compliance Agent'] },
];

export const score = (p: Priority) => p.teamVotes + p.superVotes * SUPER_VOTE_WEIGHT;

export const rank = (items: Priority[]) =>
  items
    .map((p, i) => ({ p, i }))
    .sort((a, b) => score(b.p) - score(a.p) || a.i - b.i)
    .map((x) => x.p);

export const phase0Scope = (items: Priority[]) => {
  const top = rank(items).filter((p) => score(p) > 0).slice(0, 3);
  const agents = Array.from(new Set(top.flatMap((p) => p.agents)));
  return { top, agents };
};
