'use client';

import { useState } from 'react';
import { useRef } from 'react';

interface FormData {
  context: string;
  affectedUsers: string;
  selectedNeeds: string[];
  whyNeeds: string;
  risks: string;
  humanDecisions: string;
  dataAccess: string;
  workflow: string;
  collaboration: string;
}

interface StepReviewProps {
  data: FormData;
}

export default function StepReview({ data }: StepReviewProps) {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGenerateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agent-design/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setRecommendations(result.recommendations);
      } else {
        setRecommendations('Error generating recommendations. Please try again.');
      }
    } catch (error) {
      setRecommendations('Error generating recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = contentRef.current;
    if (element) {
      const html2canvas = require('html2canvas');
      const jsPDF = require('jspdf');

      html2canvas(element).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 277);
        pdf.save('agent-design-brief.pdf');
      });
    }
  };

  const DESMETS_NEEDS: Record<string, string> = {
    autonomy: 'Autonomy',
    competence: 'Competence',
    relatedness: 'Relatedness',
    pleasure: 'Pleasure',
    comfort: 'Comfort',
    stimulation: 'Stimulation',
    'self-expression': 'Self-Expression',
    'self-development': 'Self-Development',
    purpose: 'Purpose',
    benevolence: 'Benevolence',
    justice: 'Justice',
    'self-care': 'Self-Care',
    spiritual: 'Spiritual Connection',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Your Design</h2>
        <p className="text-slate-600 mb-4">
          Here's a summary of your agent design. Review it, then get AI-generated recommendations based on your
          responses.
        </p>
      </div>

      <div ref={contentRef} className="bg-slate-50 rounded-lg p-6 space-y-6">
        {/* Context */}
        <div className="border-b border-slate-200 pb-4">
          <h3 className="font-semibold text-slate-900 mb-2">Context</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Agent Purpose</p>
              <p className="text-slate-900">{data.context}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Affected Users</p>
              <p className="text-slate-900">{data.affectedUsers}</p>
            </div>
          </div>
        </div>

        {/* Wellbeing Needs */}
        <div className="border-b border-slate-200 pb-4">
          <h3 className="font-semibold text-slate-900 mb-2">Wellbeing Needs Focus</h3>
          <div className="mb-3">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Selected Needs</p>
            <div className="flex flex-wrap gap-2">
              {data.selectedNeeds.map((needId) => (
                <span
                  key={needId}
                  className="inline-block bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {DESMETS_NEEDS[needId]}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Why These Needs Matter</p>
            <p className="text-slate-900">{data.whyNeeds}</p>
          </div>
        </div>

        {/* Safety */}
        <div className="border-b border-slate-200 pb-4">
          <h3 className="font-semibold text-slate-900 mb-2">Safety & Ethics</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Potential Risks</p>
              <p className="text-slate-900">{data.risks}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Human Decision Points</p>
              <p className="text-slate-900">{data.humanDecisions}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Data Access</p>
              <p className="text-slate-900">{data.dataAccess}</p>
            </div>
          </div>
        </div>

        {/* Workflow */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Workflow & Collaboration</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Workflow</p>
              <p className="text-slate-900">{data.workflow}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Human-AI Collaboration</p>
              <p className="text-slate-900">{data.collaboration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {!recommendations && (
        <button
          onClick={handleGenerateRecommendations}
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-400"
        >
          {loading ? 'Generating recommendations...' : 'Generate AI Recommendations'}
        </button>
      )}

      {recommendations && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-4">Recommendations & Guidance</h3>
          <div className="prose prose-sm max-w-none text-slate-900">
            {recommendations.split('\n').map((line, idx) => (
              <p key={idx} className="mb-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {recommendations && (
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700"
          >
            Download as PDF
          </button>
          <button
            onClick={() => setRecommendations(null)}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
          >
            Generate New Recommendations
          </button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>📝 Next Steps:</strong>
          <br />
          1. Share this design brief with your team
          <br />
          2. Use the recommendations to guide implementation
          <br />
          3. Test your agent with real users
          <br />
          4. Monitor for wellbeing impact and adjust as needed
        </p>
      </div>
    </div>
  );
}
