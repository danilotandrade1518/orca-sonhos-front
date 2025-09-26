import { ApplicationError } from './application-error';

/**
 * Error thrown when network operations fail
 */
export class NetworkError extends ApplicationError {
  public readonly originalError?: Error;

  constructor(
    message: string,
    originalError?: Error
  ) {
    super(
      message,
      'NETWORK_ERROR',
      503
    );
    this.originalError = originalError;
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      originalError: this.originalError?.message,
    };
  }
}