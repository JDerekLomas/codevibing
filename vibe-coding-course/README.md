# Vibe Coding: A 2-Hour Beginner's Course

**Format:** Self-paced curriculum (also teachable in workshop format)
**Tool:** Claude Code (CLI)
**Audience:** Tech-comfortable non-coders — people who use computers confidently but have never written software
**Goal:** In 2 hours, build and deploy something real. Leave with the confidence and mental models to pursue 10-20 more hours independently.

---

## Philosophy

Vibe coding is not "learning to code." It's learning to *describe what you want* clearly enough that an AI builds it for you. The skills you're developing are:

- **Articulating intent** — saying what you want in plain language
- **Iterating through conversation** — refining by reacting to what you see
- **Reading the room** — recognizing when something is working vs. when to change direction
- **Shipping** — getting your creation in front of real people

These are closer to directing a film than writing a screenplay. You don't need to know how the camera works. You need to know what the shot should look like.

---

## Prerequisites

Before starting, you need:

1. **A computer** (Mac, Windows, or Linux)
2. **An Anthropic account** with API access or a Claude Max/Pro subscription
3. **Comfort with typing** and basic file/folder concepts
4. **Something you want to build** — even a vague idea. A personal page, a quiz, a tool for your work, a gift for a friend.

That's it. No coding experience. No computer science. No terminal expertise.

---

## Course Map

| Module | Time | What You Build | Key Concept |
|--------|------|----------------|-------------|
| 1. Setup & First Magic | 25 min | A personal webpage | *You describe, AI builds* |
| 2. The Conversation | 20 min | Iterate on your page | *Vibe coding is a dialogue* |
| 3. Your Own Project | 30 min | Something you actually want | *Start from desire, not possibility* |
| 4. When Things Break | 20 min | Debug and recover | *Errors are conversations* |
| 5. Ship It | 15 min | Deploy to the internet | *The web is your canvas* |
| 6. What's Next | 10 min | Your personal roadmap | *You have a superpower now* |

---

## Module 1: Setup & First Magic (25 min)

### 1.1 Install the tools (10 min)

You need two things installed: **Node.js** (the engine that runs web apps) and **Claude Code** (your AI collaborator).

**Install Node.js:**
- Go to [nodejs.org](https://nodejs.org)
- Download the LTS (Long Term Support) version
- Run the installer, accept all defaults

**Install Claude Code:**
- Open your terminal:
  - **Mac:** Open the app called "Terminal" (search for it in Spotlight with Cmd+Space)
  - **Windows:** Open "PowerShell" from the Start menu
  - **Linux:** You know where your terminal is
- Type this and press Enter:

```
npm install -g @anthropic-ai/claude-code
```

- Wait for it to finish (you'll see some text scrolling by — that's normal)
- Then type `claude` and press Enter
- It will walk you through signing in to your Anthropic account

**If something goes wrong:** Don't panic. Copy the error message, paste it into Claude (the chat version at claude.ai), and ask "I'm trying to install Claude Code and got this error. What should I do?" This is your first lesson in vibe coding: when in doubt, describe the problem to an AI.

### 1.2 Your first project (5 min)

Create a folder for your project and start Claude Code inside it:

```
mkdir my-first-site
cd my-first-site
claude
```

You're now in a conversation with Claude Code. It can create files, run commands, and build things — all from your descriptions.

### 1.3 The magic moment (10 min)

Type something like this (but make it yours — use your own name, interests, anything):

```
Build me a personal webpage about me. My name is [Your Name].
I'm interested in [your interests]. Make it look clean and modern
with a dark background. Use Next.js.
```

Claude Code will:
1. Create a project structure
2. Install dependencies (this takes a minute — that's normal)
3. Write the code
4. Offer to start the development server

When it asks to run `npm run dev`, say yes. Then open your browser to `http://localhost:3000`.

**You just built a website.** Look at it. It's real. It's running on your computer. You didn't write a single line of code.

> **Key concept: You describe, AI builds.** The quality of what you get depends on the quality of your description. But even vague descriptions produce something — and that something is a starting point.

---

## Module 2: The Conversation (20 min)

### 2.1 Your first iteration (10 min)

Your site probably looks decent but generic. Now make it *yours*. Look at the page in your browser and tell Claude Code what to change. Be as specific or as vague as you want:

**Specific requests work great:**
```
Make the heading font larger and add a subtle gradient from dark blue to black
in the background.
```

**Vague vibes also work:**
```
This feels too corporate. Make it warmer and more personal, like a cozy blog.
```

**Ambitious requests are fine too:**
```
Add an interactive section where visitors can click through my top 5 favorite
books with cover images and short reviews.
```

Try 3-4 iterations. Each time:
1. Look at the result in your browser (it updates automatically)
2. React honestly — what do you like? What feels off?
3. Tell Claude Code

### 2.2 The art of the follow-up (10 min)

Notice what happens in the conversation. You're not giving Claude Code a complete specification upfront. You're *reacting* to what you see and steering toward what you want. This is the core skill of vibe coding.

Some useful patterns:

| When you feel... | Say something like... |
|---|---|
| "This is close but not quite" | "I like the layout but the colors feel too bright. Can you make it more muted?" |
| "I don't know what I want" | "Show me three different visual styles for this section" |
| "This is too much" | "Simplify this. Remove the sidebar and focus on just the main content" |
| "I want something I saw somewhere" | "Make the navigation feel like Apple's website — minimal, lots of whitespace" |
| "Something is off but I can't name it" | "This doesn't feel right. The spacing feels cramped and the fonts don't match. Can you improve the typography and spacing?" |

> **Key concept: Vibe coding is a dialogue.** You don't need to know the answer before you start. You discover what you want by reacting to what you see. The AI is your collaborator, not your employee.

---

## Module 3: Your Own Project (30 min)

### 3.1 Choose your adventure (5 min)

Now build something you actually want. This is where vibe coding gets powerful — you're not following a tutorial, you're making something real.

Pick a project or bring your own idea. Here are starters ranked by complexity:

**Simpler (good for first time):**
- A quiz about a topic you know well
- A recipe collection page for your favorite dishes
- A countdown timer to an event you're excited about
- A personal link-in-bio page (like Linktree but yours)

**More ambitious (stretch goals):**
- A budget tracker with categories and a pie chart
- A flashcard app for something you're studying
- A portfolio showcasing your work (design, writing, photography)
- A simple game (trivia, word guess, memory match)

### 3.2 Start fresh (5 min)

Open a new terminal tab/window, create a new project, and start Claude Code:

```
mkdir my-project
cd my-project
claude
```

Describe what you want. Be specific about the *experience* you're imagining, not the technology:

```
I want to build a quiz app about [topic]. It should have 10 questions,
show one at a time, track the score, and show a results screen at the end
with a fun message based on how well you did. Make it feel playful and
colorful. Use Next.js.
```

### 3.3 Build in layers (20 min)

Don't try to describe everything upfront. Build in layers:

**Layer 1 — Get the core working (5-7 min):**
Start with the basic functionality. Does it do the main thing?

**Layer 2 — Make it look good (5-7 min):**
Now focus on design. Colors, spacing, fonts, layout.

**Layer 3 — Add delight (5-7 min):**
Animations, sound effects, dark mode, confetti on completion, share buttons — the things that make people smile.

This layering approach is important. If you try to describe everything at once, you'll get an average version of everything. If you build in layers, you can steer each layer based on what you see.

> **Key concept: Start from desire, not possibility.** Don't ask "what can I build?" Ask "what do I want?" You'll be surprised how often the answer is "yes, Claude Code can do that."

---

## Module 4: When Things Break (20 min)

### 4.1 Things will break — that's normal (5 min)

At some point you'll see:
- An error in the terminal (red text, scary-looking)
- A blank white page in the browser
- Something that looks completely wrong
- Claude Code stuck in a loop, retrying the same thing

This is normal. It happens to professional developers every day. The difference in vibe coding is that you have an AI that can usually fix its own mistakes.

### 4.2 The debugging conversation (10 min)

When something breaks, try these approaches in order:

**1. Just tell Claude Code what happened:**
```
The page is showing a blank white screen. Can you check what's wrong and fix it?
```

**2. If the error is in the terminal, Claude Code can already see it.** Just say:
```
Can you fix that error?
```

**3. If the same error keeps happening, give more context:**
```
This keeps breaking. Can you try a completely different approach?
Maybe use a simpler method.
```

**4. The nuclear option — start fresh on that feature:**
```
Let's scrap the chart component and rebuild it from scratch.
Keep it simple this time — just a basic bar chart, no animations.
```

### 4.3 Common situations and what to say

| What you see | What to say |
|---|---|
| Red error text in terminal | "Can you fix that error?" |
| Page won't load | "The page isn't loading. Can you check the dev server and fix any issues?" |
| Feature doesn't work as expected | "When I click the button, nothing happens. It should [describe expected behavior]" |
| Everything looks wrong | "Something went wrong with the styling. Can you check the CSS and fix the layout?" |
| Claude Code is going in circles | "Stop. Let's take a different approach to this. Instead of [what it's doing], try [simpler alternative]" |
| You're completely stuck | Copy the error, go to claude.ai, and ask for help there. Fresh eyes from a fresh conversation. |

### 4.4 Prevention (5 min)

A few habits that reduce breakage:

- **Small steps:** Ask for one thing at a time rather than five things at once
- **Check often:** Look at the browser after each change, not after ten changes
- **Save your wins:** When something is working well, say "This looks great. Let's commit this." Claude Code will save a checkpoint you can return to if something breaks later
- **Name what you want to keep:** "Don't change the header — I like it exactly as it is. Just modify the footer."

> **Key concept: Errors are conversations.** When something breaks, you're not stuck — you're just in a different kind of conversation. Describe what you see, describe what you expected, and let Claude Code figure out the fix.

---

## Module 5: Ship It (15 min)

### 5.1 Why deploy? (2 min)

Right now, your project only runs on your computer. Deploying puts it on the internet with a real URL you can share with anyone. This is the difference between "I made a thing" and "here, look at this thing I made."

### 5.2 Deploy with Vercel (8 min)

Vercel is a free hosting platform that works perfectly with Next.js projects.

**First time setup:**

1. Go to [vercel.com](https://vercel.com) and create a free account
2. Install the Vercel CLI. Tell Claude Code:

```
Install the Vercel CLI globally
```

3. Then tell Claude Code:

```
Deploy this project to Vercel production
```

Claude Code will run `vercel --prod` and walk you through connecting your Vercel account.

After a minute or two, you'll get a URL like `https://your-project.vercel.app`. Open it. **Your project is live on the internet.**

### 5.3 Share it (5 min)

Send the URL to a friend. Post it somewhere. Show someone.

This step matters more than you think. Sharing what you build creates a feedback loop that fuels your next project. Someone will say "cool, but can it do X?" and suddenly you have your next idea.

> **Key concept: The web is your canvas.** Deploying is not a technical hurdle — it's one command. The gap between "running on my laptop" and "live on the internet" is about 60 seconds.

---

## Module 6: What's Next (10 min)

### 6.1 What you just learned

In 2 hours, you:
- Set up a professional development environment
- Built a website by describing what you wanted
- Iterated through conversation to refine your vision
- Started a project from your own idea
- Debugged problems by describing them
- Deployed to the internet

These are the same steps every software project follows: setup, build, iterate, debug, ship. You just did them all.

### 6.2 Your next 10 hours

Here's a roadmap for going deeper, roughly in order:

**Hours 3-4: Build something for someone else**
Make something as a gift — a birthday page, a quiz for a friend, a tool for a coworker. Building for a real person with real feedback accelerates your learning.

**Hours 5-6: Add data persistence**
Ask Claude Code to add a database (Supabase or a simple JSON file). This unlocks apps that remember things — to-do lists, journals, trackers.

**Hours 7-8: Connect to APIs**
Ask Claude Code to integrate with external services — weather data, AI image generation, Spotify, Google Sheets. This is where projects start feeling like "real" apps.

**Hours 9-10: User accounts and authentication**
Add login/signup so different people can use your app with their own data. Claude Code handles the complexity — you just describe what you want.

### 6.3 Project ideas to grow your skills

| Project | What you'll learn |
|---|---|
| Personal blog with markdown posts | File handling, routing, content management |
| Habit tracker with weekly charts | Data storage, visualization, date logic |
| AI chatbot for a specific topic | API integration, streaming responses, conversation design |
| Multiplayer trivia game | Real-time communication, game state, scoring |
| Small business landing page | Forms, email integration, responsive design, SEO |
| Personal finance dashboard | Data visualization, calculations, CSV import |

### 6.4 Tips from experienced vibe coders

1. **Start every project with "Use Next.js"** — it's the best-supported framework in Claude Code and handles most of the infrastructure for you.

2. **Commit early and often.** Say "commit this with message 'working quiz page'" whenever something is in a good state. It's your save button.

3. **Screenshots are powerful.** If you see a design you like on another site, take a screenshot and describe what you like about it to Claude Code. "Make my navigation look like this" works surprisingly well.

4. **The /clear command is your friend.** If a conversation gets long and Claude Code starts getting confused, type `/clear` and start fresh. Your files are saved — you won't lose anything.

5. **You don't need to understand the code.** But if you're curious, ask: "Explain what this file does in plain language." Over time, you'll start recognizing patterns. That's learning to code as a side effect of building things you want.

6. **Join a community.** Vibe coding is more fun with other people. Share what you build. Ask for feedback. See what others are making.

### 6.5 When to reach for more

Vibe coding with Claude Code will take you surprisingly far. But some things are still better done with traditional development skills or specialized tools:

- **Mobile apps** — use Expo/React Native (Claude Code can help, but deployment is more complex)
- **Heavy data processing** — Python scripts might be better than web apps
- **Anything requiring very specific visual design** — Figma + a human designer, then implement with Claude Code
- **Production systems handling money or sensitive data** — get a developer to review security

---

## Appendix A: Terminal Survival Guide

You don't need to be a terminal expert. Here are the only commands you need:

| Command | What it does |
|---|---|
| `cd folder-name` | Go into a folder |
| `cd ..` | Go back up one folder |
| `ls` | List files in current folder |
| `mkdir folder-name` | Create a new folder |
| `claude` | Start Claude Code |
| `Ctrl+C` | Stop whatever is running |
| `Ctrl+D` or type `exit` | Close Claude Code / close terminal |

That's it. Claude Code handles everything else.

## Appendix B: Glossary

| Term | What it means in practice |
|---|---|
| **Terminal / Command Line** | The text-based window where you type commands |
| **Node.js** | The engine that runs JavaScript outside a browser. You installed it so your projects can run |
| **npm** | A tool that installs packages (libraries of code other people wrote). Comes with Node.js |
| **Next.js** | A framework for building websites. It handles routing, page loading, and other plumbing |
| **Dev server** | A local version of your site running on your computer for testing (localhost:3000) |
| **Deploy** | Putting your site on the internet so anyone can access it |
| **Vercel** | A free hosting service that makes deployment one command |
| **Commit** | Saving a snapshot of your code. Like "Save As" but for your whole project |
| **Component** | A reusable piece of a webpage (a button, a card, a navigation bar) |
| **API** | A way for your app to talk to other services (weather data, AI, databases) |

## Appendix C: Troubleshooting

**"command not found: claude"**
Node.js isn't in your PATH, or the install didn't complete. Try closing and reopening your terminal, then run `npm install -g @anthropic-ai/claude-code` again.

**"EACCES permission denied"**
On Mac/Linux, you may need to fix npm permissions. Ask Claude (at claude.ai) to help — paste the full error message.

**The dev server won't start**
Usually means another project is already using port 3000. Either stop the other project (Ctrl+C in its terminal) or ask Claude Code: "Start the dev server on a different port."

**"Module not found" errors**
Dependencies weren't installed properly. Tell Claude Code: "Run npm install and fix any dependency issues."

**The page looks fine on your laptop but weird on your phone**
Tell Claude Code: "Make this responsive so it looks good on mobile screens too."

---

*This course was designed for [CodeVibing](https://codevibing.com). Built with the belief that everyone should be able to bring their ideas to life on the web.*
