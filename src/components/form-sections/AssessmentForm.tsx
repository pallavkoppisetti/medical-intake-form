import { useState, useCallback } from 'react';
import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FormTextarea } from '../ui/FormTextarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Minus } from 'lucide-react';
import SignatureComponent from '../SignatureComponent';

// Default templates and statements
const DEFAULT_MEDICAL_RECORDS_STATEMENT = `I have reviewed the medical records provided. The records are consistent with the findings on examination. The medical records support the physical findings and functional limitations noted in this examination.`;

const ABILITIES_TEMPLATE = `Claimant is able to sit for extended periods with occasional position changes. Claimant can stand and walk for short distances. Claimant can lift and carry light objects occasionally.`;

const LIMITATIONS_TEMPLATE = `Claimant's activities of daily living are limited by pain and decreased range of motion. Claimant reports difficulty with prolonged standing, walking long distances, and lifting heavy objects.`;

const COMMON_RECOMMENDATIONS = [
  'Continue current medications as prescribed',
  'Physical therapy for strengthening and range of motion',
  'Follow-up with primary care physician',
  'Orthopedic consultation if symptoms persist',
  'Pain management consultation',
  'Occupational therapy evaluation',
  'MRI of affected area if conservative treatment fails',
  'Weight management counseling',
  'Activity modification as tolerated'
];

export function AssessmentForm() {
  const { getCurrentStepData, updateSection, updateSectionImmediate } = useMultiStepForm();
  const assessmentData = getCurrentStepData() || {};

  const [formData, setFormData] = useState(() => ({
    diagnosisAssessment: assessmentData.diagnosisAssessment || [''],
    medicalSourceStatement: {
      abilities: assessmentData.medicalSourceStatement?.abilities || ABILITIES_TEMPLATE,
      understandingMemoryConcentration: assessmentData.medicalSourceStatement?.understandingMemoryConcentration || '',
      limitations: assessmentData.medicalSourceStatement?.limitations || LIMITATIONS_TEMPLATE,
    },
    recommendations: assessmentData.recommendations || '',
    imagingReviewed: assessmentData.imagingReviewed || '',
    medicalRecordsReviewStatement: assessmentData.medicalRecordsReviewStatement || DEFAULT_MEDICAL_RECORDS_STATEMENT,
    examinerInfo: {
      name: assessmentData.examinerInfo?.name || '',
      facility: assessmentData.examinerInfo?.facility || '',
      date: assessmentData.examinerInfo?.date || new Date().toISOString().split('T')[0],
    },
    examinerSignature: assessmentData.examinerSignature || '',
  }));

  const handleChange = useCallback((field: string, value: any) => {
    const updatedData = { ...formData };
    const keys = field.split('.');
    
    if (keys.length === 1) {
      (updatedData as any)[keys[0]] = value;
    } else if (keys.length === 2) {
      (updatedData as any)[keys[0]][keys[1]] = value;
    }
    
    setFormData(updatedData);
    updateSection('assessment', updatedData);
    // Also update immediate for signature capture and preview
    updateSectionImmediate('assessment', updatedData);
  }, [formData, updateSection, updateSectionImmediate]);

  const addDiagnosisItem = () => {
    const newDiagnosis = [...formData.diagnosisAssessment, ''];
    handleChange('diagnosisAssessment', newDiagnosis);
  };

  const removeDiagnosisItem = (index: number) => {
    const newDiagnosis = formData.diagnosisAssessment.filter((_: string, i: number) => i !== index);
    handleChange('diagnosisAssessment', newDiagnosis);
  };

  const updateDiagnosisItem = (index: number, value: string) => {
    const newDiagnosis = [...formData.diagnosisAssessment];
    newDiagnosis[index] = value;
    handleChange('diagnosisAssessment', newDiagnosis);
  };

  const insertRecommendationTemplate = (template: string) => {
    const currentRecommendations = formData.recommendations;
    const newRecommendations = currentRecommendations ? 
      `${currentRecommendations}\n• ${template}` : 
      `• ${template}`;
    handleChange('recommendations', newRecommendations);
  };

  // Memoized signature change handler to prevent unnecessary re-renders
  const handleSignatureChange = useCallback((signatureDataUrl: string) => {
    // Use setFormData with function form to avoid dependency on formData
    setFormData(prevData => {
      const updatedData = { ...prevData, examinerSignature: signatureDataUrl };
      updateSection('assessment', updatedData);
      updateSectionImmediate('assessment', updatedData);
      return updatedData;
    });
  }, [updateSection, updateSectionImmediate]);

  return (
    <div className="space-y-6">
      {/* Diagnosis/Assessment Section */}
      <Card className="bg-purple-50 border-l-4 border-purple-500">
        <CardHeader>
          <CardTitle>Diagnosis/Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.diagnosisAssessment.map((diagnosis: string, index: number) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <Label htmlFor={`diagnosis-${index}`} className="sr-only">
                  Diagnosis {index + 1}
                </Label>
                <Input
                  id={`diagnosis-${index}`}
                  value={diagnosis}
                  onChange={(e) => updateDiagnosisItem(index, e.target.value)}
                  placeholder={`Diagnosis ${index + 1}`}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeDiagnosisItem(index)}
                disabled={formData.diagnosisAssessment.length === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addDiagnosisItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Diagnosis
          </Button>
        </CardContent>
      </Card>

      {/* Medical Source Statement and Recommendations - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical Source Statement */}
        <Card className="bg-indigo-50 border-l-4 border-indigo-500">
          <CardHeader>
            <CardTitle>Medical Source Statement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Abilities */}
            <div className="space-y-2">
              <FormTextarea
                label="Abilities"
                value={formData.medicalSourceStatement.abilities}
                onChange={(value: string) => handleChange('medicalSourceStatement.abilities', value)}
                placeholder="Claimant is able to..."
                rows={4}
              />
            </div>

            <div className="my-4 border-t border-indigo-200"></div>

            {/* Understanding, Memory, Concentration */}
            <div className="space-y-2">
              <FormTextarea
                label="Understanding, Memory, and Concentration Assessment"
                value={formData.medicalSourceStatement.understandingMemoryConcentration}
                onChange={(value: string) => handleChange('medicalSourceStatement.understandingMemoryConcentration', value)}
                placeholder="Assessment of claimant's understanding, memory, and concentration abilities..."
                rows={4}
              />
            </div>

            <div className="my-4 border-t border-indigo-200"></div>

            {/* Limitations */}
            <div className="space-y-2">
              <FormTextarea
                label="Limitations"
                value={formData.medicalSourceStatement.limitations}
                onChange={(value: string) => handleChange('medicalSourceStatement.limitations', value)}
                placeholder="Claimant's activities of daily living..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-emerald-50 border-l-4 border-emerald-500">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <FormTextarea
                label="Treatment Recommendations"
                value={formData.recommendations}
                onChange={(value: string) => handleChange('recommendations', value)}
                placeholder="Enter treatment recommendations..."
                rows={6}
              />
            </div>
            
            {/* Quick Insert Templates */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Insert Common Recommendations:</Label>
              <div className="grid grid-cols-1 gap-2">
                {COMMON_RECOMMENDATIONS.map((recommendation, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertRecommendationTemplate(recommendation)}
                    className="text-left justify-start text-xs"
                  >
                    {recommendation}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Imaging and Records Review & Examiner Information - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imaging and Records Review */}
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle>Imaging and Records Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imaging">Imaging Reviewed</Label>
              <Input
                id="imaging"
                value={formData.imagingReviewed}
                onChange={(e) => handleChange('imagingReviewed', e.target.value)}
                placeholder="List imaging studies reviewed (X-rays, MRI, CT, etc.)"
              />
            </div>

            <div className="space-y-2">
              <FormTextarea
                label="Statement Re Review of Medical Records"
                value={formData.medicalRecordsReviewStatement}
                onChange={(value: string) => handleChange('medicalRecordsReviewStatement', value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Examiner Information */}
        <Card className="bg-amber-50 border-l-4 border-amber-500">
          <CardHeader>
            <CardTitle>Examiner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examinerName">Examiner Name</Label>
                <Input
                  id="examinerName"
                  value={formData.examinerInfo.name}
                  onChange={(e) => handleChange('examinerInfo.name', e.target.value)}
                  placeholder="Dr. John Smith, MD"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facility">Facility</Label>
                <Input
                  id="facility"
                  value={formData.examinerInfo.facility}
                  onChange={(e) => handleChange('examinerInfo.facility', e.target.value)}
                  placeholder="Medical Center Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDate">Examination Date</Label>
              <Input
                id="examDate"
                type="date"
                value={formData.examinerInfo.date}
                onChange={(e) => handleChange('examinerInfo.date', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Digital Signature Section */}
      <Card className="bg-slate-50 border-l-4 border-slate-500">
        <CardHeader>
          <CardTitle>Examiner Digital Signature</CardTitle>
        </CardHeader>
        <CardContent>
          <SignatureComponent
            onSignatureChange={handleSignatureChange}
            existingSignature={formData.examinerSignature}
            label="Examiner Digital Signature"
            required={true}
            width={500}
            height={150}
          />
          <p className="text-sm text-gray-600 mt-2">
            Your digital signature is required to complete the medical examination form.
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div className="text-sm text-gray-500">
          Assessment form completed. Use the progress bar to navigate to other sections.
        </div>
      </div>
    </div>
  );
}
