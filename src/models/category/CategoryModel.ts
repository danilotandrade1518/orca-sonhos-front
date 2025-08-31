import { Uuid } from '../shared/value-objects/Uuid';

export interface CategoryProps {
  id: Uuid;
  budgetId: Uuid;
  name: string;
  parentId?: Uuid | null;
}

export class CategoryModel {
  private constructor(private props: CategoryProps) {}

  static create(props: CategoryProps): CategoryModel {
    if (!props.name?.trim()) throw new Error('Category name is required');
    return new CategoryModel(props);
  }

  get id(): Uuid {
    return this.props.id;
  }
}
