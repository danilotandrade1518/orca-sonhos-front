export interface EnvelopeDto {
  id: string;
  budgetId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  limit: number;
  currentUsage: number;
  usagePercentage: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

