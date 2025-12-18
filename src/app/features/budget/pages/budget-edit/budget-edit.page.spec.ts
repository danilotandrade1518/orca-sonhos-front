import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { BudgetEditPage } from './budget-edit.page';
import { BudgetState } from '@core/services/budget/budget.state';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { BudgetDto } from '../../../../../dtos/budget';

describe('BudgetEditPage', () => {
  let component: BudgetEditPage;
  let fixture: ComponentFixture<BudgetEditPage>;
  let budgetState: {
    budgets: ReturnType<typeof signal<BudgetDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    updateBudget: ReturnType<typeof vi.fn>;
    loadBudgets: ReturnType<typeof vi.fn>;
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

  const mockBudget: BudgetDto = {
    id: 'budget-1',
    name: 'Test Budget',
    type: 'PERSONAL',
    participantsCount: 1,
  };

  beforeEach(() => {
    budgetState = {
      budgets: signal([mockBudget]),
      loading: signal(false),
      updateBudget: vi.fn(),
      loadBudgets: vi.fn(),
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
    paramMap.set('id', 'budget-1');

    activatedRoute = {
      snapshot: {
        paramMap: paramMap,
      },
    } as unknown as ActivatedRoute;

    TestBed.configureTestingModule({
      imports: [BudgetEditPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: BudgetState,
          useValue: budgetState,
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
    fixture = TestBed.createComponent(BudgetEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialization', () => {
    it('should initialize form with budget data', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form).toBeTruthy();
      expect(form?.get('name')?.value).toBe(mockBudget.name);
      expect(form?.get('type')?.value).toBe(mockBudget.type);
    });

    it('should disable type field', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      const typeControl = form?.get('type');
      expect(typeControl?.disabled).toBe(true);
    });

    it('should show error when budget ID is not found', () => {
      const paramMap = new Map();
      activatedRoute.snapshot.paramMap = paramMap;

      component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('ID do orçamento não encontrado');
      expect(router.navigate).toHaveBeenCalledWith(['/budgets'], { replaceUrl: true });
    });

    it('should show error when budget is not found', () => {
      budgetState.budgets.set([]);

      component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith('Orçamento não encontrado');
      expect(router.navigate).toHaveBeenCalledWith(['/budgets'], { replaceUrl: true });
    });

    it('should load budgets if list is empty', () => {
      budgetState.budgets.set([]);
      budgetState.loadBudgets.mockImplementation(() => {
        budgetState.budgets.set([mockBudget]);
      });

      component.ngOnInit();
      fixture.detectChanges();

      expect(budgetState.loadBudgets).toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct page title', () => {
      expect(component.pageTitle()).toBe(`Editar ${mockBudget.name}`);
    });

    it('should return correct page subtitle', () => {
      expect(component.pageSubtitle()).toBe('Atualize as informações do orçamento');
    });

    it('should return correct breadcrumbs', () => {
      const breadcrumbs = component.breadcrumbs();
      expect(breadcrumbs.length).toBe(3);
      expect(breadcrumbs[0].label).toBe('Orçamentos');
      expect(breadcrumbs[0].route).toBe('/budgets');
      expect(breadcrumbs[1].label).toBe(mockBudget.name);
      expect(breadcrumbs[1].route).toBe(`/budgets/${mockBudget.id}`);
      expect(breadcrumbs[2].label).toBe('Editar');
      expect(breadcrumbs[2].route).toBeUndefined();
    });

    it('should return correct type options', () => {
      const options = component.typeOptions();
      expect(options.length).toBe(2);
      expect(options[0].value).toBe('PERSONAL');
      expect(options[0].label).toBe('Pessoal');
      expect(options[1].value).toBe('SHARED');
      expect(options[1].label).toBe('Compartilhado');
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

    it('should return loading state from budgetState', () => {
      budgetState.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBe(true);

      budgetState.loading.set(false);
      fixture.detectChanges();
      expect(component.loading()).toBe(false);
    });

    it('should return budget from state', () => {
      const budget = component.budget();
      expect(budget).toEqual(mockBudget);
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

      expect(component.getNameErrorMessage()).toBe('Nome do orçamento é obrigatório');
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
      nameControl?.setValue('Updated Budget Name');

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

      expect(budgetState.updateBudget).not.toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(form?.touched).toBe(true);
    });

    it('should update budget when form is valid', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Updated Budget Name',
      });

      component.onSave();
      fixture.detectChanges();

      expect(budgetState.updateBudget).toHaveBeenCalledWith(
        mockUser.id,
        'budget-1',
        'Updated Budget Name'
      );
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Orçamento atualizado com sucesso!'
      );
      expect(router.navigate).toHaveBeenCalledWith(['/budgets', 'budget-1'], { replaceUrl: true });
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Updated Budget Name',
      });

      component.onSave();
      fixture.detectChanges();

      expect(budgetState.updateBudget).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados insuficientes para atualizar o orçamento'
      );
    });

    it('should show error when budget ID is missing', () => {
      const paramMap = new Map();
      activatedRoute.snapshot.paramMap = paramMap;
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Updated Budget Name',
      });

      component.onSave();
      fixture.detectChanges();

      expect(budgetState.updateBudget).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados insuficientes para atualizar o orçamento'
      );
    });
  });

  describe('onCancel', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should navigate back to budget detail', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/budgets', 'budget-1'], { replaceUrl: true });
    });

    it('should navigate to budgets list if budget ID is missing', () => {
      const paramMap = new Map();
      activatedRoute.snapshot.paramMap = paramMap;
      component.ngOnInit();
      fixture.detectChanges();

      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/budgets'], { replaceUrl: true });
    });
  });

  describe('onBreadcrumbClick', () => {
    it('should navigate when breadcrumb has route', () => {
      component.onBreadcrumbClick({ label: 'Orçamentos', route: '/budgets' });
      expect(router.navigate).toHaveBeenCalledWith(['/budgets']);
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
      budgetState.loading.set(true);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.disabled).toBe(true);
    });

    it('should enable form when not loading', () => {
      budgetState.loading.set(false);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.disabled).toBe(false);
      const typeControl = form?.get('type');
      expect(typeControl?.disabled).toBe(true);
    });
  });
});
