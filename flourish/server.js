import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️  OPENAI_API_KEY is not set. API requests will fail until you configure it.");
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    })
  : null;

function ensureSupabase(res) {
  if (!supabase) {
    res.status(500).json({ error: "Supabase is not configured." });
    return null;
  }
  return supabase;
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DESMET_NEEDS = [
  "Autonomy",
  "Competence",
  "Relatedness",
  "Stimulation",
  "Security",
  "Popularity",
  "Meaning",
  "Pleasure",
  "Physical thriving",
  "Self-expression",
  "Morality",
  "Comfort",
  "Contribution"
];

const EVALUATOR_AGENTS = [
  {
    id: "safety-steward",
    name: "Safety Steward",
    description:
      "Monitors for wellbeing risks, policy violations, and moments that should hand off to humans."
  },
  {
    id: "empathy-mirror",
    name: "Empathy Mirror",
    description:
      "Scores tone, inclusion, and emotional resonance so interactions feel caring and culturally sensitive."
  },
  {
    id: "evidence-auditor",
    name: "Evidence Auditor",
    description:
      "Checks suggestions against cited research or organisational guidelines to prevent misinformation."
  },
  {
    id: "bias-scout",
    name: "Bias Scout",
    description:
      "Surfaces blind spots across personas and contexts to keep flourishing equitable."
  },
  {
    id: "delight-pulse",
    name: "Delight Pulse",
    description:
      "Tracks novelty and intrinsic motivation cues to keep the experience energising and sustainable."
  }
];

const EVALUATOR_LOOKUP = new Map(
  EVALUATOR_AGENTS.map((agent) => [agent.id, agent])
);

const FALLBACK_LIBRARY = {
  Autonomy: {
    constellation: "Pathfinder Guild",
    pitch: "keeps agency with the user while coordinating supportive co-pilots.",
    summary: "Supports reflective planning so the user authors the final call.",
    workflow: [
      "Navigator Agent – frames decisions inside Agent Builder with guardrailed reflection prompts.",
      "Insight Archivist – logs option trade-offs to a Connector Registry workspace for later review.",
      "Momentum Nudge – ChatKit micro-coach that only activates when the user requests extra scaffolding."
    ],
    tools: [
      "Connector Registry to sync decision journals and research snippets.",
      "Guardrails jailbreak detection to keep prompts autonomy-supportive.",
      "Evals trace grading to ensure the navigator honours user-defined criteria."
    ],
    experiment: "Shadow one live decision this week, co-create three scenario boards, and watch whether users feel ownership."
  },
  Competence: {
    constellation: "Momentum Studio",
    pitch: "translates practice data into motivating, adaptive guidance.",
    summary: "Transforms progress signals into confidence-building feedback loops.",
    workflow: [
      "Goal Cartographer – maps skills progression using Agent Builder branches for novice vs. advanced paths.",
      "Drill Designer – spins up tailored exercises in ChatKit with code interpreter scoring.",
      "Celebration Curator – surfaces micro-wins and social kudos via Connector Registry feeds."
    ],
    tools: [
      "Connector Registry to pull LMS or product telemetry securely.",
      "Code Interpreter sessions for automated skill checks and feedback generation.",
      "Evals datasets to benchmark learning impact over time."
    ],
    experiment: "Pilot a weekly recap that highlights one improvement and suggests the next stretch task with a learner." 
  },
  Relatedness: {
    constellation: "Kinship Constellation",
    pitch: "sustains meaningful bonds through orchestrated micro-rituals.",
    summary: "Helps people weave mutual care into everyday routines.",
    workflow: [
      "Matchmaker Agent – uses Agent Builder branches to pair peers for check-ins.",
      "Ritual Host – runs ChatKit group circles with warmth guardrails and sentiment sensing.",
      "Signal Scout – monitors tone shifts via Connector Registry data and flags when human facilitators should step in."
    ],
    tools: [
      "ChatKit for multi-party threads with lightweight facilitation widgets.",
      "Guardrails tone filters to keep exchanges psychologically safe.",
      "Evals trace grading to measure connection quality week over week."
    ],
    experiment: "Run a one-week buddy pilot with two curated rituals and gather perceived closeness scores." 
  },
  Stimulation: {
    constellation: "Wonder Circuit",
    pitch: "balances novelty and recovery through coordinated scouts.",
    summary: "Keeps life fresh while respecting energy limits.",
    workflow: [
      "Exploration Scout – mines Connector Registry data (events, locations) for fresh stimuli.",
      "Rhythm Keeper – checks rest patterns via wearables and throttles suggestions when users need recovery.",
      "Story Weaver – captures experiences in ChatKit to deepen meaning after the adventure." 
    ],
    tools: [
      "Connector Registry integrations with calendars and local discovery APIs.",
      "Guardrails safety filters for location-aware prompts.",
      "Evals satisfaction surveys automated via datasets."
    ],
    experiment: "Design a single 'curiosity break' for this weekend and debrief energy levels afterwards." 
  },
  Security: {
    constellation: "Safe Harbor Network",
    pitch: "anticipates risks and orchestrates responsive buffers.",
    summary: "Builds contingency plans and escalates when thresholds are crossed.",
    workflow: [
      "Risk Radar – runs what-if checklists in Agent Builder with guardrailed triggers.",
      "Resource Quartermaster – maintains emergency contacts and resources in Connector Registry.",
      "Care Relay – coordinates human handoffs via ChatKit when escalation criteria fire." 
    ],
    tools: [
      "Guardrails policy nodes for crisis language detection.",
      "Connector Registry for secure storage of plans and contacts.",
      "Evals trace grading to validate escalation accuracy." 
    ],
    experiment: "Walk through a stressful scenario, co-design a calm response playbook, and rehearse the escalation flow." 
  },
  Popularity: {
    constellation: "Spotlight Syndicate",
    pitch: "captures everyday wins and amplifies authentic recognition.",
    summary: "Ensures contributions are seen and celebrated meaningfully.",
    workflow: [
      "Signal Collector – ingests kudos signals from consented channels via connectors.",
      "Story Spinner – crafts shareable highlight reels in ChatKit with narrative guardrails.",
      "Appreciation Maestro – prompts peers to co-sign gratitude through approval steps." 
    ],
    tools: [
      "Connector Registry integrations with Slack/email archives as allowed.",
      "ChatKit carousels for highlight reels.",
      "Evals rubric to ensure recognition stays specific and sincere." 
    ],
    experiment: "Gather three real kudos snippets and prototype a highlight digest with the recipient." 
  },
  Meaning: {
    constellation: "Purpose Loom",
    pitch: "weaves daily actions into an uplifting life narrative.",
    summary: "Maintains a sense of significance through reflection and action alignment.",
    workflow: [
      "Values Archivist – stores guiding principles and stories via Connector Registry.",
      "Narrative Composer – co-authors chapters in ChatKit with scene-setting prompts.",
      "Alignment Checker – runs Evals trace grading to confirm new plans reinforce stated values." 
    ],
    tools: [
      "Agent Builder branches for short-term vs. long-term meaning quests.",
      "Connector Registry vault for personal narratives and artefacts.",
      "Evals automated resonance checks on journal entries." 
    ],
    experiment: "Draft a single 'chapter page' with the user and test whether it sparks motivation the next day." 
  },
  Pleasure: {
    constellation: "Savor Suite",
    pitch: "cultivates mindful delight without overindulgence.",
    summary: "Expands sensory appreciation and restorative breaks.",
    workflow: [
      "Savor Planner – schedules micro-pleasure rituals with Agent Builder timers.",
      "Guide DJ – streams audio/visual prompts through ChatKit multimedia cards.",
      "Boundary Guardian – watches for overload via Guardrails and suggests balance." 
    ],
    tools: [
      "Connector Registry calendar + preference integrations.",
      "ChatKit media attachments for guided experiences.",
      "Guardrails to enforce healthy cadence and consent." 
    ],
    experiment: "Run a 24-hour savoring challenge and collect mood notes before/after." 
  },
  "Physical thriving": {
    constellation: "Vitality Collective",
    pitch: "turns body data into compassionate, actionable guidance.",
    summary: "Encourages balanced routines across movement, rest, and nutrition.",
    workflow: [
      "Signals Analyst – ingests wearable exports and charts insights with code interpreter.",
      "Rhythm Coach – plans adaptive routines in ChatKit and nudges via connectors.",
      "Care Liaison – flags concerning trends and shares resources or clinician escalations." 
    ],
    tools: [
      "Connector Registry for health data and habit trackers.",
      "Code Interpreter for trend analysis and visualization.",
      "Guardrails to respect medical disclaimers and personal boundaries." 
    ],
    experiment: "Co-create a 3-day energy experiment and review how the body responded together." 
  },
  "Self-expression": {
    constellation: "Identity Studio",
    pitch: "supports expressive artefacts that mirror evolving selves.",
    summary: "Enables creative exploration with supportive feedback.",
    workflow: [
      "Inspiration Curator – gathers references through Connector Registry (mood boards, playlists).",
      "Creation Partner – helps prototype artefacts in ChatKit with optional model-generated drafts.",
      "Reflection Coach – facilitates sharing circles and captures feedback for future iterations." 
    ],
    tools: [
      "Connector Registry for creative asset libraries.",
      "ChatKit collaborative canvases or attachment support.",
      "Evals structured prompts to track confidence growth." 
    ],
    experiment: "Host a quick 'show-and-tell' session to see if the creation sparks pride." 
  },
  Morality: {
    constellation: "Ethos Observatory",
    pitch: "guides principled choices when stakes feel murky.",
    summary: "Provides structured reflection and multi-perspective insight.",
    workflow: [
      "Context Cartographer – lays out scenario facts using Agent Builder decision trees.",
      "Perspective Mediator – facilitates value-based dialogues via ChatKit templates.",
      "Integrity Auditor – uses Evals custom graders to compare options against stated principles." 
    ],
    tools: [
      "Connector Registry for storing ethical guidelines and precedents.",
      "Guardrails to prevent harmful or biased outputs.",
      "Evals custom rubrics for moral alignment scoring." 
    ],
    experiment: "Apply the observatory to one real dilemma and debrief satisfaction with the outcome." 
  },
  Comfort: {
    constellation: "Ease Collective",
    pitch: "designs rituals that settle the nervous system and environment.",
    summary: "Raises calm and restores emotional balance.",
    workflow: [
      "Soothe Conductor – offers breathing and grounding scripts via ChatKit multimedia.",
      "Space Tuner – checks environment data (light, noise) through connectors and suggests tweaks.",
      "Rest Guardian – enforces quiet hours using Guardrails and schedules replenishment blocks." 
    ],
    tools: [
      "Connector Registry hooks into smart home or journaling apps.",
      "ChatKit audio/video embeds for calming routines.",
      "Guardrails to respect safety and privacy preferences." 
    ],
    experiment: "Prototype tonight's wind-down ritual and log how restorative it felt." 
  },
  Contribution: {
    constellation: "Ripple Foundry",
    pitch: "amplifies pro-social efforts and makes impact tangible.",
    summary: "Connects people to meaningful opportunities and feedback.",
    workflow: [
      "Opportunity Scout – matches users with causes using connector-integrated databases.",
      "Coordination Foreman – orchestrates task handoffs in Agent Builder with approval checkpoints.",
      "Impact Storyteller – aggregates outcomes and shares them via ChatKit stories to the community." 
    ],
    tools: [
      "Connector Registry links to volunteering platforms and CRM data.",
      "ChatKit galleries for impact updates.",
      "Evals dashboards to quantify ripple effects." 
    ],
    experiment: "Support one new community action and co-create a story about the ripple with peers." 
  }
};

const DEFAULT_FALLBACK = {
  constellation: "Flourish Prototype",
  pitch: "explores ways to support human flourishing.",
  summary: "Encourages mindful experimentation even without live AI calls.",
  workflow: [
    "Explorer Agent – maps the journey with friendly ChatKit prompts.",
    "Archivist Agent – stores insights in a shared workspace via connectors.",
    "Reflection Coach – reviews progress together with lightweight evals."
  ],
  tools: [
    "ChatKit conversational canvas with multimedia support.",
    "Connector Registry links to shared docs and trackers.",
    "Evals quick rubric to gauge perceived flourishing."
  ],
  experiment: "Test one micro-intervention with a friend and capture feedback."
};

function assembleMarkdown({ title, pitch, need, domain, summary, workflow, tools, brief, experiment }) {
  const lines = [
    "<!-- card:start -->",
    `## ${title}`,
    `> ${pitch}`,
    "",
    "### Need Alignment",
    `- **Human need:** ${need}`
  ];

  if (domain) {
    lines.push(`- **Application domain:** ${domain}`);
  }

  lines.push(`- **Why it helps:** ${summary}`);
  lines.push("");
  lines.push("### Multi-agent workflow");

  workflow.forEach((item) => {
    lines.push(`- ${item}`);
  });

  lines.push("");
  lines.push("### Tools & integrations");

  tools.forEach((item) => {
    lines.push(`- ${item}`);
  });

  if (brief) {
    lines.push("");
    lines.push("### Notes from the brief");
    lines.push(`> ${brief}`);
  }

  lines.push("");
  lines.push(`**Next experiment:** ${experiment}`);
  lines.push("<!-- card:end -->");

  return lines.join("\n");
}

function createIdeaPayload(config, context) {
  const workflow = Array.isArray(config.workflow) ? config.workflow : [];
  const tools = Array.isArray(config.tools) ? config.tools : [];

  return {
    id: config.id ?? randomUUID(),
    title: config.constellation,
    purposeStatement: config.purposeStatement ?? config.summary,
    shortDescription: config.shortDescription ?? config.pitch,
    elevatorPitch: config.pitch,
    needSummary: config.summary,
    markdown: assembleMarkdown({
      title: config.constellation,
      pitch: config.pitch,
      need: context.need,
      domain: context.domain,
      summary: config.summary,
      workflow,
      tools,
      brief: context.brief,
      experiment: config.experiment
    }),
    nextExperiment: config.experiment
  };
}

function buildFallback(needs, prompt, domain, evaluatorIds, contextDescription) {
  const primaryNeed = Array.isArray(needs) && needs.length ? needs[0] : "Autonomy";
  const needLabel = Array.isArray(needs) && needs.length ? needs.join(", ") : primaryNeed;
  const base = FALLBACK_LIBRARY[primaryNeed] ?? DEFAULT_FALLBACK;
  const promptBrief = typeof prompt === "string" ? prompt.trim() : "";
  const contextBrief = typeof contextDescription === "string" ? contextDescription.trim() : "";
  const combinedBrief = [promptBrief, contextBrief].filter(Boolean).join(" | ");
  const domainValue = typeof domain === "string" ? domain : "";
  const context = { need: needLabel, domain: domainValue, brief: combinedBrief };

  const ideas = [
    createIdeaPayload(
      {
        ...base,
        purposeStatement:
          base.purposeStatement ||
          "Help people act on values while protecting wellbeing commitments.",
        shortDescription:
          base.shortDescription ||
          "Coordinates supportive agents so the user keeps agency and momentum."
      },
      context
    )
  ];

  const fieldLabConfig = {
    id: randomUUID(),
    constellation: `${base.constellation} Field Lab`,
    pitch: `pressure-tests the ${base.constellation.toLowerCase()} approach with real people.`,
    summary: domainValue
      ? `Rapid experiments localize the constellation for ${domainValue}.`
      : "Rapid experiments localize the constellation for the focus area.",
    workflow: [
      `${base.constellation} Field Lead – recruits a small cohort in ${domainValue || "the field"} and guides sessions.`,
      "Qual Insights Agent – captures reflections via ChatKit voice or video cards.",
      "Impact Analyst – uses Evals datasets to compare pilot outcomes with the baseline experience."
    ],
    tools: [
      "ChatKit multimedia prompts for journaling and guided debriefs.",
      "Connector Registry links to pilot notes and dashboards.",
      "Evals comparison rubric to translate pilot insights into next steps."
    ],
    purposeStatement: domainValue
      ? "Translate the constellation into the lived context of users."
      : "Translate the constellation into the lived context of participants.",
    shortDescription:
      "Runs a lightweight field experiment with human-in-the-loop feedback to refine the agent trio.",
    experiment: domainValue
      ? `Run a 48-hour pilot with 3 participants in ${domainValue}, then huddle to tune the workflow.`
      : "Run a 48-hour pilot with 3 participants in the focus area, then huddle to tune the workflow."
  };

  ideas.push(createIdeaPayload(fieldLabConfig, context));

  const baseSummary = domainValue
    ? `Capability clusters that expand flourishing within ${domainValue}.`
    : "Capability clusters that expand flourishing within this context.";

  const capabilityClusters = [
    {
      title: "Orchestrator agents",
      description:
        "Coordinate wellbeing workflows end-to-end using Agent Builder and Guardrails to uphold autonomy-supportive guardrails."
    },
    {
      title: "Sensing companions",
      description:
        "Ingest journaling, wearable, or survey signals via Connector Registry to surface compassionate insights and early alerts."
    },
    {
      title: "Learning + reflection guides",
      description:
        "Deliver adaptive practices through ChatKit while benchmarking growth with Evals to sustain flourishing habits."
    },
    {
      title: "Bridge agents",
      description:
        "Hand off smoothly to humans or community resources using approvals, shared dashboards, and Connector Registry governance."
    }
  ];

  const selectedEvaluators = (Array.isArray(evaluatorIds) ? evaluatorIds : [])
    .map((id) => EVALUATOR_LOOKUP.get(id))
    .filter(Boolean);

  const evaluatorPlans = selectedEvaluators.map((agent) => ({
    name: agent.name,
    focus:
      agent.id === "safety-steward"
        ? "Safeguard wellbeing thresholds and policy compliance."
        : agent.id === "empathy-mirror"
        ? "Maintain compassionate, inclusive tone and emotional attunement."
        : agent.id === "evidence-auditor"
        ? "Ground outputs in evidence and organisational guidance."
        : agent.id === "bias-scout"
        ? "Detect representation gaps across personas and contexts."
        : "Track motivation signals and playful energy.",
    evaluationPlan:
      agent.id === "safety-steward"
        ? "Use Guardrails jailbreak detectors plus Evals traces on risky scenarios; auto-route red flags to a human queue."
        : agent.id === "empathy-mirror"
        ? "Run Evals tone rubrics on transcripts and request reflective journaling spot-checks from pilot users."
        : agent.id === "evidence-auditor"
        ? "Cross-check citations via Connector Registry knowledge bases and log disagreements for human review."
        : agent.id === "bias-scout"
        ? "Simulate edge personas with synthetic data, scoring parity metrics in Evals dashboards."
        : "Survey novelty joy weekly and correlate with usage retention using lightweight Evals datasets."
  }));

  const summary = evaluatorPlans.length
    ? baseSummary
    : `${baseSummary} Consider activating the Empathy Mirror or Safety Steward to keep prototypes humane.`;

  return {
    creativeSparks: {
      theme: domainValue
        ? `Stretch the ${domainValue} landscape with human-flourishing agent constellations.`
        : "Stretch this landscape with human-flourishing agent constellations.",
      prompts: [
        "Borrow inspiration from a domain with radically different constraints—what fails gracefully there?",
        "Imagine the agents collaborating with an extreme user whose needs flip the default assumptions.",
        "Remove one core resource; how could the constellation still spark joy and resilience?"
      ]
    },
    designSpace: {
      summary,
      capabilityClusters: capabilityClusters.slice(0, 3 + Number(Boolean(domainValue)))
    },
    ideas,
    evaluators: evaluatorPlans
  };
}

const systemPreamble = `You are FlourishForm, an interaction design strategist helping product teams craft ecosystems of agents that support human flourishing. Ground your guidance in Pieter Desmet's positive design framework, creativity research (e.g., Amabile, Sawyer), and the 13 fundamental human needs. Always respond with valid JSON matching the provided schema. Every response must:
- Open with a "Creative Sparks" section: outline a theme sentence (why this design space is ripe for creative exploration) plus 3 prompts that stretch imagination (e.g., analogies, extreme-user reframes, constraint flips).
- Follow with a design space analysis tailored to the application domain. Map 3-4 capability clusters (orchestrators, sensing agents, learning companions, bridge agents, etc.). Each cluster should have two concise sentences: one describing the value, one naming relevant AgentKit capabilities.
- Provide 2 or 3 idea objects. For each idea:
  - Include the fields title, purposeStatement (max 20 words capturing the deeper motivation), and shortDescription (max 40 words describing the experience).
  - Within the markdown segment (wrapped between '<!-- card:start -->' and '<!-- card:end -->') include: a level-2 heading with the title; a blockquote for the elevator pitch; a "### Need Alignment" list (max three bullets); a "### Multi-agent workflow" list (2-3 agents with AgentKit handoffs); a "### Tools & integrations" list (max three bullets); and conclude with '**Next experiment:**' plus a prototype invitation under 25 words.
  - Keep each idea under 170 words total.
- Mirror any evaluator agents activated by the user (you will receive their names and role descriptions). In the 'evaluators' array, provide one entry per activated agent with a short focus statement and a concrete evaluation plan referencing AgentKit tooling (e.g., Guardrails, Evals, dashboards). If none are activated, return an empty array but suggest one optional evaluator inside the design space summary.
Maintain an optimistic, practical tone anchored in wellbeing science while encouraging playful experimentation.`;

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["creativeSparks", "designSpace", "ideas", "evaluators"],
  properties: {
    creativeSparks: {
      type: "object",
      additionalProperties: false,
      required: ["theme", "prompts"],
      properties: {
        theme: { type: "string" },
        prompts: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: { type: "string" }
        }
      }
    },
    designSpace: {
      type: "object",
      additionalProperties: false,
      required: ["summary", "capabilityClusters"],
      properties: {
        summary: { type: "string" },
        capabilityClusters: {
          type: "array",
          minItems: 3,
          maxItems: 4,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["title", "description"],
            properties: {
              title: { type: "string" },
              description: { type: "string" }
            }
          }
        }
      }
    },
    ideas: {
      type: "array",
      minItems: 2,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "title",
          "purposeStatement",
          "shortDescription",
          "elevatorPitch",
          "needSummary",
          "markdown",
          "nextExperiment"
        ],
        properties: {
          title: { type: "string" },
          purposeStatement: { type: "string" },
          shortDescription: { type: "string" },
          elevatorPitch: { type: "string" },
          needSummary: { type: "string" },
          markdown: { type: "string" },
          nextExperiment: { type: "string" }
        }
      }
    },
    evaluators: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "focus", "evaluationPlan"],
        properties: {
          name: { type: "string" },
          focus: { type: "string" },
          evaluationPlan: { type: "string" }
        }
      }
    }
  }
};

function buildMessage(role, text) {
  const type = role === "assistant" ? "output_text" : "input_text";
  return {
    role,
    content: [{ type, text }]
  };
}

app.get("/api/needs", (req, res) => {
  res.json({ needs: DESMET_NEEDS });
});

app.get("/api/evaluators", (req, res) => {
  res.json({ evaluators: EVALUATOR_AGENTS });
});

app.post("/api/brainstorm", async (req, res) => {
  const { need, needs, context, prompt, domain, evaluators = [], history = [] } = req.body ?? {};

  const requestedNeeds = Array.isArray(needs)
    ? needs
    : need
    ? [need]
    : [];

  const validNeeds = requestedNeeds
    .map((item) => String(item))
    .map((item) => item.trim())
    .filter((item) => DESMET_NEEDS.includes(item));

  if (!validNeeds.length) {
    return res.status(400).json({ error: "Please choose at least one valid fundamental need." });
  }

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Provide a prompt describing the context you're designing for." });
  }

  if (!domain || typeof domain !== "string") {
    return res.status(400).json({ error: "Describe the application domain you're exploring." });
  }

  const domainValue = domain.trim();
  const evaluatorIds = Array.isArray(evaluators) ? evaluators.filter((id) => EVALUATOR_LOOKUP.has(id)) : [];
  const evaluatorSummary = evaluatorIds
    .map((id) => {
      const agent = EVALUATOR_LOOKUP.get(id);
      return `${agent.name}: ${agent.description}`;
    })
    .join(" | ");

  try {
    const messages = [buildMessage("system", systemPreamble)];

    history.forEach((item) => {
      if (item?.role && item?.content) {
        const role = item.role === "assistant" ? "assistant" : "user";
        messages.push(buildMessage(role, String(item.content)));
      }
    });

    const needContext = `Focus on supporting the human needs: ${validNeeds.join(", ")}.`;
    const domainContext = `Application domain: ${domainValue}.`;
    const contextLine = context && typeof context === "string" && context.trim().length
      ? `Context description: ${context.trim()}.`
      : "";
    const evaluatorsContextLine = evaluatorIds.length
      ? `Evaluator agents activated: ${evaluatorSummary}.`
      : "Evaluator agents activated: none.";
    const finalPrompt = `${needContext}\n${domainContext}\n${contextLine}\n${evaluatorsContextLine}\n\nDesign brief: ${prompt.trim()}`;

    messages.push(buildMessage("user", finalPrompt));

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: messages,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "flourish_agent_constellation",
          schema: RESPONSE_SCHEMA
        }
      }
    });

    const outputText = response?.output_text;

    if (!outputText) {
      throw new Error("No response received from model.");
    }

    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch (parseError) {
      throw new Error(`Invalid JSON from model: ${parseError.message}`);
    }

    const ideas = Array.isArray(parsed?.ideas) ? parsed.ideas : [];
    const designSpace = parsed?.designSpace;
    const creativeSparks = parsed?.creativeSparks;
    const evaluatorPlans = Array.isArray(parsed?.evaluators) ? parsed.evaluators : [];

    if (!creativeSparks || typeof creativeSparks !== "object") {
      throw new Error("Model response missing creative sparks section.");
    }

    if (!designSpace || typeof designSpace !== "object") {
      throw new Error("Model response missing design space analysis.");
    }

    if (!Array.isArray(designSpace.capabilityClusters) || designSpace.capabilityClusters.length === 0) {
      throw new Error("Design space analysis incomplete.");
    }

    if (ideas.length === 0) {
      throw new Error("Model returned an empty idea set.");
    }

    const normalizedIdeas = ideas.map((idea) => ({
      ...idea,
      id: idea.id ?? randomUUID()
    }));

    res.json({
      creativeSparks,
      designSpace,
      ideas: normalizedIdeas,
      evaluators: evaluatorPlans,
      needs: validNeeds,
      fallback: false
    });
  } catch (error) {
    console.error("Agent brainstorming failed", error);
    const fallbackPayload = buildFallback(validNeeds, prompt, domainValue, evaluatorIds, context);
    res.status(200).json({
      creativeSparks: fallbackPayload.creativeSparks,
      designSpace: fallbackPayload.designSpace,
      ideas: fallbackPayload.ideas,
      evaluators: fallbackPayload.evaluators,
      needs: validNeeds,
      fallback: true,
      error: error?.message ?? "Unknown error"
    });
  }
});

app.get("/api/votes", async (req, res) => {
  const clientId = req.query?.clientId ? String(req.query.clientId) : null;
  const supabaseClient = ensureSupabase(res);
  if (!supabaseClient) return;

  if (!clientId) {
    return res.status(400).json({ error: "clientId is required." });
  }

  try {
    const { data, error } = await supabaseClient
      .from("idea_votes")
      .select("idea_id, idea_data")
      .eq("client_id", clientId);

    if (error) {
      console.error("Supabase fetch votes failed", error);
      return res.status(500).json({ error: "Failed to fetch saved ideas." });
    }

    res.json({ votes: data ?? [] });
  } catch (error) {
    console.error("Supabase fetch votes unexpected", error);
    res.status(500).json({ error: "Failed to fetch saved ideas." });
  }
});

app.post("/api/votes", async (req, res) => {
  const supabaseClient = ensureSupabase(res);
  if (!supabaseClient) return;

  const { clientId, idea, action, context } = req.body ?? {};

  if (!clientId || typeof clientId !== "string") {
    return res.status(400).json({ error: "clientId is required." });
  }

  if (!idea?.id) {
    return res.status(400).json({ error: "idea.id is required." });
  }

  try {
    if (action === "upvote") {
      const payload = {
        client_id: clientId,
        idea_id: idea.id,
        idea_title: idea.title ?? null,
        idea_data: idea,
        needs: context?.needs ?? null,
        domain: context?.domain ?? null,
        design_context: context?.designContext ?? null,
        evaluators: context?.evaluators ?? null
      };

      const { error } = await supabaseClient
        .from("idea_votes")
        .upsert(payload, { onConflict: "client_id,idea_id" });

      if (error) {
        console.error("Supabase upsert vote failed", error);
        return res.status(500).json({ error: "Failed to save idea." });
      }

      return res.json({ status: "saved" });
    }

    const { error } = await supabaseClient
      .from("idea_votes")
      .delete()
      .match({ client_id: clientId, idea_id: idea.id });

    if (error) {
      console.error("Supabase delete vote failed", error);
      return res.status(500).json({ error: "Failed to remove idea." });
    }

    res.json({ status: "removed" });
  } catch (error) {
    console.error("Supabase vote unexpected", error);
    res.status(500).json({ error: "Vote handling failed." });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Flourish Agent Explorer listening on http://${HOST}:${PORT}`);
});
