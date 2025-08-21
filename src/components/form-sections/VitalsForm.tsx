import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormInput } from '../ui/FormInput';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity, Loader2 } from 'lucide-react';

type Vitals = {
    bloodPressure?: { systolic?: string; diastolic?: string };
    weight?: string;
    heartRate?: string;
    oxygenSaturation?: string;
    height?: string;
    temperature?: string;
    visualAcuity?: {
        right?: { uncorrected?: string; corrected?: string };
        left?: { uncorrected?: string; corrected?: string };
    };
    handGripStrength?: {
        right?: string;
        left?: string;
    };
};

export function VitalsForm() {
  const [vitals, setVitals] = useState<Vitals>({});
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleVisualAcuityChange = (eye: 'right' | 'left', type: 'corrected' | 'uncorrected', value: string) => {
    setVitals(prev => ({
        ...prev,
        visualAcuity: {
            ...prev.visualAcuity,
            [eye]: {
                ...prev.visualAcuity?.[eye],
                [type]: value,
            }
        }
    }));
  };

  const handleGripStrengthChange = (hand: 'right' | 'left', value: string) => {
    setVitals(prev => ({
        ...prev,
        handGripStrength: {
            ...prev.handGripStrength,
            [hand]: value,
        }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
        const res = await fetch(`https://ceform-api.ezfylr.ai/patients/vitals?patient_id=${patientId}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vitals),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Failed to submit vitals");
        }

        navigate('/dashboard');
    } catch (error: any) {
        setSubmitError(error.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            Vital Signs for Patient ID: {patientId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Blood Pressure</label>
              <div className="flex items-center gap-2">
                <FormInput
                  label=""
                  value={vitals.bloodPressure?.systolic || ''}
                  onChange={(value) => handleBPChange('systolic', value)}
                  placeholder="120"
                  type="number"
                />
                <span className="text-gray-500">/</span>
                <FormInput
                  label=""
                  value={vitals.bloodPressure?.diastolic || ''}
                  onChange={(value) => handleBPChange('diastolic', value)}
                  placeholder="80"
                  type="number"
                />
                <span className="text-sm text-gray-500 self-end pb-2">mmHg</span>
              </div>
            </div>
            <FormInput
              label="Weight (lbs)"
              value={vitals.weight || ''}
              onChange={(value) => handleChange('weight', value)}
              placeholder="150"
              type="number"
            />
            <FormInput
              label="Heart Rate (bpm)"
              value={vitals.heartRate || ''}
              onChange={(value) => handleChange('heartRate', value)}
              placeholder="72"
              type="number"
            />
            <FormInput
              label="O2 Saturation (%)"
              value={vitals.oxygenSaturation || ''}
              onChange={(value) => handleChange('oxygenSaturation', value)}
              placeholder="98"
              type="number"
            />
            <FormInput
              label="Height (inches)"
              value={vitals.height || ''}
              onChange={(value) => handleChange('height', value)}
              placeholder="68"
              type="number"
            />
            <FormInput
              label="Temperature (°F)"
              value={vitals.temperature || ''}
              onChange={(value) => handleChange('temperature', value)}
              placeholder="98.6"
              type="number"
            />
          </div>

          <div className="border-t my-6"></div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Visual Acuity */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Visual Acuity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Right Eye</label>
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput
                      label=""
                      value={vitals.visualAcuity?.right?.uncorrected || ''}
                      onChange={(value) => handleVisualAcuityChange('right', 'uncorrected', value)}
                      placeholder="20/20 uncorrected"
                    />
                    <FormInput
                      label=""
                      value={vitals.visualAcuity?.right?.corrected || ''}
                      onChange={(value) => handleVisualAcuityChange('right', 'corrected', value)}
                      placeholder="20/20 corrected"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Left Eye</label>
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput
                      label=""
                      value={vitals.visualAcuity?.left?.uncorrected || ''}
                      onChange={(value) => handleVisualAcuityChange('left', 'uncorrected', value)}
                      placeholder="20/20 uncorrected"
                    />
                    <FormInput
                      label=""
                      value={vitals.visualAcuity?.left?.corrected || ''}
                      onChange={(value) => handleVisualAcuityChange('left', 'corrected', value)}
                      placeholder="20/20 corrected"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamometer Hand Grip Strength */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Dynamometer Hand Grip Strength</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Right Hand (lbs)"
                  value={vitals.handGripStrength?.right || ''}
                  onChange={(value) => handleGripStrengthChange('right', value)}
                  placeholder="45"
                  type="number"
                />
                <FormInput
                  label="Left Hand (lbs)"
                  value={vitals.handGripStrength?.left || ''}
                  onChange={(value) => handleGripStrengthChange('left', value)}
                  placeholder="43"
                  type="number"
                />
              </div>
            </div>
          </div>

          <div className="border-t my-6"></div>

          <div className="flex flex-col items-end">
            {submitError && <p className="text-red-500 text-sm mb-2">{`Error: ${submitError}`}</p>}
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Vitals'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}