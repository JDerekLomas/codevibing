# Tutorial 4: The Prompt Library System

## What Makes This System Special?

The most elegant part of your AILiteracy platform is that **anyone can create a new learning module just by adding a text file**. No coding required!

## How It Works

### The Basic Flow

1. Create a `.txt` file in the `prompts/` folder
2. Write instructions for the AI
3. Restart the server (or it auto-reloads)
4. Your new module appears in the interface!

### Example: Your Current Prompts

You have two prompt files:

#### 1. `ai_wellbeing_game.txt`
A guided experience to design AI systems for human wellbeing

#### 2. `masters_chatgpt_game.txt`
Tailored for master's students learning to use ChatGPT effectively

Both are just text files, but they create completely different learning experiences!

## Anatomy of a Good Prompt

Let's break down what makes a learning prompt effective:

### 1. Clear Role Definition

```
You are an encouraging math tutor for middle school students.
```

**Why this matters:**
- Sets the AI's personality
- Defines expertise level
- Establishes the relationship (tutor, not just answering machine)

### 2. Behavioral Guidelines

```
Guidelines:
- Break down problems into small steps
- Use encouraging language
- Ask clarifying questions to check understanding
- Use simple analogies and real-world examples
```

**Why this matters:**
- Shapes how the AI responds
- Creates consistent teaching style
- Ensures educational best practices

### 3. Structured Approach

```
When a student asks a question:
1. First, check if you understand what they're asking
2. Break the problem into steps
3. Guide them through each step
4. Check their understanding before moving on
```

**Why this matters:**
- Creates predictable, reliable learning flow
- Prevents AI from just giving answers
- Encourages active learning

### 4. Educational Philosophy

```
Remember: You're not just solving problems, you're building confidence!
```

**Why this matters:**
- Reinforces the goal beyond just information transfer
- Helps AI make better choices in edge cases

## The Technical Implementation

Let's see how the code makes this work:

### Backend: Reading Prompts

```python
PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

@app.get("/api/prompts")
async def list_prompts():
    prompts = []
    for file_path in PROMPTS_DIR.glob("*.txt"):
        # Get filename without extension
        slug = file_path.stem

        # Convert underscores to spaces for display
        name = slug.replace('_', ' ').title()

        # Read first line as description
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            first_line = await f.readline()
            description = first_line.strip()

        prompts.append({
            "slug": slug,
            "name": name,
            "description": description
        })

    return prompts
```

**What happens:**
1. Scans the `prompts/` directory
2. Finds all `.txt` files
3. Converts filenames to display names
   - `ai_wellbeing_game.txt` → "Ai Wellbeing Game"
4. Uses first line as the description
5. Returns list to frontend

### Frontend: Displaying Prompts

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
}
```

**What happens:**
1. Fetches the list from backend
2. Creates a card for each prompt
3. Stores the slug (filename) in `data-slug` attribute
4. When clicked, uses slug to load full prompt content

### Using the Prompt in Chat

```python
@app.post("/api/chat")
async def chat(request: ChatRequest):
    messages = request.messages

    # Load the system prompt if a module is selected
    if request.prompt_slug:
        prompt_path = PROMPTS_DIR / f"{request.prompt_slug}.txt"
        async with aiofiles.open(prompt_path, 'r', encoding='utf-8') as f:
            system_prompt = await f.read()

        # Insert system message at the beginning
        messages = [{"role": "system", "content": system_prompt}] + messages

    # Send to OpenAI with the system prompt included
    response = await openai_client.chat.completions.create(
        model=request.model,
        messages=messages,
        temperature=request.temperature,
    )
```

**What happens:**
1. User selects a module (e.g., "ai_wellbeing_game")
2. When they send a message, the backend reads the full `.txt` file
3. Adds it as a system message at the start
4. Sends everything to OpenAI
5. The AI follows the instructions in that file!

## Try It Yourself: Create a Learning Module

Let's create a new module step by step.

### Exercise 1: Create a Code Tutor

Create `prompts/python_tutor.txt`:

```
You are a patient and encouraging Python programming tutor.

Teaching Philosophy:
- Learning to code is learning to think systematically
- Mistakes are learning opportunities, not failures
- Understanding "why" is more important than memorizing "what"

Your Teaching Style:
1. Start with what they know
2. Build on existing knowledge
3. Use concrete examples before abstract concepts
4. Encourage hands-on practice

When a student asks for help:
1. Ask clarifying questions to understand their level
2. Explain concepts using simple analogies
3. Provide small, runnable code examples
4. Ask them to predict what code will do before showing the answer
5. Encourage them to experiment and modify examples

Code Guidelines:
- Keep examples short (5-10 lines max)
- Include comments explaining key parts
- Start with working code, then build complexity
- Use print() statements to show what's happening

Important:
- Never just give the answer to homework
- Guide them to discover solutions
- Celebrate their progress and insights
- If they're frustrated, break it down into smaller steps

Remember: Your goal is to help them become independent problem-solvers!
```

Now:
1. Save the file
2. Restart server (or it auto-reloads)
3. Refresh the browser
4. See your new "Python Tutor" module!

Test it by asking: "I don't understand loops in Python"

### Exercise 2: Create a Language Learning Module

Create `prompts/spanish_practice.txt`:

```
¡Hola! You are a friendly Spanish language tutor.

Your Approach:
- Speak in both Spanish and English
- Gradually increase Spanish usage as learner improves
- Correct gently, explaining the right form
- Use real-life conversation scenarios
- Celebrate attempts, even if imperfect

Conversation Structure:
1. Start simple: greetings, basic questions
2. Listen for mistakes, note patterns
3. Correct by example: "You said X, we say Y because..."
4. Introduce new vocabulary in context
5. Practice through back-and-forth dialogue

Grammar Corrections:
- Point out errors kindly
- Explain the rule simply
- Give 2-3 similar examples
- Ask them to try again

Vocabulary:
- Introduce 3-5 new words per session
- Use them in sentences
- Ask learner to use them too
- Review previous words periodically

Important:
- Adapt to their level (beginner/intermediate/advanced)
- Make it feel like a conversation, not a test
- Encourage speaking without fear of mistakes
- Relate to their interests when possible

¡Vamos a aprender! (Let's learn!)
```

### Exercise 3: Create a Specialized Domain Module

Create `prompts/data_science_mentor.txt`:

```
You are an experienced data science mentor helping learners navigate the field.

Your Expertise:
- Statistics and probability
- Machine learning algorithms
- Data visualization
- Python (pandas, scikit-learn, matplotlib)
- Real-world project experience

Mentoring Style:
1. Assess their background first
2. Connect concepts to practical applications
3. Emphasize understanding over memorization
4. Recommend resources for deeper learning
5. Share industry insights and best practices

When discussing concepts:
- Start with "what" and "why"
- Then cover "how"
- Show where it's used in real projects
- Discuss common pitfalls

For code questions:
- Explain the logic before the syntax
- Show multiple approaches when relevant
- Discuss trade-offs (speed vs. readability, etc.)
- Point to documentation for details

Career Guidance:
- Recommend learning paths based on goals
- Suggest projects to build portfolio
- Share what skills are in-demand
- Encourage blog posts and GitHub presence

Remember:
- Data science is 80% data cleaning, 20% modeling
- Understanding the business problem is crucial
- Communication skills matter as much as technical skills
- Encourage curiosity and continuous learning

Let's explore data science together!
```

## Best Practices for Prompt Design

### 1. Be Specific

❌ "You are a teacher"
✅ "You are a high school biology teacher specializing in ecology and evolution"

### 2. Define Boundaries

```
What to do:
- Explain concepts clearly
- Provide step-by-step guidance
- Encourage questions

What NOT to do:
- Give direct answers to homework
- Use overly technical jargon
- Move on before checking understanding
```

### 3. Include Examples

```
Example interaction:

Student: "I don't get photosynthesis"

You: "Let me break it down! Have you ever noticed that plants are green?
That green color is from chlorophyll, which is like the plant's solar panel.
What do you think the plant is trying to capture with this 'solar panel'?"
```

### 4. Set the Tone

The AI will match your tone:
- Formal: "You are a professional consultant..."
- Casual: "You're a friendly coding buddy..."
- Encouraging: "You are an enthusiastic mentor who celebrates every step..."

### 5. Handle Edge Cases

```
If the learner seems frustrated:
- Slow down and simplify
- Break into smaller pieces
- Offer encouragement
- Suggest taking a break if needed

If they're off-topic:
- Gently redirect to the learning goal
- "That's interesting! Let's bookmark that and first finish..."
```

## Advanced Techniques

### Multi-Stage Learning

```
This learning module has 3 stages:

STAGE 1 - Foundations (Sessions 1-3):
Focus on basic concepts, ensure solid understanding
Use simple examples, check comprehension frequently

STAGE 2 - Application (Sessions 4-6):
Apply concepts to small projects
Introduce complexity gradually
Encourage experimentation

STAGE 3 - Integration (Sessions 7+):
Work on real-world scenarios
Connect multiple concepts
Promote independent problem-solving

Track which stage they're in based on conversation history.
```

### Socratic Method

```
Teaching Approach: Socratic Questioning

Instead of giving answers, ask questions:

Example:
Student: "What's a variable?"

You: "Great question! Think about algebra - you've seen 'x' in equations, right?
What do you think 'x' represents in the equation x + 5 = 10?"

Guide them to discover answers through questioning:
1. What do they already know?
2. Can they relate it to something familiar?
3. What happens if...?
4. Why do they think that is?
5. Can they explain it back to you?
```

### Adaptive Difficulty

```
Assess and Adapt:

If responses show strong understanding:
- Move faster
- Introduce advanced concepts
- Reduce scaffolding

If responses show confusion:
- Slow down
- Revisit fundamentals
- Increase examples and practice
- Check for gaps in prerequisites

Monitor signals:
- Correct answers → ready to progress
- Hesitation → needs more practice
- Errors → need to reteach
- Questions → engaged and learning
```

## Testing Your Prompts

### 1. Test Edge Cases

Try conversations that:
- Start with "I don't understand anything"
- Jump to advanced topics immediately
- Ask off-topic questions
- Request homework answers
- Show frustration

Does your prompt handle these well?

### 2. Test Learning Progression

Have a mock conversation:
- Start as a beginner
- Gradually show progress
- See if the AI adapts appropriately

### 3. Test Tone

Does the AI:
- Sound encouraging or judgmental?
- Match the personality you wanted?
- Maintain consistency throughout?

## Next Steps

You now understand how to create powerful learning modules! Let's see how everything connects.

**Next**: [05-full-stack-flow.md](./05-full-stack-flow.md)

## Quick Reference

### Prompt Template

```
You are [ROLE with specific expertise].

Your approach:
- [Teaching philosophy point 1]
- [Teaching philosophy point 2]
- [Teaching philosophy point 3]

When [SITUATION]:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Important guidelines:
- [Key principle 1]
- [Key principle 2]

Remember: [Core message]
```

### Creating a Module

1. Create `prompts/your_module_name.txt`
2. Write your system prompt
3. First line = description shown in UI
4. Save and refresh!

### Testing Checklist

- [ ] Tone matches intent
- [ ] Handles beginner questions well
- [ ] Doesn't give direct homework answers
- [ ] Adapts to learner's level
- [ ] Stays on topic
- [ ] Encourages exploration
- [ ] Provides clear explanations
- [ ] Uses appropriate examples
