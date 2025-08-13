import { useState } from 'react';
import { useMultiStepForm, FORM_STEPS } from '../contexts/MultiStepFormContext';
import { SaveProgressIndicator } from './SaveProgressIndicator';
import { 
  CheckCircle, 
  Lock, 
  AlertCircle, 
  Menu,
  X,
  Save,
  Send,
  RotateCcw,
  Eye,
  User,
  Heart,
  Activity,
  Stethoscope,
  Brain,
  Target,
  Zap,
  FileText
} from 'lucide-react';

// Icon mapping for each section
const SECTION_ICONS = {
  basicInfo: User,
  history: Heart,
  functionalStatus: Activity,
  vitalSigns: Stethoscope,
  physicalExam: Target,
  neuroMuscularAssessment: Brain,
  rangeOfMotion: Zap,
  gaitAndStation: Activity,
  clinicalAssessment: FileText,
} as const;

export interface FormLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function FormLayout({ children, className = '' }: FormLayoutProps) {
  const {
    state,
    goToStep,
    canNavigateToStep,
    isStepComplete,
    isStepVisited,
    getStepValidation,
    saveForm,
    submitForm,
    resetForm,
  } = useMultiStepForm();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const currentStep = FORM_STEPS[state.currentStep];

  const getStepStatus = (stepIndex: number) => {
    // Handle initial step
    if (state.currentStep === -1) {
      return {
        isComplete: false,
        isVisited: false,
        isCurrent: false,
        canNavigate: false,
        hasErrors: false,
        completionPercentage: 0,
      };
    }

    const step = FORM_STEPS[stepIndex];
    const isComplete = isStepComplete(stepIndex);
    const isVisited = isStepVisited(stepIndex);
    const isCurrent = state.currentStep === stepIndex;
    const canNavigate = canNavigateToStep(stepIndex);
    const validation = getStepValidation(step.id);
    const hasErrors = validation && validation.errors.length > 0;

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

  const handleSubmit = async () => {
    await submitForm();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all form data? This action cannot be undone.')) {
      resetForm();
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
                <span className="text-sm font-medium">{index}</span>
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
            <span className="text-sm text-gray-600 font-medium">{state.overallProgress}%</span>
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
          
          <div className="grid grid-cols-2 gap-2">
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
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-80 min-h-screen">
        {/* Top navigation bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentStep.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Complete the {currentStep.title.toLowerCase()} section
                    {currentStep.required && <span className="text-red-500 ml-1">*Required</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleReset}
                  className="hidden sm:flex items-center px-3 py-2 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </button>
                
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
          </div>

          {/* Progress indicator */}
          <div className="px-4 lg:px-8 pb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${state.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="px-4 lg:px-8 py-8 pb-48">
          <div className="max-w-4xl mx-auto">
            {/* Current step validation errors */}
            {(() => {
              const currentValidation = getStepValidation(currentStep.id);
              if (currentValidation && currentValidation.errors.length > 0) {
                return (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800 mb-2">
                          Please fix the following errors:
                        </h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {currentValidation.errors.map((error, index) => (
                            <li key={index}>• {error.message}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Form content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Progress Indicator */}
      <SaveProgressIndicator />
    </div>
  );
}
