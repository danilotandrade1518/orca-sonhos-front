import { ApplicationError } from './application-error';

export class UnexpectedError extends ApplicationError {
  constructor(operation: string, originalError: unknown, details?: Record<string, unknown>) {
    const errorMessage = originalError instanceof Error 
      ? originalError.message 
      : String(originalError);
    
    super(
      `Unexpected error during '${operation}': ${errorMessage}`,
      'UNEXPECTED_ERROR',
      {
        operation,
        originalError: errorMessage,
        ...details,
      }
    );
  }

  static fromError(operation: string, error: unknown): UnexpectedError {
    return new UnexpectedError(operation, error);
  }
}
