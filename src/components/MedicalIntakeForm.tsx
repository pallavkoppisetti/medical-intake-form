import { useState } from 'react';
import { useFormManager } from '../hooks/useFormManager';
import { useFormValidation } from '../hooks/useFormValidation';
import { BasicInfoForm } from './form-sections/BasicInfoForm';
import { HistoryForm } from './form-sections/HistoryForm';
import type { CompleteMedicalIntakeForm } from '../types/comprehensive-medical-form';

// Step configuration
const FORM_STEPS = [
  { id: 'basicInfo', title: 'Basic Information', component: BasicInfoForm },
  { id: 'history', title: 'Medical History', component: HistoryForm },
  { id: 'functionalStatus', title: 'Functional Status', component: null },
  { id: 'vitalSigns', title: 'Vital Signs', component: null },
  { id: 'physicalExam', title: 'Physical Exam', component: null },
  { id: 'neuroMuscularAssessment', title: 'Neuromuscular', component: null },
  { id: 'rangeOfMotion', title: 'Range of Motion', component: null },
  { id: 'gaitAndStation', title: 'Gait & Station', component: null },
  { id: 'clinicalAssessment', title: 'Clinical Assessment', component: null },
] as const;

export function MedicalIntakeForm() {
  const {
    formData,
    currentStep,
    setCurrentStep,
    updateSection,
    canNavigateToStep,
    nextStep,
    previousStep,
    resetForm,
    saveFormData,
    loadFormData
  } = useFormManager();

  const {
    getSectionCompletionPercentage,
    getFormCompletionPercentage,
    isSectionComplete
  } = useFormValidation();

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const currentStepConfig = FORM_STEPS[currentStep];
  const FormComponent = currentStepConfig.component;

  const handleSectionChange = (sectionName: keyof CompleteMedicalIntakeForm, data: any) => {
    updateSection(sectionName, data);
    saveFormData(); // Auto-save on changes
  };

  const handleNext = () => {
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleStepClick = (stepIndex: number) => {
    if (canNavigateToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const renderProgressBar = () => {
    const overallProgress = getFormCompletionPercentage(formData);
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">{overallProgress}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStepNavigation = () => {
    return (
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-11 gap-2">
            {FORM_STEPS.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = isSectionComplete(
                step.id as keyof CompleteMedicalIntakeForm, 
                formData[step.id as keyof CompleteMedicalIntakeForm]
              );
              const isAccessible = canNavigateToStep(index);
              const progress = getSectionCompletionPercentage(
                step.id as keyof CompleteMedicalIntakeForm,
                formData[step.id as keyof CompleteMedicalIntakeForm]
              );

              return (
                <li key={step.id} className="relative">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isAccessible}
                    className={`
                      w-full p-2 text-xs rounded-lg border transition-all
                      ${isActive 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : isCompleted
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : isAccessible
                        ? 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="font-medium truncate">{step.title}</div>
                    <div className="text-xs mt-1">{progress}%</div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    );
  };

  const renderCurrentForm = () => {
    if (!FormComponent) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {currentStepConfig.title}
          </h3>
          <p className="text-gray-600">This section is coming soon...</p>
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === FORM_STEPS.length - 1}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    const sectionId = currentStepConfig.id as keyof CompleteMedicalIntakeForm;
    const sectionData = formData[sectionId];

    // Type-safe rendering based on the current step
    if (currentStep === 0 && FormComponent === BasicInfoForm) {
      return (
        <FormComponent
          data={sectionData as Partial<CompleteMedicalIntakeForm['basicInfo']>}
          onUpdate={(data: any) => handleSectionChange('basicInfo', data)}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      );
    }

    if (currentStep === 1 && FormComponent === HistoryForm) {
      return (
        <FormComponent
          data={sectionData as CompleteMedicalIntakeForm['history']}
          onChange={(data: any) => handleSectionChange('history', data)}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      );
    }

    // Fallback for other components
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {currentStepConfig.title}
        </h3>
        <p className="text-gray-600">This section is coming soon...</p>
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === FORM_STEPS.length - 1}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Medical Intake Form
          </h1>
          <p className="text-gray-600">
            Please complete all sections of this comprehensive medical intake form.
          </p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Navigation */}
        {renderStepNavigation()}

        {/* Form Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => loadFormData()}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Load Saved Data
            </button>
            <button
              onClick={() => saveFormData()}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Progress
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all form data?')) {
                  resetForm();
                }
              }}
              className="px-4 py-2 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50"
            >
              Reset Form
            </button>
          </div>
        </div>

        {/* Current Form Section */}
        <div className="border border-gray-200 rounded-lg p-6">
          {isPreviewMode ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Form Preview</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          ) : (
            renderCurrentForm()
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Step {currentStep + 1} of {FORM_STEPS.length} - {currentStepConfig.title}
        </div>
      </div>
    </div>
  );
}
