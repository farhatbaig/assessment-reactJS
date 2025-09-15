import { FormData } from '../types/form';

interface ApiResponse {
  success: boolean;
  applicationId?: string;
  message: string;
  data?: FormData;
}

class ApiService {
  constructor() {
    // this.baseURL = 'https://api.example.com';
  }

  async submitApplication(formData: FormData): Promise<ApiResponse> {
    try {
      await this.delay(2000);
      
      const response: ApiResponse = {
        success: true,
        applicationId: `APP-${Date.now()}`,
        message: 'Application submitted successfully',
        data: formData
      };
      
      console.log('Mock API Response:', response);
      return response;
    } catch (error) {
      console.error('Submission Error:', error);
      throw new Error('Failed to submit application. Please try again.');
    }
  }

  async saveProgress(formData: FormData): Promise<ApiResponse> {
    try {
      await this.delay(1000);
      
      const response: ApiResponse = {
        success: true,
        message: 'Progress saved successfully',
        data: formData
      };
      
      console.log('Progress saved:', response);
      return response;
    } catch (error) {
      console.error('Save Progress Error:', error);
      throw new Error('Failed to save progress. Please try again.');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ApiService();