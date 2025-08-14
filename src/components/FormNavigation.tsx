import { useMultiStepForm, FORM_STEPS } from '../contexts/MultiStepFormContext';
import { ChevronLeft, ChevronRight, AlertTriangle, Save, RotateCcw, FileText as FilePDF } from 'lucide-react';
import { useState } from 'react';
import { PDFExportButton } from './PDFExportButton';

export interface FormNavigationProps {
  className?: string;
  showStepInfo?: boolean;
  showValidationErrors?: boolean;
  showPDFPreview?: boolean;
  onTogglePDFPreview?: () => void;
}

export function FormNavigation({ 
  className = '',
  showStepInfo = true,
  showValidationErrors = true,
  showPDFPreview = false,
  onTogglePDFPreview
}: FormNavigationProps) {
  const {
    state,
    nextStep,
    previousStep,
    getCurrentStep,
    getStepValidation,
    saveForm,
    submitForm,
    resetSection,
  } = useMultiStepForm();

  const [isSaving, setIsSaving] = useState(false);
  
  const currentStep = getCurrentStep();
  const currentValidation = getStepValidation(currentStep.id);
  const canGoNext = state.currentStep < FORM_STEPS.length - 1;
  const canGoPrevious = state.currentStep > 0;
  const hasErrors = currentValidation && currentValidation.errors.length > 0;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveForm();
    } finally {
      setIsSaving(false);
    }
  };

  const isLastStep = state.currentStep === FORM_STEPS.length - 1;
  const isReviewStep = currentStep.id === 'review';

  const handleNext = async () => {
    if (isLastStep && isReviewStep) {
      // On review step, submit the form
      const success = await submitForm();
      if (success) {
        // Could show success notification
        console.log('Form submitted successfully');
      } else {
        // Could show error notification
        console.error('Failed to submit form');
      }
    } else {
      // Normal next step navigation with auto-validate and save
      nextStep();
    }
  };

  // Page-specific reset function
  const handlePageReset = () => {
    const currentStepName = currentStep.title;
    if (confirm(`Are you sure you want to reset all data for the "${currentStepName}" section? This action cannot be undone.`)) {
      resetSection(currentStep.id);
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 lg:left-80 ${className}`}>
      {/* Validation Errors */}
      {showValidationErrors && hasErrors && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">
                Please complete the following required fields:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {currentValidation.errors.slice(0, 3).map((error, index) => (
                  <li key={index}>• {error.message}</li>
                ))}
                {currentValidation.errors.length > 3 && (
                  <li className="text-red-600">• ... and {currentValidation.errors.length - 3} more</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          {/* Previous Button */}
          <button
            onClick={previousStep}
            disabled={!canGoPrevious}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {/* Center buttons - PDF controls and page reset */}
          <div className="flex items-center space-x-3">
            {/* PDF Preview Toggle */}
            <button
              onClick={onTogglePDFPreview}
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                showPDFPreview 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FilePDF className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{showPDFPreview ? 'Hide PDF' : 'Show PDF'}</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* PDF Export Button */}
            <PDFExportButton 
              variant="outline"
              size="sm"
              showValidation={false}
              disabled={state.overallProgress < 50}
            />

            {/* Page-specific Reset Button */}
            <button
              onClick={handlePageReset}
              className="flex items-center px-3 py-2 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Reset Page</span>
              <span className="sm:hidden">Reset</span>
            </button>
          </div>

          {/* Next/Submit Button */}
          <button
            onClick={handleNext}
            disabled={!canGoNext && !isLastStep}
            className={`flex items-center px-6 py-2 rounded-md transition-colors font-medium ${
              (canGoNext || isLastStep)
                ? isLastStep && isReviewStep
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLastStep && isReviewStep ? 'Submit Form' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Step Information and Auto-save Status */}
        {showStepInfo && (
          <div className="flex items-center justify-center space-x-4 text-sm pt-2 border-t border-gray-200">
            <div className="text-center">
              <div className="font-medium text-gray-900">
                Step {state.currentStep + 1} of {FORM_STEPS.length}
              </div>
              <div className="text-gray-500">
                Overall Progress: {Math.round(state.overallProgress)}%
              </div>
            </div>
            
            {state.hasUnsavedChanges && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                <Save className="w-3 h-3 mr-1" />
                {isSaving ? 'Saving...' : 'Save Now'}
              </button>
            )}
            
            {state.lastSaved && !state.hasUnsavedChanges && (
              <span className="text-xs text-green-600">
                ✓ Saved {state.lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </div>
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
