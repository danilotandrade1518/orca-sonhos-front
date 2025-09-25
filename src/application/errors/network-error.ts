import { ApplicationError } from './application-error';

export class NetworkError extends ApplicationError {
  constructor(operation: string, reason: string, details?: Record<string, unknown>) {
    super(`Network operation '${operation}' failed: ${reason}`, 'NETWORK_ERROR', {
      operation,
      reason,
      ...details,
    });
  }

  static storageQuotaExceeded(operation: string): NetworkError {
    return new NetworkError(operation, 'Storage quota exceeded', { quotaExceeded: true });
  }

  static storageUnavailable(operation: string): NetworkError {
    return new NetworkError(operation, 'Offline storage is not available', {
      storageUnavailable: true,
    });
  }
}
