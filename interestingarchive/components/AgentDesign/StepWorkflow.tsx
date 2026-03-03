interface FormData {
  workflow: string;
  collaboration: string;
}

interface StepWorkflowProps {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function StepWorkflow({ data, onChange }: StepWorkflowProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Workflow & Collaboration</h2>
        <p className="text-slate-600 mb-4">
          The best agents work together with humans. Let's design your agent's workflow and handoff points.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-green-900">
          <strong>🤝 Human-AI Partnership:</strong> The most effective systems aren't fully autonomous. They combine
          AI's speed and scale with human judgment and accountability.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Describe Your Agent's Ideal Workflow *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Walk through the steps. Examples:
          <br />
          • "Customer emails incoming → Agent routes by category → Human reviews flagged items → Customer gets response"
          <br />
          • "User asks question → Agent researches data → Agent recommends → Human approves or rejects → Action
          taken"
        </p>
        <textarea
          value={data.workflow}
          onChange={(e) => onChange({ workflow: e.target.value })}
          placeholder="Step-by-step workflow..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={5}
        />
        <div className="mt-2 text-xs text-slate-500">
          {data.workflow.length} characters (aim for 50+)
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          How Should Humans and AI Collaborate in This Workflow? *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Consider:
          <br />
          • What does the AI do best? (speed, analysis, handling volume)
          <br />
          • What do humans do best? (judgment, nuance, accountability)
          <br />
          • Where should humans review? (early? only exceptions? major decisions?)
        </p>
        <textarea
          value={data.collaboration}
          onChange={(e) => onChange({ collaboration: e.target.value })}
          placeholder="Describe the human-AI collaboration..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={5}
        />
        <div className="mt-2 text-xs text-slate-500">
          {data.collaboration.length} characters (aim for 50+)
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm text-slate-700">
          <strong>Examples of Collaboration Patterns:</strong>
        </p>
        <ul className="text-sm text-slate-600 mt-2 space-y-1 ml-4">
          <li>• <strong>AI Recommends, Human Decides:</strong> Agent proposes; person reviews and approves</li>
          <li>• <strong>AI Executes, Human Monitors:</strong> Agent runs autonomously; person watches for issues</li>
          <li>• <strong>Collaborative Ideation:</strong> AI generates options; person selects best direction</li>
          <li>• <strong>AI Prepares, Human Judges:</strong> Agent gathers/organizes info; person makes decision</li>
        </ul>
      </div>
    </div>
  );
}
