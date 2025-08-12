import { z } from 'zod';
import { isValid, isBefore, subYears } from 'date-fns';

/**
 * Zod schemas for form validation
 */

// Address schema
const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'State must be 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
});

// Personal information schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().refine((date) => {
    if (!date) return false;
    const parsedDate = new Date(date);
    const maxAge = subYears(new Date(), 120);
    return isValid(parsedDate) && isBefore(parsedDate, new Date()) && isBefore(maxAge, parsedDate);
  }, 'Please enter a valid date of birth'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  phone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
  address: addressSchema,
});

// Insurance information schema
export const insuranceInfoSchema = z.object({
  provider: z.string().min(1, 'Insurance provider is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  groupNumber: z.string().optional(),
  subscriberName: z.string().min(1, 'Subscriber name is required'),
  subscriberId: z.string().min(1, 'Subscriber ID is required'),
});

// Medication schema
const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  prescribedBy: z.string().optional(),
});

// Surgical procedure schema
const surgicalProcedureSchema = z.object({
  procedure: z.string().min(1, 'Procedure name is required'),
  date: z.string().min(1, 'Date is required'),
  hospital: z.string().optional(),
  complications: z.string().optional(),
});

// Medical history schema
export const medicalHistorySchema = z.object({
  allergies: z.array(z.string()).default([]),
  currentMedications: z.array(medicationSchema).default([]),
  pastMedicalHistory: z.array(z.string()).default([]),
  familyHistory: z.array(z.string()).default([]),
  surgicalHistory: z.array(surgicalProcedureSchema).default([]),
});

// Visit information schema
export const visitInfoSchema = z.object({
  chiefComplaint: z.string().min(1, 'Chief complaint is required'),
  symptomsStartDate: z.string().min(1, 'Symptoms start date is required'),
  painLevel: z.number().min(1, 'Pain level must be at least 1').max(10, 'Pain level must be at most 10'),
  additionalSymptoms: z.array(z.string()).default([]),
  previousTreatment: z.string().optional(),
});

// Emergency contact schema
export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Invalid phone number format'),
});

// Complete medical intake form schema
export const medicalIntakeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  insuranceInfo: insuranceInfoSchema,
  medicalHistory: medicalHistorySchema,
  visitInfo: visitInfoSchema,
  emergencyContact: emergencyContactSchema,
  consentToTreatment: z.boolean().refine(val => val === true, 'Consent to treatment is required'),
  signature: z.string().min(1, 'Signature is required'),
  date: z.string().min(1, 'Date is required'),
});

/**
 * Legacy validation functions (kept for backward compatibility)
 */

/**
 * Validates an email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number (basic US format)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a date is not in the future and person is realistic age
 */
export const validateDateOfBirth = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
  
  return date <= now && date >= minDate;
};

/**
 * Formats a date to YYYY-MM-DD format
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Formats a phone number to (XXX) XXX-XXXX format
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Calculates age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Validates form data against schema and returns errors
 */
export const validateFormSection = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; errors?: Record<string, string> } => {
  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};
