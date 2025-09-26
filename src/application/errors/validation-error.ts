import { ApplicationError } from './application-error';

/**
 * Error thrown when validation fails
 */
export class ValidationError extends ApplicationError {
  public readonly field?: string;
  public readonly value?: unknown;

  constructor(
    message: string,
    field?: string,
    value?: unknown
  ) {
    super(
      message,
      'VALIDATION_ERROR',
      400
    );
    this.field = field;
    this.value = value;
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      field: this.field,
      value: this.value,
    };
  }
}