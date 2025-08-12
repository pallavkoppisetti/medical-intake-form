import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function HistoryFormNew() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const historyData = getCurrentStepData();

  const handleChange = (field: string, value: string | number) => {
    updateSection('history', { ...historyData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextarea
            label="History of Present Illness"
            value={historyData?.historyOfPresentIllness || ''}
            onChange={(value) => handleChange('historyOfPresentIllness', value)}
            placeholder="Provide detailed history of the present illness..."
            rows={8}
            required
          />
          
          <FormInput
            label="Age"
            type="number"
            value={historyData?.age || ''}
            onChange={(value) => handleChange('age', parseInt(value) || 0)}
            placeholder="Enter age"
            required
          />
          
          <FormInput
            label="Gender"
            value={historyData?.gender || ''}
            onChange={(value) => handleChange('gender', value)}
            placeholder="Enter gender"
            required
          />
        </CardContent>
      </Card>
    </div>
  );
}
