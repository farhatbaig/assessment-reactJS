/**
 * Utils Index
 * 
 * This file exports all utility functions for easy importing
 */

// Form validation utilities
export { 
  useFormValidation,
  validateEmail, 
  validatePhone, 
  validateRequired, 
  validateMinLength, 
  validateMaxLength 
} from './formValidation';

// Notification utilities
export { showSuccess, showError } from './notifications';

// Class name utility
export { cn } from './cn';

// localStorage utilities
export { clearFormData, hasFormData, getFormData, setResettingFlag, getResettingFlag, nuclearClearFormData } from './localStorage';

// Form reset utilities
export { getEmptyFormData, resetAllFormFields } from './formReset';
