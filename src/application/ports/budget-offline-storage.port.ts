import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import {
  BudgetStorageDto,
  BudgetStorageMetadata,
  SyncOperationDto,
  SyncQueueMetadata
} from '../dtos';

export interface IBudgetOfflineStoragePort {
  storeBudget(budget: BudgetStorageDto): Promise<Either<ApplicationError, void>>;
  getBudget(budgetId: string): Promise<Either<ApplicationError, BudgetStorageDto>>;
  deleteBudget(budgetId: string): Promise<Either<ApplicationError, void>>;
  listBudgets(ownerId: string): Promise<Either<ApplicationError, BudgetStorageDto[]>>;
  getStorageMetadata(): Promise<Either<ApplicationError, BudgetStorageMetadata>>;
}

export interface ISyncQueuePort {
  addSyncOperation(operation: SyncOperationDto): Promise<Either<ApplicationError, void>>;
  getSyncOperations(): Promise<Either<ApplicationError, SyncOperationDto[]>>;
  markOperationCompleted(operationId: string): Promise<Either<ApplicationError, void>>;
  markOperationFailed(operationId: string, error: string): Promise<Either<ApplicationError, void>>;
  getQueueMetadata(): Promise<Either<ApplicationError, SyncQueueMetadata>>;
}