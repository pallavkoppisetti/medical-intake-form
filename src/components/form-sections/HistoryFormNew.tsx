import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function HistoryFormNew() {
  const { getCurrentStepData, updateSection, updateSectionImmediate } = useMultiStepForm();
  const historyData = getCurrentStepData();

  const handleChange = (field: string, value: string | number) => {
    updateSection('history', { ...historyData, [field]: value });
  };

  const handleImmediateChange = (field: string, value: string | number) => {
    updateSectionImmediate('history', { ...historyData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
                    <FormTextarea
            label="Review of Systems"
            value={historyData?.reviewOfSystems || ''}
            onChange={(value) => handleChange('reviewOfSystems', value)}
            onImmediateChange={(value) => handleImmediateChange('reviewOfSystems', value)}
            placeholder="e.g., Positive for low back pain, leg numbness, and difficulty with prolonged walking. Negative for fever, weight loss, bowel/bladder dysfunction, saddle anesthesia, or progressive neurological deficits. No recent changes in pain pattern or severity..."
            rows={6}
          />
          
          <FormTextarea
            label="Past Medical History"
            value={historyData?.pastMedicalHistory || ''}
            onChange={(value) => handleChange('pastMedicalHistory', value)}
            onImmediateChange={(value) => handleImmediateChange('pastMedicalHistory', value)}
            placeholder="e.g., Significant for hypertension (controlled with medication), diabetes mellitus type 2 (diet controlled), and history of lumbar disc herniation L4-L5. No history of cancer, heart disease, or other significant medical conditions..."
            rows={6}
          />
          
          <FormTextarea
            label="Past Surgical History"
            value={historyData?.pastSurgicalHistory || ''}
            onChange={(value) => handleChange('pastSurgicalHistory', value)}
            onImmediateChange={(value) => handleImmediateChange('pastSurgicalHistory', value)}
            placeholder="e.g., Lumbar microdiscectomy L4-L5 performed in 2022. Appendectomy in 1998. No other significant surgical procedures..."
            rows={4}
          />
          
          <FormTextarea
            label="Medications"
            value={historyData?.medications || ''}
            onChange={(value) => handleChange('medications', value)}
            placeholder="e.g., Ibuprofen 600mg TID PRN pain, Metformin 500mg BID, Lisinopril 10mg daily, Gabapentin 300mg TID PRN neuropathic pain. No known drug interactions..."
            rows={4}
          />
          
          <FormTextarea
            label="Allergies"
            value={historyData?.allergies || ''}
            onChange={(value) => handleChange('allergies', value)}
            placeholder="e.g., NKDA (No Known Drug Allergies). Environmental allergies to pollen. No food allergies reported..."
            rows={3}
          />
          
          <FormTextarea
            label="Social History"
            value={historyData?.socialHistory || ''}
            onChange={(value) => handleChange('socialHistory', value)}
            placeholder="e.g., Former smoker (quit 5 years ago, 20 pack-year history). Occasional alcohol use (2-3 drinks per week). Currently unemployed due to back injury. Previously worked as warehouse supervisor for 15 years. Lives with spouse, independent with ADLs..."
            rows={4}
          />
          
          <FormTextarea
            label="Family History"
            value={historyData?.familyHistory || ''}
            onChange={(value) => handleChange('familyHistory', value)}
            placeholder="e.g., Father deceased at age 70 from heart disease. Mother living with diabetes and hypertension. No family history of cancer, genetic disorders, or significant musculoskeletal conditions..."
            rows={4}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Age"
              type="number"
              value={historyData?.age || ''}
              onChange={(value) => handleChange('age', parseInt(value) || 0)}
              onImmediateChange={(value) => handleImmediateChange('age', parseInt(value) || 0)}
              placeholder="Enter age"
            />            <FormInput
              label="Gender"
              value={historyData?.gender || ''}
              onChange={(value) => handleChange('gender', value)}
              onImmediateChange={(value) => handleImmediateChange('gender', value)}
              placeholder="e.g., Male/Female"
              required
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
