/**
 * Utility functions for localStorage management
 */

const STORAGE_KEY = 'socialSupportFormData';

// Global flag to disable persistence during reset
let isResetting = false;

export const setResettingFlag = (flag: boolean): void => {
  isResetting = flag;
};

export const getResettingFlag = (): boolean => {
  return isResetting;
};

/**
 * Forcefully clear localStorage data
 * This function ensures the data is completely removed
 */
export const clearFormData = (): void => {
  try {
    console.log('Starting localStorage clear process...');
    
    // Set global reset flag immediately
    setResettingFlag(true);
    
    // Method 1: Remove the specific key
    localStorage.removeItem(STORAGE_KEY);
    console.log('Method 1: removeItem completed');
    
    // Method 2: Double-check and clear if still exists
    if (localStorage.getItem(STORAGE_KEY)) {
      console.log('Data still exists, using localStorage.clear()');
      localStorage.clear();
    }
    
    // Method 3: Set to empty string as backup
    localStorage.setItem(STORAGE_KEY, '');
    localStorage.removeItem(STORAGE_KEY);
    console.log('Method 3: empty string method completed');
    
    // Method 4: Verify it's actually gone
    const remaining = localStorage.getItem(STORAGE_KEY);
    if (remaining) {
      console.warn('localStorage still contains data after clearing:', remaining);
      // Last resort: clear everything
      localStorage.clear();
      console.log('Used localStorage.clear() as last resort');
    }
    
    // Method 5: Force clear with multiple attempts
    for (let i = 0; i < 5; i++) {
      localStorage.removeItem(STORAGE_KEY);
      if (!localStorage.getItem(STORAGE_KEY)) {
        break;
      }
    }
    
    console.log('Form data cleared from localStorage successfully');
    
    // Keep reset flag active for a bit longer
    setTimeout(() => {
      setResettingFlag(false);
      console.log('Reset flag cleared');
    }, 1000);
    
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    // Fallback: try to clear everything
    try {
      localStorage.clear();
      console.log('Fallback: localStorage.clear() executed');
    } catch (clearError) {
      console.error('Failed to clear localStorage completely:', clearError);
    }
  }
};

/**
 * Check if form data exists in localStorage
 */
export const hasFormData = (): boolean => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data !== null && data !== '' && data !== '{}';
  } catch (error) {
    console.error('Error checking localStorage:', error);
    return false;
  }
};

/**
 * Get form data from localStorage
 */
export const getFormData = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error getting localStorage data:', error);
    return null;
  }
};

/**
 * Nuclear option - completely clear localStorage and verify
 */
export const nuclearClearFormData = (): void => {
  try {
    console.log('🚀 NUCLEAR OPTION: Complete localStorage clear');
    
    // Set reset flag
    setResettingFlag(true);
    
    // Clear everything
    localStorage.clear();
    console.log('localStorage.clear() executed');
    
    // Wait a bit and verify
    setTimeout(() => {
      const remaining = localStorage.getItem(STORAGE_KEY);
      if (remaining) {
        console.error('❌ Data still exists after nuclear clear:', remaining);
        // Try again
        localStorage.clear();
      } else {
        console.log('✅ Nuclear clear successful - no data remaining');
      }
    }, 100);
    
    // Reset flag after delay
    setTimeout(() => {
      setResettingFlag(false);
    }, 2000);
    
  } catch (error) {
    console.error('Nuclear clear failed:', error);
  }
};
