export interface UpdateBudgetRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly name?: string;
}

export class UpdateBudgetRequestDtoHelper {
  static isValid(dto: unknown): dto is UpdateBudgetRequestDto {
    if (typeof dto !== 'object' || dto === null) {
      return false;
    }

    const obj = dto as Record<string, unknown>;

    return (
      typeof obj['userId'] === 'string' &&
      obj['userId'].length > 0 &&
      typeof obj['budgetId'] === 'string' &&
      obj['budgetId'].length > 0 &&
      (obj['name'] === undefined || (typeof obj['name'] === 'string' && obj['name'].length > 0))
    );
  }

  static create(data: { userId: string; budgetId: string; name?: string }): UpdateBudgetRequestDto {
    return {
      userId: data.userId,
      budgetId: data.budgetId,
      name: data.name,
    };
  }

  static validateUserId(userId: string): boolean {
    return typeof userId === 'string' && userId.length > 0;
  }

  static validateBudgetId(budgetId: string): boolean {
    return typeof budgetId === 'string' && budgetId.length > 0;
  }

  static validateName(name: string): boolean {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 100;
  }

  static hasChanges(dto: UpdateBudgetRequestDto): boolean {
    return dto.name !== undefined;
  }
}
