import { useCallback, useMemo } from 'react';
import { FormData, PersonalInfo, FamilyFinancial, SituationDescriptions } from '../types/form';
import { showSuccess, showError } from '../utils/notifications';
import apiService from '../services/apiService';

interface BusinessLogicConfig {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setLoading: (loading: boolean) => void;
  resetForm: () => void;
  t: (key: string) => string;
}

interface SubmissionResult {
  success: boolean;
  message?: string;
  applicationId?: string;
}

export const useFormBusinessLogic = (config: BusinessLogicConfig) => {
  const { formData, updateFormData, setLoading, resetForm, t } = config;

  const transformPersonalInfo = useCallback((data: any): PersonalInfo => {
    return {
      ...data,
      dateOfBirth: data.dateOfBirth instanceof Date 
        ? data.dateOfBirth.toISOString().split('T')[0] 
        : data.dateOfBirth
    };
  }, []);

  const transformFamilyFinancial = useCallback((data: any): FamilyFinancial => {
    return {
      ...data,
      dependents: Number(data.dependents) || 0,
      monthlyIncome: data.monthlyIncome?.toString() || ''
    };
  }, []);

  const transformSituationDescriptions = useCallback((data: any): SituationDescriptions => {
    return {
      financialSituation: data.financialSituation?.trim() || '',
      employmentCircumstances: data.employmentCircumstances?.trim() || '',
      reasonForApplying: data.reasonForApplying?.trim() || ''
    };
  }, []);

  const validatePersonalInfoBusinessRules = useCallback((data: PersonalInfo): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        errors.push(t('validation.minAge'));
      }
      
      if (age > 120) {
        errors.push(t('validation.maxAge'));
      }
    }

    if (data.nationalId && data.nationalId.length !== 13) {
      errors.push(t('validation.nationalIdLength'));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [t]);

  const validateFamilyFinancialBusinessRules = useCallback((data: FamilyFinancial): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const monthlyIncome = Number(data.monthlyIncome);
    if (monthlyIncome < 0) {
      errors.push(t('validation.negativeIncome'));
    }

    if (data.dependents < 0) {
      errors.push(t('validation.negativeDependents'));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [t]);

  const submitPersonalInfo = useCallback(async (data: any): Promise<SubmissionResult> => {
    try {
      const transformedData = transformPersonalInfo(data);
      const validation = validatePersonalInfoBusinessRules(transformedData);

      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        };
      }

      updateFormData(transformedData);
      
      return {
        success: true,
        message: t('success.personalInfoSaved')
      };
    } catch (error) {
      return {
        success: false,
        message: t('errors.personalInfoSaveFailed')
      };
    }
  }, [transformPersonalInfo, validatePersonalInfoBusinessRules, updateFormData, t]);

  const submitFamilyFinancial = useCallback(async (data: any): Promise<SubmissionResult> => {
    try {
      const transformedData = transformFamilyFinancial(data);
      const validation = validateFamilyFinancialBusinessRules(transformedData);

      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        };
      }

      updateFormData(transformedData);
      
      return {
        success: true,
        message: t('success.familyFinancialSaved')
      };
    } catch (error) {
      return {
        success: false,
        message: t('errors.familyFinancialSaveFailed')
      };
    }
  }, [transformFamilyFinancial, validateFamilyFinancialBusinessRules, updateFormData, t]);

  const submitApplication = useCallback(async (data: any): Promise<SubmissionResult> => {
    setLoading(true);
    
    try {
      const transformedData = transformSituationDescriptions(data);
      const completeFormData = { ...formData, ...transformedData };
      
      const result = await apiService.submitApplication(completeFormData);
      
      if (result.success) {
        showSuccess(
          t('success.applicationSubmitted'),
          t('success.title')
        );
        
        resetForm();
        
        return {
          success: true,
          message: t('success.applicationSubmitted'),
          applicationId: result.applicationId
        };
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      showError(
        t('errors.submissionFailed'),
        t('errors.submissionTitle')
      );
      
      return {
        success: false,
        message: error instanceof Error ? error.message : t('errors.submissionFailed')
      };
    } finally {
      setLoading(false);
    }
  }, [formData, transformSituationDescriptions, setLoading, resetForm, t]);

  const completionPercentage = useMemo(() => {
    const totalFields = 17;
    const filledFields = Object.values(formData).filter(value => 
      value && value.toString().trim() !== ''
    ).length;
    
    return Math.round((filledFields / totalFields) * 100);
  }, [formData]);

  const hasFormData = useMemo(() => {
    return Object.values(formData).some(value => 
      value && value.toString().trim() !== ''
    );
  }, [formData]);

  return {
    transformPersonalInfo,
    transformFamilyFinancial,
    transformSituationDescriptions,
    validatePersonalInfoBusinessRules,
    validateFamilyFinancialBusinessRules,
    submitPersonalInfo,
    submitFamilyFinancial,
    submitApplication,
    completionPercentage,
    hasFormData
  };
};