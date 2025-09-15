import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Alert } from './UI/index';
import { useAIAssistance } from '../hooks/useAIAssistance';

interface AIAssistanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fieldType: string;
  currentValue: string;
  onAccept: (value: string) => void;
}

export const AIAssistanceDialog: React.FC<AIAssistanceDialogProps> = ({
  isOpen,
  onClose,
  fieldType,
  currentValue,
  onAccept
}) => {
  const { t } = useTranslation();
  const { isGenerating, error, generateSuggestion, clearError, isReady } = useAIAssistance();
  
  const [suggestion, setSuggestion] = useState<string>('');
  const [editedSuggestion, setEditedSuggestion] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && fieldType && isReady) {
      generateSuggestionForField();
    }
  }, [isOpen, fieldType, isReady]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const generateSuggestionForField = async (): Promise<void> => {
    try {
      const context = currentValue ? `Current text: ${currentValue}` : '';
      const generatedText = await generateSuggestion(fieldType, context);
      setSuggestion(generatedText);
      setEditedSuggestion(generatedText);
    } catch (err) {
      console.error('Failed to generate suggestion:', err);
    }
  };

  const handleAccept = (): void => {
    onAccept(isEditing ? editedSuggestion : suggestion);
    handleClose();
  };

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleDiscard = (): void => {
    handleClose();
  };

  const handleClose = (): void => {
    setIsEditing(false);
    setSuggestion('');
    setEditedSuggestion('');
    clearError();
    onClose();
  };

  const handleRetry = (): void => {
    generateSuggestionForField();
  };

  const handleBackdropClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    handleClose();
  };

  const handleModalContentClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-dialog-title"
      style={{ zIndex: 9999 }}
    >
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleBackdropClick}
          aria-hidden="true"
          style={{ zIndex: 9998 }}
        />
        
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
          style={{ zIndex: 9999 }}
          onClick={handleModalContentClick}
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 
                id="ai-dialog-title"
                className="text-lg font-medium text-gray-900"
              >
                {t('ai.suggestion')}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={t('buttons.close')}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isGenerating && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true" />
                <span className="ml-3 text-gray-600">
                  {t('ai.generating')}
                </span>
              </div>
            )}

            {error && (
              <Alert variant="error" className="mb-4">
                <div className="flex justify-between items-center">
                  <span>{error}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    aria-label={t('buttons.retry')}
                  >
                    {t('buttons.retry')}
                  </Button>
                </div>
              </Alert>
            )}

            {suggestion && !isGenerating && (
              <div className="space-y-4">
                {!isEditing ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {suggestion}
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={editedSuggestion}
                    onChange={(e) => setEditedSuggestion(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                    placeholder={t('ai.editPlaceholder')}
                    aria-label={t('ai.editLabel')}
                  />
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              onClick={handleDiscard}
              variant="outline"
              className="w-full sm:w-auto sm:ml-3"
              aria-label={t('buttons.discard')}
            >
              {t('buttons.discard')}
            </Button>
            
            {suggestion && !isGenerating && (
              <>
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    variant="secondary"
                    className="w-full sm:w-auto sm:ml-3"
                    aria-label={t('buttons.edit')}
                  >
                    {t('buttons.edit')}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="secondary"
                    className="w-full sm:w-auto sm:ml-3"
                    aria-label={t('buttons.cancelEdit')}
                  >
                    {t('buttons.cancelEdit')}
                  </Button>
                )}
                
                <Button
                  onClick={handleAccept}
                  className="w-full sm:w-auto"
                  aria-label={t('buttons.accept')}
                >
                  {t('buttons.accept')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};