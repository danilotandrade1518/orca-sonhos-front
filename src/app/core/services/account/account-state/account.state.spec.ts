import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  AccountDto,
  CreateAccountRequestDto,
  DeleteAccountRequestDto,
  ReconcileAccountRequestDto,
  TransferBetweenAccountsRequestDto,
  UpdateAccountRequestDto,
} from '../../../../../dtos/account';
import { BudgetSelectionService } from '../../budget-selection/budget-selection.service';
import { AccountsApiService } from '../accounts-api/accounts-api.service';
import { AccountState } from './account.state';

describe('AccountState', () => {
  let accountState: AccountState;
  let accountsApi: {
    listAccounts: ReturnType<typeof vi.fn>;
    createAccount: ReturnType<typeof vi.fn>;
    updateAccount: ReturnType<typeof vi.fn>;
    deleteAccount: ReturnType<typeof vi.fn>;
    transferBetweenAccounts: ReturnType<typeof vi.fn>;
    reconcileAccount: ReturnType<typeof vi.fn>;
  };
  let budgetSelectionService: {
    selectedBudgetId: ReturnType<typeof vi.fn>;
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
    accountsApi = {
      listAccounts: vi.fn(),
      createAccount: vi.fn(),
      updateAccount: vi.fn(),
      deleteAccount: vi.fn(),
      transferBetweenAccounts: vi.fn(),
      reconcileAccount: vi.fn(),
    };

    budgetSelectionService = {
      selectedBudgetId: vi.fn(() => 'budget-1'),
    };

    TestBed.configureTestingModule({
      providers: [
        AccountState,
        { provide: AccountsApiService, useValue: accountsApi },
        { provide: BudgetSelectionService, useValue: budgetSelectionService },
        provideZonelessChangeDetection(),
      ],
    });

    accountState = TestBed.inject(AccountState);
  });

  it('should be created', () => {
    expect(accountState).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty accounts', () => {
      expect(accountState.accounts()).toEqual([]);
      expect(accountState.loading()).toBeFalsy();
      expect(accountState.error()).toBeNull();
    });

    it('should compute hasAccounts as false initially', () => {
      expect(accountState.hasAccounts()).toBeFalsy();
    });

    it('should compute accountsCount as 0 initially', () => {
      expect(accountState.accountsCount()).toBe(0);
    });
  });

  describe('loadAccounts', () => {
    it('should load accounts successfully', async () => {
      accountsApi.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.loadAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.accounts()).toEqual(mockAccounts);
      expect(accountState.loading()).toBeFalsy();
      expect(accountState.error()).toBeNull();
    });

    it('should set error when no budget is selected', () => {
      budgetSelectionService.selectedBudgetId.mockReturnValue(null);

      accountState.loadAccounts();

      expect(accountState.error()).toBe('Nenhum orçamento selecionado');
      expect(accountsApi.listAccounts).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      accountsApi.listAccounts.mockReturnValue(
        throwError(() => ({ message: 'Failed to load accounts' }))
      );

      accountState.loadAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Failed to load accounts');
      expect(accountState.loading()).toBeFalsy();
    });

    it('should not load if already loading', () => {
      accountsApi.listAccounts.mockReturnValue(of(mockAccounts).pipe(delay(100)));

      accountState.loadAccounts();
      accountState.loadAccounts();

      expect(accountsApi.listAccounts).toHaveBeenCalledTimes(1);
    });
  });

  describe('createAccount', () => {
    it('should create account and reload list', async () => {
      const dto: CreateAccountRequestDto = {
        userId: 'user-123',
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        budgetId: 'budget-1',
      };

      accountsApi.createAccount.mockReturnValue(of('account-new'));
      accountsApi.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.createAccount(dto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountsApi.createAccount).toHaveBeenCalledWith(dto);
      expect(accountsApi.listAccounts).toHaveBeenCalled();
    });

    it('should set error when creation fails', async () => {
      const dto: CreateAccountRequestDto = {
        userId: 'user-123',
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        budgetId: 'budget-1',
      };

      accountsApi.createAccount.mockReturnValue(of(null));

      accountState.createAccount(dto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Falha ao criar conta');
    });
  });

  describe('updateAccount', () => {
    it('should update account and reload list', async () => {
      const dto: UpdateAccountRequestDto = {
        id: 'account-1',
        userId: 'user-123',
        name: 'Conta Atualizada',
      };

      accountsApi.updateAccount.mockReturnValue(of(true));
      accountsApi.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.updateAccount(dto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountsApi.updateAccount).toHaveBeenCalledWith(dto);
      expect(accountsApi.listAccounts).toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('should delete account and reload list', async () => {
      const dto: DeleteAccountRequestDto = {
        userId: 'user-123',
        accountId: 'account-1',
      };

      accountsApi.deleteAccount.mockReturnValue(of(true));
      accountsApi.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.deleteAccount(dto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountsApi.deleteAccount).toHaveBeenCalledWith(dto);
      expect(accountsApi.listAccounts).toHaveBeenCalled();
    });

    it('should set error message when deletion fails', async () => {
      const dto: DeleteAccountRequestDto = {
        userId: 'user-123',
        accountId: 'account-1',
      };

      accountsApi.deleteAccount.mockReturnValue(of(false));

      accountState.deleteAccount(dto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toContain('Falha ao excluir conta');
    });
  });

  describe('transferBetweenAccounts', () => {
    it('should transfer and reload list', async () => {
      const dto: TransferBetweenAccountsRequestDto = {
        userId: 'user-123',
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 500,
      };

      accountsApi.transferBetweenAccounts.mockReturnValue(of(true));
      accountsApi.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.transferBetweenAccounts(dto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountsApi.transferBetweenAccounts).toHaveBeenCalledWith(dto);
      expect(accountsApi.listAccounts).toHaveBeenCalled();
    });
  });

  describe('reconcileAccount', () => {
    it('should reconcile and reload list', async () => {
      const dto: ReconcileAccountRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-1',
        accountId: 'account-1',
        realBalance: 3500,
      };

      accountsApi.reconcileAccount.mockReturnValue(of(true));
      accountsApi.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.reconcileAccount(dto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountsApi.reconcileAccount).toHaveBeenCalledWith(dto);
      expect(accountsApi.listAccounts).toHaveBeenCalled();
    });
  });

  describe('accountsByBudgetId', () => {
    it('should return accounts when budget is selected', () => {
      accountsApi.listAccounts.mockReturnValue(of(mockAccounts));
      accountState.loadAccounts();

      const accounts = accountState.accountsByBudgetId();
      expect(accounts).toEqual(mockAccounts);
    });

    it('should return empty array when no budget is selected', () => {
      budgetSelectionService.selectedBudgetId.mockReturnValue(null);

      const accounts = accountState.accountsByBudgetId();
      expect(accounts).toEqual([]);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      accountState.clearError();
      expect(accountState.error()).toBeNull();
    });
  });

  describe('refreshAccounts', () => {
    it('should reload accounts', async () => {
      accountsApi.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.refreshAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountsApi.listAccounts).toHaveBeenCalled();
    });
  });
});
