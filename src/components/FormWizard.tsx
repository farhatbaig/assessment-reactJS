import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../contexts/FormContext';
import { ProgressStepper } from './ProgressStepper';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { FamilyFinancialStep } from './steps/FamilyFinancialStep';
import { SituationDescriptionsStep } from './steps/SituationDescriptionsStep';
import { Alert } from './ui/index';

export const FormWizard: React.FC = () => {
  const { t } = useTranslation();
  const { 
    currentStep, 
    setCurrentStep, 
    error, 
    setError
  } = useFormContext();

  const steps = [
    t('steps.step1'),
    t('steps.step2'),
    t('steps.step3')
  ];

  const handleNext = (): void => {
    const nextStep = Math.min(3, currentStep + 1);
    setCurrentStep(nextStep);
  };

  const handlePrevious = (): void => {
    const prevStep = Math.max(1, currentStep - 1);
    setCurrentStep(prevStep);
  };

  const handleStepClick = (step: number): void => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setError(null);
    }
  };

  const handleFormSubmissionComplete = async (): Promise<void> => {
    setCurrentStep(1);
    setError(null);
  };

  const renderStepContent = (): React.ReactElement | null => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep onNext={handleNext} />;
      case 2:
        return <FamilyFinancialStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return (
          <SituationDescriptionsStep 
            onPrevious={handlePrevious} 
            onSubmit={handleFormSubmissionComplete} 
          />
        );
      default:
        return null;
    }
  };

  const handleErrorDismiss = (): void => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {t('app.title')}
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t('app.subtitle')}
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6" aria-label="Form progress">
            <ProgressStepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </section>

          <main 
            id="main-content"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8" 
            role="main"
            tabIndex={-1}
          >
            {renderStepContent()}
          </main>

          {error && (
            <Alert variant="error" role="alert">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={handleErrorDismiss}
                  className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                  aria-label={t('buttons.closeError')}
                >
                  <svg 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};