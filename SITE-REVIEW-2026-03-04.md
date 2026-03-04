# CodeVibing Ecosystem — Site Review & Alignment Audit
**Date**: 2026-03-04

## The Three Doors

| Site | URL | Purpose | Stack |
|------|-----|---------|-------|
| **codevibing.com** | codevibing.com | Community platform — feed, profiles, groups, bots | Next.js 14, Supabase, API-key auth |
| **learnvibecoding** | learnvibecoding.vercel.app | Structured curriculum + quiz engine | Next.js 16, React 19, MDX, Supabase |
| **ai-growth.net** | ai-growth.net | Enterprise team upskilling (same codebase as learnvibecoding) | Same as above, audience-routed |

---

## Current State: What Each Site Actually Does

### codevibing.com
**Hero**: "A place for people building things with AI"

**Built & working:**
- Activity feed with posts and threaded replies
- 5 community groups (General, Showcase, Three.js, AI Tools, Data Viz)
- User profiles with two themes (Clean + MySpace nostalgia)
- Friend system (request/accept)
- Bot accounts with dedicated /bots page
- Zero-friction onboarding (claim username → get API key)
- Profile customization (custom CSS, HTML, blinkies, songs, moods)
- Claude Code skill for posting (`claude skill add JDerekLomas/codevibing-skill`)
- 9 members, ~20 posts

**Not built:**
- Notifications (no way to know someone replied or friend-requested you)
- DMs / direct messaging
- Search (content or people)
- Community creation UI (API-only)
- Profile editing UI (API exists, no form)
- Image uploads in posts
- Content discovery / trending / algorithmic feed
- Moderation tools

### learnvibecoding.vercel.app
**Hero**: "Learn Vibe Coding — A structured curriculum for building with AI"

**Built & working:**
- 11 MDX curriculum modules (4 entry points + 4 core + 3 advanced)
- 23 core concepts organized by 5 themes with concept roadmap visualization
- Quiz engine: 96 items across 11 topics, two modes (assess/practice)
- AI quiz chatbot (streaming Claude responses, 30 hardcoded items)
- Skill map with topic progress tracking
- Text-based AI discovery (DesireEngine → Claude Sonnet streaming)
- Voice discovery (ElevenLabs WebRTC, 3-phase flow)
- Journey page (5-step: Discover → Assess → Learn → Practice → Share)
- Solo learner progress in localStorage

**Not built:**
- User accounts / persistent identity
- Community features (links out to codevibing.com)
- Portfolio / project showcase
- Progress sync across devices (localStorage-only for solo)

### ai-growth.net
**Hero**: "Ready to 10x Your Organization?"

**Built & working (same codebase as learnvibecoding):**
- Corporate landing with problem/solution pitch
- Team creation → invite link → member join flow
- Manager dashboard (members × steps grid, real-time refresh)
- Progress tracking (Supabase for team members)
- 5-step journey with team context
- Assessment quiz integration

**Not built:**
- Authentication (uses semi-private slugs + localStorage)
- Analytics / reporting beyond dashboard grid
- Onboarding email or notifications
- Integration with codevibing.com identity

---

## Alignment Review Against Project Vision

### Priority 1: LEARN
> "Structured content AND learning through participation. Both matter."

| Dimension | Status | Notes |
|-----------|--------|-------|
| Structured curriculum | **Strong** | 11 modules, clear progression, good MDX content |
| Quiz / assessment | **Strong** | 96 items, confidence-based, two modes |
| Concepts framework | **Strong** | 23 concepts, 5 themes, roadmap visualization |
| AI-driven discovery | **Strong** | DesireEngine + voice discovery both functional |
| Learning through participation | **Weak** | No mechanism on codevibing.com to surface learning moments from the feed. No "TIL" format, no mentorship, no study groups. The feed is a firehose, not a learning environment. |
| Cross-site learning loop | **Weak** | Journey "Share" step dead-ends at codevibing.com with no deep link. No way to bring community learning back into curriculum progress. |

**Verdict**: Formal learning is excellent. Community learning is barely started. The two halves don't talk to each other.

### Priority 2: COMMUNITY
> "A place to belong, find your people, get help and encouragement."

| Dimension | Status | Notes |
|-----------|--------|-------|
| Feed / posting | **Functional** | Works, but 9 members means empty-room feeling |
| Profiles | **Strong** | Two themes, deep customization, personality-forward |
| Groups | **Basic** | 5 communities exist, threaded replies work, but no activity in most |
| Friends | **Basic** | Request/accept exists, no engagement loop (no notifications, no "friend activity" feed) |
| Belonging signals | **Weak** | No welcome message, no onboarding tour, no "here's who to follow" |
| Help & encouragement | **Weak** | No Q&A format, no upvotes/reactions, no way to mark "solved", no way to say "great job" |
| Discovery | **Missing** | No search, no trending, no recommendations, no "people like you" |

**Verdict**: The infrastructure for community exists. The *feeling* of community doesn't yet. At 9 members, every missing feature is amplified — there's no critical mass to paper over UX gaps.

### Priority 3: SHARE
> "Show what you're building, celebrate the process not just the product."

| Dimension | Status | Notes |
|-----------|--------|-------|
| Post to feed | **Functional** | Text posts with optional project links |
| Project showcase | **Basic** | Homepage "What People Are Building" section, but no dedicated gallery |
| Build logs | **Missing** | No structured "how I built this" format |
| Images / media | **Missing** | No image upload in posts or profiles (avatar is URL-based) |
| Process celebration | **Missing** | No before/after, no session replays, no progress milestones |
| Cross-site sharing | **Weak** | Journey "Share" step just links to codevibing.com, no integration |

**Verdict**: Sharing is the thinnest part. The vision says "celebrate the process not just the product" but the tools only support plain text posts. No visual, no narrative structure, no celebration mechanics.

### Priority 4: AGENTS
> "Bots and AI agents participate too (infrastructure, not the pitch)."

| Dimension | Status | Notes |
|-----------|--------|-------|
| Bot accounts | **Built** | auto_created flag, /bots page, distinct display |
| Bot posting API | **Built** | API-first architecture supports it |
| Bot provisioning | **Partial** | Endpoint exists, no docs or UI flow |
| Active bots | **None** | No bots posting in the feed. Zero visible agent activity. |
| Agent personalities | **Missing** | Profile supports bot_name but no bots use it |
| Claude Code skill | **Built** | `codevibing-skill` for posting from terminal |

**Verdict**: The plumbing is ready but nobody turned the water on. Zero agent activity visible to users.

---

## Cross-Site Alignment Issues

### 1. Identity Fragmentation
Three separate identity systems:
- **codevibing.com**: API-key auth, `cv_` tokens, Supabase `cv_users` table
- **learnvibecoding (solo)**: Anonymous, localStorage-only, no account
- **ai-growth.net (teams)**: Name-in-localStorage, Supabase `team_members` table

A user who learns on learnvibecoding, joins a team on ai-growth.net, and posts on codevibing.com has three unlinked identities. There's no way to connect "I completed the curriculum" with "here's my codevibing profile."

### 2. Navigation Ping-Pong
- codevibing.com navbar: "Learn" → links to learnvibecoding.vercel.app (external)
- learnvibecoding navbar: "Community" → links to codevibing.com (external)

Users bounce between domains with no shared context, no shared session, no continuity. This breaks the flywheel described in the vision.

### 3. The "Share" Step Dead End
The journey's 5th step (Share) says "Share on codevibing.com" but:
- No deep link to post about your project
- No way to pre-fill a post with your quiz results or project
- No callback to update journey progress after sharing
- Solo learners must manually click "Mark as done"

### 4. Small Community, Big Surface Area
9 members across 5 communities = most communities feel dead. The feed has ~20 posts total. With this population:
- Communities dilute rather than concentrate activity
- No algorithmic feed means new users see old content
- Friend system has no network to leverage

---

## What's Actually Good (Don't Break This)

1. **Curriculum quality** — The 11 modules are thoughtful, well-written, and structurally sound. The entry-point system (4 doors based on background) is excellent UX.

2. **Concept framework** — 23 concepts with themes, taglines, and memes. This is a unique pedagogical asset. "The Taste Gap", "Context Rot", "Dark Flow" — these are memorable and teachable.

3. **Zero-friction onboarding on codevibing.com** — Claim username, done. No email, no password, no OAuth flow. This is perfect for the audience.

4. **Profile customization depth** — MySpace theme, custom CSS/HTML, blinkies, songs. This isn't just features — it's personality and self-expression, which is the seed of community.

5. **DesireEngine** — The AI discovery conversation is genuinely good. The system prompt's "sharp curious friend" personality is differentiated. This is the best onramp to "know what you want to build."

6. **API-first architecture** — Everything on codevibing.com can be done via API. This means bots, Claude Code skill, and third-party integrations can all participate without browser access.

7. **Team dashboard** — Simple, functional, actually useful for a manager tracking 5-10 people through a learning journey.

---

## Recommendations (Prioritized)

### High — Fix the flywheel disconnects

1. **Unify identity** — At minimum, let codevibing.com API keys work as auth on learnvibecoding. "Log in with your codevibing account" gives curriculum progress a persistent home and connects sharing to learning.

2. **Close the Share loop** — Deep link from journey Share step to codevibing.com/compose?context=journey-completion (or similar). Pre-fill with "I just completed [step]. Here's what I built: ___". Update journey progress via callback.

3. **Add reactions/heartbeats** — A simple heart/upvote on posts creates the minimum engagement loop. Without it, posting feels like shouting into a void.

### Medium — Make community feel alive

4. **Activate 2-3 bots** — Post daily prompts, welcome new members, highlight interesting projects. This creates the illusion of activity while the community grows. The infrastructure is ready; just needs content + a cron job.

5. **Consolidate communities into one feed** — At 9 members, 5 separate communities fragments the already-thin activity. One unified feed with topic tags would feel more alive. Bring back community pages later when there are 50+ members.

6. **Add basic notifications** — Even just "someone replied to your post" via a badge counter on the site. Without this, threaded conversations can't happen because nobody knows they got a reply.

### Lower — Strengthen what works

7. **Image support in posts** — Even just pasting a URL that auto-embeds. Build logs and project showcases need visuals.

8. **"How I Built This" post template** — Structured format: what I built, tools I used, what I learned, link to project. This serves both Share and Learn priorities.

9. **Connect quiz results to skill map on codevibing profile** — "dereklomas scored 8/10 on Prompt Engineering" displayed on profile bridges the two sites and creates social proof for learning.

10. **Onboarding flow on codevibing.com** — After claiming username: suggest 3 people to follow, 1 community to join, prompt to introduce yourself. Currently post-signup is a blank page.
