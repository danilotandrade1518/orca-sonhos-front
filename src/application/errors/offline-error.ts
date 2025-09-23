import { ApplicationError } from './application-error';

export class OfflineError extends ApplicationError {
  constructor(
    operation: string,
    reason: string,
    details?: Record<string, unknown>
  ) {
    super(
      `Offline operation '${operation}' failed: ${reason}`,
      'OFFLINE_ERROR',
      {
        operation,
        reason,
        ...details,
      }
    );
  }

  static storageQuotaExceeded(operation: string): OfflineError {
    return new OfflineError(
      operation,
      'Storage quota exceeded',
      { quotaExceeded: true }
    );
  }

  static storageUnavailable(operation: string): OfflineError {
    return new OfflineError(
      operation,
      'Offline storage is not available',
      { storageUnavailable: true }
    );
  }
}