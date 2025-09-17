import * as yup from 'yup';
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES, VALIDATION_LIMITS } from '../constants/validation';

export const personalInfoSchema = yup.object().shape({
  name: yup
    .string()
    .min(VALIDATION_LIMITS.NAME_MIN, VALIDATION_MESSAGES.MIN_LENGTH(VALIDATION_LIMITS.NAME_MIN))
    .max(VALIDATION_LIMITS.NAME_MAX, VALIDATION_MESSAGES.MAX_LENGTH(VALIDATION_LIMITS.NAME_MAX))
    .matches(VALIDATION_PATTERNS.NAME, VALIDATION_MESSAGES.INVALID_NAME)
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  nationalId: yup
    .string()
    .matches(VALIDATION_PATTERNS.NATIONAL_ID, VALIDATION_MESSAGES.INVALID_NATIONAL_ID)
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .min(new Date(1900, 0, 1), 'Date of birth must be after 1900')
    .test('age', VALIDATION_MESSAGES.MIN_AGE, function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= VALIDATION_LIMITS.MIN_AGE;
      }
      return age >= VALIDATION_LIMITS.MIN_AGE;
    })
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender')
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  address: yup
    .string()
    .min(VALIDATION_LIMITS.ADDRESS_MIN, VALIDATION_MESSAGES.MIN_LENGTH(VALIDATION_LIMITS.ADDRESS_MIN))
    .max(VALIDATION_LIMITS.ADDRESS_MAX, VALIDATION_MESSAGES.MAX_LENGTH(VALIDATION_LIMITS.ADDRESS_MAX))
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  city: yup
    .string()
    .min(VALIDATION_LIMITS.CITY_MIN, VALIDATION_MESSAGES.MIN_LENGTH(VALIDATION_LIMITS.CITY_MIN))
    .max(VALIDATION_LIMITS.CITY_MAX, VALIDATION_MESSAGES.MAX_LENGTH(VALIDATION_LIMITS.CITY_MAX))
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  state: yup
    .string()
    .min(VALIDATION_LIMITS.STATE_MIN, VALIDATION_MESSAGES.MIN_LENGTH(VALIDATION_LIMITS.STATE_MIN))
    .max(VALIDATION_LIMITS.STATE_MAX, VALIDATION_MESSAGES.MAX_LENGTH(VALIDATION_LIMITS.STATE_MAX))
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  country: yup
    .string()
    .oneOf(['ae', 'us', 'pk' , 'uk', 'ca', 'in'], 'Please select a valid country')
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  phone: yup
    .string()
    .matches(VALIDATION_PATTERNS.PHONE, VALIDATION_MESSAGES.INVALID_PHONE)
    .min(VALIDATION_LIMITS.PHONE_MIN, VALIDATION_MESSAGES.MIN_LENGTH(VALIDATION_LIMITS.PHONE_MIN))
    .max(VALIDATION_LIMITS.PHONE_MAX, VALIDATION_MESSAGES.MAX_LENGTH(VALIDATION_LIMITS.PHONE_MAX))
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  email: yup
    .string()
    .email(VALIDATION_MESSAGES.INVALID_EMAIL)
    .max(VALIDATION_LIMITS.EMAIL_MAX, VALIDATION_MESSAGES.MAX_LENGTH(VALIDATION_LIMITS.EMAIL_MAX))
    .required(VALIDATION_MESSAGES.REQUIRED)
});

export const familyFinancialSchema = yup.object().shape({
  maritalStatus: yup
    .string()
    .oneOf(['single', 'married', 'divorced', 'widowed'], 'Please select a valid marital status')
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  dependents: yup
    .number()
    .min(0, VALIDATION_MESSAGES.NEGATIVE_DEPENDENTS)
    .max(VALIDATION_LIMITS.DEPENDENTS_MAX, VALIDATION_MESSAGES.MAX_DEPENDENTS)
    .integer('Number of dependents must be a whole number')
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  employmentStatus: yup
    .string()
    .oneOf(['employed', 'unemployed', 'student', 'retired', 'selfEmployed'], 'Please select a valid employment status')
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  monthlyIncome: yup
    .string()
    .matches(VALIDATION_PATTERNS.INCOME, VALIDATION_MESSAGES.INVALID_INCOME)
    .test('min-income', VALIDATION_MESSAGES.NEGATIVE_INCOME, function(value) {
      if (!value) return false;
      const numValue = parseFloat(value);
      return numValue >= 0;
    })
    .test('max-income', VALIDATION_MESSAGES.MAX_INCOME, function(value) {
      if (!value) return false;
      const numValue = parseFloat(value);
      return numValue <= VALIDATION_LIMITS.INCOME_MAX;
    })
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  housingStatus: yup
    .string()
    .oneOf(['owned', 'rented', 'livingWithFamily', 'homeless'], 'Please select a valid housing status')
    .required(VALIDATION_MESSAGES.REQUIRED)
});

export const situationDescriptionsSchema = yup.object().shape({
  financialSituation: yup
    .string()
    .min(VALIDATION_LIMITS.DESCRIPTION_MIN, VALIDATION_MESSAGES.MIN_LENGTH(VALIDATION_LIMITS.DESCRIPTION_MIN))
    .max(VALIDATION_LIMITS.DESCRIPTION_MAX, VALIDATION_MESSAGES.MAX_LENGTH(VALIDATION_LIMITS.DESCRIPTION_MAX))
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  employmentCircumstances: yup
    .string()
    .min(VALIDATION_LIMITS.DESCRIPTION_MIN, VALIDATION_MESSAGES.MIN_LENGTH(VALIDATION_LIMITS.DESCRIPTION_MIN))
    .max(VALIDATION_LIMITS.DESCRIPTION_MAX, VALIDATION_MESSAGES.MAX_LENGTH(VALIDATION_LIMITS.DESCRIPTION_MAX))
    .required(VALIDATION_MESSAGES.REQUIRED),
  
  reasonForApplying: yup
    .string()
    .min(VALIDATION_LIMITS.DESCRIPTION_MIN, VALIDATION_MESSAGES.MIN_LENGTH(VALIDATION_LIMITS.DESCRIPTION_MIN))
    .max(VALIDATION_LIMITS.DESCRIPTION_MAX, VALIDATION_MESSAGES.MAX_LENGTH(VALIDATION_LIMITS.DESCRIPTION_MAX))
    .required(VALIDATION_MESSAGES.REQUIRED)
});
