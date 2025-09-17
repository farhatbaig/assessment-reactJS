
export const FORM_OPTIONS = {
  GENDER: [
    { value: 'male', labelKey: 'gender.male' },
    { value: 'female', labelKey: 'gender.female' },
    { value: 'other', labelKey: 'gender.other' }
  ],
  
  MARITAL_STATUS: [
    { value: 'single', labelKey: 'maritalStatus.single' },
    { value: 'married', labelKey: 'maritalStatus.married' },
    { value: 'divorced', labelKey: 'maritalStatus.divorced' },
    { value: 'widowed', labelKey: 'maritalStatus.widowed' }
  ],
  
  EMPLOYMENT_STATUS: [
    { value: 'employed', labelKey: 'employmentStatus.employed' },
    { value: 'unemployed', labelKey: 'employmentStatus.unemployed' },
    { value: 'student', labelKey: 'employmentStatus.student' },
    { value: 'retired', labelKey: 'employmentStatus.retired' },
    { value: 'selfEmployed', labelKey: 'employmentStatus.selfEmployed' }
  ],

  COUNTRY_OPTIONS: [
    { value: 'us', labelKey: 'country.us' },
    { value: 'uk', labelKey: 'country.uk' },
    { value: 'ca', labelKey: 'country.ca' },
    { value: 'ae', labelKey: 'country.ae' },
    { value: 'pk', labelKey: 'country.pk' },
    { value: 'in', labelKey: 'country.in' }
  ],
  
  HOUSING_STATUS: [
    { value: 'owned', labelKey: 'housingStatus.owned' },
    { value: 'rented', labelKey: 'housingStatus.rented' },
    { value: 'livingWithFamily', labelKey: 'housingStatus.livingWithFamily' },
    { value: 'homeless', labelKey: 'housingStatus.homeless' }
  ]
} as const;

export const getTranslatedOptions = (options: typeof FORM_OPTIONS[keyof typeof FORM_OPTIONS], t: (key: string) => string) => {
  return options.map(option => ({
    value: option.value,
    label: t(option.labelKey)
  }));
};
