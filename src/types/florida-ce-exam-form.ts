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
}

// =======================
// HISTORY SECTION
// =======================

export interface HistorySection {
  historyOfPresentIllness: string; // text area
  age: number;
  gender: string;
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
// MEDICAL INFO SECTION
// =======================

export interface MedicalInfo {
  currentMedications: string[];
  allergies: string[];
  surgicalHistory: string;
  familyHistory: string;
  socialHistory: string;
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
  respiratoryRate: number;
  temperature: number;
  weight: number;
  height: number;
  bmi?: number;
}

// =======================
// PHYSICAL EXAM SECTION
// =======================

export interface PhysicalExam {
  vitalSigns: VitalSigns;
  general: {
    appearance: string;
    alertness: string;
    cooperation: string;
  };
  heent: {
    head: string;
    eyes: string;
    ears: string;
    nose: string;
    throat: string;
  };
  cardiovascular: {
    heartSounds: string;
    murmurs: string;
    rhythm: string;
    pulses: string;
  };
  respiratory: {
    breathSounds: string;
    effort: string;
    symmetry: string;
  };
  abdomen: {
    inspection: string;
    palpation: string;
    bowelSounds: string;
  };
  musculoskeletal: {
    inspection: string;
    palpation: string;
    stability: string;
    deformities: string;
  };
  neurological: {
    mentalStatus: string;
    cranialNerves: string;
    motorExam: string;
    sensoryExam: string;
    reflexes: string;
    coordination: string;
    gait: string;
  };
  skin: {
    color: string;
    texture: string;
    lesions: string;
    scars: string;
  };
}

// =======================
// RANGE OF MOTION SECTION
// =======================

export interface RangeOfMotionMeasurement {
  flexion: number;
  extension: number;
  leftLateralFlexion?: number;
  rightLateralFlexion?: number;
  leftRotation?: number;
  rightRotation?: number;
}

export interface RangeOfMotion {
  cervicalSpine: {
    flexion: number;
    extension: number;
    leftLateralFlexion: number;
    rightLateralFlexion: number;
    leftRotation: number;
    rightRotation: number;
  };
  lumbarSpine: {
    flexion: number;
    extension: number;
    leftLateralFlexion: number;
    rightLateralFlexion: number;
    leftRotation: number;
    rightRotation: number;
  };
  shoulders: {
    left: {
      flexion: number;
      extension: number;
      abduction: number;
      adduction: number;
      internalRotation: number;
      externalRotation: number;
    };
    right: {
      flexion: number;
      extension: number;
      abduction: number;
      adduction: number;
      internalRotation: number;
      externalRotation: number;
    };
  };
  elbows: {
    left: {
      flexion: number;
      extension: number;
    };
    right: {
      flexion: number;
      extension: number;
    };
  };
  wrists: {
    left: {
      flexion: number;
      extension: number;
      ulnarDeviation: number;
      radialDeviation: number;
    };
    right: {
      flexion: number;
      extension: number;
      ulnarDeviation: number;
      radialDeviation: number;
    };
  };
  hands: {
    left: {
      makeAFist: boolean;
      fingerFlexion: number;
      fingerExtension: number;
      thumbOpposition: boolean;
    };
    right: {
      makeAFist: boolean;
      fingerFlexion: number;
      fingerExtension: number;
      thumbOpposition: boolean;
    };
  };
  hips: {
    left: {
      flexion: number;
      extension: number;
      abduction: number;
      adduction: number;
      internalRotation: number;
      externalRotation: number;
    };
    right: {
      flexion: number;
      extension: number;
      abduction: number;
      adduction: number;
      internalRotation: number;
      externalRotation: number;
    };
  };
  knees: {
    left: {
      flexion: number;
      extension: number;
    };
    right: {
      flexion: number;
      extension: number;
    };
  };
  ankles: {
    left: {
      dorsiflexion: number;
      plantarflexion: number;
      inversion: number;
      eversion: number;
    };
    right: {
      dorsiflexion: number;
      plantarflexion: number;
      inversion: number;
      eversion: number;
    };
  };
}

// =======================
// ASSESSMENT SECTION
// =======================

export interface Assessment {
  diagnosis: {
    primary: string;
    secondary?: string[];
  };
  medicalSourceStatement: {
    abilities: string;
    limitations: string;
  };
  recommendations: string;
  imagingReviewed: {
    reviewed: boolean;
    findings?: string;
  };
  medicalRecordsReview: {
    reviewed: boolean;
    statement: string;
  };
}

// =======================
// COMPLETE FLORIDA CE EXAM FORM
// =======================

export interface FloridaCEExamForm {
  header: HeaderSection;
  history: HistorySection;
  functionalStatus: FunctionalStatus;
  medicalInfo: MedicalInfo;
  physicalExam: PhysicalExam;
  rangeOfMotion: RangeOfMotion;
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
  HEADER = 0,
  HISTORY = 1,
  FUNCTIONAL_STATUS = 2,
  MEDICAL_INFO = 3,
  PHYSICAL_EXAM = 4,
  RANGE_OF_MOTION = 5,
  ASSESSMENT = 6,
  REVIEW = 7
}

export const FORM_STEP_LABELS = {
  [FormSteps.HEADER]: 'Header Information',
  [FormSteps.HISTORY]: 'History',
  [FormSteps.FUNCTIONAL_STATUS]: 'Functional Status',
  [FormSteps.MEDICAL_INFO]: 'Medical Information',
  [FormSteps.PHYSICAL_EXAM]: 'Physical Examination',
  [FormSteps.RANGE_OF_MOTION]: 'Range of Motion',
  [FormSteps.ASSESSMENT]: 'Assessment',
  [FormSteps.REVIEW]: 'Review & Submit'
};

export default FloridaCEExamForm;
