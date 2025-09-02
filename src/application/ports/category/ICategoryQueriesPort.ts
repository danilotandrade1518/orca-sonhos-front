import { Uuid } from '@models/shared/value-objects/Uuid';

export interface ListCategoriesQuery {
  userId: Uuid;
  budgetId: Uuid;
}

export interface CategoryListItem {
  id: string;
  name: string;
  type: string;
}

export interface ICategoryQueriesPort {
  listCategories(q: ListCategoriesQuery): Promise<CategoryListItem[]>;
}
