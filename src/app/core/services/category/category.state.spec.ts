import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  CategoryDto,
  CreateCategoryRequestDto,
  DeleteCategoryRequestDto,
  UpdateCategoryRequestDto,
} from '../../../../dtos/category';
import type { ApiError } from '../api/api.service';
import { BudgetSelectionService } from '../budget-selection/budget-selection.service';
import { CategoriesApiService } from './categories-api.service';
import { CategoryState } from './category.state';

describe('CategoryState', () => {
  let state: CategoryState;
  let categoriesApiService: {
    listCategories: ReturnType<typeof vi.fn>;
    createCategory: ReturnType<typeof vi.fn>;
    updateCategory: ReturnType<typeof vi.fn>;
    deleteCategory: ReturnType<typeof vi.fn>;
  };
  let budgetSelectionService: {
    selectedBudgetId: ReturnType<typeof vi.fn>;
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
      active: false,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      order: 1,
    },
    {
      id: 'category-3',
      budgetId: 'budget-2',
      name: 'Outra',
      description: 'Outra categoria em outro orçamento',
      type: 'EXPENSE',
      kind: 'PRESET',
      color: '#0000FF',
      icon: 'category',
      active: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      order: 2,
    },
  ];

  beforeEach(() => {
    categoriesApiService = {
      listCategories: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };

    budgetSelectionService = {
      selectedBudgetId: vi.fn(() => budgetId),
    };

    TestBed.configureTestingModule({
      providers: [
        CategoryState,
        { provide: CategoriesApiService, useValue: categoriesApiService },
        { provide: BudgetSelectionService, useValue: budgetSelectionService },
        provideZonelessChangeDetection(),
      ],
    });

    state = TestBed.inject(CategoryState);
  });

  it('should be created', () => {
    expect(state).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty categories', () => {
      expect(state.categories()).toEqual([]);
      expect(state.hasCategories()).toBe(false);
      expect(state.categoriesCount()).toBe(0);
    });

    it('should initialize with loading false and error null', () => {
      expect(state.loading()).toBe(false);
      expect(state.error()).toBeNull();
    });
  });

  describe('loadCategories', () => {
    it('should set error when no budget is selected', () => {
      budgetSelectionService.selectedBudgetId = vi.fn(() => null);

      state.loadCategories();

      expect(state.categories()).toEqual([]);
      expect(state.error()).toBe('Nenhum orçamento selecionado');
      expect(state.loading()).toBe(false);
    });

    it('should load categories for selected budget', async () => {
      categoriesApiService.listCategories.mockReturnValue(of(mockCategories));

      state.loadCategories();
      
      await firstValueFrom(of(true));

      expect(categoriesApiService.listCategories).toHaveBeenCalledWith(budgetId);
      expect(state.categories()).toEqual(mockCategories);
      expect(state.loading()).toBe(false);
      expect(state.error()).toBeNull();
    });

    it('should not call api again while loading when force is false', () => {
      state['\u005Floading'].set(true);

      state.loadCategories();

      expect(categoriesApiService.listCategories).not.toHaveBeenCalled();
    });

    it('should call api when force is true even if loading', () => {
      state['\u005Floading'].set(true);
      categoriesApiService.listCategories.mockReturnValue(of(mockCategories));

      state.loadCategories(true);

      expect(categoriesApiService.listCategories).toHaveBeenCalledWith(budgetId);
    });

    it('should handle api error', async () => {
      const apiError: ApiError = {
        message: 'Failed to load categories',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      categoriesApiService.listCategories.mockReturnValue(throwError(() => apiError));

      state.loadCategories();

      await firstValueFrom(of(true));

      expect(state.categories()).toEqual([]);
      expect(state.error()).toBe('Failed to load categories');
      expect(state.loading()).toBe(false);
    });
  });

  describe('Computed properties', () => {
    beforeEach(() => {
      state['\u005Fcategories'].set(mockCategories);
    });

    it('should filter categories by selected budget id', () => {
      const byBudget = state.categoriesByBudgetId();

      expect(byBudget).toHaveLength(2);
      expect(byBudget.every((c) => c.budgetId === budgetId)).toBe(true);
    });

    it('should expose preset categories for selected budget', () => {
      const presets = state.presetCategories();

      expect(presets).toHaveLength(1);
      expect(presets[0].kind).toBe('PRESET');
      expect(presets[0].budgetId).toBe(budgetId);
    });

    it('should expose custom categories for selected budget', () => {
      const custom = state.customCategories();

      expect(custom).toHaveLength(1);
      expect(custom[0].kind).toBe('CUSTOM');
      expect(custom[0].budgetId).toBe(budgetId);
    });

    it('should expose active categories for selected budget', () => {
      const active = state.activeCategories();

      expect(active).toHaveLength(1);
      expect(active[0].active).toBe(true);
      expect(active[0].budgetId).toBe(budgetId);
    });

    it('should expose inactive categories for selected budget', () => {
      const inactive = state.inactiveCategories();

      expect(inactive).toHaveLength(1);
      expect(inactive[0].active).toBe(false);
      expect(inactive[0].budgetId).toBe(budgetId);
    });

    it('should expose categories map for quick lookup', () => {
      const map = state.categoriesMap();

      expect(map.size).toBe(2);
      expect(map.get('category-1')).toBeDefined();
      expect(map.get('category-1')?.name).toBe('Alimentação');
      expect(map.get('category-2')).toBeDefined();
      expect(map.get('category-2')?.name).toBe('Salário');
    });

    it('should group categories by type', () => {
      const byType = state.categoriesByType();

      expect(byType.EXPENSE).toHaveLength(1);
      expect(byType.EXPENSE[0].type).toBe('EXPENSE');
      expect(byType.INCOME).toHaveLength(1);
      expect(byType.INCOME[0].type).toBe('INCOME');
      expect(byType.TRANSFER).toHaveLength(0);
    });

    it('should get category by id', () => {
      const category = state.getCategoryById('category-1');

      expect(category).toBeDefined();
      expect(category?.name).toBe('Alimentação');
      expect(category?.type).toBe('EXPENSE');
    });

    it('should return undefined for non-existent category id', () => {
      const category = state.getCategoryById('non-existent');

      expect(category).toBeUndefined();
    });

    it('should get categories formatted for widgets', () => {
      const widgets = state.getCategoriesForWidgets();

      expect(widgets).toHaveLength(1);
      expect(widgets[0]).toEqual({
        id: 'category-1',
        name: 'Alimentação',
        type: 'EXPENSE',
        color: '#FF0000',
        icon: 'restaurant',
        active: true,
      });
    });
  });

  describe('createCategory', () => {
    const createDto: CreateCategoryRequestDto = {
      userId: 'user-123',
      budgetId,
      name: 'Nova Categoria',
      type: 'EXPENSE',
      kind: 'CUSTOM',
      description: 'Categoria customizada',
      color: '#0000FF',
      icon: 'category',
      order: 2,
    };

    it('should reload categories when create succeeds', async () => {
      categoriesApiService.createCategory.mockReturnValue(of('category-new'));
      categoriesApiService.listCategories.mockReturnValue(of(mockCategories));

      state.createCategory(createDto);

      await firstValueFrom(of(true));

      expect(categoriesApiService.createCategory).toHaveBeenCalledWith(createDto);
      expect(categoriesApiService.listCategories).toHaveBeenCalledWith(budgetId);
      expect(state.loading()).toBe(false);
      expect(state.error()).toBeNull();
    });

    it('should set error when create fails', async () => {
      categoriesApiService.createCategory.mockReturnValue(of(null));

      state.createCategory(createDto);

      await firstValueFrom(of(true));

      expect(state.error()).toBe('Falha ao criar categoria');
      expect(state.loading()).toBe(false);
    });

    it('should handle api error on create', async () => {
      const apiError: ApiError = {
        message: 'Failed to create category',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      categoriesApiService.createCategory.mockReturnValue(throwError(() => apiError));

      state.createCategory(createDto);

      await firstValueFrom(of(true));

      expect(state.error()).toBe('Failed to create category');
      expect(state.loading()).toBe(false);
    });
  });

  describe('updateCategory', () => {
    const updateDto: UpdateCategoryRequestDto = {
      id: 'category-1',
      userId: 'user-123',
      name: 'Alimentação Atualizada',
      type: 'EXPENSE',
      kind: 'CUSTOM',
      description: 'Descrição atualizada',
      color: '#FF00FF',
      icon: 'edit',
      active: true,
      order: 1,
    };

    it('should reload categories when update succeeds', async () => {
      categoriesApiService.updateCategory.mockReturnValue(of(true));
      categoriesApiService.listCategories.mockReturnValue(of(mockCategories));

      state.updateCategory(updateDto);

      await firstValueFrom(of(true));

      expect(categoriesApiService.updateCategory).toHaveBeenCalledWith(updateDto);
      expect(categoriesApiService.listCategories).toHaveBeenCalledWith(budgetId);
      expect(state.loading()).toBe(false);
      expect(state.error()).toBeNull();
    });

    it('should set error when update fails', async () => {
      categoriesApiService.updateCategory.mockReturnValue(of(false));

      state.updateCategory(updateDto);

      await firstValueFrom(of(true));

      expect(state.error()).toBe('Falha ao atualizar categoria');
      expect(state.loading()).toBe(false);
    });

    it('should handle api error on update', async () => {
      const apiError: ApiError = {
        message: 'Failed to update category',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      categoriesApiService.updateCategory.mockReturnValue(throwError(() => apiError));

      state.updateCategory(updateDto);

      await firstValueFrom(of(true));

      expect(state.error()).toBe('Failed to update category');
      expect(state.loading()).toBe(false);
    });
  });

  describe('deleteCategory', () => {
    const deleteDto: DeleteCategoryRequestDto = {
      userId: 'user-123',
      categoryId: 'category-1',
    };

    it('should reload categories when delete succeeds', async () => {
      categoriesApiService.deleteCategory.mockReturnValue(of(true));
      categoriesApiService.listCategories.mockReturnValue(of(mockCategories));

      state.deleteCategory(deleteDto);

      await firstValueFrom(of(true));

      expect(categoriesApiService.deleteCategory).toHaveBeenCalledWith(deleteDto);
      expect(categoriesApiService.listCategories).toHaveBeenCalledWith(budgetId);
      expect(state.loading()).toBe(false);
      expect(state.error()).toBeNull();
    });

    it('should set error when delete fails', async () => {
      categoriesApiService.deleteCategory.mockReturnValue(of(false));

      state.deleteCategory(deleteDto);

      await firstValueFrom(of(true));

      expect(state.error()).toBe('Falha ao excluir categoria');
      expect(state.loading()).toBe(false);
    });

    it('should handle api error on delete', async () => {
      const apiError: ApiError = {
        message: 'Failed to delete category',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      categoriesApiService.deleteCategory.mockReturnValue(throwError(() => apiError));

      state.deleteCategory(deleteDto);

      await firstValueFrom(of(true));

      expect(state.error()).toBe('Failed to delete category');
      expect(state.loading()).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      state['\u005Ferror'].set('some error');
      state.clearError();
      expect(state.error()).toBeNull();
    });
  });
});
