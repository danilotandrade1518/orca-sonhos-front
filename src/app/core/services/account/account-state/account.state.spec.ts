import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AccountDto, AccountType } from '../../../../../dtos/account';
import { BudgetSelectionService } from '../../budget-selection/budget-selection.service';
import { AccountsApiService } from '../accounts-api/accounts-api.service';
import { AccountState } from './account.state';

describe('AccountState', () => {
  let accountState: AccountState;
  let accountsApiService: {
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

  beforeEach(() => {
    accountsApiService = {
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
        { provide: AccountsApiService, useValue: accountsApiService },
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

    it('should compute accountsByBudgetId as empty when no budget selected', () => {
      budgetSelectionService.selectedBudgetId = vi.fn(() => null);
      expect(accountState.accountsByBudgetId()).toEqual([]);
    });
  });

  describe('loadAccounts', () => {
    it('should load accounts successfully', async () => {
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.loadAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.accounts()).toEqual(mockAccounts);
      expect(accountState.loading()).toBeFalsy();
      expect(accountState.error()).toBeNull();
    });

    it('should set loading to true during load', async () => {
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts).pipe(delay(100)));

      accountState.loadAccounts();

      expect(accountState.loading()).toBeTruthy();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(accountState.loading()).toBeFalsy();
    });

    it('should set error when no budget is selected', () => {
      budgetSelectionService.selectedBudgetId = vi.fn(() => null);

      accountState.loadAccounts();

      expect(accountState.error()).toBe('Nenhum orçamento selecionado');
      expect(accountsApiService.listAccounts).not.toHaveBeenCalled();
    });

    it('should not load if already loading', () => {
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts).pipe(delay(100)));

      accountState.loadAccounts();
      accountState.loadAccounts();

      expect(accountsApiService.listAccounts).toHaveBeenCalledTimes(1);
    });

    it('should handle load errors', async () => {
      const error = { message: 'Failed to load accounts' };
      accountsApiService.listAccounts.mockReturnValue(throwError(() => error));

      accountState.loadAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Failed to load accounts');
      expect(accountState.loading()).toBeFalsy();
    });

    it('should filter accounts by selected budget', async () => {
      const accountsWithDifferentBudgets: AccountDto[] = [
        ...mockAccounts,
        {
          id: 'account-3',
          name: 'Outra Conta',
          type: 'CHECKING_ACCOUNT',
          balance: 2000.0,
        },
      ];

      accountsApiService.listAccounts.mockReturnValue(of(accountsWithDifferentBudgets));
      budgetSelectionService.selectedBudgetId = vi.fn(() => 'budget-1');

      accountState.loadAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.accountsByBudgetId().length).toBe(3);
      expect(accountState.accountsByBudgetId()[0].id).toBe('account-1');
      expect(accountState.accountsByBudgetId()[1].id).toBe('account-2');
      expect(accountState.accountsByBudgetId()[2].id).toBe('account-3');
    });
  });

  describe('createAccount', () => {
    const createDto = {
      userId: 'user-123',
      name: 'Nova Conta',
      type: 'CHECKING_ACCOUNT' as AccountType,
      initialBalance: 0,
      budgetId: 'budget-1',
    };

    it('should create account and reload list', async () => {
      accountsApiService.createAccount.mockReturnValue(of('account-new'));
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.createAccount(createDto);

      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(accountsApiService.createAccount).toHaveBeenCalledWith(createDto);
      expect(accountsApiService.listAccounts).toHaveBeenCalledWith('budget-1');
    });

    it('should set error when creation fails', async () => {
      accountsApiService.createAccount.mockReturnValue(of(null));

      accountState.createAccount(createDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Falha ao criar conta');
      expect(accountState.loading()).toBeFalsy();
    });

    it('should handle creation errors', async () => {
      const error = { message: 'Failed to create account' };
      accountsApiService.createAccount.mockReturnValue(throwError(() => error));

      accountState.createAccount(createDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Failed to create account');
      expect(accountState.loading()).toBeFalsy();
    });
  });

  describe('updateAccount', () => {
    const updateDto = {
      id: 'account-1',
      userId: 'user-123',
      name: 'Conta Atualizada',
      type: 'SAVINGS_ACCOUNT' as AccountType,
    };

    it('should update account and reload list', async () => {
      accountsApiService.updateAccount.mockReturnValue(of(true));
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.updateAccount(updateDto);

      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(accountsApiService.updateAccount).toHaveBeenCalledWith(updateDto);
      expect(accountsApiService.listAccounts).toHaveBeenCalledWith('budget-1');
    });

    it('should set error when update fails', async () => {
      accountsApiService.updateAccount.mockReturnValue(of(false));

      accountState.updateAccount(updateDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Falha ao atualizar conta');
      expect(accountState.loading()).toBeFalsy();
    });

    it('should handle update errors', async () => {
      const error = { message: 'Failed to update account' };
      accountsApiService.updateAccount.mockReturnValue(throwError(() => error));

      accountState.updateAccount(updateDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Failed to update account');
      expect(accountState.loading()).toBeFalsy();
    });
  });

  describe('deleteAccount', () => {
    const deleteDto = {
      userId: 'user-123',
      accountId: 'account-1',
    };

    it('should delete account and reload list', async () => {
      accountsApiService.deleteAccount.mockReturnValue(of(true));
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.deleteAccount(deleteDto);

      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(accountsApiService.deleteAccount).toHaveBeenCalledWith(deleteDto);
      expect(accountsApiService.listAccounts).toHaveBeenCalledWith('budget-1');
    });

    it('should set error when deletion fails', async () => {
      accountsApiService.deleteAccount.mockReturnValue(of(false));

      accountState.deleteAccount(deleteDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toContain('Falha ao excluir conta');
      expect(accountState.loading()).toBeFalsy();
    });

    it('should handle deletion errors with transaction block message', async () => {
      const error = {
        message: 'Account has transactions and cannot be deleted',
      };
      accountsApiService.deleteAccount.mockReturnValue(throwError(() => error));

      accountState.deleteAccount(deleteDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      const errorMessage = accountState.error();
      expect(errorMessage).toBeTruthy();
      expect(
        errorMessage?.includes('transações vinculadas') ||
          errorMessage?.includes('transactions')
      ).toBeTruthy();
      expect(accountState.loading()).toBeFalsy();
    });
  });

  describe('transferBetweenAccounts', () => {
    const transferDto = {
      userId: 'user-123',
      fromAccountId: 'account-1',
      toAccountId: 'account-2',
      amount: 1000.0,
    };

    it('should transfer and reload list', async () => {
      accountsApiService.transferBetweenAccounts.mockReturnValue(of(true));
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.transferBetweenAccounts(transferDto);

      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(accountsApiService.transferBetweenAccounts).toHaveBeenCalledWith(transferDto);
      expect(accountsApiService.listAccounts).toHaveBeenCalledWith('budget-1');
    });

    it('should set error when transfer fails', async () => {
      accountsApiService.transferBetweenAccounts.mockReturnValue(of(false));

      accountState.transferBetweenAccounts(transferDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Falha ao transferir entre contas');
      expect(accountState.loading()).toBeFalsy();
    });

    it('should handle transfer errors', async () => {
      const error = { message: 'Insufficient balance' };
      accountsApiService.transferBetweenAccounts.mockReturnValue(throwError(() => error));

      accountState.transferBetweenAccounts(transferDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Insufficient balance');
      expect(accountState.loading()).toBeFalsy();
    });
  });

  describe('reconcileAccount', () => {
    const reconcileDto = {
      userId: 'user-123',
      budgetId: 'budget-1',
      accountId: 'account-1',
      realBalance: 5500.0,
    };

    it('should reconcile and reload list', async () => {
      accountsApiService.reconcileAccount.mockReturnValue(of(true));
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.reconcileAccount(reconcileDto);

      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(accountsApiService.reconcileAccount).toHaveBeenCalledWith(reconcileDto);
      expect(accountsApiService.listAccounts).toHaveBeenCalledWith('budget-1');
    });

    it('should set error when reconciliation fails', async () => {
      accountsApiService.reconcileAccount.mockReturnValue(of(false));

      accountState.reconcileAccount(reconcileDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Falha ao reconciliar conta');
      expect(accountState.loading()).toBeFalsy();
    });

    it('should handle reconciliation errors', async () => {
      const error = { message: 'Failed to reconcile' };
      accountsApiService.reconcileAccount.mockReturnValue(throwError(() => error));

      accountState.reconcileAccount(reconcileDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBe('Failed to reconcile');
      expect(accountState.loading()).toBeFalsy();
    });
  });

  describe('computed signals', () => {
    it('should compute hasAccounts correctly', async () => {
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.loadAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.hasAccounts()).toBeTruthy();
    });

    it('should compute accountsCount correctly', async () => {
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.loadAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.accountsCount()).toBe(2);
    });

    it('should compute accountsByBudgetId correctly', async () => {
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));
      budgetSelectionService.selectedBudgetId = vi.fn(() => 'budget-1');

      accountState.loadAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.accountsByBudgetId().length).toBe(2);
    });

    it('should return empty array when no budget selected', () => {
      budgetSelectionService.selectedBudgetId = vi.fn(() => null);
      expect(accountState.accountsByBudgetId()).toEqual([]);
    });
  });

  describe('clearError', () => {
    it('should clear error', async () => {
      const error = { message: 'Test error' };
      accountsApiService.listAccounts.mockReturnValue(throwError(() => error));

      accountState.loadAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountState.error()).toBeTruthy();

      accountState.clearError();
      expect(accountState.error()).toBeNull();
    });
  });

  describe('refreshAccounts', () => {
    it('should reload accounts', async () => {
      accountsApiService.listAccounts.mockReturnValue(of(mockAccounts));

      accountState.refreshAccounts();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(accountsApiService.listAccounts).toHaveBeenCalled();
      expect(accountState.accounts()).toEqual(mockAccounts);
    });
  });
});
