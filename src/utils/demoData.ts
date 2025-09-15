import { FormData } from '../types/form';

// Demo data for testing the application
export const demoFormData: FormData = {
  // Step 1: Personal Information
  name: 'John Doe',
  nationalId: '1234567890',
  dateOfBirth: '1990-01-15',
  gender: 'male',
  address: '123 Main Street, Apartment 4B',
  city: 'New York',
  state: 'NY',
  country: 'United States',
  phone: '+1-555-123-4567',
  email: 'john.doe@email.com',
  
  // Step 2: Family & Financial Info
  maritalStatus: 'single',
  dependents: 0,
  employmentStatus: 'unemployed',
  monthlyIncome: '0',
  housingStatus: 'rented',
  
  // Step 3: Situation Descriptions
  financialSituation: 'I am currently unemployed and have no source of income. My savings have been depleted and I am struggling to pay for basic necessities including rent, food, and utilities.',
  employmentCircumstances: 'I was laid off from my previous job as a software developer 6 months ago due to company downsizing. I have been actively searching for employment but have not been successful in finding a new position.',
  reasonForApplying: 'I am applying for financial assistance to help cover my basic living expenses while I continue to search for employment. This support would help me maintain housing stability and meet my essential needs during this difficult period.'
};

// Sample AI prompts for testing
export const sampleAIPrompts: Record<string, string> = {
  financialSituation: 'I am unemployed with no income. Help me describe my financial hardship.',
  employmentCircumstances: 'I lost my job 3 months ago and have been looking for work. Help me explain my employment situation.',
  reasonForApplying: 'I need financial help to pay rent and buy food. Help me write a compelling reason for applying.'
};
