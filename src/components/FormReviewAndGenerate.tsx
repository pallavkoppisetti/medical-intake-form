import { useState } from 'react';
import { useMultiStepForm } from '../contexts/MultiStepFormContext';
import { PDFGeneratorService } from '../services/PDFGeneratorService';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Download, 
  Edit, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  User,
  History,
  Activity,
  Stethoscope,
  Move,
  RotateCcw,
  ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';

interface FormReviewAndGenerateProps {
  className?: string;
}

interface SectionValidation {
  isComplete: boolean;
  missingFields: string[];
  progress: number;
}

export function FormReviewAndGenerate({ className = '' }: FormReviewAndGenerateProps) {
  const { state, goToStep } = useMultiStepForm();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Step mapping for navigation
  const stepIdToNumber: Record<string, number> = {
    'header': 0,
    'history': 1,
    'functional-status': 2,
    'medical-info': 3,
    'physical-exam': 4,
    'range-of-motion': 5,
    'gait-station': 6,
    'assessment': 7
  };

  // Validate form sections
  const validateSections = (): Record<string, SectionValidation> => {
    const { formData } = state;
    
    return {
      header: validateHeaderSection(formData.header),
      history: validateHistorySection(formData.history),
      functionalStatus: validateFunctionalStatusSection(formData.functionalStatus),
      medicalInfo: validateMedicalInfoSection(formData.medicalInfo),
      physicalExam: validatePhysicalExamSection(formData.physicalExam),
      rangeOfMotion: validateRangeOfMotionSection(formData.rangeOfMotion),
      gaitStation: validateGaitStationSection(formData.gaitStation),
      assessment: validateAssessmentSection(formData.assessment)
    };
  };

  const sectionValidation = validateSections();

  // Generate PDF using the PDFGeneratorService
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      const pdfGenerator = new PDFGeneratorService();
      const pdfBlob = pdfGenerator.generatePDF(state.formData);
      
      toast.success('PDF generated successfully!', {
        description: 'Your CE Exam report has been generated.',
        duration: 3000,
      });
      
      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', {
        description: 'Please try again or contact support.',
        duration: 5000,
      });
      throw error;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Download PDF with formatted filename
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      
      const pdfBlob = await handleGeneratePDF();
      
      // Create formatted filename
      const patientName = state.formData.header?.claimantName || 'Unknown';
      const examDate = state.formData.header?.examDate || new Date().toISOString().split('T')[0];
      const filename = `CE_Exam_${patientName.replace(/\s+/g, '_')}_${examDate.replace(/-/g, '')}.pdf`;
      
      // Download the file
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!', {
        description: `File saved as: ${filename}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Navigate to specific section for editing
  const handleEditSection = (stepId: string) => {
    const stepNumber = stepIdToNumber[stepId];
    if (stepNumber !== undefined) {
      goToStep(stepNumber);
    }
  };

  // Section validation functions
  function validateHeaderSection(data: any): SectionValidation {
    const required = ['claimantName', 'dateOfBirth', 'examDate', 'caseNumber'];
    const missing = required.filter(field => !data?.[field]);
    return {
      isComplete: missing.length === 0,
      missingFields: missing,
      progress: ((required.length - missing.length) / required.length) * 100
    };
  }

  function validateHistorySection(data: any): SectionValidation {
    const required = ['historyOfPresentIllness', 'age', 'gender'];
    const missing = required.filter(field => !data?.[field]);
    return {
      isComplete: missing.length === 0,
      missingFields: missing,
      progress: ((required.length - missing.length) / required.length) * 100
    };
  }

  function validateFunctionalStatusSection(data: any): SectionValidation {
    const required = ['dominantHand', 'sittingWorstDay', 'standingWorstDay', 'walkingWorstDay'];
    const missing = required.filter(field => !data?.[field]);
    return {
      isComplete: missing.length === 0,
      missingFields: missing,
      progress: ((required.length - missing.length) / required.length) * 100
    };
  }

  function validateMedicalInfoSection(data: any): SectionValidation {
    const hasBasicInfo = data?.currentMedications || data?.allergies || data?.surgicalHistory;
    return {
      isComplete: !!hasBasicInfo,
      missingFields: hasBasicInfo ? [] : ['currentMedications', 'allergies'],
      progress: hasBasicInfo ? 100 : 0
    };
  }

  function validatePhysicalExamSection(data: any): SectionValidation {
    const required = ['generalAppearance', 'vitalSigns'];
    const missing = required.filter(field => !data?.[field]);
    return {
      isComplete: missing.length === 0,
      missingFields: missing,
      progress: ((required.length - missing.length) / required.length) * 100
    };
  }

  function validateRangeOfMotionSection(data: any): SectionValidation {
    const hasAnyROM = data?.cervicalSpine || data?.lumbarSpine || data?.shoulders || data?.knees;
    return {
      isComplete: !!hasAnyROM,
      missingFields: hasAnyROM ? [] : ['cervicalSpine', 'lumbarSpine'],
      progress: hasAnyROM ? 100 : 0
    };
  }

  function validateGaitStationSection(data: any): SectionValidation {
    const required = ['gait', 'station'];
    const missing = required.filter(field => !data?.[field]);
    return {
      isComplete: missing.length === 0,
      missingFields: missing,
      progress: ((required.length - missing.length) / required.length) * 100
    };
  }

  function validateAssessmentSection(data: any): SectionValidation {
    const required = ['diagnosisAssessment'];
    const missing = required.filter(field => !data?.[field]);
    return {
      isComplete: missing.length === 0,
      missingFields: missing,
      progress: ((required.length - missing.length) / required.length) * 100
    };
  }

  // Calculate overall completion
  const overallCompletion = Object.values(sectionValidation).reduce(
    (acc, section) => acc + section.progress, 0
  ) / Object.keys(sectionValidation).length;

  const sections = [
    {
      id: 'header',
      title: 'Claimant Information',
      icon: User,
      stepId: 'header',
      data: state.formData.header,
      validation: sectionValidation.header
    },
    {
      id: 'history',
      title: 'History',
      icon: History,
      stepId: 'history',
      data: state.formData.history,
      validation: sectionValidation.history
    },
    {
      id: 'functionalStatus',
      title: 'Functional Status',
      icon: Activity,
      stepId: 'functional-status',
      data: state.formData.functionalStatus,
      validation: sectionValidation.functionalStatus
    },
    {
      id: 'medicalInfo',
      title: 'Medical Information',
      icon: ClipboardList,
      stepId: 'medical-info',
      data: state.formData.medicalInfo,
      validation: sectionValidation.medicalInfo
    },
    {
      id: 'physicalExam',
      title: 'Physical Examination',
      icon: Stethoscope,
      stepId: 'physical-exam',
      data: state.formData.physicalExam,
      validation: sectionValidation.physicalExam
    },
    {
      id: 'rangeOfMotion',
      title: 'Range of Motion',
      icon: Move,
      stepId: 'range-of-motion',
      data: state.formData.rangeOfMotion,
      validation: sectionValidation.rangeOfMotion
    },
    {
      id: 'gaitStation',
      title: 'Gait and Station',
      icon: RotateCcw,
      stepId: 'gait-station',
      data: state.formData.gaitStation,
      validation: sectionValidation.gaitStation
    },
    {
      id: 'assessment',
      title: 'Assessment',
      icon: ClipboardList,
      stepId: 'assessment',
      data: state.formData.assessment,
      validation: sectionValidation.assessment
    }
  ];

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          FLORIDA DIVISION OF DISABILITY DETERMINATION
        </h1>
        <h2 className="text-xl font-semibold text-gray-700">
          CONSULTATIVE EXAMINATION REPORT
        </h2>
        <div className="w-full h-px bg-gray-300 my-4" />
        <p className="text-sm text-gray-600 italic">
          This examination is being performed at the request of the Florida Division of Disability 
          Determination for disability evaluation purposes only.
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Form Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Overall Progress:</span>
            <Badge variant={overallCompletion >= 80 ? "default" : "secondary"}>
              {Math.round(overallCompletion)}% Complete
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Bar */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3 space-x-2 flex items-center">
        <Button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF || overallCompletion < 50}
          variant="outline"
          size="sm"
        >
          {isGeneratingPDF ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Generate PDF
        </Button>
        
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading || overallCompletion < 50}
          variant="default"
          size="sm"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download PDF
        </Button>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {sections.map((section) => {
          const IconComponent = section.icon;
          const validation = section.validation;
          
          return (
            <Card key={section.id} className="print:break-inside-avoid">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5" />
                  {section.title.toUpperCase()}
                  {validation.isComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  )}
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Badge variant={validation.isComplete ? "default" : "secondary"}>
                    {Math.round(validation.progress)}%
                  </Badge>
                  <Button
                    onClick={() => handleEditSection(section.stepId)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="min-h-[100px]">
                  <SectionContent 
                    sectionId={section.id}
                    data={section.data}
                    validation={validation}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Component to render section-specific content
function SectionContent({ 
  sectionId, 
  data, 
  validation 
}: { 
  sectionId: string; 
  data: any; 
  validation: SectionValidation; 
}) {
  const renderField = (label: string, value: any, fieldName?: string) => {
    const isMissing = fieldName && validation.missingFields.includes(fieldName);
    const displayValue = value || (isMissing ? 'Missing' : 'Not provided');
    
    return (
      <div key={label} className="flex flex-col space-y-1">
        <span className="text-sm font-medium text-gray-700">{label}:</span>
        <span className={isMissing ? 'text-red-600 font-medium' : 'text-gray-900'}>
          {displayValue}
        </span>
      </div>
    );
  };

  switch (sectionId) {
    case 'header':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('Claimant Name', data?.claimantName, 'claimantName')}
          {renderField('Date of Birth', data?.dateOfBirth, 'dateOfBirth')}
          {renderField('Examination Date', data?.examDate, 'examDate')}
          {renderField('Case Number', data?.caseNumber, 'caseNumber')}
          {renderField('Chief Complaint', data?.chiefComplaint, 'chiefComplaint')}
        </div>
      );

    case 'history':
      return (
        <div className="space-y-4">
          {renderField('Age', data?.age, 'age')}
          {renderField('Gender', data?.gender, 'gender')}
          <div>
            <span className="text-sm font-medium text-gray-700">History of Present Illness:</span>
            <div className={`mt-1 p-3 bg-gray-50 rounded border ${
              validation.missingFields.includes('historyOfPresentIllness') 
                ? 'border-red-300 text-red-600' 
                : 'border-gray-200'
            }`}>
              {data?.historyOfPresentIllness || 'No history documented'}
            </div>
          </div>
        </div>
      );

    case 'functionalStatus':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('Dominant Hand', data?.dominantHand, 'dominantHand')}
          {renderField('Sitting - Worst Day', data?.sittingWorstDay, 'sittingWorstDay')}
          {renderField('Sitting - Best Day', data?.sittingBestDay)}
          {renderField('Standing - Worst Day', data?.standingWorstDay, 'standingWorstDay')}
          {renderField('Standing - Best Day', data?.standingBestDay)}
          {renderField('Walking - Worst Day', data?.walkingWorstDay, 'walkingWorstDay')}
          {renderField('Walking - Best Day', data?.walkingBestDay)}
          {renderField('Cooking/Meal Prep', data?.cookingMealPrep)}
          {renderField('Bathing/Showering', data?.bathingShowering)}
          {renderField('Dressing', data?.dressing)}
        </div>
      );

    case 'medicalInfo':
      return (
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Current Medications:</span>
            <div className="mt-1">
              {data?.currentMedications?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {data.currentMedications.map((med: string, index: number) => (
                    <li key={index} className="text-gray-900">{med}</li>
                  ))}
                </ul>
              ) : (
                <span className={validation.missingFields.includes('currentMedications') ? 'text-red-600' : 'text-gray-500'}>
                  None reported
                </span>
              )}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Allergies:</span>
            <div className="mt-1">
              {data?.allergies?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {data.allergies.map((allergy: string, index: number) => (
                    <li key={index} className="text-gray-900">{allergy}</li>
                  ))}
                </ul>
              ) : (
                <span className={validation.missingFields.includes('allergies') ? 'text-red-600' : 'text-gray-500'}>
                  NKDA (No Known Drug Allergies)
                </span>
              )}
            </div>
          </div>
          
          {renderField('Surgical History', data?.surgicalHistory)}
          {renderField('Family History', data?.familyHistory)}
          {renderField('Social History', data?.socialHistory)}
        </div>
      );

    case 'physicalExam':
      return (
        <div className="space-y-4">
          {renderField('General Appearance', data?.generalAppearance, 'generalAppearance')}
          
          <div>
            <span className="text-sm font-medium text-gray-700">Vital Signs:</span>
            <div className={`mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 ${
              validation.missingFields.includes('vitalSigns') ? 'text-red-600' : ''
            }`}>
              {data?.vitalSigns ? (
                <>
                  {renderField('Blood Pressure', `${data.vitalSigns.bloodPressure?.systolic || ''}/${data.vitalSigns.bloodPressure?.diastolic || ''} mmHg`)}
                  {renderField('Heart Rate', `${data.vitalSigns.heartRate?.rate || ''} bpm`)}
                  {renderField('Temperature', `${data.vitalSigns.temperature?.value || ''}°${data.vitalSigns.temperature?.unit || 'F'}`)}
                  {renderField('Height', `${data.vitalSigns.height?.feet || ''}'${data.vitalSigns.height?.inches || ''}" (${data.vitalSigns.height?.cm || ''} cm)`)}
                  {renderField('Weight', `${data.vitalSigns.weight?.pounds || ''} lbs (${data.vitalSigns.weight?.kg || ''} kg)`)}
                </>
              ) : (
                <span className="text-red-600">Vital signs not documented</span>
              )}
            </div>
          </div>
          
          {renderField('Cardiovascular', data?.cardiovascular)}
          {renderField('Respiratory', data?.respiratory)}
          {renderField('Musculoskeletal', data?.musculoskeletal)}
          {renderField('Neurological', data?.neurological)}
        </div>
      );

    case 'rangeOfMotion':
      return (
        <div className="space-y-4">
          {data ? (
            Object.entries(data).map(([jointName, jointData]: [string, any]) => (
              <div key={jointName}>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {jointName.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <div className="mt-1 bg-gray-50 p-2 rounded">
                  {jointData && typeof jointData === 'object' ? (
                    <div className="text-sm text-gray-900">
                      {Object.entries(jointData).map(([movement, data]: [string, any]) => (
                        <div key={movement} className="flex justify-between">
                          <span className="capitalize">{movement}:</span>
                          <span>
                            Active: {data?.active || 'N/A'} | 
                            Passive: {data?.passive || 'N/A'} | 
                            Normal: {data?.normal || 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No data recorded</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <span className={validation.missingFields.length > 0 ? 'text-red-600' : 'text-gray-500'}>
              No range of motion data recorded
            </span>
          )}
        </div>
      );

    case 'gaitStation':
      return (
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Gait:</span>
            <div className={`mt-1 space-y-2 ${validation.missingFields.includes('gait') ? 'text-red-600' : ''}`}>
              {data?.gait ? (
                <>
                  {renderField('Pattern', data.gait.pattern)}
                  {renderField('Speed', data.gait.speed)}
                  {renderField('Assistive Device', data.gait.assistiveDevice)}
                </>
              ) : (
                <span className="text-red-600">Gait assessment not documented</span>
              )}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Station:</span>
            <div className={`mt-1 space-y-2 ${validation.missingFields.includes('station') ? 'text-red-600' : ''}`}>
              {data?.station ? (
                <>
                  {renderField('Description', data.station.description)}
                  {renderField('Balance', data.station.balance)}
                </>
              ) : (
                <span className="text-red-600">Station assessment not documented</span>
              )}
            </div>
          </div>
        </div>
      );

    case 'assessment':
      return (
        <div className="space-y-4">
          {renderField('Diagnosis/Assessment', data?.diagnosisAssessment, 'diagnosisAssessment')}
          
          {data?.medicalSourceStatement && (
            <div>
              <span className="text-sm font-medium text-gray-700">Medical Source Statement:</span>
              <div className="mt-1 space-y-2">
                {renderField('Abilities', data.medicalSourceStatement.abilities)}
                {renderField('Understanding, Memory, and Concentration', data.medicalSourceStatement.understandingMemoryConcentration)}
                {renderField('Limitations', data.medicalSourceStatement.limitations)}
              </div>
            </div>
          )}
          
          {renderField('Recommendations', data?.recommendations)}
          {renderField('Imaging Reviewed', data?.imagingReviewed)}
          {renderField('Medical Records Review Statement', data?.medicalRecordsReviewStatement)}
          
          {data?.examinerInfo && (
            <div>
              <span className="text-sm font-medium text-gray-700">Examiner Information:</span>
              <div className="mt-1 space-y-1">
                {renderField('Examiner', data.examinerInfo.name)}
                {renderField('Facility', data.examinerInfo.facility)}
                {renderField('Date', data.examinerInfo.date)}
              </div>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="text-gray-500 italic">
          No data available for this section
        </div>
      );
  }
}
