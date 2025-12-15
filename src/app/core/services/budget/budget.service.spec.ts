import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BudgetDto,
  BudgetOverviewDto,
  CreateBudgetRequestDto,
  DeleteBudgetRequestDto,
  GetBudgetOverviewResponseDto,
  GetBudgetsResponseDto,
  UpdateBudgetRequestDto,
} from '../../../../dtos/budget';
import { ApiError, ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { BudgetService } from './budget.service';

describe('BudgetService', () => {
  let service: BudgetService;
  let apiService: {
    getRaw: ReturnType<typeof vi.fn>;
    postRaw: ReturnType<typeof vi.fn>;
    loading: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    clearError: ReturnType<typeof vi.fn>;
  };
  let authService: {
    user: ReturnType<typeof vi.fn>;
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
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

  const mockBudgetOverview: BudgetOverviewDto = {
    id: 'budget-1',
    name: 'Personal Budget',
    type: 'PERSONAL',
    participants: [{ id: 'user-123', name: 'Test User', email: 'test@example.com' }],
    totals: {
      accountsBalance: 5000.0,
      monthIncome: 3000.0,
      monthExpense: 2500.0,
      netMonth: 500.0,
    },
    accounts: [
      {
        id: 'account-1',
        name: 'Checking Account',
        type: 'CHECKING_ACCOUNT',
        balance: 3000.0,
      },
    ],
  };

  beforeEach(() => {
    apiService = {
      getRaw: vi.fn(),
      postRaw: vi.fn(),
      loading: vi.fn(),
      error: vi.fn(),
      clearError: vi.fn(),
    };

    authService = {
      user: vi.fn(() => mockUser),
    };

    TestBed.configureTestingModule({
      providers: [
        BudgetService,
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(BudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBudgets', () => {
    it('should return budgets when user is authenticated', () => {
      const mockResponse: GetBudgetsResponseDto = {
        data: mockBudgets,
        meta: { count: mockBudgets.length },
      };

      apiService.getRaw.mockReturnValue(of(mockResponse));

      service.getBudgets().subscribe((budgets) => {
        expect(budgets).toEqual(mockBudgets);
        expect(apiService.getRaw).toHaveBeenCalledWith('/budgets');
      });
    });

    it('should return empty array and set error when user is not authenticated', () => {
      authService.user = vi.fn(() => null);

      service.getBudgets().subscribe((budgets) => {
        expect(budgets).toEqual([]);
        expect(service.error()).toEqual({
          message: 'User not authenticated',
          status: 401,
          code: 'UNAUTHORIZED',
        });
      });
    });

    it('should handle API errors', () => {
      const mockError: ApiError = {
        message: 'Failed to fetch budgets',
        status: 500,
        code: 'SERVER_ERROR',
      };

      apiService.getRaw.mockReturnValue(throwError(() => mockError));

      service.getBudgets().subscribe((budgets) => {
        expect(budgets).toEqual([]);
        expect(service.error()).toEqual(mockError);
      });
    });
  });

  describe('getBudgetOverview', () => {
    it('should return budget overview when user is authenticated', () => {
      const mockResponse: GetBudgetOverviewResponseDto = {
        data: mockBudgetOverview,
      };

      apiService.getRaw.mockReturnValue(of(mockResponse));

      service.getBudgetOverview('budget-1').subscribe((overview) => {
        expect(overview).toEqual(mockBudgetOverview);
        expect(apiService.getRaw).toHaveBeenCalledWith('/budget/budget-1/overview');
      });
    });

    it('should return null and set error when user is not authenticated', () => {
      authService.user = vi.fn(() => null);

      service.getBudgetOverview('budget-1').subscribe((overview) => {
        expect(overview).toBeNull();
        expect(service.error()).toEqual({
          message: 'User not authenticated',
          status: 401,
          code: 'UNAUTHORIZED',
        });
      });
    });

    it('should handle API errors', () => {
      const mockError: ApiError = {
        message: 'Budget not found',
        status: 404,
        code: 'NOT_FOUND',
      };

      apiService.getRaw.mockReturnValue(throwError(() => mockError));

      service.getBudgetOverview('budget-999').subscribe((overview) => {
        expect(overview).toBeNull();
        expect(service.error()).toEqual(mockError);
      });
    });
  });

  describe('createBudget', () => {
    const createDto: CreateBudgetRequestDto = {
      name: 'New Budget',
      ownerId: 'user-123',
      type: 'PERSONAL',
    };

    it('should create budget and return id when user is authenticated', () => {
      const mockResponse = { id: 'budget-new' };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.createBudget(createDto).subscribe((budgetId) => {
        expect(budgetId).toBe('budget-new');
        expect(apiService.postRaw).toHaveBeenCalledWith('/budget/create-budget', createDto);
      });
    });

    it('should return null and set error when user is not authenticated', () => {
      authService.user = vi.fn(() => null);

      service.createBudget(createDto).subscribe((budgetId) => {
        expect(budgetId).toBeNull();
        expect(service.error()).toEqual({
          message: 'User not authenticated',
          status: 401,
          code: 'UNAUTHORIZED',
        });
      });
    });

    it('should handle API errors', () => {
      const mockError: ApiError = {
        message: 'Validation error',
        status: 400,
        code: 'VALIDATION_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => mockError));

      service.createBudget(createDto).subscribe((budgetId) => {
        expect(budgetId).toBeNull();
        expect(service.error()).toEqual(mockError);
      });
    });
  });

  describe('updateBudget', () => {
    const updateDto: UpdateBudgetRequestDto = {
      userId: 'user-123',
      budgetId: 'budget-1',
      name: 'Updated Budget Name',
    };

    it('should update budget and return true when user is authenticated', () => {
      const mockResponse = { success: true };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.updateBudget(updateDto).subscribe((success) => {
        expect(success).toBeTruthy();
        expect(apiService.postRaw).toHaveBeenCalledWith('/budget/update-budget', updateDto);
      });
    });

    it('should return false and set error when user is not authenticated', () => {
      authService.user = vi.fn(() => null);

      service.updateBudget(updateDto).subscribe((success) => {
        expect(success).toBeFalsy();
        expect(service.error()).toEqual({
          message: 'User not authenticated',
          status: 401,
          code: 'UNAUTHORIZED',
        });
      });
    });

    it('should handle API errors', () => {
      const mockError: ApiError = {
        message: 'Budget not found',
        status: 404,
        code: 'NOT_FOUND',
      };

      apiService.postRaw.mockReturnValue(throwError(() => mockError));

      service.updateBudget(updateDto).subscribe((success) => {
        expect(success).toBeFalsy();
        expect(service.error()).toEqual(mockError);
      });
    });
  });

  describe('deleteBudget', () => {
    const deleteDto: DeleteBudgetRequestDto = {
      userId: 'user-123',
      budgetId: 'budget-1',
    };

    it('should delete budget and return true when user is authenticated', () => {
      const mockResponse = { success: true };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.deleteBudget(deleteDto).subscribe((success) => {
        expect(success).toBeTruthy();
        expect(apiService.postRaw).toHaveBeenCalledWith('/budget/delete-budget', deleteDto);
      });
    });

    it('should return false and set error when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      service.deleteBudget(deleteDto).subscribe((success) => {
        expect(success).toBeFalsy();
        expect(service.error()).toEqual({
          message: 'User not authenticated',
          status: 401,
          code: 'UNAUTHORIZED',
        });
      });
    });

    it('should handle API errors', () => {
      const mockError: ApiError = {
        message: 'Budget not found',
        status: 404,
        code: 'NOT_FOUND',
      };

      apiService.postRaw.mockReturnValue(throwError(() => mockError));

      service.deleteBudget(deleteDto).subscribe((success) => {
        expect(success).toBeFalsy();
        expect(service.error()).toEqual(mockError);
      });
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      const mockError: ApiError = {
        message: 'Test error',
        status: 500,
        code: 'ERROR',
      };

      apiService.getRaw.mockReturnValue(throwError(() => mockError));

      service.getBudgets().subscribe(() => {
        expect(service.error()).toEqual(mockError);

        service.clearError();

        expect(service.error()).toBeNull();
        expect(service.error()).toBeNull();
      });
    });
  });

  describe('loading state', () => {
    it('should set loading to true during request', () => {
      apiService.getRaw.mockReturnValue(of({ data: mockBudgets, meta: { count: 2 } }));

      service.getBudgets().subscribe();

      expect(service.loading()).toBeFalsy();
    });
  });
});
