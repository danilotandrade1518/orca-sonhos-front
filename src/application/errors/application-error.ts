/**
 * Base class for all application errors
 * Provides consistent error handling across the application layer
 */
export abstract class ApplicationError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to plain object for serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
    };
  }
}