/**
 * Global Error Handler Utility
 * Prevents AbortError crashes across the entire application
 */

/**
 * Check if an error is an AbortError
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
export function isAbortError(error) {
  return (
    error?.name === 'AbortError' ||
    error?.message?.includes('AbortError') ||
    error?.message?.includes('aborted') ||
    error?.message?.includes('signal is aborted')
  );
}

/**
 * Safe fetch wrapper that handles AbortErrors gracefully
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise} - Fetch response or null on AbortError
 */
export async function safeFetch(url, options = {}) {
  try {
    // Add default timeout of 30 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (isAbortError(error)) {
      console.warn('[safeFetch] Request aborted:', url);
      return null;
    }
    throw error;
  }
}

/**
 * Safe async operation wrapper
 * Catches and handles AbortErrors without crashing
 */
export async function safeAsync(fn, errorHandler = null) {
  try {
    return await fn();
  } catch (error) {
    if (isAbortError(error)) {
      console.warn('[safeAsync] Operation aborted');
      return null;
    }
    
    if (errorHandler) {
      return errorHandler(error);
    }
    
    throw error;
  }
}

/**
 * Create a timeout-safe promise
 * Prevents long-running operations from hanging indefinitely
 */
export function withTimeout(promise, timeoutMs = 30000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ]);
}

/**
 * Retry failed operations with exponential backoff
 * Useful for flaky network requests
 */
export async function retryOperation(
  fn,
  maxRetries = 3,
  delayMs = 1000
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (isAbortError(error)) {
        console.warn('[retryOperation] Aborted, not retrying');
        return null;
      }
      
      if (i === maxRetries - 1) throw error;
      
      const delay = delayMs * Math.pow(2, i);
      console.warn(`[retryOperation] Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Global error logger
 * Logs errors without crashing the app
 */
export function logError(context, error) {
  const isAbort = isAbortError(error);
  
  if (isAbort) {
    console.warn(`[${context}] Operation aborted (expected behavior)`);
  } else {
    console.error(`[${context}] Error:`, error);
  }
  
  return { isAbort, error };
}
