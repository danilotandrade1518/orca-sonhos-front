import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BudgetDetailPage } from './budget-detail.page';
import { BudgetState } from '@core/services/budget/budget.state';
import { AuthService } from '@core/services/auth/auth.service';
import { signal } from '@angular/core';
import { BudgetDto } from '../../../../../dtos/budget';

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

  beforeEach(() => {
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

    router = {
      navigate: vi.fn(),
    } as unknown as Router;

    TestBed.configureTestingModule({
      imports: [BudgetDetailPage],
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
          useValue: {
            snapshot: {
              paramMap: new Map([['id', 'budget-1']]),
            },
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetDetailPage);
    component = fixture.componentInstance;
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

  it('should load budgets if empty on init', () => {
    budgetState.budgets.set([]);
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
});
