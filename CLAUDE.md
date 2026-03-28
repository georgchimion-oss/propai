# Vestia — AI-Powered Property Management for South Florida

> **Brand**: Vestia (renamed from PropAI)
> **Hub**: vestia.georg.miami
> **Folder**: personal/hosted/vestia/
> **Status**: Active development — March 2026

---

## What Is Vestia?

Vestia is an AI-powered property management platform targeting South Florida condo associations (HOA/COA). Built as 6 independent modules, each deployed as its own subdomain on georg.miami.

The opportunity: Property management scores 27/30 on PwC's AI Disruption Index for South Florida — the #1 industry for AI disruption.

## Current State

**Hub site**: Lovable-generated React app (Vite + React + TS + Tailwind). Located at `vestia/hub/`. Design is finalized — dark luxury theme with gold/teal accents, real Miami photography, scroll animations. Needs: strip unused deps (shadcn bloat), deploy.

**Clean rebuild also exists** at `vestia/hub/` (Vite + React + Tailwind v4 + Lucide, no bloat). Visually matches Lovable per Playwright screenshots. Can use either.

**Lovable source files**: Were unzipped to `/tmp/vestia-compare/lovable/lovable vestia/` — these are TEMP files and may not survive restarts.

## Architecture

**Hub + Modules pattern:**
- Hub site at `vestia.georg.miami` — showcases all 6 modules
- Each module is a standalone React app at its own subdomain
- All deployed to VPS via `npm run build` → `rsync dist/ root@159.89.185.96:/var/www/sites/{name}/`

## Modules

| # | Module | Subdomain | VPS Path | Status |
|---|--------|-----------|----------|--------|
| 0 | **Hub** | vestia.georg.miami | /var/www/sites/vestia/ | LIVE |
| 1 | **Vestia Triage** | triage.georg.miami | /var/www/sites/triage/ | LIVE |
| 2 | **Vestia Comply** | comply.georg.miami | /var/www/sites/comply/ | LIVE |
| 3 | **Vestia Collect** | collect.georg.miami | /var/www/sites/collect/ | LIVE |
| 4 | **Vestia Screen** | screen.georg.miami | /var/www/sites/screen/ | LIVE |
| 5 | **Vestia Docs** | vestiadocs.georg.miami | /var/www/sites/vestiadocs/ | LIVE |
| 6 | **Vestia Vendor** | vendor.georg.miami | /var/www/sites/vendor/ | LIVE |

## Module Descriptions

1. **Triage** — AI maintenance triage & dispatch. Tenant reports issue → AI categorizes urgency, routes to right vendor, generates work order.
2. **Comply** — SB 4-D compliance tracker. Post-Surfside Florida building safety law. Inspection schedules, reserve studies, document retention, board notifications.
3. **Collect** — Automated rent collection & follow-up. Payment tracking, late notices, payment plans, automated communication sequences.
4. **Screen** — Tenant screening automation. Application intake, background/credit checks, AI risk scoring, Florida-specific regulations.
5. **Docs** — Lease document generation & review. AI drafts leases, clause analysis, FL-specific templates, amendment tracking.
6. **Vendor** — Vendor RFP generation & bid comparison. Scope of work generation, bid intake portal, AI comparison matrix.

## Build Order

1. ~~Hub site~~ — designed, ready to deploy
2. **Triage** — highest daily pain point for property managers (BUILD NEXT)
3. Comply — Florida-specific wedge, unique differentiator
4. Collect → Screen → Docs → Vendor

## Design System (Vestia-specific)

- **Palette**: Navy `#07070c` base, Gold `#c9a96e` accent (CTAs), Teal `#2dd4bf` secondary (compliance/trust)
- **Fonts**: Cormorant Garamond (serif headings, weight 300) + DM Sans (sans body)
- **Images**: Real Miami photography (hero-miami.jpg, cta-pool.jpg, market-aerial.jpg, problem-manager.jpg, how-it-works-bg.jpg)
- **Animations**: IntersectionObserver scroll reveals, staggered card delays, easing: cubic-bezier(0.16, 1, 0.3, 1)
- **Stack**: Vite + React + TypeScript + Tailwind (v4 uses oklch colors for opacity modifier support)
- **NOT** using georg.miami design system defaults — Vestia has its own brand

## Deploy

```bash
# Hub (build then rsync)
cd vestia/hub && npm run build
rsync -az dist/ root@159.89.185.96:/var/www/sites/vestia/

# Any module
cd vestia/MODULE_NAME && npm run build
rsync -az dist/ root@159.89.185.96:/var/www/sites/MODULE_NAME/
```

## Research

- Full market research: [docs/market-research.md](docs/market-research.md)
- Framer design prompts: [docs/framer-prompt.md](docs/framer-prompt.md) (long) and [docs/framer-prompt-short.md](docs/framer-prompt-short.md)
- PwC AI Disruption Index: [AI-Disruption-Index-SoFla-FINAL.pdf](AI-Disruption-Index-SoFla-FINAL.pdf)
- Design zips in docs/: `lovable vestia.zip` (winner), `vestia-landing.zip`

## Key Competitors

- AppFolio (Realm-X AI) — biggest, most AI-advanced incumbent
- EliseAI — AI tenant communication
- Property Meld + Mezo (MAX) — AI maintenance triage
- Buildium, Yardi, Entrata — traditional incumbents

## Vestia's Edge

- Florida-first (SB 4-D compliance baked in)
- AI-native from day one (not bolted on)
- Condo association focus (most tools target rentals)
- Six integrated modules (not siloed point solutions)

## Git

See master `Coding/.claude/CLAUDE.md` for shared conventions (git workflow, VPS details, deploy commands).
