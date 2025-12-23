import { describe, it, expect } from 'vitest';
import type { GoalDto } from './goal-types';

describe('GoalDto', () => {
  it('should have all required properties', () => {
    const goal: GoalDto = {
      id: 'goal-1',
      name: 'Viagem para Europa',
      totalAmount: 15000.0,
      accumulatedAmount: 5000.0,
      deadline: '2025-12-31T23:59:59Z',
      budgetId: 'budget-1',
      sourceAccountId: 'account-1',
      status: 'on-track',
    };

    expect(goal.id).toBe('goal-1');
    expect(goal.name).toBe('Viagem para Europa');
    expect(goal.totalAmount).toBe(15000.0);
    expect(goal.accumulatedAmount).toBe(5000.0);
    expect(goal.deadline).toBe('2025-12-31T23:59:59Z');
    expect(goal.budgetId).toBe('budget-1');
    expect(goal.sourceAccountId).toBe('account-1');
    expect(goal.status).toBe('on-track');
  });

  it('should allow null deadline', () => {
    const goal: GoalDto = {
      id: 'goal-2',
      name: 'Reserva de emergência',
      totalAmount: 10000.0,
      accumulatedAmount: 7500.0,
      deadline: null,
      budgetId: 'budget-1',
      sourceAccountId: 'account-1',
      status: 'on-track',
    };

    expect(goal.deadline).toBeNull();
  });

  it('should accept all status values', () => {
    const statuses: GoalDto['status'][] = ['on-track', 'overdue', 'ahead', 'completed'];
    
    statuses.forEach((status) => {
      const goal: GoalDto = {
        id: 'goal-3',
        name: 'Test Goal',
        totalAmount: 1000.0,
        accumulatedAmount: 500.0,
        deadline: null,
        budgetId: 'budget-1',
        status,
      };
      
      expect(goal.status).toBe(status);
    });
  });
});
