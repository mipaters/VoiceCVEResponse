# VoiceShield AI – AI-Assisted CVE Lifecycle Demo

Click-through demo for an enterprise voice network operator, comparing **Today (manual process)** with **AI-Assisted** CVE management. Client-side only (React 18, Vite, TypeScript, Tailwind, Recharts, Framer Motion, lucide-react) with mock data – no backend, no API keys.

> Illustrative demo – mock data and fictional CVE identifiers. All figures are illustrative targets, to be validated in discovery.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
```

## Sections

1. Executive Summary – animated KPI cards, value at stake (editable outage-minute cost)
2. Today vs AI-Assisted – nine-stage swimlane, "Show pain points / Show AI value"
3. Scenario Walkthrough – 10-step CVE-2026-41877 story (← → keys, approve/modify/reject)
4. KPI Dashboard – Recharts visuals and KPI definitions
5. Reference Architecture – clickable layers, autonomy slider (L1–L4)
6. Agent Catalogue
7. Roadmap
8. Executive Walkthrough – full-screen presenter mode (← → / Space, `N` toggles notes, `Esc` exits)

The header **persona toggle** (CTO | CISO | NetOps | Change Manager) reorders KPIs and changes the focus statement.

## Editing data

All content lives in `src/data/`. Every KPI number is in `src/data/kpis.ts` (KPIs, value model, chart series, KPI definitions, scenario facts). Other files: `scenario.ts`, `stages.ts`, `architecture.ts`, `agents.ts`, `roadmap.ts`, `slides.ts`.

## Demo talk track (≈ 15 min)

1. **Exec Summary (2 min)** – "38 days to 6 days." Click Replay; switch persona to match the room. Adjust the outage-minute cost live.
2. **Scenario Walkthrough (6 min)** – a KEV-listed SIP pre-auth RCE hits the SBCs. Press Approve at each checkpoint. Land three moments: 12-minute detection with blast radius (1,140 customers, 41 E911), CAB approval in 35 minutes, and the canary auto-pause on a PDD spike.
3. **Today vs AI-Assisted (2 min)** – toggle pain points / AI value; show the human checkpoint at every stage.
4. **KPI Dashboard (1 min)** – definitions and data sources make the targets testable.
5. **Architecture and agents (2 min)** – move the autonomy slider; no production change without human approval.
6. **Roadmap and ask (2 min)** – or launch Executive Walkthrough: approve the 30-day Phase 0 POC.

## Deploy to Azure Static Web Apps

`staticwebapp.config.json` provides the SPA fallback.

```bash
npm run build
npx @azure/static-web-apps-cli deploy ./dist --env production
```

Or in the Azure portal create a Static Web App from the GitHub repo with: App location `/`, Output location `dist`, Build command `npm run build`. The generated GitHub Actions workflow then deploys on every push.
