import { Uuid } from '@models/shared/value-objects/Uuid';

export interface CreateCategoryDTO {
  userId: Uuid;
  budgetId: Uuid;
  name: string;
}

export interface UpdateCategoryDTO {
  categoryId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  name?: string;
}

export interface DeleteCategoryDTO {
  categoryId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
}

export interface ICategoryMutationsPort {
  createCategory(dto: CreateCategoryDTO): Promise<void>;
  updateCategory(dto: UpdateCategoryDTO): Promise<void>;
  deleteCategory(dto: DeleteCategoryDTO): Promise<void>;
}
