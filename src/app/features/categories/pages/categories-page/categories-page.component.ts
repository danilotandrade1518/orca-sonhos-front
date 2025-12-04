import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryState } from '../../../../core/services/category/category.state';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { OsPageComponent } from '../../../../shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  type PageHeaderAction,
} from '../../../../shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsAlertComponent } from '../../../../shared/ui-components/molecules/os-alert/os-alert.component';
import { OsCategoryManagerComponent } from '../../../../shared/ui-components/organisms/os-category-manager/os-category-manager.component';
import type { CategoryDto } from '../../../../../dtos/category';
import type {
  Category,
  CategoryFormData,
} from '../../../../shared/ui-components/organisms/os-category-manager/os-category-manager.component';

@Component({
  selector: 'os-categories-page',
  standalone: true,
  imports: [
    CommonModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsAlertComponent,
    OsCategoryManagerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Página de categorias">
      <os-page-header
        title="Categorias"
        subtitle="Organize como suas transações são agrupadas"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
      />

      @if (currentState() === 'error') {
      <os-alert
        type="error"
        [title]="'Erro ao carregar categorias'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ errorMessage() }}
      </os-alert>
      } @if (!selectedBudgetId()) {
      <os-alert
        type="info"
        [title]="'Nenhum orçamento selecionado'"
        [role]="'status'"
        [ariaLive]="'polite'"
        [showIcon]="true"
        [dismissible]="false"
      >
        Selecione um orçamento para gerenciar categorias.
      </os-alert>
      } @else {
      <os-category-manager
        [categories]="uiCategories()"
        [loading]="isLoading()"
        (categoryAdded)="onCategoryAdded($event)"
        (categoryUpdated)="onCategoryUpdated($event)"
        (categoryDeleted)="onCategoryDeleted($event)"
      />
      }
    </os-page>
  `,
})
export class CategoriesPage {
  private readonly state = inject(CategoryState);
  private readonly budgetSelection = inject(BudgetSelectionService);

  private readonly categoryManager = viewChild(OsCategoryManagerComponent);

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;

  readonly categories = computed(() => this.state.categoriesByBudgetId());

  readonly isLoading = computed(() => this.state.loading());

  readonly currentState = computed(() => {
    if (this.state.loading()) return 'loading';
    if (this.state.error()) return 'error';
    if (!this.selectedBudgetId()) return 'empty';
    return 'success';
  });

  readonly errorMessage = computed(() => this.state.error() || 'Erro ao carregar categorias');

  readonly uiCategories = computed<Category[]>(() =>
    this.categories().map((category) => this.mapToUiCategory(category))
  );

  readonly pageHeaderActions = computed<PageHeaderAction[]>(() => [
    {
      label: 'Nova Categoria',
      icon: 'plus',
      variant: 'primary',
      size: 'medium',
      disabled: !this.selectedBudgetId(),
    },
  ]);

  constructor() {
    effect(() => {
      const budgetId = this.selectedBudgetId();

      if (!budgetId) {
        return;
      }

      untracked(() => {
        
        if (this.state.loading()) {
          return;
        }
        this.state.loadCategories();
      });
    });
  }

  onPageHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Nova Categoria') {
      const manager = this.categoryManager();
      if (manager) {
        manager.onAddCategory();
      }
    }
  }

  onCategoryAdded(data: CategoryFormData): void {
    const budgetId = this.selectedBudgetId();
    if (!budgetId) return;

    this.state.createCategory({
      userId: '',
      budgetId,
      name: data.name,
      description: data.description,
      type: this.mapUiTypeToDtoType(data.type),
      kind: 'CUSTOM',
      color: data.color,
      icon: data.icon,
    });
  }

  onCategoryUpdated(payload: { id: string; data: CategoryFormData }): void {
    this.state.updateCategory({
      id: payload.id,
      userId: '',
      name: payload.data.name,
      description: payload.data.description,
      type: this.mapUiTypeToDtoType(payload.data.type),
      color: payload.data.color,
      icon: payload.data.icon,
    });
  }

  onCategoryDeleted(categoryId: string): void {
    this.state.deleteCategory({
      userId: '',
      categoryId,
    });
  }

  private mapToUiCategory(dto: CategoryDto): Category {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      type: this.mapDtoTypeToUiType(dto.type),
      color: dto.color,
      icon: dto.icon,
      active: dto.active,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      order: dto.order,
    };
  }

  private mapDtoTypeToUiType(type: CategoryDto['type']): Category['type'] {
    switch (type) {
      case 'INCOME':
        return 'income';
      case 'TRANSFER':
        return 'transfer';
      case 'EXPENSE':
      default:
        return 'expense';
    }
  }

  private mapUiTypeToDtoType(type: CategoryFormData['type']): CategoryDto['type'] {
    switch (type) {
      case 'income':
        return 'INCOME';
      case 'transfer':
        return 'TRANSFER';
      case 'expense':
      default:
        return 'EXPENSE';
    }
  }
}
