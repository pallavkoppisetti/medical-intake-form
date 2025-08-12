import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { Stethoscope, Heart, Activity } from 'lucide-react';

export function VitalSignsForm() {
  const { state, updateSection } = useMultiStepForm();
  const data = state.formData.vitalSigns || {};

  const updateField = (field: string, value: any) => {
    updateSection('vitalSigns', { ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <Stethoscope className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vital Signs</h2>
          <p className="text-gray-600">Record patient's current vital signs and measurements</p>
        </div>
      </div>

      {/* Basic Vitals */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 text-red-500 mr-2" />
          Basic Vital Signs
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Systolic BP (mmHg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={(data as any).systolicBP || ''}
              onChange={(e) => updateField('systolicBP', parseInt(e.target.value) || '')}
              placeholder="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Diastolic BP (mmHg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={(data as any).diastolicBP || ''}
              onChange={(e) => updateField('diastolicBP', parseInt(e.target.value) || '')}
              placeholder="80"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Heart Rate (bpm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={(data as any).heartRate || ''}
              onChange={(e) => updateField('heartRate', parseInt(e.target.value) || '')}
              placeholder="72"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Respiratory Rate <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={(data as any).respiratoryRate || ''}
              onChange={(e) => updateField('respiratoryRate', parseInt(e.target.value) || '')}
              placeholder="16"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Temperature (°F) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={(data as any).temperature || ''}
              onChange={(e) => updateField('temperature', parseFloat(e.target.value) || '')}
              placeholder="98.6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Oxygen Saturation (%)
            </label>
            <input
              type="number"
              value={(data as any).oxygenSaturation || ''}
              onChange={(e) => updateField('oxygenSaturation', parseInt(e.target.value) || '')}
              placeholder="98"
              min="70"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Physical Measurements */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 text-blue-500 mr-2" />
          Physical Measurements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Height (inches) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={(data as any).height || ''}
              onChange={(e) => updateField('height', parseInt(e.target.value) || '')}
              placeholder="68"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Weight (lbs) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={(data as any).weight || ''}
              onChange={(e) => updateField('weight', parseInt(e.target.value) || '')}
              placeholder="150"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              BMI (calculated)
            </label>
            <input
              type="number"
              step="0.1"
              value={(data as any).bmi || ''}
              onChange={(e) => updateField('bmi', parseFloat(e.target.value) || '')}
              placeholder="22.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              BP Position
            </label>
            <select
              value={(data as any).bpPosition || ''}
              onChange={(e) => updateField('bpPosition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              <option value="sitting">Sitting</option>
              <option value="standing">Standing</option>
              <option value="supine">Supine</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Heart Rhythm
            </label>
            <select
              value={(data as any).heartRhythm || ''}
              onChange={(e) => updateField('heartRhythm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              <option value="regular">Regular</option>
              <option value="irregular">Irregular</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={(data as any).notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Any additional notes about the vital signs..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          />
        </div>
      </div>
    </div>
  );
}
