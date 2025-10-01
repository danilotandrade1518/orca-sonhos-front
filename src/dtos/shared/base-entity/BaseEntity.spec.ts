import { BaseEntityDto, BaseEntityHelper } from './BaseEntity';

describe('BaseEntityDto', () => {
  it('should work with BaseEntityDto type', () => {
    const entity: BaseEntityDto = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T14:45:30.123Z',
    };
    expect(entity.id).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('should validate BaseEntityDto', () => {
    const validEntity = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T14:45:30.123Z',
    };
    expect(BaseEntityHelper.isValid(validEntity)).toBe(true);

    const invalidEntity = {
      id: 'invalid-id',
      createdAt: 'invalid-date',
      updatedAt: 'invalid-date',
    };
    expect(BaseEntityHelper.isValid(invalidEntity)).toBe(false);
  });

  it('should compare entities by ID', () => {
    const entity1: BaseEntityDto = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T14:45:30.123Z',
    };
    const entity2: BaseEntityDto = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2024-01-16T10:30:00.000Z',
      updatedAt: '2024-01-16T14:45:30.123Z',
    };
    expect(BaseEntityHelper.isSameEntity(entity1, entity2)).toBe(true);
  });
});
