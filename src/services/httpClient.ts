import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          const { status } = error.response;
          
          switch (status) {
            case 401:
              this.handleUnauthorized();
              break;
            case 500:
              this.handleServerError();
              break;
            case 403:
              this.handleForbidden();
              break;
            case 404:
              this.handleNotFound();
              break;
            default:
              this.handleGenericError(error);
          }
        } else if (error.request) {
          this.handleNetworkError();
        } else {
          this.handleGenericError(error);
        }
        
        return Promise.reject(error);
      }
    );
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  }

  private handleServerError(): void {
    console.error('Server Error: Please try again later');
  }

  private handleForbidden(): void {
    console.error('Access Forbidden: You do not have permission to perform this action');
  }

  private handleNotFound(): void {
    console.error('Resource Not Found: The requested resource was not found');
  }

  private handleNetworkError(): void {
    console.error('Network Error: Please check your internet connection');
  }

  private handleGenericError(error: AxiosError): void {
    console.error('An unexpected error occurred:', error.message);
  }

  public get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  public patch<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }
}

export default new HttpClient();

