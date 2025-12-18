import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { AccountsEditPage } from './accounts-edit.page';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AccountDto } from '../../../../../dtos/account/account-types';

describe('AccountsEditPage', () => {
  let component: AccountsEditPage;
  let fixture: ComponentFixture<AccountsEditPage>;
  let accountState: {
    accounts: ReturnType<typeof signal<AccountDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    updateAccount: ReturnType<typeof vi.fn>;
    loadAccounts: ReturnType<typeof vi.fn>;
  };
  let budgetSelection: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
  };
  let authService: {
    currentUser: ReturnType<typeof signal<{ id: string; email: string; name: string } | null>>;
  };
  let router: Router;
  let notificationService: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let activatedRoute: ActivatedRoute;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockAccount: AccountDto = {
    id: 'account-1',
    name: 'Test Account',
    type: 'CHECKING_ACCOUNT',
    balance: 10000,
    budgetId: 'budget-1',
  };

  beforeEach(() => {
    accountState = {
      accounts: signal([mockAccount]),
      loading: signal(false),
      updateAccount: vi.fn(),
      loadAccounts: vi.fn(),
    };

    budgetSelection = {
      selectedBudgetId: signal('budget-1'),
    };

    authService = {
      currentUser: signal(mockUser),
    };

    router = {
      navigate: vi.fn(),
    } as unknown as Router;

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    const paramMap = new Map();
    paramMap.set('id', 'account-1');

    activatedRoute = {
      snapshot: {
        paramMap: paramMap,
      },
    } as unknown as ActivatedRoute;

    TestBed.configureTestingModule({
      imports: [AccountsEditPage],
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
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialization', () => {
    it('should initialize form with account data', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form).toBeTruthy();
      expect(form?.get('name')?.value).toBe(mockAccount.name);
      expect(form?.get('type')?.value).toBe(mockAccount.type);
    });

    it('should show error when account ID is not found', () => {
      const paramMap = new Map();
      activatedRoute.snapshot.paramMap = paramMap;

      component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('ID da conta não encontrado');
      expect(router.navigate).toHaveBeenCalledWith(['/accounts'], { replaceUrl: true });
    });

    it('should show error when account is not found', () => {
      accountState.accounts.set([]);

      component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('Conta não encontrada');
      expect(router.navigate).toHaveBeenCalledWith(['/accounts'], { replaceUrl: true });
    });

    it('should load accounts if list is empty', () => {
      accountState.accounts.set([]);
      accountState.loadAccounts.mockImplementation(() => {
        accountState.accounts.set([mockAccount]);
      });

      component.ngOnInit();
      fixture.detectChanges();

      expect(accountState.loadAccounts).toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct page title', () => {
      expect(component.pageTitle()).toBe(`Editar ${mockAccount.name}`);
    });

    it('should return correct page subtitle', () => {
      expect(component.pageSubtitle()).toBe('Atualize as informações da conta');
    });

    it('should return correct breadcrumbs', () => {
      const breadcrumbs = component.breadcrumbs();
      expect(breadcrumbs.length).toBe(3);
      expect(breadcrumbs[0].label).toBe('Contas');
      expect(breadcrumbs[0].route).toBe('/accounts');
      expect(breadcrumbs[1].label).toBe(mockAccount.name);
      expect(breadcrumbs[1].route).toBe(`/accounts/${mockAccount.id}`);
      expect(breadcrumbs[2].label).toBe('Editar');
      expect(breadcrumbs[2].route).toBeUndefined();
    });

    it('should return correct type options', () => {
      const options = component.typeOptions();
      expect(options.length).toBe(6);
      expect(options[0].value).toBe('CHECKING_ACCOUNT');
      expect(options[0].label).toBe('Conta Corrente');
    });

    it('should return correct form config', () => {
      const config = component.formConfig();
      expect(config.showHeader).toBe(false);
      expect(config.showActions).toBe(true);
      expect(config.showSaveButton).toBe(true);
      expect(config.showCancelButton).toBe(true);
      expect(config.saveButtonText).toBe('Salvar');
      expect(config.cancelButtonText).toBe('Cancelar');
    });

    it('should return loading state from accountState', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBe(true);

      accountState.loading.set(false);
      fixture.detectChanges();
      expect(component.loading()).toBe(false);
    });

    it('should return account from state', () => {
      const account = component.account();
      expect(account).toEqual(mockAccount);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show error when name is empty', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(component.getNameErrorMessage()).toBe('Nome da conta é obrigatório');
    });

    it('should show error when name is too short', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('ab');

      component.onSave();
      fixture.detectChanges();

      expect(component.getNameErrorMessage()).toBe('Nome deve ter pelo menos 3 caracteres');
    });

    it('should show error when name is too long', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('a'.repeat(101));

      component.onSave();
      fixture.detectChanges();

      expect(component.getNameErrorMessage()).toBe('Nome deve ter no máximo 100 caracteres');
    });

    it('should not show error when name is valid', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.setValue('Updated Account Name');

      expect(component.getNameErrorMessage()).toBe('');
    });
  });

  describe('onSave', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not save when form is invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(accountState.updateAccount).not.toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(form?.touched).toBe(true);
    });

    it('should update account when form is valid', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Updated Account Name',
        type: 'SAVINGS_ACCOUNT',
      });

      component.onSave();
      fixture.detectChanges();

      expect(accountState.updateAccount).toHaveBeenCalledWith({
        id: 'account-1',
        userId: mockUser.id,
        name: 'Updated Account Name',
        type: 'SAVINGS_ACCOUNT',
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Conta atualizada com sucesso!');
      expect(router.navigate).toHaveBeenCalledWith(['/accounts', 'account-1'], {
        replaceUrl: true,
      });
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Updated Account Name',
        type: 'SAVINGS_ACCOUNT',
      });

      component.onSave();
      fixture.detectChanges();

      expect(accountState.updateAccount).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados insuficientes para atualizar a conta'
      );
    });

    it('should show error when account ID is missing', () => {
      const paramMap = new Map();
      activatedRoute.snapshot.paramMap = paramMap;
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Updated Account Name',
        type: 'SAVINGS_ACCOUNT',
      });

      component.onSave();
      fixture.detectChanges();

      expect(accountState.updateAccount).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados insuficientes para atualizar a conta'
      );
    });
  });

  describe('onCancel', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should navigate back to account detail', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/accounts', 'account-1'], {
        replaceUrl: true,
      });
    });

    it('should navigate to accounts list if account ID is missing', () => {
      const paramMap = new Map();
      activatedRoute.snapshot.paramMap = paramMap;
      component.ngOnInit();
      fixture.detectChanges();

      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/accounts'], { replaceUrl: true });
    });
  });

  describe('onBreadcrumbClick', () => {
    it('should navigate when breadcrumb has route', () => {
      component.onBreadcrumbClick({ label: 'Contas', route: '/accounts' });
      expect(router.navigate).toHaveBeenCalledWith(['/accounts']);
    });

    it('should not navigate when breadcrumb has no route', () => {
      component.onBreadcrumbClick({ label: 'Editar', route: undefined });
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should disable form when loading', () => {
      accountState.loading.set(true);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.disabled).toBe(true);
    });

    it('should enable form when not loading', () => {
      accountState.loading.set(false);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.disabled).toBe(false);
    });
  });
});
