import { APP_CONFIG } from '../../config/app.config';
import { ApiError, NetworkError, TimeoutError } from '../errors/api.errors';
import { Logger } from '../utils/logger.service';

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  signal?: AbortSignal;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class BaseApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: ((config: ApiRequestConfig) => ApiRequestConfig)[] = [];
  private responseInterceptors: ((response: ApiResponse) => ApiResponse)[] = [];

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || APP_CONFIG.api.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Version': APP_CONFIG.version,
      'X-Client-Platform': 'mobile',
    };
  }

  // Interceptor management
  addRequestInterceptor(interceptor: (config: ApiRequestConfig) => ApiRequestConfig) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: (response: ApiResponse) => ApiResponse) {
    this.responseInterceptors.push(interceptor);
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Main request method
  async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const requestConfig = this.buildRequestConfig(config);

    Logger.debug('API Request', { url, config: requestConfig });

    try {
      const response = await this.executeRequest<T>(url, requestConfig);
      return this.processResponse(response);
    } catch (error) {
      Logger.error('API Request Failed', { url, error });
      throw this.handleError(error);
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  async put<T = any>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  async patch<T = any>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body: data });
  }

  async delete<T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Upload method for file uploads
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>
  ) {
    const uploadConfig = {
      ...config,
      method: 'POST' as const,
      body: formData,
      headers: {
        ...config?.headers,
        // Remove Content-Type to let browser set it with boundary
      },
    };
    
    // Remove Content-Type from headers for FormData
    delete uploadConfig.headers!['Content-Type'];
    
    return this.request<T>(endpoint, uploadConfig);
  }

  // Paginated request helper
  async getPaginated<T = any>(
    endpoint: string,
    params: { page?: number; limit?: number; [key: string]: any } = {}
  ): Promise<PaginatedResponse<T>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
    const response = await this.get<PaginatedResponse<T>>(url);
    
    return response.data;
  }

  // Private methods
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) return endpoint;
    
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  private buildRequestConfig(config: ApiRequestConfig): RequestInit {
    // Apply request interceptors
    let processedConfig = { ...config };
    this.requestInterceptors.forEach(interceptor => {
      processedConfig = interceptor(processedConfig);
    });

    const headers = {
      ...this.defaultHeaders,
      ...processedConfig.headers,
    };

    let body: string | FormData | undefined;
    if (processedConfig.body) {
      if (processedConfig.body instanceof FormData) {
        body = processedConfig.body;
        // Remove Content-Type for FormData
        delete headers['Content-Type'];
      } else {
        body = JSON.stringify(processedConfig.body);
      }
    }

    return {
      method: processedConfig.method || 'GET',
      headers,
      body,
      signal: processedConfig.signal,
    };
  }

  private async executeRequest<T>(
    url: string,
    config: RequestInit
  ): Promise<Response> {
    const timeout = APP_CONFIG.api.timeout;
    const retries = APP_CONFIG.api.retryAttempts;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...config,
          signal: config.signal || controller.signal,
        });

        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            await this.safeParseResponse(response)
          );
        }

        return response;
      } catch (error) {
        if (attempt === retries) throw error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Wait before retry with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new NetworkError('Max retries exceeded');
  }

  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await this.safeParseResponse<T>(response);
    
    let apiResponse: ApiResponse<T> = {
      data,
      status: response.status,
      headers: response.headers,
      success: response.ok,
    };

    // Apply response interceptors
    this.responseInterceptors.forEach(interceptor => {
      apiResponse = interceptor(apiResponse);
    });

    return apiResponse;
  }

  private async safeParseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else {
        return (await response.text()) as unknown as T;
      }
    } catch (error) {
      Logger.error('Failed to parse response', { error, contentType });
      return {} as T;
    }
  }

  private handleError(error: any): Error {
    if (error instanceof ApiError) {
      return error;
    }

    if (error.name === 'AbortError') {
      return new TimeoutError('Request timeout');
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new NetworkError('Network connection failed');
    }

    return new ApiError(error.message || 'Unknown API error');
  }
}

// Export singleton instance
export const apiService = new BaseApiService(); 