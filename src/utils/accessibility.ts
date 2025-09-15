export const generateId = (prefix: string = 'element'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getAriaDescribedBy = (...ids: (string | undefined)[]): string | undefined => {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
};

export const getAriaInvalid = (error?: string): boolean | undefined => {
  return error ? true : undefined;
};

export const getAriaRequired = (required?: boolean): boolean | undefined => {
  return required ? true : undefined;
};

export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const focusElement = (element: HTMLElement | null): void => {
  if (element) {
    element.focus();
  }
};

export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

export const getKeyboardNavigationProps = () => ({
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      (e.target as HTMLElement).click();
    }
  }
});
