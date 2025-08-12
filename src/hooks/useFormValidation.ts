import { useCallback } from 'react';
import {
  personalInfoSchema,
  medicalHistorySchema,
  visitInfoSchema,
  validateFormSection
} from '../lib/validation';
import type { CompleteMedicalIntakeForm } from '../types/comprehensive-medical-form';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  errors?: ValidationError[];
}

export function useFormValidation() {
  // Validate individual sections
  const validateSection = useCallback((
    sectionName: keyof CompleteMedicalIntakeForm,
    sectionData: any
  ) => {
    switch (sectionName) {
      case 'basicInfo':
        return validateFormSection(personalInfoSchema, sectionData);
      case 'history':
        return validateFormSection(medicalHistorySchema, sectionData);
      case 'clinicalAssessment':
        // Use visitInfoSchema for current visit information within clinical assessment
        if (sectionData.chiefComplaint) {
          return validateFormSection(visitInfoSchema, {
            chiefComplaint: sectionData.chiefComplaint,
            symptomsStartDate: sectionData.symptomsStartDate || '',
            painLevel: sectionData.painLevel || 0,
          });
        }
        return { success: true };
      default:
        // For sections without specific schemas, perform basic validation
        return { success: true };
    }
  }, []);

  // Validate the complete form
  const validateCompleteForm = useCallback((formData: Partial<CompleteMedicalIntakeForm>) => {
    const errors: ValidationError[] = [];
    const sections = Object.keys(formData) as (keyof CompleteMedicalIntakeForm)[];

    sections.forEach(sectionName => {
      const sectionData = formData[sectionName];
      if (sectionData) {
        const result = validateSection(sectionName, sectionData);
        if (!result.success && result.errors) {
          // Convert Record<string, string> to ValidationError[]
          Object.entries(result.errors).forEach(([field, message]) => {
            errors.push({ field, message });
          });
        }
      }
    });

    return {
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }, [validateSection]);

  // Get required fields for a specific section
  const getRequiredFieldsForSection = useCallback((sectionName: keyof CompleteMedicalIntakeForm) => {
    switch (sectionName) {
      case 'basicInfo':
        return [
          'firstName',
          'lastName',
          'dateOfBirth',
          'gender',
          'address.street',
          'address.city',
          'address.state',
          'address.zipCode',
          'phone',
          'email'
        ];
      case 'history':
        return [
          'currentMedications',
          'allergies'
        ];
      case 'functionalStatus':
        return [
          'activitiesOfDailyLiving.bathing',
          'mobility.walkingDistance'
        ];
      case 'vitalSigns':
        return [
          'bloodPressure.systolic',
          'bloodPressure.diastolic',
          'heartRate.rate'
        ];
      case 'physicalExam':
        return [
          'generalAppearance.consciousness'
        ];
      case 'neuroMuscularAssessment':
        return [
          'motorFunction.strength.upperExtremities.leftShoulder'
        ];
      case 'rangeOfMotion':
        return [
          'cervicalSpine.flexion.active'
        ];
      case 'gaitAndStation':
        return [
          'gaitPattern.cadence'
        ];
      case 'clinicalAssessment':
        return [
          'chiefComplaint',
          'primaryDiagnosis.description'
        ];
      default:
        return [];
    }
  }, []);

  // Check if a section is complete based on required fields
  const isSectionComplete = useCallback((
    sectionName: keyof CompleteMedicalIntakeForm,
    sectionData: any
  ) => {
    const requiredFields = getRequiredFieldsForSection(sectionName);
    return requiredFields.every((fieldPath: string) => {
      const value = getNestedValue(sectionData, fieldPath);
      return value !== undefined && value !== null && value !== '';
    });
  }, [getRequiredFieldsForSection]);

  // Get completion percentage for a section
  const getSectionCompletionPercentage = useCallback((
    sectionName: keyof CompleteMedicalIntakeForm,
    sectionData: any
  ) => {
    const requiredFields = getRequiredFieldsForSection(sectionName);
    if (requiredFields.length === 0) return 100;

    const completedFields = requiredFields.filter((fieldPath: string) => {
      const value = getNestedValue(sectionData, fieldPath);
      return value !== undefined && value !== null && value !== '';
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }, [getRequiredFieldsForSection]);

  // Get overall form completion percentage
  const getFormCompletionPercentage = useCallback((formData: Partial<CompleteMedicalIntakeForm>) => {
    const allSections: (keyof CompleteMedicalIntakeForm)[] = [
      'basicInfo',
      'history',
      'functionalStatus',
      'vitalSigns',
      'physicalExam',
      'neuroMuscularAssessment',
      'rangeOfMotion',
      'gaitAndStation',
      'clinicalAssessment'
    ];

    const totalPercentage = allSections.reduce((sum, sectionName) => {
      const sectionData = formData[sectionName];
      return sum + getSectionCompletionPercentage(sectionName, sectionData);
    }, 0);

    return Math.round(totalPercentage / allSections.length);
  }, [getSectionCompletionPercentage]);

  // Validate a specific field
  const validateField = useCallback((
    sectionName: keyof CompleteMedicalIntakeForm,
    sectionData: any
  ) => {
    return validateSection(sectionName, sectionData);
  }, [validateSection]);

  // Get validation errors for a specific section
  const getSectionErrors = useCallback((
    sectionName: keyof CompleteMedicalIntakeForm,
    sectionData: any
  ) => {
    const result = validateSection(sectionName, sectionData);
    if (!result.success && result.errors) {
      return Object.entries(result.errors).map(([field, message]) => ({ field, message }));
    }
    return [];
  }, [validateSection]);

  return {
    validateSection,
    validateCompleteForm,
    validateField,
    isSectionComplete,
    getSectionCompletionPercentage,
    getFormCompletionPercentage,
    getSectionErrors,
    getRequiredFieldsForSection
  };
}

// Helper function to get nested object values
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}
