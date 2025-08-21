import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Initial({ patientId }: { patientId: string | null }) {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.removeItem('medical-intake-form');
    localStorage.removeItem('medical-intake-draft');
    if (patientId) {
      localStorage.setItem('currentPatientId', patientId);
    } else {
      localStorage.removeItem('currentPatientId');
    }
  }, [patientId]);

  // Replace the endoint if hosted
  const API_URL = 'http://127.0.0.1:8000/autofill';

  const handleCompletion = () => {
    if (patientId) {
        const storedStatus = JSON.parse(localStorage.getItem('patientsStatus') || '{}');
        storedStatus[patientId] = { ...storedStatus[patientId], intake_status: 'completed' };
        localStorage.setItem('patientsStatus', JSON.stringify(storedStatus));
    }
  };

  const handleProceed = async () => {
    setError('');
    setLoading(true);
    try {
      console.log(patientId)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "text": inputText, "patient_id": patientId })
      });
      
      if (!response.ok) throw new Error('Failed to process document');
      
      const formData = await response.json();
      console.log('Received form data:', formData);

      // Save to the generic key for the form to load
      localStorage.setItem('medical-intake-form', JSON.stringify(formData));
      
      // Also save to a patient-specific key for later retrieval
      if (patientId) {
        try {
            const res = await fetch(`https://ceform-api.ezfylr.ai/patients/${patientId}/form-data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to save form data for patient");
            }
        } catch (error: any) {
            console.error("Failed to save form data to backend:", error.message);
            // Decide if we should stop the flow here or just warn the user
        }
      }

      handleCompletion();
      navigate('/form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process document');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    handleCompletion();
    navigate('/form');
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6 md:p-8">
        <div className="text-2xl font-bold text-gray-900 mb-6">
          Paste your soap notes
        </div>
        <div className="text-gray-600 mb-8">
          <p className="mb-4">
            To get started, you have two options:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-8">
            <li>Paste an existing medical document below to auto-fill the form</li>
            <li>Skip this step and fill out the form manually</li>
          </ol>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="document-text" className="block text-sm font-medium text-gray-700 mb-2">
              Document Text (Optional)
            </label>
            <textarea
              id="document-text"
              className="w-full p-4 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Paste your document content here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-medium">please select a patient to submit the form</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          <div className="flex gap-4 justify-end">
            <button
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              onClick={handleSkip}
            >
              Skip & Start Manual Entry
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleProceed}
              disabled={loading || !inputText.trim()}
            >
              {loading ? 'Processing Document...' : 'Process & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
