import type { QuizItem } from "./types.js";

export const quizItems: QuizItem[] = [
  // ── Topic 1: Vibecoding Basics ──────────────────────────────────
  {
    id: "basics-1",
    topic: "Vibecoding Basics",
    question: "What is vibecoding?",
    options: [
      "Writing code by describing what you want to an AI and iterating on the output",
      "A meditation technique for programmers to improve focus",
      "A visual programming language based on color-coded blocks",
      "A method of pair programming where both developers code silently",
    ],
    correctIndex: 0,
    explanation:
      "Vibecoding is the practice of building software by describing what you want to an AI coding assistant (like Claude) and iterating on the generated code until it works. The term was coined by Andrej Karpathy in early 2025.",
  },
  {
    id: "basics-2",
    topic: "Vibecoding Basics",
    question: "Which of these is a primary tool used for vibecoding?",
    options: [
      "Microsoft Excel with VBA macros",
      "Claude Code or Cursor with an AI model",
      "Adobe Dreamweaver",
      "Scratch visual programming",
    ],
    correctIndex: 1,
    explanation:
      "Claude Code (CLI) and Cursor (AI-enhanced IDE) are leading vibecoding tools. They connect to large language models that can generate, edit, and debug code based on natural language instructions.",
  },
  {
    id: "basics-3",
    topic: "Vibecoding Basics",
    question:
      'What does "iterate until it works" mean in the context of vibecoding?',
    options: [
      "Run a for-loop until the program passes all tests",
      "Keep refining your prompts and reviewing AI output until the code does what you want",
      "Copy-paste code from Stack Overflow until something compiles",
      "Use a genetic algorithm to evolve the code automatically",
    ],
    correctIndex: 1,
    explanation:
      "Vibecoding is an iterative conversation: you describe what you want, review what the AI produces, point out what's wrong or missing, and keep going until the result matches your vision. Each cycle refines the output.",
  },
  {
    id: "basics-4",
    topic: "Vibecoding Basics",
    question: "What is the human's primary role in vibecoding?",
    options: [
      "Writing all the code manually while the AI watches",
      "Providing clear intent, reviewing output, and making creative decisions",
      "Only fixing bugs that the AI introduces",
      "Converting AI-generated pseudocode into real code",
    ],
    correctIndex: 1,
    explanation:
      "In vibecoding, the human is the director — you decide what to build, communicate your vision clearly, evaluate whether the output is right, and steer the AI toward your goal. You don't need to write every line, but you need to know what good looks like.",
  },
  {
    id: "basics-5",
    topic: "Vibecoding Basics",
    question: "When should you probably NOT use vibecoding?",
    options: [
      "Building a personal project or prototype",
      "Writing safety-critical systems like medical device firmware",
      "Creating a portfolio website",
      "Making a tool to automate a tedious task",
    ],
    correctIndex: 1,
    explanation:
      "Vibecoding is great for prototypes, personal projects, and tools where you can test and iterate. But safety-critical systems (medical, aviation, financial) require formal verification, code review, and accountability that goes beyond AI generation.",
  },
  {
    id: "basics-6",
    topic: "Vibecoding Basics",
    question: "What is a CLAUDE.md file?",
    options: [
      "A markdown file with instructions that Claude reads at the start of every session",
      "A configuration file for the Claude desktop application",
      "The license file required for using Claude commercially",
      "A log file where Claude records its conversation history",
    ],
    correctIndex: 0,
    explanation:
      "CLAUDE.md is a special markdown file you place in your project root (or ~/.claude/CLAUDE.md for global settings). Claude Code reads it automatically and follows the instructions inside — things like coding style, project context, and workflow preferences.",
  },
  {
    id: "basics-7",
    topic: "Vibecoding Basics",
    question: "What's the biggest advantage of vibecoding for beginners?",
    options: [
      "It eliminates the need to ever learn programming concepts",
      "It lets you build working software while learning, instead of studying theory first",
      "It guarantees bug-free code every time",
      "It replaces the need for any design or planning",
    ],
    correctIndex: 1,
    explanation:
      "Vibecoding flips the traditional learning model: instead of studying for months before building anything, you start building immediately and learn concepts as they come up. You still learn — but through doing rather than just reading.",
  },
  {
    id: "basics-8",
    topic: "Vibecoding Basics",
    question: "Which of these best describes the vibecoding workflow?",
    options: [
      "Write a complete specification, then generate all code at once",
      "Describe → Generate → Review → Refine → Repeat",
      "Let the AI decide what to build based on trending repositories",
      "Record yourself explaining the app, and AI transcribes it into code",
    ],
    correctIndex: 1,
    explanation:
      "The vibecoding loop is: describe what you want (prompt), let the AI generate code, review the output, refine your instructions, and repeat. Each cycle gets you closer to your goal. Small, focused iterations work better than trying to generate everything at once.",
  },
  {
    id: "basics-9",
    topic: "Vibecoding Basics",
    question: "What happens when AI-generated code has a bug?",
    options: [
      "You need to find and fix it manually — the AI can't help with bugs",
      "You describe the bug to the AI and ask it to fix it",
      "You must start over from scratch with a new prompt",
      "The AI automatically detects and fixes all bugs before showing you the code",
    ],
    correctIndex: 1,
    explanation:
      "When you encounter a bug in vibecoded software, you describe it to the AI: paste the error message, explain what's happening vs. what you expected, and ask it to fix it. This is one of vibecoding's strengths — debugging through conversation.",
  },
  {
    id: "basics-10",
    topic: "Vibecoding Basics",
    question: "Who coined the term 'vibecoding'?",
    options: [
      "Sam Altman, CEO of OpenAI",
      "Andrej Karpathy, AI researcher and former Tesla AI director",
      "Dario Amodei, CEO of Anthropic",
      "Linus Torvalds, creator of Linux",
    ],
    correctIndex: 1,
    explanation:
      "Andrej Karpathy coined 'vibe coding' in a February 2025 post, describing it as a way of coding where 'you fully give in to the vibes, embrace exponentials, and forget that the code even exists.' The term quickly caught on in the developer community.",
  },

  // ── Topic 2: Working with Claude ────────────────────────────────
  {
    id: "claude-1",
    topic: "Working with Claude",
    question: "What makes a prompt effective for code generation?",
    options: [
      "Being as vague as possible so the AI has creative freedom",
      "Being specific about what you want, including context, constraints, and examples",
      "Using technical jargon exclusively to show expertise",
      "Writing the prompt in a programming language instead of English",
    ],
    correctIndex: 1,
    explanation:
      "Effective prompts are specific: describe what you want built, what technology to use, any constraints or requirements, and ideally show examples of desired behavior. Context helps Claude make better decisions about architecture and implementation.",
  },
  {
    id: "claude-2",
    topic: "Working with Claude",
    question: "When should you give Claude MORE context?",
    options: [
      "Never — Claude works best with minimal information",
      "When you're starting a new feature or working with unfamiliar code",
      "Only when Claude explicitly asks for more context",
      "When you want the response to be longer",
    ],
    correctIndex: 1,
    explanation:
      "Give Claude more context when starting something new, working with complex existing code, or when the AI's output isn't matching your expectations. Share relevant files, explain your architecture, and describe the broader goal. More context = better results.",
  },
  {
    id: "claude-3",
    topic: "Working with Claude",
    question: "What's the best way to debug AI-generated code that isn't working?",
    options: [
      "Delete everything and start over with a completely different approach",
      "Share the error message and describe expected vs. actual behavior",
      "Try adding random console.log statements yourself",
      "Switch to a different AI model and hope for better results",
    ],
    correctIndex: 1,
    explanation:
      "The most effective debugging approach is to share the exact error message, describe what the code should do vs. what it actually does, and let Claude analyze the problem. Copy-paste the error — don't paraphrase it. Claude can often spot the issue immediately with good error context.",
  },
  {
    id: "claude-4",
    topic: "Working with Claude",
    question: "What is Claude Code?",
    options: [
      "A web-based code editor similar to VS Code",
      "An agentic command-line tool that can read, write, and run code in your project",
      "A GitHub bot that automatically reviews pull requests",
      "A plugin for Xcode that adds AI autocomplete",
    ],
    correctIndex: 1,
    explanation:
      "Claude Code is Anthropic's CLI tool that gives Claude direct access to your terminal, filesystem, and development tools. It can read your codebase, write files, run commands, and make git commits — acting as an AI pair programmer right in your terminal.",
  },
  {
    id: "claude-5",
    topic: "Working with Claude",
    question: "What should you do when Claude's output isn't quite right?",
    options: [
      "Accept it as-is — AI output is final and shouldn't be questioned",
      "Tell Claude specifically what's wrong and ask it to adjust",
      "Manually rewrite all the code yourself",
      "Report it as a bug to Anthropic support",
    ],
    correctIndex: 1,
    explanation:
      "Vibecoding is a conversation. When the output isn't right, tell Claude what needs to change: 'The button should be blue, not red' or 'This function handles errors but it should retry first.' Specific feedback leads to quick corrections.",
  },
  {
    id: "claude-6",
    topic: "Working with Claude",
    question: "Why is it important to review AI-generated code before shipping?",
    options: [
      "It's not important — AI code is always correct",
      "To catch bugs, security issues, and logic errors that the AI might have introduced",
      "Only to add comments — the code itself is always fine",
      "To convert it from AI syntax to normal syntax",
    ],
    correctIndex: 1,
    explanation:
      "AI-generated code can contain bugs, security vulnerabilities, or subtle logic errors. Always review what the AI produces: does it handle edge cases? Are there hardcoded values that should be configurable? Could user input cause problems? You're the quality gate.",
  },
  {
    id: "claude-7",
    topic: "Working with Claude",
    question: "What's a good strategy for building something complex with AI?",
    options: [
      "Describe the entire application in one long prompt",
      "Break it into small pieces and build incrementally, testing as you go",
      "Let the AI design the architecture with no human input",
      "Generate the entire codebase first, then test everything at the end",
    ],
    correctIndex: 1,
    explanation:
      "Complex projects work best when broken into small, testable pieces. Build the foundation first, verify it works, then add features one at a time. This 'incremental' approach catches problems early and keeps each AI interaction focused and manageable.",
  },
  {
    id: "claude-8",
    topic: "Working with Claude",
    question: "What's the purpose of the /compact command in Claude Code?",
    options: [
      "It compresses your project files to save disk space",
      "It summarizes the conversation to free up context window space",
      "It minifies your JavaScript code for production",
      "It removes all comments from your codebase",
    ],
    correctIndex: 1,
    explanation:
      "The /compact command summarizes your conversation history so Claude can keep working within its context window limit. Use it when you've been working for a while and Claude starts losing track of earlier context. It preserves the key decisions and current state.",
  },
  {
    id: "claude-9",
    topic: "Working with Claude",
    question:
      "How should you handle it when Claude says it can't do something?",
    options: [
      "Give up immediately — if Claude says it can't, it truly can't",
      "Rephrase or simplify the request, or break it into smaller steps",
      "Switch to a completely different programming language",
      "Add 'please try harder' to your prompt",
    ],
    correctIndex: 1,
    explanation:
      "When Claude says it can't do something, try rephrasing your request, providing more context, or breaking the task into smaller steps. Sometimes the issue is ambiguity in your prompt, not a fundamental limitation. A different angle often works.",
  },
  {
    id: "claude-10",
    topic: "Working with Claude",
    question: "What's the role of CLAUDE.md in a vibecoding workflow?",
    options: [
      "It's optional documentation for other developers",
      "It configures Claude's behavior for your specific project — like persistent instructions",
      "It's a required file for Claude Code to start up",
      "It stores your API key for authenticating with Claude",
    ],
    correctIndex: 1,
    explanation:
      "CLAUDE.md acts as persistent instructions for Claude in your project. Put your coding style preferences, project structure notes, deployment commands, and workflow rules there. Claude reads it at the start of every session, so you don't have to repeat yourself.",
  },

  // ── Topic 3: Shipping Your Project ──────────────────────────────
  {
    id: "ship-1",
    topic: "Shipping Your Project",
    question: "What is Vercel?",
    options: [
      "A JavaScript testing framework",
      "A cloud platform for deploying web applications with zero configuration",
      "A version control system similar to Git",
      "A database service for storing user data",
    ],
    correctIndex: 1,
    explanation:
      "Vercel is a cloud platform that makes deploying web apps incredibly easy. Connect your GitHub repo or run 'vercel --prod' from your terminal, and your site is live with HTTPS, a CDN, and automatic deployments on push. It's the fastest path from code to live URL.",
  },
  {
    id: "ship-2",
    topic: "Shipping Your Project",
    question: "What is a package.json file?",
    options: [
      "A file that tracks your shipping address for physical code packages",
      "The manifest that lists your project's dependencies, scripts, and metadata",
      "A JSON database for storing user profiles",
      "A configuration file for your computer's package manager (like Homebrew)",
    ],
    correctIndex: 1,
    explanation:
      "package.json is the heart of any Node.js/JavaScript project. It lists your dependencies (libraries your code needs), scripts (commands like 'npm run build'), and metadata (name, version, description). When someone runs 'npm install', this file tells npm what to download.",
  },
  {
    id: "ship-3",
    topic: "Shipping Your Project",
    question: "What does 'git commit' do?",
    options: [
      "Uploads your code to GitHub",
      "Saves a snapshot of your staged changes with a message describing what changed",
      "Deletes all local changes and reverts to the last save",
      "Shares your code with everyone on your team",
    ],
    correctIndex: 1,
    explanation:
      "A git commit creates a permanent snapshot of your staged changes in your local repository. Think of it as a save point with a description. It doesn't push to GitHub — that's 'git push'. Good commit messages describe why you made the change, not just what changed.",
  },
  {
    id: "ship-4",
    topic: "Shipping Your Project",
    question: "What does 'git push' do?",
    options: [
      "Creates a new branch for your feature",
      "Uploads your local commits to a remote repository like GitHub",
      "Merges someone else's changes into your code",
      "Stages files for the next commit",
    ],
    correctIndex: 1,
    explanation:
      "git push sends your local commits to a remote repository (usually GitHub). After committing locally, push makes your changes available to others and triggers any CI/CD pipelines or deployments you've configured.",
  },
  {
    id: "ship-5",
    topic: "Shipping Your Project",
    question: "What makes a good project README?",
    options: [
      "A complete copy of your source code with comments",
      "A clear description of what the project does, how to run it, and a screenshot",
      "Just the project name and a license file",
      "An auto-generated list of every file in the repository",
    ],
    correctIndex: 1,
    explanation:
      "A good README answers three questions: What is this? How do I use it? What does it look like? Include a brief description, setup instructions, a screenshot or demo link, and any important notes. People decide in seconds whether to explore further — make that first impression count.",
  },
  {
    id: "ship-6",
    topic: "Shipping Your Project",
    question: "What is 'npm install' used for?",
    options: [
      "Installing Node.js on your computer",
      "Downloading and installing the dependencies listed in package.json",
      "Publishing your package to the npm registry",
      "Updating your operating system packages",
    ],
    correctIndex: 1,
    explanation:
      "npm install reads your package.json and downloads all the libraries your project depends on into a node_modules folder. When you clone a project or add a new dependency, this is the command that fetches everything your code needs to run.",
  },
  {
    id: "ship-7",
    topic: "Shipping Your Project",
    question: "Why should you use environment variables for API keys?",
    options: [
      "They make your code run faster",
      "They keep secrets out of your source code so they don't leak on GitHub",
      "They're required by all APIs — keys won't work otherwise",
      "They automatically encrypt your database",
    ],
    correctIndex: 1,
    explanation:
      "Environment variables keep secrets (API keys, database passwords) out of your code. If you hardcode a secret and push to GitHub, anyone can see it. Use .env files locally (add them to .gitignore!) and your hosting platform's environment variable settings for production.",
  },
  {
    id: "ship-8",
    topic: "Shipping Your Project",
    question: "What is the node_modules folder?",
    options: [
      "A folder where you should write your custom Node.js modules",
      "Where npm installs your project's dependency packages",
      "A backup folder that Git creates automatically",
      "A folder containing your project's compiled output",
    ],
    correctIndex: 1,
    explanation:
      "node_modules is where npm puts all the packages your project depends on. It can be huge (hundreds of MBs), which is why it's always in .gitignore — you never commit it to Git. Anyone can recreate it by running 'npm install' from your package.json.",
  },
  {
    id: "ship-9",
    topic: "Shipping Your Project",
    question:
      "What command deploys a Next.js project to Vercel from the terminal?",
    options: [
      "npm run deploy",
      "vercel --prod",
      "git deploy production",
      "next build --deploy",
    ],
    correctIndex: 1,
    explanation:
      "Running 'vercel --prod' from your project directory deploys to Vercel's production environment. It builds your project on Vercel's servers (which are much faster than local builds) and gives you a live URL. It's the fastest way to go from local code to a live website.",
  },
  {
    id: "ship-10",
    topic: "Shipping Your Project",
    question: "What is .gitignore used for?",
    options: [
      "Ignoring Git errors so they don't stop your workflow",
      "Telling Git which files and folders to NOT track or commit",
      "Hiding files from other developers on your team",
      "Preventing Git from being installed on your computer",
    ],
    correctIndex: 1,
    explanation:
      "A .gitignore file tells Git which files and folders to skip. You typically ignore node_modules (too large), .env files (contain secrets), build outputs (can be regenerated), and OS files (.DS_Store). This keeps your repo clean and your secrets safe.",
  },
];

export function getQuestionsByTopic(topic?: string): QuizItem[] {
  if (!topic) return quizItems;
  return quizItems.filter(
    (q) => q.topic.toLowerCase() === topic.toLowerCase()
  );
}

export function pickQuizQuestions(
  count: number = 7,
  topic?: string
): QuizItem[] {
  const pool = getQuestionsByTopic(topic);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const topics = [
  "Vibecoding Basics",
  "Working with Claude",
  "Shipping Your Project",
] as const;
