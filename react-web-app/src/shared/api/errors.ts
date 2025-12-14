import { ApiResponse } from './types';

export class ApiException extends Error {
  statusCode: number;
  errors?: Array<{ path?: string; message: string }>;
  originalError?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: Array<{ path?: string; message: string }>,
    originalError?: any
  ) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.errors = errors;
    this.originalError = originalError;
    Error.captureStackTrace(this, this.constructor);
  }

  static fromResponse(response: ApiResponse, statusCode: number): ApiException {
    return new ApiException(
      response.message || 'An error occurred',
      statusCode,
      response.errors
    );
  }

  static fromError(error: any): ApiException {
    if (error.response) {
      // Axios error with response
      const data = error.response.data;
      if (data && typeof data === 'object' && 'message' in data) {
        return ApiException.fromResponse(data, error.response.status);
      }
      return new ApiException(
        error.response.data?.message || error.message || 'An error occurred',
        error.response.status,
        error.response.data?.errors
      );
    }

    if (error.request) {
      // Axios error without response (network error)
      return new ApiException(
        'Network error. Please check your connection.',
        0,
        undefined,
        error
      );
    }

    // Other error
    return new ApiException(
      error.message || 'An unexpected error occurred',
      500,
      undefined,
      error
    );
  }
}

