const state = {
  prompts: [],
  activePrompt: null,
  conversation: [],
  isSending: false,
  editIndex: null,
  usage: null,
};

const promptListEl = document.getElementById("promptList");
const promptTitleEl = document.getElementById("promptTitle");
const promptContentEl = document.getElementById("promptContent");
const chatWindowEl = document.getElementById("chatWindow");
const messageInputEl = document.getElementById("messageInput");
const sendButtonEl = document.getElementById("sendButton");
const editCancelEl = document.getElementById("editCancel");
const statusMessageEl = document.getElementById("statusMessage");

function setStatus(message, tone = "info") {
  statusMessageEl.textContent = message || "";
  statusMessageEl.style.color = tone === "error" ? "#dc2626" : "var(--muted)";
}

async function fetchJSON(url, options) {
  const response = await fetch(url, options);
  let body;
  try {
    body = await response.json();
  } catch (error) {
    body = null;
  }
  if (!response.ok) {
    const detail = body?.detail || response.statusText;
    throw new Error(detail || "Request failed");
  }
  return body;
}

function parseNumberedOptions(text) {
  const lines = text.split(/\r?\n/);
  const options = [];
  let current = null;

  lines.forEach((line) => {
    const match = line.match(/^\s*(\d+)[\.)]\s+(.*)$/);
    if (match) {
      if (current) {
        options.push(current);
      }
      current = {
        number: match[1],
        label: match[2].trim(),
      };
    } else if (current && line.trim()) {
      current.label = `${current.label} ${line.trim()}`.trim();
    }
  });

  if (current) {
    options.push(current);
  }

  return options;
}

async function loadPrompts() {
  setStatus("Loading modules...");
  try {
    const data = await fetchJSON("/api/prompts");
    state.prompts = data.prompts || [];
    renderPromptButtons();
    if (!state.prompts.length) {
      setStatus("No prompts found. Add prompt text files to the prompts directory.");
    } else {
      setStatus("Select a module to begin.");
    }
  } catch (error) {
    setStatus(error.message, "error");
  }
}

function renderPromptButtons() {
  promptListEl.innerHTML = "";
  if (!state.prompts.length) {
    return;
  }

  state.prompts.forEach((prompt) => {
    const button = document.createElement("button");
    button.className = "prompt-button";
    if (state.activePrompt?.slug === prompt.slug) {
      button.classList.add("active");
    }

    const title = document.createElement("strong");
    title.textContent = prompt.name;
    button.appendChild(title);

    const hint = document.createElement("span");
    hint.textContent = "Tap to load prompt";
    button.appendChild(hint);

    button.addEventListener("click", () => selectPrompt(prompt.slug));
    promptListEl.appendChild(button);
  });
}

async function selectPrompt(slug) {
  if (state.isSending) {
    return;
  }
  setStatus("Loading prompt...");
  try {
    const data = await fetchJSON(`/api/prompts/${encodeURIComponent(slug)}`);
    state.activePrompt = data;
    state.conversation = [
      {
        role: "system",
        content: data.content,
        displayContent: data.content,
      },
    ];
    state.editIndex = null;
    state.usage = null;
    messageInputEl.value = "";
    promptTitleEl.textContent = data.name;
    promptContentEl.textContent = data.content;
    setStatus("Prompt loaded. Say hello to get started.");
    renderPromptButtons();
    renderConversation();
    messageInputEl.focus();
  } catch (error) {
    setStatus(error.message, "error");
  }
}

function renderConversation() {
  chatWindowEl.innerHTML = "";

  state.conversation.forEach((message, index) => {
    const skipInitialSystem = index === 0 && message.role === "system";
    if (skipInitialSystem) {
      return;
    }

    const messageEl = document.createElement("div");
    messageEl.className = `message ${message.role}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const displayContent = message.displayContent ?? message.content;
    bubble.textContent = displayContent;
    messageEl.appendChild(bubble);

    if (message.role === "assistant") {
      const options = parseNumberedOptions(message.content).filter((option) => option.label);
      if (options.length) {
        const optionList = document.createElement("div");
        optionList.className = "option-list";
        options.forEach((option) => {
          const optionButton = document.createElement("button");
          optionButton.type = "button";
          optionButton.className = "option-button";
          optionButton.textContent = `${option.number}. ${option.label}`;
          optionButton.disabled = state.isSending;
          optionButton.addEventListener("click", () => handleOptionSelect(option));
          optionList.appendChild(optionButton);
        });
        messageEl.appendChild(optionList);
      }
    }

    chatWindowEl.appendChild(messageEl);

    if (message.role === "user") {
      const actions = document.createElement("div");
      actions.className = "message-actions";
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "Edit & resend";
      editButton.addEventListener("click", () => startEdit(index));
      editButton.disabled = state.isSending;
      actions.appendChild(editButton);
      chatWindowEl.appendChild(actions);
    }
  });

  if (state.usage) {
    const usageEl = document.createElement("div");
    usageEl.className = "message system";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const tokens = state.usage.total_tokens ?? "?";
    bubble.textContent = `Tokens used in last reply: ${tokens}`;
    usageEl.appendChild(bubble);
    chatWindowEl.appendChild(usageEl);
  }

  chatWindowEl.scrollTop = chatWindowEl.scrollHeight;

  editCancelEl.hidden = state.editIndex === null;
}

function startEdit(index) {
  if (state.isSending) {
    return;
  }
  const messageToEdit = state.conversation[index];
  if (!messageToEdit || messageToEdit.role !== "user") {
    return;
  }
  messageInputEl.value = messageToEdit.content;
  messageInputEl.focus();
  state.conversation = state.conversation.slice(0, index);
  state.editIndex = index;
  state.usage = null;
  setStatus("Editing previous message. Update the text and press Send.");
  renderConversation();
}

function cancelEdit() {
  if (state.isSending) {
    return;
  }
  state.editIndex = null;
  messageInputEl.value = "";
  setStatus("Edit cancelled.");
  renderConversation();
}

async function handleOptionSelect(option) {
  if (state.isSending) {
    return;
  }
  const displayText = `${option.number}. ${option.label}`;
  setStatus(`Selected option ${displayText}. Sending...`);
  await sendMessage(option.number, {
    fromQuickOption: true,
    displayOverride: displayText,
  });
}

async function sendMessage(rawText, { fromQuickOption = false, displayOverride = null } = {}) {
  const text = rawText.trim();
  if (!text) {
    if (!fromQuickOption) {
      setStatus("Type a message before sending.", "error");
    }
    return;
  }
  if (!state.activePrompt) {
    setStatus("Select a module before starting the chat.", "error");
    return;
  }
  if (state.isSending) {
    return;
  }

  if (state.editIndex !== null) {
    state.conversation = state.conversation.slice(0, state.editIndex);
  }

  const displayText = displayOverride ?? text;

  setStatus(fromQuickOption ? "Sending selection..." : "Sending message...");
  sendButtonEl.disabled = true;
  state.isSending = true;

  const userMessage = { role: "user", content: text, displayContent: displayText };
  state.conversation.push(userMessage);
  messageInputEl.value = "";
  renderConversation();

  try {
    const payload = {
      messages: state.conversation.map(({ role, content }) => ({ role, content })),
    };

    const data = await fetchJSON("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    state.conversation.push({ ...data.message, displayContent: data.message.content });
    state.usage = data.usage || null;
    state.editIndex = null;
    setStatus("Assistant replied. Keep going!");
    renderConversation();
  } catch (error) {
    const errorMessage = {
      role: "system",
      content: `⚠️ ${error.message}`,
      displayContent: `⚠️ ${error.message}`,
    };
    state.conversation.push(errorMessage);
    state.usage = null;
    state.editIndex = null;
    setStatus(error.message, "error");
    renderConversation();
  } finally {
    state.isSending = false;
    sendButtonEl.disabled = false;
  }
}

function handleSend() {
  sendMessage(messageInputEl.value);
}

sendButtonEl.addEventListener("click", handleSend);
editCancelEl.addEventListener("click", cancelEdit);

messageInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    handleSend();
  }
});

loadPrompts();
