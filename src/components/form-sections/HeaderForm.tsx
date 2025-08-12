import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function HeaderForm() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const headerData = getCurrentStepData();

  const handleChange = (field: string, value: string) => {
    updateSection('header', { ...headerData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Header Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            label="Claimant Name"
            value={headerData?.claimantName || ''}
            onChange={(value) => handleChange('claimantName', value)}
            placeholder="Enter full name"
            required
          />
          
          <FormInput
            label="Date of Birth"
            type="date"
            value={headerData?.dateOfBirth || ''}
            onChange={(value) => handleChange('dateOfBirth', value)}
            required
          />
          
          <FormInput
            label="Exam Date"
            type="date"
            value={headerData?.examDate || ''}
            onChange={(value) => handleChange('examDate', value)}
            required
          />
          
          <FormInput
            label="Case Number"
            value={headerData?.caseNumber || ''}
            onChange={(value) => handleChange('caseNumber', value)}
            placeholder="Enter case number"
            required
          />
          
          <FormTextarea
            label="Chief Complaint"
            value={headerData?.chiefComplaint || ''}
            onChange={(value) => handleChange('chiefComplaint', value)}
            placeholder="Describe the primary complaint or reason for examination"
            rows={4}
            required
          />
        </CardContent>
      </Card>
    </div>
  );
}
