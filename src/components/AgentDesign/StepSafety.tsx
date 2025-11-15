interface FormData {
  risks: string;
  humanDecisions: string;
  dataAccess: string;
}

interface StepSafetyProps {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function StepSafety({ data, onChange }: StepSafetyProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Safety & Ethics: What Could Go Wrong?</h2>
        <p className="text-slate-600 mb-4">
          Thinking about safety upfront prevents problems later. We'll help you design guardrails.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-900">
          <strong>🛡️ Safety First:</strong> The best agents have humans explicitly in control of high-stakes
          decisions. Let's make sure yours does too.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          What Are the Risks if This Agent Fails or Goes Wrong? *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Be candid. What's the worst that could happen? Examples: Hallucinating false information, making
          inappropriate decisions, accessing unauthorized data, harming vulnerable users.
        </p>
        <textarea
          value={data.risks}
          onChange={(e) => onChange({ risks: e.target.value })}
          placeholder="Describe potential risks and failures..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
        <div className="mt-2 text-xs text-slate-500">
          {data.risks.length} characters (aim for 40+)
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Which Decisions Should Humans Always Make? *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          What's too important or risky to leave fully to the agent? Examples: Hiring/firing decisions,
          customer refunds over threshold, health recommendations, policy enforcement.
        </p>
        <textarea
          value={data.humanDecisions}
          onChange={(e) => onChange({ humanDecisions: e.target.value })}
          placeholder="Describe decisions that require human judgment..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
        <div className="mt-2 text-xs text-slate-500">
          {data.humanDecisions.length} characters (aim for 40+)
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          What Data Will This Agent Access or Use? *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          What information does it need? Consider privacy, sensitivity, and security. Examples: Customer names
          only, transaction history, health records, behavioral data.
        </p>
        <textarea
          value={data.dataAccess}
          onChange={(e) => onChange({ dataAccess: e.target.value })}
          placeholder="Describe data access and privacy considerations..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
        <div className="mt-2 text-xs text-slate-500">
          {data.dataAccess.length} characters (aim for 30+)
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Next steps:</strong> We'll use this information to recommend specific safety measures, such as
          guardrails, escalation triggers, monitoring, and human review points.
        </p>
      </div>
    </div>
  );
}
