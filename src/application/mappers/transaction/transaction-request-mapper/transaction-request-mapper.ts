import { Either } from '../../../../shared/core/either/either';
import { Transaction } from '../../../../models/transaction/transaction';
import { ApplicationError, ValidationError } from '../../../errors';
import {
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
  DeleteTransactionRequestDto,
  CancelScheduledTransactionRequestDto,
  MarkTransactionLateRequestDto,
} from '../../../dtos/transaction';

export class TransactionRequestMapper {
  static fromCreateRequestToTransaction(
    dto: CreateTransactionRequestDto
  ): Either<ApplicationError, Transaction> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    const transactionResult = Transaction.create({
      description: dto.description,
      amount: dto.amount,
      type: dto.type,
      accountId: dto.accountId,
      categoryId: dto.categoryId,
      executedAt: dto.transactionDate ? new Date(dto.transactionDate) : new Date(),
    });

    if (transactionResult.hasError) {
      return Either.error(
        new ValidationError(
          'transactionCreation',
          `Transaction creation failed: ${transactionResult.errors.join(', ')}`
        )
      );
    }

    return Either.success(transactionResult.data!);
  }

  static validateUpdateRequest(dto: UpdateTransactionRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.userId || typeof dto.userId !== 'string' || dto.userId.trim().length === 0) {
      return Either.error(
        new ValidationError('userId', 'User ID is required and must be a non-empty string')
      );
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Transaction ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static validateDeleteRequest(dto: DeleteTransactionRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Transaction ID is required and must be a non-empty string')
      );
    }

    if (!dto.userId || typeof dto.userId !== 'string' || dto.userId.trim().length === 0) {
      return Either.error(
        new ValidationError('userId', 'User ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static validateCancelScheduledRequest(
    dto: CancelScheduledTransactionRequestDto
  ): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.userId || typeof dto.userId !== 'string' || dto.userId.trim().length === 0) {
      return Either.error(
        new ValidationError('userId', 'User ID is required and must be a non-empty string')
      );
    }

    if (!dto.budgetId || typeof dto.budgetId !== 'string' || dto.budgetId.trim().length === 0) {
      return Either.error(
        new ValidationError('budgetId', 'Budget ID is required and must be a non-empty string')
      );
    }

    if (
      !dto.transactionId ||
      typeof dto.transactionId !== 'string' ||
      dto.transactionId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'transactionId',
          'Transaction ID is required and must be a non-empty string'
        )
      );
    }

    if (
      !dto.cancellationReason ||
      typeof dto.cancellationReason !== 'string' ||
      dto.cancellationReason.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'cancellationReason',
          'Cancellation reason is required and must be a non-empty string'
        )
      );
    }

    return Either.success(true);
  }

  static validateMarkLateRequest(
    dto: MarkTransactionLateRequestDto
  ): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (
      !dto.transactionId ||
      typeof dto.transactionId !== 'string' ||
      dto.transactionId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'transactionId',
          'Transaction ID is required and must be a non-empty string'
        )
      );
    }

    return Either.success(true);
  }

  static normalizeUpdateRequest(dto: UpdateTransactionRequestDto): UpdateTransactionRequestDto {
    return {
      userId: dto.userId.trim(),
      id: dto.id.trim(),
      description: dto.description?.trim(),
      amount: dto.amount,
      type: dto.type,
      accountId: dto.accountId?.trim(),
      categoryId: dto.categoryId?.trim(),
      transactionDate: dto.transactionDate,
    };
  }

  static normalizeDeleteRequest(dto: DeleteTransactionRequestDto): DeleteTransactionRequestDto {
    return {
      id: dto.id.trim(),
      userId: dto.userId.trim(),
    };
  }

  static normalizeCancelScheduledRequest(
    dto: CancelScheduledTransactionRequestDto
  ): CancelScheduledTransactionRequestDto {
    return {
      userId: dto.userId.trim(),
      budgetId: dto.budgetId.trim(),
      transactionId: dto.transactionId.trim(),
      cancellationReason: dto.cancellationReason.trim(),
    };
  }

  static normalizeMarkLateRequest(
    dto: MarkTransactionLateRequestDto
  ): MarkTransactionLateRequestDto {
    return {
      transactionId: dto.transactionId.trim(),
      lateDate: dto.lateDate,
    };
  }
}
