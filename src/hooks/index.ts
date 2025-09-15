/**
 * Custom Hooks Barrel Export
 * 
 * This file exports all custom hooks for easy importing
 */

// Form-related hooks
export { useFormPersistence, useInitialFormData } from './useFormPersistence';
export { useFormStep } from './useFormStep';
export { useFormBusinessLogic } from './useFormBusinessLogic';

// Internationalization hooks
export { useInternationalization, useLanguageSwitcher } from './useInternationalization';

// AI assistance hooks
export { useAIAssistance, useAIAssistanceDialog } from './useAIAssistance';

// Error handling hooks
export { useErrorHandling, useFormErrorHandling } from './useErrorHandling';
