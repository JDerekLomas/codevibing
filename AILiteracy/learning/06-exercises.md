# Hands-On Exercises

Work through these exercises to solidify your understanding. They're ordered from easy to challenging.

## Level 1: Getting Comfortable (Beginner)

### Exercise 1.1: Change the Title

**Goal**: Understand basic HTML editing

**Task**: Change the page title from "AILiteracy Conversational Sandbox" to something personal.

**Steps**:
1. Open `frontend/index.html`
2. Find the `<title>` tag
3. Change the text
4. Refresh your browser
5. See the change in the browser tab!

**Bonus**: Also change the `<h1>` heading in the page.

---

### Exercise 1.2: Modify Styling

**Goal**: Understand CSS basics

**Task**: Change the color scheme of the chat interface.

**Steps**:
1. Open `frontend/styles.css`
2. Find `.user-message` and change `background-color`
3. Find `.assistant-message` and change its color too
4. Try changing the font size of messages

**Example**:
```css
.user-message {
    background-color: #3498db;  /* Blue instead of green */
}

.assistant-message {
    background-color: #e74c3c;  /* Red instead of gray */
    font-size: 1.1rem;  /* Larger text */
}
```

---

### Exercise 1.3: Add a Footer

**Goal**: Practice HTML structure

**Task**: Add a footer with your name and the current year.

**Steps**:
1. Open `frontend/index.html`
2. Before the closing `</body>` tag, add:

```html
<footer style="text-align: center; padding: 20px; color: #666;">
    Made by [Your Name] © 2024
</footer>
```

---

### Exercise 1.4: Console Exploration

**Goal**: Learn browser DevTools

**Task**: Explore what's happening in the console.

**Steps**:
1. Start the server
2. Open browser to `http://localhost:8000`
3. Press F12 to open DevTools
4. Click Console tab
5. Type: `conversationHistory` and press Enter
6. See the current conversation!

**Try**:
- `currentPromptSlug`
- `console.log("Hello from console!")`

---

## Level 2: Adding Features (Intermediate)

### Exercise 2.1: Add a Character Counter

**Goal**: Practice JavaScript DOM manipulation

**Task**: Show how many characters the user has typed.

**Steps**:

1. Add this HTML to `index.html` near the textarea:
```html
<div id="char-count" style="font-size: 0.875rem; color: #666; margin-top: 5px;">
    0 / 500 characters
</div>
```

2. Add this JavaScript to `app.js`:
```javascript
// Add this with other event listeners
const userInput = document.getElementById('user-input');
const charCount = document.getElementById('char-count');

userInput.addEventListener('input', () => {
    const length = userInput.value.length;
    const maxLength = 500;
    charCount.textContent = `${length} / ${maxLength} characters`;

    // Change color if approaching limit
    if (length > maxLength * 0.9) {
        charCount.style.color = 'red';
    } else {
        charCount.style.color = '#666';
    }
});
```

**Bonus**: Prevent sending if over 500 characters.

---

### Exercise 2.2: Add Message Timestamps

**Goal**: Work with Date objects and formatting

**Task**: Show when each message was sent.

**Steps**:

1. Modify the `appendMessage` function in `app.js`:

```javascript
function appendMessage(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;

    // Add timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    messageDiv.innerHTML = `
        <div class="message-time">${timeString}</div>
        <div class="message-content">${formatMessage(content)}</div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add edit button for user messages
    if (role === 'user') {
        const index = conversationHistory.length - 1;
        makeMessageEditable(messageDiv, index);
    }
}
```

2. Add styling to `styles.css`:

```css
.message-time {
    font-size: 0.75rem;
    color: #999;
    margin-bottom: 4px;
    font-style: italic;
}
```

---

### Exercise 2.3: Add a Clear Chat Button

**Goal**: Practice event handling and state management

**Task**: Add a button to clear the conversation and start fresh.

**Steps**:

1. Add button to `index.html` in the chat panel:
```html
<div class="chat-controls">
    <button id="clear-chat-btn" style="margin-bottom: 10px;">
        Clear Conversation
    </button>
</div>
```

2. Add JavaScript to `app.js`:
```javascript
document.getElementById('clear-chat-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
        conversationHistory = [];
        clearChat();

        // Optionally clear prompt selection
        currentPromptSlug = null;
        document.querySelectorAll('.prompt-card').forEach(card => {
            card.classList.remove('selected');
        });

        console.log('Conversation cleared');
    }
});
```

---

### Exercise 2.4: Create a New Learning Module

**Goal**: Understand the prompt system

**Task**: Create a creative writing coach module.

**Steps**:

1. Create `prompts/creative_writing_coach.txt`:

```
You are an encouraging creative writing coach who helps writers overcome blocks and develop their craft.

Your Approach:
- Inspire creativity and confidence
- Ask thought-provoking questions
- Provide specific, actionable feedback
- Celebrate unique voices and ideas
- Balance encouragement with constructive critique

When someone shares writing:
1. Point out what's working well first
2. Ask about their intentions
3. Suggest specific improvements
4. Encourage experimentation

For writer's block:
- Ask about what excites them
- Suggest writing prompts
- Recommend freewriting exercises
- Share that all writers face this

Remember: Every writer has a unique voice worth developing!
```

2. Restart the server
3. Test your new module!

---

## Level 3: Backend Modifications (Advanced)

### Exercise 3.1: Add a New API Endpoint

**Goal**: Understand FastAPI routing

**Task**: Create an endpoint that returns conversation statistics.

**Steps**:

Add this to `server/main.py`:

```python
@app.post("/api/stats")
async def conversation_stats(request: dict):
    """Calculate statistics about a conversation"""
    messages = request.get('messages', [])

    stats = {
        "total_messages": len(messages),
        "user_messages": len([m for m in messages if m['role'] == 'user']),
        "assistant_messages": len([m for m in messages if m['role'] == 'assistant']),
        "total_characters": sum(len(m['content']) for m in messages),
        "average_message_length": sum(len(m['content']) for m in messages) / len(messages) if messages else 0
    }

    return stats
```

**Test it**:
```bash
curl -X POST http://localhost:8000/api/stats \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"},
      {"role": "assistant", "content": "Hi there!"}
    ]
  }'
```

**Bonus**: Add a button in the frontend to show these stats!

---

### Exercise 3.2: Add Temperature Control

**Goal**: Understand request parameters and UI updates

**Task**: Let users adjust the AI's creativity (temperature).

**Steps**:

1. Add slider to `index.html`:
```html
<div class="temperature-control">
    <label for="temperature">AI Creativity:</label>
    <input type="range" id="temperature" min="0" max="20" value="6" step="1">
    <span id="temperature-value">0.6</span>
</div>
```

2. Add JavaScript to `app.js`:
```javascript
let currentTemperature = 0.6;

document.getElementById('temperature').addEventListener('input', (e) => {
    currentTemperature = e.target.value / 10;  // Convert 0-20 to 0.0-2.0
    document.getElementById('temperature-value').textContent = currentTemperature.toFixed(1);
});
```

3. Modify the fetch call in `sendMessage()`:
```javascript
body: JSON.stringify({
    messages: conversationHistory,
    prompt_slug: currentPromptSlug,
    temperature: currentTemperature  // Use the slider value
})
```

**Test**: Try temperature 0.2 (focused) vs 1.5 (creative) and see the difference!

---

### Exercise 3.3: Add Conversation Export

**Goal**: Work with file downloads

**Task**: Let users download their conversation as a text file.

**Steps**:

1. Add button to `index.html`:
```html
<button id="export-btn">Export Conversation</button>
```

2. Add JavaScript to `app.js`:
```javascript
document.getElementById('export-btn').addEventListener('click', () => {
    if (conversationHistory.length === 0) {
        alert('No conversation to export!');
        return;
    }

    // Format conversation as text
    let text = `AILiteracy Conversation Export\n`;
    text += `Date: ${new Date().toLocaleString()}\n`;
    text += `Module: ${currentPromptSlug || 'None'}\n`;
    text += `\n${'='.repeat(50)}\n\n`;

    conversationHistory.forEach(msg => {
        const role = msg.role === 'user' ? 'You' : 'AI';
        text += `${role}:\n${msg.content}\n\n`;
    });

    // Create download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
});
```

---

### Exercise 3.4: Add Message Regeneration

**Goal**: Advanced conversation management

**Task**: Let users regenerate the last AI response.

**Steps**:

1. Add button to `index.html`:
```html
<button id="regenerate-btn">Regenerate Last Response</button>
```

2. Add JavaScript to `app.js`:
```javascript
document.getElementById('regenerate-btn').addEventListener('click', async () => {
    // Check if there's a conversation with AI response
    if (conversationHistory.length < 2) {
        alert('No response to regenerate!');
        return;
    }

    // Check if last message is from assistant
    const lastMsg = conversationHistory[conversationHistory.length - 1];
    if (lastMsg.role !== 'assistant') {
        alert('Last message is not from AI!');
        return;
    }

    // Remove last AI response
    conversationHistory.pop();

    // Remove from UI
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.removeChild(chatMessages.lastChild);

    // Resend the request
    const loadingId = showLoading();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                messages: conversationHistory,
                prompt_slug: currentPromptSlug
            })
        });

        const data = await response.json();
        removeLoading(loadingId);

        conversationHistory.push({
            role: 'assistant',
            content: data.response
        });

        appendMessage('assistant', data.response);

    } catch (error) {
        removeLoading(loadingId);
        alert('Error regenerating: ' + error.message);
    }
});
```

---

## Level 4: Architecture Changes (Expert)

### Exercise 4.1: Add Conversation Persistence

**Goal**: Store conversations in a database

**Task**: Save conversations so they persist across sessions.

**Approach**:

1. Add SQLite database:
```bash
pip install aiosqlite
```

2. Create database schema:
```python
# In server/main.py
import aiosqlite

DATABASE = "conversations.db"

async def init_db():
    async with aiosqlite.connect(DATABASE) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prompt_slug TEXT,
                messages TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()

# Call on startup
@app.on_event("startup")
async def startup():
    await init_db()
```

3. Add save endpoint:
```python
@app.post("/api/save-conversation")
async def save_conversation(request: dict):
    import json
    async with aiosqlite.connect(DATABASE) as db:
        await db.execute(
            "INSERT INTO conversations (prompt_slug, messages) VALUES (?, ?)",
            (request['prompt_slug'], json.dumps(request['messages']))
        )
        await db.commit()
    return {"status": "saved"}
```

4. Add load endpoint:
```python
@app.get("/api/conversations")
async def list_conversations():
    import json
    async with aiosqlite.connect(DATABASE) as db:
        async with db.execute("SELECT * FROM conversations ORDER BY created_at DESC") as cursor:
            rows = await cursor.fetchall()
            return [
                {
                    "id": row[0],
                    "prompt_slug": row[1],
                    "messages": json.loads(row[2]),
                    "created_at": row[3]
                }
                for row in rows
            ]
```

**Challenge**: Update the frontend to save and load conversations!

---

### Exercise 4.2: Add Rate Limiting

**Goal**: Protect your API from abuse

**Task**: Limit requests per user.

**Approach**:

1. Install slowapi:
```bash
pip install slowapi
```

2. Add to `server/main.py`:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/chat")
@limiter.limit("10/minute")  # 10 requests per minute
async def chat(request: ChatRequest, req: Request):
    # ... existing code
```

---

### Exercise 4.3: Add Streaming Responses

**Goal**: Show AI response as it's generated (like ChatGPT)

**Task**: Implement streaming instead of waiting for full response.

**Approach**:

1. Modify chat endpoint:
```python
from fastapi.responses import StreamingResponse

@app.post("/api/chat-stream")
async def chat_stream(request: ChatRequest):
    # ... prepare messages

    async def generate():
        stream = await openai_client.chat.completions.create(
            model=request.model,
            messages=messages,
            temperature=request.temperature,
            stream=True  # Enable streaming
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    return StreamingResponse(generate(), media_type="text/plain")
```

2. Update frontend to handle streaming:
```javascript
const response = await fetch('/api/chat-stream', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({...})
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let fullResponse = '';

while (true) {
    const {done, value} = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    fullResponse += chunk;

    // Update UI with partial response
    updateStreamingMessage(fullResponse);
}
```

---

## Level 5: Creative Challenges

### Challenge 5.1: Multi-Language Support

Add support for prompts in different languages (Spanish, French, etc.).

**Hints**:
- Create language-specific prompt folders
- Add language selector in UI
- Pass language preference to backend

---

### Challenge 5.2: Voice Input

Allow users to speak their messages instead of typing.

**Hints**:
- Use Web Speech API: `webkitSpeechRecognition`
- Add microphone button
- Convert speech to text before sending

---

### Challenge 5.3: Conversation Branching

Create a tree structure where users can explore multiple conversation paths.

**Hints**:
- Store messages as a tree instead of array
- Allow "branching" at any message
- Visualize the tree structure

---

### Challenge 5.4: Learning Analytics Dashboard

Create a dashboard showing:
- Total learning time
- Modules completed
- Most asked questions
- Progress over time

**Hints**:
- Track session duration
- Store analytics in database
- Create new page for dashboard
- Use Chart.js for visualizations

---

## Solutions and Help

Most exercises include code snippets to get you started. If you get stuck:

1. **Read error messages carefully** - they usually tell you exactly what's wrong
2. **Use console.log()** - Print variables to understand what's happening
3. **Check the Network tab** - See what requests are being sent
4. **Review the tutorials** - Go back to the relevant tutorial for context
5. **Experiment** - Try things! Breaking and fixing is how you learn

## Challenge Yourself

After completing these exercises, try building:

1. **A Quiz Module**: Create prompts that test knowledge with questions
2. **A Code Tutor**: Special module for learning programming with code examples
3. **A Study Buddy**: Help students prepare for exams with flashcards and practice
4. **A Language Partner**: Practice conversation in a foreign language

## Share Your Work

If you build something cool, consider:
- Sharing your prompts with others
- Writing about what you learned
- Contributing improvements to the project

**Happy learning and building!**
