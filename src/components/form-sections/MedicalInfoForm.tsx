import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormTextarea } from '../ui/FormTextarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function MedicalInfoForm() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const medicalData = getCurrentStepData();

  const handleChange = (field: string, value: string | string[]) => {
    updateSection('medicalInfo', { ...medicalData, [field]: value });
  };

  const handleMedicationChange = (value: string) => {
    const medications = value.split('\n').filter(med => med.trim() !== '');
    handleChange('currentMedications', medications);
  };

  const handleAllergyChange = (value: string) => {
    const allergies = value.split('\n').filter(allergy => allergy.trim() !== '');
    handleChange('allergies', allergies);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextarea
            label="Current Medications"
            value={medicalData?.currentMedications?.join('\n') || ''}
            onChange={handleMedicationChange}
            placeholder="List current medications (one per line)..."
            rows={4}
          />
          
          <FormTextarea
            label="Allergies"
            value={medicalData?.allergies?.join('\n') || ''}
            onChange={handleAllergyChange}
            placeholder="List known allergies (one per line)..."
            rows={3}
          />
          
          <FormTextarea
            label="Surgical History"
            value={medicalData?.surgicalHistory || ''}
            onChange={(value) => handleChange('surgicalHistory', value)}
            placeholder="Describe previous surgeries and procedures..."
            rows={4}
          />
          
          <FormTextarea
            label="Family History"
            value={medicalData?.familyHistory || ''}
            onChange={(value) => handleChange('familyHistory', value)}
            placeholder="Describe relevant family medical history..."
            rows={4}
          />
          
          <FormTextarea
            label="Social History"
            value={medicalData?.socialHistory || ''}
            onChange={(value) => handleChange('socialHistory', value)}
            placeholder="Include smoking, alcohol, drug use, occupation, etc..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}
