import { useState, useCallback } from 'react';

interface UseErrorHandlingReturn {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  handleAsyncError: <T>(
    asyncFn: () => Promise<T>,
    errorMessage?: string
  ) => Promise<T | null>;
}

export const useErrorHandling = (): UseErrorHandlingReturn => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      setError(null);
      return await asyncFn();
    } catch (err) {
      const message = errorMessage || (err as Error).message || 'An unexpected error occurred';
      setError(message);
      console.error('Async operation failed:', err);
      return null;
    }
  }, []);

  return {
    error,
    setError,
    clearError,
    handleAsyncError
  };
};

export const useFormErrorHandling = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((fieldName: string, errorMessage: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return fieldErrors[fieldName];
  }, [fieldErrors]);

  const hasErrors = Object.keys(fieldErrors).length > 0;

  return {
    fieldErrors,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    getFieldError,
    hasErrors
  };
};