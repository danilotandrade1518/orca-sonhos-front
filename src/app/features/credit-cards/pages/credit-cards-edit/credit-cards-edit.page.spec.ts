import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { CreditCardsEditPage } from './credit-cards-edit.page';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import type { CreditCardDto } from '../../../../../dtos/credit-card';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import { OsPageHeaderComponent } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';

describe('CreditCardsEditPage', () => {
  let component: CreditCardsEditPage;
  let fixture: ComponentFixture<CreditCardsEditPage>;
  let creditCardState: {
    creditCards: ReturnType<typeof signal<CreditCardDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    updateCreditCard: ReturnType<typeof vi.fn>;
    loadCreditCards: ReturnType<typeof vi.fn>;
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

  const mockBudgetId = 'budget-1';

  const mockCreditCard: CreditCardDto = {
    id: 'credit-card-1',
    name: 'Cartão Nubank',
    limit: 500000,
    closingDay: 10,
    dueDay: 15,
    budgetId: mockBudgetId,
  };

  beforeEach(async () => {
    creditCardState = {
      creditCards: signal([mockCreditCard]),
      loading: signal(false),
      updateCreditCard: vi.fn(),
      loadCreditCards: vi.fn(),
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

    const paramMap = new Map();
    paramMap.set('id', 'credit-card-1');

    activatedRoute = {
      snapshot: {
        paramMap: paramMap,
      },
    } as unknown as ActivatedRoute;

    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [
        CreditCardsEditPage,
        OsPageComponent,
        OsPageHeaderComponent,
        OsFormTemplateComponent,
        RouterTestingModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
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
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
      ],
    })
      .overrideComponent(CreditCardsEditPage, {
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
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardsEditPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialization', () => {
    it('should initialize form with credit card data', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form).toBeTruthy();
      expect(form?.get('name')?.value).toBe(mockCreditCard.name);
      expect(form?.get('limit')?.value).toBe(mockCreditCard.limit / 100);
      expect(form?.get('closingDay')?.value).toBe(mockCreditCard.closingDay);
      expect(form?.get('dueDay')?.value).toBe(mockCreditCard.dueDay);
    });

    it('should convert limit from cents to reais', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('limit')?.value).toBe(5000);
    });

    it('should show error when credit card ID is not found', async () => {
      const emptyParamMap = new Map();
      const emptyActivatedRoute = {
        snapshot: {
          paramMap: emptyParamMap,
        },
      } as unknown as ActivatedRoute;

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          CreditCardsEditPage,
          OsPageComponent,
          OsPageHeaderComponent,
          OsFormTemplateComponent,
          RouterTestingModule,
        ],
        providers: [
          provideZonelessChangeDetection(),
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
            provide: ActivatedRoute,
            useValue: emptyActivatedRoute,
          },
          {
            provide: NotificationService,
            useValue: notificationService,
          },
        ],
      })
        .overrideComponent(CreditCardsEditPage, {
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
        })
        .compileComponents();

      const newFixture = TestBed.createComponent(CreditCardsEditPage);
      const newComponent = newFixture.componentInstance;
      const newRouter = TestBed.inject(Router);
      vi.spyOn(newRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
      newFixture.detectChanges();

      newComponent.ngOnInit();
      newFixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'ID do cartão de crédito não encontrado'
      );
      expect(newRouter.navigate).toHaveBeenCalledWith(['/credit-cards'], { replaceUrl: true });
    });

    it('should show error when credit card is not found', () => {
      creditCardState.creditCards.set([]);

      component.ngOnInit();
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Cartão de crédito não encontrado'
      );
      expect(router.navigate).toHaveBeenCalledWith(['/credit-cards', 'credit-card-1'], {
        replaceUrl: true,
      });
    });

    it('should load credit cards if list is empty', () => {
      creditCardState.creditCards.set([]);
      creditCardState.loadCreditCards.mockImplementation(() => {
        creditCardState.creditCards.set([mockCreditCard]);
      });

      component.ngOnInit();
      fixture.detectChanges();

      expect(creditCardState.loadCreditCards).toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct page title', () => {
      expect(component.pageTitle()).toBe(`Editar ${mockCreditCard.name}`);
    });

    it('should return correct page subtitle', () => {
      expect(component.pageSubtitle()).toBe('Atualize as informações do cartão de crédito');
    });

    it('should return correct breadcrumbs', () => {
      const breadcrumbs = component.breadcrumbs();
      expect(breadcrumbs.length).toBe(3);
      expect(breadcrumbs[0].label).toBe('Cartões de Crédito');
      expect(breadcrumbs[0].route).toBe('/credit-cards');
      expect(breadcrumbs[1].label).toBe(mockCreditCard.name);
      expect(breadcrumbs[1].route).toBe(`/credit-cards/${mockCreditCard.id}`);
      expect(breadcrumbs[2].label).toBe('Editar');
      expect(breadcrumbs[2].route).toBeUndefined();
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

    it('should return loading state from creditCardState', () => {
      creditCardState.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBe(true);

      creditCardState.loading.set(false);
      fixture.detectChanges();
      expect(component.loading()).toBe(false);
    });

    it('should return credit card from state', () => {
      const creditCard = component.creditCard();
      expect(creditCard).toEqual(mockCreditCard);
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

    it('should show error when limit is zero', () => {
      const form = component.form();
      const limitControl = form?.get('limit');
      limitControl?.markAsTouched();
      limitControl?.setValue(0);

      component.onSave();
      fixture.detectChanges();

      expect(component.getLimitErrorMessage()).toBe('Limite deve ser maior que zero');
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

      expect(creditCardState.updateCreditCard).not.toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');

      component.onSave();
      fixture.detectChanges();

      expect(form?.touched).toBe(true);
    });

    it('should update credit card when form is valid', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Cartão Atualizado',
        limit: 6000.0,
        closingDay: 12,
        dueDay: 18,
      });

      component.onSave();
      fixture.detectChanges();

      expect(creditCardState.updateCreditCard).toHaveBeenCalledWith({
        id: 'credit-card-1',
        name: 'Cartão Atualizado',
        limit: 600000,
        closingDay: 12,
        dueDay: 18,
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Cartão de crédito atualizado com sucesso!'
      );
      expect(router.navigate).toHaveBeenCalledWith(['/credit-cards', 'credit-card-1'], {
        replaceUrl: true,
      });
    });

    it('should convert limit to cents', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Cartão Atualizado',
        limit: 1234.56,
        closingDay: 10,
        dueDay: 15,
      });

      component.onSave();
      fixture.detectChanges();

      expect(creditCardState.updateCreditCard).toHaveBeenCalledWith(
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
        name: 'Cartão Atualizado',
        limit: 6000.0,
        closingDay: 12,
        dueDay: 18,
      });

      component.onSave();
      fixture.detectChanges();

      expect(creditCardState.updateCreditCard).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados insuficientes para atualizar o cartão de crédito'
      );
    });

    it('should show error when credit card ID is missing', async () => {
      const emptyParamMap = new Map();
      const emptyActivatedRoute = {
        snapshot: {
          paramMap: emptyParamMap,
        },
      } as unknown as ActivatedRoute;

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          CreditCardsEditPage,
          OsPageComponent,
          OsPageHeaderComponent,
          OsFormTemplateComponent,
          RouterTestingModule,
        ],
        providers: [
          provideZonelessChangeDetection(),
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
            provide: ActivatedRoute,
            useValue: emptyActivatedRoute,
          },
          {
            provide: NotificationService,
            useValue: notificationService,
          },
        ],
      })
        .overrideComponent(CreditCardsEditPage, {
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
        })
        .compileComponents();

      const newFixture = TestBed.createComponent(CreditCardsEditPage);
      const newComponent = newFixture.componentInstance;
      const newRouter = TestBed.inject(Router);
      vi.spyOn(newRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
      newFixture.detectChanges();

      newComponent.ngOnInit();
      newFixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'ID do cartão de crédito não encontrado'
      );
      expect(creditCardState.updateCreditCard).not.toHaveBeenCalled();
    });

    it('should show error when budget is not selected', () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Cartão Atualizado',
        limit: 6000.0,
        closingDay: 12,
        dueDay: 18,
      });

      component.onSave();
      fixture.detectChanges();

      expect(creditCardState.updateCreditCard).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados insuficientes para atualizar o cartão de crédito'
      );
    });
  });

  describe('onCancel', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should navigate back to credit card detail', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/credit-cards', 'credit-card-1'], {
        replaceUrl: true,
      });
    });

    it('should navigate to credit cards list if credit card ID is missing', async () => {
      const emptyParamMap = new Map();
      const emptyActivatedRoute = {
        snapshot: {
          paramMap: emptyParamMap,
        },
      } as unknown as ActivatedRoute;

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          CreditCardsEditPage,
          OsPageComponent,
          OsPageHeaderComponent,
          OsFormTemplateComponent,
          RouterTestingModule,
        ],
        providers: [
          provideZonelessChangeDetection(),
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
            provide: ActivatedRoute,
            useValue: emptyActivatedRoute,
          },
          {
            provide: NotificationService,
            useValue: notificationService,
          },
        ],
      })
        .overrideComponent(CreditCardsEditPage, {
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
        })
        .compileComponents();

      const newFixture = TestBed.createComponent(CreditCardsEditPage);
      const newComponent = newFixture.componentInstance;
      const newRouter = TestBed.inject(Router);
      vi.spyOn(newRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
      newFixture.detectChanges();

      newComponent.ngOnInit();
      newFixture.detectChanges();

      expect(newRouter.navigate).toHaveBeenCalledWith(['/credit-cards'], { replaceUrl: true });
    });
  });

  describe('onBreadcrumbClick', () => {
    it('should navigate when breadcrumb has route', () => {
      component.onBreadcrumbClick({ label: 'Cartões de Crédito', route: '/credit-cards' });
      expect(router.navigate).toHaveBeenCalledWith(['/credit-cards']);
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
