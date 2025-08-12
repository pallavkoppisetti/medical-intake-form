import { useState, useEffect, useCallback } from 'react';
import { CompleteMedicalIntakeForm } from '@/types/comprehensive-medical-form';
import { saveFormData as saveToStorage, loadFormData as loadFromStorage, clearFormData } from '@/lib/form-storage';

export interface UseFormManagerOptions {
  autoSave?: boolean;
  storageKey?: string;
  onSectionComplete?: (sectionName: string) => void;
  onFormComplete?: (formData: CompleteMedicalIntakeForm) => void;
}

export interface FormManagerState {
  currentStep: number;
  formData: Partial<CompleteMedicalIntakeForm>;
  isLoading: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

/**
 * Custom hook for managing multi-step medical form state
 */
export function useFormManager(options: UseFormManagerOptions = {}) {
  const {
    autoSave = true,
    storageKey = 'medical-intake-form',
    onSectionComplete,
    onFormComplete,
  } = options;

  const [state, setState] = useState<FormManagerState>({
    currentStep: 0,
    formData: {},
    isLoading: true,
    lastSaved: null,
    hasUnsavedChanges: false,
  });

  // Load saved form data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = loadFromStorage(storageKey);
        if (savedData) {
          setState(prev => ({
            ...prev,
            formData: savedData,
            isLoading: false,
            lastSaved: new Date(),
          }));
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to load form data:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadSavedData();
  }, [storageKey]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && state.hasUnsavedChanges && !state.isLoading) {
      saveToStorage(state.formData, storageKey);
      setState(prev => ({
        ...prev,
        hasUnsavedChanges: false,
        lastSaved: new Date(),
      }));
    }
  }, [autoSave, state.hasUnsavedChanges, state.isLoading, state.formData, storageKey]);  // Update form section data
  const updateSection = useCallback((sectionName: keyof CompleteMedicalIntakeForm, sectionData: any) => {
    setState(prev => {
      const updatedFormData = {
        ...prev.formData,
        [sectionName]: sectionData,
      };

      // Update section completion tracking
      const sectionCompletion = {
        basicInfo: false,
        history: false,
        functionalStatus: false,
        vitalSigns: false,
        physicalExam: false,
        neuroMuscularAssessment: false,
        rangeOfMotion: false,
        gaitAndStation: false,
        clinicalAssessment: false,
        ...prev.formData.sectionCompletion,
        [sectionName]: true,
      };

      const finalData = {
        ...updatedFormData,
        sectionCompletion,
        lastModified: new Date().toISOString(),
      };

      onSectionComplete?.(sectionName as string);

      return {
        ...prev,
        formData: finalData,
        hasUnsavedChanges: true,
      };
    });
  }, [onSectionComplete]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 8), // Max 9 steps (0-8)
    }));
  }, []);

  // Navigate to previous step
  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  // Jump to specific step
  const goToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, 8)),
    }));
  }, []);

  // Manual save
  const saveForm = useCallback(async () => {
    try {
      saveToStorage(state.formData, storageKey);
      setState(prev => ({
        ...prev,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      }));
      return true;
    } catch (error) {
      console.error('Failed to save form data:', error);
      return false;
    }
  }, [state.formData, storageKey]);

  // Clear form data
  const clearForm = useCallback(() => {
    try {
      clearFormData(storageKey);
      setState(prev => ({
        ...prev,
        formData: {},
        currentStep: 0,
        lastSaved: null,
        hasUnsavedChanges: false,
      }));
      return true;
    } catch (error) {
      console.error('Failed to clear form data:', error);
      return false;
    }
  }, [storageKey]);

  // Submit complete form
  const submitForm = useCallback(async () => {
    try {
      const completeForm = {
        ...state.formData,
        status: 'completed' as const,
        completionDate: new Date().toISOString(),
      };

      onFormComplete?.(completeForm as CompleteMedicalIntakeForm);
      
      // Clear form after successful submission
      clearForm();
      
      return true;
    } catch (error) {
      console.error('Failed to submit form:', error);
      return false;
    }
  }, [state.formData, onFormComplete, clearForm]);

  // Calculate form completion percentage
  const getCompletionPercentage = useCallback(() => {
    const sections = [
      'basicInfo',
      'history',
      'functionalStatus',
      'vitalSigns',
      'physicalExam',
      'neuroMuscularAssessment',
      'rangeOfMotion',
      'gaitAndStation',
      'clinicalAssessment',
    ];

    const completedSections = sections.filter(
      section => state.formData.sectionCompletion?.[section as keyof typeof state.formData.sectionCompletion]
    ).length;

    return Math.round((completedSections / sections.length) * 100);
  }, [state.formData.sectionCompletion]);

  // Check if current step is complete
  const isCurrentStepComplete = useCallback(() => {
    const stepSectionMap = [
      'basicInfo',
      'history',
      'functionalStatus',
      'vitalSigns',
      'physicalExam',
      'neuroMuscularAssessment',
      'rangeOfMotion',
      'gaitAndStation',
      'clinicalAssessment',
    ];

    const currentSection = stepSectionMap[state.currentStep];
    return state.formData.sectionCompletion?.[currentSection as keyof typeof state.formData.sectionCompletion] || false;
  }, [state.currentStep, state.formData.sectionCompletion]);

  // Navigation helpers
  const setCurrentStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const canNavigateToStep = useCallback((stepIndex: number) => {
    // Allow navigation to current step and previous steps
    // Also allow navigation to next step if current step is complete
    return stepIndex <= state.currentStep || (stepIndex === state.currentStep + 1 && isCurrentStepComplete());
  }, [state.currentStep, isCurrentStepComplete]);

  // Form data management
  const resetForm = useCallback(() => {
    clearForm();
    setState(prev => ({ ...prev, currentStep: 0 }));
  }, [clearForm]);

  const saveFormData = useCallback(() => {
    saveForm();
  }, [saveForm]);

  const loadFormData = useCallback(() => {
    const loadSavedData = () => {
      try {
        const savedData = loadFromStorage(storageKey);
        if (savedData) {
          setState(prev => ({
            ...prev,
            formData: savedData,
            lastSaved: new Date(),
          }));
        }
      } catch (error) {
        console.error('Failed to load form data:', error);
      }
    };
    loadSavedData();
  }, [storageKey]);

  return {
    // State
    currentStep: state.currentStep,
    formData: state.formData,
    isLoading: state.isLoading,
    lastSaved: state.lastSaved,
    hasUnsavedChanges: state.hasUnsavedChanges,
    
    // Actions
    updateSection,
    nextStep,
    previousStep,
    goToStep,
    setCurrentStep,
    saveForm,
    clearForm,
    submitForm,
    resetForm,
    saveFormData,
    loadFormData,
    
    // Navigation
    canNavigateToStep,
    
    // Computed properties
    completionPercentage: getCompletionPercentage(),
    isCurrentStepComplete: isCurrentStepComplete(),
    
    // Utility functions
    getSectionData: (sectionName: keyof CompleteMedicalIntakeForm) => state.formData[sectionName],
    isFormComplete: () => getCompletionPercentage() === 100,
  };
}
