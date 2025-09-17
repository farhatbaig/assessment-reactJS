import React from 'react';
import { Button } from './ui/index';
import { useLanguageSwitcher } from '../hooks/useInternationalization';

export const LanguageSwitcher: React.FC = () => {
  const { switchLanguage, getCurrentLanguage, isRTL, availableLanguages } = useLanguageSwitcher();

  const currentLanguage = getCurrentLanguage();

  return (
    <div 
      className={`fixed top-4 z-50 ${isRTL ? 'left-4' : 'right-4'}`}
      role="region"
      aria-label="Language selection"
    >
      <div className="flex space-x-2 bg-white rounded-lg shadow-lg p-1 border">
        {availableLanguages.map((language) => (
          <Button
            key={language.code}
            variant={currentLanguage === language.code ? 'primary' : 'outline'}
            size="sm"
            onClick={() => switchLanguage(language.code)}
            className="min-w-16"
            aria-pressed={currentLanguage === language.code}
            aria-label={`Switch to ${language.name}`}
          >
            {language.nativeName}
          </Button>
        ))}
      </div>
    </div>
  );
};