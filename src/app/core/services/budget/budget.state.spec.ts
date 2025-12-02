import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BudgetDto } from '../../../../dtos/budget';
import { BudgetSelectionService } from '../budget-selection/budget-selection.service';
import { PresetCategoriesService } from '../category/preset-categories.service';
import { BudgetService } from './budget.service';
import { BudgetState } from './budget.state';

describe('BudgetState', () => {
  let budgetState: BudgetState;
  let budgetService: {
    getBudgets: ReturnType<typeof vi.fn>;
    createBudget: ReturnType<typeof vi.fn>;
    updateBudget: ReturnType<typeof vi.fn>;
    deleteBudget: ReturnType<typeof vi.fn>;
  };
  let budgetSelectionService: {
    setSelectedBudget: ReturnType<typeof vi.fn>;
    setAvailableBudgets: ReturnType<typeof vi.fn>;
    selectedBudget: ReturnType<typeof vi.fn>;
    selectedBudgetId: ReturnType<typeof vi.fn>;
  };
  let presetCategoriesService: {
    seedPresetCategories: ReturnType<typeof vi.fn>;
  };

  const mockBudgets: BudgetDto[] = [
    {
      id: 'budget-1',
      name: 'Personal Budget',
      type: 'PERSONAL',
      participantsCount: 1,
    },
    {
      id: 'budget-2',
      name: 'Family Budget',
      type: 'SHARED',
      participantsCount: 3,
    },
  ];

  beforeEach(() => {
    budgetService = {
      getBudgets: vi.fn(),
      createBudget: vi.fn(),
      updateBudget: vi.fn(),
      deleteBudget: vi.fn(),
    };

    budgetSelectionService = {
      setSelectedBudget: vi.fn(),
      setAvailableBudgets: vi.fn(),
      selectedBudget: vi.fn(() => null),
      selectedBudgetId: vi.fn(() => null),
    };

    presetCategoriesService = {
      seedPresetCategories: vi.fn().mockResolvedValue({ success: true, created: 14, errors: [] }),
    };

    TestBed.configureTestingModule({
      providers: [
        BudgetState,
        { provide: BudgetService, useValue: budgetService },
        { provide: BudgetSelectionService, useValue: budgetSelectionService },
        { provide: PresetCategoriesService, useValue: presetCategoriesService },
        provideZonelessChangeDetection(),
      ],
    });

    budgetState = TestBed.inject(BudgetState);
  });

  it('should be created', () => {
    expect(budgetState).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty budgets', () => {
      expect(budgetState.budgets()).toEqual([]);
      expect(budgetState.loading()).toBeFalsy();
      expect(budgetState.error()).toBeNull();
    });

    it('should compute hasBudgets as false initially', () => {
      expect(budgetState.hasBudgets()).toBeFalsy();
    });

    it('should compute budgetsCount as 0 initially', () => {
      expect(budgetState.budgetsCount()).toBe(0);
    });
  });

  describe('loadBudgets', () => {
    it('should load budgets successfully', async () => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));

      budgetState.loadBudgets();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.budgets()).toEqual(mockBudgets);
      expect(budgetState.loading()).toBeFalsy();
      expect(budgetState.error()).toBeNull();
      expect(budgetSelectionService.setAvailableBudgets).toHaveBeenCalledWith(mockBudgets);
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should automatically select first budget when none is selected', async () => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetSelectionService.selectedBudget = vi.fn(() => null);

      budgetState.loadBudgets();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledWith(mockBudgets[0]);
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should not auto-select if budget is already selected', async () => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetSelectionService.selectedBudget.mockReturnValue(mockBudgets[1]);

      budgetState.loadBudgets();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledTimes(0);
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should handle errors when loading budgets', async () => {
      const mockError = { message: 'Failed to load budgets' };
      budgetService.getBudgets.mockReturnValue(throwError(() => mockError));

      budgetState.loadBudgets();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.error()).toBe('Failed to load budgets');
      expect(budgetState.loading()).toBeFalsy();
      expect(budgetState.budgets()).toEqual([]);
    });

    it('should set loading state during request', async () => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets).pipe(delay(50)));

      budgetState.loadBudgets();

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(budgetState.loading()).toBeTruthy();
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
  });

  describe('selectBudget', () => {
    beforeEach(() => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();
    });

    it('should select budget by id', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      budgetState.selectBudget('budget-2');

      expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledWith(mockBudgets[1]);
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should not call setSelectedBudget for non-existent budget id', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const initialCallCount = budgetSelectionService.setSelectedBudget.mock.calls.length;

      budgetState.selectBudget('non-existent-id');

      expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledTimes(initialCallCount);
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });
  });

  describe('selectFirstBudget', () => {
    it('should select first budget when budgets exist', async () => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();

      await new Promise((resolve) => setTimeout(resolve, 100));
      budgetState.selectFirstBudget();

      expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledWith(mockBudgets[0]);
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should not call setSelectedBudget when no budgets exist', () => {
      budgetState.selectFirstBudget();

      expect(budgetSelectionService.setSelectedBudget).not.toHaveBeenCalled();
    });
  });

  describe('createBudget', () => {
    beforeEach(() => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();
    });

    it('should create budget successfully and reload list', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      budgetService.createBudget.mockReturnValue(of('budget-new'));
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));

      budgetState.createBudget('New Budget', 'PERSONAL', 'user-123');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetService.createBudget).toHaveBeenCalledWith({
        name: 'New Budget',
        type: 'PERSONAL',
        ownerId: 'user-123',
      });
      expect(budgetService.getBudgets).toHaveBeenCalled();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should set error when budget creation fails', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      budgetService.createBudget.mockReturnValue(of(null));

      budgetState.createBudget('New Budget', 'PERSONAL', 'user-123');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.error()).toBe('Failed to create budget');
      expect(budgetState.loading()).toBeFalsy();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should handle API errors during creation', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const mockError = { message: 'Validation error' };
      budgetService.createBudget.mockReturnValue(throwError(() => mockError));

      budgetState.createBudget('New Budget', 'PERSONAL', 'user-123');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.error()).toBe('Validation error');
      expect(budgetState.loading()).toBeFalsy();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });
  });

  describe('updateBudget', () => {
    beforeEach(() => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();
    });

    it('should update budget successfully and reload list', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      budgetService.updateBudget.mockReturnValue(of(true));
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));

      budgetState.updateBudget('user-123', 'budget-1', 'Updated Name');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetService.updateBudget).toHaveBeenCalledWith({
        userId: 'user-123',
        budgetId: 'budget-1',
        name: 'Updated Name',
      });
      expect(budgetService.getBudgets).toHaveBeenCalled();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should set error when update fails', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      budgetService.updateBudget.mockReturnValue(of(false));

      budgetState.updateBudget('user-123', 'budget-1', 'Updated Name');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.error()).toBe('Failed to update budget');
      expect(budgetState.loading()).toBeFalsy();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should handle API errors during update', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const mockError = { message: 'Budget not found' };
      budgetService.updateBudget.mockReturnValue(throwError(() => mockError));

      budgetState.updateBudget('user-123', 'budget-1', 'Updated Name');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.error()).toBe('Budget not found');
      expect(budgetState.loading()).toBeFalsy();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });
  });

  describe('deleteBudget', () => {
    beforeEach(() => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();
    });

    it('should delete budget successfully and reload list', async () => {
      budgetService.deleteBudget.mockReturnValue(of(true));

      budgetState.deleteBudget('user-123', 'budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetService.deleteBudget).toHaveBeenCalledWith({
        userId: 'user-123',
        budgetId: 'budget-1',
      });
      expect(budgetService.getBudgets).toHaveBeenCalled();
    });

    it('should re-select first budget when deleted budget was selected', async () => {
      budgetSelectionService.selectedBudgetId = vi.fn(() => 'budget-1');
      budgetService.deleteBudget.mockReturnValue(of(true));

      budgetState.deleteBudget('user-123', 'budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetService.getBudgets).toHaveBeenCalled();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should set error when deletion fails', async () => {
      budgetService.deleteBudget.mockReturnValue(of(false));

      budgetState.deleteBudget('user-123', 'budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.error()).toBe('Failed to delete budget');
      expect(budgetState.loading()).toBeFalsy();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });

    it('should handle API errors during deletion', async () => {
      const mockError = { message: 'Budget not found' };
      budgetService.deleteBudget.mockReturnValue(throwError(() => mockError));

      budgetState.deleteBudget('user-123', 'budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.error()).toBe('Budget not found');
      expect(budgetState.loading()).toBeFalsy();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      budgetService.getBudgets.mockReturnValue(throwError(() => ({ message: 'Test error' })));

      budgetState.loadBudgets();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.error()).toBeTruthy();

      budgetState.clearError();

      expect(budgetState.error()).toBeNull();
    });
  });

  describe('refreshBudgets', () => {
    it('should reload budgets', async () => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));

      budgetState.refreshBudgets();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetService.getBudgets).toHaveBeenCalled();
      expect(budgetState.budgets()).toEqual(mockBudgets);
    });
  });

  describe('Computed Properties', () => {
    it('should compute hasBudgets correctly', async () => {
      expect(budgetState.hasBudgets()).toBeFalsy();

      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.hasBudgets()).toBeTruthy();
    });

    it('should compute budgetsCount correctly', async () => {
      expect(budgetState.budgetsCount()).toBe(0);

      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(budgetState.budgetsCount()).toBe(2);
    });
  });
});
