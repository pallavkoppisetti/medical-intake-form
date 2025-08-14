import React, { useState } from 'react';
import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { HistorySection } from '../../types/comprehensive-medical-form';

// Tag Input Component
const TagInput = ({ 
  label, 
  placeholder, 
  tags, 
  onTagsChange 
}: { 
  label: string;
  placeholder: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 inline-flex items-center justify-center w-3 h-3 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      
      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) {
            addTag(inputValue);
          }
        }}
        placeholder={placeholder}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
      <p className="text-xs text-gray-500">Press Enter or comma to add tags</p>
    </div>
  );
};

export function HistoryFormNew() {
  const { getCurrentStepData, updateSection, updateSectionImmediate } = useMultiStepForm();
  const rawHistoryData = getCurrentStepData() || {};

  console.log('HistoryFormNew: rawHistoryData', rawHistoryData);

  // Migration logic: Convert string fields to arrays if needed
  const safeHistoryData: HistorySection = {
    age: rawHistoryData.age || 0,
    gender: rawHistoryData.gender || '',
    historyOfPresentIllness: rawHistoryData.historyOfPresentIllness || '',
    pastMedicalHistory: Array.isArray(rawHistoryData.pastMedicalHistory) ? rawHistoryData.pastMedicalHistory : 
                       (rawHistoryData.pastMedicalHistory ? [rawHistoryData.pastMedicalHistory] : []),
    medications: Array.isArray(rawHistoryData.medications) ? rawHistoryData.medications : 
                       (rawHistoryData.medications ? [rawHistoryData.medications] : []),
    allergies: Array.isArray(rawHistoryData.allergies) ? rawHistoryData.allergies : 
               (rawHistoryData.allergies ? [rawHistoryData.allergies] : []),
    socialHistory: Array.isArray(rawHistoryData.socialHistory) ? rawHistoryData.socialHistory : 
                   (rawHistoryData.socialHistory ? [rawHistoryData.socialHistory] : []),
    familyHistory: Array.isArray(rawHistoryData.familyHistory) ? rawHistoryData.familyHistory : 
                   (rawHistoryData.familyHistory ? [rawHistoryData.familyHistory] : []),
    pastSurgicalHistory: Array.isArray(rawHistoryData.pastSurgicalHistory) ? rawHistoryData.pastSurgicalHistory : 
                     (rawHistoryData.pastSurgicalHistory ? [rawHistoryData.pastSurgicalHistory] : []),
    reviewOfSystems: rawHistoryData.reviewOfSystems || ''
  };

  console.log('HistoryFormNew: safeHistoryData', safeHistoryData);

  const handleChange = (field: string, value: string | number | string[]) => {
    const updatedData = { ...safeHistoryData, [field]: value };
    updateSection('history', updatedData);
  };

  const handleImmediateChange = (field: string, value: string | number | string[]) => {
    const updatedData = { ...safeHistoryData, [field]: value };
    updateSectionImmediate('history', updatedData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <FormTextarea
            label="Review of Systems"
            value={safeHistoryData.reviewOfSystems || ''}
            onChange={(value) => handleChange('reviewOfSystems', value)}
            onImmediateChange={(value) => handleImmediateChange('reviewOfSystems', value)}
            placeholder="e.g., Positive for low back pain, leg numbness..."
            rows={2}
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FormInput
              label="Age"
              type="number"
              value={safeHistoryData.age.toString()}
              onChange={(value) => handleChange('age', parseInt(value) || 0)}
              onImmediateChange={(value) => handleImmediateChange('age', parseInt(value) || 0)}
              placeholder="Enter age"
            />
            <FormInput
              label="Gender"
              value={safeHistoryData.gender}
              onChange={(value) => handleChange('gender', value)}
              onImmediateChange={(value) => handleImmediateChange('gender', value)}
              placeholder="e.g., Male/Female"
              required
            />
          </div>

          <FormTextarea
            label="History of Present Illness"
            value={safeHistoryData.historyOfPresentIllness}
            onChange={(value) => handleChange('historyOfPresentIllness', value)}
            onImmediateChange={(value) => handleImmediateChange('historyOfPresentIllness', value)}
            placeholder="Describe the current illness or condition..."
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TagInput
              label="Past Medical History"
              placeholder="Add previous conditions..."
              tags={safeHistoryData.pastMedicalHistory || []}
              onTagsChange={(tags) => {
                handleChange('pastMedicalHistory', tags);
                handleImmediateChange('pastMedicalHistory', tags);
              }}
            />

            <TagInput
              label="Medications"
              placeholder="Add medications..."
              tags={safeHistoryData.medications || []}
              onTagsChange={(tags) => {
                handleChange('medications', tags);
                handleImmediateChange('medications', tags);
              }}
            />

            <TagInput
              label="Allergies"
              placeholder="Add allergies..."
              tags={safeHistoryData.allergies || []}
              onTagsChange={(tags) => {
                handleChange('allergies', tags);
                handleImmediateChange('allergies', tags);
              }}
            />

            <TagInput
              label="Social History"
              placeholder="Add social history..."
              tags={safeHistoryData.socialHistory || []}
              onTagsChange={(tags) => {
                handleChange('socialHistory', tags);
                handleImmediateChange('socialHistory', tags);
              }}
            />

            <TagInput
              label="Family History"
              placeholder="Add family history..."
              tags={safeHistoryData.familyHistory || []}
              onTagsChange={(tags) => {
                handleChange('familyHistory', tags);
                handleImmediateChange('familyHistory', tags);
              }}
            />

            <TagInput
              label="Past Surgical History"
              placeholder="Add surgical procedures..."
              tags={safeHistoryData.pastSurgicalHistory || []}
              onTagsChange={(tags) => {
                handleChange('pastSurgicalHistory', tags);
                handleImmediateChange('pastSurgicalHistory', tags);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
