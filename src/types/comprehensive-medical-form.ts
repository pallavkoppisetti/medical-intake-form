/**
 * Florida Division of Disability Determinations CE Exam Form Type Definitions
 * Exact structure matching the official CE exam form requirements
 */

// =======================
// HEADER SECTION
// =======================

export interface HeaderSection {
  claimantName: string;
  dateOfBirth: string;
  examDate: string;
  caseNumber: string;
  chiefComplaint: string;
  chiefComplaintTags: string[]; // Array of complaint tags
}

// =======================
// HISTORY SECTION
// =======================

export interface HistorySection {
  historyOfPresentIllness: string; // text area
  age: number;
  gender: string;
  reviewOfSystems?: string;
  pastMedicalHistory?: string[];
  pastSurgicalHistory?: string[];
  medications?: string[];
  allergies?: string[];
  socialHistory?: string[];
  familyHistory?: string[];
}

// =======================
// FUNCTIONAL STATUS SECTION
// =======================

export interface FunctionalStatus {
  dominantHand: 'Right' | 'Left';
  sittingWorstDay: string;
  sittingBestDay: string;
  standingWorstDay: string;
  standingBestDay: string;
  walkingWorstDay: string;
  walkingBestDay: string;
  cookingMealPrep: string;
  groceryShoppingWorstDay: string;
  groceryShoppingBestDay: string;
  drivingWorstDay: string;
  drivingBestDay: string;
  bathingShowering: string;
  dressing: string;
  personalFinances: string;
}

// =======================
// VITAL SIGNS
// =======================

export interface VitalSigns {
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  respiratoryRate?: number;
  temperature: number;
  weight: number;
  height: number;
  bmi?: number;
  oxygenSaturation?: string;
  visualAcuity?: {
    right: {
      uncorrected: string;
      corrected: string;
    };
    left: {
      uncorrected: string;
      corrected: string;
    };
  };
  handGripStrength?: {
    right: string;
    left: string;
  };
}

// =======================
// PHYSICAL EXAM SECTION
// =======================

export interface PhysicalExam {
  vitalSigns: VitalSigns;
  general?: string;
  eyes?: string;
  earsNoseThroat?: string;
  headNeck?: string;
  respiratory?: string;
  cardiovascular?: string;
  abdomen?: string;
  back?: string;
  skin?: string;
  musculoskeletal?: string;
  neurological?: string;
  psychiatry?: string;
  neuromuscularStrength?: NeuroMuscularStrength;
  fineGrossManipulativeSkills?: FineGrossManipulativeSkills;
  reflexes?: Reflexes;
}

export interface NeuroMuscularStrength {
  rightUpperExtremity?: number; // 0-5 scale
  leftUpperExtremity?: number;
  rightLowerExtremity?: number;
  leftLowerExtremity?: number;
  rightGrip?: number;
  leftGrip?: number;
  dexterityAssessment?: string;
}

export interface FineGrossManipulativeSkills {
  buttoning?: {
    left?: number; // 0-5 scale
    right?: number;
  };
  zipping?: {
    left?: number;
    right?: number;
  };
  pickingUpCoin?: {
    left?: number;
    right?: number;
  };
  tyingShoelaces?: {
    left?: number;
    right?: number;
  };
}

export interface Reflexes {
  biceps?: {
    right?: '0' | '1+' | '2+' | '3+' | '4+';
    left?: '0' | '1+' | '2+' | '3+' | '4+';
  };
  triceps?: {
    right?: '0' | '1+' | '2+' | '3+' | '4+';
    left?: '0' | '1+' | '2+' | '3+' | '4+';
  };
  knee?: {
    right?: '0' | '1+' | '2+' | '3+' | '4+';
    left?: '0' | '1+' | '2+' | '3+' | '4+';
  };
  achilles?: {
    right?: '0' | '1+' | '2+' | '3+' | '4+';
    left?: '0' | '1+' | '2+' | '3+' | '4+';
  };
}

// =======================
// RANGE OF MOTION SECTION
// =======================

export interface RangeOfMotion {
  effortOnExam?: 'Good' | 'Fair' | 'Poor';
  
  // Cervical Spine (exact CE Exam measurements)
  cervicalSpine?: {
    forwardFlexion: number;      // 0-60
    extension: number;           // 0-60
    lateralFlexionRight: number; // 0-45
    lateralFlexionLeft: number;  // 0-45
    rotationRight: number;       // 0-80
    rotationLeft: number;        // 0-80
  };
  
  // Lumbar Spine (exact CE Exam measurements)
  lumbarSpine?: {
    forwardFlexion: number;      // 0-90
    extension: number;           // 0-25
    lateralFlexionRight: number; // 0-25
    lateralFlexionLeft: number;  // 0-25
  };
  
  // Shoulders (bilateral measurements)
  shoulders?: {
    left: {
      flexion: number;           // 0-180
      extension: number;         // 0-60
      abduction: number;         // 0-180
      adduction: number;         // 0-50
      internalRotation: number;  // 0-90
      externalRotation: number;  // 0-90
    };
    right: {
      flexion: number;           // 0-180
      extension: number;         // 0-60
      abduction: number;         // 0-180
      adduction: number;         // 0-50
      internalRotation: number;  // 0-90
      externalRotation: number;  // 0-90
    };
  };
  
  // Elbows (bilateral measurements)
  elbows?: {
    left: {
      flexion: number;           // 0-150
      pronation: number;         // 0-80
      supination: number;        // 0-80
    };
    right: {
      flexion: number;           // 0-150
      pronation: number;         // 0-80
      supination: number;        // 0-80
    };
  };
  
  // Wrists (bilateral measurements)
  wrists?: {
    left: {
      flexion: number;           // 0-80
      extension: number;         // 0-70
      ulnarDeviation: number;    // 0-30
      radialDeviation: number;   // 0-20
    };
    right: {
      flexion: number;           // 0-80
      extension: number;         // 0-70
      ulnarDeviation: number;    // 0-30
      radialDeviation: number;   // 0-20
    };
  };
  
  // Hands (simplified for CE Exam)
  hands?: {
    left: {
      fingerFlexion: number;     // 0-90
      thumbOpposition: number;   // 0-100
    };
    right: {
      fingerFlexion: number;     // 0-90
      thumbOpposition: number;   // 0-100
    };
  };
  
  // Hips (bilateral measurements)
  hips?: {
    left: {
      flexion: number;           // 0-120
      extension: number;         // 0-30
      abduction: number;         // 0-45
      adduction: number;         // 0-30
      internalRotation: number;  // 0-45
      externalRotation: number;  // 0-45
    };
    right: {
      flexion: number;           // 0-120
      extension: number;         // 0-30
      abduction: number;         // 0-45
      adduction: number;         // 0-30
      internalRotation: number;  // 0-45
      externalRotation: number;  // 0-45
    };
  };
  
  // Knees (bilateral measurements)
  knees?: {
    left: {
      flexion: number;           // 0-135
      extension: number;         // 0-0 (normal)
    };
    right: {
      flexion: number;           // 0-135
      extension: number;         // 0-0 (normal)
    };
  };
  
  // Ankles (bilateral measurements)
  ankles?: {
    left: {
      dorsiflexion: number;      // 0-20
      plantarflexion: number;    // 0-50
      inversion: number;         // 0-35
      eversion: number;          // 0-15
    };
    right: {
      dorsiflexion: number;      // 0-20
      plantarflexion: number;    // 0-50
      inversion: number;         // 0-35
      eversion: number;          // 0-15
    };
  };
}

// =======================
// GAIT AND STATION SECTION
// =======================

export interface GaitStationPerformanceTests {
  gettingOnOffTable?: 'able' | 'unable';
  walkingOnHeels?: 'able' | 'unable';
  walkingOnToes?: 'able' | 'unable';
  squattingAndRising?: 'able' | 'unable';
  fingerToNose?: 'able' | 'unable';
  straightLegRaise?: 'positive' | 'negative';
}

export interface AssistiveDevice {
  gaitAssessment?: string;
  deviceType?: string;
  medicalConditions?: string;
  usageContext?: string[];
  medicalNecessity?: 'yes' | 'no';
  circumstancesOfUse?: string;
  patientCooperation?: 'yes' | 'no';
}

export interface GaitStation {
  performanceTests?: GaitStationPerformanceTests;
  assistiveDevice?: AssistiveDevice;
  additionalNotes?: string;
}

// =======================
// ASSESSMENT SECTION
// =======================

export interface Assessment {
  // Diagnosis/Assessment section
  diagnosisAssessment: string[];
  
  // Medical Source Statement
  medicalSourceStatement: {
    abilities: string;
    understandingMemoryConcentration: string;
    limitations: string;
  };
  
  // Recommendations
  recommendations: string;
  
  // Imaging Reviewed
  imagingReviewed: string;
  
  // Statement Re Review of Medical Records
  medicalRecordsReviewStatement: string;
  
  // Examiner Information
  examinerInfo: {
    name: string;
    facility: string;
    date: string;
  };
  
  // Digital Signature
  examinerSignature?: string; // base64 data URL
}

// =======================
// COMPLETE FLORIDA CE EXAM FORM
// =======================

export interface FloridaCEExamForm {
  header: HeaderSection;
  history: HistorySection;
  functionalStatus: FunctionalStatus;
  physicalExam: PhysicalExam;
  rangeOfMotion: RangeOfMotion;
  gaitStation: GaitStation;
  assessment: Assessment;
}

// =======================
// FORM VALIDATION TYPES
// =======================

export interface FormErrors {
  [key: string]: string | FormErrors;
}

export interface FormState {
  data: Partial<FloridaCEExamForm>;
  errors: FormErrors;
  isValid: boolean;
  currentStep: number;
  completedSteps: number[];
}

// =======================
// FORM STEP DEFINITIONS
// =======================

export enum FormSteps {
  inital = -1,
  HEADER = 0,
  HISTORY = 1,
  FUNCTIONAL_STATUS = 2,
  PHYSICAL_EXAM = 3,
  RANGE_OF_MOTION = 4,
  GAIT_STATION = 5,
  ASSESSMENT = 6,
  REVIEW = 7
}

export const FORM_STEP_LABELS = {
  [FormSteps.inital]: 'enter the scribble',
  [FormSteps.HEADER]: 'Header Information',
  [FormSteps.HISTORY]: 'Medical History',
  [FormSteps.FUNCTIONAL_STATUS]: 'Functional Status',
  [FormSteps.PHYSICAL_EXAM]: 'Physical Examination',
  [FormSteps.RANGE_OF_MOTION]: 'Range of Motion',
  [FormSteps.GAIT_STATION]: 'Gait & Station',
  [FormSteps.ASSESSMENT]: 'Assessment',
  [FormSteps.REVIEW]: 'Review & Submit'
};

// =======================
// BACKWARD COMPATIBILITY ALIASES
// =======================

export type CompleteMedicalIntakeForm = FloridaCEExamForm;

export interface BasicInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
}

export interface Allergy {
  allergen: string;
  reaction: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export default FloridaCEExamForm;
