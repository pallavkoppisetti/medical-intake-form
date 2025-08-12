import { MultiStepFormProvider } from './contexts/MultiStepFormContext';
import { MultiStepFormController } from './components/MultiStepFormController';
import { FormLayout } from './components/FormLayout';
import './App.css'

function App() {
  const handleFormSubmit = async (formData: any) => {
    // Here you would typically send the form data to your backend
    console.log('Submitting form data:', formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return true for success, false for failure
    return true;
  };

  const handleStepChange = (step: number) => {
    console.log('Navigated to step:', step);
  };

  const handleSectionComplete = (sectionId: string) => {
    console.log('Section completed:', sectionId);
  };

  return (
    <MultiStepFormProvider
      autoSave={true}
      autoSaveInterval={30000}
      onSubmit={handleFormSubmit}
      onStepChange={handleStepChange}
      onSectionComplete={handleSectionComplete}
    >
      <FormLayout>
        <MultiStepFormController
          showProgressBar={false}
          progressBarOrientation="horizontal"
          enablePreview={true}
          autoSave={true}
        />
      </FormLayout>
    </MultiStepFormProvider>
  );
}

export default App
