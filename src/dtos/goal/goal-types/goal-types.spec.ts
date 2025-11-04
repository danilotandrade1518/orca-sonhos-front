import { describe, it, expect } from 'vitest';
import type { GoalDto } from './goal-types';

describe('GoalDto', () => {
  it('should have all required properties', () => {
    const goal: GoalDto = {
      id: 'goal-1',
      name: 'Viagem para Europa',
      targetAmount: 15000.0,
      currentAmount: 5000.0,
      dueDate: '2025-12-31T23:59:59Z',
      budgetId: 'budget-1',
      sourceAccountId: 'account-1',
    };

    expect(goal.id).toBe('goal-1');
    expect(goal.name).toBe('Viagem para Europa');
    expect(goal.targetAmount).toBe(15000.0);
    expect(goal.currentAmount).toBe(5000.0);
    expect(goal.dueDate).toBe('2025-12-31T23:59:59Z');
    expect(goal.budgetId).toBe('budget-1');
    expect(goal.sourceAccountId).toBe('account-1');
  });

  it('should allow null dueDate', () => {
    const goal: GoalDto = {
      id: 'goal-2',
      name: 'Reserva de emergência',
      targetAmount: 10000.0,
      currentAmount: 7500.0,
      dueDate: null,
      budgetId: 'budget-1',
      sourceAccountId: 'account-1',
    };

    expect(goal.dueDate).toBeNull();
  });
});

