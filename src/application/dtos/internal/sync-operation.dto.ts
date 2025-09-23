export type SyncOperationType = 'create' | 'update' | 'delete' | 'add_participant' | 'remove_participant';

export interface SyncOperationDto {
  id: string;
  type: SyncOperationType;
  entityId: string;
  entityType: 'budget';
  operation: {
    type: SyncOperationType;
    data: Record<string, unknown>;
    timestamp: string;
    userId: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  attempts: number;
  maxAttempts: number;
  lastError?: {
    message: string;
    code: string;
    timestamp: string;
  };
}

export interface SyncQueueMetadata {
  totalOperations: number;
  pendingOperations: number;
  failedOperations: number;
  lastProcessedAt?: string;
  isProcessing: boolean;
  nextScheduledAt?: string;
}