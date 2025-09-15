// Form data types
export interface PersonalInfo {
  name: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
}

export interface FamilyFinancial {
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: string;
  housingStatus: string;
}

export interface SituationDescriptions {
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface FormData {
  // Step 1: Personal Information
  name: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  
  // Step 2: Family & Financial Info
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: string;
  housingStatus: string;
  
  // Step 3: Situation Descriptions
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface SavedFormData {
  formData: FormData;
  currentStep: number;
  timestamp: string;
}

// Form context types
export interface FormContextType {
  currentStep: number;
  formData: FormData;
  isRTL: boolean;
  isLoading: boolean;
  error: string | null;
  isResetting: boolean;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

// Component prop types
export interface StepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// AI Service types
export interface AISuggestion {
  text: string;
  field: string;
}

export interface AIServiceResponse {
  success: boolean;
  suggestion?: string;
  error?: string;
}

// API Service types
export interface APIResponse {
  success: boolean;
  message?: string;
  error?: string;
}
