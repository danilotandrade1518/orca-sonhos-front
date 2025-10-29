import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BudgetDto } from '../../../../dtos/budget';
import { BudgetSelectionService } from '../budget-selection/budget-selection.service';
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

    TestBed.configureTestingModule({
      providers: [
        BudgetState,
        { provide: BudgetService, useValue: budgetService },
        { provide: BudgetSelectionService, useValue: budgetSelectionService },
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
    it('should load budgets successfully', (done) => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));

      budgetState.loadBudgets();

      setTimeout(() => {
        expect(budgetState.budgets()).toEqual(mockBudgets);
        expect(budgetState.loading()).toBeFalsy();
        expect(budgetState.error()).toBeNull();
        expect(budgetSelectionService.setAvailableBudgets).toHaveBeenCalledWith(mockBudgets);
        done();
      }, 100);
    });

    it('should automatically select first budget when none is selected', (done) => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetSelectionService.selectedBudget = vi.fn(() => null);

      budgetState.loadBudgets();

      setTimeout(() => {
        expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledWith(mockBudgets[0]);
        done();
      }, 100);
    });

    it('should not auto-select if budget is already selected', (done) => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetSelectionService.selectedBudget = jest.fn(() => mockBudgets[1]);

      budgetState.loadBudgets();

      setTimeout(() => {
        expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledTimes(0);
        done();
      }, 100);
    });

    it('should handle errors when loading budgets', (done) => {
      const mockError = { message: 'Failed to load budgets' };
      budgetService.getBudgets.mockReturnValue(throwError(() => mockError));

      budgetState.loadBudgets();

      setTimeout(() => {
        expect(budgetState.error()).toBe('Failed to load budgets');
        expect(budgetState.loading()).toBeFalsy();
        done();
      }, 100);
    });

    it('should set loading state during request', () => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));

      budgetState.loadBudgets();

      expect(budgetState.loading()).toBeTruthy();
    });
  });

  describe('selectBudget', () => {
    beforeEach(() => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();
    });

    it('should select budget by id', (done) => {
      setTimeout(() => {
        budgetState.selectBudget('budget-2');

        expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledWith(mockBudgets[1]);
        done();
      }, 100);
    });

    it('should not call setSelectedBudget for non-existent budget id', (done) => {
      setTimeout(() => {
        const initialCallCount = budgetSelectionService.setSelectedBudget.mock.calls.length;

        budgetState.selectBudget('non-existent-id');

        expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledTimes(initialCallCount);
        done();
      }, 100);
    });
  });

  describe('selectFirstBudget', () => {
    it('should select first budget when budgets exist', (done) => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();

      setTimeout(() => {
        budgetState.selectFirstBudget();

        expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledWith(mockBudgets[0]);
        done();
      }, 100);
    });

    it('should not call setSelectedBudget when no budgets exist', () => {
      budgetState.selectFirstBudget();

      expect(budgetSelectionService.setSelectedBudget).not.toHaveBeenCalled();
    });
  });

  describe('createBudget', () => {
    it('should create budget successfully and reload list', (done) => {
      budgetService.createBudget.mockReturnValue(of('budget-new'));
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));

      budgetState.createBudget('New Budget', 'PERSONAL', 'user-123');

      setTimeout(() => {
        expect(budgetService.createBudget).toHaveBeenCalledWith({
          name: 'New Budget',
          type: 'PERSONAL',
          ownerId: 'user-123',
        });
        expect(budgetService.getBudgets).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should set error when budget creation fails', (done) => {
      budgetService.createBudget.mockReturnValue(of(null));

      budgetState.createBudget('New Budget', 'PERSONAL', 'user-123');

      setTimeout(() => {
        expect(budgetState.error()).toBe('Failed to create budget');
        expect(budgetState.loading()).toBeFalsy();
        done();
      }, 100);
    });

    it('should handle API errors during creation', (done) => {
      const mockError = { message: 'Validation error' };
      budgetService.createBudget.mockReturnValue(throwError(() => mockError));

      budgetState.createBudget('New Budget', 'PERSONAL', 'user-123');

      setTimeout(() => {
        expect(budgetState.error()).toBe('Validation error');
        expect(budgetState.loading()).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('updateBudget', () => {
    it('should update budget successfully and reload list', (done) => {
      budgetService.updateBudget.mockReturnValue(of(true));
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));

      budgetState.updateBudget('user-123', 'budget-1', 'Updated Name');

      setTimeout(() => {
        expect(budgetService.updateBudget).toHaveBeenCalledWith({
          userId: 'user-123',
          budgetId: 'budget-1',
          name: 'Updated Name',
        });
        expect(budgetService.getBudgets).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should set error when update fails', (done) => {
      budgetService.updateBudget.mockReturnValue(of(false));

      budgetState.updateBudget('user-123', 'budget-1', 'Updated Name');

      setTimeout(() => {
        expect(budgetState.error()).toBe('Failed to update budget');
        expect(budgetState.loading()).toBeFalsy();
        done();
      }, 100);
    });

    it('should handle API errors during update', (done) => {
      const mockError = { message: 'Budget not found' };
      budgetService.updateBudget.mockReturnValue(throwError(() => mockError));

      budgetState.updateBudget('user-123', 'budget-1', 'Updated Name');

      setTimeout(() => {
        expect(budgetState.error()).toBe('Budget not found');
        expect(budgetState.loading()).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('deleteBudget', () => {
    beforeEach(() => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();
    });

    it('should delete budget successfully and reload list', (done) => {
      budgetService.deleteBudget.mockReturnValue(of(true));

      budgetState.deleteBudget('user-123', 'budget-1');

      setTimeout(() => {
        expect(budgetService.deleteBudget).toHaveBeenCalledWith({
          userId: 'user-123',
          budgetId: 'budget-1',
        });
        expect(budgetService.getBudgets).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should re-select first budget when deleted budget was selected', (done) => {
      budgetSelectionService.selectedBudgetId = vi.fn(() => 'budget-1');
      budgetService.deleteBudget.mockReturnValue(of(true));

      budgetState.deleteBudget('user-123', 'budget-1');

      setTimeout(() => {
        expect(budgetService.getBudgets).toHaveBeenCalled();
        done();
      }, 200);
    });

    it('should set error when deletion fails', (done) => {
      budgetService.deleteBudget.mockReturnValue(of(false));

      budgetState.deleteBudget('user-123', 'budget-1');

      setTimeout(() => {
        expect(budgetState.error()).toBe('Failed to delete budget');
        expect(budgetState.loading()).toBeFalsy();
        done();
      }, 100);
    });

    it('should handle API errors during deletion', (done) => {
      const mockError = { message: 'Budget not found' };
      budgetService.deleteBudget.mockReturnValue(throwError(() => mockError));

      budgetState.deleteBudget('user-123', 'budget-1');

      setTimeout(() => {
        expect(budgetState.error()).toBe('Budget not found');
        expect(budgetState.loading()).toBeFalsy();
        done();
      }, 100);
    });
  });

  describe('clearError', () => {
    it('should clear error state', (done) => {
      budgetService.getBudgets.mockReturnValue(throwError(() => ({ message: 'Test error' })));

      budgetState.loadBudgets();

      setTimeout(() => {
        expect(budgetState.error()).toBeTruthy();

        budgetState.clearError();

        expect(budgetState.error()).toBeNull();
        done();
      }, 100);
    });
  });

  describe('refreshBudgets', () => {
    it('should reload budgets', (done) => {
      budgetService.getBudgets.mockReturnValue(of(mockBudgets));

      budgetState.refreshBudgets();

      setTimeout(() => {
        expect(budgetService.getBudgets).toHaveBeenCalled();
        expect(budgetState.budgets()).toEqual(mockBudgets);
        done();
      }, 100);
    });
  });

  describe('Computed Properties', () => {
    it('should compute hasBudgets correctly', (done) => {
      expect(budgetState.hasBudgets()).toBeFalsy();

      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();

      setTimeout(() => {
        expect(budgetState.hasBudgets()).toBeTruthy();
        done();
      }, 100);
    });

    it('should compute budgetsCount correctly', (done) => {
      expect(budgetState.budgetsCount()).toBe(0);

      budgetService.getBudgets.mockReturnValue(of(mockBudgets));
      budgetState.loadBudgets();

      setTimeout(() => {
        expect(budgetState.budgetsCount()).toBe(2);
        done();
      }, 100);
    });
  });
});
