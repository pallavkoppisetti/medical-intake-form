import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { CompleteMedicalIntakeForm } from '../types/comprehensive-medical-form';
import { useFormValidation } from '../hooks/useFormValidation';
import { saveFormData as saveToStorage, loadFormData as loadFromStorage } from '../lib/form-storage';

// Define form steps configuration
export const FORM_STEPS = [
  { id: 'basicInfo', title: 'Basic Information', required: true },
  { id: 'history', title: 'Medical History', required: true },
  { id: 'functionalStatus', title: 'Functional Status', required: false },
  { id: 'vitalSigns', title: 'Vital Signs', required: true },
  { id: 'physicalExam', title: 'Physical Exam', required: false },
  { id: 'neuroMuscularAssessment', title: 'Neuromuscular', required: false },
  { id: 'rangeOfMotion', title: 'Range of Motion', required: false },
  { id: 'gaitAndStation', title: 'Gait & Station', required: false },
  { id: 'clinicalAssessment', title: 'Clinical Assessment', required: true },
] as const;

export type FormStep = typeof FORM_STEPS[number];
export type FormStepId = FormStep['id'];

// State interfaces
export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    errors: Array<{ field: string; message: string }>;
    isComplete: boolean;
    completionPercentage: number;
  };
}

export interface FormState {
  // Navigation state
  currentStep: number;
  visitedSteps: Set<number>;
  
  // Data state
  formData: Partial<CompleteMedicalIntakeForm>;
  
  // Validation state
  validationState: ValidationState;
  
  // Progress state
  overallProgress: number;
  completedSections: Set<FormStepId>;
  
  // Persistence state
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  
  // UI state
  isSubmitting: boolean;
  submitAttempted: boolean;
}

// Action types
export type FormAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'UPDATE_SECTION'; payload: { sectionId: FormStepId; data: any } }
  | { type: 'SET_FORM_DATA'; payload: Partial<CompleteMedicalIntakeForm> }
  | { type: 'UPDATE_VALIDATION'; payload: { sectionId: FormStepId; validation: ValidationState[string] } }
  | { type: 'MARK_SECTION_COMPLETE'; payload: FormStepId }
  | { type: 'MARK_SECTION_INCOMPLETE'; payload: FormStepId }
  | { type: 'SET_OVERALL_PROGRESS'; payload: number }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'SAVE_FAILED' }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMIT_ATTEMPTED'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_FORM_DATA'; payload: Partial<CompleteMedicalIntakeForm> };

// Initial state
const initialState: FormState = {
  currentStep: 0,
  visitedSteps: new Set([0]),
  formData: {},
  validationState: {},
  overallProgress: 0,
  completedSections: new Set(),
  lastSaved: null,
  hasUnsavedChanges: false,
  isLoading: true,
  isSubmitting: false,
  submitAttempted: false,
};

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
        visitedSteps: new Set([...state.visitedSteps, action.payload]),
      };

    case 'NEXT_STEP':
      if (state.currentStep < FORM_STEPS.length - 1) {
        const nextStep = state.currentStep + 1;
        return {
          ...state,
          currentStep: nextStep,
          visitedSteps: new Set([...state.visitedSteps, nextStep]),
        };
      }
      return state;

    case 'PREVIOUS_STEP':
      if (state.currentStep > 0) {
        return { ...state, currentStep: state.currentStep - 1 };
      }
      return state;

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
        visitedSteps: new Set([...state.visitedSteps, action.payload]),
      };

    case 'UPDATE_SECTION':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.sectionId]: action.payload.data,
        },
        hasUnsavedChanges: true,
      };

    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: action.payload,
        hasUnsavedChanges: false,
      };

    case 'UPDATE_VALIDATION':
      return {
        ...state,
        validationState: {
          ...state.validationState,
          [action.payload.sectionId]: action.payload.validation,
        },
      };

    case 'MARK_SECTION_COMPLETE':
      return {
        ...state,
        completedSections: new Set([...state.completedSections, action.payload]),
      };

    case 'MARK_SECTION_INCOMPLETE':
      const newCompletedSections = new Set(state.completedSections);
      newCompletedSections.delete(action.payload);
      return {
        ...state,
        completedSections: newCompletedSections,
      };

    case 'SET_OVERALL_PROGRESS':
      return { ...state, overallProgress: action.payload };

    case 'SAVE_SUCCESS':
      return {
        ...state,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      };

    case 'SAVE_FAILED':
      return state; // Could add error state here

    case 'SET_UNSAVED_CHANGES':
      return { ...state, hasUnsavedChanges: action.payload };

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };

    case 'SET_SUBMIT_ATTEMPTED':
      return { ...state, submitAttempted: action.payload };

    case 'RESET_FORM':
      return {
        ...initialState,
        isLoading: false,
      };

    case 'LOAD_FORM_DATA':
      return {
        ...state,
        formData: action.payload,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
        isLoading: false,
      };

    default:
      return state;
  }
}

// Context interface
export interface MultiStepFormContextValue {
  // State
  state: FormState;
  
  // Navigation actions
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
  
  // Data actions
  updateSection: (sectionId: FormStepId, data: any) => void;
  
  // Validation actions
  validateSection: (sectionId: FormStepId) => void;
  validateAllSections: () => void;
  
  // Progress actions
  updateProgress: () => void;
  
  // Persistence actions
  saveForm: () => Promise<boolean>;
  loadForm: () => void;
  resetForm: () => void;
  
  // Submit actions
  submitForm: () => Promise<boolean>;
  
  // Utility functions
  getCurrentStep: () => FormStep;
  getCurrentStepData: () => any;
  isStepComplete: (step: number) => boolean;
  isStepVisited: (step: number) => boolean;
  getStepValidation: (sectionId: FormStepId) => ValidationState[string] | undefined;
}

// Create context
const MultiStepFormContext = createContext<MultiStepFormContextValue | undefined>(undefined);

// Provider component
export interface MultiStepFormProviderProps {
  children: React.ReactNode;
  autoSave?: boolean;
  autoSaveInterval?: number;
  storageKey?: string;
  onSubmit?: (formData: CompleteMedicalIntakeForm) => Promise<boolean>;
  onStepChange?: (step: number) => void;
  onSectionComplete?: (sectionId: FormStepId) => void;
}

export function MultiStepFormProvider({
  children,
  autoSave = true,
  autoSaveInterval = 30000, // 30 seconds
  storageKey = 'medical-intake-form',
  onSubmit,
  onStepChange,
  onSectionComplete,
}: MultiStepFormProviderProps) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const {
    validateSection: validateSectionData,
    isSectionComplete,
    getSectionCompletionPercentage,
    getFormCompletionPercentage,
    getSectionErrors,
  } = useFormValidation();

  // Load form data on mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = loadFromStorage(storageKey);
        if (savedData) {
          dispatch({ type: 'LOAD_FORM_DATA', payload: savedData });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Failed to load form data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadSavedData();
  }, [storageKey]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !state.hasUnsavedChanges || state.isLoading) return;

    const autoSaveTimer = setTimeout(() => {
      saveForm();
    }, autoSaveInterval);

    return () => clearTimeout(autoSaveTimer);
  }, [autoSave, autoSaveInterval, state.hasUnsavedChanges, state.isLoading]);

  // Update overall progress when sections change
  useEffect(() => {
    const progress = getFormCompletionPercentage(state.formData);
    dispatch({ type: 'SET_OVERALL_PROGRESS', payload: progress });
  }, [state.formData, getFormCompletionPercentage]);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (state.currentStep < FORM_STEPS.length - 1) {
      dispatch({ type: 'NEXT_STEP' });
      onStepChange?.(state.currentStep + 1);
    }
  }, [state.currentStep, onStepChange]);

  const previousStep = useCallback(() => {
    if (state.currentStep > 0) {
      dispatch({ type: 'PREVIOUS_STEP' });
      onStepChange?.(state.currentStep - 1);
    }
  }, [state.currentStep, onStepChange]);

  const goToStep = useCallback((step: number) => {
    if (canNavigateToStep(step)) {
      dispatch({ type: 'GO_TO_STEP', payload: step });
      onStepChange?.(step);
    }
  }, [onStepChange]);

  const canNavigateToStep = useCallback((step: number) => {
    // Can always go to visited steps
    if (state.visitedSteps.has(step)) return true;
    
    // Can go to next step if current step is complete (for required steps)
    if (step === state.currentStep + 1) {
      const currentStepConfig = FORM_STEPS[state.currentStep];
      if (currentStepConfig.required) {
        return state.completedSections.has(currentStepConfig.id);
      }
      return true; // Non-required steps can be skipped
    }
    
    return false;
  }, [state.visitedSteps, state.currentStep, state.completedSections]);

  // Data functions
  const updateSection = useCallback((sectionId: FormStepId, data: any) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { sectionId, data } });
    
    // Validate the section after update
    setTimeout(() => validateSection(sectionId), 0);
  }, []);

  // Validation functions
  const validateSection = useCallback((sectionId: FormStepId) => {
    const sectionData = state.formData[sectionId];
    const validationResult = validateSectionData(sectionId, sectionData);
    const isComplete = isSectionComplete(sectionId, sectionData);
    const completionPercentage = getSectionCompletionPercentage(sectionId, sectionData);
    const errors = getSectionErrors(sectionId, sectionData);

    const validation = {
      isValid: validationResult.success,
      errors,
      isComplete,
      completionPercentage,
    };

    dispatch({ type: 'UPDATE_VALIDATION', payload: { sectionId, validation } });

    // Update completion status
    if (isComplete) {
      dispatch({ type: 'MARK_SECTION_COMPLETE', payload: sectionId });
      onSectionComplete?.(sectionId);
    } else {
      dispatch({ type: 'MARK_SECTION_INCOMPLETE', payload: sectionId });
    }
  }, [state.formData, validateSectionData, isSectionComplete, getSectionCompletionPercentage, getSectionErrors, onSectionComplete]);

  const validateAllSections = useCallback(() => {
    FORM_STEPS.forEach(step => {
      validateSection(step.id);
    });
  }, [validateSection]);

  const updateProgress = useCallback(() => {
    validateAllSections();
  }, [validateAllSections]);

  // Persistence functions
  const saveForm = useCallback(async (): Promise<boolean> => {
    try {
      saveToStorage(state.formData, storageKey);
      dispatch({ type: 'SAVE_SUCCESS' });
      return true;
    } catch (error) {
      console.error('Failed to save form:', error);
      dispatch({ type: 'SAVE_FAILED' });
      return false;
    }
  }, [state.formData, storageKey]);

  const loadForm = useCallback(() => {
    try {
      const savedData = loadFromStorage(storageKey);
      if (savedData) {
        dispatch({ type: 'LOAD_FORM_DATA', payload: savedData });
        setTimeout(validateAllSections, 0);
      }
    } catch (error) {
      console.error('Failed to load form data:', error);
    }
  }, [storageKey, validateAllSections]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
    try {
      saveToStorage({}, storageKey);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  }, [storageKey]);

  // Submit function
  const submitForm = useCallback(async (): Promise<boolean> => {
    dispatch({ type: 'SET_SUBMIT_ATTEMPTED', payload: true });
    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      // Validate all sections first
      validateAllSections();
      
      // Check if all required sections are complete
      const requiredSteps = FORM_STEPS.filter(step => step.required);
      const incompleteRequired = requiredSteps.find(step => !state.completedSections.has(step.id));
      
      if (incompleteRequired) {
        dispatch({ type: 'SET_SUBMITTING', payload: false });
        return false;
      }

      // Submit the form
      if (onSubmit) {
        const success = await onSubmit(state.formData as CompleteMedicalIntakeForm);
        dispatch({ type: 'SET_SUBMITTING', payload: false });
        return success;
      }

      dispatch({ type: 'SET_SUBMITTING', payload: false });
      return true;
    } catch (error) {
      console.error('Form submission failed:', error);
      dispatch({ type: 'SET_SUBMITTING', payload: false });
      return false;
    }
  }, [state.formData, state.completedSections, validateAllSections, onSubmit]);

  // Utility functions
  const getCurrentStep = useCallback(() => FORM_STEPS[state.currentStep], [state.currentStep]);
  
  const getCurrentStepData = useCallback(() => {
    const currentStepId = FORM_STEPS[state.currentStep].id;
    return state.formData[currentStepId];
  }, [state.currentStep, state.formData]);

  const isStepComplete = useCallback((step: number) => {
    const stepConfig = FORM_STEPS[step];
    return state.completedSections.has(stepConfig.id);
  }, [state.completedSections]);

  const isStepVisited = useCallback((step: number) => {
    return state.visitedSteps.has(step);
  }, [state.visitedSteps]);

  const getStepValidation = useCallback((sectionId: FormStepId) => {
    return state.validationState[sectionId];
  }, [state.validationState]);

  const contextValue: MultiStepFormContextValue = {
    state,
    nextStep,
    previousStep,
    goToStep,
    canNavigateToStep,
    updateSection,
    validateSection,
    validateAllSections,
    updateProgress,
    saveForm,
    loadForm,
    resetForm,
    submitForm,
    getCurrentStep,
    getCurrentStepData,
    isStepComplete,
    isStepVisited,
    getStepValidation,
  };

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      {children}
    </MultiStepFormContext.Provider>
  );
}

// Hook to use the context
export function useMultiStepForm() {
  const context = useContext(MultiStepFormContext);
  if (context === undefined) {
    throw new Error('useMultiStepForm must be used within a MultiStepFormProvider');
  }
  return context;
}
