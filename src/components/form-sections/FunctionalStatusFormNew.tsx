import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { Card, CardContent } from '../ui/card';

export function FunctionalStatusFormNew() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const functionalData = getCurrentStepData();

  const handleChange = (field: string, value: string) => {
    updateSection('functionalStatus', { ...functionalData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Functional Status Header */}
      <div className="text-center border-b-2 border-gray-800 pb-2">
        <h1 className="text-xl font-bold text-gray-900">Functional Status</h1>
      </div>

      {/* Row: Dominant Hand and Activity Tolerance */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Dominant Hand - Restricted Size */}
        <div className="lg:col-span-1">
          <Card className="bg-indigo-50 border-l-4 border-indigo-500 h-full">
            <CardContent className="pt-0.5 px-4 pb-3 h-full flex flex-col">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-indigo-800">Dominant Hand</h3>
              </div>
              <div className="flex-1 flex items-start">
                <div className="w-full">
                  <FormSelect
                    label=""
                    value={functionalData?.dominantHand || ''}
                    onChange={(value) => handleChange('dominantHand', value)}
                    options={[
                      { value: 'Right', label: 'Right' },
                      { value: 'Left', label: 'Left' }
                    ]}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Tolerance Activities - Single Card */}
        <div className="lg:col-span-3">
          <Card className="bg-blue-50 border-l-4 border-blue-500 h-full">
            <CardContent className="pt-0.5 h-full flex flex-col">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-blue-800">Activity Tolerance</h3>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-700 text-sm">Sitting</h4>
                    <FormInput
                      label="Worst Day"
                      value={functionalData?.sittingWorstDay || ''}
                      onChange={(value) => handleChange('sittingWorstDay', value)}
                      placeholder="e.g., 15-30 minutes"
                      className="text-sm"
                    />
                    <FormInput
                      label="Best Day"
                      value={functionalData?.sittingBestDay || ''}
                      onChange={(value) => handleChange('sittingBestDay', value)}
                      placeholder="e.g., up to 1 hour"
                      className="text-sm"
                    />
                  </div>
                  
                  {/* Standing */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-700 text-sm">Standing</h4>
                    <FormInput
                      label="Worst Day"
                      value={functionalData?.standingWorstDay || ''}
                      onChange={(value) => handleChange('standingWorstDay', value)}
                      placeholder="e.g., 5-10 minutes"
                      className="text-sm"
                    />
                    <FormInput
                      label="Best Day"
                      value={functionalData?.standingBestDay || ''}
                      onChange={(value) => handleChange('standingBestDay', value)}
                      placeholder="e.g., 20-30 minutes"
                      className="text-sm"
                    />
                  </div>
                  
                  {/* Walking */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-700 text-sm">Walking</h4>
                    <FormInput
                      label="Worst Day"
                      value={functionalData?.walkingWorstDay || ''}
                      onChange={(value) => handleChange('walkingWorstDay', value)}
                      placeholder="e.g., 1-2 blocks"
                      className="text-sm"
                    />
                    <FormInput
                      label="Best Day"
                      value={functionalData?.walkingBestDay || ''}
                      onChange={(value) => handleChange('walkingBestDay', value)}
                      placeholder="e.g., 4-5 blocks"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 1: Meal Preparation & Grocery Shopping and Personal Finances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="bg-orange-50 border-l-4 border-orange-500">
            <CardContent className="pt-0.5">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-orange-800">Meal Preparation & Grocery Shopping</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-700 text-sm">Meal Preparation</h4>
                  <FormInput
                    label=""
                    value={functionalData?.cookingMealPrep || ''}
                    onChange={(value) => handleChange('cookingMealPrep', value)}
                    placeholder="e.g., simple meals only"
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-700 text-sm">Shopping - Worst Day</h4>
                  <FormInput
                    label=""
                    value={functionalData?.groceryShoppingWorstDay || ''}
                    onChange={(value) => handleChange('groceryShoppingWorstDay', value)}
                    placeholder="e.g., requires assistance"
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-700 text-sm">Shopping - Best Day</h4>
                  <FormInput
                    label=""
                    value={functionalData?.groceryShoppingBestDay || ''}
                    onChange={(value) => handleChange('groceryShoppingBestDay', value)}
                    placeholder="e.g., quick trips only"
                    className="text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-gray-50 border-l-4 border-gray-500 h-full">
            <CardContent className="pt-0.5 h-full flex flex-col">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-800">Personal Finances</h3>
              </div>
              <div className="flex-1">
                <FormInput
                  label=""
                  value={functionalData?.personalFinances || ''}
                  onChange={(value) => handleChange('personalFinances', value)}
                  placeholder="e.g., able to manage basic finances"
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Driving and Personal Care */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-red-50 border-l-4 border-red-500">
          <CardContent className="pt-0.5">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-red-800">Driving</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-red-700 text-sm">Worst Day</h4>
                <FormInput
                  label=""
                  value={functionalData?.drivingWorstDay || ''}
                  onChange={(value) => handleChange('drivingWorstDay', value)}
                  placeholder="e.g., local trips only"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-red-700 text-sm">Best Day</h4>
                <FormInput
                  label=""
                  value={functionalData?.drivingBestDay || ''}
                  onChange={(value) => handleChange('drivingBestDay', value)}
                  placeholder="e.g., up to 30 minutes"
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-teal-50 border-l-4 border-teal-500">
          <CardContent className="pt-0.5">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-teal-800">Personal Care</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-teal-700 text-sm">Bathing/Showering</h4>
                <FormInput
                  label=""
                  value={functionalData?.bathingShowering || ''}
                  onChange={(value) => handleChange('bathingShowering', value)}
                  placeholder="e.g., requires shower chair"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-teal-700 text-sm">Dressing</h4>
                <FormInput
                  label=""
                  value={functionalData?.dressing || ''}
                  onChange={(value) => handleChange('dressing', value)}
                  placeholder="e.g., requires assistance"
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
