import { FormData } from '../types/form';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  applicationId?: string;
}

interface FormServiceConfig {
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
}

export class FormService {
  private config: Required<FormServiceConfig>;

  constructor(config: FormServiceConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 10000,
      retryAttempts: config.retryAttempts || 3
    };
  }

  private async makeRequest(
    url: string, 
    options: RequestInit, 
    attempt: number = 1
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        console.warn(`Request failed, retrying... (${attempt}/${this.config.retryAttempts})`);
        await this.delay(1000 * attempt);
        return this.makeRequest(url, options, attempt + 1);
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private validateFormData(data: FormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const requiredFields = [
      'name', 'nationalId', 'dateOfBirth', 'gender', 'address',
      'city', 'state', 'country', 'phone', 'email',
      'maritalStatus', 'employmentStatus', 'monthlyIncome', 'housingStatus',
      'financialSituation', 'employmentCircumstances', 'reasonForApplying'
    ];

    requiredFields.forEach(field => {
      const value = data[field as keyof FormData];
      if (!value || value.toString().trim() === '') {
        errors.push(`Field ${field} is required`);
      }
    });

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.push('Invalid phone format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async saveProgress(formData: FormData, currentStep: number): Promise<ApiResponse> {
    try {
      const url = `${this.config.baseURL}/api/form/save-progress`;
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          formData,
          currentStep,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving progress:', error);
      return {
        success: false,
        message: 'Failed to save progress. Please try again.'
      };
    }
  }

  async submitApplication(formData: FormData): Promise<ApiResponse> {
    try {
      const validation = this.validateFormData(formData);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      const url = `${this.config.baseURL}/api/form/submit`;
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        })
      });

      const result = await response.json();
      
      if (result.success && !result.applicationId) {
        result.applicationId = `APP-${Date.now()}`;
      }

      return result;
    } catch (error) {
      console.error('Error submitting application:', error);
      return {
        success: false,
        message: 'Failed to submit application. Please try again.'
      };
    }
  }

  async loadSavedData(userId?: string): Promise<ApiResponse<FormData>> {
    try {
      const url = userId 
        ? `${this.config.baseURL}/api/form/load/${userId}`
        : `${this.config.baseURL}/api/form/load`;
      
      const response = await this.makeRequest(url, {
        method: 'GET'
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error loading saved data:', error);
      return {
        success: false,
        message: 'Failed to load saved data.',
        data: {} as FormData
      };
    }
  }

  async deleteSavedData(userId?: string): Promise<ApiResponse> {
    try {
      const url = userId 
        ? `${this.config.baseURL}/api/form/delete/${userId}`
        : `${this.config.baseURL}/api/form/delete`;
      
      const response = await this.makeRequest(url, {
        method: 'DELETE'
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting saved data:', error);
      return {
        success: false,
        message: 'Failed to delete saved data.'
      };
    }
  }
}

export const createFormService = (config?: FormServiceConfig): FormService => {
  return new FormService(config);
};

export const formService = createFormService();
