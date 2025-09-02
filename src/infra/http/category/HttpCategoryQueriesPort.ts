import {
  CategoryListItem,
  ICategoryQueriesPort,
  ListCategoriesQuery,
} from '@application/ports/category/ICategoryQueriesPort';
import { HttpClient } from '../HttpClient';

export class HttpCategoryQueriesPort implements ICategoryQueriesPort {
  constructor(private readonly http: HttpClient) {}

  async listCategories(q: ListCategoriesQuery): Promise<CategoryListItem[]> {
    const params = new URLSearchParams({
      userId: q.userId.toString(),
      budgetId: q.budgetId.toString(),
    });
    return this.http.get<CategoryListItem[]>(`/category/list-categories?${params}`);
  }
}
