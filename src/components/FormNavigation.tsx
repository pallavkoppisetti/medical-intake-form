import { useMultiStepForm, FORM_STEPS } from '../contexts/MultiStepFormContext';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export interface FormNavigationProps {
  className?: string;
  showStepInfo?: boolean;
}

export function FormNavigation({ 
  className = '',
  showStepInfo = true 
}: FormNavigationProps) {
  const {
    state,
    nextStep,
    previousStep,
    getCurrentStep,
    isStepComplete,
  } = useMultiStepForm();

  const currentStep = getCurrentStep();
  const isCurrentStepComplete = isStepComplete(state.currentStep);
  const canGoNext = state.currentStep < FORM_STEPS.length - 1;
  const canGoPrevious = state.currentStep > 0;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Previous Button */}
      <button
        onClick={previousStep}
        disabled={!canGoPrevious}
        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </button>

      {/* Step Information */}
      {showStepInfo && (
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-900">{currentStep.title}</div>
            <div className="text-gray-500">
              Step {state.currentStep + 1} of {FORM_STEPS.length}
            </div>
          </div>
          
          {isCurrentStepComplete && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">Complete</span>
            </div>
          )}
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={nextStep}
        disabled={!canGoNext}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
}

// Simplified navigation for inside form sections
export function SimpleNavigation({ 
  onNext, 
  onPrevious,
  nextDisabled = false,
  previousDisabled = false,
  nextLabel = "Next",
  previousLabel = "Previous",
  className = ""
}: {
  onNext?: () => void;
  onPrevious?: () => void;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-between pt-6 border-t border-gray-200 ${className}`}>
      <button
        type="button"
        onClick={onPrevious}
        disabled={previousDisabled}
        className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        {previousLabel}
      </button>
      
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {nextLabel}
        <ChevronRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
}
