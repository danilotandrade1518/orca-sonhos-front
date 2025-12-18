import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { TransactionsCreatePage } from './transactions-create.page';
import { TransactionsApiService } from '../../services/transactions-api.service';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AccountState } from '@core/services/account/account-state/account.state';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { CategoryState } from '@core/services/category/category.state';
import { of, throwError } from 'rxjs';

describe('TransactionsCreatePage', () => {
  let component: TransactionsCreatePage;
  let fixture: ComponentFixture<TransactionsCreatePage>;
  let transactionsApi: {
    create: ReturnType<typeof vi.fn>;
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
  let accountState: {
    accountsByBudgetId: ReturnType<typeof vi.fn>;
    loadAccounts: ReturnType<typeof vi.fn>;
  };
  let creditCardState: {
    creditCardsByBudgetId: ReturnType<typeof vi.fn>;
    loadCreditCards: ReturnType<typeof vi.fn>;
  };
  let categoryState: {
    activeCategories: ReturnType<typeof vi.fn>;
    loadCategories: ReturnType<typeof vi.fn>;
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockBudgetId = 'budget-1';

  const mockAccount = {
    id: 'account-1',
    name: 'Conta Teste',
    type: 'CHECKING_ACCOUNT',
    balance: 10000,
    budgetId: mockBudgetId,
  };

  const mockCategory = {
    id: 'category-1',
    name: 'Categoria Teste',
    type: 'EXPENSE',
    budgetId: mockBudgetId,
  };

  beforeEach(() => {
    transactionsApi = {
      create: vi.fn().mockReturnValue(of({ data: { success: true } })),
    };

    budgetSelection = {
      selectedBudgetId: signal(mockBudgetId),
    };

    authService = {
      currentUser: signal(mockUser),
    };

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    accountState = {
      accountsByBudgetId: vi.fn().mockReturnValue([mockAccount]),
      loadAccounts: vi.fn(),
    };

    creditCardState = {
      creditCardsByBudgetId: vi.fn().mockReturnValue([]),
      loadCreditCards: vi.fn(),
    };

    categoryState = {
      activeCategories: vi.fn().mockReturnValue([mockCategory]),
      loadCategories: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TransactionsCreatePage, RouterTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: TransactionsApiService,
          useValue: transactionsApi,
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
          provide: NotificationService,
          useValue: notificationService,
        },
        {
          provide: AccountState,
          useValue: accountState,
        },
        {
          provide: CreditCardState,
          useValue: creditCardState,
        },
        {
          provide: CategoryState,
          useValue: categoryState,
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsCreatePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialization', () => {
    it('should initialize form with default values', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form).toBeTruthy();
      expect(form?.get('description')?.value).toBe('');
      expect(form?.get('amount')?.value).toBe(null);
      expect(form?.get('type')?.value).toBe('EXPENSE');
      expect(form?.get('accountId')?.value).toBe('');
      expect(form?.get('categoryId')?.value).toBe('');
      expect(form?.get('transactionDate')?.value).toBe(null);
      expect(form?.get('creditCardId')?.value).toBe('');
    });

    it('should initialize form with validators', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      const descriptionControl = form?.get('description');
      const amountControl = form?.get('amount');
      const typeControl = form?.get('type');
      const accountIdControl = form?.get('accountId');
      const categoryIdControl = form?.get('categoryId');

      expect(descriptionControl?.hasError('required')).toBe(true);
      expect(amountControl?.hasError('required')).toBe(true);
      expect(typeControl?.hasError('required')).toBe(false);
      expect(accountIdControl?.hasError('required')).toBe(true);
      expect(categoryIdControl?.hasError('required')).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct page title', () => {
      expect(component.pageTitle()).toBe('Criar Transação');
    });

    it('should return correct page subtitle', () => {
      expect(component.pageSubtitle()).toBe('Preencha os dados para criar uma nova transação');
    });

    it('should return correct breadcrumbs', () => {
      const breadcrumbs = component.breadcrumbs();
      expect(breadcrumbs.length).toBe(2);
      expect(breadcrumbs[0].label).toBe('Transações');
      expect(breadcrumbs[0].route).toBe('/transactions');
      expect(breadcrumbs[1].label).toBe('Nova');
      expect(breadcrumbs[1].route).toBeUndefined();
    });

    it('should return correct type options', () => {
      const options = component.typeOptions();
      expect(options.length).toBe(3);
      expect(options[0].value).toBe('INCOME');
      expect(options[0].label).toBe('Receita');
      expect(options[1].value).toBe('EXPENSE');
      expect(options[1].label).toBe('Despesa');
      expect(options[2].value).toBe('TRANSFER');
      expect(options[2].label).toBe('Transferência');
    });

    it('should return correct form config', () => {
      const config = component.formConfig();
      expect(config.showHeader).toBe(false);
      expect(config.showActions).toBe(true);
      expect(config.showSaveButton).toBe(true);
      expect(config.showCancelButton).toBe(true);
      expect(config.saveButtonText).toBe('Criar');
      expect(config.cancelButtonText).toBe('Cancelar');
    });

    it('should return account options from accountState', () => {
      const options = component.accountOptions();
      expect(options.length).toBe(1);
      expect(options[0].value).toBe(mockAccount.id);
      expect(options[0].label).toBe(mockAccount.name);
    });

    it('should return category options filtered by type', () => {
      const form = component.form();
      form?.get('type')?.setValue('EXPENSE');
      fixture.detectChanges();

      const options = component.categoryOptions();
      expect(options.length).toBe(1);
      expect(options[0].value).toBe(mockCategory.id);
      expect(options[0].label).toBe(mockCategory.name);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show error when description is empty', () => {
      const form = component.form();
      const descriptionControl = form?.get('description');
      descriptionControl?.markAsTouched();
      descriptionControl?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(component.getDescriptionErrorMessage()).toBe('Descrição é obrigatória');
    });

    it('should show error when description is too short', () => {
      const form = component.form();
      const descriptionControl = form?.get('description');
      descriptionControl?.markAsTouched();
      descriptionControl?.setValue('ab');

      component.onSave();
      fixture.detectChanges();

      expect(component.getDescriptionErrorMessage()).toBe(
        'Descrição deve ter pelo menos 3 caracteres'
      );
    });

    it('should show error when amount is empty', () => {
      const form = component.form();
      const amountControl = form?.get('amount');
      amountControl?.markAsTouched();
      amountControl?.setValue(null);

      component.onSave();
      fixture.detectChanges();

      expect(component.getAmountErrorMessage()).toBe('Valor é obrigatório');
    });

    it('should show error when amount is zero', () => {
      const form = component.form();
      const amountControl = form?.get('amount');
      amountControl?.markAsTouched();
      amountControl?.setValue(0);

      component.onSave();
      fixture.detectChanges();

      expect(component.getAmountErrorMessage()).toBe('Valor deve ser maior que zero');
    });

    it('should show error when account is not selected', () => {
      const form = component.form();
      const accountIdControl = form?.get('accountId');
      accountIdControl?.markAsTouched();

      component.onSave();
      fixture.detectChanges();

      expect(component.getAccountIdErrorMessage()).toBe('Conta é obrigatória');
    });

    it('should show error when category is not selected', () => {
      const form = component.form();
      const categoryIdControl = form?.get('categoryId');
      categoryIdControl?.markAsTouched();

      component.onSave();
      fixture.detectChanges();

      expect(component.getCategoryIdErrorMessage()).toBe('Categoria é obrigatória');
    });
  });

  describe('onSave', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not save when form is invalid', async () => {
      const form = component.form();
      form?.get('description')?.setValue('');

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.create).not.toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', async () => {
      const form = component.form();
      form?.get('description')?.setValue('');

      await component.onSave();
      fixture.detectChanges();

      expect(form?.touched).toBe(true);
    });

    it('should create transaction when form is valid', async () => {
      const form = component.form();
      form?.patchValue({
        description: 'Compra no supermercado',
        amount: 100.5,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        description: 'Compra no supermercado',
        amount: 10050,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
        budgetId: mockBudgetId,
        transactionDate: undefined,
        creditCardId: undefined,
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Transação criada com sucesso!');
      expect(router.navigate).toHaveBeenCalledWith(['/transactions'], { replaceUrl: true });
    });

    it('should convert amount to cents', async () => {
      const form = component.form();
      form?.patchValue({
        description: 'Compra no supermercado',
        amount: 1234.56,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 123456,
        })
      );
    });

    it('should include transactionDate when provided', async () => {
      const form = component.form();
      const date = new Date('2024-01-15');
      form?.patchValue({
        description: 'Compra no supermercado',
        amount: 100.5,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
        transactionDate: date,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionDate: date.toISOString(),
        })
      );
    });

    it('should include creditCardId when provided', async () => {
      const form = component.form();
      form?.patchValue({
        description: 'Compra no supermercado',
        amount: 100.5,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
        creditCardId: 'card-1',
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          creditCardId: 'card-1',
        })
      );
    });

    it('should show error when user is not authenticated', async () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        description: 'Compra no supermercado',
        amount: 100.5,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.create).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith('Usuário não autenticado');
    });

    it('should show error when budget is not selected', async () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        description: 'Compra no supermercado',
        amount: 100.5,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.create).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith('Selecione um orçamento primeiro');
    });

    it('should show error when API call fails', async () => {
      transactionsApi.create.mockReturnValue(throwError(() => new Error('API Error')));

      const form = component.form();
      form?.patchValue({
        description: 'Compra no supermercado',
        amount: 100.5,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should navigate back to transactions list', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/transactions'], { replaceUrl: true });
    });
  });

  describe('onBreadcrumbClick', () => {
    it('should navigate when breadcrumb has route', () => {
      component.onBreadcrumbClick({ label: 'Transações', route: '/transactions' });
      expect(router.navigate).toHaveBeenCalledWith(['/transactions']);
    });

    it('should not navigate when breadcrumb has no route', () => {
      component.onBreadcrumbClick({ label: 'Nova', route: undefined });
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should disable form when loading', async () => {
      const form = component.form();
      form?.patchValue({
        description: 'Compra no supermercado',
        amount: 100.5,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      const savePromise = component.onSave();
      fixture.detectChanges();

      expect(form?.disabled).toBe(true);

      await savePromise;
      fixture.detectChanges();
    });
  });

  describe('Dropdown Changes', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should update type control when type changes', () => {
      component.onTypeChange('INCOME');
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('type')?.value).toBe('INCOME');
    });

    it('should update account control when account changes', () => {
      component.onAccountChange(mockAccount.id);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('accountId')?.value).toBe(mockAccount.id);
    });

    it('should update category control when category changes', () => {
      component.onCategoryChange(mockCategory.id);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('categoryId')?.value).toBe(mockCategory.id);
    });

    it('should update date control when date changes', () => {
      const date = new Date('2024-01-15');
      component.onDateChange(date);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('transactionDate')?.value).toEqual(date);
    });

    it('should update creditCard control when creditCard changes', () => {
      component.onCreditCardChange('card-1');
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('creditCardId')?.value).toBe('card-1');
    });
  });
});
