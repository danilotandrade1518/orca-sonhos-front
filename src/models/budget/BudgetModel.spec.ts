import { BudgetModel } from './BudgetModel';
import { Uuid } from '../shared/value-objects/Uuid';

describe('BudgetModel', () => {
  const id = Uuid.create('123e4567-e89b-12d3-a456-426614174020');
  const ownerId = Uuid.create('123e4567-e89b-12d3-a456-426614174021');

  it('creates and renames', () => {
    const b = BudgetModel.create({
      id,
      name: 'Family',
      ownerId,
      participantIds: [],
      type: 'personal',
    });
    b.rename('Family 2025');
    expect(b).toBeTruthy();
  });

  it('rejects empty name', () => {
    expect(() =>
      BudgetModel.create({ id, name: ' ', ownerId, participantIds: [], type: 'personal' })
    ).toThrow();
  });

  it('rejects rename with empty name', () => {
    const b = BudgetModel.create({ id, name: 'Ok', ownerId, participantIds: [], type: 'personal' });
    expect(() => b.rename(' ')).toThrow();
  });
});
