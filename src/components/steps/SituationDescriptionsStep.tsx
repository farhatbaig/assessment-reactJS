import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../contexts/FormContext';
import { Textarea, Button } from '../UI/index';
import { AIAssistanceDialog } from '../AIAssistanceDialog';
import { situationDescriptionsSchema } from '../../utils/validationSchemas';
import apiService from '../../services/apiService';
import { StepProps } from '../../types/form';
import { useFormStep } from '../../hooks/useFormStep';
import { useAIAssistanceDialog } from '../../hooks/useAIAssistance';
import { showSuccess, showError } from '../../utils/notifications';
import { directClearLocalStorage } from '../../services/localStorageService';
import { resetAllFormFields } from '../../utils/formReset';

interface SituationDescriptionsStepProps extends StepProps {
  onPrevious?: () => void;
  onSubmit?: () => Promise<void>;
}

export const SituationDescriptionsStep: React.FC<SituationDescriptionsStepProps> = ({ onPrevious, onSubmit }) => {
  const { t } = useTranslation();
  const { formData, updateFormData, setLoading, resetForm, isLoading } = useFormContext();
  const { isOpen, currentField, currentValue, openDialog, closeDialog } = useAIAssistanceDialog();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useFormStep({
    schema: situationDescriptionsSchema,
    defaultValues: {
      financialSituation: formData.financialSituation || '',
      employmentCircumstances: formData.employmentCircumstances || '',
      reasonForApplying: formData.reasonForApplying || ''
    },
    updateFormData,
    mode: 'onChange'
  });

  const formValues = watch();

  const isFormValid = isValid && 
    formValues.financialSituation?.trim() &&
    formValues.employmentCircumstances?.trim() &&
    formValues.reasonForApplying?.trim();

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const completeFormData = { ...formData, ...data };
      const result = await apiService.submitApplication(completeFormData);
      
      if (result.success) {
        showSuccess(
          t('success.applicationSubmitted'),
          t('success.title')
        );
        
        reset({
          financialSituation: '',
          employmentCircumstances: '',
          reasonForApplying: ''
        });
        
        const emptyFormData = resetAllFormFields();
        updateFormData(emptyFormData);
        directClearLocalStorage();
        
        try {
          localStorage.removeItem('socialSupportFormData');
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }
        
        resetForm();
        onSubmit?.();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      showError(
        t('errors.submissionFailed'),
        t('errors.submissionTitle')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAIAssistance = (fieldName: string) => {
    openDialog(fieldName, formValues[fieldName as keyof typeof formValues] || '');
  };

  const applySuggestion = (fieldName: string, suggestion: string) => {
    setValue(fieldName as keyof typeof formValues, suggestion, { shouldValidate: true, shouldDirty: true });
    closeDialog();
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('steps.step3')}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {t('form.situationDescriptions.description')}
          </p>
        </header>

        <div className="space-y-6">
          <div>
            <Textarea
              label={t('form.situationDescriptions.financialSituation')}
              error={errors.financialSituation?.message}
              required
              {...register('financialSituation')}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAIAssistance('financialSituation')}
              className="mt-2"
            >
              {t('ai.helpMeWrite', { field: t('form.situationDescriptions.financialSituation') })}
            </Button>
          </div>

          <div>
            <Textarea
              label={t('form.situationDescriptions.employmentCircumstances')}
              error={errors.employmentCircumstances?.message}
              required
              {...register('employmentCircumstances')}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAIAssistance('employmentCircumstances')}
              className="mt-2"
            >
              {t('ai.helpMeWrite', { field: t('form.situationDescriptions.employmentCircumstances') })}
            </Button>
          </div>

          <div>
            <Textarea
              label={t('form.situationDescriptions.reasonForApplying')}
              error={errors.reasonForApplying?.message}
              required
              {...register('reasonForApplying')}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAIAssistance('reasonForApplying')}
              className="mt-2"
            >
              {t('ai.helpMeWrite', { field: t('form.situationDescriptions.reasonForApplying') })}
            </Button>
          </div>
        </div>

        <footer className="flex justify-between pt-6">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onPrevious}
            className="min-w-32"
          >
            {t('buttons.previous')}
          </Button>
          
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || isLoading}
            className="min-w-32"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t('buttons.submitting') || 'Submitting...'}
              </div>
            ) : (
              t('buttons.submit')
            )}
          </Button>
        </footer>
      </form>

      {isOpen && currentField && (
        <AIAssistanceDialog
          isOpen={isOpen}
          onClose={closeDialog}
          currentValue={currentValue}
          onAccept={(suggestion: string) => applySuggestion(currentField || '', suggestion)}
          fieldType={currentField || ''}
        />
      )}
    </>
  );
};