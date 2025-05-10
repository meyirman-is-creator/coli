// src/utils/api-client.ts
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Custom fetch function that handles authentication and errors
 */
async function client(endpoint: string, { token, params, ...customConfig }: FetchOptions = {}) {
  // Build URL with query parameters
  const url = new URL(`${API_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Merge configs
  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  try {
    const response = await fetch(url.toString(), config);
    
    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }
    
    // For all other responses, try to parse JSON
    const data = await response.json();
    
    // Handle API errors
    if (!response.ok) {
      const message = data?.message || data?.error || 'An error occurred';
      
      // Show toast for user-friendly errors
      toast.error(message);
      
      // Throw error for handling in the calling function
      throw new Error(message);
    }
    
    return data;
  } catch (error: any) {
    // Handle network errors
    if (!error.message.includes('An error occurred')) {
      toast.error('Network error: Please check your connection');
    }
    throw error;
  }
}

// Convenience methods for common HTTP methods
export const apiClient = {
  get: <T>(endpoint: string, options?: FetchOptions) => 
    client(endpoint, { ...options, method: 'GET' }) as Promise<T>,
    
  post: <T>(endpoint: string, data?: any, options?: FetchOptions) => 
    client(endpoint, { 
      ...options, 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }) as Promise<T>,
    
  put: <T>(endpoint: string, data?: any, options?: FetchOptions) => 
    client(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }) as Promise<T>,
    
  patch: <T>(endpoint: string, data?: any, options?: FetchOptions) => 
    client(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined 
    }) as Promise<T>,
    
  delete: <T>(endpoint: string, options?: FetchOptions) => 
    client(endpoint, { ...options, method: 'DELETE' }) as Promise<T>,
};

/**
 * Function to get auth token from storage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}

/**
 * Create an authenticated API client
 */
export function createAuthClient() {
  const token = getToken() || undefined;
  
  return {
    get: <T>(endpoint: string, options?: Omit<FetchOptions, 'token'>) => 
      apiClient.get<T>(endpoint, { ...options, token }),
      
    post: <T>(endpoint: string, data?: any, options?: Omit<FetchOptions, 'token'>) => 
      apiClient.post<T>(endpoint, data, { ...options, token }),
      
    put: <T>(endpoint: string, data?: any, options?: Omit<FetchOptions, 'token'>) => 
      apiClient.put<T>(endpoint, data, { ...options, token }),
      
    patch: <T>(endpoint: string, data?: any, options?: Omit<FetchOptions, 'token'>) => 
      apiClient.patch<T>(endpoint, data, { ...options, token }),
      
    delete: <T>(endpoint: string, options?: Omit<FetchOptions, 'token'>) => 
      apiClient.delete<T>(endpoint, { ...options, token }),
  };
}

export default apiClient;