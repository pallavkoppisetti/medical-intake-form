// Patient information types
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// Insurance information
export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName: string;
  subscriberId: string;
}

// Medical history types
export interface MedicalHistory {
  allergies: string[];
  currentMedications: Medication[];
  pastMedicalHistory: string[];
  familyHistory: string[];
  surgicalHistory: SurgicalProcedure[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy?: string;
}

export interface SurgicalProcedure {
  procedure: string;
  date: string;
  hospital?: string;
  complications?: string;
}

// Current visit information
export interface VisitInfo {
  chiefComplaint: string;
  symptomsStartDate: string;
  painLevel: number; // 1-10 scale
  additionalSymptoms: string[];
  previousTreatment?: string;
}

// Complete intake form
export interface MedicalIntakeForm {
  personalInfo: PersonalInfo;
  insuranceInfo: InsuranceInfo;
  medicalHistory: MedicalHistory;
  visitInfo: VisitInfo;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  consentToTreatment: boolean;
  signature: string;
  date: string;
}
