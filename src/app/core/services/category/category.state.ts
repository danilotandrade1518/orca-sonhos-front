import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type {
  CategoryDto,
  CreateCategoryRequestDto,
  DeleteCategoryRequestDto,
  UpdateCategoryRequestDto,
} from '../../../../../dtos/category';
import { BudgetSelectionService } from '../budget-selection/budget-selection.service';
import { CategoriesApiService } from './categories-api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryState {
  private readonly categoriesApi = inject(CategoriesApiService);
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _categories = signal<CategoryDto[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasCategories = computed(() => this._categories().length > 0);
  readonly categoriesCount = computed(() => this._categories().length);

  readonly selectedBudgetId = this.budgetSelectionService.selectedBudgetId;

  readonly categoriesByBudgetId = computed(() => {
    const budgetId = this.budgetSelectionService.selectedBudgetId();
    if (!budgetId) {
      return [];
    }

    return this._categories().filter((category) => category.budgetId === budgetId);
  });

  readonly presetCategories = computed(() =>
    this.categoriesByBudgetId().filter((category) => category.kind === 'PRESET')
  );

  readonly customCategories = computed(() =>
    this.categoriesByBudgetId().filter((category) => category.kind === 'CUSTOM')
  );

  readonly activeCategories = computed(() =>
    this.categoriesByBudgetId().filter((category) => category.active)
  );

  readonly inactiveCategories = computed(() =>
    this.categoriesByBudgetId().filter((category) => !category.active)
  );

  loadCategories(force = false): void {
    const budgetId = this.budgetSelectionService.selectedBudgetId();

    if (!budgetId) {
      this._error.set('Nenhum orçamento selecionado');
      this._categories.set([]);
      this._loading.set(false);
      return;
    }

    if (!force && this._loading()) {
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.categoriesApi
      .listCategories(budgetId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this._categories.set(categories);
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao carregar categorias');
          this._loading.set(false);
          this._categories.set([]);
        },
      });
  }

  createCategory(dto: CreateCategoryRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.categoriesApi
      .createCategory(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categoryId) => {
          if (categoryId) {
            this.loadCategories(true);
          } else {
            this._error.set('Falha ao criar categoria');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao criar categoria');
          this._loading.set(false);
        },
      });
  }

  updateCategory(dto: UpdateCategoryRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.categoriesApi
      .updateCategory(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadCategories(true);
          } else {
            this._error.set('Falha ao atualizar categoria');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao atualizar categoria');
          this._loading.set(false);
        },
      });
  }

  deleteCategory(dto: DeleteCategoryRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.categoriesApi
      .deleteCategory(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadCategories(true);
          } else {
            this._error.set('Falha ao excluir categoria');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao excluir categoria');
          this._loading.set(false);
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }
}


