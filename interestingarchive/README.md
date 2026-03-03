# Interesting Archive

Pre-2026 code from the CodeVibing project. Preserved here for reference and potential revival.

## What happened

CodeVibing started as an **AI component sharing platform** (Feb 2025) with a playground editor, gallery, and publishing workflow. In Nov 2025, agent design and PDF workflow features were added. In Mar 2026, the project pivoted to become an **AI community of practice** — the old marketplace code was archived and replaced with community features (feed, profiles, friends, communities).

## Contents

### Agent Design Wizard (`app/agent-design/`, `components/AgentDesign*/`)
A 5-step wizard for designing AI agents grounded in human wellbeing frameworks. Based on Pieter Desmet's 13 fundamental needs (TU Delft). Steps: Context, Wellbeing Needs, Safety & Ethics, Workflow, Review. **This is the "interview system" — worth revisiting.**

- `app/agent-design/page.tsx` — Page wrapper
- `components/AgentDesignWizard.tsx` — Main wizard component (state, navigation, validation)
- `components/AgentDesign/StepContext.tsx` — Agent purpose and affected users
- `components/AgentDesign/StepNeeds.tsx` — Select from 13 fundamental needs
- `components/AgentDesign/StepSafety.tsx` — Risk assessment, human decision points
- `components/AgentDesign/StepWorkflow.tsx` — Workflow and collaboration model
- `components/AgentDesign/StepReview.tsx` — Final review and export

### PDF Workflow System (`app/workflow/`, `app/api-workflow/`, `lib/workflow/`)
Tool for extracting instructional metadata from educational PDFs using Claude. Processes uploaded PDFs to identify topics, learning standards, and objectives.

- `app/workflow/basic/page.tsx` — Upload and processing UI (239 lines)
- `app/api-workflow/basic/route.ts` — API endpoint using Anthropic SDK
- `lib/workflow/basicWorkflow.ts` — Type definitions and utilities (1187 lines)
- `lib/workflow/pageIntelligenceAgent.ts` — Claude API integration for page analysis

### Design Exploration (`app/design-page.tsx`)
Gallery card style comparison — 4 layouts (Dribbble, Overlay, Are.na Minimal, Hybrid) with grid density controls. Untracked file, never committed.

### Agent/Architecture Docs (`docs/`)
Nov 2025 documentation for a multi-agent metadata labeling system:
- `docs/agents/` — 6 agent specs (alignment mapper, ingestion, page analysis, page intelligence, quality gate, standards mapper)
- `docs/architecture/multi-agent-design.md` — System architecture
- `docs/schema/page-metadata.json` — Metadata schema (664 lines)
- `docs/tooling/mcp-services.md` — MCP integration notes
- `docs/workflows/basic-cli.md` — CLI workflow docs

### Old Playground (`old-playground/`)
The original CodeVibing — an AI component marketplace with:
- **Pages**: `/playground` (code editor), `/gallery` (showcase), `/create` (publish), `/vibes` (feed), `/project/[id]` (detail)
- **Components**: Playground editor (355 lines), GalleryGrid, ProjectCard, MetadataEditor, PublishForm, VibeCard/VibeGallery, FeaturedGallery, CodeInput, MetadataForm
- **Lib**: projectService, generateMetadata, types
- **Data**: mockProjects seed data
- **Scripts**: capture-preview.ts (screenshot automation), capture-gallery.ts, run-metadata-workflow.ts
- **Docs**: Deployment guides, Vercel setup, contributing guide

### Config (`config/`)
- `.env.example`, `.env.local.example` — Environment variable templates
- `.vercelignore` — Old Vercel ignore rules

### Misc
- `lib/supabase-auth.ts` — Unused SSR middleware utilities for Supabase auth
- `scripts/verify-env.js` — Environment variable verification script

## Revival candidates

1. **Agent Design Wizard** — The wellbeing-needs interview system could be adapted into a general "what do you want to build?" onboarding flow
2. **PDF Workflow** — Instructional metadata extraction is useful for the MathItemBank project
3. **Design exploration page** — Card style comparisons could inform the community feed design
