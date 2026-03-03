interface FormData {
  context: string;
  affectedUsers: string;
}

interface StepContextProps {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function StepContext({ data, onChange }: StepContextProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">What Context Are You Designing For?</h2>
        <p className="text-slate-600 mb-6">
          Describe the specific situation where this agent will operate. Be concrete—the more specific you are,
          the better guidance we can provide.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Agent Context *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Examples: "Customer support chatbot for healthcare provider", "Content moderation for community forum",
          "Sales assistant for e-commerce"
        </p>
        <textarea
          value={data.context}
          onChange={(e) => onChange({ context: e.target.value })}
          placeholder="Describe your agent and its purpose..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
        <div className="mt-2 text-xs text-slate-500">
          {data.context.length} characters (aim for 20-150)
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Who Are the Humans Affected by This Agent? *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Who is impacted? Consider end-users, employees, customers, community members, etc.
        </p>
        <textarea
          value={data.affectedUsers}
          onChange={(e) => onChange({ affectedUsers: e.target.value })}
          placeholder="Describe who this agent affects and how..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
        <div className="mt-2 text-xs text-slate-500">
          {data.affectedUsers.length} characters (aim for 20-150)
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> The clearer you are about context and who's affected, the better we can
          help ensure this agent supports wellbeing and avoids harm.
        </p>
      </div>
    </div>
  );
}
