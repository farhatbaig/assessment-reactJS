import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './UI/index';
import { useFormStep } from '../hooks/useFormStep';
import { useFormContext } from '../contexts/FormContext';

interface BaseFormStepProps {
  stepNumber: number;
  titleKey: string;
  descriptionKey: string;
  schema: any;
  defaultValues: any;
  onSubmit: (data: any) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  children: (formProps: {
    register: any;
    errors: any;
    isValid: boolean;
    formValues: any;
    isFormValid: boolean;
  }) => React.ReactNode;
  showPreviousButton?: boolean;
  submitButtonText?: string;
  submitButtonLoading?: boolean;
}

export const BaseFormStep: React.FC<BaseFormStepProps> = ({
  titleKey,
  descriptionKey,
  schema,
  defaultValues,
  onSubmit,
  onNext,
  onPrevious,
  children,
  showPreviousButton = false,
  submitButtonText,
  submitButtonLoading = false
}) => {
  const { t } = useTranslation();
  const { updateFormData } = useFormContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useFormStep({
    schema,
    defaultValues,
    updateFormData
  });

  const formValues = watch();

  const isFormValid = isValid && Object.values(formValues).every(value => 
    value && value.toString().trim() !== ''
  );

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    onNext?.();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t(titleKey)}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {t(descriptionKey)}
        </p>
      </header>

      <div className="space-y-6">
        {children({
          register,
          errors,
          isValid,
          formValues,
          isFormValid
        })}
      </div>

      <footer className="flex justify-between pt-6">
        {showPreviousButton ? (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onPrevious}
            className="min-w-32"
          >
            {t('buttons.previous')}
          </Button>
        ) : (
          <div />
        )}
        
        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid || submitButtonLoading}
          className="min-w-32"
        >
          {submitButtonLoading ? (
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
            submitButtonText || t('buttons.next')
          )}
        </Button>
      </footer>
    </form>
  );
};
