# Project Documentation Index

**1,789 markdown files** indexed across Derek's projects.

## How to Search

```bash
# Search by keyword
grep -i "keyword" /Users/dereklomas/CodeVibing/codevibing/docs/PROJECT_DOCS_INDEX.tsv

# Search by project
grep "^projectname|" /Users/dereklomas/CodeVibing/codevibing/docs/PROJECT_DOCS_INDEX.tsv

# Full-text search across all docs
grep -r -l -i "search term" /Users/dereklomas/*/README.md /Users/dereklomas/*/*.md 2>/dev/null
```

## Document Counts by Project

| Project | Docs | Description |
|---------|------|-------------|
| translate | 575 | Translation pipeline documentation |
| playpowerlearn-v1-archive | 132 | Archived learning platform |
| AIED | 121 | AI in Education research |
| CodeVibing | 90 | Component sharing platform |
| .claude | 87 | Claude Code skills, plans, handoffs |
| secondrenaissance | 84 | Latin literature translation |
| playpowerlearn | 74 | Learning platform v2 |
| lilbookies | 69 | Reading/phonics books |
| sourcelibrary-v2 | 46 | Historical text digitization |
| milo | 27 | XWHYSI music site |
| minibooks | 16 | Mini book generation |
| playpowergames | 14 | Educational games |
| leotrottier | 14 | Client project |
| sourcelibrary | 13 | Source Library v1 |
| mcqmcp / MCQMCP-monorepo | 26 | MCQ assessment system |
| babysees | 12 | Visual vocabulary books |
| CardDecks | 12 | AI-generated card decks |
| ancientwisdomfundraising | 11 | Embassy fundraising |
| morniplus | 9 | Fashion Archaeology / Garden of Eden |
| upgrade-hosting | 8 | Hosting infrastructure |
| etherhill | 6 | Etherhill project |
| mulerouter-skills-dev | 5 | MuleRouter API skill |
| socratic-prototype | 4 | Socratic dialogue prototype |
| quests / quests-app | 7 | STEAMQuest games |
| clawdbot | 4 | Claude Code workshop infra |

## Key Documentation Files

### Project READMEs
- `/Users/dereklomas/sourcelibrary-v2/README.md` - Source Library
- `/Users/dereklomas/secondrenaissance/README.md` - Second Renaissance
- `/Users/dereklomas/xwhysi/README.md` - XWHYSI
- `/Users/dereklomas/plasmacell/README.md` - PlasmaCell 3D
- `/Users/dereklomas/fractalviewer/README.md` - Fractal Breeder
- `/Users/dereklomas/simgov/README.md` - SimGov 3D City
- `/Users/dereklomas/CardDecks/README.md` - Card Deck System
- `/Users/dereklomas/lilbookies/README.md` - LilBookies Phonics
- `/Users/dereklomas/babysees/CLAUDE.md` - BabySees Visual Books

### Brand/Concept Docs
- `/Users/dereklomas/morniplus/docs/GARDEN-OF-EDEN-CONCEPT.md` - Fashion Archaeology
- `/Users/dereklomas/morniplus/docs/MULEROUTER-PROMPTS.md` - Garden of Eden imagery

### Infrastructure
- `/Users/dereklomas/clawdbot/.claude/handoffs/2026-01-30-workshop-grimoire.md` - Claude Workshop

### Skills & Tools
- `/Users/dereklomas/.claude/skills/` - All Claude Code skills
- `/Users/dereklomas/claude-code-skills/` - Shareable skills

## Index Format

The TSV file (`PROJECT_DOCS_INDEX.tsv`) has columns:
```
project|filepath|title
```

Example:
```
sourcelibrary-v2|/Users/dereklomas/sourcelibrary-v2/README.md|Source Library v2
morniplus|/Users/dereklomas/morniplus/docs/GARDEN-OF-EDEN-CONCEPT.md|Garden of Eden - Fashion Archaeology Brand Concept
```
