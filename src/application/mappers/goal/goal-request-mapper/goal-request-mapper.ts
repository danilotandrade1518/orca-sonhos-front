import { Either } from '../../../../shared/core/either/either';
import { Goal } from '../../../../models/goal/goal';
import { ApplicationError, ValidationError } from '../../../errors';
import {
  CreateGoalRequestDto,
  UpdateGoalRequestDto,
  DeleteGoalRequestDto,
  AddAmountToGoalRequestDto,
  RemoveAmountFromGoalRequestDto,
} from '../../../dtos/goal';

export class GoalRequestMapper {
  static fromCreateRequestToGoal(dto: CreateGoalRequestDto): Either<ApplicationError, Goal> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    const goalResult = Goal.create({
      name: dto.name,
      targetAmountInCents: dto.totalAmount,
      currentAmountInCents: dto.accumulatedAmount || 0,
      budgetId: dto.budgetId,
      targetDate: dto.deadline ? new Date(dto.deadline) : undefined,
      description: dto.description || '',
    });

    if (goalResult.hasError) {
      return Either.error(
        new ValidationError('goalCreation', `Goal creation failed: ${goalResult.errors.join(', ')}`)
      );
    }

    return Either.success(goalResult.data!);
  }

  static validateUpdateRequest(dto: UpdateGoalRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Goal ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static validateDeleteRequest(dto: DeleteGoalRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Goal ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static validateAddAmountRequest(dto: AddAmountToGoalRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Goal ID is required and must be a non-empty string')
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
    dto: RemoveAmountFromGoalRequestDto
  ): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Goal ID is required and must be a non-empty string')
      );
    }

    if (typeof dto.amount !== 'number' || dto.amount <= 0) {
      return Either.error(
        new ValidationError('amount', 'Amount is required and must be a positive number')
      );
    }

    return Either.success(true);
  }

  static normalizeUpdateRequest(dto: UpdateGoalRequestDto): UpdateGoalRequestDto {
    return {
      id: dto.id.trim(),
      name: dto.name?.trim(),
      totalAmount: dto.totalAmount,
      deadline: dto.deadline,
      description: dto.description?.trim(),
    };
  }

  static normalizeDeleteRequest(dto: DeleteGoalRequestDto): DeleteGoalRequestDto {
    return {
      id: dto.id.trim(),
    };
  }

  static normalizeAddAmountRequest(dto: AddAmountToGoalRequestDto): AddAmountToGoalRequestDto {
    return {
      id: dto.id.trim(),
      amount: dto.amount,
    };
  }

  static normalizeRemoveAmountRequest(
    dto: RemoveAmountFromGoalRequestDto
  ): RemoveAmountFromGoalRequestDto {
    return {
      id: dto.id.trim(),
      amount: dto.amount,
    };
  }
}
