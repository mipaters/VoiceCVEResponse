# VoiceShield AI – AI-Assisted CVE Response Demo

Click-through demo built on the customer's **actual "Current Security Response Process"** (whiteboard: journey map, jobs-to-be-done, dot voting). Client-side only (React 18, Vite, TypeScript, Tailwind, Recharts, Framer Motion, lucide-react) with mock data – no backend, no API keys.

> Badges: **Customer-validated (workshop)** = from the whiteboard; **Customer-quoted baseline** = "2–3 hrs to find what's impacted" (the only quoted metric); **Illustrative – to be validated** = everything else (KPIs, scenario, CVE-2026-31337).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
```

## Sections

1. Executive Summary – animated KPI cards (8 KPIs), editable value model (CVE events/year, engineer cost)
2. What you told us – the board recreated digitally: context, quoted metric, journey map, editable dot-vote results, Phase 0 scope
3. Today vs AI-Assisted – 8-stage journey map with sentiment curve (+3 to −3); "Today" / "With AI" toggle shows the resolving agent per pain point
4. Scenario Walkthrough – OpenSSL CVE hitting 9 of 27 apps, 9 steps incl. a lab-failure loop-back caught by the Test Agent (← → keys)
5. KPI Dashboard
6. Reference Architecture – on-prem / private cloud connectors via Azure Arc, autonomy slider (L1–L4)
7. Agent Catalogue – Phase 0 agents highlighted from the vote
8. Roadmap – Phase 0 scope derived from the top 3 priorities
9. Executive Walkthrough – 7-slide presenter mode (← → / Space, `N` notes, `Esc` exits)

The header **persona toggle** reorders KPIs and changes the focus statement. Votes edited on "What you told us" (team votes, Jay's super votes ×2) drive the Phase 0 scope everywhere, including the presenter slides.

## Editing data

All content lives in `src/data/`: `currentProcess.ts` (customer stages, jobs, pain points, sentiment), `aiProcess.ts` (agents, human gates, pain→agent resolutions), `priorities.ts` (dot-vote seed – "Read from whiteboard photo – confirm counts"), `kpis.ts`, `scenario.ts`, `architecture.ts`, `agents.ts`, `roadmap.ts`, `slides.ts`.

## Talk track (≈ 15 min)

1. **What you told us (3 min)** – replay their board; confirm vote counts; land "2–3 hrs".
2. **Today vs AI (3 min)** – toggle With AI; lowest point is Validation for Lab.
3. **Scenario (5 min)** – step through; point out the lab failure caught before production.
4. **KPIs, architecture (2 min)** – baselines get validated in the POC.
5. **Ask (2 min)** – 30-day POC on the top 3 jobs.
## Deploy to Azure Static Web Apps

`staticwebapp.config.json` provides the SPA fallback.

```bash
npm run build
npx @azure/static-web-apps-cli deploy ./dist --env production
```

Or in the Azure portal create a Static Web App from the GitHub repo with: App location `/`, Output location `dist`, Build command `npm run build`. The generated GitHub Actions workflow then deploys on every push.

