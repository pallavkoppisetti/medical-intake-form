/**
 * Comprehensive Medical Intake Form Type Definitions
 * Covers all aspects of a medical evaluation including basic info, history, 
 * functional status, medical information, vital signs, physical examination,
 * neuromuscular assessment, range of motion, gait/station, and clinical assessment
 */

// =======================
// BASIC INFORMATION SECTION
// =======================

export interface BasicInfo {
  // Personal Demographics
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  age?: number;
  gender: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'domestic-partner';
  
  // Contact Information
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    address?: string;
  };
  
  // Insurance and Demographics
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    subscriberName: string;
    subscriberId: string;
  };
  
  // Employment and Lifestyle
  occupation?: string;
  employer?: string;
  dominantHand: 'right' | 'left' | 'ambidextrous';
  livingArrangement: 'alone' | 'family' | 'assisted-living' | 'nursing-home' | 'other';
  primaryLanguage: string;
}

// =======================
// MEDICAL HISTORY SECTION
// =======================

export interface MedicalCondition {
  condition: string;
  diagnosisDate?: string;
  status: 'active' | 'resolved' | 'chronic' | 'acute';
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'topical' | 'injection' | 'inhalation' | 'other';
  prescribedBy?: string;
  startDate?: string;
  indication?: string;
  sideEffects?: string[];
}

export interface Allergy {
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  type: 'drug' | 'food' | 'environmental' | 'other';
}

export interface Surgery {
  procedure: string;
  date: string;
  surgeon?: string;
  hospital?: string;
  complications?: string;
  outcome: 'successful' | 'complications' | 'unsuccessful';
}

export interface History {
  // Current Medical Conditions
  currentConditions: MedicalCondition[];
  
  // Medications
  currentMedications: Medication[];
  
  // Allergies
  allergies: Allergy[];
  
  // Surgical History
  surgicalHistory: Surgery[];
  
  // Family History
  familyHistory: {
    condition: string;
    relationship: string;
    ageOfOnset?: number;
  }[];
  
  // Social History
  socialHistory: {
    smokingStatus: 'never' | 'former' | 'current';
    smokingDetails?: {
      packsPerDay?: number;
      yearsSmoked?: number;
      quitDate?: string;
    };
    alcoholUse: 'never' | 'occasional' | 'moderate' | 'heavy';
    alcoholDetails?: {
      drinksPerWeek?: number;
      type?: string;
    };
    drugUse: 'never' | 'former' | 'current';
    exerciseFrequency: 'none' | 'rarely' | 'weekly' | 'daily';
    dietType?: string;
  };
  
  // Review of Systems
  reviewOfSystems: {
    constitutional: boolean;
    cardiovascular: boolean;
    respiratory: boolean;
    gastrointestinal: boolean;
    genitourinary: boolean;
    musculoskeletal: boolean;
    neurological: boolean;
    psychiatric: boolean;
    endocrine: boolean;
    hematologic: boolean;
    skin: boolean;
    details?: Record<string, string>;
  };
}

// =======================
// FUNCTIONAL STATUS SECTION
// =======================

export interface FunctionalStatus {
  // Activities of Daily Living (ADL)
  activitiesOfDailyLiving: {
    bathing: 'independent' | 'needs-assistance' | 'dependent';
    dressing: 'independent' | 'needs-assistance' | 'dependent';
    toileting: 'independent' | 'needs-assistance' | 'dependent';
    transferring: 'independent' | 'needs-assistance' | 'dependent';
    continence: 'independent' | 'needs-assistance' | 'dependent';
    feeding: 'independent' | 'needs-assistance' | 'dependent';
  };
  
  // Instrumental Activities of Daily Living (IADL)
  instrumentalADL: {
    cooking: 'independent' | 'needs-assistance' | 'dependent';
    housekeeping: 'independent' | 'needs-assistance' | 'dependent';
    laundry: 'independent' | 'needs-assistance' | 'dependent';
    transportation: 'independent' | 'needs-assistance' | 'dependent';
    shopping: 'independent' | 'needs-assistance' | 'dependent';
    medicationManagement: 'independent' | 'needs-assistance' | 'dependent';
    financialManagement: 'independent' | 'needs-assistance' | 'dependent';
    communication: 'independent' | 'needs-assistance' | 'dependent';
  };
  
  // Mobility Assessment
  mobility: {
    walkingDistance: 'unlimited' | 'blocks' | 'household' | 'wheelchair' | 'bedbound';
    assistiveDevices: string[];
    fallHistory: {
      hasHistory: boolean;
      frequency?: string;
      lastFall?: string;
      circumstances?: string;
    };
    balanceProblems: boolean;
    stairClimbing: 'independent' | 'needs-rail' | 'needs-assistance' | 'unable';
  };
  
  // Work and Recreation
  workStatus: 'employed' | 'unemployed' | 'retired' | 'disability' | 'student';
  workLimitations?: string[];
  recreationalActivities: string[];
  recreationalLimitations?: string[];
  
  // Pain and Symptoms
  painAssessment: {
    hasPain: boolean;
    painScale?: number; // 0-10
    painLocation?: string[];
    painCharacter?: 'sharp' | 'dull' | 'burning' | 'throbbing' | 'cramping' | 'other';
    painTriggers?: string[];
    painRelief?: string[];
  };
}

// =======================
// VITAL SIGNS SECTION
// =======================

export interface VitalSigns {
  // Basic Vitals
  bloodPressure: {
    systolic: number;
    diastolic: number;
    position: 'sitting' | 'standing' | 'supine';
    arm: 'left' | 'right';
  };
  heartRate: {
    rate: number;
    rhythm: 'regular' | 'irregular';
    method: 'palpation' | 'auscultation' | 'monitor';
  };
  respiratoryRate: number;
  temperature: {
    value: number;
    unit: 'fahrenheit' | 'celsius';
    method: 'oral' | 'temporal' | 'axillary' | 'rectal' | 'tympanic';
  };
  oxygenSaturation: {
    percentage: number;
    roomAir: boolean;
    oxygenFlow?: number;
  };
  
  // Additional Measurements
  height: {
    value: number;
    unit: 'inches' | 'cm' | 'feet-inches';
  };
  weight: {
    value: number;
    unit: 'pounds' | 'kg';
  };
  bmi?: number;
  
  // Pain Assessment
  painScore: number; // 0-10 scale
  painLocation?: string;
  
  // Time and Context
  measurementTime: string;
  measuredBy: string;
  notes?: string;
}

// =======================
// PHYSICAL EXAMINATION SECTION
// =======================

export interface PhysicalExam {
  // General Appearance
  generalAppearance: {
    consciousness: 'alert' | 'lethargic' | 'stuporous' | 'comatose';
    distress: 'none' | 'mild' | 'moderate' | 'severe';
    grooming: 'well-groomed' | 'unkempt';
    cooperation: 'cooperative' | 'uncooperative' | 'combative';
    positioning: 'comfortable' | 'uncomfortable' | 'preferred-position';
  };
  
  // Head, Eyes, Ears, Nose, Throat (HEENT)
  heent: {
    head: {
      shape: 'normal' | 'abnormal';
      trauma: boolean;
      tenderness: boolean;
      notes?: string;
    };
    eyes: {
      pupils: 'equal-reactive' | 'unequal' | 'non-reactive';
      extraocularMovements: 'intact' | 'limited';
      conjunctiva: 'normal' | 'injected' | 'pale';
      sclera: 'normal' | 'icteric';
      notes?: string;
    };
    ears: {
      externalCanal: 'normal' | 'cerumen' | 'discharge';
      tympanic: 'normal' | 'erythematous' | 'perforated';
      hearing: 'normal' | 'decreased';
      notes?: string;
    };
    nose: {
      external: 'normal' | 'deformed';
      patency: 'patent' | 'obstructed';
      mucosa: 'normal' | 'erythematous' | 'pale';
      discharge: boolean;
      notes?: string;
    };
    throat: {
      oropharynx: 'normal' | 'erythematous' | 'exudate';
      tonsils: 'normal' | 'enlarged' | 'absent';
      teeth: 'good' | 'poor' | 'missing';
      notes?: string;
    };
  };
  
  // Cardiovascular
  cardiovascular: {
    rhythm: 'regular' | 'irregular';
    murmurs: boolean;
    gallops: boolean;
    rubs: boolean;
    pulses: {
      carotid: 'normal' | 'diminished' | 'absent';
      radial: 'normal' | 'diminished' | 'absent';
      dorsalisPedis: 'normal' | 'diminished' | 'absent';
      posteriorTibial: 'normal' | 'diminished' | 'absent';
    };
    edema: {
      present: boolean;
      location?: string[];
      severity?: 'mild' | 'moderate' | 'severe';
    };
    notes?: string;
  };
  
  // Respiratory
  respiratory: {
    inspection: {
      chestShape: 'normal' | 'barrel' | 'pectus';
      breathing: 'unlabored' | 'labored' | 'accessory-muscles';
      symmetry: 'symmetric' | 'asymmetric';
    };
    palpation: {
      expansion: 'equal' | 'unequal';
      fremitus: 'normal' | 'increased' | 'decreased';
      crepitus: boolean;
    };
    percussion: {
      resonance: 'resonant' | 'dull' | 'hyperresonant';
      diaphragmaticExcursion?: string;
    };
    auscultation: {
      breathSounds: 'clear' | 'diminished' | 'absent';
      adventitious: 'none' | 'crackles' | 'wheezes' | 'rhonchi' | 'stridor';
      location?: string[];
    };
    notes?: string;
  };
  
  // Abdomen
  abdomen: {
    inspection: {
      shape: 'flat' | 'rounded' | 'distended' | 'scaphoid';
      scars: boolean;
      masses: boolean;
    };
    auscultation: {
      bowelSounds: 'normal' | 'hyperactive' | 'hypoactive' | 'absent';
      bruits: boolean;
    };
    percussion: {
      tympany: 'normal' | 'increased' | 'decreased';
      organomegaly: boolean;
    };
    palpation: {
      tenderness: boolean;
      guarding: boolean;
      rebound: boolean;
      masses: boolean;
      organomegaly: boolean;
    };
    notes?: string;
  };
  
  // Skin
  skin: {
    color: 'normal' | 'pale' | 'cyanotic' | 'jaundiced' | 'erythematous';
    temperature: 'normal' | 'warm' | 'cool';
    moisture: 'normal' | 'dry' | 'moist' | 'diaphoretic';
    turgor: 'normal' | 'decreased';
    lesions: {
      present: boolean;
      type?: string;
      location?: string[];
      description?: string;
    };
    notes?: string;
  };
}

// =======================
// NEUROMUSCULAR ASSESSMENT SECTION
// =======================

export interface NeuroMuscularAssessment {
  // Mental Status
  mentalStatus: {
    orientation: {
      person: boolean;
      place: boolean;
      time: boolean;
      situation: boolean;
    };
    memory: {
      immediate: 'intact' | 'impaired';
      recent: 'intact' | 'impaired';
      remote: 'intact' | 'impaired';
    };
    attention: 'focused' | 'distractible' | 'inattentive';
    language: {
      fluency: 'fluent' | 'non-fluent';
      comprehension: 'intact' | 'impaired';
      repetition: 'intact' | 'impaired';
      naming: 'intact' | 'impaired';
    };
  };
  
  // Cranial Nerves
  cranialNerves: {
    cn1: 'intact' | 'impaired' | 'not-tested'; // Olfactory
    cn2: 'intact' | 'impaired' | 'not-tested'; // Optic
    cn3: 'intact' | 'impaired' | 'not-tested'; // Oculomotor
    cn4: 'intact' | 'impaired' | 'not-tested'; // Trochlear
    cn5: 'intact' | 'impaired' | 'not-tested'; // Trigeminal
    cn6: 'intact' | 'impaired' | 'not-tested'; // Abducens
    cn7: 'intact' | 'impaired' | 'not-tested'; // Facial
    cn8: 'intact' | 'impaired' | 'not-tested'; // Vestibulocochlear
    cn9: 'intact' | 'impaired' | 'not-tested'; // Glossopharyngeal
    cn10: 'intact' | 'impaired' | 'not-tested'; // Vagus
    cn11: 'intact' | 'impaired' | 'not-tested'; // Accessory
    cn12: 'intact' | 'impaired' | 'not-tested'; // Hypoglossal
    notes?: string;
  };
  
  // Motor Function
  motorFunction: {
    tone: {
      normal: boolean;
      hypotonia: string[]; // affected areas
      hypertonia: string[]; // affected areas
      rigidity: string[]; // affected areas
      spasticity: string[]; // affected areas
    };
    strength: {
      // Manual Muscle Testing (0-5 scale)
      upperExtremities: {
        leftShoulder: number;
        rightShoulder: number;
        leftElbow: number;
        rightElbow: number;
        leftWrist: number;
        rightWrist: number;
        leftHand: number;
        rightHand: number;
      };
      lowerExtremities: {
        leftHip: number;
        rightHip: number;
        leftKnee: number;
        rightKnee: number;
        leftAnkle: number;
        rightAnkle: number;
      };
      trunk: number;
      neck: number;
    };
    coordination: {
      fingerToNose: 'normal' | 'dysmetric' | 'unable';
      heelToShin: 'normal' | 'dysmetric' | 'unable';
      rapidAlternatingMovements: 'normal' | 'dysdiadochokinesia' | 'unable';
      tremor: {
        present: boolean;
        type?: 'resting' | 'action' | 'intention';
        location?: string[];
      };
    };
  };
  
  // Sensory Function
  sensoryFunction: {
    lightTouch: {
      intact: string[]; // body regions
      impaired: string[]; // body regions
      absent: string[]; // body regions
    };
    pinprick: {
      intact: string[];
      impaired: string[];
      absent: string[];
    };
    vibration: {
      intact: string[];
      impaired: string[];
      absent: string[];
    };
    proprioception: {
      intact: string[];
      impaired: string[];
      absent: string[];
    };
    twoPointDiscrimination: 'normal' | 'impaired' | 'not-tested';
  };
  
  // Reflexes
  reflexes: {
    // Deep Tendon Reflexes (0-4+ scale)
    biceps: { left: number; right: number };
    triceps: { left: number; right: number };
    brachioradialis: { left: number; right: number };
    patellar: { left: number; right: number };
    achilles: { left: number; right: number };
    
    // Pathological Reflexes
    babinski: { left: 'negative' | 'positive'; right: 'negative' | 'positive' };
    hoffmann: { left: 'negative' | 'positive'; right: 'negative' | 'positive' };
    clonus: { present: boolean; location?: string[] };
  };
}

// =======================
// RANGE OF MOTION SECTION
// =======================

export interface RangeOfMotion {
  // Cervical Spine
  cervicalSpine: {
    flexion: { active: number; passive: number; normal: number };
    extension: { active: number; passive: number; normal: number };
    leftRotation: { active: number; passive: number; normal: number };
    rightRotation: { active: number; passive: number; normal: number };
    leftLateralFlexion: { active: number; passive: number; normal: number };
    rightLateralFlexion: { active: number; passive: number; normal: number };
    painWithMovement: boolean;
    notes?: string;
  };
  
  // Shoulder
  shoulders: {
    left: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      abduction: { active: number; passive: number; normal: number };
      adduction: { active: number; passive: number; normal: number };
      internalRotation: { active: number; passive: number; normal: number };
      externalRotation: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
    right: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      abduction: { active: number; passive: number; normal: number };
      adduction: { active: number; passive: number; normal: number };
      internalRotation: { active: number; passive: number; normal: number };
      externalRotation: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
  };
  
  // Elbow
  elbows: {
    left: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      pronation: { active: number; passive: number; normal: number };
      supination: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
    right: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      pronation: { active: number; passive: number; normal: number };
      supination: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
  };
  
  // Wrist and Hand
  wrists: {
    left: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      ulnarDeviation: { active: number; passive: number; normal: number };
      radialDeviation: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
    right: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      ulnarDeviation: { active: number; passive: number; normal: number };
      radialDeviation: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
  };
  
  // Hip
  hips: {
    left: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      abduction: { active: number; passive: number; normal: number };
      adduction: { active: number; passive: number; normal: number };
      internalRotation: { active: number; passive: number; normal: number };
      externalRotation: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
    right: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      abduction: { active: number; passive: number; normal: number };
      adduction: { active: number; passive: number; normal: number };
      internalRotation: { active: number; passive: number; normal: number };
      externalRotation: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
  };
  
  // Knee
  knees: {
    left: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
    right: {
      flexion: { active: number; passive: number; normal: number };
      extension: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
  };
  
  // Ankle and Foot
  ankles: {
    left: {
      dorsiflexion: { active: number; passive: number; normal: number };
      plantarflexion: { active: number; passive: number; normal: number };
      inversion: { active: number; passive: number; normal: number };
      eversion: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
    right: {
      dorsiflexion: { active: number; passive: number; normal: number };
      plantarflexion: { active: number; passive: number; normal: number };
      inversion: { active: number; passive: number; normal: number };
      eversion: { active: number; passive: number; normal: number };
      painWithMovement: boolean;
    };
  };
  
  // Lumbar Spine
  lumbarSpine: {
    flexion: { active: number; passive: number; normal: number };
    extension: { active: number; passive: number; normal: number };
    leftLateralFlexion: { active: number; passive: number; normal: number };
    rightLateralFlexion: { active: number; passive: number; normal: number };
    leftRotation: { active: number; passive: number; normal: number };
    rightRotation: { active: number; passive: number; normal: number };
    painWithMovement: boolean;
    notes?: string;
  };
}

// =======================
// GAIT AND STATION SECTION
// =======================

export interface GaitAndStation {
  // Static Balance (Station)
  staticBalance: {
    feetTogether: {
      eyesOpen: 'stable' | 'mild-sway' | 'moderate-sway' | 'unstable' | 'unable';
      eyesClosed: 'stable' | 'mild-sway' | 'moderate-sway' | 'unstable' | 'unable';
      timeHeld?: number; // seconds
    };
    singleLegStance: {
      left: 'stable' | 'mild-sway' | 'moderate-sway' | 'unstable' | 'unable';
      right: 'stable' | 'mild-sway' | 'moderate-sway' | 'unstable' | 'unable';
      timeHeld?: { left: number; right: number }; // seconds
    };
    tandemStand: 'stable' | 'mild-sway' | 'moderate-sway' | 'unstable' | 'unable';
    rombergTest: 'negative' | 'positive';
  };
  
  // Dynamic Balance
  dynamicBalance: {
    walkingBalance: 'normal' | 'mild-unsteadiness' | 'moderate-unsteadiness' | 'severe-unsteadiness';
    turningBalance: 'smooth' | 'unsteady' | 'staggering' | 'requires-support';
    reachingBalance: 'maintained' | 'loss-of-balance' | 'requires-support';
    functionalReach: number; // inches
  };
  
  // Gait Analysis
  gaitPattern: {
    // Temporal-Spatial Parameters
    cadence: number; // steps per minute
    velocity: 'normal' | 'slow' | 'fast';
    stepLength: {
      left: number; // cm
      right: number; // cm
      symmetric: boolean;
    };
    strideLength: number; // cm
    stepWidth: number; // cm
    
    // Gait Phases
    initialContact: {
      heelStrike: 'normal' | 'absent' | 'delayed';
      footFlat: 'normal' | 'slapping' | 'delayed';
    };
    loading: {
      weightAcceptance: 'normal' | 'cautious' | 'unstable';
      doubleSupport: 'normal' | 'prolonged' | 'shortened';
    };
    midstance: {
      singleLimb: 'stable' | 'unstable' | 'shortened';
      progression: 'smooth' | 'lurching' | 'compensated';
    };
    terminal: {
      heelOff: 'normal' | 'early' | 'delayed';
      toeOff: 'normal' | 'weak' | 'absent';
    };
    swing: {
      clearance: 'adequate' | 'dragging' | 'circumduction';
      advancement: 'smooth' | 'stiff' | 'weak';
    };
    
    // Gait Deviations
    deviations: {
      trendelenburgGait: boolean;
      antalgicGait: boolean;
      ataxicGait: boolean;
      festinatingGait: boolean;
      stepperGait: boolean;
      waddlingGait: boolean;
      scissorsGait: boolean;
      hemiplegicGait: boolean;
      other?: string[];
    };
    
    // Assistive Device Use
    assistiveDevice: {
      used: boolean;
      type?: 'cane' | 'walker' | 'crutches' | 'wheelchair' | 'other';
      appropriateUse?: boolean;
      dependency?: 'minimal' | 'moderate' | 'maximum';
    };
  };
  
  // Functional Mobility
  functionalMobility: {
    bedMobility: 'independent' | 'minimal-assist' | 'moderate-assist' | 'maximum-assist' | 'dependent';
    transfers: {
      sitToStand: 'independent' | 'minimal-assist' | 'moderate-assist' | 'maximum-assist' | 'dependent';
      bedToChair: 'independent' | 'minimal-assist' | 'moderate-assist' | 'maximum-assist' | 'dependent';
      toiletTransfer: 'independent' | 'minimal-assist' | 'moderate-assist' | 'maximum-assist' | 'dependent';
      carTransfer: 'independent' | 'minimal-assist' | 'moderate-assist' | 'maximum-assist' | 'dependent';
    };
    ambulation: {
      distances: {
        household: 'unlimited' | 'limited' | 'unable';
        community: 'unlimited' | 'limited' | 'unable';
        endurance?: string; // e.g., "50 feet before rest"
      };
      surfaces: {
        level: 'independent' | 'minimal-assist' | 'moderate-assist' | 'maximum-assist' | 'unable';
        uneven: 'independent' | 'minimal-assist' | 'moderate-assist' | 'maximum-assist' | 'unable';
        stairs: 'independent' | 'minimal-assist' | 'moderate-assist' | 'maximum-assist' | 'unable';
        ramps: 'independent' | 'minimal-assist' | 'moderate-assist' | 'maximum-assist' | 'unable';
      };
    };
  };
}

// =======================
// ASSESSMENT SECTION
// =======================

export interface ClinicalAssessment {
  // Chief Complaint and History
  chiefComplaint: string;
  historyOfPresentIllness: string;
  
  // Clinical Impression
  primaryDiagnosis: {
    code?: string; // ICD-10 code
    description: string;
    confidence: 'high' | 'moderate' | 'low';
  };
  
  secondaryDiagnoses: {
    code?: string;
    description: string;
    confidence: 'high' | 'moderate' | 'low';
  }[];
  
  differentialDiagnoses: {
    description: string;
    likelihood: 'high' | 'moderate' | 'low';
    reasonsFor: string[];
    reasonsAgainst: string[];
  }[];
  
  // Functional Assessment
  functionalLimitations: {
    impairment: string;
    severity: 'mild' | 'moderate' | 'severe';
    impact: string;
  }[];
  
  // Prognosis
  prognosis: {
    shortTerm: 'excellent' | 'good' | 'fair' | 'poor' | 'guarded';
    longTerm: 'excellent' | 'good' | 'fair' | 'poor' | 'guarded';
    factors: {
      favorable: string[];
      unfavorable: string[];
    };
    expectedOutcomes: string[];
    timeframe?: string;
  };
  
  // Treatment Plan
  treatmentPlan: {
    goals: {
      shortTerm: {
        goal: string;
        timeframe: string;
        measurable: boolean;
        criteria?: string;
      }[];
      longTerm: {
        goal: string;
        timeframe: string;
        measurable: boolean;
        criteria?: string;
      }[];
    };
    
    interventions: {
      therapeutic: string[];
      educational: string[];
      modalities: string[];
      homeProgram: string[];
    };
    
    frequency: {
      sessions: number;
      duration: string; // e.g., "45 minutes"
      totalDuration: string; // e.g., "6-8 weeks"
    };
    
    precautions: string[];
    contraindications: string[];
  };
  
  // Follow-up and Monitoring
  followUp: {
    nextAppointment?: string;
    monitoring: string[];
    redFlags: string[];
    dischargeCliteria: string[];
  };
  
  // Provider Information
  assessedBy: {
    name: string;
    title: string;
    license?: string;
    signature?: string;
    date: string;
  };
  
  additionalNotes?: string;
}

// =======================
// COMPLETE MEDICAL FORM
// =======================

export interface CompleteMedicalIntakeForm {
  // Form Metadata
  formId: string;
  patientId?: string;
  facilityId?: string;
  completionDate: string;
  lastModified: string;
  version: string;
  status: 'draft' | 'in-progress' | 'completed' | 'reviewed' | 'archived';
  
  // Main Form Sections
  basicInfo: BasicInfo;
  history: History;
  functionalStatus: FunctionalStatus;
  vitalSigns: VitalSigns;
  physicalExam: PhysicalExam;
  neuroMuscularAssessment: NeuroMuscularAssessment;
  rangeOfMotion: RangeOfMotion;
  gaitAndStation: GaitAndStation;
  clinicalAssessment: ClinicalAssessment;
  
  // Form Completion Tracking
  sectionCompletion: {
    basicInfo: boolean;
    history: boolean;
    functionalStatus: boolean;
    vitalSigns: boolean;
    physicalExam: boolean;
    neuroMuscularAssessment: boolean;
    rangeOfMotion: boolean;
    gaitAndStation: boolean;
    clinicalAssessment: boolean;
  };
  
  // Consent and Legal
  consents: {
    treatmentConsent: boolean;
    informationSharing: boolean;
    photographyConsent?: boolean;
    researchParticipation?: boolean;
  };
  
  // Digital Signatures
  signatures: {
    patient: {
      name: string;
      signature?: string; // base64 encoded signature image
      date: string;
      ipAddress?: string;
    };
    provider?: {
      name: string;
      signature?: string;
      date: string;
      title: string;
    };
    witness?: {
      name: string;
      signature?: string;
      date: string;
    };
  };
  
  // Attachments and Additional Documentation
  attachments?: {
    id: string;
    name: string;
    type: 'image' | 'document' | 'video' | 'other';
    url: string;
    uploadDate: string;
    description?: string;
  }[];
  
  // Form Review and Approval
  review?: {
    reviewedBy: string;
    reviewDate: string;
    status: 'approved' | 'needs-revision' | 'rejected';
    comments?: string;
    revisionRequests?: string[];
  };
}
