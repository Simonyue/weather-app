export class ApiError extends Error {
  statusCode?: number;
  category: 'network' | 'timeout' | 'not_found' | 'server_error' | 'unknown';

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      category?: 'network' | 'timeout' | 'not_found' | 'server_error' | 'unknown';
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = options?.statusCode;
    this.category = options?.category || 'unknown';
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function fetchJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 8000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: options.signal || controller.signal,
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody && errorBody.reason) {
          errorMessage = errorBody.reason;
        }
      } catch {
      }

      let category: ApiError['category'] = 'server_error';
      if (response.status === 404) category = 'not_found';
      else if (response.status >= 500) category = 'server_error';

      throw new ApiError(errorMessage, { statusCode: response.status, category });
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('请求超时，请检查网络连接后重试', { category: 'timeout' });
    }

    if (err instanceof TypeError) {
      throw new ApiError('无法连接至天气服务器，请检查网络连接', { category: 'network' });
    }

    throw new ApiError(err instanceof Error ? err.message : '发生未知错误', { category: 'unknown' });
  } finally {
    clearTimeout(timeoutId);
  }
}
