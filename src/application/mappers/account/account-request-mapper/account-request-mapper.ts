import { Either } from '../../../../shared/core/either/either';
import { Account } from '../../../../models/account/account';
import { Money } from '../../../../models/shared/value-objects/money/money';
import { ApplicationError, ValidationError } from '../../../errors';
import {
  CreateAccountRequestDto,
  UpdateAccountRequestDto,
  DeleteAccountRequestDto,
  ReconcileAccountRequestDto,
  TransferBetweenAccountsRequestDto,
} from '../../../dtos/account';

export class AccountRequestMapper {
  static fromCreateRequestToAccount(
    dto: CreateAccountRequestDto
  ): Either<ApplicationError, Account> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    const accountResult = Account.create({
      name: dto.name,
      type: dto.type,
      budgetId: dto.budgetId,
      balanceInCents: dto.initialBalance || 0,
      description: dto.description || '',
    });

    if (accountResult.hasError) {
      return Either.error(
        new ValidationError(
          'accountCreation',
          `Account creation failed: ${accountResult.errors.join(', ')}`
        )
      );
    }

    return Either.success(accountResult.data!);
  }

  static validateUpdateRequest(dto: UpdateAccountRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Account ID is required and must be a non-empty string')
      );
    }

    if (!dto.userId || typeof dto.userId !== 'string' || dto.userId.trim().length === 0) {
      return Either.error(
        new ValidationError('userId', 'User ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static validateDeleteRequest(dto: DeleteAccountRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Account ID is required and must be a non-empty string')
      );
    }

    if (!dto.userId || typeof dto.userId !== 'string' || dto.userId.trim().length === 0) {
      return Either.error(
        new ValidationError('userId', 'User ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static validateReconcileRequest(dto: ReconcileAccountRequestDto): Either<ApplicationError, true> {
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

    if (!dto.accountId || typeof dto.accountId !== 'string' || dto.accountId.trim().length === 0) {
      return Either.error(
        new ValidationError('accountId', 'Account ID is required and must be a non-empty string')
      );
    }

    if (typeof dto.realBalance !== 'number') {
      return Either.error(
        new ValidationError('realBalance', 'Real balance is required and must be a number')
      );
    }

    return Either.success(true);
  }

  static validateTransferRequest(
    dto: TransferBetweenAccountsRequestDto
  ): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.userId || typeof dto.userId !== 'string' || dto.userId.trim().length === 0) {
      return Either.error(
        new ValidationError('userId', 'User ID is required and must be a non-empty string')
      );
    }

    if (
      !dto.fromAccountId ||
      typeof dto.fromAccountId !== 'string' ||
      dto.fromAccountId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'fromAccountId',
          'From Account ID is required and must be a non-empty string'
        )
      );
    }

    if (
      !dto.toAccountId ||
      typeof dto.toAccountId !== 'string' ||
      dto.toAccountId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'toAccountId',
          'To Account ID is required and must be a non-empty string'
        )
      );
    }

    if (typeof dto.amount !== 'number' || dto.amount <= 0) {
      return Either.error(
        new ValidationError('amount', 'Amount is required and must be a positive number')
      );
    }

    return Either.success(true);
  }

  static normalizeUpdateRequest(dto: UpdateAccountRequestDto): UpdateAccountRequestDto {
    return {
      id: dto.id.trim(),
      userId: dto.userId.trim(),
      name: dto.name?.trim(),
      description: dto.description?.trim(),
      initialBalance: dto.initialBalance,
    };
  }

  static normalizeDeleteRequest(dto: DeleteAccountRequestDto): DeleteAccountRequestDto {
    return {
      id: dto.id.trim(),
      userId: dto.userId.trim(),
    };
  }

  static normalizeReconcileRequest(dto: ReconcileAccountRequestDto): ReconcileAccountRequestDto {
    return {
      userId: dto.userId.trim(),
      budgetId: dto.budgetId.trim(),
      accountId: dto.accountId.trim(),
      realBalance: dto.realBalance,
    };
  }

  static normalizeTransferRequest(
    dto: TransferBetweenAccountsRequestDto
  ): TransferBetweenAccountsRequestDto {
    return {
      userId: dto.userId.trim(),
      fromAccountId: dto.fromAccountId.trim(),
      toAccountId: dto.toAccountId.trim(),
      amount: dto.amount,
      description: dto.description?.trim(),
    };
  }
}
