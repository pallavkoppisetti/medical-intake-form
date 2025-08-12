import { useState, useEffect } from 'react';
import { MedicalIntakeForm } from '@/types/medical-form';
import { PersonalInfoForm } from '@/components/PersonalInfoForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveFormData, loadFormData, clearFormData } from '@/utils/form-storage';

const STEPS = [
  'Personal Information',
  'Insurance Information',
  'Medical History',
  'Current Visit',
  'Emergency Contact',
  'Review & Submit'
];

export function MedicalIntakePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<MedicalIntakeForm>>({});

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadFormData();
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  // Auto-save form data whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveFormData(formData);
    }
  }, [formData]);

  const updateFormData = (section: keyof MedicalIntakeForm, data: any) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoForm
            data={formData.personalInfo || {}}
            onUpdate={(data) => updateFormData('personalInfo', data)}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
              <CardDescription>
                This section is coming soon! For now, you can navigate between steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Next: Medical History
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                This section is coming soon! For now, you can navigate between steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Next: Current Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Current Visit</CardTitle>
              <CardDescription>
                This section is coming soon! For now, you can navigate between steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Next: Emergency Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>
                This section is coming soon! For now, you can navigate between steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Next: Review & Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Please review your information before submitting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  {formData.personalInfo && (
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
                      <p><strong>Date of Birth:</strong> {formData.personalInfo.dateOfBirth}</p>
                      <p><strong>Email:</strong> {formData.personalInfo.email}</p>
                      <p><strong>Phone:</strong> {formData.personalInfo.phone}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => clearFormData()}>
                      Clear Draft
                    </Button>
                    <Button onClick={() => alert('Form submitted! (This is a demo)')}>
                      Submit Form
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Intake Form</h1>
          <p className="text-gray-600">Please complete all sections to help us provide the best care.</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {index + 1}
                </div>
                <div className={`ml-2 text-sm ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`mx-4 h-0.5 w-8 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Step */}
        {renderStep()}

        {/* Save Notice */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Your progress is automatically saved. You can close this page and return later.
          </p>
        </div>
      </div>
    </div>
  );
}
