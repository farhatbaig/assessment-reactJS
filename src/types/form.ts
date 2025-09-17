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
  
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: string;
  housingStatus: string;
  
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface SavedFormData {
  formData: FormData;
  currentStep: number;
  timestamp: string;
}

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

export interface StepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AISuggestion {
  text: string;
  field: string;
}

export interface AIServiceResponse {
  success: boolean;
  suggestion?: string;
  error?: string;
}

export interface APIResponse {
  success: boolean;
  message?: string;
  error?: string;
}
