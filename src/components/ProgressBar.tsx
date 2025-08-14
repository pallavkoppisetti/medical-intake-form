import { useMultiStepForm, FORM_STEPS } from '../contexts/MultiStepFormContext';
import { CheckCircle, Circle, Lock, AlertCircle } from 'lucide-react';

export interface ProgressBarProps {
  showStepNumbers?: boolean;
  showPercentages?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ProgressBar({ 
  showStepNumbers = true, 
  showPercentages = true,
  orientation = 'horizontal',
  className = ''
}: ProgressBarProps) {
  const {
    state,
    goToStep,
    canNavigateToStep,
    isStepComplete,
    isStepVisited,
    getStepValidation,
  } = useMultiStepForm();

  const getStepStatus = (stepIndex: number) => {
    // Don't show progress when on initial step
    if (state.currentStep === -1) {
      return {
        isComplete: false,
        isVisited: false,
        isCurrent: false,
        canNavigate: false,
        hasErrors: false,
        completionPercentage: 0
      };
    }

    const step = FORM_STEPS[stepIndex];
    const isComplete = isStepComplete(stepIndex);
    const isVisited = isStepVisited(stepIndex);
    const isCurrent = state.currentStep === stepIndex;
    const canNavigate = canNavigateToStep(stepIndex);
    const validation = getStepValidation(step.id);
    
    // Only show errors if the step has been visited and is not current (user has left it)
    // OR if a submit has been attempted
    const shouldShowErrors = (isVisited && !isCurrent) || state.submitAttempted;
    const hasErrors = shouldShowErrors && validation && validation.errors.length > 0;

    return {
      isComplete,
      isVisited,
      isCurrent,
      canNavigate,
      hasErrors,
      completionPercentage: validation?.completionPercentage || 0,
    };
  };

  const getStepIcon = (status: ReturnType<typeof getStepStatus>) => {
    if (status.isComplete) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (status.hasErrors) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (!status.canNavigate && !status.isVisited) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getStepClasses = (status: ReturnType<typeof getStepStatus>) => {
    const baseClasses = 'transition-all duration-200 rounded-lg border-2 p-3 cursor-pointer';
    
    if (status.isCurrent) {
      return `${baseClasses} border-blue-500 bg-blue-50 text-blue-700`;
    }
    if (status.isComplete) {
      return `${baseClasses} border-green-500 bg-green-50 text-green-700 hover:bg-green-100`;
    }
    if (status.hasErrors) {
      return `${baseClasses} border-red-300 bg-red-50 text-red-700 hover:bg-red-100`;
    }
    if (status.canNavigate) {
      return `${baseClasses} border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50`;
    }
    return `${baseClasses} border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed`;
  };

  const handleStepClick = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    if (status.canNavigate) {
      goToStep(stepIndex);
    }
  };

  if (orientation === 'vertical') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">{state.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.overallProgress}%` }}
            />
          </div>
        </div>

        {FORM_STEPS.map((step, index) => {
          const status = getStepStatus(index);
          const stepClasses = getStepClasses(status);

          return (
            <div
              key={step.id}
              className={stepClasses}
              onClick={() => handleStepClick(index)}
              title={!status.canNavigate ? 'Complete previous steps to unlock' : ''}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getStepIcon(status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium truncate">
                        {showStepNumbers && `${index + 1}. `}{step.title}
                        {step.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                      {status.hasErrors && (
                        <p className="text-xs text-red-500 mt-1">
                          {getStepValidation(step.id)?.errors.length} error(s)
                        </p>
                      )}
                    </div>
                    
                    {showPercentages && (
                      <span className="text-xs text-gray-500 ml-2">
                        {status.completionPercentage}%
                      </span>
                    )}
                  </div>
                  
                  {/* Individual step progress bar */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        status.isComplete ? 'bg-green-500' : 
                        status.hasErrors ? 'bg-red-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${status.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall progress bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">{state.overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${state.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Step navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {FORM_STEPS.map((step, index) => {
          const status = getStepStatus(index);
          const stepClasses = getStepClasses(status);

          return (
            <div
              key={step.id}
              className={stepClasses}
              onClick={() => handleStepClick(index)}
              title={!status.canNavigate ? 'Complete previous steps to unlock' : ''}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-1">
                  {getStepIcon(status)}
                  {showStepNumbers && (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                
                <div className="text-center">
                  <h4 className="text-xs font-medium truncate max-w-full">
                    {step.title}
                    {step.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  
                  {showPercentages && (
                    <span className="text-xs text-gray-500">
                      {status.completionPercentage}%
                    </span>
                  )}
                  
                  {status.hasErrors && (
                    <p className="text-xs text-red-500 mt-1">
                      {getStepValidation(step.id)?.errors.length} error(s)
                    </p>
                  )}
                </div>

                {/* Individual step progress indicator */}
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      status.isComplete ? 'bg-green-500' : 
                      status.hasErrors ? 'bg-red-400' : 'bg-blue-400'
                    }`}
                    style={{ width: `${status.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 pt-2 border-t">
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Complete</span>
        </div>
        <div className="flex items-center space-x-1">
          <Circle className="w-4 h-4 text-blue-500" />
          <span>Current/Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>Has Errors</span>
        </div>
        <div className="flex items-center space-x-1">
          <Lock className="w-4 h-4 text-gray-400" />
          <span>Locked</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-red-500">*</span>
          <span>Required</span>
        </div>
      </div>
    </div>
  );
}

// Compact progress bar for smaller spaces
export function CompactProgressBar({ className = '' }: { className?: string }) {
  const { state } = useMultiStepForm();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Progress:
      </span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${state.overallProgress}%` }}
        />
      </div>
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {state.overallProgress}%
      </span>
    </div>
  );
}

// Step counter component
export function StepCounter({ className = '' }: { className?: string }) {
  const { state } = useMultiStepForm();

  return (
    <div className={`text-center text-sm text-gray-600 ${className}`}>
      Step {state.currentStep + 1} of {FORM_STEPS.length}
    </div>
  );
}
