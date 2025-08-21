import React, { useState } from 'react';
import axios from 'axios';
import { FloridaCEExamForm } from '../types/comprehensive-medical-form';
import { PDFGeneratorService } from '../services/PDFGeneratorService';
import { useNavigate } from 'react-router-dom';

interface UploadButtonProps {
  formData: Partial<FloridaCEExamForm>;
  doctorId: string;
  patientName: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({ formData, doctorId, patientName }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUpload = () => {
    setIsUploading(true);
    setError(null);

    const uploadProcess = async () => {
      try {
        const patientId = localStorage.getItem('currentPatientId');
        if (!patientId) {
          console.error('Patient ID not found. Please go back to the dashboard and select a patient.');
          return;
        }

        // Generate PDF using the service
        const pdfGenerator = new PDFGeneratorService();
        const pdfBlob = pdfGenerator.generatePDF(formData);
        const filename = pdfGenerator.getPDFFilename(formData);

        // Prepare form data for API
        const formDataToSend = new FormData();
        formDataToSend.append('file', pdfBlob, filename);
        formDataToSend.append('doctorId', doctorId);
        formDataToSend.append('patientName', patientName);
        formDataToSend.append('patientId', patientId);
        formDataToSend.append('formData', JSON.stringify(formData));

        // Send to FastAPI endpoint
        await axios.post('http://127.0.0.1:8000/upload/pdf', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('PDF upload completed in background.');
      } catch (err) {
        console.error('Background PDF upload failed:', err);
      }
    };

    // Start the upload in the background
    uploadProcess();

    // Redirect to dashboard after a short delay to give user feedback
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
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
      {isUploading && (
        <p className="text-gray-600 text-sm">Redirecting to dashboard...</p>
      )}
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
};

export default UploadButton;
