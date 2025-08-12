import { PDFGeneratorService } from '../services/PDFGeneratorService';
import type { FloridaCEExamForm } from '../types/comprehensive-medical-form';

/**
 * Generate and download PDF from form data
 */
export const generateAndDownloadPDF = async (
  formData: Partial<FloridaCEExamForm>,
  filename: string = 'ce-exam-report.pdf'
): Promise<void> => {
  try {
    const pdfService = new PDFGeneratorService();
    const pdfBlob = pdfService.generatePDF(formData);
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Generate PDF blob only (for preview or custom handling)
 */
export const generatePDFBlob = (formData: Partial<FloridaCEExamForm>): Blob => {
  const pdfService = new PDFGeneratorService();
  return pdfService.generatePDF(formData);
};

/**
 * Generate PDF data URL for preview
 */
export const generatePDFDataURL = (formData: Partial<FloridaCEExamForm>): string => {
  const blob = generatePDFBlob(formData);
  return URL.createObjectURL(blob);
};

/**
 * Validate form data before PDF generation
 */
export const validateFormDataForPDF = (formData: Partial<FloridaCEExamForm>): {
  isValid: boolean;
  missingFields: string[];
} => {
  const missingFields: string[] = [];
  
  // Check required fields
  if (!formData.header?.claimantName) {
    missingFields.push('Claimant Name');
  }
  
  if (!formData.header?.dateOfBirth) {
    missingFields.push('Date of Birth');
  }
  
  if (!formData.header?.examDate) {
    missingFields.push('Examination Date');
  }
  
  if (!formData.assessment?.examinerInfo?.name) {
    missingFields.push('Examiner Name');
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
