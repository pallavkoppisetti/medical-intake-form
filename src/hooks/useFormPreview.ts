import { useState, useEffect } from 'react';
import type { FloridaCEExamForm } from '../types/comprehensive-medical-form';

export interface UseFormPreviewProps {
  formData: Partial<FloridaCEExamForm>;
  isVisible: boolean;
}

/**
 * Custom hook for managing debounced form data for PDF preview
 * Optimizes performance by only updating when preview is visible
 */
export const useFormPreview = ({ formData, isVisible }: UseFormPreviewProps) => {
  const [debouncedData, setDebouncedData] = useState(formData);
  
  // Debounce form data updates (300ms) only when preview is visible
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setDebouncedData(formData);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [formData, isVisible]);

  // Immediately update when preview becomes visible to sync state
  useEffect(() => {
    if (isVisible) {
      setDebouncedData(formData);
    }
  }, [isVisible, formData]);
  
  return debouncedData;
};

export default useFormPreview;
