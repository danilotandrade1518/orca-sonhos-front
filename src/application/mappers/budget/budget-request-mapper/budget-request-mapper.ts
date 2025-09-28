import { Either } from '../../../../shared/core/either/either';
import { Budget } from '../../../../models/budget/budget';
import { Money } from '../../../../models/shared/value-objects/money/money';
import { ApplicationError, ValidationError } from '../../../errors';
import {
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
  AddParticipantRequestDto,
  RemoveParticipantRequestDto,
  DeleteBudgetRequestDto,
} from '../../../dtos/budget';

export class BudgetRequestMapper {
  static fromCreateRequestToBudget(dto: CreateBudgetRequestDto): Either<ApplicationError, Budget> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    const budgetResult = Budget.create({
      name: dto.name,
      limitInCents: dto.limitInCents,
      ownerId: dto.ownerId,
      participantIds: dto.participantIds,
      description: dto.description,
      isActive: dto.isActive,
    });

    if (budgetResult.hasError) {
      return Either.error(
        new ValidationError(
          'budgetCreation',
          `Budget creation failed: ${budgetResult.errors.join(', ')}`
        )
      );
    }

    return Either.success(budgetResult.data!);
  }

  static validateUpdateRequest(dto: UpdateBudgetRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.budgetId || typeof dto.budgetId !== 'string' || dto.budgetId.trim().length === 0) {
      return Either.error(
        new ValidationError('budgetId', 'Budget ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static validateParticipantRequest(
    dto: AddParticipantRequestDto | RemoveParticipantRequestDto
  ): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.budgetId || typeof dto.budgetId !== 'string' || dto.budgetId.trim().length === 0) {
      return Either.error(
        new ValidationError('budgetId', 'Budget ID is required and must be a non-empty string')
      );
    }

    if (
      !dto.participantId ||
      typeof dto.participantId !== 'string' ||
      dto.participantId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'participantId',
          'Participant ID is required and must be a non-empty string'
        )
      );
    }

    if (
      !dto.requesterId ||
      typeof dto.requesterId !== 'string' ||
      dto.requesterId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'requesterId',
          'Requester ID is required and must be a non-empty string'
        )
      );
    }

    return Either.success(true);
  }

  static validateDeleteRequest(dto: DeleteBudgetRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.budgetId || typeof dto.budgetId !== 'string' || dto.budgetId.trim().length === 0) {
      return Either.error(
        new ValidationError('budgetId', 'Budget ID is required and must be a non-empty string')
      );
    }

    if (
      !dto.requesterId ||
      typeof dto.requesterId !== 'string' ||
      dto.requesterId.trim().length === 0
    ) {
      return Either.error(
        new ValidationError(
          'requesterId',
          'Requester ID is required and must be a non-empty string'
        )
      );
    }

    return Either.success(true);
  }

  static normalizeUpdateRequest(dto: UpdateBudgetRequestDto): UpdateBudgetRequestDto {
    return {
      budgetId: dto.budgetId.trim(),
      name: dto.name?.trim(),
      limitInCents: dto.limitInCents,
      description: dto.description?.trim(),
      isActive: dto.isActive,
    };
  }

  static normalizeParticipantRequest<
    T extends AddParticipantRequestDto | RemoveParticipantRequestDto
  >(dto: T): T {
    return {
      ...dto,
      budgetId: dto.budgetId.trim(),
      participantId: dto.participantId.trim(),
      requesterId: dto.requesterId.trim(),
    };
  }

  static normalizeDeleteRequest(dto: DeleteBudgetRequestDto): DeleteBudgetRequestDto {
    return {
      budgetId: dto.budgetId.trim(),
      requesterId: dto.requesterId.trim(),
    };
  }
}
