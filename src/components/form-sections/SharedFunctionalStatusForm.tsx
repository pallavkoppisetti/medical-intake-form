import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';

const authenticatePatient = async (patientId: string, lastName: string, dob: string): Promise<boolean> => {
    const res = await fetch(`http://ce-backend.eba-prtjiucu.us-east-1.elasticbeanstalk.com/patients-authentication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: patientId, last_name: lastName, DOB: dob }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Authentication failed");
    }

    const result = await res.json();
    return result === true;
};

export function SharedFunctionalStatusForm() {
  const [functionalData, setFunctionalData] = useState<any>({});
  const { patientId } = useParams<{ patientId: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authData, setAuthData] = useState({ lastName: '', dob: '' });

  const handleChange = (field: string, value: string) => {
    setFunctionalData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAuthentication = async () => {
    if (!authData.lastName || !authData.dob) {
      setAuthError("Last name and date of birth are required.");
      return;
    }
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const isAuth = await authenticatePatient(patientId!, authData.lastName, authData.dob);
      if (isAuth) {
        setIsAuthenticated(true);
        setShowAuthModal(false);
      } else {
        setIsAuthenticated(false);
        setShowAuthModal(false);
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      setShowAuthModal(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://ce-backend.eba-prtjiucu.us-east-1.elasticbeanstalk.com/patients/functional_status_form?patient_id=${patientId}`,
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
        setSubmitError(error.message);
    } finally {
        setIsSubmitting(false);
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
                    <p className="text-gray-600">You may now close this window.</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <>
      {showAuthModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Please Authenticate</h2>
            <p className="mb-4 text-gray-600">To access this form, please enter your last name and date of birth.</p>
            <div className="space-y-4">
              <FormInput 
                label="Last Name"
                value={authData.lastName}
                onChange={(value) => setAuthData(prev => ({...prev, lastName: value}))}
                required
              />
              <FormInput 
                label="Date of Birth"
                type="date"
                value={authData.dob}
                onChange={(value) => setAuthData(prev => ({...prev, dob: value}))}
                required
              />
            </div>
            {authError && <p className="text-red-500 mt-4 text-sm">{authError}</p>}
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleAuthentication} 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center disabled:opacity-50"
                disabled={isAuthenticating}
              >
                {isAuthenticating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isAuthenticating ? 'Authenticating...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!isAuthenticated && !showAuthModal && (
        <div className="max-w-4xl mx-auto p-8 text-center">
            <Card>
                <CardHeader>
                    <CardTitle className="text-red-600">Authentication Failed</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Invalid User</p>
                    <p className="text-gray-600">You are not authorized to view this form. Please check the link or contact support.</p>
                </CardContent>
            </Card>
        </div>
      )}

      {isAuthenticated && (
        <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8">
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
          <div className="flex flex-col items-end">
            {submitError && <p className="text-red-500 text-sm mb-2">{`Error: ${submitError}`}</p>}
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center disabled:opacity-50"
              disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Functional Status'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}