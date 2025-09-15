import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormData, FormContextType } from '../types/form';
import { useFormPersistence, useInitialFormData } from '../hooks/useFormPersistence';
import { clearFormData, setResettingFlag, nuclearClearFormData } from '../services/localStorageService';
import { EMPTY_FORM_DATA } from '../constants';

interface FormState {
  currentStep: number;
  formData: FormData;
  isRTL: boolean;
  isLoading: boolean;
  error: string | null;
  isResetting: boolean;
}

type FormAction = 
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<FormData> }
  | { type: 'SET_RTL'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RESETTING'; payload: boolean }
  | { type: 'RESET_FORM' };

interface FormProviderProps {
  children: ReactNode;
}

const MIN_STEP = 1;
const MAX_STEP = 3;

const createFormReducer = () => (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: Math.max(MIN_STEP, Math.min(MAX_STEP, action.payload))
      };

    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      };

    case 'SET_RTL':
      return {
        ...state,
        isRTL: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'SET_RESETTING':
      return {
        ...state,
        isResetting: action.payload
      };

    case 'RESET_FORM':
      return {
        ...state,
        currentStep: MIN_STEP,
        formData: EMPTY_FORM_DATA,
        isLoading: false,
        error: null,
        isResetting: false
      };

    default:
      return state;
  }
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const initialData = React.useMemo(() => useInitialFormData(), []);
  const formReducer = React.useMemo(() => createFormReducer(), []);
  
  const [state, dispatch] = useReducer(formReducer, {
    currentStep: initialData.currentStep,
    formData: initialData.formData,
    isRTL: false,
    isLoading: false,
    error: null,
    isResetting: false,
  });

  useFormPersistence(state.formData, state.currentStep, state.isResetting);
  
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const updateRTL = () => {
      const isRTL = i18n.language === 'ar';
      dispatch({ type: 'SET_RTL', payload: isRTL });
      
      document.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = i18n.language;
      
      const title = isRTL ? 'تطبيق الدعم الاجتماعي' : 'Social Support Application';
      document.title = title;
    };
    
    updateRTL();
    i18n.on('languageChanged', updateRTL);
    
    return () => {
      i18n.off('languageChanged', updateRTL);
    };
  }, [i18n]);

  const setCurrentStep = useCallback((step: number): void => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  }, []);

  const updateFormData = useCallback((data: Partial<FormData>): void => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  const setLoading = useCallback((loading: boolean): void => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null): void => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const resetForm = useCallback((): void => {
    dispatch({ type: 'SET_RESETTING', payload: true });
    setResettingFlag(true);
    
    clearFormData();
    
    setTimeout(() => {
      const remaining = localStorage.getItem('socialSupportFormData');
      if (remaining) {
        nuclearClearFormData();
      }
    }, 200);
    
    setTimeout(() => {
      dispatch({ type: 'RESET_FORM' });
    }, 500);
  }, []);

  const value: FormContextType = useMemo(() => ({
    ...state,
    setCurrentStep,
    updateFormData,
    setLoading,
    setError,
    resetForm
  }), [
    state,
    setCurrentStep,
    updateFormData,
    setLoading,
    setError,
    resetForm
  ]);

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  
  return context;
};