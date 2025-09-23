import { ApplicationError } from './application-error';

export class ValidationError extends ApplicationError {
  constructor(
    field: string,
    reason: string,
    details?: Record<string, unknown>
  ) {
    super(
      `Validation failed for field '${field}': ${reason}`,
      'VALIDATION_ERROR',
      {
        field,
        reason,
        ...details,
      }
    );
  }

  static fromMultipleFields(
    failures: Array<{ field: string; reason: string }>,
    details?: Record<string, unknown>
  ): ValidationError {
    const fieldsList = failures.map(f => f.field).join(', ');
    const reasonsList = failures.map(f => `${f.field}: ${f.reason}`).join('; ');

    return new ValidationError(
      fieldsList,
      reasonsList,
      {
        failures,
        ...details,
      }
    );
  }
}