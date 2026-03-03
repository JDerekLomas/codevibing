# Tutorial 1: Understanding FastAPI

## What is an API?

Think of an API (Application Programming Interface) as a waiter in a restaurant:

- **You (frontend)**: The customer who wants food
- **Kitchen (backend)**: Where the food is prepared
- **Waiter (API)**: Takes your order, brings it to the kitchen, and returns with your food

Your frontend (the chat interface) asks the backend for things, and the API delivers them.

## What is FastAPI?

FastAPI is a Python framework that makes it super easy to create APIs. It's:
- **Fast**: Built on modern async Python
- **Easy**: Automatic documentation and type checking
- **Developer-friendly**: Great error messages

## Your Current API

Let's look at what your `server/main.py` does:

### 1. The Basics

```python
from fastapi import FastAPI

app = FastAPI()
```

This creates your API application. Think of it as opening your restaurant.

### 2. Endpoints (Your Menu)

An endpoint is like a menu item. You have 4 endpoints:

#### a) Health Check
```python
@app.get("/health")
async def health():
    return {"status": "healthy"}
```

- **What it does**: Just confirms the server is running
- **URL**: `http://localhost:8000/health`
- **Try it**: Open that URL in your browser!

#### b) List All Prompts
```python
@app.get("/api/prompts")
async def list_prompts():
    # Returns all available learning modules
```

- **What it does**: Scans the `prompts/` folder and returns all `.txt` files
- **URL**: `http://localhost:8000/api/prompts`
- **Try it**: Open that URL to see JSON of your modules!

#### c) Get Specific Prompt
```python
@app.get("/api/prompts/{slug}")
async def get_prompt(slug: str):
    # Returns content of a specific prompt file
```

- **What it does**: Gets the content of one prompt file
- **URL**: `http://localhost:8000/api/prompts/ai_wellbeing_game`
- **The `{slug}` part**: This is a path parameter (like a variable in the URL)

#### d) Chat Endpoint
```python
@app.post("/api/chat")
async def chat(request: ChatRequest):
    # Sends message to OpenAI and returns response
```

- **What it does**: The main chat function - sends your message to OpenAI
- **Method**: POST (not GET) because you're sending data
- **Used by**: Your frontend's `app.js`

## Understanding the Flow

When you type a message in the chat:

1. **Frontend** (`app.js`) creates a fetch request
2. **FastAPI** receives it at `/api/chat`
3. **Your code** sends it to OpenAI API
4. **OpenAI** responds with AI-generated text
5. **FastAPI** sends it back to frontend
6. **Frontend** displays it in the chat

## Try It Yourself

### Exercise 1: Add a New Endpoint

Let's add a simple endpoint that returns information about your project.

Open `server/main.py` and add this after the health check:

```python
@app.get("/api/info")
async def project_info():
    return {
        "name": "AILiteracy Sandbox",
        "version": "1.0",
        "description": "A conversational learning platform",
        "your_name": "Your Name Here"  # Change this!
    }
```

**Steps:**
1. Save the file
2. The server will auto-reload (that's what `--reload` does!)
3. Visit: `http://localhost:8000/api/info`
4. You should see your JSON response!

### Exercise 2: Explore the Interactive Docs

FastAPI automatically creates API documentation:

1. Visit: `http://localhost:8000/docs`
2. You'll see **Swagger UI** - an interactive API explorer
3. Click on any endpoint to expand it
4. Click "Try it out" to test it right in the browser!

**Try this:**
- Click on `POST /api/chat`
- Click "Try it out"
- Modify the request body
- Click "Execute"
- See the response!

### Exercise 3: Understand Async

You'll notice `async def` everywhere. What does that mean?

```python
async def chat(request: ChatRequest):
    # Can do multiple things at once
```

**Async** means your server can handle multiple requests at the same time without waiting. It's like:

- **Sync (old way)**: A waiter takes one order, completes it, then takes the next
- **Async (new way)**: A waiter takes multiple orders and processes them as they're ready

For API calls to OpenAI, this is important because:
- API calls can take 1-2 seconds
- Without async, your server would freeze waiting
- With async, it can handle other requests while waiting

## Key Concepts

### 1. Decorators (`@app.get`, `@app.post`)

```python
@app.get("/api/prompts")
```

This `@` syntax is a decorator. It tells FastAPI:
- "When someone makes a GET request to `/api/prompts`..."
- "...run the function below"

### 2. Type Hints

```python
async def get_prompt(slug: str):
```

The `: str` tells Python (and FastAPI) that `slug` should be a string. FastAPI uses this to:
- Validate requests
- Generate documentation
- Give you better errors

### 3. Pydantic Models

```python
class ChatRequest(BaseModel):
    messages: list
    prompt_slug: str = None
    model: str = "gpt-4o-mini"
```

This defines the shape of data you expect. It's like a form with required and optional fields.

## Common Patterns in Your Code

### Reading Files Async

```python
async with aiofiles.open(prompt_path, 'r', encoding='utf-8') as f:
    content = await f.read()
```

- `aiofiles` = async file reading (non-blocking)
- `async with` = async context manager
- `await` = wait for this to complete

### Error Handling

```python
try:
    # Try to do something
    response = await openai_client.chat.completions.create(...)
except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
```

If something goes wrong, FastAPI returns a proper HTTP error to the frontend.

## Next Steps

Now that you understand the API structure, let's learn about the OpenAI integration!

**Next**: [02-openai-integration.md](./02-openai-integration.md)

## Quick Reference

```bash
# Start server
uvicorn server.main:app --reload

# View interactive docs
http://localhost:8000/docs

# View alternative docs
http://localhost:8000/redoc

# Test an endpoint
curl http://localhost:8000/health
```
