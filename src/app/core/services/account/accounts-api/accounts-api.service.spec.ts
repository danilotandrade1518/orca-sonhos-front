import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AccountDto,
  AccountType,
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

  const mockAccounts: AccountDto[] = [
    {
      id: 'account-1',
      name: 'Conta Corrente',
      type: AccountType.CHECKING_ACCOUNT,
      balance: 500000,
      budgetId: 'budget-1',
    },
    {
      id: 'account-2',
      name: 'Conta Poupança',
      type: AccountType.SAVINGS_ACCOUNT,
      balance: 1000000,
      budgetId: 'budget-1',
    },
  ];

  const mockListResponse: ListAccountsResponseDto = {
    data: mockAccounts,
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

  describe('Initial State', () => {
    it('should initialize with loading false', () => {
      expect(service.loading()).toBe(false);
    });

    it('should initialize with error null', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('listAccounts', () => {
    it('should load accounts successfully', (done) => {
      apiService.getRaw.mockReturnValue(of(mockListResponse));

      service.listAccounts('budget-1').subscribe({
        next: (accounts) => {
          expect(accounts).toEqual(mockAccounts);
          expect(apiService.getRaw).toHaveBeenCalledWith('/accounts', { budgetId: 'budget-1' });
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeNull();
          done();
        },
      });
    });

    it('should set loading to true during request', (done) => {
      apiService.getRaw.mockReturnValue(of(mockListResponse));

      service.listAccounts('budget-1').subscribe({
        next: () => {
          done();
        },
      });

      expect(service.loading()).toBe(true);
    });

    it('should return empty array when user is not authenticated', (done) => {
      authService.user = vi.fn(() => null);

      service.listAccounts('budget-1').subscribe({
        next: (accounts) => {
          expect(accounts).toEqual([]);
          expect(service.error()?.code).toBe('UNAUTHORIZED');
          done();
        },
      });
    });

    it('should return empty array when budgetId is not provided', (done) => {
      service.listAccounts('').subscribe({
        next: (accounts) => {
          expect(accounts).toEqual([]);
          expect(service.error()?.code).toBe('BAD_REQUEST');
          done();
        },
      });
    });

    it('should handle API errors', (done) => {
      const apiError: ApiError = {
        message: 'Failed to load accounts',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.getRaw.mockReturnValue(throwError(() => apiError));

      service.listAccounts('budget-1').subscribe({
        next: (accounts) => {
          expect(accounts).toEqual([]);
          expect(service.error()).toEqual(apiError);
          expect(service.loading()).toBe(false);
          done();
        },
      });
    });

    it('should handle 401 unauthorized error', (done) => {
      const apiError: ApiError = {
        message: 'Unauthorized',
        status: 401,
        code: 'UNAUTHORIZED',
      };

      apiService.getRaw.mockReturnValue(throwError(() => apiError));

      service.listAccounts('budget-1').subscribe({
        next: (accounts) => {
          expect(accounts).toEqual([]);
          expect(service.error()?.status).toBe(401);
          done();
        },
      });
    });

    it('should handle 400 bad request error', (done) => {
      const apiError: ApiError = {
        message: 'Bad request',
        status: 400,
        code: 'BAD_REQUEST',
      };

      apiService.getRaw.mockReturnValue(throwError(() => apiError));

      service.listAccounts('budget-1').subscribe({
        next: (accounts) => {
          expect(accounts).toEqual([]);
          expect(service.error()?.status).toBe(400);
          done();
        },
      });
    });
  });

  describe('createAccount', () => {
    const createDto: CreateAccountRequestDto = {
      name: 'Nova Conta',
      type: AccountType.CHECKING_ACCOUNT,
      initialBalance: 0,
      budgetId: 'budget-1',
    };

    const createResponse: CreateAccountResponseDto = {
      id: 'account-new',
      success: true,
    };

    it('should create account successfully', (done) => {
      apiService.postRaw.mockReturnValue(of(createResponse));

      service.createAccount(createDto).subscribe({
        next: (accountId) => {
          expect(accountId).toBe('account-new');
          expect(apiService.postRaw).toHaveBeenCalledWith('/accounts/create-account', createDto);
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeNull();
          done();
        },
      });
    });

    it('should return null when user is not authenticated', (done) => {
      authService.user = vi.fn(() => null);

      service.createAccount(createDto).subscribe({
        next: (accountId) => {
          expect(accountId).toBeNull();
          expect(service.error()?.code).toBe('UNAUTHORIZED');
          done();
        },
      });
    });

    it('should handle API errors', (done) => {
      const apiError: ApiError = {
        message: 'Failed to create account',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      service.createAccount(createDto).subscribe({
        next: (accountId) => {
          expect(accountId).toBeNull();
          expect(service.error()).toEqual(apiError);
          expect(service.loading()).toBe(false);
          done();
        },
      });
    });
  });

  describe('updateAccount', () => {
    const updateDto: UpdateAccountRequestDto = {
      id: 'account-1',
      name: 'Conta Atualizada',
      type: AccountType.SAVINGS_ACCOUNT,
      budgetId: 'budget-1',
    };

    const updateResponse: UpdateAccountResponseDto = {
      success: true,
    };

    it('should update account successfully', (done) => {
      apiService.postRaw.mockReturnValue(of(updateResponse));

      service.updateAccount(updateDto).subscribe({
        next: (success) => {
          expect(success).toBe(true);
          expect(apiService.postRaw).toHaveBeenCalledWith('/accounts/update-account', updateDto);
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeNull();
          done();
        },
      });
    });

    it('should return false when user is not authenticated', (done) => {
      authService.user = vi.fn(() => null);

      service.updateAccount(updateDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()?.code).toBe('UNAUTHORIZED');
          done();
        },
      });
    });

    it('should handle API errors', (done) => {
      const apiError: ApiError = {
        message: 'Failed to update account',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      service.updateAccount(updateDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()).toEqual(apiError);
          expect(service.loading()).toBe(false);
          done();
        },
      });
    });
  });

  describe('deleteAccount', () => {
    const deleteDto: DeleteAccountRequestDto = {
      id: 'account-1',
      budgetId: 'budget-1',
    };

    const deleteResponse: DeleteAccountResponseDto = {
      success: true,
    };

    it('should delete account successfully', (done) => {
      apiService.postRaw.mockReturnValue(of(deleteResponse));

      service.deleteAccount(deleteDto).subscribe({
        next: (success) => {
          expect(success).toBe(true);
          expect(apiService.postRaw).toHaveBeenCalledWith('/accounts/delete-account', deleteDto);
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeNull();
          done();
        },
      });
    });

    it('should return false when user is not authenticated', (done) => {
      authService.user = vi.fn(() => null);

      service.deleteAccount(deleteDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()?.code).toBe('UNAUTHORIZED');
          done();
        },
      });
    });

    it('should handle API errors', (done) => {
      const apiError: ApiError = {
        message: 'Failed to delete account',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      service.deleteAccount(deleteDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()).toEqual(apiError);
          expect(service.loading()).toBe(false);
          done();
        },
      });
    });

    it('should handle 400 error when account has transactions', (done) => {
      const apiError: ApiError = {
        message: 'Account has transactions and cannot be deleted',
        status: 400,
        code: 'BAD_REQUEST',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      service.deleteAccount(deleteDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()?.status).toBe(400);
          done();
        },
      });
    });
  });

  describe('transferBetweenAccounts', () => {
    const transferDto: TransferBetweenAccountsRequestDto = {
      fromAccountId: 'account-1',
      toAccountId: 'account-2',
      amountInCents: 100000,
      budgetId: 'budget-1',
    };

    const transferResponse: TransferBetweenAccountsResponseDto = {
      success: true,
    };

    it('should transfer between accounts successfully', (done) => {
      apiService.postRaw.mockReturnValue(of(transferResponse));

      service.transferBetweenAccounts(transferDto).subscribe({
        next: (success) => {
          expect(success).toBe(true);
          expect(apiService.postRaw).toHaveBeenCalledWith(
            '/accounts/transfer-between-accounts',
            transferDto
          );
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeNull();
          done();
        },
      });
    });

    it('should return false when user is not authenticated', (done) => {
      authService.user = vi.fn(() => null);

      service.transferBetweenAccounts(transferDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()?.code).toBe('UNAUTHORIZED');
          done();
        },
      });
    });

    it('should handle API errors', (done) => {
      const apiError: ApiError = {
        message: 'Failed to transfer between accounts',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      service.transferBetweenAccounts(transferDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()).toEqual(apiError);
          expect(service.loading()).toBe(false);
          done();
        },
      });
    });

    it('should handle 400 error when insufficient balance', (done) => {
      const apiError: ApiError = {
        message: 'Insufficient balance',
        status: 400,
        code: 'BAD_REQUEST',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      service.transferBetweenAccounts(transferDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()?.status).toBe(400);
          done();
        },
      });
    });
  });

  describe('reconcileAccount', () => {
    const reconcileDto: ReconcileAccountRequestDto = {
      accountId: 'account-1',
      finalBalanceInCents: 550000,
      budgetId: 'budget-1',
    };

    const reconcileResponse: ReconcileAccountResponseDto = {
      success: true,
    };

    it('should reconcile account successfully', (done) => {
      apiService.postRaw.mockReturnValue(of(reconcileResponse));

      service.reconcileAccount(reconcileDto).subscribe({
        next: (success) => {
          expect(success).toBe(true);
          expect(apiService.postRaw).toHaveBeenCalledWith('/accounts/reconcile-account', reconcileDto);
          expect(service.loading()).toBe(false);
          expect(service.error()).toBeNull();
          done();
        },
      });
    });

    it('should return false when user is not authenticated', (done) => {
      authService.user = vi.fn(() => null);

      service.reconcileAccount(reconcileDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()?.code).toBe('UNAUTHORIZED');
          done();
        },
      });
    });

    it('should handle API errors', (done) => {
      const apiError: ApiError = {
        message: 'Failed to reconcile account',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      service.reconcileAccount(reconcileDto).subscribe({
        next: (success) => {
          expect(success).toBe(false);
          expect(service.error()).toEqual(apiError);
          expect(service.loading()).toBe(false);
          done();
        },
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

