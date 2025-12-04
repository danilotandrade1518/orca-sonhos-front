import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CategoriesPage } from './categories-page.component';
import { CategoryState } from '../../../../core/services/category/category.state';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import type { CategoryDto } from '../../../../../dtos/category';
import type { PageHeaderAction } from '../../../../shared/ui-components/organisms/os-page-header/os-page-header.component';

describe('CategoriesPage', () => {
  let component: CategoriesPage;
  let fixture: ComponentFixture<CategoriesPage>;
  let categoryState: {
    categoriesByBudgetId: ReturnType<typeof signal<CategoryDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadCategories: ReturnType<typeof vi.fn>;
    createCategory: ReturnType<typeof vi.fn>;
    updateCategory: ReturnType<typeof vi.fn>;
    deleteCategory: ReturnType<typeof vi.fn>;
  };
  let budgetSelectionService: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
  };

  const budgetId = 'budget-1';

  const mockCategories: CategoryDto[] = [
    {
      id: 'category-1',
      budgetId,
      name: 'Alimentação',
      description: 'Gastos com alimentação',
      type: 'EXPENSE',
      kind: 'PRESET',
      color: '#FF0000',
      icon: 'restaurant',
      active: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      order: 0,
    },
    {
      id: 'category-2',
      budgetId,
      name: 'Salário',
      description: 'Receitas de salário',
      type: 'INCOME',
      kind: 'CUSTOM',
      color: '#00FF00',
      icon: 'attach_money',
      active: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      order: 1,
    },
  ];

  beforeEach(async () => {
    categoryState = {
      categoriesByBudgetId: signal<CategoryDto[]>([]),
      loading: signal<boolean>(false),
      error: signal<string | null>(null),
      loadCategories: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };

    budgetSelectionService = {
      selectedBudgetId: signal<string | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [CategoriesPage],
      providers: [
        provideZonelessChangeDetection(),
        { provide: CategoryState, useValue: categoryState },
        { provide: BudgetSelectionService, useValue: budgetSelectionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty categories', () => {
      expect(component.categories()).toEqual([]);
      expect(component.uiCategories()).toEqual([]);
    });

    it('should initialize with loading false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should show empty state when no budget is selected', () => {
      budgetSelectionService.selectedBudgetId.set(null);
      fixture.detectChanges();

      expect(component.currentState()).toBe('empty');
    });
  });

  describe('State Management', () => {
    it('should show loading state when loading', () => {
      categoryState.loading.set(true);
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      expect(component.currentState()).toBe('loading');
      expect(component.isLoading()).toBe(true);
    });

    it('should show error state when error exists', () => {
      categoryState.error.set('Erro ao carregar');
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      expect(component.currentState()).toBe('error');
      expect(component.errorMessage()).toBe('Erro ao carregar');
    });

    it('should show success state when categories are loaded', () => {
      categoryState.categoriesByBudgetId.set(mockCategories);
      categoryState.loading.set(false);
      categoryState.error.set(null);
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      expect(component.currentState()).toBe('success');
      expect(component.categories()).toEqual(mockCategories);
    });

    it('should show default error message when error is null', () => {
      categoryState.error.set(null);
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('Erro ao carregar categorias');
    });
  });

  describe('Category Mapping', () => {
    it('should map CategoryDto to Category correctly', () => {
      categoryState.categoriesByBudgetId.set(mockCategories);
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      const uiCategories = component.uiCategories();
      expect(uiCategories).toHaveLength(2);
      expect(uiCategories[0]).toMatchObject({
        id: 'category-1',
        name: 'Alimentação',
        description: 'Gastos com alimentação',
        type: 'expense',
        color: '#FF0000',
        icon: 'restaurant',
        active: true,
      });
      expect(uiCategories[0].createdAt).toBeInstanceOf(Date);
      expect(uiCategories[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should map INCOME type correctly', () => {
      categoryState.categoriesByBudgetId.set([mockCategories[1]]);
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      const uiCategories = component.uiCategories();
      expect(uiCategories[0].type).toBe('income');
    });

    it('should map TRANSFER type correctly', () => {
      const transferCategory: CategoryDto = {
        ...mockCategories[0],
        type: 'TRANSFER',
      };
      categoryState.categoriesByBudgetId.set([transferCategory]);
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      const uiCategories = component.uiCategories();
      expect(uiCategories[0].type).toBe('transfer');
    });

    it('should map EXPENSE type correctly', () => {
      categoryState.categoriesByBudgetId.set([mockCategories[0]]);
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      const uiCategories = component.uiCategories();
      expect(uiCategories[0].type).toBe('expense');
    });
  });

  describe('Page Header Actions', () => {
    it('should have "Nova Categoria" action', () => {
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      const actions = component.pageHeaderActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toMatchObject({
        label: 'Nova Categoria',
        icon: 'plus',
        variant: 'primary',
        size: 'medium',
        disabled: false,
      });
    });

    it('should disable action when no budget is selected', () => {
      budgetSelectionService.selectedBudgetId.set(null);
      fixture.detectChanges();

      const actions = component.pageHeaderActions();
      expect(actions[0].disabled).toBe(true);
    });

    it('should handle page header action click', () => {
      budgetSelectionService.selectedBudgetId.set(budgetId);
      fixture.detectChanges();

      const action: PageHeaderAction = {
        label: 'Nova Categoria',
        icon: 'plus',
        variant: 'primary',
        size: 'medium',
        disabled: false,
      };
      
      expect(() => component.onPageHeaderActionClick(action)).not.toThrow();
    });
  });

  describe('Category Events', () => {
    beforeEach(() => {
      budgetSelectionService.selectedBudgetId.set(budgetId);
    });

    it('should call createCategory when category is added', () => {
      const formData = {
        name: 'Nova Categoria',
        description: 'Descrição',
        type: 'expense' as const,
        color: '#FF0000',
        icon: 'icon',
        active: true,
      };

      component.onCategoryAdded(formData);

      expect(categoryState.createCategory).toHaveBeenCalledWith({
        userId: '',
        budgetId,
        name: 'Nova Categoria',
        description: 'Descrição',
        type: 'EXPENSE',
        kind: 'CUSTOM',
        color: '#FF0000',
        icon: 'icon',
      });
    });

    it('should not call createCategory when no budget is selected', () => {
      budgetSelectionService.selectedBudgetId.set(null);
      fixture.detectChanges();

      const formData = {
        name: 'Nova Categoria',
        description: 'Descrição',
        type: 'expense' as const,
        color: '#FF0000',
        icon: 'icon',
        active: true,
      };

      component.onCategoryAdded(formData);

      expect(categoryState.createCategory).not.toHaveBeenCalled();
    });

    it('should call updateCategory when category is updated', () => {
      const payload = {
        id: 'category-1',
        data: {
          name: 'Categoria Atualizada',
          description: 'Nova descrição',
          type: 'income' as const,
          color: '#00FF00',
          icon: 'new-icon',
          active: true,
        },
      };

      component.onCategoryUpdated(payload);

      expect(categoryState.updateCategory).toHaveBeenCalledWith({
        id: 'category-1',
        userId: '',
        name: 'Categoria Atualizada',
        description: 'Nova descrição',
        type: 'INCOME',
        color: '#00FF00',
        icon: 'new-icon',
      });
    });

    it('should call deleteCategory when category is deleted', () => {
      component.onCategoryDeleted('category-1');

      expect(categoryState.deleteCategory).toHaveBeenCalledWith({
        userId: '',
        categoryId: 'category-1',
      });
    });
  });

  describe('Effect - Auto Load Categories', () => {
    it('should call loadCategories when budget is selected', async () => {
      budgetSelectionService.selectedBudgetId.set(budgetId);
      categoryState.loading.set(false);
      fixture.detectChanges();
      
      await new Promise((resolve) => setTimeout(resolve, 0));
      
      expect(categoryState.loadCategories).toHaveBeenCalled();
    });

    it('should not call loadCategories when no budget is selected', () => {
      budgetSelectionService.selectedBudgetId.set(null);
      fixture.detectChanges();

      expect(categoryState.loadCategories).not.toHaveBeenCalled();
    });

    it('should not call loadCategories when already loading', () => {
      budgetSelectionService.selectedBudgetId.set(budgetId);
      categoryState.loading.set(true);
      fixture.detectChanges();

      expect(categoryState.loadCategories).not.toHaveBeenCalled();
    });
  });
});
