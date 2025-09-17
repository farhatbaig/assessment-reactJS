import { FormData } from '../types/form';
export const getEmptyFormData = (): FormData => ({
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
  
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: '',
  housingStatus: '',
  
  financialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: ''
});
export const resetAllFormFields = (): FormData => {
  const emptyData = getEmptyFormData();
  try {
    localStorage.removeItem('socialSupportFormData');
  } catch (error) {
    console.error('Form reset: Error clearing localStorage:', error);
  }
  return emptyData;
};
