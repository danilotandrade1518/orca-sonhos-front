import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRouteSnapshot, provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { AccountsPage } from './accounts.page';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AccountDto } from '../../../../../dtos/account/account-types';
import { EXTERNAL_AUTH_SERVICE_ADAPTER } from '@core/adapters/external-auth-service.adapter';
import { MockExternalAuthServiceAdapter } from '@core/services/auth/__mocks__/external-auth-service.adapter.mock';

describe('AccountsPage', () => {
  let component: AccountsPage;
  let fixture: ComponentFixture<AccountsPage>;
  let accountState: {
    accounts: ReturnType<typeof signal<AccountDto[]>>;
    accountsByBudgetId: ReturnType<typeof signal<AccountDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadAccounts: ReturnType<typeof vi.fn>;
    clearError: ReturnType<typeof vi.fn>;
  };
  let budgetSelection: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
  };
  let router: Router;

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
    accountState = {
      accounts: signal(mockAccounts),
      accountsByBudgetId: signal(mockAccounts),
      loading: signal(false),
      error: signal(null),
      loadAccounts: vi.fn(),
      clearError: vi.fn(),
    };

    budgetSelection = {
      selectedBudgetId: signal('budget-1'),
    };

    router = {
      navigate: vi.fn(),
    } as unknown as Router;

    TestBed.configureTestingModule({
      imports: [AccountsPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: AccountState,
          useValue: accountState,
        },
        {
          provide: BudgetSelectionService,
          useValue: budgetSelection,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
              paramMap: new Map(),
            },
          },
        },
        {
          provide: EXTERNAL_AUTH_SERVICE_ADAPTER,
          useValue: new MockExternalAuthServiceAdapter(),
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should load accounts on init when budget is selected', () => {
    component.ngOnInit();
    expect(accountState.loadAccounts).toHaveBeenCalled();
  });

  it('should not load accounts on init when budget is not selected', () => {
    budgetSelection.selectedBudgetId.set(null);
    fixture = TestBed.createComponent(AccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    accountState.loadAccounts.mockClear();
    component.ngOnInit();

    expect(accountState.loadAccounts).not.toHaveBeenCalled();
  });

  describe('currentState', () => {
    it('should return loading when loading', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      expect(component.currentState()).toBe('loading');
    });

    it('should return error when error exists', () => {
      accountState.error.set('Error message');
      fixture.detectChanges();
      expect(component.currentState()).toBe('error');
    });

    it('should return empty when no budget selected', () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();
      expect(component.currentState()).toBe('empty');
    });

    it('should return empty when no accounts', () => {
      accountState.accountsByBudgetId.set([]);
      accountState.loading.set(false);
      accountState.error.set(null);
      fixture.detectChanges();
      expect(component.currentState()).toBe('empty');
    });

    it('should return success when accounts exist', () => {
      accountState.accountsByBudgetId.set(mockAccounts);
      accountState.loading.set(false);
      accountState.error.set(null);
      fixture.detectChanges();
      expect(component.currentState()).toBe('success');
    });
  });

  describe('hasAccounts', () => {
    it('should return true when accounts exist', () => {
      accountState.accountsByBudgetId.set(mockAccounts);
      fixture.detectChanges();
      expect(component.hasAccounts()).toBe(true);
    });

    it('should return false when no accounts', () => {
      accountState.accountsByBudgetId.set([]);
      fixture.detectChanges();
      expect(component.hasAccounts()).toBe(false);
    });
  });

  describe('errorMessage', () => {
    it('should return error message from state', () => {
      accountState.error.set('Custom error message');
      fixture.detectChanges();
      expect(component.errorMessage()).toBe('Custom error message');
    });

    it('should return default error message when state error is null', () => {
      accountState.error.set(null);
      fixture.detectChanges();
      expect(component.errorMessage()).toBe('Erro ao carregar contas');
    });
  });

  describe('retry', () => {
    it('should clear error and reload accounts', () => {
      component.retry();
      expect(accountState.clearError).toHaveBeenCalled();
      expect(accountState.loadAccounts).toHaveBeenCalled();
    });
  });

  describe('Modal Management', () => {
    describe('openCreateModal', () => {
      it('should navigate to create route', () => {
        component.openCreateModal();
        expect(router.navigate).toHaveBeenCalledWith(['new'], {
          relativeTo: TestBed.inject(ActivatedRoute),
        });
      });
    });

    describe('openTransferModal', () => {
      it('should open transfer modal when budget and accounts exist', () => {
        accountState.accountsByBudgetId.set(mockAccounts);
        fixture.detectChanges();

        component.openTransferModal();

        expect(component.showTransferModal()).toBe(true);
      });

      it('should not open transfer modal when no budget selected', () => {
        budgetSelection.selectedBudgetId.set(null);
        fixture.detectChanges();

        component.openTransferModal();

        expect(component.showTransferModal()).toBe(false);
      });

      it('should not open transfer modal when no accounts', () => {
        accountState.accountsByBudgetId.set([]);
        fixture.detectChanges();

        component.openTransferModal();

        expect(component.showTransferModal()).toBe(false);
      });
    });

    describe('openReconcileModal', () => {
      it('should open reconcile modal with first account when budget and accounts exist', () => {
        accountState.accountsByBudgetId.set(mockAccounts);
        fixture.detectChanges();

        component.openReconcileModal();

        expect(component.showReconcileModal()).toBe(true);
        expect(component.reconcilingAccount()).toEqual(mockAccounts[0]);
      });

      it('should not open reconcile modal when no budget selected', () => {
        budgetSelection.selectedBudgetId.set(null);
        fixture.detectChanges();

        component.openReconcileModal();

        expect(component.showReconcileModal()).toBe(false);
      });

      it('should not open reconcile modal when no accounts', () => {
        accountState.accountsByBudgetId.set([]);
        fixture.detectChanges();

        component.openReconcileModal();

        expect(component.showReconcileModal()).toBe(false);
      });
    });

    describe('closeTransferModal', () => {
      it('should close transfer modal', () => {
        component.showTransferModal.set(true);
        fixture.detectChanges();

        component.closeTransferModal();

        expect(component.showTransferModal()).toBe(false);
      });
    });

    describe('closeReconcileModal', () => {
      it('should close reconcile modal and clear reconciling account', () => {
        component.showReconcileModal.set(true);
        component.reconcilingAccount.set(mockAccounts[0]);
        fixture.detectChanges();

        component.closeReconcileModal();

        expect(component.showReconcileModal()).toBe(false);
        expect(component.reconcilingAccount()).toBe(null);
      });
    });

    describe('closeDeleteModal', () => {
      it('should close delete modal and clear deleting account', () => {
        component.showDeleteModal.set(true);
        component.deletingAccount.set(mockAccounts[0]);
        fixture.detectChanges();

        component.closeDeleteModal();

        expect(component.showDeleteModal()).toBe(false);
        expect(component.deletingAccount()).toBe(null);
      });
    });
  });

  describe('Account Actions', () => {
    describe('onEditAccount', () => {
      it('should set editing account and navigate to edit route', () => {
        const account = mockAccounts[0];

        component.onEditAccount(account);

        expect(component.editingAccount()).toEqual(account);
        expect(router.navigate).toHaveBeenCalledWith([account.id, 'edit'], {
          relativeTo: TestBed.inject(ActivatedRoute),
        });
      });
    });

    describe('onDeleteAccount', () => {
      it('should set deleting account and open delete modal', () => {
        const account = mockAccounts[0];

        component.onDeleteAccount(account);

        expect(component.deletingAccount()).toEqual(account);
        expect(component.showDeleteModal()).toBe(true);
      });
    });
  });

  describe('Form Handlers', () => {
    describe('onFormSaved', () => {
      it('should clear editing account and navigate to accounts list', () => {
        component.editingAccount.set(mockAccounts[0]);
        fixture.detectChanges();

        component.onFormSaved();

        expect(component.editingAccount()).toBe(null);
        expect(router.navigate).toHaveBeenCalledWith(['/accounts'], { replaceUrl: true });
      });
    });

    describe('onFormCancelled', () => {
      it('should clear editing account and navigate to accounts list', () => {
        component.editingAccount.set(mockAccounts[0]);
        fixture.detectChanges();

        component.onFormCancelled();

        expect(component.editingAccount()).toBe(null);
        expect(router.navigate).toHaveBeenCalledWith(['/accounts'], { replaceUrl: true });
      });
    });
  });

  describe('Budget Effect', () => {
    it('should reload accounts when budget changes', () => {
      accountState.loadAccounts.mockClear();

      budgetSelection.selectedBudgetId.set('budget-2');
      fixture.detectChanges();

      setTimeout(() => {
        expect(accountState.loadAccounts).toHaveBeenCalled();
      }, 100);
    });

    it('should not reload accounts when budget is the same', () => {
      accountState.loadAccounts.mockClear();

      budgetSelection.selectedBudgetId.set('budget-1');
      fixture.detectChanges();

      expect(accountState.loadAccounts).not.toHaveBeenCalled();
    });

    it('should not reload accounts when loading', () => {
      accountState.loading.set(true);
      accountState.loadAccounts.mockClear();

      budgetSelection.selectedBudgetId.set('budget-2');
      fixture.detectChanges();

      expect(accountState.loadAccounts).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit - Edit Mode', () => {
    it('should set editing account when route has account id and edit mode', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot = {
        data: { modalMode: 'edit' },
        paramMap: new Map([['id', 'account-1']]),
      } as unknown as ActivatedRouteSnapshot;

      fixture = TestBed.createComponent(AccountsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.editingAccount()).toEqual(mockAccounts[0]);
    });

    it('should not set editing account when account not found', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot = {
        data: { modalMode: 'edit' },
        paramMap: new Map([['id', 'non-existent']]),
      } as unknown as ActivatedRouteSnapshot;

      fixture = TestBed.createComponent(AccountsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.editingAccount()).toBe(null);
    });
  });
});
