import AgentDesignWizard from '@/components/AgentDesignWizard';

export default function AgentDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Design Agents for Human Flourishing
          </h1>
          <p className="text-lg text-slate-600">
            Create AI agents grounded in wellbeing frameworks. This tool guides you through designing agents
            that support human flourishing using Pieter Desmet's 13 fundamental needs, proven safety patterns,
            and human-AI collaboration principles.
          </p>
        </div>

        <AgentDesignWizard />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Evidence-Based</h3>
            <p className="text-slate-600 text-sm">
              Grounded in Desmet's framework, TU Delft design ethics, and agent design best practices.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Safety-First</h3>
            <p className="text-slate-600 text-sm">
              Identifies risks early, guides human-AI collaboration, and avoids common pitfalls.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Actionable</h3>
            <p className="text-slate-600 text-sm">
              Get a concrete design brief you can share with your team or use to build your agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
