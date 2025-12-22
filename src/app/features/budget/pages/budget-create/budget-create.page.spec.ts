import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { BudgetCreatePage } from './budget-create.page';
import { BudgetState } from '@core/services/budget/budget.state';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import { OsPageHeaderComponent } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';

describe('BudgetCreatePage', () => {
  let component: BudgetCreatePage;
  let fixture: ComponentFixture<BudgetCreatePage>;
  let budgetState: {
    loading: ReturnType<typeof signal<boolean>>;
    createBudget: ReturnType<typeof vi.fn>;
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

  beforeEach(() => {
    budgetState = {
      loading: signal(false),
      createBudget: vi.fn(),
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
      imports: [
        BudgetCreatePage,
        OsPageComponent,
        OsPageHeaderComponent,
        OsFormTemplateComponent,
        RouterTestingModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: BudgetState,
          useValue: budgetState,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
      ],
    })
      .overrideComponent(BudgetCreatePage, {
        set: {
          styles: [''],
        } as never,
      })
      .overrideComponent(OsPageComponent, {
        set: {
          styleUrls: [],
          styles: [''],
        } as never,
      })
      .overrideComponent(OsPageHeaderComponent, {
        set: {
          styleUrls: [],
          styles: [''],
        } as never,
      })
      .overrideComponent(OsFormTemplateComponent, {
        set: {
          styleUrls: [],
          styles: [''],
        } as never,
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetCreatePage);
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
      expect(form?.get('name')?.value).toBe('');
      expect(form?.get('type')?.value).toBe('PERSONAL');
    });

    it('should initialize form with validators', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      const nameControl = form?.get('name');
      const typeControl = form?.get('type');

      expect(nameControl?.hasError('required')).toBe(true);
      expect(typeControl?.hasError('required')).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct page title', () => {
      expect(component.pageTitle()).toBe('Criar Orçamento');
    });

    it('should return correct page subtitle', () => {
      expect(component.pageSubtitle()).toBe('Preencha os dados para criar um novo orçamento');
    });

    it('should return correct breadcrumbs', () => {
      const breadcrumbs = component.breadcrumbs();
      expect(breadcrumbs.length).toBe(2);
      expect(breadcrumbs[0].label).toBe('Orçamentos');
      expect(breadcrumbs[0].route).toBe('/budgets');
      expect(breadcrumbs[1].label).toBe('Novo');
      expect(breadcrumbs[1].route).toBeUndefined();
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
      expect(config.saveButtonText).toBe('Criar');
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
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show error when name is empty', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      nameControl?.markAsDirty();
      nameControl?.updateValueAndValidity();

      component['_formValidityTick'].update((v: number) => v + 1);
      fixture.detectChanges();

      expect(component.getNameErrorMessage()).toBe('Nome do orçamento é obrigatório');
    });

    it('should show error when name is too short', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.setValue('ab');
      nameControl?.markAsTouched();
      nameControl?.markAsDirty();
      nameControl?.updateValueAndValidity();

      component['_formValidityTick'].update((v: number) => v + 1);
      fixture.detectChanges();

      expect(component.getNameErrorMessage()).toBe('Nome deve ter pelo menos 3 caracteres');
    });

    it('should show error when name is too long', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.setValue('a'.repeat(101));
      nameControl?.markAsTouched();
      nameControl?.markAsDirty();
      nameControl?.updateValueAndValidity();

      component['_formValidityTick'].update((v: number) => v + 1);
      fixture.detectChanges();

      expect(component.getNameErrorMessage()).toBe('Nome deve ter no máximo 100 caracteres');
    });

    it('should not show error when name is valid', () => {
      const form = component.form();
      const nameControl = form?.get('name');
      nameControl?.setValue('Valid Budget Name');

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

      expect(budgetState.createBudget).not.toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(form?.touched).toBe(true);
    });

    it('should create budget when form is valid', () => {
      const form = component.form();
      form?.patchValue({
        name: 'New Budget',
        type: 'PERSONAL',
      });

      component.onSave();
      fixture.detectChanges();

      expect(budgetState.createBudget).toHaveBeenCalledWith('New Budget', 'PERSONAL', mockUser.id);
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Orçamento criado com sucesso!');
      expect(router.navigate).toHaveBeenCalledWith(['/budgets'], { replaceUrl: true });
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'New Budget',
        type: 'PERSONAL',
      });

      component.onSave();
      fixture.detectChanges();

      expect(budgetState.createBudget).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith('Usuário não autenticado');
    });
  });

  describe('onCancel', () => {
    it('should navigate back to budgets list', () => {
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
    });
  });
});
