import React from 'react';
import { Check } from 'lucide-react';

interface WidgetFlowProgressProps {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
  canNavigateToStep?: (step: 1 | 2 | 3) => boolean;
}

export const WidgetFlowProgress: React.FC<WidgetFlowProgressProps> = ({
  currentStep,
  onStepClick,
  canNavigateToStep = () => true
}) => {
  const steps = [
    { number: 1, label: 'Choose template' },
    { number: 2, label: 'Customise & preview' },
    { number: 3, label: 'Install on website' }
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isClickable = onStepClick && canNavigateToStep(step.number as 1 | 2 | 3);

            return (
              <React.Fragment key={step.number}>
                {idx > 0 && (
                  <div
                    className={`h-0.5 w-6 sm:w-12 transition-colors ${
                      currentStep >= step.number ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(step.number as 1 | 2 | 3)}
                  className={`flex items-center gap-2 group transition-all text-left ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-blue-600 text-white'
                        : isCurrent
                        ? 'bg-[#D6F938] text-slate-950 font-black ring-2 ring-slate-900 shadow-sm'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-semibold hidden md:inline transition-colors ${
                      isCurrent
                        ? 'text-slate-900 font-bold'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="text-xs text-slate-600 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
          Step {currentStep} of 3
        </div>
      </div>
    </div>
  );
};
