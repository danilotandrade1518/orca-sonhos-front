import {
  CreateCategoryDTO,
  DeleteCategoryDTO,
  ICategoryMutationsPort,
  UpdateCategoryDTO,
} from '@application/ports/category/ICategoryMutationsPort';

import { HttpClient } from '../HttpClient';

export class HttpCategoryMutationsPort implements ICategoryMutationsPort {
  constructor(private readonly http: HttpClient) {}

  async createCategory(dto: CreateCategoryDTO): Promise<void> {
    await this.http.post('/category/create-category', {
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      name: dto.name,
    });
  }

  async updateCategory(dto: UpdateCategoryDTO): Promise<void> {
    await this.http.post('/category/update-category', {
      categoryId: dto.categoryId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      name: dto.name,
    });
  }

  async deleteCategory(dto: DeleteCategoryDTO): Promise<void> {
    await this.http.post('/category/delete-category', {
      categoryId: dto.categoryId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
    });
  }
}
