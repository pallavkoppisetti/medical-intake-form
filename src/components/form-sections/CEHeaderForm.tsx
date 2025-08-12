import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';
import { Card, CardContent } from '../ui/card';

export function CEHeaderForm() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const headerData = getCurrentStepData();

  const handleChange = (field: string, value: string) => {
    updateSection('header', { ...headerData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Official Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          TO: FLORIDA DIVISION OF DISABILITY DETERMINATION
        </h1>
        <h2 className="text-lg font-semibold text-gray-800">
          CONSULTATIVE EXAMINATION REPORT
        </h2>
      </div>

      {/* Disclaimer */}
      <Card className="bg-gray-50 border-l-4 border-blue-600">
        <CardContent className="pt-4">
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold mb-2">IMPORTANT NOTICE:</p>
            <p>
              This examination was performed for the sole purpose of providing information to the 
              State of Florida Department of Health, Division of Disability Determinations, to assist 
              in the determination of disability benefits under the Social Security Act. This examination 
              is not intended to establish a doctor-patient relationship or to provide treatment recommendations. 
              The findings and opinions expressed herein are based solely on the examination performed on the 
              date indicated below and review of available medical records.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Patient Information Form */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <FormInput
                label="Claimant's Name"
                value={headerData?.claimantName || ''}
                onChange={(value) => handleChange('claimantName', value)}
                placeholder="Last, First Middle"
                required
                className="font-semibold"
              />
              
              <FormInput
                label="Date of Birth"
                type="date"
                value={headerData?.dateOfBirth || ''}
                onChange={(value) => handleChange('dateOfBirth', value)}
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <FormInput
                label="Date of Examination"
                type="date"
                value={headerData?.examDate || ''}
                onChange={(value) => handleChange('examDate', value)}
                required
              />
              
              <FormInput
                label="Case Number"
                value={headerData?.caseNumber || ''}
                onChange={(value) => handleChange('caseNumber', value)}
                placeholder="DDS Case Number"
                required
                className="font-mono"
              />
            </div>
          </div>

          {/* Chief Complaint - Full Width */}
          <div className="mt-6">
            <FormTextarea
              label="Chief Complaint"
              value={headerData?.chiefComplaint || ''}
              onChange={(value) => handleChange('chiefComplaint', value)}
              placeholder="Describe the primary complaint or reason for this consultative examination as provided by DDS..."
              rows={6}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please provide the chief complaint as indicated in the referral from the Division of Disability Determinations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Examiner Information */}
      <Card className="bg-blue-50">
        <CardContent className="pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Examining Physician Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> ________________________
            </div>
            <div>
              <span className="font-medium">License #:</span> ____________________
            </div>
            <div>
              <span className="font-medium">Specialty:</span> ____________________
            </div>
            <div>
              <span className="font-medium">Date:</span> ________________________
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
