import { MultiStepFormProvider } from '../contexts/MultiStepFormContext';
import { MultiStepFormController } from '../components/MultiStepFormController';
import { FormLayout } from '../components/FormLayout';

export function MedicalIntakePage() {
  return (
    <MultiStepFormProvider>
      <div className="min-h-screen bg-gray-50">
        <FormLayout>
          <MultiStepFormController
            showProgressBar={true}
            progressBarOrientation="horizontal"
            enablePreview={true}
            autoSave={true}
          />
        </FormLayout>
      </div>
    </MultiStepFormProvider>
  );
}
