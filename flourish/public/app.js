const needList = document.getElementById("need-list");
const domainField = document.getElementById("application-domain");
const promptField = document.getElementById("design-prompt");
const selectedNeedsLabel = document.getElementById("selected-needs");
const ideaForm = document.getElementById("idea-form");
const output = document.getElementById("output");
const evaluatorList = document.getElementById("evaluator-list");
const contextForm = document.getElementById("context-form");
const contextStep = document.getElementById("context-step");
const designStep = document.getElementById("design-step");
const contextTextarea = document.getElementById("context-description");

let designContext = "";
const selectedNeeds = new Set();
let history = [];
const feedbackState = new Map();
let markedConfigured = false;
const selectedEvaluators = new Set();
const clientId = (() => {
  const storageKey = "flourish-agent-client";
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;
  const generated = window.crypto?.randomUUID?.() ?? `flourish-${Date.now()}`;
  window.localStorage.setItem(storageKey, generated);
  return generated;
})();

function clearOutput() {
  output.classList.remove("output--empty");
  output.innerHTML = "";
}

function setOutputPlaceholder() {
  feedbackState.clear();
  output.innerHTML = "";
  output.classList.add("output--empty");
  output.textContent = "Design space insights and agent cards will appear here.";
}

function showStatus(message, variant = "info") {
  clearOutput();
  const note = document.createElement("div");
  note.className = `status-note status-note--${variant}`;
  note.textContent = message;
  note.setAttribute("role", variant === "error" ? "alert" : "status");
  output.appendChild(note);
}

function handleFeedbackSelection(card, selection, upButton, downButton, ideaId) {
  const current = card.dataset.feedback === selection ? null : selection;
  card.dataset.feedback = current || "";

  upButton.classList.toggle("is-active", current === "up");
  upButton.setAttribute("aria-pressed", current === "up" ? "true" : "false");
  downButton.classList.toggle("is-active", current === "down");
  downButton.setAttribute("aria-pressed", current === "down" ? "true" : "false");

  if (current) {
    feedbackState.set(ideaId, current);
  } else {
    feedbackState.delete(ideaId);
  }

  if (card.ideaData) {
    const voteState = current === "up" ? "upvote" : "downvote";
    persistVote(card.ideaData, voteState).catch((error) => {
      console.error("Vote persistence failed", error);
    });
  }
}

function markdownToHtml(value) {
  if (!value) {
    return "";
  }

  const cleaned = value
    .replace(/<!--\s*card:start\s*-->/gi, "")
    .replace(/<!--\s*card:end\s*-->/gi, "")
    .trim();

  if (window.marked && typeof window.marked.parse === "function") {
    if (!markedConfigured && typeof window.marked.use === "function") {
      window.marked.use({ mangle: false, headerIds: false, breaks: true });
      markedConfigured = true;
    }
    return window.marked.parse(cleaned);
  }

  return cleaned.replace(/\n/g, "<br />");
}

function buildFeedbackBar(card, ideaId) {
  const container = document.createElement("div");
  container.className = "feedback-bar";

  const upButton = document.createElement("button");
  upButton.type = "button";
  upButton.className = "feedback-button feedback-button--up";
  upButton.innerHTML = "<span aria-hidden=\"true\">👍</span>";
  upButton.setAttribute("aria-label", "Thumbs up");
  upButton.setAttribute("aria-pressed", "false");

  const downButton = document.createElement("button");
  downButton.type = "button";
  downButton.className = "feedback-button feedback-button--down";
  downButton.innerHTML = "<span aria-hidden=\"true\">👎</span>";
  downButton.setAttribute("aria-label", "Thumbs down");
  downButton.setAttribute("aria-pressed", "false");

  upButton.addEventListener("click", () =>
    handleFeedbackSelection(card, "up", upButton, downButton, ideaId)
  );
  downButton.addEventListener("click", () =>
    handleFeedbackSelection(card, "down", upButton, downButton, ideaId)
  );

  container.appendChild(upButton);
  container.appendChild(downButton);

  return container;
}

async function persistVote(idea, action) {
  try {
    const contextNeeds = Array.isArray(idea.selectedNeeds) && idea.selectedNeeds.length
      ? idea.selectedNeeds
      : Array.from(selectedNeeds);
    await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        action,
        idea,
        context: {
          designContext,
          domain: domainField.value.trim(),
          needs: contextNeeds,
          evaluators: Array.from(selectedEvaluators)
        }
      })
    });
  } catch (error) {
    console.error("Persist vote error", error);
  }
}

function createIdeaCard(idea, index) {
  const card = document.createElement("article");
  card.className = "idea-card";
  const ideaId =
    idea.id || idea.ideaId || (window.crypto?.randomUUID?.() ?? `idea-${Date.now()}-${index}`);
  card.dataset.ideaId = ideaId;
  card.ideaData = {
    ...idea,
    id: ideaId,
    domain: domainField.value.trim(),
    designContext
  };

  const meta = document.createElement("div");
  meta.className = "idea-card__meta";

  if (idea.purposeStatement) {
    const purpose = document.createElement("p");
    purpose.className = "idea-card__purpose";
    purpose.textContent = idea.purposeStatement;
    meta.appendChild(purpose);
  }

  if (idea.shortDescription) {
    const shortDesc = document.createElement("p");
    shortDesc.className = "idea-card__short";
    shortDesc.textContent = idea.shortDescription;
    meta.appendChild(shortDesc);
  }

  const markdownSection = document.createElement("div");
  markdownSection.className = "idea-card__markdown";
  markdownSection.innerHTML = markdownToHtml(idea.markdown);

  const feedbackBar = buildFeedbackBar(card, ideaId);

  if (meta.childElementCount > 0) {
    card.appendChild(meta);
  }
  card.appendChild(markdownSection);
  card.appendChild(feedbackBar);

  return card;
}

function renderCreativeSparks(creativeSparks) {
  const section = document.createElement("section");
  section.className = "creative-sparks";

  const heading = document.createElement("h2");
  heading.textContent = "Creative Sparks";

  const theme = document.createElement("p");
  theme.className = "creative-sparks__theme";
  theme.textContent = creativeSparks.theme;

  const list = document.createElement("ol");
  list.className = "creative-sparks__prompts";

  (creativeSparks.prompts || []).forEach((prompt) => {
    const item = document.createElement("li");
    item.textContent = prompt;
    list.appendChild(item);
  });

  section.appendChild(heading);
  section.appendChild(theme);
  section.appendChild(list);

  return section;
}

function renderDesignSpace(designSpace) {
  const wrapper = document.createElement("section");
  wrapper.className = "design-space";

  const heading = document.createElement("h2");
  heading.textContent = "Design Space";

  const summary = document.createElement("p");
  summary.className = "design-space__summary";
  summary.textContent = designSpace.summary;

  const list = document.createElement("ul");
  list.className = "design-space__clusters";

  (designSpace.capabilityClusters || []).forEach((cluster) => {
    const item = document.createElement("li");
    const title = document.createElement("h3");
    title.textContent = cluster.title;
    const body = document.createElement("p");
    body.textContent = cluster.description;
    item.appendChild(title);
    item.appendChild(body);
    list.appendChild(item);
  });

  wrapper.appendChild(heading);
  wrapper.appendChild(summary);
  wrapper.appendChild(list);

  return wrapper;
}

function renderEvaluatorPlans(evaluators) {
  if (!Array.isArray(evaluators) || evaluators.length === 0) {
    return null;
  }

  const section = document.createElement("section");
  section.className = "evaluator-plans";

  const heading = document.createElement("h2");
  heading.textContent = "Evaluator Agents";

  const list = document.createElement("ul");
  list.className = "evaluator-plans__list";

  evaluators.forEach((plan) => {
    const item = document.createElement("li");
    const name = document.createElement("h3");
    name.textContent = plan.name;
    const focus = document.createElement("p");
    focus.className = "evaluator-plan__focus";
    focus.textContent = plan.focus;
    const detail = document.createElement("p");
    detail.className = "evaluator-plan__details";
    detail.textContent = plan.evaluationPlan;

    item.appendChild(name);
    item.appendChild(focus);
    item.appendChild(detail);
    list.appendChild(item);
  });

  section.appendChild(heading);
  section.appendChild(list);

  return section;
}

function renderIdeas(payload, options = {}) {
  const { fallback = false, errorDetails = null } = options;
  const { creativeSparks, designSpace, ideas, evaluators, needs: responseNeeds } = payload;
  feedbackState.clear();
  clearOutput();

  if (fallback) {
    const note = document.createElement("div");
    note.className = "fallback-note";
    const detailText = errorDetails ? ` (${errorDetails})` : "";
    note.textContent = `⚠️ Live brainstorming isn't available right now${detailText}. Showing sample constellations instead.`;
    output.appendChild(note);
  }

  if (creativeSparks) {
    output.appendChild(renderCreativeSparks(creativeSparks));
  }

  if (designSpace) {
    output.appendChild(renderDesignSpace(designSpace));
  }

  const evaluatorPlansSection = renderEvaluatorPlans(Array.isArray(evaluators) ? evaluators : []);
  if (evaluatorPlansSection) {
    output.appendChild(evaluatorPlansSection);
  }

  if (!Array.isArray(ideas) || ideas.length === 0) {
    showStatus("No ideas were generated. Try adjusting your prompt.");
    return;
  }

  const grid = document.createElement("div");
  grid.className = "idea-grid";

  const normalizedIdeas = ideas.map((idea, index) => {
    const ideaId = idea.id || window.crypto?.randomUUID?.() || `idea-${Date.now()}-${index}`;
    return { ...idea, id: ideaId };
  });

  normalizedIdeas.forEach((idea, index) => {
    const card = createIdeaCard(
      {
        ...idea,
        selectedNeeds: responseNeeds ?? Array.from(selectedNeeds)
      },
      index
    );
    grid.appendChild(card);
  });

  output.appendChild(grid);

  syncSavedVotes(normalizedIdeas).catch((error) => {
    console.error("Failed to sync saved votes", error);
  });
}

function updateSelectedNeedsLabel() {
  if (!selectedNeedsLabel) return;
  if (!selectedNeeds.size) {
    selectedNeedsLabel.textContent = "Needs: –";
    return;
  }
  const list = Array.from(selectedNeeds).join(", ");
  selectedNeedsLabel.textContent = `Needs: ${list}`;
}

function syncNeedButtons() {
  if (!needList) return;
  const selected = new Set(Array.from(selectedNeeds));
  needList.querySelectorAll("button").forEach((button) => {
    const isActive = selected.has(button.dataset.need);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function toggleNeed(need, button) {
  if (selectedNeeds.has(need)) {
    selectedNeeds.delete(need);
    button.setAttribute("aria-pressed", "false");
  } else {
    selectedNeeds.add(need);
    button.setAttribute("aria-pressed", "true");
  }
  updateSelectedNeedsLabel();
}

async function fetchNeeds() {
  try {
    const res = await fetch("/api/needs");
    if (!res.ok) throw new Error("Failed to load needs");
    const data = await res.json();
    const needs = data?.needs ?? [];

    needs.forEach((need) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = need;
      button.dataset.need = need;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => toggleNeed(need, button));
      needList.appendChild(button);
    });

    syncNeedButtons();
  } catch (error) {
    needList.innerHTML = `<p class="error">Could not load needs. Please refresh.</p>`;
    console.error(error);
  }
}

async function fetchEvaluators() {
  if (!evaluatorList) return;

  try {
    const res = await fetch("/api/evaluators");
    if (!res.ok) throw new Error("Failed to load evaluators");
    const data = await res.json();
    const evaluators = data?.evaluators ?? [];

    evaluators.forEach((agent) => {
      const wrapper = document.createElement("label");
      wrapper.className = "evaluator-option";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = agent.id;
      checkbox.addEventListener("change", (event) => {
        const { checked, value } = event.target;
        if (checked) {
          selectedEvaluators.add(value);
        } else {
          selectedEvaluators.delete(value);
        }
      });

      const content = document.createElement("div");
      const name = document.createElement("p");
      name.className = "evaluator-option__name";
      name.textContent = agent.name;
      const description = document.createElement("p");
      description.className = "evaluator-option__description";
      description.textContent = agent.description;

      content.appendChild(name);
      content.appendChild(description);

      wrapper.appendChild(checkbox);
      wrapper.appendChild(content);
      evaluatorList.appendChild(wrapper);
    });
  } catch (error) {
    evaluatorList.innerHTML = `<p class="error">Could not load evaluator agents.</p>`;
    console.error(error);
  }
}

async function brainstorm(event) {
  event.preventDefault();

  const prompt = promptField.value.trim();
  const domain = domainField.value.trim();
  const evaluators = Array.from(selectedEvaluators);
  if (!selectedNeeds.size) {
    alert("Pick at least one human need to focus your agent concept.");
    return;
  }
  if (!designContext) {
    alert("Describe the context you want to support first.");
    return;
  }
  if (!prompt) {
    alert("Add a short design brief before generating ideas.");
    return;
  }
  if (!domain) {
    alert("Describe the application domain so the agent constellation can be grounded.");
    return;
  }

  const submitButton = ideaForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.classList.add("loading");
  showStatus("Generating agent constellations…", "loading");

  try {
    const res = await fetch("/api/brainstorm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        needs: Array.from(selectedNeeds),
        context: designContext,
        prompt,
        domain,
        evaluators,
        history
      })
    });

    if (!res.ok) {
      const details = await res.json().catch(() => ({}));
      throw new Error(details?.error || "Request failed");
    }

    const data = await res.json();
    const ideas = Array.isArray(data?.ideas) ? data.ideas : [];
    const creativeSparks = data?.creativeSparks ?? null;
    const designSpace = data?.designSpace ?? null;
    const evaluatorPlans = Array.isArray(data?.evaluators) ? data.evaluators : [];
    const isFallback = Boolean(data?.fallback);
    const errorDetails = data?.error ?? null;

    if (ideas.length === 0 || !designSpace || !creativeSparks) {
      throw new Error("No ideas returned.");
    }

    const responseNeeds = Array.isArray(data?.needs) ? data.needs : Array.from(selectedNeeds);
    selectedNeeds.clear();
    responseNeeds.forEach((value) => selectedNeeds.add(value));
    updateSelectedNeedsLabel();
    syncNeedButtons();

    if (!isFallback) {
      const needsList = Array.from(selectedNeeds).join(", ");
      history.push({
        role: "user",
        content: `Context: ${designContext}; Needs: ${needsList}; Domain: ${domain}; Evaluators: ${evaluators.join(", ") || "none"}; Brief: ${prompt}`
      });
      history.push({
        role: "assistant",
        content: JSON.stringify({ creativeSparks, designSpace, ideas, evaluators: evaluatorPlans })
      });
    }

    renderIdeas({
      creativeSparks,
      designSpace,
      ideas,
      evaluators: evaluatorPlans,
      needs: responseNeeds
    }, {
      fallback: isFallback,
      errorDetails
    });
  } catch (error) {
    showStatus(`⚠️ ${error.message}. Try again soon.`, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("loading");
  }
}

async function syncSavedVotes(ideas) {
  if (!ideas.length) return;
  try {
    const res = await fetch(`/api/votes?clientId=${encodeURIComponent(clientId)}`);
    if (!res.ok) return;
    const data = await res.json();
    const savedIds = new Set((data?.votes ?? []).map((vote) => vote.idea_id));
    ideas.forEach((idea) => {
      if (!savedIds.has(idea.id)) return;
      const card = output.querySelector(`[data-idea-id="${idea.id}"]`);
      if (!card) return;
      const upButton = card.querySelector(".feedback-button--up");
      const downButton = card.querySelector(".feedback-button--down");
      if (upButton && downButton) {
        card.dataset.feedback = "up";
        upButton.classList.add("is-active");
        upButton.setAttribute("aria-pressed", "true");
        downButton.classList.remove("is-active");
        downButton.setAttribute("aria-pressed", "false");
        feedbackState.set(idea.id, "up");
      }
    });
  } catch (error) {
    console.error("Sync saved votes error", error);
  }
}

function attachStarterPrompts() {
  document.querySelectorAll(".prompt-starters li").forEach((item) => {
    item.addEventListener("click", () => {
      const starter = item.dataset.starter;
      const starterDomain = item.dataset.domain;
      promptField.value = starter;
      if (starterDomain) {
        domainField.value = starterDomain;
      }
      promptField.focus();
    });
  });
}

fetchNeeds();
fetchEvaluators();
attachStarterPrompts();
setOutputPlaceholder();
updateSelectedNeedsLabel();
ideaForm.addEventListener("submit", brainstorm);

if (contextForm && contextStep && designStep) {
  contextForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = contextTextarea.value.trim();
    if (!value) {
      alert("Describe the context you want to support.");
      return;
    }
    designContext = value;
    history = [];
    selectedNeeds.clear();
    updateSelectedNeedsLabel();
    syncNeedButtons();
    selectedEvaluators.clear();
    if (evaluatorList) {
      evaluatorList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.checked = false;
      });
    }
    if (domainField && !domainField.value.trim()) {
      domainField.value = designContext;
    }
    contextStep.classList.add("hidden");
    designStep.classList.remove("hidden");
    setOutputPlaceholder();
    updateSelectedNeedsLabel();
    promptField.focus();
  });
}
