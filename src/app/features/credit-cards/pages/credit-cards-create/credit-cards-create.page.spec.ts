import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { CreditCardsCreatePage } from './credit-cards-create.page';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';

describe('CreditCardsCreatePage', () => {
  let component: CreditCardsCreatePage;
  let fixture: ComponentFixture<CreditCardsCreatePage>;
  let creditCardState: {
    loading: ReturnType<typeof signal<boolean>>;
    createCreditCard: ReturnType<typeof vi.fn>;
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

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockBudgetId = 'budget-1';

  beforeEach(() => {
    creditCardState = {
      loading: signal(false),
      createCreditCard: vi.fn(),
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

    TestBed.configureTestingModule({
      imports: [CreditCardsCreatePage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: CreditCardState,
          useValue: creditCardState,
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
          provide: NotificationService,
          useValue: notificationService,
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardsCreatePage);
    component = fixture.componentInstance;
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
      expect(form?.get('name')?.value).toBe('');
      expect(form?.get('limit')?.value).toBe(0);
      expect(form?.get('closingDay')?.value).toBe(null);
      expect(form?.get('dueDay')?.value).toBe(null);
    });

    it('should initialize form with validators', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      const nameControl = form?.get('name');
      const limitControl = form?.get('limit');
      const closingDayControl = form?.get('closingDay');
      const dueDayControl = form?.get('dueDay');

      expect(nameControl?.hasError('required')).toBe(true);
      expect(limitControl?.hasError('required')).toBe(true);
      expect(closingDayControl?.hasError('required')).toBe(true);
      expect(dueDayControl?.hasError('required')).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct page title', () => {
      expect(component.pageTitle()).toBe('Criar Cartão de Crédito');
    });

    it('should return correct page subtitle', () => {
      expect(component.pageSubtitle()).toBe(
        'Preencha os dados para criar um novo cartão de crédito'
      );
    });

    it('should return correct breadcrumbs', () => {
      const breadcrumbs = component.breadcrumbs();
      expect(breadcrumbs.length).toBe(2);
      expect(breadcrumbs[0].label).toBe('Cartões de Crédito');
      expect(breadcrumbs[0].route).toBe('/credit-cards');
      expect(breadcrumbs[1].label).toBe('Novo');
      expect(breadcrumbs[1].route).toBeUndefined();
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

    it('should return loading state from creditCardState', () => {
      creditCardState.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBe(true);

      creditCardState.loading.set(false);
      fixture.detectChanges();
      expect(component.loading()).toBe(false);
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

      expect(component.getNameErrorMessage()).toBe('Nome do cartão é obrigatório');
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

    it('should show error when limit is empty', () => {
      const form = component.form();
      const limitControl = form?.get('limit');
      limitControl?.markAsTouched();
      limitControl?.setValue(null);

      component.onSave();
      fixture.detectChanges();

      expect(component.getLimitErrorMessage()).toBe('Limite é obrigatório');
    });

    it('should show error when limit is zero', () => {
      const form = component.form();
      const limitControl = form?.get('limit');
      limitControl?.markAsTouched();
      limitControl?.setValue(0);

      component.onSave();
      fixture.detectChanges();

      expect(component.getLimitErrorMessage()).toBe('Limite deve ser maior que zero');
    });

    it('should show error when closingDay is empty', () => {
      const form = component.form();
      const closingDayControl = form?.get('closingDay');
      closingDayControl?.markAsTouched();
      closingDayControl?.setValue(null);

      component.onSave();
      fixture.detectChanges();

      expect(component.getClosingDayErrorMessage()).toBe('Dia de fechamento é obrigatório');
    });

    it('should show error when closingDay is out of range', () => {
      const form = component.form();
      const closingDayControl = form?.get('closingDay');
      closingDayControl?.markAsTouched();
      closingDayControl?.setValue(32);

      component.onSave();
      fixture.detectChanges();

      expect(component.getClosingDayErrorMessage()).toBe('Dia de fechamento deve ser entre 1 e 31');
    });

    it('should show error when dueDay is empty', () => {
      const form = component.form();
      const dueDayControl = form?.get('dueDay');
      dueDayControl?.markAsTouched();
      dueDayControl?.setValue(null);

      component.onSave();
      fixture.detectChanges();

      expect(component.getDueDayErrorMessage()).toBe('Dia de vencimento é obrigatório');
    });

    it('should show error when dueDay is out of range', () => {
      const form = component.form();
      const dueDayControl = form?.get('dueDay');
      dueDayControl?.markAsTouched();
      dueDayControl?.setValue(0);

      component.onSave();
      fixture.detectChanges();

      expect(component.getDueDayErrorMessage()).toBe('Dia de vencimento deve ser entre 1 e 31');
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

      expect(creditCardState.createCreditCard).not.toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(form?.touched).toBe(true);
    });

    it('should create credit card when form is valid', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Cartão Nubank',
        limit: 5000.0,
        closingDay: 10,
        dueDay: 15,
      });

      component.onSave();
      fixture.detectChanges();

      expect(creditCardState.createCreditCard).toHaveBeenCalledWith({
        name: 'Cartão Nubank',
        limit: 500000,
        closingDay: 10,
        dueDay: 15,
        budgetId: mockBudgetId,
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Cartão de crédito criado com sucesso!'
      );
      expect(router.navigate).toHaveBeenCalledWith(['/credit-cards'], { replaceUrl: true });
    });

    it('should convert limit to cents', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Cartão Nubank',
        limit: 1234.56,
        closingDay: 10,
        dueDay: 15,
      });

      component.onSave();
      fixture.detectChanges();

      expect(creditCardState.createCreditCard).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 123456,
        })
      );
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Cartão Nubank',
        limit: 5000.0,
        closingDay: 10,
        dueDay: 15,
      });

      component.onSave();
      fixture.detectChanges();

      expect(creditCardState.createCreditCard).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Usuário ou orçamento não selecionado'
      );
    });

    it('should show error when budget is not selected', () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Cartão Nubank',
        limit: 5000.0,
        closingDay: 10,
        dueDay: 15,
      });

      component.onSave();
      fixture.detectChanges();

      expect(creditCardState.createCreditCard).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Usuário ou orçamento não selecionado'
      );
    });
  });

  describe('onCancel', () => {
    it('should navigate back to credit cards list', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/credit-cards'], { replaceUrl: true });
    });
  });

  describe('onBreadcrumbClick', () => {
    it('should navigate when breadcrumb has route', () => {
      component.onBreadcrumbClick({ label: 'Cartões de Crédito', route: '/credit-cards' });
      expect(router.navigate).toHaveBeenCalledWith(['/credit-cards']);
    });

    it('should not navigate when breadcrumb has no route', () => {
      component.onBreadcrumbClick({ label: 'Novo', route: undefined });
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should disable form when loading', () => {
      creditCardState.loading.set(true);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.disabled).toBe(true);
    });

    it('should enable form when not loading', () => {
      creditCardState.loading.set(false);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.disabled).toBe(false);
    });
  });
});
