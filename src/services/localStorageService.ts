const STORAGE_KEY = 'socialSupportFormData';
let isResetting = false;

export const setResettingFlag = (flag: boolean): void => {
  isResetting = flag;
};

export const getResettingFlag = (): boolean => {
  return isResetting;
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

export const saveFormData = (data: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
};

export const clearFormData = (): void => {
  try {
    console.log('Starting localStorage clear process...');
    
    setResettingFlag(true);
    
    localStorage.removeItem(STORAGE_KEY);
    console.log('Method 1: removeItem completed');
    
    if (localStorage.getItem(STORAGE_KEY)) {
      console.log('Data still exists, using localStorage.clear()');
      localStorage.clear();
    }
    
    localStorage.setItem(STORAGE_KEY, '');
    localStorage.removeItem(STORAGE_KEY);
    console.log('Method 3: empty string method completed');
    
    const remaining = localStorage.getItem(STORAGE_KEY);
    if (remaining) {
      console.warn('localStorage still contains data after clearing:', remaining);
      localStorage.clear();
      console.log('Used localStorage.clear() as last resort');
    }
    
    for (let i = 0; i < 5; i++) {
      localStorage.removeItem(STORAGE_KEY);
      if (!localStorage.getItem(STORAGE_KEY)) {
        break;
      }
    }
    
    console.log('Form data cleared from localStorage successfully');
    
    setTimeout(() => {
      setResettingFlag(false);
      console.log('Reset flag cleared');
    }, 1000);
    
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    try {
      localStorage.clear();
      console.log('Fallback: localStorage.clear() executed');
    } catch (clearError) {
      console.error('Failed to clear localStorage completely:', clearError);
    }
  }
};

export const nuclearClearFormData = (): void => {
  try {
    console.log('🚀 NUCLEAR OPTION: Complete localStorage clear');
    
    setResettingFlag(true);
    
    localStorage.clear();
    console.log('localStorage.clear() executed');
    
    setTimeout(() => {
      const remaining = localStorage.getItem(STORAGE_KEY);
      if (remaining) {
        console.error('❌ Data still exists after nuclear clear:', remaining);
        localStorage.clear();
      } else {
        console.log('✅ Nuclear clear successful - no data remaining');
      }
    }, 100);
    
    setTimeout(() => {
      setResettingFlag(false);
    }, 2000);
    
  } catch (error) {
    console.error('Nuclear clear failed:', error);
  }
};

export const isLocalStorageClear = (): boolean => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data === null || data === '' || data === '{}';
  } catch (error) {
    console.error('Error checking localStorage:', error);
    return true;
  }
};

export const directClearLocalStorage = clearFormData;
export const getCurrentLocalStorageData = getFormData;