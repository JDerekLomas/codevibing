const DESMETS_NEEDS = [
  { id: 'autonomy', label: 'Autonomy', description: 'Freedom and choice' },
  { id: 'competence', label: 'Competence', description: 'Mastery and effectiveness' },
  { id: 'relatedness', label: 'Relatedness', description: 'Connection and belonging' },
  { id: 'pleasure', label: 'Pleasure', description: 'Positive experiences' },
  { id: 'comfort', label: 'Comfort', description: 'Ease and well-being' },
  { id: 'stimulation', label: 'Stimulation', description: 'Challenge and novelty' },
  { id: 'self-expression', label: 'Self-Expression', description: 'Authentic identity' },
  { id: 'self-development', label: 'Self-Development', description: 'Growth and learning' },
  { id: 'purpose', label: 'Purpose', description: 'Meaningful contribution' },
  { id: 'benevolence', label: 'Benevolence', description: 'Helping others' },
  { id: 'justice', label: 'Justice', description: 'Fairness and equity' },
  { id: 'self-care', label: 'Self-Care', description: 'Healthy boundaries' },
  { id: 'spiritual', label: 'Spiritual Connection', description: 'Something larger than self' },
];

interface FormData {
  selectedNeeds: string[];
  whyNeeds: string;
}

interface StepNeedsProps {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function StepNeeds({ data, onChange }: StepNeedsProps) {
  const toggleNeed = (needId: string) => {
    const updated = data.selectedNeeds.includes(needId)
      ? data.selectedNeeds.filter((id) => id !== needId)
      : [...data.selectedNeeds, needId];
    onChange({ selectedNeeds: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Which Wellbeing Needs Matter Most?</h2>
        <p className="text-slate-600 mb-4">
          Select the human wellbeing dimensions most relevant to your context. These are based on Pieter Desmet's
          framework of 13 fundamental human needs.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-900">
          <strong>Why this matters:</strong> The needs you select will guide safety considerations, design decisions,
          and success metrics. Choose 3-6 that genuinely matter in your context.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DESMETS_NEEDS.map((need) => (
          <button
            key={need.id}
            onClick={() => toggleNeed(need.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              data.selectedNeeds.includes(need.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="font-semibold text-slate-900">{need.label}</div>
            <div className="text-sm text-slate-600">{need.description}</div>
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Why Do These Needs Matter in Your Context? *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Explain how the selected needs connect to your agent's impact on people. This helps us provide
          better guidance.
        </p>
        <textarea
          value={data.whyNeeds}
          onChange={(e) => onChange({ whyNeeds: e.target.value })}
          placeholder="Explain why these specific needs matter..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
        <div className="mt-2 text-xs text-slate-500">
          {data.whyNeeds.length} characters (aim for 30+)
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-600">
          <strong>Selected:</strong> {data.selectedNeeds.length} needs
          {data.selectedNeeds.length > 0 && (
            <span className="ml-2">
              ({data.selectedNeeds.map((id) => DESMETS_NEEDS.find((n) => n.id === id)?.label).join(', ')})
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
