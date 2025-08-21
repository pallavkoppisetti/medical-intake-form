import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function SharedFunctionalStatusForm() {
  const [functionalData, setFunctionalData] = useState<any>({});
  const { patientId } = useParams();
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFunctionalData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:8000/patients/functional_status_form?patient_id=${patientId}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(functionalData),
        });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to submit functional status");
      }

      setSubmitted(true);

    } catch (error: any) {
        alert(error.message);
    }
  };

  if (submitted) {
    return (
        <div className="max-w-4xl mx-auto p-8 text-center">
            <Card>
                <CardHeader>
                    <CardTitle>Submission Successful</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Functional status submitted.</p>
                    <p className="text-gray-600">Please move to the vital section.</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Functional Status for Patient ID: {patientId}</CardTitle>
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
              placeholder="e.g., 15-30 minutes before pain increases"
            />
            
            <FormInput
              label="Sitting - Best Day"
              value={functionalData?.sittingBestDay || ''}
              onChange={(value) => handleChange('sittingBestDay', value)}
              placeholder="e.g., up to 1 hour with position changes"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Standing - Worst Day"
              value={functionalData?.standingWorstDay || ''}
              onChange={(value) => handleChange('standingWorstDay', value)}
              placeholder="e.g., 5-10 minutes before needing to sit"
            />
            
            <FormInput
              label="Standing - Best Day"
              value={functionalData?.standingBestDay || ''}
              onChange={(value) => handleChange('standingBestDay', value)}
              placeholder="e.g., 20-30 minutes with frequent position changes"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Walking - Worst Day"
              value={functionalData?.walkingWorstDay || ''}
              onChange={(value) => handleChange('walkingWorstDay', value)}
              placeholder="e.g., 1-2 blocks before needing to rest"
            />
            
            <FormInput
              label="Walking - Best Day"
              value={functionalData?.walkingBestDay || ''}
              onChange={(value) => handleChange('walkingBestDay', value)}
              placeholder="e.g., 4-5 blocks with rest breaks"
            />
          </div>
          
          <FormInput
            label="Cooking/Meal Preparation"
            value={functionalData?.cookingMealPrep || ''}
            onChange={(value) => handleChange('cookingMealPrep', value)}
            placeholder="e.g., simple meals only, unable to stand for extended cooking"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Grocery Shopping - Worst Day"
              value={functionalData?.groceryShoppingWorstDay || ''}
              onChange={(value) => handleChange('groceryShoppingWorstDay', value)}
              placeholder="e.g., unable to shop, requires assistance"
            />
            
            <FormInput
              label="Grocery Shopping - Best Day"
              value={functionalData?.groceryShoppingBestDay || ''}
              onChange={(value) => handleChange('groceryShoppingBestDay', value)}
              placeholder="e.g., quick trips only, uses cart for support"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Driving - Worst Day"
              value={functionalData?.drivingWorstDay || ''}
              onChange={(value) => handleChange('drivingWorstDay', value)}
              placeholder="e.g., local trips only, limited to 15 minutes"
            />
            
            <FormInput
              label="Driving - Best Day"
              value={functionalData?.drivingBestDay || ''}
              onChange={(value) => handleChange('drivingBestDay', value)}
              placeholder="e.g., able to drive up to 30 minutes with breaks"
            />
          </div>
          
          <FormInput
            label="Bathing/Showering"
            value={functionalData?.bathingShowering || ''}
            onChange={(value) => handleChange('bathingShowering', value)}
            placeholder="e.g., requires shower chair, assistance with washing hair"
          />
          
          <FormInput
            label="Dressing"
            value={functionalData?.dressing || ''}
            onChange={(value) => handleChange('dressing', value)}
            placeholder="e.g., requires assistance with socks/shoes, uses adaptive equipment"
          />
          
          <FormInput
            label="Personal Finances"
            value={functionalData?.personalFinances || ''}
            onChange={(value) => handleChange('personalFinances', value)}
            placeholder="e.g., able to manage basic finances, requires help with complex tasks"
          />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Submit Functional Status
        </button>
      </div>
    </div>
  );
}
