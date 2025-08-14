import { useState } from 'react';
import { useMultiStepForm, FORM_STEPS } from '../contexts/MultiStepFormContext';
import { FormNavigation } from './FormNavigation';
import { CEHeaderForm } from './form-sections/CEHeaderForm';
import { HistoryFormNew } from './form-sections/HistoryFormNew';
import { FunctionalStatusFormNew } from './form-sections/FunctionalStatusFormNew';
import { PhysicalExamForm } from './form-sections/PhysicalExamForm';
import { RangeOfMotionForm } from './form-sections/RangeOfMotionForm';
import { GaitStationForm } from './form-sections/GaitStationForm';
import { AssessmentForm } from './form-sections/AssessmentForm';
import { FormReviewAndGenerate } from './FormReviewAndGenerate';
import PDFTemplatePreview from './PDFTemplatePreview';
import { PDFExportButton } from './PDFExportButton';
import { 
  CheckCircle, 
  Lock, 
  AlertCircle, 
  X,
  Save,
  Eye,
  EyeOff,
  FileText as FilePDF,
  User,
  Heart,
  Activity,
  Target,
  Zap,
  FileText
} from 'lucide-react';

// Icon mapping for each section
const SECTION_ICONS = {
  basicInfo: User,
  history: Heart,
  functionalStatus: Activity,
  physicalExam: Target,
  rangeOfMotion: Zap,
  gaitAndStation: Activity,
  assessment: FileText,
  review: FileText
} as const;
import { Initial } from './form-sections/initial';

export interface MultiStepFormControllerProps {
  className?: string;
  showProgressBar?: boolean;
  progressBarOrientation?: 'horizontal' | 'vertical';
  enablePreview?: boolean;
  autoSave?: boolean;
}

export function MultiStepFormController({
  className = '',
}: MultiStepFormControllerProps) {
  const {
    state,
    goToStep,
    getCurrentStep,
    getStepValidation,
    canNavigateToStep,
    isStepComplete,
    isStepVisited,
    saveForm,
  } = useMultiStepForm();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  const currentStep = getCurrentStep();

  const getStepStatus = (stepIndex: number) => {
    const step = FORM_STEPS[stepIndex];
    const isComplete = isStepComplete(stepIndex);
    const isVisited = isStepVisited(stepIndex);
    const isCurrent = state.currentStep === stepIndex;
    const canNavigate = canNavigateToStep(stepIndex);
    const validation = getStepValidation(step.id);
    const sectionData = state.formData[step.id as keyof typeof state.formData];
    const hasFormData = sectionData && Object.keys(sectionData).length > 0;
    
    // Show errors only if section has data or is visited (not just current)
    const shouldShowErrors = hasFormData || (isVisited && hasFormData);
    const hasErrors = validation && validation.errors.length > 0 && shouldShowErrors;

    return {
      isComplete,
      isVisited,
      isCurrent,
      canNavigate,
      hasErrors,
      completionPercentage: validation?.completionPercentage || 0,
    };
  };

  const handleStepClick = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    if (status.canNavigate) {
      goToStep(stepIndex);
      setIsSidebarOpen(false); // Close mobile sidebar
    }
  };

  const handleSave = async () => {
    await saveForm();
  };

  const renderCurrentForm = () => {
    // Handle initial step (-1) first
    if (state.currentStep === -1) {
      return <Initial />;
    }

    // Type-safe rendering based on the current step
    switch (state.currentStep) {
      case 0:
        return <CEHeaderForm />;
      case 1:
        return <HistoryFormNew />;
      case 2:
        return <FunctionalStatusFormNew />;
      case 3:
        return <PhysicalExamForm />;
      case 4:
        return <RangeOfMotionForm />;
      case 5:
        return <GaitStationForm />;
      case 6:
        return <AssessmentForm />;
      case 7:
        return <FormReviewAndGenerate />;
      default:
        return (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {currentStep.title}
            </h3>
            <p className="text-gray-600 mb-8">
              This section is coming soon.
            </p>
          </div>
        );
    }
  };

  const renderSidebarItem = (step: typeof FORM_STEPS[number], index: number) => {
    const status = getStepStatus(index);
    const Icon = SECTION_ICONS[step.id as keyof typeof SECTION_ICONS];

    const getStatusColor = () => {
      if (status.isCurrent) return 'bg-blue-50 border-blue-200 text-blue-700';
      if (status.isComplete) return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100';
      if (status.hasErrors) return 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100';
      if (status.canNavigate) return 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300';
      return 'bg-gray-50 border-gray-100 text-gray-400';
    };

    const getIconColor = () => {
      if (status.isCurrent) return 'text-blue-600';
      if (status.isComplete) return 'text-green-600';
      if (status.hasErrors) return 'text-red-500';
      if (status.canNavigate) return 'text-gray-600';
      return 'text-gray-400';
    };

    return (
      <button
        key={step.id}
        onClick={() => handleStepClick(index)}
        disabled={!status.canNavigate}
        className={`w-full p-4 mb-2 border rounded-lg transition-all duration-200 text-left ${getStatusColor()} ${
          !status.canNavigate ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        }`}
        title={!status.canNavigate ? 'Complete previous required steps to unlock' : ''}
      >
        <div className="flex items-center space-x-3">
          {/* Step number and icon */}
          <div className="flex-shrink-0 relative">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
              status.isCurrent ? 'border-blue-600 bg-blue-600 text-white' :
              status.isComplete ? 'border-green-600 bg-green-600 text-white' :
              status.hasErrors ? 'border-red-500 bg-red-500 text-white' :
              'border-gray-300 bg-white text-gray-600'
            }`}>
              {status.isComplete ? (
                <CheckCircle className="w-5 h-5" />
              ) : status.hasErrors ? (
                <AlertCircle className="w-5 h-5" />
              ) : !status.canNavigate && !status.isVisited ? (
                <Lock className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {Icon && (
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-white flex items-center justify-center ${getIconColor()}`}>
                <Icon className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Step content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm truncate">
                {step.title}
                {step.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <span className="text-xs text-gray-500 ml-2">
                {status.completionPercentage}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  status.isComplete ? 'bg-green-500' : 
                  status.hasErrors ? 'bg-red-400' : 
                  status.isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                style={{ width: `${status.completionPercentage}%` }}
              />
            </div>

            {/* Error count */}
            {status.hasErrors && (
              <p className="text-xs text-red-500 mt-1">
                {getStepValidation(step.id)?.errors.length} error(s)
              </p>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${className}`}>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Sidebar header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Medical Intake</h1>
              <p className="text-blue-100 text-sm mt-1">Patient Assessment Form</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-blue-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overall progress */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600 font-medium">{Math.round(state.overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${state.overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Step {state.currentStep + 1} of {FORM_STEPS.length}</span>
            <span>{state.completedSections.size} completed</span>
          </div>
        </div>

        {/* Navigation items */}
        <div className="p-4 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {FORM_STEPS.map((step, index) => renderSidebarItem(step, index))}
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>
              {state.lastSaved ? `Saved: ${state.lastSaved.toLocaleTimeString()}` : 'Not saved'}
            </span>
            {state.hasUnsavedChanges && (
              <span className="text-amber-600 font-medium">Unsaved changes</span>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleSave}
              disabled={!state.hasUnsavedChanges}
              className="flex items-center justify-center px-3 py-2 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-3 h-3 mr-1" />
              Save
            </button>
            
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center justify-center px-3 py-2 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <Eye className="w-3 h-3 mr-1" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </button>

            <button
              onClick={() => setShowPDFPreview(!showPDFPreview)}
              className={`flex items-center justify-center px-3 py-2 text-xs rounded-md transition-colors ${
                showPDFPreview 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FilePDF className="w-3 h-3 mr-1" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-80 min-h-screen">
        {/* Main content area */}
        <div className="px-2 py-4 pb-45">
          <div className="w-full">
            {showPDFPreview ? (
              /* Side-by-side layout with form and PDF preview */
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Form content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col">
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">Form</h3>
                    <button
                      onClick={() => setShowPDFPreview(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <EyeOff className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-auto max-h-[calc(100vh-300px)]">
                    {state.isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading form data...</p>
                      </div>
                    ) : isPreviewMode ? (
                    <div className="space-y-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Form Preview</h3>
                      </div>
                      {FORM_STEPS.map((step, index) => {
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
                            <div className="text-sm text-gray-600">
                              {Object.keys(sectionData).length} field(s) completed
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      {/* Dynamic error display */}
                      {(() => {
                        const currentValidation = getStepValidation(currentStep.id);
                        const currentSectionData = state.formData[currentStep.id as keyof typeof state.formData];
                        const hasFormData = currentSectionData && Object.keys(currentSectionData).length > 0;
                        const isCurrentStepVisited = state.visitedSteps.has(state.currentStep);
                        
                        // Show errors if:
                        // 1. User has started filling the form (has data), OR
                        // 2. User has visited this step before, OR  
                        // 3. Submit was attempted
                        const shouldShowErrors = hasFormData || isCurrentStepVisited || state.submitAttempted;
                        
                        return currentValidation && 
                               currentValidation.errors.length > 0 && 
                               shouldShowErrors && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="text-sm font-medium text-red-800 mb-2">
                              Please fix the following errors:
                            </h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              {currentValidation.errors.map((error: any, index: number) => (
                                <li key={index}>• {error.message}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      })()}
                      
                      {renderCurrentForm()}
                    </>
                  )}
                  </div>
                </div>

                {/* PDF Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2 flex-shrink-0 px-2 pt-2">
                    <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
                    <div className="flex space-x-2">
                      <PDFExportButton 
                        variant="outline"
                        size="sm"
                        disabled={state.overallProgress < 50}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden flex-1 min-h-0 p-0">
                    <div className="h-full max-h-[calc(100vh-200px)] overflow-auto p-0">
                      <PDFTemplatePreview formData={state.formData} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Single column layout */
              <div className="w-full">
                {/* Form content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                  {state.isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading form data...</p>
                    </div>
                  ) : isPreviewMode ? (
                    <div className="space-y-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Form Preview</h3>
                      </div>
                      {FORM_STEPS.map((step, index) => {
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
                            <div className="text-sm text-gray-600">
                              {Object.keys(sectionData).length} field(s) completed
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      {/* Dynamic error display */}
                      {(() => {
                        const currentValidation = getStepValidation(currentStep.id);
                        const currentSectionData = state.formData[currentStep.id as keyof typeof state.formData];
                        const hasFormData = currentSectionData && Object.keys(currentSectionData).length > 0;
                        const isCurrentStepVisited = state.visitedSteps.has(state.currentStep);
                        
                        // Show errors if:
                        // 1. User has started filling the form (has data), OR
                        // 2. User has visited this step before, OR  
                        // 3. Submit was attempted
                        const shouldShowErrors = hasFormData || isCurrentStepVisited || state.submitAttempted;
                        
                        return currentValidation && 
                               currentValidation.errors.length > 0 && 
                               shouldShowErrors && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="text-sm font-medium text-red-800 mb-2">
                              Please fix the following errors:
                            </h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              {currentValidation.errors.map((error: any, index: number) => (
                                <li key={index}>• {error.message}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      })()}
                      
                      {renderCurrentForm()}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Navigation Footer */}
        {!isPreviewMode && (
          <FormNavigation 
            showStepInfo={true}
            showValidationErrors={true}
            showPDFPreview={showPDFPreview}
            onTogglePDFPreview={() => setShowPDFPreview(!showPDFPreview)}
          />
        )}
      </div>
    </div>
  );
}
