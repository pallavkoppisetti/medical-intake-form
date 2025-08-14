import { useState, useEffect } from 'react';
import { useMultiStepForm } from '../contexts/MultiStepFormContext';
import { PDFGeneratorService } from '../services/PDFGeneratorService';
import { savePreviewAsPDF } from '../utils/printUtils';
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
  ClipboardList,
  TestTube,
  Printer
} from 'lucide-react';
import { toast } from 'sonner';
import PDFTemplatePreview from './PDFTemplatePreview';

interface FormReviewAndGenerateProps {
  className?: string;
}

interface SectionValidation {
  isComplete: boolean;
  missingFields: string[];
  progress: number;
}

export function FormReviewAndGenerate({ className = '' }: FormReviewAndGenerateProps) {
  const { state, goToStep, updateSection, canNavigateToStep } = useMultiStepForm();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    // Invalidate the generated PDF when form data changes
    setGeneratedPdfBlob(null);
  }, [state.formData]);

  // Development mode check
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

  // Step mapping for navigation - matching FORM_STEPS IDs
  const stepIdToNumber: Record<string, number> = {
    'header': 0,
    'history': 1,
    'functionalStatus': 2,
    'physicalExam': 3,
    'rangeOfMotion': 4,
    'gaitStation': 5,
    'assessment': 6
  };

  // Sample test data for development testing
  const getSampleData = () => ({
    header: {
      claimantName: "Jane Doe",
      dateOfBirth: "01/15/1980",
      examDate: "08/12/2025",
      caseNumber: "DDS-2024-12345",
      chiefComplaint: "Chronic low back pain with left lower extremity radiculopathy"
    },
    history: {
      historyOfPresentIllness: "The claimant reports a 2-year history of chronic low back pain that began following a work-related lifting injury in January 2023. The pain is described as constant, aching, and radiating down the left leg to the knee. Pain intensity ranges from 6-8/10 on worst days and 4-5/10 on best days. Pain is exacerbated by prolonged sitting, standing more than 30 minutes, or walking more than 1-2 blocks. The claimant reports taking over-the-counter ibuprofen with minimal relief. Previous treatment includes physical therapy for 6 weeks with temporary improvement. MRI lumbar spine from March 2024 showed L4-L5 disc herniation with left neural foraminal narrowing.",
      age: 45,
      gender: "Female",
      reviewOfSystems: "Positive for low back pain, left leg numbness and tingling, difficulty with prolonged walking. Negative for fever, weight loss, bowel/bladder dysfunction, saddle anesthesia, or progressive neurological deficits. No recent changes in pain pattern or severity.",
      pastMedicalHistory: ["Hypertension (controlled with medication)", "Diabetes mellitus type 2 (diet controlled)", "Lumbar disc herniation L4-L5"],
      pastSurgicalHistory: ["Appendectomy (1998)"],
      medications: ["Ibuprofen 600mg TID PRN pain", "Metformin 500mg BID", "Lisinopril 10mg daily"],
      allergies: ["NKDA (No Known Drug Allergies)", "Environmental allergies to pollen"],
      socialHistory: ["Former smoker (quit 3 years ago, 15 pack-year history)", "Occasional alcohol use (1-2 drinks per week)", "Currently unemployed due to back injury", "Previously worked as warehouse supervisor for 12 years"],
      familyHistory: ["Father deceased at age 68 from heart disease", "Mother living with diabetes and hypertension"]
    },
    functionalStatus: {
      dominantHand: "Right" as const,
      sittingWorstDay: "30 minutes before significant pain increase and need to change position",
      sittingBestDay: "45-60 minutes with frequent position changes and lumbar support",
      standingWorstDay: "15-20 minutes before significant pain and need to sit or lean",
      standingBestDay: "30-45 minutes with frequent weight shifting and short breaks",
      walkingWorstDay: "1-2 blocks before significant pain and leg symptoms",
      walkingBestDay: "3-4 blocks with rest breaks as needed",
      cookingMealPrep: "Able to prepare simple meals but requires frequent breaks. Unable to stand for extended meal preparation.",
      groceryShoppingWorstDay: "Requires shopping cart for support, can shop for 15-20 minutes before needing to rest",
      groceryShoppingBestDay: "Can complete light grocery shopping in 30-45 minutes with cart support",
      drivingWorstDay: "20-30 minutes before significant back pain and stiffness",
      drivingBestDay: "45-60 minutes with lumbar support and frequent position adjustments",
      bathingShowering: "Independent but requires shower chair for longer showers",
      dressing: "Independent with lower extremity dressing but slower due to back stiffness",
      personalFinances: "Independent with no limitations"
    },
    physicalExam: {
      vitalSigns: {
        bloodPressure: { systolic: 128, diastolic: 82 },
        heartRate: 78,
        temperature: 98.4,
        weight: 155,
        height: 64,
        oxygenSaturation: "98%",
        visualAcuity: {
          right: { uncorrected: "20/25", corrected: "20/20" },
          left: { uncorrected: "20/25", corrected: "20/20" }
        }
      },
      generalAppearance: "Pleasant, cooperative 45-year-old female in no acute distress. Appears stated age. Well-groomed and appropriately dressed.",
      cardiovascular: "Regular rate and rhythm, no murmurs, rubs, or gallops appreciated",
      pulmonary: "Clear to auscultation bilaterally, no wheezes, rales, or rhonchi",
      musculoskeletal: "Antalgic gait favoring left lower extremity. Lumbar lordosis flattened. Paraspinal muscle spasm noted L3-S1 bilaterally, left greater than right.",
      neurological: "Alert and oriented x3. Cranial nerves II-XII grossly intact. Decreased sensation to light touch in L5 dermatome distribution on left.",
      psychiatric: "Appropriate mood and affect. No evidence of cognitive impairment.",
      // Complete neuromuscular strength data (all 5/5 normal)
      neuromuscularStrength: {
        rightUpperExtremity: 5,
        leftUpperExtremity: 5,
        rightLowerExtremity: 5,
        leftLowerExtremity: 5,
        rightGrip: 5,
        leftGrip: 5
      },
      // Fine & gross manipulative skills data
      fineGrossManipulativeSkills: {
        buttoning: { left: 5, right: 5 },
        zipping: { left: 5, right: 5 },
        pickingupcoin: { left: 5, right: 5 },
        tyingshoelaces: { left: 5, right: 5 }
      },
      // Reflexes data (all 2+ normal)
      reflexes: {
        biceps: { left: "2+", right: "2+" },
        triceps: { left: "2+", right: "2+" },
        knee: { left: "2+", right: "2+" },
        achilles: { left: "2+", right: "2+" }
      }
    },
    rangeOfMotion: {
      // Complete cervical spine with normal ranges
      cervicalSpine: {
        flexion: { active: 60, passive: 60 },
        extension: { active: 60, passive: 60 },
        lateralFlexionLeft: { active: 45, passive: 45 },
        lateralFlexionRight: { active: 45, passive: 45 },
        rotationLeft: { active: 80, passive: 80 },
        rotationRight: { active: 80, passive: 80 }
      },
      // Lumbar spine with some limitation due to condition
      lumbarSpine: {
        flexion: { active: 35, passive: 40 },
        extension: { active: 15, passive: 20 },
        lateralFlexionLeft: { active: 10, passive: 15 },
        lateralFlexionRight: { active: 20, passive: 25 }
      },
      // Complete bilateral joint measurements
      shoulders: {
        left: {
          flexion: { active: 180, passive: 180 },
          extension: { active: 60, passive: 60 },
          abduction: { active: 180, passive: 180 },
          adduction: { active: 50, passive: 50 },
          internalrotation: { active: 90, passive: 90 },
          externalrotation: { active: 90, passive: 90 }
        },
        right: {
          flexion: { active: 180, passive: 180 },
          extension: { active: 60, passive: 60 },
          abduction: { active: 180, passive: 180 },
          adduction: { active: 50, passive: 50 },
          internalrotation: { active: 90, passive: 90 },
          externalrotation: { active: 90, passive: 90 }
        }
      },
      elbows: {
        left: {
          flexion: { active: 150, passive: 150 },
          pronation: { active: 80, passive: 80 },
          supination: { active: 80, passive: 80 }
        },
        right: {
          flexion: { active: 150, passive: 150 },
          pronation: { active: 80, passive: 80 },
          supination: { active: 80, passive: 80 }
        }
      },
      wrists: {
        left: {
          flexion: { active: 80, passive: 80 },
          extension: { active: 70, passive: 70 },
          ulnardeviation: { active: 30, passive: 30 },
          radialdeviation: { active: 20, passive: 20 }
        },
        right: {
          flexion: { active: 80, passive: 80 },
          extension: { active: 70, passive: 70 },
          ulnardeviation: { active: 30, passive: 30 },
          radialdeviation: { active: 20, passive: 20 }
        }
      },
      hips: {
        left: {
          flexion: { active: 120, passive: 120 },
          extension: { active: 30, passive: 30 },
          abduction: { active: 45, passive: 45 },
          adduction: { active: 30, passive: 30 },
          internalrotation: { active: 45, passive: 45 },
          externalrotation: { active: 45, passive: 45 }
        },
        right: {
          flexion: { active: 120, passive: 120 },
          extension: { active: 30, passive: 30 },
          abduction: { active: 45, passive: 45 },
          adduction: { active: 30, passive: 30 },
          internalrotation: { active: 45, passive: 45 },
          externalrotation: { active: 45, passive: 45 }
        }
      },
      knees: {
        left: {
          flexion: { active: 135, passive: 135 },
          extension: { active: 0, passive: 0 }
        },
        right: {
          flexion: { active: 135, passive: 135 },
          extension: { active: 0, passive: 0 }
        }
      },
      ankles: {
        left: {
          dorsiflexion: { active: 20, passive: 20 },
          plantarflexion: { active: 50, passive: 50 },
          inversion: { active: 35, passive: 35 },
          eversion: { active: 15, passive: 15 }
        },
        right: {
          dorsiflexion: { active: 20, passive: 20 },
          plantarflexion: { active: 50, passive: 50 },
          inversion: { active: 35, passive: 35 },
          eversion: { active: 15, passive: 15 }
        }
      }
    },
    gaitStation: {
      // Degrees of Difficulty in Performance
      performance: {
        examinationTable: "able to perform with no difficulty",
        walkingOnHeels: "able to perform",
        walkingOnToes: "able to perform",
        squattingRising: "able to perform",
        fingerToNose: "intact",
        straightLegRaise: "Negative"
      },
      // Gait description
      gait: {
        description: "Normal gait and normal station"
      },
      // Assistive device information
      assistiveDevice: {
        type: "does not use any",
        medicalConditions: "N/A",
        necessity: "Patient ambulates independently without assistive devices. No current need for mobility aids."
      },
      // Patient cooperation
      patientCooperation: true
    },
    assessment: {
      diagnosisAssessment: [
        "Chronic low back pain, lumbar region",
        "Lumbar disc herniation L4-L5",
        "Left L5 radiculopathy",
        "Muscle spasm, lumbar region"
      ],
      medicalSourceStatement: {
        abilities: "stand, walk, sit, lift, carry, push, pull, reach, handle, finger, and feel within normal limits. Claimant demonstrates good upper extremity strength and dexterity. Fine motor skills are intact bilaterally. Cognitive function appears normal with good understanding and memory.",
        understandingMemoryConcentration: "Normal",
        limitations: "Sitting tolerance limited to 30-60 minutes due to increased low back pain. Standing tolerance limited to 15-45 minutes before requiring position change. Walking tolerance limited to 1-4 blocks before onset of back and leg symptoms. Lifting should be limited to 20 pounds maximum. Prolonged static positioning not recommended. Frequent position changes required during work activities."
      },
      recommendations: "Continue current conservative management with NSAIDs as needed. Consider referral to pain management for evaluation of epidural steroid injection if symptoms persist. Physical therapy for core strengthening and postural training may be beneficial. Ergonomic assessment recommended for future work activities. Return to modified work duties may be appropriate with above-mentioned restrictions.",
      examinerInfo: {
        name: "Dr. FNAME LNAME",
        facility: "EZMEDTECH Health & Wellness Center",
        date: "August 12, 2025"
      }
    }
  });

  // Test function to populate sample data and generate PDF
  const handleTestWithSampleData = async () => {
    try {
      const sampleData = getSampleData();
      
      // Populate all form sections with sample data
      updateSection('header', sampleData.header);
      updateSection('history', sampleData.history);
      updateSection('functionalStatus', sampleData.functionalStatus);
      updateSection('physicalExam', sampleData.physicalExam);
      updateSection('rangeOfMotion', sampleData.rangeOfMotion);
      updateSection('gaitStation', sampleData.gaitStation);
      updateSection('assessment', sampleData.assessment);
      
      toast.success('Sample data loaded successfully!', {
        description: 'All form sections have been populated with test data.',
        duration: 2000,
      });
      
      // Wait a moment for state to update, then generate PDF
      setTimeout(async () => {
        await handleDownloadPDF();
        toast.success('Test PDF generated!', {
          description: 'Sample CE Exam PDF has been downloaded for format verification.',
          duration: 3000,
        });
      }, 500);
      
    } catch (error) {
      console.error('Error in test data population:', error);
      toast.error('Failed to populate test data', {
        description: 'Please try again or check console for details.',
        duration: 5000,
      });
    }
  };

  // Validate form sections
  const validateSections = (): Record<string, SectionValidation> => {
    const { formData } = state;
    
    return {
      header: validateHeaderSection(formData.header),
      history: validateHistorySection(formData.history),
      functionalStatus: validateFunctionalStatusSection(formData.functionalStatus),
      physicalExam: validatePhysicalExamSection(formData.physicalExam),
      rangeOfMotion: validateRangeOfMotionSection(formData.rangeOfMotion),
      gaitStation: validateGaitStationSection(formData.gaitStation),
      assessment: validateAssessmentSection(formData.assessment)
    };
  };

  const sectionValidation = validateSections();

  // Generate PDF using the PDFGeneratorService (legacy)
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      const pdfGenerator = new PDFGeneratorService();
      const pdfBlob = pdfGenerator.generatePDF(state.formData);
      setGeneratedPdfBlob(pdfBlob);
      
      toast.success('PDF generated successfully!', {
        description: 'Your CE Exam report has been generated and is ready for download.',
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

  // New: Print-based PDF generation for perfect fidelity
  const handlePrintPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      const previewElement = document.getElementById('pdf-preview-content');
      if (!previewElement) {
        toast.error('PDF Preview not found', {
          description: 'Please ensure the preview is visible before generating PDF.',
          duration: 3000,
        });
        return;
      }
      
      await savePreviewAsPDF(previewElement as HTMLElement, state.formData);
      
      toast.success('PDF ready for download!', {
        description: 'Use your browser\'s print dialog to save as PDF for perfect fidelity.',
        duration: 5000,
      });
      
    } catch (error) {
      console.error('Error printing PDF:', error);
      toast.error('Failed to generate PDF', {
        description: 'Please try again or contact support.',
        duration: 5000,
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Download PDF with formatted filename
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      
      const pdfBlob = generatedPdfBlob ?? await handleGeneratePDF();
      if (!pdfBlob) {
        toast.error('PDF not available to download.');
        return;
      }

      const pdfGenerator = new PDFGeneratorService();
      const filename = pdfGenerator.getPDFFilename(state.formData);
      
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
      console.log(`Attempting to navigate to step: ${stepId} (step ${stepNumber})`);
      console.log('Current step:', state.currentStep);
      console.log('Visited steps:', Array.from(state.visitedSteps));
      console.log('Can navigate to step:', canNavigateToStep?.(stepNumber));
      
      // Try to navigate
      const success = goToStep(stepNumber);
      
      if (success) {
        console.log(`Successfully navigated to step ${stepNumber}`);
        toast.success(`Navigated to ${stepId} for editing`);
      } else {
        console.warn(`Navigation failed to step ${stepNumber}`);
        toast.error(`Unable to navigate to ${stepId}. Please try using the progress bar above.`);
      }
    } else {
      console.warn(`Unknown step ID: ${stepId}`);
      console.log('Available step IDs:', Object.keys(stepIdToNumber));
      toast.error(`Invalid section: ${stepId}`);
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
      stepId: 'functionalStatus',
      data: state.formData.functionalStatus,
      validation: sectionValidation.functionalStatus
    },
    {
      id: 'physicalExam',
      title: 'Physical Examination',
      icon: Stethoscope,
      stepId: 'physicalExam',
      data: state.formData.physicalExam,
      validation: sectionValidation.physicalExam
    },
    {
      id: 'rangeOfMotion',
      title: 'Range of Motion',
      icon: Move,
      stepId: 'rangeOfMotion',
      data: state.formData.rangeOfMotion,
      validation: sectionValidation.rangeOfMotion
    },
    {
      id: 'gaitStation',
      title: 'Gait and Station',
      icon: RotateCcw,
      stepId: 'gaitStation',
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
    <div className={`bg-gray-100 min-h-screen py-8 ${className}`}>
      {/* Print Preview Container */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Print Preview Paper */}
        <div className="bg-white shadow-2xl border border-gray-300 rounded-lg overflow-hidden print:shadow-none print:border-none print:rounded-none">
          {/* Print Preview Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-8 py-6 print:bg-white print:border-b-gray-400">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                FLORIDA DIVISION OF DISABILITY DETERMINATION
              </h1>
              <h2 className="text-xl font-semibold text-gray-700">
                CONSULTATIVE EXAMINATION REPORT
              </h2>
              <div className="w-32 h-px bg-gray-400 mx-auto my-4" />
              <p className="text-sm text-gray-600 italic max-w-3xl mx-auto">
                This examination is being performed at the request of the Florida Division of Disability 
                Determination for disability evaluation purposes only.
              </p>
            </div>
          </div>

          {/* Print Preview Content */}
          <div className="px-8 py-6 space-y-8">
            {/* Development Notice */}
            {isDevelopment && (
              <Card className="border-2 border-orange-200 bg-orange-50/50 print:hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <TestTube className="h-5 w-5" />
                    Development Mode - Test Feature Available
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-700">
                    <strong>Test with Sample Data</strong> button is available in the floating action bar. 
                    This will populate all form sections with realistic medical examination data and automatically 
                    generate a PDF to verify the CE Exam format matches requirements exactly.
                  </p>
                  <div className="mt-2 text-xs text-orange-600">
                    Sample patient: Jane Doe (DOB: 01/15/1980, Case: DDS-2024-12345) with chronic low back pain and radiculopathy.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Overview */}
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
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
            <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3 space-x-2 flex items-center print:hidden">
              {/* Test Button - Only visible in development */}
              {isDevelopment && (
                <Button
                  onClick={handleTestWithSampleData}
                  variant="secondary"
                  size="sm"
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Test with Sample Data
                </Button>
              )}
              
              <Button
                onClick={() => setShowPdfPreview(!showPdfPreview)}
                variant="outline"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                {showPdfPreview ? 'Hide Preview' : 'Show Live Preview'}
              </Button>
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
                Generate PDF (Legacy)
              </Button>
              
              <Button
                onClick={handlePrintPDF}
                disabled={isGeneratingPDF || overallCompletion < 50}
                variant="default"
                size="sm"
                title="Print PDF - Perfect fidelity to preview"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Printer className="h-4 w-4 mr-2" />
                )}
                Print as PDF
              </Button>
              
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading || overallCompletion < 50}
                variant="secondary"
                size="sm"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download PDF (Legacy)
              </Button>
            </div>

            {/* PDF Live Preview */}
            {showPdfPreview && (
              <Card className="border-2 border-gray-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <FileText className="h-5 w-5" />
                    Live PDF Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PDFTemplatePreview formData={state.formData} />
                </CardContent>
              </Card>
            )}

            {/* Form Sections */}
            <div className="space-y-6">
              {sections.map((section) => {
                const IconComponent = section.icon;
                const validation = section.validation;
                
                return (
                  <Card key={section.id} className="print:break-inside-avoid shadow-lg border-gray-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        {section.title.toUpperCase()}
                        {validation.isComplete ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                        )}
                      </CardTitle>
                      
                      <div className="flex items-center gap-2 print:hidden">
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
                    
                    <CardContent className="pt-6">
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
        </div>
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

          {data?.reviewOfSystems && (
            <div>
              <span className="text-sm font-medium text-gray-700">Review of Systems:</span>
              <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                {data.reviewOfSystems}
              </div>
            </div>
          )}

          {/* Tag-based fields */}
          {/* {data?.pastMedicalHistory && data.pastMedicalHistory.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Past Medical History:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {data.pastMedicalHistory.map((item: string, index: number) => (
                  <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )} */}

          {Array.isArray(data?.pastMedicalHistory) && data.pastMedicalHistory.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-700">Past Medical History:</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {data.pastMedicalHistory.map((item: string, index: number) => (
                <span key={index} className="inline-block rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

          {data?.pastSurgicalHistory && data.pastSurgicalHistory.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Past Surgical History:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {data.pastSurgicalHistory.map((item: string, index: number) => (
                  <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data?.medications && data.medications.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Medications:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {data.medications.map((item: string, index: number) => (
                  <span key={index} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data?.allergies && data.allergies.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Allergies:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {data.allergies.map((item: string, index: number) => (
                  <span key={index} className="inline-block px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data?.socialHistory && data.socialHistory.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Social History:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {data.socialHistory.map((item: string, index: number) => (
                  <span key={index} className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data?.familyHistory && data.familyHistory.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Family History:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {data.familyHistory.map((item: string, index: number) => (
                  <span key={index} className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
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
          
          {/* Neuromuscular Strength */}
          {data?.neuromuscularStrength && (
            <div>
              <span className="text-sm font-medium text-gray-700">Neuromuscular Strength:</span>
              <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderField('Right Upper Extremity', `${data.neuromuscularStrength.rightUpperExtremity || 'N/A'}/5`)}
                {renderField('Left Upper Extremity', `${data.neuromuscularStrength.leftUpperExtremity || 'N/A'}/5`)}
                {renderField('Right Lower Extremity', `${data.neuromuscularStrength.rightLowerExtremity || 'N/A'}/5`)}
                {renderField('Left Lower Extremity', `${data.neuromuscularStrength.leftLowerExtremity || 'N/A'}/5`)}
                {renderField('Right Grip', `${data.neuromuscularStrength.rightGrip || 'N/A'}/5`)}
                {renderField('Left Grip', `${data.neuromuscularStrength.leftGrip || 'N/A'}/5`)}
              </div>
              {data.neuromuscularStrength.dexterityAssessment && (
                <div className="mt-2">
                  {renderField('Dexterity Assessment', data.neuromuscularStrength.dexterityAssessment)}
                </div>
              )}
            </div>
          )}
          
          {/* Fine & Gross Manipulative Skills */}
          {data?.fineGrossManipulativeSkills && (
            <div>
              <span className="text-sm font-medium text-gray-700">Fine & Gross Manipulative Skills:</span>
              <div className="mt-1 space-y-2">
                {data.fineGrossManipulativeSkills.buttoning && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium">Buttoning:</span>
                    <span className="ml-2">Left: {data.fineGrossManipulativeSkills.buttoning.left || 'N/A'}/5, Right: {data.fineGrossManipulativeSkills.buttoning.right || 'N/A'}/5</span>
                  </div>
                )}
                {data.fineGrossManipulativeSkills.zipping && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium">Zipping:</span>
                    <span className="ml-2">Left: {data.fineGrossManipulativeSkills.zipping.left || 'N/A'}/5, Right: {data.fineGrossManipulativeSkills.zipping.right || 'N/A'}/5</span>
                  </div>
                )}
                {data.fineGrossManipulativeSkills.pickingUpCoin && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium">Picking up a Coin:</span>
                    <span className="ml-2">Left: {data.fineGrossManipulativeSkills.pickingUpCoin.left || 'N/A'}/5, Right: {data.fineGrossManipulativeSkills.pickingUpCoin.right || 'N/A'}/5</span>
                  </div>
                )}
                {data.fineGrossManipulativeSkills.tyingShoelaces && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium">Tying Shoelaces:</span>
                    <span className="ml-2">Left: {data.fineGrossManipulativeSkills.tyingShoelaces.left || 'N/A'}/5, Right: {data.fineGrossManipulativeSkills.tyingShoelaces.right || 'N/A'}/5</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Deep Tendon Reflexes */}
          {data?.reflexes && (
            <div>
              <span className="text-sm font-medium text-gray-700">Deep Tendon Reflexes:</span>
              <div className="mt-1 space-y-2">
                {data.reflexes.biceps && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium">Biceps:</span>
                    <span className="ml-2">Left: {data.reflexes.biceps.left || 'N/A'}, Right: {data.reflexes.biceps.right || 'N/A'}</span>
                  </div>
                )}
                {data.reflexes.triceps && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium">Triceps:</span>
                    <span className="ml-2">Left: {data.reflexes.triceps.left || 'N/A'}, Right: {data.reflexes.triceps.right || 'N/A'}</span>
                  </div>
                )}
                {data.reflexes.knee && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium">Knee (Patellar):</span>
                    <span className="ml-2">Left: {data.reflexes.knee.left || 'N/A'}, Right: {data.reflexes.knee.right || 'N/A'}</span>
                  </div>
                )}
                {data.reflexes.achilles && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium">Achilles:</span>
                    <span className="ml-2">Left: {data.reflexes.achilles.left || 'N/A'}, Right: {data.reflexes.achilles.right || 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );

    case 'rangeOfMotion':
      return (
        <div className="space-y-4">
          {data?.effortOnExam && (
            <div>
              <span className="text-sm font-medium text-gray-700">Effort on Examination:</span>
              <span className="ml-2 text-gray-900 font-medium">{data.effortOnExam}</span>
            </div>
          )}

          {data?.cervicalSpine && (
            <div>
              <span className="text-sm font-medium text-gray-700">Cervical Spine:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {data.cervicalSpine.forwardFlexion && (
                    <div>Forward Flexion: {data.cervicalSpine.forwardFlexion}° (0-60°)</div>
                  )}
                  {data.cervicalSpine.extension && (
                    <div>Extension: {data.cervicalSpine.extension}° (0-60°)</div>
                  )}
                  {data.cervicalSpine.lateralFlexionRight && (
                    <div>Lateral Flexion R: {data.cervicalSpine.lateralFlexionRight}° (0-45°)</div>
                  )}
                  {data.cervicalSpine.lateralFlexionLeft && (
                    <div>Lateral Flexion L: {data.cervicalSpine.lateralFlexionLeft}° (0-45°)</div>
                  )}
                  {data.cervicalSpine.rotationRight && (
                    <div>Rotation R: {data.cervicalSpine.rotationRight}° (0-80°)</div>
                  )}
                  {data.cervicalSpine.rotationLeft && (
                    <div>Rotation L: {data.cervicalSpine.rotationLeft}° (0-80°)</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {data?.lumbarSpine && (
            <div>
              <span className="text-sm font-medium text-gray-700">Lumbar Spine:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {data.lumbarSpine.forwardFlexion && (
                    <div>Forward Flexion: {data.lumbarSpine.forwardFlexion}° (0-90°)</div>
                  )}
                  {data.lumbarSpine.extension && (
                    <div>Extension: {data.lumbarSpine.extension}° (0-25°)</div>
                  )}
                  {data.lumbarSpine.lateralFlexionRight && (
                    <div>Lateral Flexion R: {data.lumbarSpine.lateralFlexionRight}° (0-25°)</div>
                  )}
                  {data.lumbarSpine.lateralFlexionLeft && (
                    <div>Lateral Flexion L: {data.lumbarSpine.lateralFlexionLeft}° (0-25°)</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {data?.shoulders && (
            <div>
              <span className="text-sm font-medium text-gray-700">Shoulders:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded">
                <div className="space-y-2">
                  {data.shoulders.left && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Left Shoulder:</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm">
                        {data.shoulders.left.forwardFlexion && (
                          <div>Forward Flexion: {data.shoulders.left.forwardFlexion}°</div>
                        )}
                        {data.shoulders.left.extension && (
                          <div>Extension: {data.shoulders.left.extension}°</div>
                        )}
                        {data.shoulders.left.abduction && (
                          <div>Abduction: {data.shoulders.left.abduction}°</div>
                        )}
                        {data.shoulders.left.adduction && (
                          <div>Adduction: {data.shoulders.left.adduction}°</div>
                        )}
                        {data.shoulders.left.internalRotation && (
                          <div>Internal Rotation: {data.shoulders.left.internalRotation}°</div>
                        )}
                        {data.shoulders.left.externalRotation && (
                          <div>External Rotation: {data.shoulders.left.externalRotation}°</div>
                        )}
                      </div>
                    </div>
                  )}
                  {data.shoulders.right && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Right Shoulder:</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm">
                        {data.shoulders.right.forwardFlexion && (
                          <div>Forward Flexion: {data.shoulders.right.forwardFlexion}°</div>
                        )}
                        {data.shoulders.right.extension && (
                          <div>Extension: {data.shoulders.right.extension}°</div>
                        )}
                        {data.shoulders.right.abduction && (
                          <div>Abduction: {data.shoulders.right.abduction}°</div>
                        )}
                        {data.shoulders.right.adduction && (
                          <div>Adduction: {data.shoulders.right.adduction}°</div>
                        )}
                        {data.shoulders.right.internalRotation && (
                          <div>Internal Rotation: {data.shoulders.right.internalRotation}°</div>
                        )}
                        {data.shoulders.right.externalRotation && (
                          <div>External Rotation: {data.shoulders.right.externalRotation}°</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {data?.elbows && (
            <div>
              <span className="text-sm font-medium text-gray-700">Elbows:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded">
                <div className="space-y-2">
                  {data.elbows.left && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Left Elbow:</div>
                      <div className="grid grid-cols-3 gap-1 text-sm">
                        {data.elbows.left.flexion && (
                          <div>Flexion: {data.elbows.left.flexion}°</div>
                        )}
                        {data.elbows.left.extension && (
                          <div>Extension: {data.elbows.left.extension}°</div>
                        )}
                        {data.elbows.left.pronation && (
                          <div>Pronation: {data.elbows.left.pronation}°</div>
                        )}
                        {data.elbows.left.supination && (
                          <div>Supination: {data.elbows.left.supination}°</div>
                        )}
                      </div>
                    </div>
                  )}
                  {data.elbows.right && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Right Elbow:</div>
                      <div className="grid grid-cols-3 gap-1 text-sm">
                        {data.elbows.right.flexion && (
                          <div>Flexion: {data.elbows.right.flexion}°</div>
                        )}
                        {data.elbows.right.extension && (
                          <div>Extension: {data.elbows.right.extension}°</div>
                        )}
                        {data.elbows.right.pronation && (
                          <div>Pronation: {data.elbows.right.pronation}°</div>
                        )}
                        {data.elbows.right.supination && (
                          <div>Supination: {data.elbows.right.supination}°</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {data?.wrists && (
            <div>
              <span className="text-sm font-medium text-gray-700">Wrists:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded">
                <div className="space-y-2">
                  {data.wrists.left && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Left Wrist:</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-sm">
                        {data.wrists.left.flexion && (
                          <div>Flexion: {data.wrists.left.flexion}°</div>
                        )}
                        {data.wrists.left.extension && (
                          <div>Extension: {data.wrists.left.extension}°</div>
                        )}
                        {data.wrists.left.radialDeviation && (
                          <div>Radial Deviation: {data.wrists.left.radialDeviation}°</div>
                        )}
                        {data.wrists.left.ulnarDeviation && (
                          <div>Ulnar Deviation: {data.wrists.left.ulnarDeviation}°</div>
                        )}
                      </div>
                    </div>
                  )}
                  {data.wrists.right && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Right Wrist:</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-sm">
                        {data.wrists.right.flexion && (
                          <div>Flexion: {data.wrists.right.flexion}°</div>
                        )}
                        {data.wrists.right.extension && (
                          <div>Extension: {data.wrists.right.extension}°</div>
                        )}
                        {data.wrists.right.radialDeviation && (
                          <div>Radial Deviation: {data.wrists.right.radialDeviation}°</div>
                        )}
                        {data.wrists.right.ulnarDeviation && (
                          <div>Ulnar Deviation: {data.wrists.right.ulnarDeviation}°</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {data?.hands && (
            <div>
              <span className="text-sm font-medium text-gray-700">Hands:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded">
                <div className="space-y-2">
                  {data.hands.left && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Left Hand:</div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        {data.hands.left.thumbOpposition && (
                          <div>Thumb Opposition: {data.hands.left.thumbOpposition}°</div>
                        )}
                        {data.hands.left.fingerFlexion && (
                          <div>Finger Flexion: {data.hands.left.fingerFlexion}°</div>
                        )}
                      </div>
                    </div>
                  )}
                  {data.hands.right && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Right Hand:</div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        {data.hands.right.thumbOpposition && (
                          <div>Thumb Opposition: {data.hands.right.thumbOpposition}°</div>
                        )}
                        {data.hands.right.fingerFlexion && (
                          <div>Finger Flexion: {data.hands.right.fingerFlexion}°</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {data?.hips && (
            <div>
              <span className="text-sm font-medium text-gray-700">Hips:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded">
                <div className="space-y-2">
                  {data.hips.left && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Left Hip:</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm">
                        {data.hips.left.flexion && (
                          <div>Flexion: {data.hips.left.flexion}°</div>
                        )}
                        {data.hips.left.extension && (
                          <div>Extension: {data.hips.left.extension}°</div>
                        )}
                        {data.hips.left.abduction && (
                          <div>Abduction: {data.hips.left.abduction}°</div>
                        )}
                        {data.hips.left.adduction && (
                          <div>Adduction: {data.hips.left.adduction}°</div>
                        )}
                        {data.hips.left.internalRotation && (
                          <div>Internal Rotation: {data.hips.left.internalRotation}°</div>
                        )}
                        {data.hips.left.externalRotation && (
                          <div>External Rotation: {data.hips.left.externalRotation}°</div>
                        )}
                      </div>
                    </div>
                  )}
                  {data.hips.right && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Right Hip:</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm">
                        {data.hips.right.flexion && (
                          <div>Flexion: {data.hips.right.flexion}°</div>
                        )}
                        {data.hips.right.extension && (
                          <div>Extension: {data.hips.right.extension}°</div>
                        )}
                        {data.hips.right.abduction && (
                          <div>Abduction: {data.hips.right.abduction}°</div>
                        )}
                        {data.hips.right.adduction && (
                          <div>Adduction: {data.hips.right.adduction}°</div>
                        )}
                        {data.hips.right.internalRotation && (
                          <div>Internal Rotation: {data.hips.right.internalRotation}°</div>
                        )}
                        {data.hips.right.externalRotation && (
                          <div>External Rotation: {data.hips.right.externalRotation}°</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {data?.knees && (
            <div>
              <span className="text-sm font-medium text-gray-700">Knees:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded">
                <div className="space-y-2">
                  {data.knees.left && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Left Knee:</div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        {data.knees.left.flexion && (
                          <div>Flexion: {data.knees.left.flexion}°</div>
                        )}
                        {data.knees.left.extension && (
                          <div>Extension: {data.knees.left.extension}°</div>
                        )}
                      </div>
                    </div>
                  )}
                  {data.knees.right && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Right Knee:</div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        {data.knees.right.flexion && (
                          <div>Flexion: {data.knees.right.flexion}°</div>
                        )}
                        {data.knees.right.extension && (
                          <div>Extension: {data.knees.right.extension}°</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {data?.ankles && (
            <div>
              <span className="text-sm font-medium text-gray-700">Ankles:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded">
                <div className="space-y-2">
                  {data.ankles.left && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Left Ankle:</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-sm">
                        {data.ankles.left.dorsiflexion && (
                          <div>Dorsiflexion: {data.ankles.left.dorsiflexion}°</div>
                        )}
                        {data.ankles.left.plantarflexion && (
                          <div>Plantarflexion: {data.ankles.left.plantarflexion}°</div>
                        )}
                        {data.ankles.left.inversion && (
                          <div>Inversion: {data.ankles.left.inversion}°</div>
                        )}
                        {data.ankles.left.eversion && (
                          <div>Eversion: {data.ankles.left.eversion}°</div>
                        )}
                      </div>
                    </div>
                  )}
                  {data.ankles.right && (
                    <div>
                      <div className="font-medium text-xs text-gray-600">Right Ankle:</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-sm">
                        {data.ankles.right.dorsiflexion && (
                          <div>Dorsiflexion: {data.ankles.right.dorsiflexion}°</div>
                        )}
                        {data.ankles.right.plantarflexion && (
                          <div>Plantarflexion: {data.ankles.right.plantarflexion}°</div>
                        )}
                        {data.ankles.right.inversion && (
                          <div>Inversion: {data.ankles.right.inversion}°</div>
                        )}
                        {data.ankles.right.eversion && (
                          <div>Eversion: {data.ankles.right.eversion}°</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(!data || Object.keys(data).length === 0) && (
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