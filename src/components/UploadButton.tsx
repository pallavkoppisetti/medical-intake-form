import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FloridaCEExamForm } from '../types/comprehensive-medical-form';

interface UploadButtonProps {
  formData: Partial<FloridaCEExamForm>;
  doctorId: string;
  patientName: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({ formData, doctorId, patientName }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpload = async () => {
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    const state=localStorage.getItem('medical-intake-form');
    try {
      // Capture the PDF preview content as an image
      const pdfPreview = document.getElementById('pdf-preview-content');
      if (!pdfPreview) {
        throw new Error('PDF preview content not found');
      }

      // Temporarily make the element visible for capture if it's hidden
      const originalDisplay = pdfPreview.style.display;
      const originalVisibility = pdfPreview.style.visibility;
      pdfPreview.style.display = 'block';
      pdfPreview.style.visibility = 'visible';

      const canvas = await html2canvas(pdfPreview, {
        scale: 2, // Increase resolution
        useCORS: true,
        logging: false,
        allowTaint: true, // Allow capturing hidden elements
      });

      // Restore original styles
      pdfPreview.style.display = originalDisplay;
      pdfPreview.style.visibility = originalVisibility;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'letter',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scaledImgHeight = (imgHeight * pdfWidth) / imgWidth;

      // Calculate number of pages needed
      const pageHeight = pdfHeight;
      const totalPages = Math.ceil(scaledImgHeight / pageHeight);

      // Create a temporary canvas for cropping
      const tempCanvas = document.createElement('canvas');
      const tempContext = tempCanvas.getContext('2d');

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // Calculate the portion of the image for this page
        const srcY = page * pageHeight * (imgWidth / pdfWidth);
        const pageImgHeight = Math.min(pageHeight, scaledImgHeight - page * pageHeight);

        // Set temporary canvas size to match the PDF page
        tempCanvas.width = imgWidth;
        tempCanvas.height = pageImgHeight * (imgWidth / pdfWidth);

        // Draw the cropped portion of the original canvas
        tempContext.drawImage(
          canvas,
          0,
          srcY,
          imgWidth,
          tempCanvas.height,
          0,
          0,
          imgWidth,
          tempCanvas.height
        );

        // Get the cropped image data
        const pageImgData = tempCanvas.toDataURL('image/png');

        // Add the cropped image to the PDF
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageImgHeight, undefined, 'FAST');
      }

      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');

      // Prepare form data for API
      const formDataToSend = new FormData();
      formDataToSend.append('file', pdfBlob, `${patientName.replace(' ', '_')}_intake_form.pdf`);
      formDataToSend.append('doctorId', doctorId);
      formDataToSend.append('patientName', patientName);
      formDataToSend.append('formData', JSON.stringify(formData));

      // Send to FastAPI endpoint
      const response = await axios.post('http://127.0.0.1:8000/upload/pdf', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(response.data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isUploading ? 'Uploading...' : 'Generate and Upload PDF'}
      </button>
      {success && (
        <p className="text-green-600 text-sm">{success}</p>
      )}
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
};

export default UploadButton;