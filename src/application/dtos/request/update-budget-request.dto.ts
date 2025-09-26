/**
 * DTO for updating an existing budget
 */
export interface UpdateBudgetRequestDto {
  id: string;
  name?: string;
  limitInCents?: number;
  description?: string;
  isActive?: boolean;
}