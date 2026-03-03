# Tutorial 2: OpenAI API Integration

## What is the OpenAI API?

The OpenAI API gives you access to powerful language models like GPT-4. Instead of using ChatGPT's website, you're connecting directly to the AI through code.

Think of it like:
- **ChatGPT website**: Using a restaurant's app to order food
- **OpenAI API**: Being the restaurant and having access to the kitchen

## How Your Integration Works

### 1. Setup (In `main.py`)

```python
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

load_dotenv()  # Loads .env file
openai_client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)
```

**What's happening:**
- `load_dotenv()`: Reads your `.env` file (where your API key is stored)
- `AsyncOpenAI`: Creates a client that can talk to OpenAI asynchronously
- `api_key`: Your secret key that proves you're allowed to use the API

### 2. The Chat Request

When a user sends a message, your code does this:

```python
response = await openai_client.chat.completions.create(
    model=model,              # Which AI model to use
    messages=messages,        # The conversation history
    temperature=temperature,  # How creative the AI should be
)
```

## Understanding the Pieces

### Messages Format

OpenAI expects messages in this format:

```python
messages = [
    {"role": "system", "content": "You are a helpful teacher..."},
    {"role": "user", "content": "What is Python?"},
    {"role": "assistant", "content": "Python is a programming language..."},
    {"role": "user", "content": "Tell me more"}
]
```

Three types of messages:

1. **System**: Instructions for how the AI should behave
   - Sets the personality, expertise, and behavior
   - Only appears once at the start
   - In your app: This comes from the prompt files!

2. **User**: What the human said
   - The actual questions or messages from your learner

3. **Assistant**: What the AI said
   - Previous responses from the AI
   - Needed to maintain conversation context

### Your Prompt System

Here's the clever part of your app:

```python
if prompt_slug:
    prompt_path = PROMPTS_DIR / f"{prompt_slug}.txt"
    async with aiofiles.open(prompt_path, 'r', encoding='utf-8') as f:
        system_prompt = await f.read()

    # Add system message at the start
    messages = [{"role": "system", "content": system_prompt}] + messages
```

**What this does:**
1. Gets the prompt file name (e.g., "ai_wellbeing_game")
2. Reads the `.txt` file
3. Uses that file's content as the system message
4. Puts it at the start of the conversation

**This is brilliant because:**
- Teachers can create new modules just by adding `.txt` files
- No code changes needed to add new learning experiences
- Each module can have completely different AI behavior

## The Parameters

### Model

```python
model: str = "gpt-4o-mini"
```

Different models have different capabilities:
- `gpt-4o-mini`: Fast, cheap, great for most tasks
- `gpt-4o`: More powerful, more expensive
- `gpt-3.5-turbo`: Older, cheaper, faster

**Your app uses**: `gpt-4o-mini` by default (good choice for learning!)

### Temperature

```python
temperature: float = 0.6
```

Controls creativity/randomness (0.0 to 2.0):
- **0.0**: Very focused and deterministic (same input = same output)
- **0.6**: Balanced (your default)
- **1.0**: More creative and varied
- **2.0**: Very random and creative

**For education**: 0.6-0.8 is great (consistent but not robotic)

## The Response

OpenAI sends back a structured response:

```python
response = await openai_client.chat.completions.create(...)

# What you get back:
{
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "Here is my response..."
            }
        }
    ],
    "usage": {
        "prompt_tokens": 150,
        "completion_tokens": 80,
        "total_tokens": 230
    }
}
```

Your code extracts this:

```python
assistant_message = response.choices[0].message.content
token_usage = {
    "prompt_tokens": response.usage.prompt_tokens,
    "completion_tokens": response.usage.completion_tokens,
    "total_tokens": response.usage.total_tokens
}
```

## Try It Yourself

### Exercise 1: Change the Temperature

Let's see how temperature affects responses:

1. Open `server/main.py`
2. Find the chat endpoint
3. Change the default temperature:

```python
temperature: float = 0.2  # Very focused
# or
temperature: float = 1.2  # More creative
```

4. Save and test by asking the same question multiple times
5. Notice how responses vary!

### Exercise 2: Create a Custom Prompt

Create a new file: `prompts/math_tutor.txt`

```
You are an encouraging math tutor for middle school students.

Guidelines:
- Break down problems into small steps
- Use encouraging language
- Ask clarifying questions to check understanding
- Use simple analogies and real-world examples
- Celebrate progress, no matter how small

When a student asks a question:
1. First, check if you understand what they're asking
2. Break the problem into steps
3. Guide them through each step
4. Check their understanding before moving on

Remember: You're not just solving problems, you're building confidence!
```

Now:
1. Restart your server
2. Your new module will automatically appear in the prompts list!
3. Select it and try asking a math question

### Exercise 3: Test with cURL

You can test the API directly from the terminal:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is FastAPI?"}
    ],
    "model": "gpt-4o-mini",
    "temperature": 0.7
  }'
```

This bypasses the frontend and talks directly to your API.

## Understanding Token Usage

### What are tokens?

Tokens are pieces of words. Roughly:
- 1 token ≈ 4 characters
- 100 tokens ≈ 75 words
- 1000 tokens ≈ 750 words

### Why track them?

OpenAI charges by token:
- Input tokens (what you send): Cheaper
- Output tokens (what AI generates): More expensive

**For gpt-4o-mini** (as of 2024):
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens

Your app tracks this so you know how much conversations cost!

### Your token tracking:

```python
return {
    "response": assistant_message,
    "token_usage": {
        "prompt_tokens": response.usage.prompt_tokens,    # What you sent
        "completion_tokens": response.usage.completion_tokens,  # What AI generated
        "total_tokens": response.usage.total_tokens       # Sum of both
    }
}
```

## Common Issues

### 1. Missing API Key

```
Error: OPENAI_API_KEY not found
```

**Fix**: Create a `.env` file in the project root:
```
OPENAI_API_KEY=sk-your-key-here
```

### 2. Rate Limits

```
Error: Rate limit exceeded
```

**Fix**: You're making too many requests too quickly. OpenAI has limits based on your plan.

### 3. Context Length Exceeded

```
Error: maximum context length exceeded
```

**Fix**: The conversation is too long. You need to:
- Summarize old messages
- Remove old messages
- Use a model with larger context window

## Best Practices

### 1. System Prompt Design

Good system prompts:
- Are clear and specific
- Set expectations for behavior
- Include examples when helpful
- Define the role and expertise level

### 2. Conversation Management

For long conversations, consider:
- Keeping only recent messages
- Summarizing older parts
- Limiting history to N messages

### 3. Error Handling

Always wrap OpenAI calls in try/catch:

```python
try:
    response = await openai_client.chat.completions.create(...)
except Exception as e:
    raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
```

## Next Steps

Now you understand how the AI works! Let's look at the frontend.

**Next**: [03-frontend-basics.md](./03-frontend-basics.md)

## Quick Reference

```python
# Initialize client
from openai import AsyncOpenAI
client = AsyncOpenAI(api_key="sk-...")

# Make a request
response = await client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are helpful"},
        {"role": "user", "content": "Hello!"}
    ],
    temperature=0.7
)

# Get the response
text = response.choices[0].message.content
tokens = response.usage.total_tokens
```

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [Token Counter](https://platform.openai.com/tokenizer)
