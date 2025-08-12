import { CompleteMedicalIntakeForm } from '../types/comprehensive-medical-form';

/**
 * Saves form data to localStorage
 */
export const saveFormData = (formData: Partial<CompleteMedicalIntakeForm>, key: string = 'medical-intake-draft'): void => {
  try {
    localStorage.setItem(key, JSON.stringify(formData));
  } catch (error) {
    console.error('Failed to save form data:', error);
  }
};

/**
 * Loads form data from localStorage
 */
export const loadFormData = (key: string = 'medical-intake-draft'): Partial<CompleteMedicalIntakeForm> | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load form data:', error);
    return null;
  }
};

/**
 * Clears saved form data
 */
export const clearFormData = (key: string = 'medical-intake-draft'): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear form data:', error);
  }
};

/**
 * Exports form data as JSON for download
 */
export const exportFormData = (formData: CompleteMedicalIntakeForm, filename: string = 'medical-intake-form.json'): void => {
  const dataStr = JSON.stringify(formData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
