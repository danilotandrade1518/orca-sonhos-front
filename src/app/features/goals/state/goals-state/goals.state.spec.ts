import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { GoalDto } from '../../../../../dtos/goal';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { GoalsApiService } from '../../services/goals-api/goals-api.service';
import { GoalsState } from './goals.state';

describe('GoalsState', () => {
  let goalsState: GoalsState;
  let goalsApiService: {
    listByBudget: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    addAmount: ReturnType<typeof vi.fn>;
    removeAmount: ReturnType<typeof vi.fn>;
  };
  let budgetSelectionService: {
    selectedBudgetId: ReturnType<typeof vi.fn>;
  };

  const mockGoals: GoalDto[] = [
    {
      id: 'goal-1',
      name: 'Viagem para Europa',
      totalAmount: 15000,
      accumulatedAmount: 5000,
      deadline: '2025-12-31T23:59:59Z',
      budgetId: 'budget-1',
      sourceAccountId: 'account-1',
    },
    {
      id: 'goal-2',
      name: 'Reserva de emergência',
      totalAmount: 10000,
      accumulatedAmount: 7500,
      deadline: null,
      budgetId: 'budget-1',
      sourceAccountId: 'account-1',
    },
    {
      id: 'goal-3',
      name: 'Novo notebook',
      totalAmount: 3000,
      accumulatedAmount: 3000,
      deadline: '2025-03-31T23:59:59Z',
      budgetId: 'budget-1',
      sourceAccountId: 'account-1',
    },
  ];

  beforeEach(() => {
    goalsApiService = {
      listByBudget: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      addAmount: vi.fn(),
      removeAmount: vi.fn(),
    };

    budgetSelectionService = {
      selectedBudgetId: vi.fn(() => 'budget-1'),
    };

    TestBed.configureTestingModule({
      providers: [
        GoalsState,
        { provide: GoalsApiService, useValue: goalsApiService },
        { provide: BudgetSelectionService, useValue: budgetSelectionService },
        provideZonelessChangeDetection(),
      ],
    });

    goalsState = TestBed.inject(GoalsState);
  });

  it('should be created', () => {
    expect(goalsState).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty items', () => {
      expect(goalsState.items()).toEqual([]);
      expect(goalsState.isLoading()).toBeFalsy();
      expect(goalsState.lastUpdated()).toBeNull();
      expect(goalsState.error()).toBeNull();
    });

    it('should compute hasItems as false initially', () => {
      expect(goalsState.hasItems()).toBeFalsy();
    });

    it('should compute itemsCount as 0 initially', () => {
      expect(goalsState.itemsCount()).toBe(0);
    });
  });

  describe('load', () => {
    it('should load goals successfully', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: mockGoals,
          meta: { count: mockGoals.length },
        })
      );

      goalsState.load('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(goalsState.items()).toEqual(mockGoals);
      expect(goalsState.isLoading()).toBeFalsy();
      expect(goalsState.lastUpdated()).toBeTruthy();
      expect(goalsState.error()).toBeNull();
    });

    it('should use selectedBudgetId when budgetId is not provided', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: mockGoals,
          meta: { count: mockGoals.length },
        })
      );

      goalsState.load();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(goalsApiService.listByBudget).toHaveBeenCalledWith('budget-1');
    });

    it('should set error when no budget is selected', () => {
      budgetSelectionService.selectedBudgetId = vi.fn(() => null);

      goalsState.load();

      expect(goalsState.error()).toBe('Nenhum orçamento selecionado');
      expect(goalsApiService.listByBudget).not.toHaveBeenCalled();
    });

    it('should handle load error', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        throwError(() => ({ message: 'Network error' }))
      );

      goalsState.load('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(goalsState.isLoading()).toBeFalsy();
      expect(goalsState.error()).toBe('Network error');
    });
  });

  describe('progressById', () => {
    it('should calculate progress correctly', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: mockGoals,
          meta: { count: mockGoals.length },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const progress = goalsState.progressById();
      expect(progress('goal-1')).toBeCloseTo(33.33, 1);
      expect(progress('goal-2')).toBe(75);
      expect(progress('goal-3')).toBe(100);
    });

    it('should return 0 for non-existent goal', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: mockGoals,
          meta: { count: mockGoals.length },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const progress = goalsState.progressById();
      expect(progress('non-existent')).toBe(0);
    });

    it('should handle zero totalAmount', async () => {
      const goalsWithZero: GoalDto[] = [
        {
          id: 'goal-zero',
          name: 'Goal with zero target',
          totalAmount: 0,
          accumulatedAmount: 100,
          deadline: null,
          budgetId: 'budget-1',
          sourceAccountId: 'account-1',
        },
      ];

      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: goalsWithZero,
          meta: { count: 1 },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const progress = goalsState.progressById();
      expect(progress('goal-zero')).toBe(0);
    });
  });

  describe('remainingById', () => {
    it('should calculate remaining correctly', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: mockGoals,
          meta: { count: mockGoals.length },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const remaining = goalsState.remainingById();
      expect(remaining('goal-1')).toBe(10000);
      expect(remaining('goal-2')).toBe(2500);
      expect(remaining('goal-3')).toBe(0);
    });

    it('should return 0 when accumulatedAmount exceeds totalAmount', async () => {
      const overGoal: GoalDto[] = [
        {
          id: 'goal-over',
          name: 'Goal over target',
          totalAmount: 1000,
          accumulatedAmount: 1500,
          deadline: null,
          budgetId: 'budget-1',
          sourceAccountId: 'account-1',
        },
      ];

      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: overGoal,
          meta: { count: 1 },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const remaining = goalsState.remainingById();
      expect(remaining('goal-over')).toBe(0);
    });
  });

  describe('suggestedMonthlyById', () => {
    it('should calculate suggested monthly when dueDate exists', async () => {
      const goalsWithDeadline: GoalDto[] = [
        {
          id: 'goal-monthly',
          name: 'Goal with deadline',
          totalAmount: 12000,
          accumulatedAmount: 0,
          deadline: '2025-12-31T23:59:59Z',
          budgetId: 'budget-1',
          sourceAccountId: 'account-1',
        },
      ];

      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: goalsWithDeadline,
          meta: { count: 1 },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const suggested = goalsState.suggestedMonthlyById();
      const value = suggested('goal-monthly');
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThanOrEqual(12000);
    });

    it('should return null when dueDate is null', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: mockGoals,
          meta: { count: mockGoals.length },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const suggested = goalsState.suggestedMonthlyById();
      expect(suggested('goal-2')).toBeNull();
    });

    it('should return null when dueDate is in the past', async () => {
      const pastGoal: GoalDto[] = [
        {
          id: 'goal-past',
          name: 'Goal with past deadline',
          totalAmount: 1000,
          accumulatedAmount: 500,
          deadline: '2020-01-01T00:00:00Z',
          budgetId: 'budget-1',
          sourceAccountId: 'account-1',
        },
      ];

      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: pastGoal,
          meta: { count: 1 },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const suggested = goalsState.suggestedMonthlyById();
      expect(suggested('goal-past')).toBeNull();
    });
  });

  describe('addAmount', () => {
    it('should add amount successfully', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: [mockGoals[0]],
          meta: { count: 1 },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      goalsApiService.addAmount.mockReturnValue(
        of({
          data: { success: true },
          meta: {},
        })
      );

      goalsState.addAmount({ id: 'goal-1', amount: 1000 });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const goal = goalsState.items().find((g) => g.id === 'goal-1');
      expect(goal?.accumulatedAmount).toBe(6000);
      expect(goalsState.isLoading()).toBeFalsy();
    });

    it('should reject negative amount', () => {
      goalsState.addAmount({ id: 'goal-1', amount: -100 });

      expect(goalsState.error()).toBe('O valor do aporte deve ser positivo');
      expect(goalsApiService.addAmount).not.toHaveBeenCalled();
    });

    it('should reject zero amount', () => {
      goalsState.addAmount({ id: 'goal-1', amount: 0 });

      expect(goalsState.error()).toBe('O valor do aporte deve ser positivo');
      expect(goalsApiService.addAmount).not.toHaveBeenCalled();
    });
  });

  describe('removeAmount', () => {
    it('should remove amount successfully', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: [mockGoals[0]],
          meta: { count: 1 },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      goalsApiService.removeAmount.mockReturnValue(
        of({
          data: { success: true },
          meta: {},
        })
      );

      goalsState.removeAmount({ id: 'goal-1', amount: 1000 });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const goal = goalsState.items().find((g) => g.id === 'goal-1');
      expect(goal?.accumulatedAmount).toBe(4000);
      expect(goalsState.isLoading()).toBeFalsy();
    });

    it('should reject removal that results in negative amount', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: [mockGoals[0]],
          meta: { count: 1 },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      goalsState.removeAmount({ id: 'goal-1', amount: 6000 });

      expect(goalsState.error()).toBe('Não é possível remover valor que resulte em saldo negativo');
      expect(goalsApiService.removeAmount).not.toHaveBeenCalled();
    });

    it('should reject negative amount', () => {
      goalsState.removeAmount({ id: 'goal-1', amount: -100 });

      expect(goalsState.error()).toBe('O valor a remover deve ser positivo');
      expect(goalsApiService.removeAmount).not.toHaveBeenCalled();
    });

    it('should reject when goal not found', () => {
      goalsState.removeAmount({ id: 'non-existent', amount: 100 });

      expect(goalsState.error()).toBe('Meta não encontrada');
      expect(goalsApiService.removeAmount).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create goal successfully', async () => {
      goalsApiService.create.mockReturnValue(
        of({
          data: { id: 'goal-new' },
          meta: {},
        })
      );

      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: mockGoals,
          meta: { count: mockGoals.length },
        })
      );

      goalsState.create({
        name: 'New Goal',
        totalAmount: 5000,
        budgetId: 'budget-1',
        sourceAccountId: 'account-1',
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(goalsApiService.create).toHaveBeenCalled();
      expect(goalsApiService.listByBudget).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update goal successfully', async () => {
      goalsApiService.update.mockReturnValue(
        of({
          data: { success: true },
          meta: {},
        })
      );

      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: mockGoals,
          meta: { count: mockGoals.length },
        })
      );

      goalsState.update({
        id: 'goal-1',
        name: 'Updated Goal',
        totalAmount: 20000,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(goalsApiService.update).toHaveBeenCalled();
      expect(goalsApiService.listByBudget).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete goal successfully', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: [mockGoals[0]],
          meta: { count: 1 },
        })
      );

      goalsState.load('budget-1');
      await new Promise((resolve) => setTimeout(resolve, 100));

      goalsApiService.delete.mockReturnValue(
        of({
          data: { success: true },
          meta: {},
        })
      );

      goalsState.delete({ id: 'goal-1' });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(goalsState.items().find((g) => g.id === 'goal-1')).toBeUndefined();
      expect(goalsState.isLoading()).toBeFalsy();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      goalsState.clearError();
      expect(goalsState.error()).toBeNull();
    });
  });

  describe('refresh', () => {
    it('should reload goals', async () => {
      goalsApiService.listByBudget.mockReturnValue(
        of({
          data: mockGoals,
          meta: { count: mockGoals.length },
        })
      );

      goalsState.refresh();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(goalsApiService.listByBudget).toHaveBeenCalledWith('budget-1');
    });
  });
});
