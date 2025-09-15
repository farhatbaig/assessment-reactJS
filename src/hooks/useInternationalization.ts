import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useInternationalization = (setRTL: (isRTL: boolean) => void): void => {
  const { i18n } = useTranslation();

  const memoizedSetRTL = useCallback((isRTL: boolean) => {
    setRTL(isRTL);
  }, [setRTL]);

  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    memoizedSetRTL(isRTL);
    
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    const title = isRTL ? 'تطبيق الدعم الاجتماعي' : 'Social Support Application';
    document.title = title;
  }, [i18n.language, memoizedSetRTL]);
};

export const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const switchLanguage = (language: string): void => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = (): string => {
    return i18n.language;
  };

  const isRTL = (): boolean => {
    return i18n.language === 'ar';
  };

  return {
    switchLanguage,
    getCurrentLanguage,
    isRTL: isRTL(),
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
    ]
  };
};