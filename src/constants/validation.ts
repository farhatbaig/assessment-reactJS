
export const VALIDATION_PATTERNS = {
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NATIONAL_ID: /^[0-9]{13}$/,
  NAME: /^[a-zA-Z\s\u0600-\u06FF]+$/,
  INCOME: /^\d+(\.\d{1,2})?$/
} as const;


export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NATIONAL_ID: 'National ID must be exactly 13 digits',
  INVALID_NAME: 'Name can only contain letters and spaces',
  INVALID_INCOME: 'Please enter a valid income amount',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be less than ${max} characters`,
  MIN_AGE: 'You must be at least 18 years old',
  MAX_AGE: 'Age cannot exceed 120 years',
  NEGATIVE_INCOME: 'Monthly income must be at least 0',
  NEGATIVE_DEPENDENTS: 'Number of dependents cannot be negative',
  MAX_DEPENDENTS: 'Number of dependents cannot exceed 20',
  MAX_INCOME: 'Monthly income seems too high'
} as const;

export const VALIDATION_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  ADDRESS_MIN: 10,
  ADDRESS_MAX: 200,
  CITY_MIN: 2,
  CITY_MAX: 50,
  STATE_MIN: 2,
  STATE_MAX: 50,
  COUNTRY_MIN: 2,
  COUNTRY_MAX: 50,
  PHONE_MIN: 10,
  PHONE_MAX: 15,
  EMAIL_MAX: 100,
  DESCRIPTION_MIN: 20,
  DESCRIPTION_MAX: 1000,
  DEPENDENTS_MAX: 20,
  INCOME_MAX: 1000000,
  MIN_AGE: 18,
  MAX_AGE: 120
} as const;
