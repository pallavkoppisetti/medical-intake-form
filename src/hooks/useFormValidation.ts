import { useCallback } from 'react';
import type { FloridaCEExamForm } from '../types/comprehensive-medical-form';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  errors?: ValidationError[];
}

export function useFormValidation() {
  const getRequiredFieldsForSection = useCallback((sectionName: keyof FloridaCEExamForm) => {
    // This is a simplified representation. In a real app, this might be derived from Zod schemas.
    switch (sectionName) {
      case 'header':
        return ['claimantName', 'dateOfBirth', 'examDate'];
      case 'history':
        return ['chiefComplaint', 'pastMedicalHistory'];
      case 'functionalStatus':
        return ['physicalDemandsOfJob', 'activitiesOfDailyLiving'];
      case 'medicalInfo':
        return ['currentMedications', 'allergies'];
      case 'physicalExam':
        return ['generalAppearance', 'vitalSigns'];
      case 'rangeOfMotion':
        return ['cervicalSpine', 'thoracicSpine', 'lumbarSpine'];
      case 'gaitStation':
        return ['gait', 'station'];
      case 'assessment':
        return ['diagnosis', 'prognosis'];
      default:
        return [];
    }
  }, []);

  const validateSection = useCallback((
    sectionName: keyof FloridaCEExamForm,
    sectionData: any
  ): ValidationResult => {
    if (!sectionData) {
      return { success: false, errors: [{ field: 'section', message: 'Section data is missing.' }] };
    }

    // Placeholder for more complex validation logic (e.g., using Zod)
    // For now, we'll do a simple check for a few fields in the 'header'
    if (sectionName === 'header') {
      const errors: ValidationError[] = [];
      if (!sectionData.claimantName) {
        errors.push({ field: 'claimantName', message: 'Claimant Name is required.' });
      }
      if (!sectionData.dateOfBirth) {
        errors.push({ field: 'dateOfBirth', message: 'Date of Birth is required.' });
      }
      if (!sectionData.examDate) {
        errors.push({ field: 'examDate', message: 'Exam Date is required.' });
      }
      if (errors.length > 0) {
        return { success: false, errors };
      }
    }
    
    return { success: true };
  }, []);

  const validateCompleteForm = useCallback((formData: Partial<FloridaCEExamForm>) => {
    const allErrors: ValidationError[] = [];
    const sections = Object.keys(formData) as (keyof FloridaCEExamForm)[];

    sections.forEach(sectionName => {
      const sectionData = formData[sectionName];
      if (sectionData) {
        const result = validateSection(sectionName, sectionData);
        if (!result.success && result.errors) {
          allErrors.push(...result.errors);
        }
      }
    });

    return {
      success: allErrors.length === 0,
      errors: allErrors.length > 0 ? allErrors : undefined
    };
  }, [validateSection]);

  const getSectionErrors = useCallback((
    sectionName: keyof FloridaCEExamForm,
    sectionData: any
  ): ValidationError[] => {
    const result = validateSection(sectionName, sectionData);
    return result.errors || [];
  }, [validateSection]);

  const isSectionComplete = useCallback((
    sectionName: keyof FloridaCEExamForm,
    sectionData: any
  ): boolean => {
    const requiredFields = getRequiredFieldsForSection(sectionName);
    if (requiredFields.length === 0) return true; // No required fields means complete

    return requiredFields.every(field => {
      // Basic check for non-empty value. This could be more sophisticated.
      const value = field.split('.').reduce((o, i) => o?.[i], sectionData);
      return value !== undefined && value !== null && value !== '';
    });
  }, [getRequiredFieldsForSection]);

  const getSectionCompletionPercentage = useCallback((
    sectionName: keyof FloridaCEExamForm,
    sectionData: any
  ): number => {
    const requiredFields = getRequiredFieldsForSection(sectionName);
    if (requiredFields.length === 0) return 100;

    const filledFields = requiredFields.filter(field => {
      const value = field.split('.').reduce((o, i) => o?.[i], sectionData);
      return value !== undefined && value !== null && value !== '';
    }).length;

    return (filledFields / requiredFields.length) * 100;
  }, [getRequiredFieldsForSection]);

  const getFormCompletionPercentage = useCallback((formData: Partial<FloridaCEExamForm>) => {
    const totalPercentage = Object.keys(formData).reduce((acc, sectionId) => {
      const sectionName = sectionId as keyof FloridaCEExamForm;
      const sectionData = formData[sectionName];
      return acc + getSectionCompletionPercentage(sectionName, sectionData);
    }, 0);
    
    const sectionCount = Object.keys(formData).length;
    return sectionCount > 0 ? totalPercentage / sectionCount : 0;
  }, [getSectionCompletionPercentage]);

  return { 
    validateSection, 
    validateCompleteForm, 
    getRequiredFieldsForSection,
    getSectionErrors,
    isSectionComplete,
    getSectionCompletionPercentage,
    getFormCompletionPercentage
  };
}
