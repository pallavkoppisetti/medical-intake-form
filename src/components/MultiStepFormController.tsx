import { useMultiStepForm, FORM_STEPS } from '../contexts/MultiStepFormContext';
import { ProgressBar, CompactProgressBar, StepCounter } from './ProgressBar';
import { CEHeaderForm } from './form-sections/CEHeaderForm';
import { HistoryFormNew } from './form-sections/HistoryFormNew';
import { FunctionalStatusFormNew } from './form-sections/FunctionalStatusFormNew';
import { MedicalInfoForm } from './form-sections/MedicalInfoForm';
import { PhysicalExamForm } from './form-sections/PhysicalExamForm';
import { RangeOfMotionForm } from './form-sections/RangeOfMotionForm';
import { GaitStationForm } from './form-sections/GaitStationForm';
import { AssessmentForm } from './form-sections/AssessmentForm';
import { FormReviewAndGenerate } from './FormReviewAndGenerate';
import { PDFExportButton } from './PDFExportButton';
import { Save, RotateCcw, Send, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export interface MultiStepFormControllerProps {
  className?: string;
  showProgressBar?: boolean;
  progressBarOrientation?: 'horizontal' | 'vertical';
  enablePreview?: boolean;
  autoSave?: boolean;
}

export function MultiStepFormController({
  className = '',
  showProgressBar = true,
  progressBarOrientation = 'horizontal',
  enablePreview = true,
  autoSave = true,
}: MultiStepFormControllerProps) {
  const {
    state,
    nextStep,
    previousStep,
    goToStep,
    saveForm,
    resetForm,
    submitForm,
    getCurrentStep,
    getStepValidation,
  } = useMultiStepForm();

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  const currentStep = getCurrentStep();
  const currentValidation = getStepValidation(currentStep.id);

  const handleSave = async () => {
    const success = await saveForm();
    if (success) {
      // Could show success notification here
      console.log('Form saved successfully');
    } else {
      // Could show error notification here
      console.error('Failed to save form');
    }
  };

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      // Could show success notification and redirect
      console.log('Form submitted successfully');
    } else {
      // Could show error notification
      console.error('Failed to submit form');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all form data? This action cannot be undone.')) {
      resetForm();
    }
  };

  const renderCurrentForm = () => {
    // Type-safe rendering based on the current step
    switch (state.currentStep) {
      case 0: // Header
        return <CEHeaderForm />;

      case 1: // History
        return <HistoryFormNew />;

      case 2: // Functional Status
        return <FunctionalStatusFormNew />;

      case 3: // Medical Info
        return <MedicalInfoForm />;

      case 4: // Physical Exam
        return <PhysicalExamForm />;

      case 5: // Range of Motion
        return <RangeOfMotionForm />;

      case 6: // Gait & Station
        return <GaitStationForm />;

      case 7: // Assessment
        return <AssessmentForm />;

      case 8: // Review & Generate PDF
        return <FormReviewAndGenerate />;

      default:
        // Placeholder for unimplemented sections
        return (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {currentStep.title}
            </h3>
            <p className="text-gray-600 mb-8">
              This section is coming soon. You can navigate to other sections using the progress bar above.
            </p>
            
            {/* Navigation buttons for placeholder sections */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={previousStep}
                disabled={state.currentStep === 0}
                className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              <button
                onClick={nextStep}
                disabled={state.currentStep === FORM_STEPS.length - 1}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        );
    }
  };

  const renderPreview = () => {
    if (showJsonPreview) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Form Data (JSON)</h3>
            <button
              onClick={() => setShowJsonPreview(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              Show Formatted View
            </button>
          </div>
          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96 border">
            {JSON.stringify(state.formData, null, 2)}
          </pre>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Form Preview</h3>
          <button
            onClick={() => setShowJsonPreview(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Show JSON
          </button>
        </div>

        {/* Section summaries */}
        {FORM_STEPS.map((step, index) => {
          // Skip review step in section summaries
          if (step.id === 'review') return null;
          
          const sectionData = state.formData[step.id as keyof typeof state.formData];
          const validation = getStepValidation(step.id);
          const hasData = sectionData && Object.keys(sectionData).length > 0;

          if (!hasData) return null;

          return (
            <div key={step.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 text-xs font-bold rounded-full flex items-center justify-center mr-2">
                    {index + 1}
                  </span>
                  {step.title}
                </h4>
                <div className="flex items-center space-x-2">
                  {validation?.isComplete && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Complete
                    </span>
                  )}
                  {validation && validation.errors.length > 0 && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      {validation.errors.length} error(s)
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setIsPreviewMode(false);
                      goToStep(index);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
              </div>
              
              {/* Basic data preview - customized for Florida CE Exam Form */}
              <div className="text-sm text-gray-600">
                {step.id === 'header' && sectionData && (
                  <div className="grid grid-cols-2 gap-2">
                    {(sectionData as any).claimantName && (
                      <div><strong>Claimant:</strong> {(sectionData as any).claimantName}</div>
                    )}
                    {(sectionData as any).caseNumber && (
                      <div><strong>Case #:</strong> {(sectionData as any).caseNumber}</div>
                    )}
                    {(sectionData as any).dateOfBirth && (
                      <div><strong>DOB:</strong> {(sectionData as any).dateOfBirth}</div>
                    )}
                    {(sectionData as any).examDate && (
                      <div><strong>Exam Date:</strong> {(sectionData as any).examDate}</div>
                    )}
                  </div>
                )}
                
                {step.id === 'history' && sectionData && (
                  <div className="space-y-1">
                    {(sectionData as any).age && (
                      <div><strong>Age:</strong> {(sectionData as any).age}</div>
                    )}
                    {(sectionData as any).gender && (
                      <div><strong>Gender:</strong> {(sectionData as any).gender}</div>
                    )}
                    {(sectionData as any).historyOfPresentIllness && (
                      <div><strong>History:</strong> {(sectionData as any).historyOfPresentIllness.substring(0, 100)}...</div>
                    )}
                  </div>
                )}

                {step.id === 'functionalStatus' && sectionData && (
                  <div className="space-y-1">
                    {(sectionData as any).dominantHand && (
                      <div><strong>Dominant Hand:</strong> {(sectionData as any).dominantHand}</div>
                    )}
                    {(sectionData as any).sittingWorstDay && (
                      <div><strong>Sitting (worst):</strong> {(sectionData as any).sittingWorstDay}</div>
                    )}
                  </div>
                )}

                {step.id === 'medicalInfo' && sectionData && (
                  <div className="space-y-1">
                    {(sectionData as any).currentMedications?.length > 0 && (
                      <div><strong>Medications:</strong> {(sectionData as any).currentMedications.length} listed</div>
                    )}
                    {(sectionData as any).allergies?.length > 0 && (
                      <div><strong>Allergies:</strong> {(sectionData as any).allergies.length} listed</div>
                    )}
                  </div>
                )}

                {step.id === 'assessment' && sectionData && (
                  <div className="space-y-1">
                    {(sectionData as any).diagnosis?.primary && (
                      <div><strong>Primary Diagnosis:</strong> {(sectionData as any).diagnosis.primary}</div>
                    )}
                  </div>
                )}
                
                {/* For other sections, show a generic summary */}
                {!['header', 'history', 'functionalStatus', 'medicalInfo', 'assessment'].includes(step.id) && (
                  <div>
                    {Object.keys(sectionData).length} field(s) completed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Medical Intake Form
              </h1>
              <p className="text-gray-600 mt-1">
                Complete comprehensive medical assessment
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <StepCounter />
              {state.lastSaved && (
                <span className="text-xs text-gray-500">
                  Saved: {state.lastSaved.toLocaleTimeString()}
                </span>
              )}
              {state.hasUnsavedChanges && (
                <span className="text-xs text-amber-600">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgressBar && (
          <div className="p-6 border-b border-gray-200">
            <ProgressBar 
              orientation={progressBarOrientation}
              showStepNumbers={true}
              showPercentages={true}
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={state.isLoading || !state.hasUnsavedChanges}
              className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center px-3 py-2 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {enablePreview && (
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                {isPreviewMode ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Edit Mode
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </>
                )}
              </button>
            )}
            
            <PDFExportButton 
              variant="outline"
              size="default"
              disabled={state.overallProgress < 50}
            />
            
            <button
              onClick={handleSubmit}
              disabled={state.isSubmitting || state.overallProgress < 100}
              className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-1" />
              {state.isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {state.isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading form data...</p>
            </div>
          ) : isPreviewMode ? (
            renderPreview()
          ) : (
            <>
              {/* Current step validation errors */}
              {currentValidation && currentValidation.errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-2">
                    Please fix the following errors:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {currentValidation.errors.map((error, index) => (
                      <li key={index}>• {error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {renderCurrentForm()}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <CompactProgressBar />
            <div className="text-xs text-gray-500">
              {autoSave ? 'Auto-save enabled' : 'Remember to save your progress'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
