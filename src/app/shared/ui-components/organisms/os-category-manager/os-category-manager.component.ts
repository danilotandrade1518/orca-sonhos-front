import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsInputComponent } from '../../atoms/os-input/os-input.component';
import { OsSelectComponent } from '../../atoms/os-select/os-select.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';
import { OsLabelComponent } from '../../atoms/os-label/os-label.component';
import { OsFormGroupComponent } from '../../molecules/os-form-group/os-form-group.component';
import { OsFormFieldComponent } from '../../molecules/os-form-field/os-form-field.component';
import { FormsModule } from '@angular/forms';

export interface Category {
  id: string;
  name: string;
  description?: string;
  type: 'income' | 'expense' | 'transfer';
  color?: string;
  icon?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  type: 'income' | 'expense' | 'transfer';
  color?: string;
  icon?: string;
  active: boolean;
}

@Component({
  selector: 'os-category-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OsButtonComponent,
    OsInputComponent,
    OsSelectComponent,
    OsIconComponent,
    OsBadgeComponent,
    OsLabelComponent,
    OsFormGroupComponent,
    OsFormFieldComponent,
  ],
  template: `
    <div
      class="os-category-manager"
      [class]="categoryManagerClasses()"
      [attr.aria-label]="ariaLabel()"
    >
      <div class="os-category-manager__header">
        <h2 class="os-category-manager__title">{{ title() }}</h2>
        <div class="os-category-manager__actions">
          <os-button
            variant="primary"
            size="small"
            (click)="onAddCategory()"
            [disabled]="loading()"
            [loading]="loading()"
          >
            <os-icon name="plus" size="sm"></os-icon>
            Adicionar Categoria
          </os-button>
        </div>
      </div>

      <div class="os-category-manager__content">
        <!-- Formulário de Categoria -->
        <div class="os-category-manager__form" *ngIf="showForm()" [formGroup]="categoryForm">
          <os-form-group variant="default" size="medium">
            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium" [required]="true">
                Nome da Categoria
              </os-label>
              <os-input
                formControlName="name"
                variant="default"
                size="medium"
                placeholder="Digite o nome da categoria"
                [required]="true"
                [disabled]="loading()"
              ></os-input>
              <div
                class="os-category-manager__error"
                *ngIf="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched"
              >
                <span *ngIf="categoryForm.get('name')?.errors?.['required']"
                  >Nome é obrigatório</span
                >
                <span *ngIf="categoryForm.get('name')?.errors?.['minlength']"
                  >Nome deve ter pelo menos 2 caracteres</span
                >
              </div>
            </os-form-field>

            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium"> Descrição </os-label>
              <os-input
                formControlName="description"
                variant="default"
                size="medium"
                placeholder="Descrição opcional da categoria"
                [disabled]="loading()"
              ></os-input>
            </os-form-field>

            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium" [required]="true"> Tipo </os-label>
              <os-select
                formControlName="type"
                variant="default"
                size="medium"
                [options]="categoryTypeOptions"
                [required]="true"
                [disabled]="loading()"
              ></os-select>
            </os-form-field>

            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium"> Cor </os-label>
              <os-input
                formControlName="color"
                variant="default"
                size="medium"
                type="text"
                [disabled]="loading()"
              ></os-input>
            </os-form-field>

            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium"> Ícone </os-label>
              <os-input
                formControlName="icon"
                variant="default"
                size="medium"
                placeholder="Nome do ícone Font Awesome"
                [disabled]="loading()"
              ></os-input>
            </os-form-field>

            <div class="os-category-manager__form-actions">
              <os-button
                variant="secondary"
                size="medium"
                (click)="onCancelEdit()"
                [disabled]="loading()"
              >
                Cancelar
              </os-button>
              <os-button
                variant="primary"
                size="medium"
                (click)="onSaveCategory()"
                [disabled]="categoryForm.invalid || loading()"
                [loading]="loading()"
              >
                {{ editingCategory() ? 'Atualizar' : 'Criar' }}
              </os-button>
            </div>
          </os-form-group>
        </div>

        <!-- Lista de Categorias -->
        <div class="os-category-manager__list">
          <div class="os-category-manager__list-header">
            <h3 class="os-category-manager__list-title">
              Categorias ({{ filteredCategories().length }})
            </h3>
            <div class="os-category-manager__list-actions">
              <os-button
                variant="tertiary"
                size="small"
                (click)="onToggleFilter()"
                [disabled]="loading()"
              >
                <os-icon name="filter" size="sm"></os-icon>
                {{ showFilter() ? 'Ocultar Filtros' : 'Mostrar Filtros' }}
              </os-button>
            </div>
          </div>

          <!-- Filtros -->
          <div class="os-category-manager__filters" *ngIf="showFilter()">
            <os-form-group variant="default" size="small">
              <os-form-field variant="default" size="small">
                <os-label variant="default" size="small"> Buscar </os-label>
                <os-input
                  [(ngModel)]="searchTerm"
                  variant="default"
                  size="small"
                  placeholder="Buscar por nome ou descrição"
                  [disabled]="loading()"
                ></os-input>
              </os-form-field>

              <os-form-field variant="default" size="small">
                <os-label variant="default" size="small"> Tipo </os-label>
                <os-select
                  [(ngModel)]="filterType"
                  variant="default"
                  size="small"
                  [options]="filterTypeOptions"
                  [disabled]="loading()"
                ></os-select>
              </os-form-field>

              <os-form-field variant="default" size="small">
                <os-label variant="default" size="small"> Status </os-label>
                <os-select
                  [(ngModel)]="filterStatus"
                  variant="default"
                  size="small"
                  [options]="filterStatusOptions"
                  [disabled]="loading()"
                ></os-select>
              </os-form-field>
            </os-form-group>
          </div>

          <!-- Lista -->
          <div class="os-category-manager__items">
            <div
              class="os-category-manager__item"
              *ngFor="let category of filteredCategories(); trackBy: trackByCategoryId"
              [class]="getCategoryItemClasses(category)"
            >
              <div class="os-category-manager__item-content">
                <div class="os-category-manager__item-icon" *ngIf="category.icon">
                  <os-icon [name]="category.icon" size="md"></os-icon>
                </div>
                <div class="os-category-manager__item-info">
                  <h4 class="os-category-manager__item-name">{{ category.name }}</h4>
                  <p class="os-category-manager__item-description" *ngIf="category.description">
                    {{ category.description }}
                  </p>
                  <div class="os-category-manager__item-meta">
                    <os-badge [variant]="getCategoryTypeVariant(category.type)" size="sm">
                      {{ getCategoryTypeLabel(category.type) }}
                    </os-badge>
                    <span class="os-category-manager__item-date">
                      {{ formatDate(category.updatedAt) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="os-category-manager__item-actions">
                <os-button
                  variant="tertiary"
                  size="small"
                  (click)="onEditCategory(category)"
                  [disabled]="loading()"
                >
                  <os-icon name="edit" size="sm"></os-icon>
                </os-button>
                <os-button
                  variant="danger"
                  size="small"
                  (click)="onDeleteCategory(category)"
                  [disabled]="loading()"
                >
                  <os-icon name="trash" size="sm"></os-icon>
                </os-button>
              </div>
            </div>

            <!-- Estado Vazio -->
            <div class="os-category-manager__empty" *ngIf="filteredCategories().length === 0">
              <os-icon name="folder-open" size="lg"></os-icon>
              <h3>Nenhuma categoria encontrada</h3>
              <p *ngIf="searchTerm || filterType || filterStatus">
                Tente ajustar os filtros para encontrar mais categorias.
              </p>
              <p *ngIf="!searchTerm && !filterType && !filterStatus">
                Comece criando sua primeira categoria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./os-category-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsCategoryManagerComponent {
  // Inputs
  title = input<string>('Gerenciador de Categorias');
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  theme = input<'light' | 'dark'>('light');
  categories = input<Category[]>([]);
  loading = input<boolean>(false);
  disabled = input<boolean>(false);

  // Outputs
  categoryAdded = output<CategoryFormData>();
  categoryUpdated = output<{ id: string; data: CategoryFormData }>();
  categoryDeleted = output<string>();
  categorySelected = output<Category>();

  // Signals
  showFormSignal = signal<boolean>(false);
  editingCategorySignal = signal<Category | null>(null);
  showFilterSignal = signal<boolean>(false);
  searchTermSignal = signal<string>('');
  filterTypeSignal = signal<string>('');
  filterStatusSignal = signal<string>('');

  // Form
  categoryForm: FormGroup;

  // Options
  categoryTypeOptions = [
    { value: 'income', label: 'Receita' },
    { value: 'expense', label: 'Despesa' },
    { value: 'transfer', label: 'Transferência' },
  ];

  filterTypeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'income', label: 'Receita' },
    { value: 'expense', label: 'Despesa' },
    { value: 'transfer', label: 'Transferência' },
  ];

  filterStatusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'active', label: 'Ativas' },
    { value: 'inactive', label: 'Inativas' },
  ];

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      type: ['expense', [Validators.required]],
      color: ['#3B82F6'],
      icon: [''],
      active: [true],
    });
  }

  // Computed properties
  categoryManagerClasses = computed(() => {
    return [
      'os-category-manager',
      `os-category-manager--${this.variant()}`,
      `os-category-manager--${this.size()}`,
      `os-category-manager--${this.theme()}`,
      this.disabled() ? 'os-category-manager--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  ariaLabel = computed(() => {
    return `Gerenciador de categorias ${this.variant()} ${this.size()}`;
  });

  showForm = computed(() => this.showFormSignal());

  editingCategory = computed(() => this.editingCategorySignal());

  showFilter = computed(() => this.showFilterSignal());

  filteredCategories = computed(() => {
    let filtered = this.categories();

    // Filter by search term
    const searchTerm = this.searchTermSignal().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm) ||
          (category.description && category.description.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by type
    const filterType = this.filterTypeSignal();
    if (filterType) {
      filtered = filtered.filter((category) => category.type === filterType);
    }

    // Filter by status
    const filterStatus = this.filterStatusSignal();
    if (filterStatus) {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter((category) => category.active === isActive);
    }

    return filtered;
  });

  // Getters for template
  get searchTerm(): string {
    return this.searchTermSignal();
  }

  set searchTerm(value: string) {
    this.searchTermSignal.set(value);
  }

  get filterType(): string {
    return this.filterTypeSignal();
  }

  set filterType(value: string) {
    this.filterTypeSignal.set(value);
  }

  get filterStatus(): string {
    return this.filterStatusSignal();
  }

  set filterStatus(value: string) {
    this.filterStatusSignal.set(value);
  }

  // Methods
  onAddCategory(): void {
    this.editingCategorySignal.set(null);
    this.categoryForm.reset({
      name: '',
      description: '',
      type: 'expense',
      color: '#3B82F6',
      icon: '',
      active: true,
    });
    this.showFormSignal.set(true);
  }

  onEditCategory(category: Category): void {
    this.editingCategorySignal.set(category);
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || '',
      type: category.type,
      color: category.color || '#3B82F6',
      icon: category.icon || '',
      active: category.active,
    });
    this.showFormSignal.set(true);
  }

  onSaveCategory(): void {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value as CategoryFormData;

      if (this.editingCategory()) {
        this.categoryUpdated.emit({
          id: this.editingCategory()!.id,
          data: formData,
        });
      } else {
        this.categoryAdded.emit(formData);
      }

      this.onCancelEdit();
    }
  }

  onCancelEdit(): void {
    this.showFormSignal.set(false);
    this.editingCategorySignal.set(null);
    this.categoryForm.reset();
  }

  onDeleteCategory(category: Category): void {
    if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      this.categoryDeleted.emit(category.id);
    }
  }

  onToggleFilter(): void {
    this.showFilterSignal.set(!this.showFilterSignal());
  }

  onSelectCategory(category: Category): void {
    this.categorySelected.emit(category);
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }

  getCategoryItemClasses(category: Category): string {
    return [
      'os-category-manager__item',
      `os-category-manager__item--${category.type}`,
      category.active ? 'os-category-manager__item--active' : 'os-category-manager__item--inactive',
    ]
      .filter(Boolean)
      .join(' ');
  }

  getCategoryTypeVariant(type: string): 'default' | 'success' | 'warning' | 'error' {
    switch (type) {
      case 'income':
        return 'success';
      case 'expense':
        return 'error';
      case 'transfer':
        return 'warning';
      default:
        return 'default';
    }
  }

  getCategoryTypeLabel(type: string): string {
    switch (type) {
      case 'income':
        return 'Receita';
      case 'expense':
        return 'Despesa';
      case 'transfer':
        return 'Transferência';
      default:
        return type;
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  }
}
