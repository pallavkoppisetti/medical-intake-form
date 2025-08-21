import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormInput } from '../ui/FormInput';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity } from 'lucide-react';

// Simplified state for this form
type Vitals = {
    bloodPressure?: { systolic?: string; diastolic?: string };
    weight?: string;
    heartRate?: string;
    oxygenSaturation?: string;
    height?: string;
    temperature?: string;
};

export function VitalsForm() {
  const [vitals, setVitals] = useState<Vitals>({});
  const { patientId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('medical-intake-form');
    localStorage.removeItem('medical-intake-draft');
  }, []);

  const handleChange = (field: keyof Vitals, value: any) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleBPChange = (type: 'systolic' | 'diastolic', value: string) => {
    setVitals(prev => ({
        ...prev,
        bloodPressure: {
            ...prev.bloodPressure,
            [type]: value,
        }
    }));
  };

  const handleSubmit = async () => {
    try {
        const res = await fetch(`http://localhost:8000/patients/vitals?patient_id=${patientId}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vitals),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Failed to submit vitals");
        }

        alert('Vitals submitted successfully!');
        navigate('/dashboard');
    } catch (error: any) {
        alert(error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            Vital Signs for Patient ID: {patientId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Blood Pressure</label>
              <div className="flex items-center gap-2">
                <FormInput
                  label=""
                  value={vitals.bloodPressure?.systolic || ''}
                  onChange={(value) => handleBPChange('systolic', value)}
                  placeholder="120"
                  type="number"
                  className="w-20"
                />
                <span className="text-gray-500">/</span>
                <FormInput
                  label=""
                  value={vitals.bloodPressure?.diastolic || ''}
                  onChange={(value) => handleBPChange('diastolic', value)}
                  placeholder="80"
                  type="number"
                  className="w-20"
                />
                <span className="text-sm text-gray-500">mmHg</span>
              </div>
            </div>
            <FormInput
              label="Weight"
              value={vitals.weight || ''}
              onChange={(value) => handleChange('weight', value)}
              placeholder="150 lbs"
              type="number"
            />
            <FormInput
              label="Heart Rate"
              value={vitals.heartRate || ''}
              onChange={(value) => handleChange('heartRate', value)}
              placeholder="72 bpm"
              type="number"
            />
            <FormInput
              label="O2 Saturation"
              value={vitals.oxygenSaturation || ''}
              onChange={(value) => handleChange('oxygenSaturation', value)}
              placeholder="98%"
            />
            <FormInput
              label="Height"
              value={vitals.height || ''}
              onChange={(value) => handleChange('height', value)}
              placeholder="68 inches"
            />
            <FormInput
              label="Temperature"
              value={vitals.temperature || ''}
              onChange={(value) => handleChange('temperature', value)}
              placeholder="98.6°F"
              type="number"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Submit Vitals
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}