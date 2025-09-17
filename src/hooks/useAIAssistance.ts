import { useState, useCallback } from 'react';
import aiService from '../services/aiService';

interface UseAIAssistanceReturn {
  isGenerating: boolean;
  error: string | null;
  generateSuggestion: (fieldType: string, context?: string) => Promise<string>;
  clearError: () => void;
  isReady: boolean;
}

export const useAIAssistance = (): UseAIAssistanceReturn => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestion = useCallback(async (
    fieldType: string, 
    context: string = ''
  ): Promise<string> => {
    if (!aiService.isReady()) {
      throw new Error('AI service is not configured. Please check your API key.');
    }

    setIsGenerating(true);
    setError(null);

    try {
      const suggestion = await aiService.generateSuggestion(fieldType, context);
      return suggestion;
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to generate suggestion';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isReady = aiService.isReady();

  return {
    isGenerating,
    error,
    generateSuggestion,
    clearError,
    isReady
  };
};

export const useAIAssistanceDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<string>('');
  const [preGeneratedSuggestion, setPreGeneratedSuggestion] = useState<string>('');

  const openDialog = useCallback((fieldType: string, value: string = '', suggestion: string = '') => {
    setCurrentField(fieldType);
    setCurrentValue(value);
    setPreGeneratedSuggestion(suggestion);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setCurrentField(null);
    setCurrentValue('');
    setPreGeneratedSuggestion('');
  }, []);

  return {
    isOpen,
    currentField,
    currentValue,
    preGeneratedSuggestion,
    openDialog,
    closeDialog
  };
};