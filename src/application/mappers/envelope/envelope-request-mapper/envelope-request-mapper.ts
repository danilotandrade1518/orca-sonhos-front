import { Either } from '../../../../shared/core/either/either';
import { Envelope } from '../../../../models/envelope/envelope';
import { ApplicationError, ValidationError } from '../../../errors';
import {
  CreateEnvelopeRequestDto,
  UpdateEnvelopeRequestDto,
  DeleteEnvelopeRequestDto,
  AddAmountToEnvelopeRequestDto,
  RemoveAmountFromEnvelopeRequestDto,
  TransferBetweenEnvelopesRequestDto,
} from '../../../dtos/envelope';

export class EnvelopeRequestMapper {
  static fromCreateRequestToEnvelope(
    dto: CreateEnvelopeRequestDto
  ): Either<ApplicationError, Envelope> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    const envelopeResult = Envelope.create({
      name: dto.name,
      limitInCents: dto.monthlyLimit,
      currentBalanceInCents: 0,
      budgetId: dto.budgetId,
      categoryId: dto.categoryId,
      description: dto.description || '',
    });

    if (envelopeResult.hasError) {
      return Either.error(
        new ValidationError(
          'envelopeCreation',
          `Envelope creation failed: ${envelopeResult.errors.join(', ')}`
        )
      );
    }

    return Either.success(envelopeResult.data!);
  }

  static validateUpdateRequest(dto: UpdateEnvelopeRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (
      !dto.envelopeId ||
      typeof dto.envelopeId !== 'string' ||
      dto.envelopeId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError('envelopeId', 'Envelope ID is required and must be a non-empty string')
      );
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

    return Either.success(true);
  }

  static validateDeleteRequest(dto: DeleteEnvelopeRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (
      !dto.envelopeId ||
      typeof dto.envelopeId !== 'string' ||
      dto.envelopeId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError('envelopeId', 'Envelope ID is required and must be a non-empty string')
      );
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

    return Either.success(true);
  }

  static validateAddAmountRequest(
    dto: AddAmountToEnvelopeRequestDto
  ): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (
      !dto.envelopeId ||
      typeof dto.envelopeId !== 'string' ||
      dto.envelopeId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError('envelopeId', 'Envelope ID is required and must be a non-empty string')
      );
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

    if (typeof dto.amount !== 'number' || dto.amount <= 0) {
      return Either.error(
        new ValidationError('amount', 'Amount is required and must be a positive number')
      );
    }

    return Either.success(true);
  }

  static validateRemoveAmountRequest(
    dto: RemoveAmountFromEnvelopeRequestDto
  ): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (
      !dto.envelopeId ||
      typeof dto.envelopeId !== 'string' ||
      dto.envelopeId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError('envelopeId', 'Envelope ID is required and must be a non-empty string')
      );
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

    if (typeof dto.amount !== 'number' || dto.amount <= 0) {
      return Either.error(
        new ValidationError('amount', 'Amount is required and must be a positive number')
      );
    }

    return Either.success(true);
  }

  static validateTransferRequest(
    dto: TransferBetweenEnvelopesRequestDto
  ): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (
      !dto.sourceEnvelopeId ||
      typeof dto.sourceEnvelopeId !== 'string' ||
      dto.sourceEnvelopeId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'sourceEnvelopeId',
          'Source Envelope ID is required and must be a non-empty string'
        )
      );
    }

    if (
      !dto.targetEnvelopeId ||
      typeof dto.targetEnvelopeId !== 'string' ||
      dto.targetEnvelopeId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'targetEnvelopeId',
          'Target Envelope ID is required and must be a non-empty string'
        )
      );
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

    if (typeof dto.amount !== 'number' || dto.amount <= 0) {
      return Either.error(
        new ValidationError('amount', 'Amount is required and must be a positive number')
      );
    }

    return Either.success(true);
  }

  static normalizeUpdateRequest(dto: UpdateEnvelopeRequestDto): UpdateEnvelopeRequestDto {
    return {
      envelopeId: dto.envelopeId.trim(),
      userId: dto.userId.trim(),
      budgetId: dto.budgetId.trim(),
      name: dto.name?.trim(),
      monthlyLimit: dto.monthlyLimit,
    };
  }

  static normalizeDeleteRequest(dto: DeleteEnvelopeRequestDto): DeleteEnvelopeRequestDto {
    return {
      envelopeId: dto.envelopeId.trim(),
      userId: dto.userId.trim(),
      budgetId: dto.budgetId.trim(),
    };
  }

  static normalizeAddAmountRequest(
    dto: AddAmountToEnvelopeRequestDto
  ): AddAmountToEnvelopeRequestDto {
    return {
      envelopeId: dto.envelopeId.trim(),
      userId: dto.userId.trim(),
      budgetId: dto.budgetId.trim(),
      amount: dto.amount,
    };
  }

  static normalizeRemoveAmountRequest(
    dto: RemoveAmountFromEnvelopeRequestDto
  ): RemoveAmountFromEnvelopeRequestDto {
    return {
      envelopeId: dto.envelopeId.trim(),
      userId: dto.userId.trim(),
      budgetId: dto.budgetId.trim(),
      amount: dto.amount,
    };
  }

  static normalizeTransferRequest(
    dto: TransferBetweenEnvelopesRequestDto
  ): TransferBetweenEnvelopesRequestDto {
    return {
      sourceEnvelopeId: dto.sourceEnvelopeId.trim(),
      targetEnvelopeId: dto.targetEnvelopeId.trim(),
      userId: dto.userId.trim(),
      budgetId: dto.budgetId.trim(),
      amount: dto.amount,
    };
  }
}
