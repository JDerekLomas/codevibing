# AI Literacy Conversational Sandbox

This project lets you turn plain-text prompt files into guided conversations powered by the OpenAI API. Learners can pick a module, chat with the assistant, and revise their own messages to explore alternative paths—like a lightweight ChatGPT clone tailored to AI literacy.

## Features

- Prompt library (`prompts/*.txt`) automatically surfaced as selectable modules.
- FastAPI backend exposes the prompts and proxies chat requests to OpenAI's Responses API.
- Frontend chat interface with a clean two-pane layout, conversation history, and "Edit & resend" for any learner message.
- Tracks token usage for each assistant reply so you can monitor cost.
- Ready to extend with progress tracking or additional UI polish.

## Getting Started

1. **Install dependencies**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configure your API key**

   ```bash
   export OPENAI_API_KEY="sk-your-key"
   ```

   You can also place the key in a `.env` file and load it before starting the server.

3. **Run the backend**

   ```bash
   uvicorn server.main:app --reload
   ```

4. **Open the app**

   Visit [http://localhost:8000](http://localhost:8000) to see the prompt picker and chat interface.

## Adding or Updating Prompts

Add new `.txt` files to the `prompts/` directory—each file becomes its own module. The filename is converted to a friendly display name (underscores become spaces). Keep the first couple of lines focused; they are shown as the module description.

## Editing Flow

Learners can hit **Edit & resend** next to any of their previous messages. The conversation rewinds to that point so they can iterate on their wording and explore how the assistant responds to alternative inputs. Use `⌘+Enter` (macOS) or `Ctrl+Enter` (Windows/Linux) to send quickly via the keyboard.

## Next Steps

- Log conversations and completion data per learner.
- Gate modules based on completion or assessment criteria.
- Layer on analytics (token usage, churn, etc.).
- Add authentication or connect to your preferred LMS.

## Project Structure

```
frontend/   Static web client (HTML/CSS/JS)
prompts/    Prompt text files surfaced in the UI
server/     FastAPI app exposing prompt + chat endpoints
```

Enjoy building your AI literacy learning system!
