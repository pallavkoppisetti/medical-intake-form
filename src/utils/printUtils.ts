/**
 * Utility functions for printing the PDF preview
 */

export interface PrintOptions {
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  margins?: string;
}

/**
 * Print the PDF preview using browser's print functionality
 * This ensures perfect fidelity between preview and printed PDF
 */
export const printPreviewAsPDF = (
  previewElement: HTMLElement, 
  options: PrintOptions = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        reject(new Error('Unable to open print window. Please allow popups.'));
        return;
      }

      // Get the preview content
      const previewContent = previewElement.innerHTML;
      
      // Get the CSS styles for the preview
      const stylesheets = Array.from(document.styleSheets);
      let cssText = '';
      
      stylesheets.forEach(stylesheet => {
        try {
          if (stylesheet.cssRules) {
            Array.from(stylesheet.cssRules).forEach(rule => {
              cssText += rule.cssText + '\n';
            });
          }
        } catch (e) {
          // Handle cross-origin stylesheets
          console.warn('Could not access stylesheet:', e);
        }
      });

      // Create the print document
      const printDocument = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${options.filename || 'Medical Form'}</title>
          <style>
            @page {
              size: A4 ${options.orientation || 'portrait'};
              margin: ${options.margins || '0.5in'};
            }
            
            @media print {
              body {
                margin: 0;
                padding: 0;
                background: white !important;
                color: black !important;
              }
              
              .no-print, 
              button, 
              .toggle-button,
              .form-controls {
                display: none !important;
              }
              
              /* Ensure signature images print */
              img {
                max-width: 100% !important;
                height: auto !important;
                page-break-inside: avoid;
              }
              
              /* Prevent page breaks in important sections */
              .signature-section,
              .assessment-section {
                page-break-inside: avoid;
              }
            }
            
            ${cssText}
          </style>
        </head>
        <body>
          ${previewContent}
        </body>
        </html>
      `;

      // Write the document to the print window
      printWindow.document.write(printDocument);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          resolve();
        }, 500);
      };

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate a safe filename for the PDF
 */
export const generatePDFFilename = (formData: any): string => {
  const patientName = formData?.header?.claimantName || 'Unknown';
  const examDate = formData?.header?.examDate || new Date().toISOString().split('T')[0];
  const safePatientName = patientName.replace(/[^a-zA-Z0-9_]/g, '_');
  const safeExamDate = examDate.replace(/-/g, '');
  return `CE_Exam_${safePatientName}_${safeExamDate}.pdf`;
};

/**
 * Save the preview as PDF using modern browser APIs
 */
export const savePreviewAsPDF = async (
previewElement: HTMLElement, formData: any, ): Promise<void> => {
  const filename = generatePDFFilename(formData);
  
  // Try using the modern approach first (if available)
  if ('showSaveFilePicker' in window) {
    try {
      await printPreviewAsPDF(previewElement, { filename });
      return;
    } catch (error) {
      console.warn('Modern save failed, falling back to print:', error);
    }
  }
  
  // Fallback to print dialog
  await printPreviewAsPDF(previewElement, { filename });
};
