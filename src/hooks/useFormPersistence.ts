import { useEffect, useRef, useMemo } from 'react';
import { FormData } from '../types/form';
import { getResettingFlag, saveFormData } from '../services/localStorageService';
import { EMPTY_FORM_DATA } from '../constants';

export const useFormPersistence = (formData: FormData, currentStep: number, isResetting: boolean = false): void => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  const dataToSave = useMemo(() => ({
    formData,
    currentStep,
    timestamp: new Date().toISOString()
  }), [formData, currentStep]);

  const dataString = useMemo(() => JSON.stringify(dataToSave), [dataToSave]);

  useEffect(() => {
    if (isResetting || getResettingFlag()) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      return;
    }

    const isFormReset = currentStep === 1 && 
      Object.values(formData).every(value => 
        !value || value.toString().trim() === '' || value === 0
      );

    if (isFormReset) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      return;
    }

    if (dataString !== lastSavedDataRef.current) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          saveFormData(dataString);
          lastSavedDataRef.current = dataString;
        } catch (error) {
          console.error('Error saving form data to localStorage:', error);
        }
      }, 300);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [dataString, currentStep, formData, isResetting]);
};

export const useInitialFormData = (): { currentStep: number; formData: FormData } => {
  const getDefaultFormData = (): FormData => EMPTY_FORM_DATA;

  try {
    const savedData = localStorage.getItem('socialSupportFormData');
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      if (parsedData && typeof parsedData === 'object') {
        const loadedStep = Math.max(1, Math.min(3, parsedData.currentStep || 1));
        
        return {
          currentStep: loadedStep,
          formData: {
            ...getDefaultFormData(),
            ...parsedData.formData
          }
        };
      }
    }
  } catch (error) {
    console.error('Error loading saved form data:', error);
    localStorage.removeItem('socialSupportFormData');
  }
  
  return {
    currentStep: 1,
    formData: getDefaultFormData()
  };
};