import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { TransactionsEditPage } from './transactions-edit.page';
import { TransactionsApiService } from '../../services/transactions-api.service';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AccountState } from '@core/services/account/account-state/account.state';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { CategoryState } from '@core/services/category/category.state';
import { of, throwError } from 'rxjs';
import type { TransactionDto } from '../../../../../dtos/transaction/transaction-types';

describe('TransactionsEditPage', () => {
  let component: TransactionsEditPage;
  let fixture: ComponentFixture<TransactionsEditPage>;
  let transactionsApi: {
    list: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
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
  let activatedRoute: ActivatedRoute;

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

  const mockTransaction: TransactionDto = {
    id: 'transaction-1',
    description: 'Compra no supermercado',
    amount: 10050,
    type: 'EXPENSE',
    accountId: mockAccount.id,
    categoryId: mockCategory.id,
    budgetId: mockBudgetId,
    transactionDate: '2024-01-15T00:00:00.000Z',
    creditCardId: '',
  };

  beforeEach(() => {
    transactionsApi = {
      list: vi.fn().mockReturnValue(
        of({
          data: {
            data: [mockTransaction],
            meta: { hasNext: false },
          },
        })
      ),
      update: vi.fn().mockReturnValue(of({ data: { success: true } })),
    };

    budgetSelection = {
      selectedBudgetId: signal(mockBudgetId),
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

    const paramMap = new Map();
    paramMap.set('id', 'transaction-1');

    activatedRoute = {
      snapshot: {
        paramMap: paramMap,
      },
    } as unknown as ActivatedRoute;

    TestBed.configureTestingModule({
      imports: [TransactionsEditPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
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
    fixture = TestBed.createComponent(TransactionsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialization', () => {
    it('should load transaction and initialize form with transaction data', async () => {
      await component.ngOnInit();
      fixture.detectChanges();

      expect(transactionsApi.list).toHaveBeenCalledWith({
        budgetId: mockBudgetId,
        page: 1,
        pageSize: 1000,
      });

      const form = component.form();
      expect(form).toBeTruthy();
      expect(form?.get('description')?.value).toBe(mockTransaction.description);
      expect(form?.get('amount')?.value).toBe(mockTransaction.amount / 100);
      expect(form?.get('type')?.value).toBe(mockTransaction.type);
      expect(form?.get('accountId')?.value).toBe(mockTransaction.accountId);
      expect(form?.get('categoryId')?.value).toBe(mockTransaction.categoryId);
    });

    it('should convert amount from cents to reais', async () => {
      await component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('amount')?.value).toBe(100.5);
    });

    it('should show error when transaction ID is not found', async () => {
      const paramMap = new Map();
      activatedRoute.snapshot.paramMap = paramMap;

      await component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('ID da transação não encontrado');
      expect(router.navigate).toHaveBeenCalledWith(['/transactions'], { replaceUrl: true });
    });

    it('should show error when transaction is not found', async () => {
      transactionsApi.list.mockReturnValue(
        of({
          data: {
            data: [],
            meta: { hasNext: false },
          },
        })
      );

      await component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('Transação não encontrada');
      expect(router.navigate).toHaveBeenCalledWith(['/transactions'], { replaceUrl: true });
    });

    it('should show error when budget is not selected', async () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();

      await component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('Selecione um orçamento primeiro');
      expect(router.navigate).toHaveBeenCalledWith(['/transactions'], { replaceUrl: true });
    });

    it('should show error when API call fails', async () => {
      transactionsApi.list.mockReturnValue(throwError(() => new Error('API Error')));

      await component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/transactions'], { replaceUrl: true });
    });
  });

  describe('Computed Properties', () => {
    beforeEach(async () => {
      await component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct page title', () => {
      expect(component.pageTitle()).toBe(`Editar ${mockTransaction.description}`);
    });

    it('should return correct page subtitle', () => {
      expect(component.pageSubtitle()).toBe('Atualize as informações da transação');
    });

    it('should return correct breadcrumbs', () => {
      const breadcrumbs = component.breadcrumbs();
      expect(breadcrumbs.length).toBe(3);
      expect(breadcrumbs[0].label).toBe('Transações');
      expect(breadcrumbs[0].route).toBe('/transactions');
      expect(breadcrumbs[1].label).toBe(mockTransaction.description);
      expect(breadcrumbs[1].route).toBe('/transactions');
      expect(breadcrumbs[2].label).toBe('Editar');
      expect(breadcrumbs[2].route).toBeUndefined();
    });

    it('should return transaction from state', () => {
      const transaction = component.transaction();
      expect(transaction).toEqual(mockTransaction);
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      await component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show error when description is empty', async () => {
      const form = component.form();
      const descriptionControl = form?.get('description');
      descriptionControl?.markAsTouched();
      descriptionControl?.setValue('');

      await component.onSave();
      fixture.detectChanges();

      expect(component.getDescriptionErrorMessage()).toBe('Descrição é obrigatória');
    });

    it('should show error when amount is zero', async () => {
      const form = component.form();
      const amountControl = form?.get('amount');
      amountControl?.markAsTouched();
      amountControl?.setValue(0);

      await component.onSave();
      fixture.detectChanges();

      expect(component.getAmountErrorMessage()).toBe('Valor deve ser maior que zero');
    });
  });

  describe('onSave', () => {
    beforeEach(async () => {
      await component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not save when form is invalid', async () => {
      const form = component.form();
      form?.get('description')?.setValue('');

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.update).not.toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', async () => {
      const form = component.form();
      form?.get('description')?.setValue('');

      await component.onSave();
      fixture.detectChanges();

      expect(form?.touched).toBe(true);
    });

    it('should update transaction when form is valid', async () => {
      const form = component.form();
      form?.patchValue({
        description: 'Compra atualizada',
        amount: 200.0,
        type: 'INCOME',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.update).toHaveBeenCalledWith({
        userId: mockUser.id,
        id: 'transaction-1',
        description: 'Compra atualizada',
        amount: 20000,
        type: 'INCOME',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
        budgetId: mockBudgetId,
        transactionDate: expect.any(String),
        creditCardId: undefined,
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Transação atualizada com sucesso!'
      );
      expect(router.navigate).toHaveBeenCalledWith(['/transactions'], { replaceUrl: true });
    });

    it('should convert amount to cents', async () => {
      const form = component.form();
      form?.patchValue({
        description: 'Compra atualizada',
        amount: 1234.56,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.update).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 123456,
        })
      );
    });

    it('should show error when user is not authenticated', async () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        description: 'Compra atualizada',
        amount: 200.0,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.update).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados insuficientes para atualizar a transação'
      );
    });

    it('should show error when transaction ID is missing', async () => {
      const paramMap = new Map();
      activatedRoute.snapshot.paramMap = paramMap;
      await component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      if (form) {
        form.patchValue({
          description: 'Compra atualizada',
          amount: 200.0,
          type: 'EXPENSE',
          accountId: mockAccount.id,
          categoryId: mockCategory.id,
        });

        await component.onSave();
        fixture.detectChanges();

        expect(transactionsApi.update).not.toHaveBeenCalled();
        expect(notificationService.showError).toHaveBeenCalledWith(
          'Dados insuficientes para atualizar a transação'
        );
      }
    });

    it('should show error when budget is not selected', async () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        description: 'Compra atualizada',
        amount: 200.0,
        type: 'EXPENSE',
        accountId: mockAccount.id,
        categoryId: mockCategory.id,
      });

      await component.onSave();
      fixture.detectChanges();

      expect(transactionsApi.update).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith('Selecione um orçamento primeiro');
    });

    it('should show error when API call fails', async () => {
      transactionsApi.update.mockReturnValue(throwError(() => new Error('API Error')));

      const form = component.form();
      form?.patchValue({
        description: 'Compra atualizada',
        amount: 200.0,
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
      component.onBreadcrumbClick({ label: 'Editar', route: undefined });
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    beforeEach(async () => {
      await component.ngOnInit();
      fixture.detectChanges();
    });

    it('should disable form when loading', async () => {
      const form = component.form();
      form?.patchValue({
        description: 'Compra atualizada',
        amount: 200.0,
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
});
