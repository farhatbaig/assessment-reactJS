

const STORAGE_KEY = 'socialSupportFormData';

let isResetting = false;

export const setResettingFlag = (flag: boolean): void => {
  isResetting = flag;
};

export const getResettingFlag = (): boolean => {
  return isResetting;
};


export const clearFormData = (): void => {
  try {
    
    setResettingFlag(true);
    
    localStorage.removeItem(STORAGE_KEY);
    
    if (localStorage.getItem(STORAGE_KEY)) {
      localStorage.clear();
    }
    
    localStorage.setItem(STORAGE_KEY, '');
    localStorage.removeItem(STORAGE_KEY);
    
    const remaining = localStorage.getItem(STORAGE_KEY);
    if (remaining) {
      console.warn('localStorage still contains data after clearing:', remaining);
      localStorage.clear();
    }
    
    for (let i = 0; i < 5; i++) {
      localStorage.removeItem(STORAGE_KEY);
      if (!localStorage.getItem(STORAGE_KEY)) {
        break;
      }
    }
    
    
    setTimeout(() => {
      setResettingFlag(false);
    }, 1000);
    
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    try {
      localStorage.clear();
    } catch (clearError) {
      console.error('Failed to clear localStorage completely:', clearError);
    }
  }
};


export const hasFormData = (): boolean => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data !== null && data !== '' && data !== '{}';
  } catch (error) {
    console.error('Error checking localStorage:', error);
    return false;
  }
};


export const getFormData = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error getting localStorage data:', error);
    return null;
  }
};


export const nuclearClearFormData = (): void => {
  try {
    
    setResettingFlag(true);
    
    localStorage.clear();
    
    setTimeout(() => {
      const remaining = localStorage.getItem(STORAGE_KEY);
      if (remaining) {
        console.error('Data still exists after nuclear clear:', remaining);
        localStorage.clear();
      } else {
      }
    }, 100);
    
    setTimeout(() => {
      setResettingFlag(false);
    }, 2000);
    
  } catch (error) {
    console.error('Nuclear clear failed:', error);
  }
};
