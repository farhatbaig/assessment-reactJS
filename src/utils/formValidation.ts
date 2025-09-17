import { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

interface ValidationConfig<T extends FieldValues> {
  values: T;
  isValid: boolean;
  requiredFields: readonly (keyof T)[];
}

interface ValidationResult {
  isFormValid: boolean;
  hasRequiredFields: boolean;
  hasData: boolean;
}
export const useFormValidation = <T extends FieldValues>({
  values,
  isValid,
  requiredFields
}: ValidationConfig<T>): ValidationResult => {
  
  const validationResult = useMemo((): ValidationResult => {
    const allRequiredFieldsFilled = requiredFields.every(fieldName => {
      const fieldValue = values[fieldName];
      return fieldValue && fieldValue.toString().trim() !== '';
    });

    const formHasData = Object.values(values).some(fieldValue => 
      fieldValue && fieldValue.toString().trim() !== ''
    );

    const isFormCompletelyValid = allRequiredFieldsFilled && isValid;

    return {
      isFormValid: isFormCompletelyValid,
      hasRequiredFields: allRequiredFieldsFilled,
      hasData: formHasData
    };
  }, [values, isValid, requiredFields]);

  return validationResult;
};
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (typeof value === 'number') return !isNaN(value);
  return true;
};
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};
