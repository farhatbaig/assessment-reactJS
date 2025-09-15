/**
 * Form reset utilities
 */

import { FormData } from '../types/form';

/**
 * Get empty form data
 */
export const getEmptyFormData = (): FormData => ({
  // Personal Information
  name: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  email: '',
  
  // Family & Financial Information
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: '',
  housingStatus: '',
  
  // Situation Descriptions
  financialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: ''
});

/**
 * Reset all form fields to empty values
 */
export const resetAllFormFields = (): FormData => {
  const emptyData = getEmptyFormData();
  
  // Clear localStorage immediately
  try {
    localStorage.removeItem('socialSupportFormData');
    console.log('✅ Form reset: localStorage cleared');
  } catch (error) {
    console.error('❌ Form reset: Error clearing localStorage:', error);
  }
  
  return emptyData;
};
