import { useState } from 'react';
import type { CompleteMedicalIntakeForm, Medication, Allergy } from '../../types/comprehensive-medical-form';

interface HistoryFormProps {
  data: CompleteMedicalIntakeForm['history'];
  onChange: (data: CompleteMedicalIntakeForm['history']) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function HistoryForm({ data, onChange, onNext, onPrevious }: HistoryFormProps) {
  const [formData, setFormData] = useState(data);

  const handleChange = (field: string, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const handleNestedChange = (parentField: string, field: string, value: any) => {
    const updatedData = {
      ...formData,
      [parentField]: {
        ...formData[parentField as keyof typeof formData],
        [field]: value
      }
    };
    setFormData(updatedData);
    onChange(updatedData);
  };

  // Medication management
  const addMedication = () => {
    const newMedication: Medication = {
      name: '',
      dosage: '',
      frequency: '',
      route: 'oral'
    };
    handleChange('currentMedications', [...formData.currentMedications, newMedication]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: any) => {
    const medications = [...formData.currentMedications];
    medications[index] = { ...medications[index], [field]: value };
    handleChange('currentMedications', medications);
  };

  const removeMedication = (index: number) => {
    const medications = formData.currentMedications.filter((_, i) => i !== index);
    handleChange('currentMedications', medications);
  };

  // Allergy management
  const addAllergy = () => {
    const newAllergy: Allergy = {
      allergen: '',
      reaction: '',
      severity: 'mild',
      type: 'drug'
    };
    handleChange('allergies', [...formData.allergies, newAllergy]);
  };

  const updateAllergy = (index: number, field: keyof Allergy, value: any) => {
    const allergies = [...formData.allergies];
    allergies[index] = { ...allergies[index], [field]: value };
    handleChange('allergies', allergies);
  };

  const removeAllergy = (index: number) => {
    const allergies = formData.allergies.filter((_, i) => i !== index);
    handleChange('allergies', allergies);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
        <p className="text-sm text-gray-600 mt-1">
          Please provide information about your medical history and current medications.
        </p>
      </div>

      {/* Current Medications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
        {formData.currentMedications.map((medication, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={medication.name}
                  onChange={(e) => updateMedication(index, 'name', e.target.value)}
                  placeholder="Enter medication name"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage *
                </label>
                <input
                  type="text"
                  value={medication.dosage}
                  onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                  placeholder="e.g., 10mg"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency *
                </label>
                <input
                  type="text"
                  value={medication.frequency}
                  onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                  placeholder="e.g., twice daily"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Route
                </label>
                <select
                  value={medication.route}
                  onChange={(e) => updateMedication(index, 'route', e.target.value as Medication['route'])}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="oral">Oral</option>
                  <option value="topical">Topical</option>
                  <option value="injection">Injection</option>
                  <option value="inhalation">Inhalation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="px-3 py-1 text-red-600 hover:text-red-800"
              >
                Remove Medication
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addMedication}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Medication
        </button>
      </div>

      {/* Allergies */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Allergies</h3>
        {formData.allergies.map((allergy, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergen *
                </label>
                <input
                  type="text"
                  value={allergy.allergen}
                  onChange={(e) => updateAllergy(index, 'allergen', e.target.value)}
                  placeholder="Enter allergen"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reaction *
                </label>
                <input
                  type="text"
                  value={allergy.reaction}
                  onChange={(e) => updateAllergy(index, 'reaction', e.target.value)}
                  placeholder="Describe reaction"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={allergy.severity}
                  onChange={(e) => updateAllergy(index, 'severity', e.target.value as Allergy['severity'])}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="life-threatening">Life-threatening</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={allergy.type}
                  onChange={(e) => updateAllergy(index, 'type', e.target.value as Allergy['type'])}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="drug">Drug</option>
                  <option value="food">Food</option>
                  <option value="environmental">Environmental</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeAllergy(index)}
                className="px-3 py-1 text-red-600 hover:text-red-800"
              >
                Remove Allergy
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addAllergy}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Allergy
        </button>
      </div>

      {/* Social History */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Social History</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Smoking Status
            </label>
            <select
              value={formData.socialHistory.smokingStatus}
              onChange={(e) => handleNestedChange('socialHistory', 'smokingStatus', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="never">Never smoked</option>
              <option value="former">Former smoker</option>
              <option value="current">Current smoker</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alcohol Use
            </label>
            <select
              value={formData.socialHistory.alcoholUse}
              onChange={(e) => handleNestedChange('socialHistory', 'alcoholUse', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="never">Never</option>
              <option value="occasional">Occasional</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exercise Frequency
            </label>
            <select
              value={formData.socialHistory.exerciseFrequency}
              onChange={(e) => handleNestedChange('socialHistory', 'exerciseFrequency', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="none">None</option>
              <option value="rarely">Rarely</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drug Use
            </label>
            <select
              value={formData.socialHistory.drugUse}
              onChange={(e) => handleNestedChange('socialHistory', 'drugUse', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="never">Never</option>
              <option value="former">Former</option>
              <option value="current">Current</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
