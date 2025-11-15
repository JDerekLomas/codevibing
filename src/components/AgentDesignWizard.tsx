'use client';

import { useState } from 'react';
import clsx from 'clsx';
import StepContext from './AgentDesign/StepContext';
import StepNeeds from './AgentDesign/StepNeeds';
import StepSafety from './AgentDesign/StepSafety';
import StepWorkflow from './AgentDesign/StepWorkflow';
import StepReview from './AgentDesign/StepReview';

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

const STEPS = [
  { id: 1, title: 'Context', description: 'What are you building?' },
  { id: 2, title: 'Wellbeing Needs', description: 'Which needs matter?' },
  { id: 3, title: 'Safety & Ethics', description: 'What could go wrong?' },
  { id: 4, title: 'Workflow', description: 'How should it work?' },
  { id: 5, title: 'Review', description: 'Finalize your design' },
];

export default function AgentDesignWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    context: '',
    affectedUsers: '',
    selectedNeeds: [],
    whyNeeds: '',
    risks: '',
    humanDecisions: '',
    dataAccess: '',
    workflow: '',
    collaboration: '',
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormChange = (updates: Partial<FormData>) => {
    setFormData({ ...formData, ...updates });
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.context.length > 10 && formData.affectedUsers.length > 10;
      case 2:
        return formData.selectedNeeds.length > 0 && formData.whyNeeds.length > 20;
      case 3:
        return formData.risks.length > 20 && formData.humanDecisions.length > 20 && formData.dataAccess.length > 10;
      case 4:
        return formData.workflow.length > 20 && formData.collaboration.length > 20;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Progress Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center flex-1">
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                currentStep >= step.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              )}
            >
              {step.id}
            </div>
            <div className="ml-2">
              <div className="font-semibold text-slate-900">{step.title}</div>
              <div className="text-xs text-slate-500">{step.description}</div>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={clsx(
                  'flex-1 h-1 ml-2 rounded-full transition-all',
                  currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-8">
        {currentStep === 1 && (
          <StepContext data={formData} onChange={handleFormChange} />
        )}
        {currentStep === 2 && (
          <StepNeeds data={formData} onChange={handleFormChange} />
        )}
        {currentStep === 3 && (
          <StepSafety data={formData} onChange={handleFormChange} />
        )}
        {currentStep === 4 && (
          <StepWorkflow data={formData} onChange={handleFormChange} />
        )}
        {currentStep === 5 && (
          <StepReview data={formData} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-6 bg-slate-50 border-t border-slate-200">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={clsx(
            'px-6 py-2 rounded-lg font-medium transition-all',
            currentStep === 1
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-slate-700 hover:bg-slate-100'
          )}
        >
          ← Back
        </button>

        <div className="text-sm text-slate-600">
          Step {currentStep} of {STEPS.length}
        </div>

        <button
          onClick={handleNext}
          disabled={!isStepComplete() || currentStep === STEPS.length}
          className={clsx(
            'px-6 py-2 rounded-lg font-medium transition-all',
            isStepComplete() && currentStep < STEPS.length
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          {currentStep === STEPS.length ? '✓ Complete' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
