export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Standardized wrapper for API calls.
 * Ensures strict try/catch blocks and unified error messages.
 */
export async function handleRequest<T>(
  request: () => Promise<{ data: T | null; error: any }>
): Promise<ServiceResponse<T>> {
  try {
    const { data, error } = await request();

    if (error) {
      console.error('API Error:', error);
      return { data: null, error: typeof error === 'string' ? error : (error.message || 'API request failed') };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected System Error:', err);
    return { data: null, error: err.message || 'An unexpected error occurred.' };
  }
}

// Simulates a network delay for mock data to mimic real API behavior
export const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
