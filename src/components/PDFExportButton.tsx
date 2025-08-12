import { useState } from 'react';
import { useMultiStepForm } from '../contexts/MultiStepFormContext';
import { Button } from './ui/button';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { generateAndDownloadPDF, validateFormDataForPDF } from '../utils/pdfUtils';
import { Card, CardContent } from './ui/card';

interface PDFExportButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  showValidation?: boolean;
  filename?: string;
  disabled?: boolean;
}

export function PDFExportButton({ 
  variant = 'default', 
  size = 'default', 
  showValidation = true,
  filename = 'ce-exam-report.pdf',
  disabled = false
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
      
      // Generate and download PDF
      await generateAndDownloadPDF(state.formData, filename);
      
      // Clear validation result on success
      setValidationResult(null);
      
    } catch (error) {
      console.error('PDF export error:', error);
      // You could add a toast notification here
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
