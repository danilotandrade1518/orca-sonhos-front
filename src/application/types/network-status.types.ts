export type ConnectionStatus = 'online' | 'offline' | 'unknown';

export interface ConnectionInfo {
  status: ConnectionStatus;
  lastOnlineAt?: Date;
  lastOfflineAt?: Date;
  isRetrying?: boolean;
  retryAttempts?: number;
}

export interface NetworkCapabilities {
  httpSupported: boolean;
  offlineStorageSupported: boolean;
  syncQueueSupported: boolean;
}

export const DEFAULT_CONNECTION_INFO: Readonly<ConnectionInfo> = {
  status: 'unknown',
  isRetrying: false,
  retryAttempts: 0,
} as const;

export const DEFAULT_NETWORK_CAPABILITIES: Readonly<NetworkCapabilities> = {
  httpSupported: true,
  offlineStorageSupported: true,
  syncQueueSupported: true,
} as const;

export function isOnline(connectionInfo: ConnectionInfo): boolean {
  return connectionInfo.status === 'online';
}

export function isOffline(connectionInfo: ConnectionInfo): boolean {
  return connectionInfo.status === 'offline';
}

export function canUseHttpOperations(
  connectionInfo: ConnectionInfo,
  capabilities: NetworkCapabilities
): boolean {
  return isOnline(connectionInfo) && capabilities.httpSupported;
}

export function canUseOfflineOperations(
  capabilities: NetworkCapabilities
): boolean {
  return capabilities.offlineStorageSupported;
}