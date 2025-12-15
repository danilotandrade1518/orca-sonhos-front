import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay, firstValueFrom, of, throwError } from 'rxjs';
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
      type: 'CHECKING_ACCOUNT',
      balance: 5000.0,
    },
    {
      id: 'account-2',
      name: 'Conta Poupança',
      type: 'SAVINGS_ACCOUNT',
      balance: 10000.0,
    },
  ];

  const mockListResponse: ListAccountsResponseDto = {
    data: mockAccounts,
    meta: {
      count: mockAccounts.length,
    },
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
    it('should load accounts successfully', async () => {
      apiService.getRaw.mockReturnValue(of(mockListResponse));

      const accounts = await firstValueFrom(service.listAccounts('budget-1'));

      expect(accounts).toEqual(mockAccounts);
      expect(apiService.getRaw).toHaveBeenCalledWith('/account', { budgetId: 'budget-1' });
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should set loading to true during request', async () => {
      let loadingCheck = false;
      apiService.getRaw.mockImplementation(() => {
        loadingCheck = service.loading();
        return of(mockListResponse).pipe(delay(10));
      });

      const promise = firstValueFrom(service.listAccounts('budget-1'));

      expect(service.loading()).toBe(true);
      expect(loadingCheck).toBe(true);

      await promise;
      expect(service.loading()).toBe(false);
    });

    it('should return empty array when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const accounts = await firstValueFrom(service.listAccounts('budget-1'));

      expect(accounts).toEqual([]);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should return empty array when budgetId is not provided', async () => {
      const accounts = await firstValueFrom(service.listAccounts(''));

      expect(accounts).toEqual([]);
      expect(service.error()?.code).toBe('BAD_REQUEST');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to load accounts',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.getRaw.mockReturnValue(throwError(() => apiError));

      const accounts = await firstValueFrom(service.listAccounts('budget-1'));

      expect(accounts).toEqual([]);
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });

    it('should handle 401 unauthorized error', async () => {
      const apiError: ApiError = {
        message: 'Unauthorized',
        status: 401,
        code: 'UNAUTHORIZED',
      };

      apiService.getRaw.mockReturnValue(throwError(() => apiError));

      const accounts = await firstValueFrom(service.listAccounts('budget-1'));

      expect(accounts).toEqual([]);
      expect(service.error()?.status).toBe(401);
    });

    it('should handle 400 bad request error', async () => {
      const apiError: ApiError = {
        message: 'Bad request',
        status: 400,
        code: 'BAD_REQUEST',
      };

      apiService.getRaw.mockReturnValue(throwError(() => apiError));

      const accounts = await firstValueFrom(service.listAccounts('budget-1'));

      expect(accounts).toEqual([]);
      expect(service.error()?.status).toBe(400);
    });
  });

  describe('createAccount', () => {
    const createDto: CreateAccountRequestDto = {
      userId: 'user-123',
      name: 'Nova Conta',
      type: 'CHECKING_ACCOUNT',
      initialBalance: 0,
      budgetId: 'budget-1',
    };

    const createResponse: CreateAccountResponseDto = {
      id: 'account-new',
    };

    it('should create account successfully', async () => {
      apiService.postRaw.mockReturnValue(of(createResponse));

      const accountId = await firstValueFrom(service.createAccount(createDto));

      expect(accountId).toBe('account-new');
      expect(apiService.postRaw).toHaveBeenCalledWith('/account/create-account', createDto);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should return null when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const accountId = await firstValueFrom(service.createAccount(createDto));

      expect(accountId).toBeNull();
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to create account',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const accountId = await firstValueFrom(service.createAccount(createDto));

      expect(accountId).toBeNull();
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });
  });

  describe('updateAccount', () => {
    const updateDto: UpdateAccountRequestDto = {
      id: 'account-1',
      userId: 'user-123',
      name: 'Conta Atualizada',
      type: 'SAVINGS_ACCOUNT',
    };

    const updateResponse: UpdateAccountResponseDto = {
      success: true,
    };

    it('should update account successfully', async () => {
      apiService.postRaw.mockReturnValue(of(updateResponse));

      const success = await firstValueFrom(service.updateAccount(updateDto));

      expect(success).toBe(true);
      expect(apiService.postRaw).toHaveBeenCalledWith('/account/update-account', updateDto);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should return false when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const success = await firstValueFrom(service.updateAccount(updateDto));

      expect(success).toBe(false);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to update account',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const success = await firstValueFrom(service.updateAccount(updateDto));

      expect(success).toBe(false);
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });
  });

  describe('deleteAccount', () => {
    const deleteDto: DeleteAccountRequestDto = {
      userId: 'user-123',
      accountId: 'account-1',
    };

    const deleteResponse: DeleteAccountResponseDto = {
      success: true,
    };

    it('should delete account successfully', async () => {
      apiService.postRaw.mockReturnValue(of(deleteResponse));

      const success = await firstValueFrom(service.deleteAccount(deleteDto));

      expect(success).toBe(true);
      expect(apiService.postRaw).toHaveBeenCalledWith('/account/delete-account', deleteDto);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should return false when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const success = await firstValueFrom(service.deleteAccount(deleteDto));

      expect(success).toBe(false);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to delete account',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const success = await firstValueFrom(service.deleteAccount(deleteDto));

      expect(success).toBe(false);
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });

    it('should handle 400 error when account has transactions', async () => {
      const apiError: ApiError = {
        message: 'Account has transactions and cannot be deleted',
        status: 400,
        code: 'BAD_REQUEST',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const success = await firstValueFrom(service.deleteAccount(deleteDto));

      expect(success).toBe(false);
      expect(service.error()?.status).toBe(400);
    });
  });

  describe('transferBetweenAccounts', () => {
    const transferDto: TransferBetweenAccountsRequestDto = {
      userId: 'user-123',
      fromAccountId: 'account-1',
      toAccountId: 'account-2',
      amount: 1000.0,
    };

    const transferResponse: TransferBetweenAccountsResponseDto = {
      success: true,
    };

    it('should transfer between accounts successfully', async () => {
      apiService.postRaw.mockReturnValue(of(transferResponse));

      const success = await firstValueFrom(service.transferBetweenAccounts(transferDto));

      expect(success).toBe(true);
      expect(apiService.postRaw).toHaveBeenCalledWith(
        '/account/transfer-between-accounts',
        transferDto
      );
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should return false when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const success = await firstValueFrom(service.transferBetweenAccounts(transferDto));

      expect(success).toBe(false);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to transfer between accounts',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const success = await firstValueFrom(service.transferBetweenAccounts(transferDto));

      expect(success).toBe(false);
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });

    it('should handle 400 error when insufficient balance', async () => {
      const apiError: ApiError = {
        message: 'Insufficient balance',
        status: 400,
        code: 'BAD_REQUEST',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const success = await firstValueFrom(service.transferBetweenAccounts(transferDto));

      expect(success).toBe(false);
      expect(service.error()?.status).toBe(400);
    });
  });

  describe('reconcileAccount', () => {
    const reconcileDto: ReconcileAccountRequestDto = {
      userId: 'user-123',
      budgetId: 'budget-1',
      accountId: 'account-1',
      realBalance: 5500.0,
    };

    const reconcileResponse: ReconcileAccountResponseDto = {
      success: true,
    };

    it('should reconcile account successfully', async () => {
      apiService.postRaw.mockReturnValue(of(reconcileResponse));

      const success = await firstValueFrom(service.reconcileAccount(reconcileDto));

      expect(success).toBe(true);
      expect(apiService.postRaw).toHaveBeenCalledWith('/account/reconcile-account', reconcileDto);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should return false when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const success = await firstValueFrom(service.reconcileAccount(reconcileDto));

      expect(success).toBe(false);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to reconcile account',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const success = await firstValueFrom(service.reconcileAccount(reconcileDto));

      expect(success).toBe(false);
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      service.clearError();
      expect(service.error()).toBeNull();
    });
  });
});
