# AILiteracy Learning Program

Welcome! This folder contains a structured learning program to help you understand the tools and approaches used in the AILiteracy project.

## What You're Building

AILiteracy is a **conversational learning platform** that teaches AI literacy through guided conversations. Think of it as a customizable ChatGPT clone designed specifically for education.

## Tech Stack Overview

### Backend: FastAPI (Python)
- **What it is**: A modern, fast Python web framework for building APIs
- **Why it's great**: Automatic API documentation, type hints, async support
- **Your use**: Handles chat requests and serves the OpenAI API

### AI: OpenAI API
- **What it is**: Access to GPT models for conversational AI
- **Your use**: Powers the intelligent responses in your learning modules

### Frontend: Vanilla JavaScript
- **What it is**: Pure JavaScript without frameworks (React, Vue, etc.)
- **Why**: Simpler to understand, no build step needed
- **Your use**: Creates the chat interface and handles user interactions

## Learning Path

Follow these tutorials in order:

### 1. [Understanding FastAPI](./01-fastapi-basics.md)
- What is an API?
- How FastAPI works
- Your endpoints explained
- Hands-on: Modify your API

### 2. [OpenAI API Integration](./02-openai-integration.md)
- How the OpenAI API works
- Chat completions explained
- System prompts vs user messages
- Hands-on: Customize AI behavior

### 3. [Frontend JavaScript](./03-frontend-basics.md)
- How the chat interface works
- Fetch API for backend communication
- DOM manipulation
- Hands-on: Add new features

### 4. [The Prompt Library System](./04-prompt-system.md)
- How prompts become modules
- Creating new learning modules
- Best practices for educational prompts
- Hands-on: Create your own module

### 5. [Putting It All Together](./05-full-stack-flow.md)
- Complete request/response flow
- Debugging tips
- Common issues and solutions
- Next steps

## Quick Start Exercises

If you want to jump right in, try these:

1. **Baby Steps**: Change the title in `index.html` and see it update
2. **Easy Win**: Create a new prompt file in `prompts/` folder
3. **API Explorer**: Visit http://localhost:8000/docs to see interactive API docs
4. **Small Tweak**: Change the AI temperature in `main.py` and notice the difference

## Getting Help

As you work through these tutorials:
- Code examples are included for you to try
- Each section has "Try It Yourself" exercises
- Don't worry about breaking things - that's how you learn!

## Your First Challenge

After starting the server (`uvicorn server.main:app --reload`), open the browser and:
1. Look at the browser console (F12 → Console tab)
2. Type a message in the chat
3. Watch the network request in the Network tab
4. See the API call to OpenAI happening!

This will help you understand how data flows through your application.

---

**Ready?** Start with [01-fastapi-basics.md](./01-fastapi-basics.md)!
