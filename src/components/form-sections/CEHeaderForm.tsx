import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { Card, CardContent } from '../ui/card';

export function CEHeaderForm() {
  console.log('CEHeaderForm rendering...');
  const { getCurrentStepData, updateSection, updateSectionImmediate } = useMultiStepForm();
  const headerData = getCurrentStepData();
  
  console.log('CEHeaderForm - headerData:', headerData);

  const handleChange = (field: string, value: string) => {
    updateSection('header', { ...headerData, [field]: value });
  };

  const handleImmediateChange = (field: string, value: string) => {
    updateSectionImmediate('header', { ...headerData, [field]: value });
  };

  const handleAddComplaint = () => {
    const currentComplaint = headerData?.chiefComplaint?.trim();
    if (!currentComplaint) return;

    const currentTags = headerData?.chiefComplaintTags || [];
    if (!currentTags.includes(currentComplaint)) {
      const updatedData = {
        ...headerData,
        chiefComplaintTags: [...currentTags, currentComplaint],
        chiefComplaint: '' // Clear the input after adding
      };
      updateSection('header', updatedData);
      updateSectionImmediate('header', updatedData);
    }
  };

  const handleRemoveComplaint = (index: number) => {
    const currentTags = headerData?.chiefComplaintTags || [];
    const updatedTags = currentTags.filter((_: string, i: number) => i !== index);
    const updatedData = {
      ...headerData,
      chiefComplaintTags: updatedTags
    };
    updateSection('header', updatedData);
    updateSectionImmediate('header', updatedData);
  };

  return (
    <div className="space-y-4">
      {/* Official Header */}
      <div className="text-center border-b-2 border-gray-800 pb-3">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          TO: FLORIDA DIVISION OF DISABILITY DETERMINATION
        </h1>
        <h2 className="text-lg font-semibold text-gray-800">
          CONSULTATIVE EXAMINATION REPORT
        </h2>
      </div>

      {/* Disclaimer */}
      <Card className="bg-blue-50 border-l-4 border-blue-500">
        <CardContent className="pt-4">
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold mb-2 text-blue-800">IMPORTANT NOTICE:</p>
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
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <FormInput
              label="Claimant's Name"
              value={headerData?.claimantName || ''}
              onChange={(value) => handleChange('claimantName', value)}
              onImmediateChange={(value) => handleImmediateChange('claimantName', value)}
              placeholder="e.g., Smith, John Michael"
              required
              className="font-semibold lg:col-span-2"
            />
            
            <FormInput
              label="Date of Birth"
              type="date"
              value={headerData?.dateOfBirth || ''}
              onChange={(value) => handleChange('dateOfBirth', value)}
              onImmediateChange={(value) => handleImmediateChange('dateOfBirth', value)}
              required
            />

            <FormInput
              label="Date of Examination"
              type="date"
              value={headerData?.examDate || ''}
              onChange={(value) => handleChange('examDate', value)}
              onImmediateChange={(value) => handleImmediateChange('examDate', value)}
              required
            />
            
            {/* Case Number and Chief Complaint in same row */}
            <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-1">
                <FormInput
                  label="Case Number"
                  value={headerData?.caseNumber || ''}
                  onChange={(value) => handleChange('caseNumber', value)}
                  onImmediateChange={(value) => handleImmediateChange('caseNumber', value)}
                  placeholder="e.g., FL2024-123456-789"
                  required
                  className="font-mono"
                />
              </div>
              
              {/* Chief Complaint - Tag-based System */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Chief Complaint <span className="text-red-500">*</span>
                </label>
                
                {/* Add new complaint input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={headerData?.chiefComplaint || ''}
                    onChange={(e) => handleChange('chiefComplaint', e.target.value)}
                    placeholder="e.g., Back pain, Headache..."
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddComplaint();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddComplaint}
                    disabled={!headerData?.chiefComplaint?.trim()}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <span className="text-lg leading-none">+</span>
                    Add
                  </button>
                </div>

                {/* Display complaint tags */}
                {headerData?.chiefComplaintTags && headerData.chiefComplaintTags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {headerData.chiefComplaintTags.map((tag: string, index: number) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg border-2 border-blue-700 shadow-sm hover:bg-blue-700 transition-colors"
                        >
                          <span className="font-semibold">● {tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveComplaint(index)}
                            className="text-blue-200 hover:text-white ml-1 font-bold text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Add individual complaints or symptoms. Each will appear as a bullet point in the PDF.
                </p>
              </div>
            </div>
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
