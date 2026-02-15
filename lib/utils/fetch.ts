/**
 * Utilidad para realizar peticiones HTTP con manejo de errores mejorado
 */

import { handleFetchError } from './errors';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Wrapper de fetch con manejo de errores mejorado
 */
export async function fetchWithError<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleFetchError(response);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        'La petición tardó demasiado tiempo. Por favor, intenta nuevamente.'
      );
    }

    throw error;
  }
}

/**
 * Helper para peticiones GET
 */
export async function get<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return fetchWithError<T>(url, { ...options, method: 'GET' });
}

/**
 * Helper para peticiones POST
 */
export async function post<T = unknown>(
  url: string,
  body?: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchWithError<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Helper para peticiones PUT
 */
export async function put<T = unknown>(
  url: string,
  body?: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchWithError<T>(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Helper para peticiones DELETE
 */
export async function del<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return fetchWithError<T>(url, { ...options, method: 'DELETE' });
}
