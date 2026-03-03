# Tutorial 3: Frontend JavaScript

## Why Vanilla JavaScript?

Your project uses **vanilla JavaScript** (no React, Vue, or other frameworks). This means:

**Pros:**
- Simpler to understand
- No build process needed
- Faster to get started
- Smaller file size

**Cons:**
- More manual DOM manipulation
- No component reusability
- Harder to scale for complex UIs

For a learning tool like this, vanilla JS is perfect!

## Your Frontend Structure

```
frontend/
├── index.html    # The structure (HTML)
├── styles.css    # The appearance (CSS)
└── app.js        # The behavior (JavaScript)
```

## Understanding index.html

Let's break down the key parts:

### 1. The Layout

```html
<div class="container">
    <div class="prompts-panel">...</div>
    <div class="chat-panel">...</div>
</div>
```

Two-column layout:
- **Left**: List of prompts (learning modules)
- **Right**: Chat interface

### 2. The Prompts Panel

```html
<div class="prompts-panel">
    <h2>Learning Modules</h2>
    <div id="prompts-list">
        <!-- JavaScript will fill this in -->
    </div>
</div>
```

The `id="prompts-list"` is important - JavaScript uses this to insert the list of modules.

### 3. The Chat Panel

```html
<div id="chat-messages">
    <!-- Messages appear here -->
</div>

<div class="input-container">
    <textarea id="user-input" placeholder="Type your message..."></textarea>
    <button id="send-button">Send</button>
</div>
```

Key elements:
- `chat-messages`: Where conversation appears
- `user-input`: Text box for typing
- `send-button`: Sends the message

## Understanding app.js

This is where the magic happens! Let's go through it step by step.

### 1. State Management

```javascript
let conversationHistory = [];
let currentPromptSlug = null;
```

**State** = data that changes over time:
- `conversationHistory`: All messages in the current conversation
- `currentPromptSlug`: Which learning module is selected

### 2. Loading Prompts

```javascript
async function loadPrompts() {
    const response = await fetch('/api/prompts');
    const prompts = await response.json();

    const promptsList = document.getElementById('prompts-list');
    promptsList.innerHTML = prompts.map(prompt => `
        <div class="prompt-card" data-slug="${prompt.slug}">
            <h3>${prompt.name}</h3>
            <p class="description">${prompt.description}</p>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.prompt-card').forEach(card => {
        card.addEventListener('click', () => selectPrompt(card.dataset.slug));
    });
}
```

**What this does:**

1. **Fetch data from API**:
   ```javascript
   const response = await fetch('/api/prompts');
   const prompts = await response.json();
   ```
   - Calls your FastAPI endpoint
   - Converts response to JavaScript objects

2. **Create HTML for each prompt**:
   ```javascript
   prompts.map(prompt => `
       <div class="prompt-card" data-slug="${prompt.slug}">
   ```
   - Uses template literals (backticks) to create HTML
   - `data-slug` stores the prompt filename

3. **Add click handlers**:
   ```javascript
   card.addEventListener('click', () => selectPrompt(card.dataset.slug));
   ```
   - When you click a card, it calls `selectPrompt()`

### 3. Selecting a Prompt

```javascript
function selectPrompt(slug) {
    currentPromptSlug = slug;
    conversationHistory = [];  // Clear history
    clearChat();

    // Visual feedback
    document.querySelectorAll('.prompt-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.slug === slug);
    });
}
```

**What this does:**
- Saves which module you selected
- Clears old conversation
- Highlights the selected card

### 4. Sending Messages

```javascript
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (!message) return;  // Don't send empty messages

    // Add to history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // Show in UI
    appendMessage('user', message);
    userInput.value = '';  // Clear input

    // Show loading indicator
    const loadingId = showLoading();

    try {
        // Call the API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                messages: conversationHistory,
                prompt_slug: currentPromptSlug
            })
        });

        const data = await response.json();

        // Remove loading, add response
        removeLoading(loadingId);
        conversationHistory.push({
            role: 'assistant',
            content: data.response
        });
        appendMessage('assistant', data.response);

    } catch (error) {
        removeLoading(loadingId);
        appendMessage('error', 'Error: ' + error.message);
    }
}
```

**The flow:**

1. Get the message from textarea
2. Add to conversation history
3. Display in chat
4. Show "AI is thinking..." indicator
5. Send to backend
6. Get response
7. Hide loading indicator
8. Display AI response

### 5. The Edit & Resend Feature

This is a unique and powerful feature:

```javascript
function makeMessageEditable(messageDiv, index) {
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit & Resend';

    editBtn.addEventListener('click', () => {
        // Remove all messages after this one
        conversationHistory = conversationHistory.slice(0, index + 1);

        // Make the message editable
        const contentDiv = messageDiv.querySelector('.message-content');
        const currentText = conversationHistory[index].content;

        contentDiv.innerHTML = `
            <textarea class="edit-textarea">${currentText}</textarea>
            <button class="save-edit-btn">Send Edited Message</button>
        `;

        // Handle the save
        const saveBtn = contentDiv.querySelector('.save-edit-btn');
        saveBtn.addEventListener('click', async () => {
            const newText = contentDiv.querySelector('.edit-textarea').value.trim();
            conversationHistory[index].content = newText;
            replayConversationFrom(index);
        });
    });

    messageDiv.appendChild(editBtn);
}
```

**Why this is cool:**

Imagine you asked: "What is Python?"
Then: "Tell me about loops"

But you want to change it to: "Tell me about functions"

With Edit & Resend:
1. Click "Edit & Resend" on "Tell me about loops"
2. Change it to "Tell me about functions"
3. The conversation replays from that point with the new path!

This encourages exploration and experimentation.

### 6. DOM Manipulation

```javascript
function appendMessage(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    messageDiv.innerHTML = `
        <div class="message-content">${formatMessage(content)}</div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;  // Auto-scroll
}
```

**DOM = Document Object Model** (the HTML structure your browser understands)

- `getElementById`: Find an element by its ID
- `createElement`: Create a new HTML element
- `appendChild`: Add element to the page
- `scrollTop`: Scroll to show new message

## Key JavaScript Concepts

### 1. Async/Await

```javascript
async function loadPrompts() {
    const response = await fetch('/api/prompts');
    const data = await response.json();
}
```

- `async`: This function does asynchronous work
- `await`: Wait for this to finish before continuing
- Makes async code look like sync code (easier to read!)

### 2. Fetch API

```javascript
const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({...})
});
```

**Fetch** is how JavaScript talks to servers:
- `method`: GET (read) or POST (send data)
- `headers`: Metadata about the request
- `body`: The actual data (must be a string, so we use `JSON.stringify`)

### 3. Event Listeners

```javascript
document.getElementById('send-button').addEventListener('click', sendMessage);
```

**Event listeners** respond to user actions:
- `click`: When someone clicks
- `keypress`: When someone types
- `submit`: When a form is submitted

### 4. Template Literals

```javascript
const html = `
    <div class="message ${role}-message">
        <p>${content}</p>
    </div>
`;
```

Backticks (`` ` ``) let you:
- Write multi-line strings
- Embed variables with `${}`
- Much easier than string concatenation!

## Try It Yourself

### Exercise 1: Add a Clear Chat Button

Add this to `index.html` in the chat panel:

```html
<button id="clear-chat-btn">Clear Chat</button>
```

Then in `app.js`, add this function:

```javascript
function clearChatCompletely() {
    conversationHistory = [];
    currentPromptSlug = null;
    clearChat();

    // Deselect all prompts
    document.querySelectorAll('.prompt-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// Hook it up
document.getElementById('clear-chat-btn').addEventListener('click', clearChatCompletely);
```

Now you have a clear button!

### Exercise 2: Add a Character Counter

Let's show how many characters they've typed.

Add this to `index.html` near the textarea:

```html
<div id="char-count">0 characters</div>
```

Add this to `app.js`:

```javascript
const userInput = document.getElementById('user-input');
const charCount = document.getElementById('char-count');

userInput.addEventListener('input', () => {
    const length = userInput.value.length;
    charCount.textContent = `${length} characters`;
});
```

Now you see character count in real-time!

### Exercise 3: Add Timestamp to Messages

Modify the `appendMessage` function:

```javascript
function appendMessage(role, content) {
    const now = new Date();
    const time = now.toLocaleTimeString();

    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    messageDiv.innerHTML = `
        <div class="message-time">${time}</div>
        <div class="message-content">${formatMessage(content)}</div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
```

Add this to `styles.css`:

```css
.message-time {
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 4px;
}
```

Now messages show when they were sent!

## Common Patterns

### 1. Toggle Classes

```javascript
element.classList.add('selected');
element.classList.remove('selected');
element.classList.toggle('selected');  // Add if not there, remove if there
```

### 2. Conditional Rendering

```javascript
if (conversationHistory.length === 0) {
    chatMessages.innerHTML = '<p>No messages yet. Start a conversation!</p>';
} else {
    // Show messages
}
```

### 3. Array Methods

```javascript
// Map: Transform each item
prompts.map(prompt => prompt.name)

// Filter: Keep only items that match
messages.filter(msg => msg.role === 'user')

// Slice: Get a portion
history.slice(0, 5)  // First 5 items
```

## Debugging Tips

### 1. Use Console.log

```javascript
console.log('Current prompt:', currentPromptSlug);
console.log('History:', conversationHistory);
```

Open the browser console (F12 → Console) to see these!

### 2. Use Debugger

```javascript
function sendMessage() {
    debugger;  // Execution will pause here
    // ...
}
```

The browser will stop and let you inspect everything.

### 3. Check Network Tab

- Open DevTools (F12)
- Go to Network tab
- Send a message
- Click on the `/api/chat` request
- See exactly what was sent and received!

## Next Steps

Now you understand the frontend! Let's learn about the prompt system.

**Next**: [04-prompt-system.md](./04-prompt-system.md)

## Quick Reference

```javascript
// Select element
document.getElementById('myId')
document.querySelector('.myClass')
document.querySelectorAll('.myClass')

// Modify element
element.textContent = 'New text'
element.innerHTML = '<p>HTML</p>'
element.classList.add('className')

// Events
element.addEventListener('click', () => {...})

// Fetch
const response = await fetch('/api/endpoint');
const data = await response.json();

// Create element
const div = document.createElement('div');
div.className = 'my-class';
parent.appendChild(div);
```
