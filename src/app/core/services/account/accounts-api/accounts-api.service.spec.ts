import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AccountDto,
  CreateAccountRequestDto,
  CreateAccountResponseDto,
  DeleteAccountRequestDto,
  DeleteAccountResponseDto,
  ListAccountsResponseDto,
  ReconcileAccountRequestDto,
  ReconcileAccountResponseDto,
  TransferBetweenAccountsRequestDto,
  TransferBetweenAccountsResponseDto,
  UpdateAccountRequestDto,
  UpdateAccountResponseDto,
} from '../../../../../dtos/account';
import { ApiError, ApiService } from '../../api/api.service';
import { AuthService } from '../../auth/auth.service';
import { AccountsApiService } from './accounts-api.service';

describe('AccountsApiService', () => {
  let service: AccountsApiService;
  let apiService: {
    getRaw: ReturnType<typeof vi.fn>;
    postRaw: ReturnType<typeof vi.fn>;
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

  const mockAccounts: AccountDto[] = [
    {
      id: 'account-1',
      name: 'Conta Corrente Principal',
      type: 'CHECKING_ACCOUNT',
      balance: 3000.0,
    },
    {
      id: 'account-2',
      name: 'Poupança',
      type: 'SAVINGS_ACCOUNT',
      balance: 2000.0,
    },
  ];

  beforeEach(() => {
    apiService = {
      getRaw: vi.fn(),
      postRaw: vi.fn(),
    };

    authService = {
      user: vi.fn(() => mockUser),
    };

    TestBed.configureTestingModule({
      providers: [
        AccountsApiService,
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(AccountsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listAccounts', () => {
    it('should list accounts successfully', () => {
      const mockResponse: ListAccountsResponseDto = {
        data: mockAccounts,
        meta: { count: mockAccounts.length },
      };

      apiService.getRaw.mockReturnValue(of(mockResponse));

      service.listAccounts('budget-1').subscribe((accounts) => {
        expect(accounts).toEqual(mockAccounts);
        expect(apiService.getRaw).toHaveBeenCalledWith('/accounts', { budgetId: 'budget-1' });
      });
    });

    it('should return empty array when user is not authenticated', () => {
      authService.user.mockReturnValue(null);

      service.listAccounts('budget-1').subscribe((accounts) => {
        expect(accounts).toEqual([]);
        expect(service.error()).toEqual({
          message: 'User not authenticated',
          status: 401,
          code: 'UNAUTHORIZED',
        });
      });
    });

    it('should return empty array when budgetId is missing', () => {
      service.listAccounts('').subscribe((accounts) => {
        expect(accounts).toEqual([]);
        expect(service.error()?.code).toBe('BAD_REQUEST');
      });
    });

    it('should handle API errors', () => {
      const apiError: ApiError = {
        message: 'Failed to fetch accounts',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.getRaw.mockReturnValue(throwError(() => apiError));

      service.listAccounts('budget-1').subscribe((accounts) => {
        expect(accounts).toEqual([]);
        expect(service.error()).toEqual(apiError);
      });
    });
  });

  describe('createAccount', () => {
    it('should create account successfully', () => {
      const dto: CreateAccountRequestDto = {
        userId: 'user-123',
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        budgetId: 'budget-1',
        initialBalance: 1000,
      };

      const mockResponse: CreateAccountResponseDto = {
        id: 'account-new',
      };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.createAccount(dto).subscribe((accountId) => {
        expect(accountId).toBe('account-new');
        expect(apiService.postRaw).toHaveBeenCalledWith('/accounts/create-account', dto);
      });
    });

    it('should return null when user is not authenticated', () => {
      authService.user.mockReturnValue(null);

      const dto: CreateAccountRequestDto = {
        userId: 'user-123',
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        budgetId: 'budget-1',
      };

      service.createAccount(dto).subscribe((accountId) => {
        expect(accountId).toBeNull();
      });
    });
  });

  describe('updateAccount', () => {
    it('should update account successfully', () => {
      const dto: UpdateAccountRequestDto = {
        id: 'account-1',
        userId: 'user-123',
        name: 'Conta Atualizada',
      };

      const mockResponse: UpdateAccountResponseDto = {
        success: true,
      };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.updateAccount(dto).subscribe((success) => {
        expect(success).toBe(true);
      });
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', () => {
      const dto: DeleteAccountRequestDto = {
        userId: 'user-123',
        accountId: 'account-1',
      };

      const mockResponse: DeleteAccountResponseDto = {
        success: true,
      };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.deleteAccount(dto).subscribe((success) => {
        expect(success).toBe(true);
      });
    });
  });

  describe('transferBetweenAccounts', () => {
    it('should transfer between accounts successfully', () => {
      const dto: TransferBetweenAccountsRequestDto = {
        userId: 'user-123',
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 500,
      };

      const mockResponse: TransferBetweenAccountsResponseDto = {
        success: true,
      };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.transferBetweenAccounts(dto).subscribe((success) => {
        expect(success).toBe(true);
      });
    });
  });

  describe('reconcileAccount', () => {
    it('should reconcile account successfully', () => {
      const dto: ReconcileAccountRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-1',
        accountId: 'account-1',
        realBalance: 3500,
      };

      const mockResponse: ReconcileAccountResponseDto = {
        success: true,
      };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.reconcileAccount(dto).subscribe((success) => {
        expect(success).toBe(true);
      });
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      service.clearError();
      expect(service.error()).toBeNull();
    });
  });
});
