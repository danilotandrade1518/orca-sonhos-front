import { Budget } from '../../../models/budget';
import { CreateBudgetRequestDto, UpdateBudgetRequestDto } from '../../dtos/request';

/**
 * Mapper for converting between Request DTOs and Budget domain model
 */
export class BudgetRequestMapper {
  /**
   * Convert CreateBudgetRequestDto to Budget domain model
   * Uses Budget.create() for proper validation
   */
  static fromCreateRequestToBudget(dto: CreateBudgetRequestDto) {
    return Budget.create({
      name: dto.name,
      limitInCents: dto.limitInCents,
      ownerId: dto.ownerId,
      participantIds: dto.participantIds,
      description: dto.description,
      isActive: dto.isActive,
    });
  }

  /**
   * Convert UpdateBudgetRequestDto to partial BudgetProps
   * Only includes fields that are provided (not undefined)
   */
  static fromUpdateRequestToPartialProps(dto: UpdateBudgetRequestDto) {
    const props: Partial<{
      name: string;
      limitInCents: number;
      description: string;
      isActive: boolean;
    }> = {};

    if (dto.name !== undefined) {
      props.name = dto.name;
    }
    if (dto.limitInCents !== undefined) {
      props.limitInCents = dto.limitInCents;
    }
    if (dto.description !== undefined) {
      props.description = dto.description;
    }
    if (dto.isActive !== undefined) {
      props.isActive = dto.isActive;
    }

    return props;
  }
}