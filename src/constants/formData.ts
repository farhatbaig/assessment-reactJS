import { FormData } from '../types/form';

export const EMPTY_FORM_DATA: FormData = {
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
};

export const FORM_FIELD_KEYS = [
  'name', 'nationalId', 'dateOfBirth', 'gender', 'address',
  'city', 'state', 'country', 'phone', 'email',
  'maritalStatus', 'dependents', 'employmentStatus', 'monthlyIncome', 'housingStatus',
  'financialSituation', 'employmentCircumstances', 'reasonForApplying'
] as const;

export const TOTAL_FORM_FIELDS = FORM_FIELD_KEYS.length;

export const REQUIRED_FIELDS = {
  PERSONAL_INFO: ['name', 'nationalId', 'dateOfBirth', 'gender', 'address', 'city', 'state', 'country', 'phone', 'email'] as const,
  FAMILY_FINANCIAL: ['maritalStatus', 'employmentStatus', 'monthlyIncome', 'housingStatus'] as const,
  SITUATION_DESCRIPTIONS: ['financialSituation', 'employmentCircumstances', 'reasonForApplying'] as const
} as const;
