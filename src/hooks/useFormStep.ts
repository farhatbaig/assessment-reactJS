import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormData } from '../types/form';

interface UseFormStepConfig<T> {
  schema: any;
  defaultValues: T;
  updateFormData: (data: Partial<FormData>) => void;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

export const useFormStep = <T extends Record<string, any>>({
  schema,
  defaultValues,
  updateFormData,
  mode = 'onChange'
}: UseFormStepConfig<T>) => {
  const hasInitialized = useRef<boolean>(false);

  const form = useForm<T>({
    resolver: yupResolver(schema) as any,
    defaultValues: defaultValues as any,
    mode
  });

  const { reset, watch } = form;

  useEffect(() => {
    const hasData = Object.values(defaultValues).some(value => 
      value && value.toString().trim() !== ''
    );

    if (hasData && !hasInitialized.current) {
      hasInitialized.current = true;
      reset(defaultValues as any);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    const subscription = watch((currentData) => {
      if (currentData) {
        updateFormData(currentData as Partial<FormData>);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  return form;
};