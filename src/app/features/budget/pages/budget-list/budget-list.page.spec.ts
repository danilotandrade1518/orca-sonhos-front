import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BudgetListPage } from './budget-list.page';
import { BudgetState } from '@core/services/budget/budget.state';
import { AuthService } from '@core/services/auth/auth.service';
import { signal } from '@angular/core';
import { BudgetDto } from '../../../../../dtos/budget';

describe('BudgetListPage', () => {
  let component: BudgetListPage;
  let fixture: ComponentFixture<BudgetListPage>;
  let budgetState: {
    budgets: ReturnType<typeof signal<BudgetDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
    loadBudgets: ReturnType<typeof vi.fn>;
    deleteBudget: ReturnType<typeof vi.fn>;
  };
  let authService: {
    currentUser: ReturnType<typeof signal<{ id: string; email: string; name: string } | null>>;
  };
  let router: Router;

  const mockBudgets: BudgetDto[] = [
    {
      id: 'budget-1',
      name: 'Personal Budget',
      type: 'PERSONAL',
      participantsCount: 1,
    },
    {
      id: 'budget-2',
      name: 'Family Budget',
      type: 'SHARED',
      participantsCount: 3,
    },
  ];

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
      selectedBudgetId: signal('budget-1'),
      loadBudgets: vi.fn(),
      deleteBudget: vi.fn(),
    };

    authService = {
      currentUser: signal(mockUser),
    };

    router = {
      navigate: vi.fn(),
    } as unknown as Router;

    TestBed.configureTestingModule({
      imports: [BudgetListPage],
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
              data: {},
              paramMap: new Map(),
            },
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should load budgets on init', async () => {
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(budgetState.loadBudgets).toHaveBeenCalled();
  });

  describe('filtering', () => {
    it('should filter budgets by search term', () => {
      component.updateSearchTerm({
        target: { value: 'Personal' },
      } as unknown as Event);

      fixture.detectChanges();
      const filtered = component.filteredBudgets();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Personal Budget');
    });

    it('should filter budgets by type', () => {
      component.updateTypeFilter({
        target: { value: 'SHARED' },
      } as unknown as Event);

      fixture.detectChanges();
      const filtered = component.filteredBudgets();
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('SHARED');
    });

    it('should show all budgets when type is "all"', () => {
      component.updateTypeFilter({
        target: { value: 'all' },
      } as unknown as Event);

      fixture.detectChanges();
      const filtered = component.filteredBudgets();
      expect(filtered.length).toBe(2);
    });
  });

  describe('navigation', () => {
    it('should navigate to create on navigateToCreate', () => {
      component.navigateToCreate();
      expect(router.navigate).toHaveBeenCalledWith(['new'], {
        relativeTo: TestBed.inject(ActivatedRoute),
      });
    });

    it('should navigate to detail on navigateToDetail', () => {
      component.navigateToDetail('budget-1');
      expect(router.navigate).toHaveBeenCalledWith(['budget-1'], {
        relativeTo: TestBed.inject(ActivatedRoute),
      });
    });

    it('should navigate to edit on navigateToEdit', () => {
      component.navigateToEdit('budget-1');
      expect(router.navigate).toHaveBeenCalledWith(['budget-1', 'edit'], {
        relativeTo: TestBed.inject(ActivatedRoute),
      });
    });
  });

  describe('delete confirmation', () => {
    it('should show delete modal when confirmDelete is called', () => {
      component.confirmDelete('budget-1');
      fixture.detectChanges();

      expect(component.deleteBudgetId()).toBe('budget-1');
      expect(component.deleteBudgetName()).toBe('Personal Budget');
      expect(component.showDeleteConfirmModal()).toBe(true);
    });

    it('should delete budget when confirmed', () => {
      component.confirmDelete('budget-1');
      fixture.detectChanges();

      component.onDeleteConfirmed();
      fixture.detectChanges();

      expect(budgetState.deleteBudget).toHaveBeenCalledWith('user-123', 'budget-1');
      expect(component.showDeleteConfirmModal()).toBe(false);
    });

    it('should cancel delete when cancelled', () => {
      component.confirmDelete('budget-1');
      fixture.detectChanges();

      component.onDeleteCancelled();
      fixture.detectChanges();

      expect(component.deleteBudgetId()).toBeNull();
      expect(component.deleteBudgetName()).toBeNull();
      expect(component.showDeleteConfirmModal()).toBe(false);
    });

    it('should handle delete action click', () => {
      component.confirmDelete('budget-1');
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

    it('should return empty when no budgets', () => {
      budgetState.budgets.set([]);
      fixture.detectChanges();
      expect(component.currentState()).toBe('empty');
    });

    it('should return success when budgets exist', () => {
      budgetState.budgets.set(mockBudgets);
      budgetState.loading.set(false);
      budgetState.error.set(null);
      fixture.detectChanges();
      expect(component.currentState()).toBe('success');
    });
  });

  describe('isSelected', () => {
    it('should return true when budget is selected', () => {
      budgetState.selectedBudgetId.set('budget-1');
      fixture.detectChanges();
      expect(component.isSelected('budget-1')).toBe(true);
    });

    it('should return false when budget is not selected', () => {
      budgetState.selectedBudgetId.set('budget-2');
      fixture.detectChanges();
      expect(component.isSelected('budget-1')).toBe(false);
    });
  });

  describe('form handlers', () => {
    it('should navigate to budgets list on form saved', () => {
      component.onFormSaved();
      expect(router.navigate).toHaveBeenCalledWith(['/budgets'], {
        replaceUrl: true,
      });
    });

    it('should navigate to budgets list on form cancelled', () => {
      component.onFormCancelled();
      expect(router.navigate).toHaveBeenCalledWith(['/budgets'], {
        replaceUrl: true,
      });
    });
  });

  describe('retry', () => {
    it('should reload budgets on retry', () => {
      component.retry();
      expect(budgetState.loadBudgets).toHaveBeenCalled();
    });
  });
});
