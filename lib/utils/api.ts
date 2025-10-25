// API Response wrapper for consistent error handling
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

// API helper to handle responses consistently
export async function handleApiResponse<T>(
  promise: Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await promise;
    return { data, success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
      success: false,
    };
  }
}

// Fetch wrapper with error handling
export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.error || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      success: false,
    };
  }
}
