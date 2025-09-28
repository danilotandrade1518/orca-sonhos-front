import { Either } from '../../../../shared/core/either/either';
import { CreditCard } from '../../../../models/credit-card/credit-card';
import { ApplicationError, ValidationError } from '../../../errors';
import {
  CreateCreditCardRequestDto,
  UpdateCreditCardRequestDto,
  DeleteCreditCardRequestDto,
} from '../../../dtos/credit-card';

export class CreditCardRequestMapper {
  static fromCreateRequestToCreditCard(
    dto: CreateCreditCardRequestDto
  ): Either<ApplicationError, CreditCard> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    const creditCardResult = CreditCard.create({
      name: dto.name,
      limitInCents: dto.limit,
      closingDay: dto.closingDay,
      dueDay: dto.dueDay,
      budgetId: dto.budgetId,
      brand: dto.brand || '',
      lastFourDigits: dto.lastFourDigits || '',
    });

    if (creditCardResult.hasError) {
      return Either.error(
        new ValidationError(
          'creditCardCreation',
          `CreditCard creation failed: ${creditCardResult.errors.join(', ')}`
        )
      );
    }

    return Either.success(creditCardResult.data!);
  }

  static validateUpdateRequest(dto: UpdateCreditCardRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'CreditCard ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static validateDeleteRequest(dto: DeleteCreditCardRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'CreditCard ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static normalizeUpdateRequest(dto: UpdateCreditCardRequestDto): UpdateCreditCardRequestDto {
    return {
      id: dto.id.trim(),
      name: dto.name?.trim(),
      limit: dto.limit,
      closingDay: dto.closingDay,
      dueDay: dto.dueDay,
      brand: dto.brand?.trim(),
      lastFourDigits: dto.lastFourDigits?.trim(),
    };
  }

  static normalizeDeleteRequest(dto: DeleteCreditCardRequestDto): DeleteCreditCardRequestDto {
    return {
      id: dto.id.trim(),
    };
  }
}
