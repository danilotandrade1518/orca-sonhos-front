import { Uuid } from './Uuid';

describe('Uuid', () => {
  it('validates and wraps value', () => {
    const raw = '123e4567-e89b-12d3-a456-426614174000';
    const id = Uuid.create(raw);
    expect(id.toString()).toBe(raw);
  });

  it('rejects invalid values', () => {
    expect(() => Uuid.create('not-a-uuid')).toThrow();
  });

  it('isValid returns false for non-string input', () => {
    expect(Uuid.isValid(123 as unknown as string)).toBeFalse();
  });
});
