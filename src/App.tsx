import { MultiStepFormProvider } from './contexts/MultiStepFormContext';
import { MultiStepFormController } from './components/MultiStepFormController';
import { Toaster } from 'sonner';
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
      <MultiStepFormController
        showProgressBar={true}
        progressBarOrientation="horizontal"
        enablePreview={true}
        autoSave={true}
      />
      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </MultiStepFormProvider>
  );
}

export default App
