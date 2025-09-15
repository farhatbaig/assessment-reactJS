import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../contexts/FormContext';
import { Input, Select } from '../UI/index';
import { BaseFormStep } from '../BaseFormStep';
import { personalInfoSchema } from '../../utils/validationSchemas';
import { StepProps } from '../../types/form';
import { FORM_OPTIONS, getTranslatedOptions } from '../../constants';

interface PersonalInfoStepProps extends StepProps {
  onNext?: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ onNext }) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormContext();

  const defaultValues = {
    name: formData.name || '',
    nationalId: formData.nationalId || '',
    dateOfBirth: formData.dateOfBirth || '',
    gender: formData.gender || '',
    address: formData.address || '',
    city: formData.city || '',
    state: formData.state || '',
    country: formData.country || '',
    phone: formData.phone || '',
    email: formData.email || ''
  };

  const onSubmit = (data: any) => {
    const personalData = {
      ...data,
      dateOfBirth: data.dateOfBirth instanceof Date 
        ? data.dateOfBirth.toISOString().split('T')[0] 
        : data.dateOfBirth
    };
    
    updateFormData(personalData);
    onNext?.();
  };

  const genderOptions = getTranslatedOptions(FORM_OPTIONS.GENDER, t);

  return (
    <BaseFormStep
      stepNumber={1}
      titleKey="steps.step1"
      descriptionKey="form.personalInfo.description"
      schema={personalInfoSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onNext={onNext}
    >
      {({ register, errors }) => (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label={t('form.personalInfo.name')}
            error={errors.name?.message}
            required
            {...register('name')}
          />

          <Input
            label={t('form.personalInfo.nationalId')}
            error={errors.nationalId?.message}
            required
            {...register('nationalId')}
          />

          <Input
            type="date"
            label={t('form.personalInfo.dateOfBirth')}
            error={errors.dateOfBirth?.message}
            required
            {...register('dateOfBirth')}
          />

          <Select
            label={t('form.personalInfo.gender')}
            options={genderOptions}
            error={errors.gender?.message}
            required
            {...register('gender')}
          />

          <div className="sm:col-span-2">
            <Input
              label={t('form.personalInfo.address')}
              error={errors.address?.message}
              required
              {...register('address')}
            />
          </div>

          <Input
            label={t('form.personalInfo.city')}
            error={errors.city?.message}
            required
            {...register('city')}
          />

          <Input
            label={t('form.personalInfo.state')}
            error={errors.state?.message}
            required
            {...register('state')}
          />

          <Input
            label={t('form.personalInfo.country')}
            error={errors.country?.message}
            required
            {...register('country')}
          />

          <Input
            type="tel"
            label={t('form.personalInfo.phone')}
            error={errors.phone?.message}
            required
            {...register('phone')}
          />

          <Input
            type="email"
            label={t('form.personalInfo.email')}
            error={errors.email?.message}
            required
            {...register('email')}
          />
        </div>
      )}
    </BaseFormStep>
  );
};