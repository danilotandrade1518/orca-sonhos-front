import { CategoryModel } from './CategoryModel';
import { Uuid } from '../shared/value-objects/Uuid';

describe('CategoryModel', () => {
  const id = Uuid.create('123e4567-e89b-12d3-a456-426614174030');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174031');

  it('creates category', () => {
    const c = CategoryModel.create({ id, budgetId, name: 'Food', parentId: null });
    expect(c).toBeTruthy();
  });

  it('rejects empty name', () => {
    expect(() => CategoryModel.create({ id, budgetId, name: '  ' })).toThrow();
  });
});
