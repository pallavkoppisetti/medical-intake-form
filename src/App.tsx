import { MultiStepFormProvider } from './contexts/MultiStepFormContext';
import { MultiStepFormController } from './components/MultiStepFormController';
import { Initial } from './components/form-sections/initial';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

function MainForm() {
  const handleFormSubmit = async (formData: any) => {
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

  // Load any prefilled data from the initial component
  const prefilledData = sessionStorage.getItem('prefilledData');
  let initialFormData;
  
  if (prefilledData) {
    try {
      initialFormData = JSON.parse(prefilledData);
      console.log('Loading prefilled form data:', initialFormData);
      
      // Validate the structure of the form data
      if (!initialFormData.header || !initialFormData.history || !initialFormData.functionalStatus || 
          !initialFormData.medicalInfo || !initialFormData.physicalExam || !initialFormData.rangeOfMotion || 
          !initialFormData.gaitStation) {
        console.error('Invalid form data structure:', initialFormData);
        initialFormData = undefined;
      }
    } catch (err) {
      console.error('Error parsing prefilled form data:', err);
      initialFormData = undefined;
    }
  }

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Initial />} />
        <Route path="/form" element={<MainForm />} />
        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
