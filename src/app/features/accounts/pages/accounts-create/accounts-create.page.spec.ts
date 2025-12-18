import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { AccountsCreatePage } from './accounts-create.page';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import { OsPageHeaderComponent } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';

describe('AccountsCreatePage', () => {
  let component: AccountsCreatePage;
  let fixture: ComponentFixture<AccountsCreatePage>;
  let accountState: {
    loading: ReturnType<typeof signal<boolean>>;
    createAccount: ReturnType<typeof vi.fn>;
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
    accountState = {
      loading: signal(false),
      createAccount: vi.fn(),
    };

    budgetSelection = {
      selectedBudgetId: signal(mockBudgetId),
    };

    authService = {
      currentUser: signal(mockUser),
    };

    router = {
      navigate: vi.fn(),
      createUrlTree: vi.fn().mockReturnValue({}),
      serializeUrl: vi.fn().mockReturnValue('/test'),
    } as unknown as Router;

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        AccountsCreatePage,
        OsPageComponent,
        OsPageHeaderComponent,
        OsFormTemplateComponent,
        RouterTestingModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
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
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map(),
              queryParamMap: new Map(),
            },
          },
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
      ],
    })
      .overrideComponent(AccountsCreatePage, {
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
    fixture = TestBed.createComponent(AccountsCreatePage);
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
      expect(form?.get('type')?.value).toBe(null);
      expect(form?.get('initialBalance')?.value).toBe(0);
    });

    it('should initialize form with validators', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      const nameControl = form?.get('name');
      const typeControl = form?.get('type');

      expect(nameControl?.hasError('required')).toBe(true);
      expect(typeControl?.hasError('required')).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct page title', () => {
      expect(component.pageTitle()).toBe('Criar Conta');
    });

    it('should return correct page subtitle', () => {
      expect(component.pageSubtitle()).toBe('Preencha os dados para criar uma nova conta');
    });

    it('should return correct breadcrumbs', () => {
      const breadcrumbs = component.breadcrumbs();
      expect(breadcrumbs.length).toBe(2);
      expect(breadcrumbs[0].label).toBe('Contas');
      expect(breadcrumbs[0].route).toBe('/accounts');
      expect(breadcrumbs[1].label).toBe('Nova');
      expect(breadcrumbs[1].route).toBeUndefined();
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
      expect(config.saveButtonText).toBe('Criar');
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

    it('should show error when type is not selected', () => {
      const form = component.form();
      const typeControl = form?.get('type');
      typeControl?.markAsTouched();

      component.onSave();
      fixture.detectChanges();

      expect(component.getTypeErrorMessage()).toBe('Tipo de conta é obrigatório');
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

      expect(accountState.createAccount).not.toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(form?.touched).toBe(true);
    });

    it('should create account when form is valid', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        initialBalance: 100.5,
      });

      component.onSave();
      fixture.detectChanges();

      expect(accountState.createAccount).toHaveBeenCalledWith({
        userId: mockUser.id,
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        budgetId: mockBudgetId,
        initialBalance: 10050,
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Conta criada com sucesso!');
      expect(router.navigate).toHaveBeenCalledWith(['/accounts'], { replaceUrl: true });
    });

    it('should convert initialBalance to cents', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        initialBalance: 123.45,
      });

      component.onSave();
      fixture.detectChanges();

      expect(accountState.createAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          initialBalance: 12345,
        })
      );
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
      });

      component.onSave();
      fixture.detectChanges();

      expect(accountState.createAccount).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Usuário ou orçamento não selecionado'
      );
    });

    it('should show error when budget is not selected', () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
      });

      component.onSave();
      fixture.detectChanges();

      expect(accountState.createAccount).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Usuário ou orçamento não selecionado'
      );
    });
  });

  describe('onCancel', () => {
    it('should navigate back to accounts list', () => {
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
      component.onBreadcrumbClick({ label: 'Nova', route: undefined });
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
