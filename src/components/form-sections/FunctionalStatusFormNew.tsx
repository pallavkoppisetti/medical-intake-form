import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function FunctionalStatusFormNew() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const functionalData = getCurrentStepData();

  const handleChange = (field: string, value: string) => {
    updateSection('functionalStatus', { ...functionalData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Functional Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            label="Dominant Hand"
            value={functionalData?.dominantHand || ''}
            onChange={(value) => handleChange('dominantHand', value)}
            options={[
              { value: 'Right', label: 'Right' },
              { value: 'Left', label: 'Left' }
            ]}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Sitting - Worst Day"
              value={functionalData?.sittingWorstDay || ''}
              onChange={(value) => handleChange('sittingWorstDay', value)}
              placeholder="Duration or limitations"
            />
            
            <FormInput
              label="Sitting - Best Day"
              value={functionalData?.sittingBestDay || ''}
              onChange={(value) => handleChange('sittingBestDay', value)}
              placeholder="Duration or limitations"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Standing - Worst Day"
              value={functionalData?.standingWorstDay || ''}
              onChange={(value) => handleChange('standingWorstDay', value)}
              placeholder="Duration or limitations"
            />
            
            <FormInput
              label="Standing - Best Day"
              value={functionalData?.standingBestDay || ''}
              onChange={(value) => handleChange('standingBestDay', value)}
              placeholder="Duration or limitations"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Walking - Worst Day"
              value={functionalData?.walkingWorstDay || ''}
              onChange={(value) => handleChange('walkingWorstDay', value)}
              placeholder="Distance or limitations"
            />
            
            <FormInput
              label="Walking - Best Day"
              value={functionalData?.walkingBestDay || ''}
              onChange={(value) => handleChange('walkingBestDay', value)}
              placeholder="Distance or limitations"
            />
          </div>
          
          <FormInput
            label="Cooking/Meal Preparation"
            value={functionalData?.cookingMealPrep || ''}
            onChange={(value) => handleChange('cookingMealPrep', value)}
            placeholder="Abilities and limitations"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Grocery Shopping - Worst Day"
              value={functionalData?.groceryShoppingWorstDay || ''}
              onChange={(value) => handleChange('groceryShoppingWorstDay', value)}
              placeholder="Abilities and limitations"
            />
            
            <FormInput
              label="Grocery Shopping - Best Day"
              value={functionalData?.groceryShoppingBestDay || ''}
              onChange={(value) => handleChange('groceryShoppingBestDay', value)}
              placeholder="Abilities and limitations"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Driving - Worst Day"
              value={functionalData?.drivingWorstDay || ''}
              onChange={(value) => handleChange('drivingWorstDay', value)}
              placeholder="Abilities and limitations"
            />
            
            <FormInput
              label="Driving - Best Day"
              value={functionalData?.drivingBestDay || ''}
              onChange={(value) => handleChange('drivingBestDay', value)}
              placeholder="Abilities and limitations"
            />
          </div>
          
          <FormInput
            label="Bathing/Showering"
            value={functionalData?.bathingShowering || ''}
            onChange={(value) => handleChange('bathingShowering', value)}
            placeholder="Abilities and limitations"
          />
          
          <FormInput
            label="Dressing"
            value={functionalData?.dressing || ''}
            onChange={(value) => handleChange('dressing', value)}
            placeholder="Abilities and limitations"
          />
          
          <FormInput
            label="Personal Finances"
            value={functionalData?.personalFinances || ''}
            onChange={(value) => handleChange('personalFinances', value)}
            placeholder="Abilities and limitations"
          />
        </CardContent>
      </Card>
    </div>
  );
}
