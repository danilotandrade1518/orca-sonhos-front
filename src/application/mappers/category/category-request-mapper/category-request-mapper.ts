import { Either } from '../../../../shared/core/either/either';
import { Category } from '../../../../models/category/category';
import { ApplicationError, ValidationError } from '../../../errors';
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  DeleteCategoryRequestDto,
} from '../../../dtos/category';

export class CategoryRequestMapper {
  static fromCreateRequestToCategory(
    dto: CreateCategoryRequestDto
  ): Either<ApplicationError, Category> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    const categoryResult = Category.create({
      name: dto.name,
      type: dto.type,
      budgetId: dto.budgetId,
      description: dto.description || '',
      color: dto.color || '#757575',
      icon: dto.icon || 'category',
    });

    if (categoryResult.hasError) {
      return Either.error(
        new ValidationError(
          'categoryCreation',
          `Category creation failed: ${categoryResult.errors.join(', ')}`
        )
      );
    }

    return Either.success(categoryResult.data!);
  }

  static validateUpdateRequest(dto: UpdateCategoryRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Category ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static validateDeleteRequest(dto: DeleteCategoryRequestDto): Either<ApplicationError, true> {
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Request DTO is required'));
    }

    if (!dto.id || typeof dto.id !== 'string' || dto.id.trim().length === 0) {
      return Either.error(
        new ValidationError('id', 'Category ID is required and must be a non-empty string')
      );
    }

    if (!dto.budgetId || typeof dto.budgetId !== 'string' || dto.budgetId.trim().length === 0) {
      return Either.error(
        new ValidationError('budgetId', 'Budget ID is required and must be a non-empty string')
      );
    }

    return Either.success(true);
  }

  static normalizeUpdateRequest(dto: UpdateCategoryRequestDto): UpdateCategoryRequestDto {
    return {
      id: dto.id.trim(),
      name: dto.name?.trim(),
      description: dto.description?.trim(),
      color: dto.color?.trim(),
      icon: dto.icon?.trim(),
    };
  }

  static normalizeDeleteRequest(dto: DeleteCategoryRequestDto): DeleteCategoryRequestDto {
    return {
      id: dto.id.trim(),
      budgetId: dto.budgetId.trim(),
    };
  }
}
