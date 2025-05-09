import { getCookie } from './cookies';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

const BASE_URL = '/api/v1';

/**
 * Generic API client for making client-side requests to the API
 */
export const apiClient = async <T = unknown>(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', body, headers = {} } = options;
  
  // Get token from cookies
  const token = getCookie('token');
  
  // Set up headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
        message: data.message || 'Request failed'
      };
    }
    
    return {
      success: true,
      data: data.data || data,
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      message: 'Failed to connect to server'
    };
  }
};

// Shorthand methods for common API calls
export const api = {
  get: <T = unknown>(endpoint: string, options: Omit<ApiOptions, 'method' | 'body'> = {}) => 
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T = unknown>(endpoint: string, body: unknown, options: Omit<ApiOptions, 'method' | 'body'> = {}) => 
    apiClient<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T = unknown>(endpoint: string, body: unknown, options: Omit<ApiOptions, 'method' | 'body'> = {}) => 
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }),
    
  delete: <T = unknown>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}) => 
    apiClient<T>(endpoint, { ...options, method: 'DELETE' })
};