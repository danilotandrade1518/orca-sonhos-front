/**
 * Network connection status
 */
export enum NetworkStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  UNKNOWN = 'unknown',
}

/**
 * Network status information
 */
export interface NetworkInfo {
  status: NetworkStatus;
  lastChecked: Date;
  isOnline: boolean;
}

/**
 * Create network info from current status
 */
export function createNetworkInfo(status: NetworkStatus): NetworkInfo {
  return {
    status,
    lastChecked: new Date(),
    isOnline: status === NetworkStatus.ONLINE,
  };
}