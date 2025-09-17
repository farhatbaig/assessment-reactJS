import { FormData } from '../types/form';

interface ApiResponse {
  success: boolean;
  applicationId?: string;
  message: string;
  data?: FormData;
}

class ApiService {
  async submitApplication(formData: FormData): Promise<ApiResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse: ApiResponse = {
        success: true,
        applicationId: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: 'Application submitted successfully!',
        data: formData
      };
      
      console.log('Mock API - Application submitted:', mockResponse);
      return mockResponse;
    } catch (error) {
      console.error('Mock API - Submission failed:', error);
      throw new Error('Failed to submit application. Please try again.');
    }
  }

  async saveProgress(formData: FormData): Promise<ApiResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: ApiResponse = {
        success: true,
        message: 'Progress saved successfully!',
        data: formData
      };
      
      console.log('Mock API - Progress saved:', mockResponse);
      return mockResponse;
    } catch (error) {
      console.error('Mock API - Save failed:', error);
      throw new Error('Failed to save progress. Please try again.');
    }
  }

  async getApplication(_id: string): Promise<ApiResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: ApiResponse = {
        success: true,
        message: 'Application retrieved successfully!',
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
        } as FormData
      };
      
      console.log('Mock API - Application retrieved:', mockResponse);
      return mockResponse;
    } catch (error) {
      console.error('Mock API - Fetch failed:', error);
      throw new Error('Failed to fetch application. Please try again.');
    }
  }

  async testErrorScenarios(scenario: '401' | '500' | 'network' | 'success'): Promise<ApiResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (scenario === '401') {
        const error = new Error('Unauthorized') as any;
        error.response = {
          status: 401,
          data: { message: 'Authentication required. Please log in again.' }
        };
        throw error;
      } else if (scenario === '500') {
        const error = new Error('Server Error') as any;
        error.response = {
          status: 500,
          data: { message: 'Internal server error. Please try again later.' }
        };
        throw error;
      } else if (scenario === 'network') {
        const error = new Error('Network Error') as any;
        error.request = {};
        throw error;
      } else {
        return {
          success: true,
          message: 'Test completed successfully!',
          data: {} as FormData
        };
      }
    } catch (error) {
      console.error('Mock API - Test scenario failed:', error);
      throw error;
    }
  }
}

export default new ApiService();