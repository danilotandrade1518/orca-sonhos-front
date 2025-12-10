import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BudgetDetailPage } from './budget-detail.page';
import { BudgetState } from '@core/services/budget/budget.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AccountState } from '@core/services/account/account-state/account.state';
import { SharingState } from '@core/services/sharing/sharing.state';
import { ReportsState } from '@features/reports/state/reports-state/reports.state';
import { signal } from '@angular/core';
import { BudgetDto } from '../../../../../dtos/budget';
import { AccountDto } from '../../../../../dtos/account';
import { BudgetParticipantDto } from '../../../../../dtos/budget';
import type { BudgetSummaryData } from '@shared/ui-components/organisms/os-dashboard-widgets/os-dashboard-widgets.component';

describe('BudgetDetailPage', () => {
  let component: BudgetDetailPage;
  let fixture: ComponentFixture<BudgetDetailPage>;
  let budgetState: {
    budgets: ReturnType<typeof signal<BudgetDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    selectBudget: ReturnType<typeof vi.fn>;
    deleteBudget: ReturnType<typeof vi.fn>;
    loadBudgets: ReturnType<typeof vi.fn>;
  };
  let authService: {
    currentUser: ReturnType<typeof signal<{ id: string; email: string; name: string } | null>>;
  };
  let accountState: {
    accountsByBudgetId: ReturnType<typeof signal<AccountDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    loadAccounts: ReturnType<typeof vi.fn>;
  };
  let sharingState: {
    participants: ReturnType<typeof signal<BudgetParticipantDto[]>>;
    participantsCount: ReturnType<typeof signal<number>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadParticipants: ReturnType<typeof vi.fn>;
  };
  let budgetSelectionService: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
    setSelectedBudget: ReturnType<typeof vi.fn>;
  };
  let reportsState: {
    revenueExpense: ReturnType<typeof signal<{ revenue: number; expense: number } | null>>;
    loadReports: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  const mockBudget: BudgetDto = {
    id: 'budget-1',
    name: 'Personal Budget',
    type: 'PERSONAL',
    participantsCount: 1,
  };

  const mockBudgets: BudgetDto[] = [mockBudget];

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
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

  beforeEach(async () => {
    budgetState = {
      budgets: signal(mockBudgets),
      loading: signal(false),
      error: signal(null),
      selectBudget: vi.fn(),
      deleteBudget: vi.fn(),
      loadBudgets: vi.fn(),
    };

    authService = {
      currentUser: signal(mockUser),
    };

    accountState = {
      accountsByBudgetId: signal([]),
      loading: signal(false),
      loadAccounts: vi.fn(),
    };

    sharingState = {
      participants: signal([]),
      participantsCount: signal(0),
      loading: signal(false),
      error: signal(null),
      loadParticipants: vi.fn(),
    };

    budgetSelectionService = {
      selectedBudgetId: signal('budget-1'),
      setSelectedBudget: vi.fn(),
    };

    reportsState = {
      revenueExpense: signal({ revenue: 10000, expense: 5000 }),
      loadReports: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BudgetDetailPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        {
          provide: BudgetState,
          useValue: budgetState,
        },
        {
          provide: BudgetSelectionService,
          useValue: budgetSelectionService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: AccountState,
          useValue: accountState,
        },
        {
          provide: SharingState,
          useValue: sharingState,
        },
        {
          provide: ReportsState,
          useValue: reportsState,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map([['id', 'budget-1']]),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetDetailPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should set budgetId from route params on init', () => {
    expect(component.budgetId()).toBe('budget-1');
  });

  it('should select budget on init', () => {
    expect(budgetState.selectBudget).toHaveBeenCalledWith('budget-1');
  });

  it('should load budgets if empty on init', async () => {
    TestBed.resetTestingModule();
    budgetState.budgets.set([]);
    await TestBed.configureTestingModule({
      imports: [BudgetDetailPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        {
          provide: BudgetState,
          useValue: budgetState,
        },
        {
          provide: BudgetSelectionService,
          useValue: budgetSelectionService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: AccountState,
          useValue: accountState,
        },
        {
          provide: SharingState,
          useValue: sharingState,
        },
        {
          provide: ReportsState,
          useValue: reportsState,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map([['id', 'budget-1']]),
            },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BudgetDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(budgetState.loadBudgets).toHaveBeenCalled();
  });

  describe('budget computed', () => {
    it('should return budget when found', () => {
      fixture.detectChanges();
      const budget = component.budget();
      expect(budget).toEqual(mockBudget);
    });

    it('should return null when budget not found', () => {
      component.budgetId.set('non-existent');
      fixture.detectChanges();
      const budget = component.budget();
      expect(budget).toBeNull();
    });
  });

  describe('navigation', () => {
    it('should navigate to list on navigateToList', () => {
      component.navigateToList();
      expect(router.navigate).toHaveBeenCalledWith(['/budgets']);
    });

    it('should navigate to edit on navigateToEdit', () => {
      component.navigateToEdit();
      expect(router.navigate).toHaveBeenCalledWith(['/budgets', 'budget-1', 'edit']);
    });
  });

  describe('delete confirmation', () => {
    it('should show delete modal when confirmDelete is called', () => {
      component.confirmDelete();
      fixture.detectChanges();

      expect(component.showDeleteConfirm()).toBe(true);
      expect(component.showDeleteConfirmModal()).toBe(true);
    });

    it('should delete budget and navigate when confirmed', () => {
      component.confirmDelete();
      fixture.detectChanges();

      component.onDeleteConfirmed();
      fixture.detectChanges();

      expect(budgetState.deleteBudget).toHaveBeenCalledWith('user-123', 'budget-1');
      expect(component.showDeleteConfirmModal()).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/budgets']);
    });

    it('should cancel delete when cancelled', () => {
      component.confirmDelete();
      fixture.detectChanges();

      component.onDeleteCancelled();
      fixture.detectChanges();

      expect(component.showDeleteConfirm()).toBe(false);
      expect(component.showDeleteConfirmModal()).toBe(false);
    });

    it('should handle delete action click', () => {
      component.confirmDelete();
      fixture.detectChanges();

      component.onDeleteActionClick({
        label: 'Excluir',
        variant: 'danger',
        size: 'medium',
      });

      expect(budgetState.deleteBudget).toHaveBeenCalledWith('user-123', 'budget-1');
    });
  });

  describe('currentState', () => {
    it('should return loading when loading', () => {
      budgetState.loading.set(true);
      fixture.detectChanges();
      expect(component.currentState()).toBe('loading');
    });

    it('should return error when error exists', () => {
      budgetState.error.set('Error message');
      fixture.detectChanges();
      expect(component.currentState()).toBe('error');
    });

    it('should return success when budget loaded', () => {
      budgetState.loading.set(false);
      budgetState.error.set(null);
      fixture.detectChanges();
      expect(component.currentState()).toBe('success');
    });
  });

  describe('deleteModalConfig', () => {
    it('should include budget name in subtitle', () => {
      fixture.detectChanges();
      const config = component.deleteModalConfig();
      expect(config.subtitle).toContain('Personal Budget');
    });

    it('should have danger variant for delete action', () => {
      fixture.detectChanges();
      const config = component.deleteModalConfig();
      expect(config.actions?.[0]?.variant).toBe('danger');
      expect(config.actions?.[0]?.label).toBe('Excluir');
    });
  });

  describe('FASE 6: Fluxo Completo de Carregamento', () => {
    it('should load resources when budget is selected', () => {
      budgetSelectionService.selectedBudgetId.set('budget-1');
      fixture.detectChanges();

      budgetSelectionService.selectedBudgetId.set('budget-1');
      fixture.detectChanges();

      expect(accountState.loadAccounts).toHaveBeenCalled();
      expect(sharingState.loadParticipants).toHaveBeenCalledWith('budget-1');
      expect(reportsState.loadReports).toHaveBeenCalled();
    });

    it('should select budget when budgets are loaded', async () => {
      TestBed.resetTestingModule();
      budgetState.budgets.set([]);
      budgetSelectionService.selectedBudgetId.set(null);
      await TestBed.configureTestingModule({
        imports: [BudgetDetailPage],
        providers: [
          provideZonelessChangeDetection(),
          provideRouter([]),
          provideHttpClient(),
          {
            provide: BudgetState,
            useValue: budgetState,
          },
          {
            provide: BudgetSelectionService,
            useValue: budgetSelectionService,
          },
          {
            provide: AuthService,
            useValue: authService,
          },
          {
            provide: AccountState,
            useValue: accountState,
          },
          {
            provide: SharingState,
            useValue: sharingState,
          },
          {
            provide: ReportsState,
            useValue: reportsState,
          },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: new Map([['id', 'budget-1']]),
              },
            },
          },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(BudgetDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      budgetState.budgets.set(mockBudgets);
      fixture.detectChanges();

      expect(budgetState.selectBudget).toHaveBeenCalledWith('budget-1');
    });
  });

  describe('FASE 6: Estados do Componente', () => {
    it('should display loading state when loading', () => {
      budgetState.loading.set(true);
      fixture.detectChanges();

      expect(component.currentState()).toBe('loading');
      const loadingElement = fixture.nativeElement.querySelector('.budget-detail-page__loading');
      expect(loadingElement).toBeTruthy();
    });

    it('should display error state when error exists', () => {
      budgetState.error.set('Erro ao carregar orçamento');
      budgetState.loading.set(false);
      fixture.detectChanges();

      expect(component.currentState()).toBe('error');
      const errorElement = fixture.nativeElement.querySelector('os-alert');
      expect(errorElement).toBeTruthy();
    });

    it('should display empty state when no accounts', () => {
      accountState.accountsByBudgetId.set([]);
      accountState.loading.set(false);
      fixture.detectChanges();

      const emptyElement = fixture.nativeElement.querySelector(
        '.budget-detail-page__accounts-empty'
      );
      expect(emptyElement).toBeTruthy();
    });

    it('should display accounts when loaded', () => {
      accountState.accountsByBudgetId.set(mockAccounts);
      accountState.loading.set(false);
      fixture.detectChanges();

      const accountsList = fixture.nativeElement.querySelector(
        '.budget-detail-page__accounts-list'
      );
      expect(accountsList).toBeTruthy();
      const accountCards = fixture.nativeElement.querySelectorAll('os-account-card');
      expect(accountCards.length).toBe(2);
    });

    it('should display loading state for accounts', () => {
      accountState.loading.set(true);
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector(
        '.budget-detail-page__accounts-loading'
      );
      expect(loadingElement).toBeTruthy();
    });
  });

  describe('FASE 6: Interações e Navegação', () => {
    it('should navigate to transactions on button click', () => {
      fixture.detectChanges();
      component.navigateToTransactions();

      expect(router.navigate).toHaveBeenCalledWith(['/transactions'], {
        queryParams: { budgetId: 'budget-1' },
      });
    });

    it('should navigate to create account on button click', () => {
      fixture.detectChanges();
      component.navigateToCreateAccount();

      expect(router.navigate).toHaveBeenCalledWith(['/accounts'], {
        queryParams: { create: true },
      });
    });

    it('should navigate to accounts list on button click', () => {
      accountState.accountsByBudgetId.set(mockAccounts);
      fixture.detectChanges();
      component.navigateToAccounts();

      expect(router.navigate).toHaveBeenCalledWith(['/accounts']);
    });

    it('should open share modal on button click', () => {
      fixture.detectChanges();
      component.openShareModal();
      fixture.detectChanges();

      expect(component.showShareModal()).toBe(true);
    });

    it('should handle participant removed event', () => {
      fixture.detectChanges();

      component.onCollaborationParticipantRemoved();
      fixture.detectChanges();

      expect(sharingState.loadParticipants).toHaveBeenCalledWith('budget-1');
      expect(budgetState.loadBudgets).toHaveBeenCalled();
    });
  });

  describe('FASE 6: Computed Properties', () => {
    it('should calculate budget summary data correctly', () => {
      accountState.accountsByBudgetId.set(mockAccounts);
      reportsState.revenueExpense.set({ revenue: 10000, expense: 5000 });
      fixture.detectChanges();

      const summaryData = component.budgetSummaryData();

      expect(summaryData).toBeTruthy();
      
      expect(summaryData?.totalBalance).toBe((5000 + 10000) / 100);
      expect(summaryData?.monthlyIncome).toBe(10000 / 100);
      expect(summaryData?.monthlyExpense).toBe(5000 / 100);
      expect(summaryData?.savingsRate).toBe(50);
      expect(summaryData?.budgetUtilization).toBe(50);
    });

    it('should return widgets even when no summary data (defaults to 0)', () => {
      accountState.accountsByBudgetId.set([]);
      reportsState.revenueExpense.set(null);
      fixture.detectChanges();

      const widgets = component.dashboardWidgets();

      expect(widgets.length).toBe(1);
      const data = widgets[0].data as BudgetSummaryData;
      expect(data.totalBalance).toBe(0);
      expect(data.monthlyIncome).toBe(0);
      expect(data.monthlyExpense).toBe(0);
    });

    it('should return widgets when summary data exists', () => {
      accountState.accountsByBudgetId.set(mockAccounts);
      reportsState.revenueExpense.set({ revenue: 10000, expense: 5000 });
      fixture.detectChanges();

      const widgets = component.dashboardWidgets();

      expect(widgets.length).toBe(1);
      expect(widgets[0].type).toBe('budget-summary');
      expect(widgets[0].data).toBeTruthy();
    });

    it('should return creatorId from current user', () => {
      authService.currentUser.set(mockUser);
      fixture.detectChanges();

      const creatorId = component.creatorId();

      expect(creatorId).toBe('user-123');
    });

    it('should return null creatorId when no user', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const creatorId = component.creatorId();

      expect(creatorId).toBeNull();
    });
  });

  describe('FASE 6: Acessibilidade', () => {
    it('should have proper ARIA labels on interactive elements', () => {
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('os-button');
      buttons.forEach((button: HTMLElement) => {
        const ariaLabel = button.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      });
    });

    it('should have aria-live on loading states', () => {
      budgetState.loading.set(true);
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector('[aria-live="polite"]');
      expect(loadingElement).toBeTruthy();
    });

    it('should have aria-live on error states', () => {
      budgetState.error.set('Error message');
      budgetState.loading.set(false);
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('[aria-live="assertive"]');
      expect(errorElement).toBeTruthy();
    });

    it('should have role="list" on accounts list', () => {
      accountState.accountsByBudgetId.set(mockAccounts);
      accountState.loading.set(false);
      fixture.detectChanges();

      const accountsList = fixture.nativeElement.querySelector('[role="list"]');
      expect(accountsList).toBeTruthy();
      expect(accountsList?.getAttribute('aria-label')).toBe('Lista de contas');
    });

    it('should have proper semantic structure with headings', () => {
      fixture.detectChanges();

      const h2Elements = fixture.nativeElement.querySelectorAll('h2');
      expect(h2Elements.length).toBeGreaterThan(0);
      h2Elements.forEach((h2: HTMLElement) => {
        expect(h2.textContent?.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
