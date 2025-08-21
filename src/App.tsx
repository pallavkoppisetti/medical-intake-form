import { MultiStepFormProvider } from './contexts/MultiStepFormContext';
import { MultiStepFormController } from './components/MultiStepFormController';
import { Toaster } from 'sonner';

import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import './App.css'
import Dashboard from './components/DashBoard';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { SharedFunctionalStatusForm } from './components/form-sections/SharedFunctionalStatusForm';
import { VitalsForm } from './components/form-sections/VitalsForm';
import { Initial } from './components/form-sections/initial';

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
  const prefilledData = localStorage.getItem('medical-intake-form');
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

function PatientFormWrapper({ children }: { children: React.ReactNode }) {
    const { patientId } = useParams();
    // Here you could fetch patient data if needed
    console.log("Rendering form for patient ID:", patientId);
    return <div className="p-8 bg-gray-50 min-h-screen">{children}</div>;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/form" element={<MainForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>

        <Route path="/functional-status/:patientId" element={
            <PatientFormWrapper>
                <SharedFunctionalStatusForm />
            </PatientFormWrapper>
        } />
        <Route path="/vitals/:patientId" element={
            <PatientFormWrapper>
                <VitalsForm /> 
            </PatientFormWrapper>
        } />
      
        {/* Add other routes as needed */}
        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
