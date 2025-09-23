export interface BudgetStorageDto {
  id: string;
  name: string;
  limitInCents: number;
  ownerId: string;
  participantIds: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastSyncAt?: string;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  version: number;
}

export interface BudgetStorageMetadata {
  storageVersion: string;
  lastCleanupAt: string;
  totalStoredBudgets: number;
  storageQuotaUsed: number;
  storageQuotaLimit: number;
}