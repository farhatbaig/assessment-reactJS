import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../contexts/FormContext';
import { Input, Select, Button } from '../ui/index';
import { familyFinancialSchema } from '../../utils/validationSchemas';
import { StepProps } from '../../types/form';
import { useFormStep } from '../../hooks/useFormStep';

interface FamilyFinancialStepProps extends StepProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

export const FamilyFinancialStep: React.FC<FamilyFinancialStepProps> = ({ onNext, onPrevious }) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useFormStep({
    schema: familyFinancialSchema,
    defaultValues: {
      maritalStatus: formData.maritalStatus || '',
      dependents: formData.dependents || 0,
      employmentStatus: formData.employmentStatus || '',
      monthlyIncome: formData.monthlyIncome || '',
      housingStatus: formData.housingStatus || ''
    },
    updateFormData
  });

  const formValues = watch();

  const isFormValid = isValid && 
    formValues.maritalStatus &&
    formValues.employmentStatus &&
    formValues.monthlyIncome &&
    formValues.housingStatus;

  const onSubmit = (data: any) => {
    const familyData = {
      ...data,
      dependents: Number(data.dependents) || 0
    };
    
    updateFormData(familyData);
    onNext?.();
  };

  const maritalStatusOptions = [
    { value: 'single', label: t('maritalStatus.single') },
    { value: 'married', label: t('maritalStatus.married') },
    { value: 'divorced', label: t('maritalStatus.divorced') },
    { value: 'widowed', label: t('maritalStatus.widowed') }
  ];

  const employmentStatusOptions = [
    { value: 'employed', label: t('employmentStatus.employed') },
    { value: 'unemployed', label: t('employmentStatus.unemployed') },
    { value: 'student', label: t('employmentStatus.student') },
    { value: 'retired', label: t('employmentStatus.retired') },
    { value: 'selfEmployed', label: t('employmentStatus.selfEmployed') }
  ];

  const housingStatusOptions = [
    { value: 'owned', label: t('housingStatus.owned') },
    { value: 'rented', label: t('housingStatus.rented') },
    { value: 'livingWithFamily', label: t('housingStatus.livingWithFamily') },
    { value: 'homeless', label: t('housingStatus.homeless') }
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('steps.step2')}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {t('form.familyFinancial.description')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Select
          label={t('form.familyFinancial.maritalStatus')}
          options={maritalStatusOptions}
          error={errors.maritalStatus?.message}
          required
          {...register('maritalStatus')}
        />

        <Input
          type="number"
          label={t('form.familyFinancial.dependents')}
          error={errors.dependents?.message}
          required
          {...register('dependents')}
        />

        <Select
          label={t('form.familyFinancial.employmentStatus')}
          options={employmentStatusOptions}
          error={errors.employmentStatus?.message}
          required
          {...register('employmentStatus')}
        />

        <Input
          type="number"
          label={t('form.familyFinancial.monthlyIncome')}
          error={errors.monthlyIncome?.message}
          required
          {...register('monthlyIncome')}
        />

        <Select
          label={t('form.familyFinancial.housingStatus')}
          options={housingStatusOptions}
          error={errors.housingStatus?.message}
          required
          {...register('housingStatus')}
        />
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
          disabled={!isFormValid}
          className="min-w-32"
        >
          {t('buttons.next')}
        </Button>
      </footer>
    </form>
  );
};