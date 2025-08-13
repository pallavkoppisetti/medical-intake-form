import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useMultiStepForm } from '../contexts/MultiStepFormContext';
import { Button } from './ui/button';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { validateFormDataForPDF } from '../utils/pdfUtils';
import { savePreviewAsPDF } from '../utils/printUtils';
import { Card, CardContent } from './ui/card';
import PDFTemplatePreview from './PDFTemplatePreview';

interface PDFExportButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  showValidation?: boolean;
  disabled?: boolean;
  previewElementId?: string; // ID of the preview element to print
}

export function PDFExportButton({ 
  variant = 'default', 
  size = 'default', 
  showValidation = true,
  disabled = false,
  previewElementId = 'pdf-preview-content'
}: PDFExportButtonProps) {
  const { state } = useMultiStepForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    missingFields: string[];
  } | null>(null);

  const handleExportPDF = async () => {
    try {
      setIsGenerating(true);
      
      // Validate form data if enabled
      if (showValidation) {
        const validation = validateFormDataForPDF(state.formData);
        setValidationResult(validation);
        
        if (!validation.isValid) {
          return;
        }
      }
      
      // Find the preview element, or create a temporary one
      let previewElement = document.getElementById(previewElementId) || 
                          document.querySelector('.pdf-preview-content') ||
                          document.querySelector('[data-pdf-preview]');
      
      let isTemporaryElement = false;
      
      if (!previewElement) {
        // Create a temporary hidden preview element
        console.log('Preview element not found, creating temporary element...');
        isTemporaryElement = true;
        
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '210mm'; // A4 width
        tempContainer.style.background = 'white';
        tempContainer.id = 'temp-pdf-preview';
        
        // Import and render the PDF template
        document.body.appendChild(tempContainer);
        
        // Create a React root and render the preview
        const root = createRoot(tempContainer);
        await new Promise<void>((resolve) => {
          root.render(
            <PDFTemplatePreview
              formData={state.formData}
              showSignaturePlaceholder={false}
            />
          );
          // Give it a moment to render
          setTimeout(resolve, 100);
        });
        
        previewElement = tempContainer;
      }
      
      try {
        // Print the preview as PDF
        await savePreviewAsPDF(previewElement as HTMLElement, state.formData);
      } finally {
        // Clean up temporary element if created
        if (isTemporaryElement && previewElement) {
          previewElement.remove();
        }
      }
      
      // Clear validation result on success
      setValidationResult(null);
      
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleExportPDF}
        disabled={disabled || isGenerating}
        variant={variant}
        size={size}
        className="flex items-center gap-2"
      >
        {isGenerating ? (
          <>
            <FileText className="h-4 w-4 animate-pulse" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Export PDF
          </>
        )}
      </Button>
      
      {/* Validation Results */}
      {showValidation && validationResult && !validationResult.isValid && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-orange-800 mb-2">
                  Missing Required Information
                </h4>
                <p className="text-sm text-orange-700 mb-3">
                  Please complete the following fields before generating the PDF:
                </p>
                <ul className="text-sm text-orange-700 space-y-1">
                  {validationResult.missingFields.map((field, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-orange-600 rounded-full"></span>
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Success message */}
      {showValidation && validationResult?.isValid && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 text-green-600 rounded-full bg-green-200 flex items-center justify-center">
                ✓
              </div>
              <p className="text-sm text-green-700">
                Form is ready for PDF export
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Compact PDF export button for toolbar/header use
 */
export function CompactPDFExportButton() {
  return (
    <PDFExportButton 
      variant="outline" 
      size="sm" 
      showValidation={false}
    />
  );
}
