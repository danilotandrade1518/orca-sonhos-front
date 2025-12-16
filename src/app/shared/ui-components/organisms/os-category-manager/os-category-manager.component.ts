import {
  Component,
  computed,
  input,
  output,
  signal,
  inject,
  ElementRef,
  AfterViewInit,
  effect,
} from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsInputComponent } from '../../atoms/os-input/os-input.component';
import { OsSelectComponent } from '../../atoms/os-select/os-select.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';
import { OsLabelComponent } from '../../atoms/os-label/os-label.component';
import { OsFormGroupComponent } from '../../molecules/os-form-group/os-form-group.component';
import { OsFormFieldComponent } from '../../molecules/os-form-field/os-form-field.component';
import { LocaleService } from '../../../formatting';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogService } from '@core/services/confirm-dialog';

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
  order?: number;
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
    ReactiveFormsModule,
    FormsModule,
    CdkDrag,
    CdkDropList,
    OsButtonComponent,
    OsInputComponent,
    OsSelectComponent,
    OsIconComponent,
    OsBadgeComponent,
    OsLabelComponent,
    OsFormGroupComponent,
    OsFormFieldComponent
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
            aria-label="Adicionar nova categoria"
          >
            <os-icon name="plus" size="sm" [attr.aria-hidden]="'true'" />
            Adicionar Categoria
          </os-button>
        </div>
      </div>

      <div class="os-category-manager__content">
        @if (showForm()) {
        <div class="os-category-manager__form" [formGroup]="categoryForm">
          <os-form-group variant="default" size="medium">
            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium" [required]="true">
                Nome da Categoria
              </os-label>
              <os-input formControlName="name"
                variant="default"
                size="medium"
                placeholder="Digite o nome da categoria"
                [required]="true"
               />
              @if (categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched) {
              <div class="os-category-manager__error">
                @if (categoryForm.get('name')?.errors?.['required']) {
                <span>Nome é obrigatório</span>
                } @if (categoryForm.get('name')?.errors?.['minlength']) {
                <span>Nome deve ter pelo menos 2 caracteres</span>
                } @if (categoryForm.get('name')?.errors?.['uniqueName']) {
                <span>Já existe uma categoria com este nome</span>
                }
              </div>
              }
            </os-form-field>

            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium"> Descrição </os-label>
              <os-input formControlName="description"
                variant="default"
                size="medium"
                placeholder="Descrição opcional da categoria"
               />
            </os-form-field>

            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium" [required]="true"> Tipo </os-label>
              <os-select formControlName="type"
                variant="default"
                size="medium"
                [options]="categoryTypeOptions"
                [required]="true"
               />
            </os-form-field>

            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium"> Cor </os-label>
              <div class="os-category-manager__color-picker">
                <div
                  class="os-category-manager__color-preview"
                  [style.background-color]="selectedColor()"
                  (click)="onToggleColorPicker()"
                  (keydown.enter)="onToggleColorPicker()"
                  (keydown.space)="onToggleColorPicker()"
                  [attr.aria-label]="'Cor selecionada: ' + selectedColor()"
                  role="button"
                  tabindex="0"
                ></div>
                <os-input formControlName="color"
                  variant="default"
                  size="medium"
                  type="text"
                  placeholder="#3B82F6"
                 />
                <os-button
                  variant="tertiary"
                  size="small"
                  (click)="onToggleColorPicker()"
                  [disabled]="loading()"
                  [attr.aria-label]="'Abrir seletor de cores'"
                >
                  <os-icon name="palette" size="sm" />
                </os-button>
              </div>

              @if (showColorPicker()) {
              <div
                class="os-category-manager__color-palette"
                role="listbox"
                aria-label="Paleta de cores"
              >
                @for (color of colorPalette; track trackByColor($index, color)) {
                <div
                  class="os-category-manager__color-option"
                  [style.background-color]="color"
                  [class.selected]="selectedColor() === color"
                  (click)="onColorSelect(color)"
                  (keydown.enter)="onColorSelect(color)"
                  (keydown.space)="onColorSelect(color)"
                  [attr.aria-label]="'Selecionar cor ' + color"
                  [attr.aria-selected]="selectedColor() === color"
                  role="option"
                  tabindex="0"
                ></div>
                }
              </div>
              }
            </os-form-field>

            <os-form-field variant="default" size="medium">
              <os-label variant="default" size="medium"> Ícone </os-label>
              <div class="os-category-manager__icon-picker">
                <div class="os-category-manager__icon-preview">
                  <os-icon [name]="selectedIcon()" size="md" />
                </div>
                <os-input formControlName="icon"
                  variant="default"
                  size="medium"
                  placeholder="Nome do ícone"
                 />
                <os-button
                  variant="tertiary"
                  size="small"
                  (click)="onToggleIconPicker()"
                  [disabled]="loading()"
                  [attr.aria-label]="'Abrir seletor de ícones'"
                >
                  <os-icon name="search" size="sm" />
                </os-button>
              </div>

              @if (showIconPicker()) {
              <div
                class="os-category-manager__icon-grid"
                role="listbox"
                aria-label="Seletor de ícones"
              >
                @for (icon of iconOptions; track trackByIcon($index, icon)) {
                <div
                  class="os-category-manager__icon-option"
                  [class.selected]="selectedIcon() === icon"
                  (click)="onIconSelect(icon)"
                  (keydown.enter)="onIconSelect(icon)"
                  (keydown.space)="onIconSelect(icon)"
                  [attr.aria-label]="'Selecionar ícone ' + icon"
                  [attr.aria-selected]="selectedIcon() === icon"
                  role="option"
                  tabindex="0"
                >
                  <os-icon [name]="icon" size="md" />
                </div>
                }
              </div>
              }
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
        }

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
                [attr.aria-label]="showFilter() ? 'Ocultar filtros de categorias' : 'Mostrar filtros de categorias'"
                [attr.aria-expanded]="showFilter()"
              >
                <os-icon name="filter" size="sm" [attr.aria-hidden]="'true'" />
                {{ showFilter() ? 'Ocultar Filtros' : 'Mostrar Filtros' }}
              </os-button>
            </div>
          </div>

          @if (showFilter()) {
          <div class="os-category-manager__filters" role="search" aria-label="Filtros de categorias">
            <os-form-group variant="default" size="small">
              <os-form-field variant="default" size="small">
                <os-label variant="default" size="small"> Buscar </os-label>
                <os-input [(ngModel)]="searchTerm"
                  variant="default"
                  size="small"
                  placeholder="Buscar por nome ou descrição"
                  [disabled]="loading()"
                 />
              </os-form-field>

              <os-form-field variant="default" size="small">
                <os-label variant="default" size="small"> Tipo </os-label>
                <os-select [(ngModel)]="filterType"
                  variant="default"
                  size="small"
                  [options]="filterTypeOptions"
                  [disabled]="loading()"
                 />
              </os-form-field>

              <os-form-field variant="default" size="small">
                <os-label variant="default" size="small"> Status </os-label>
                <os-select [(ngModel)]="filterStatus"
                  variant="default"
                  size="small"
                  [options]="filterStatusOptions"
                  [disabled]="loading()"
                 />
              </os-form-field>
            </os-form-group>
          </div>
          }

          <!-- Lista -->
          <div
            class="os-category-manager__items"
            cdkDropList
            [cdkDropListDisabled]="!dragEnabled()"
            (cdkDropListDropped)="onDragDrop($event)"
            [attr.aria-label]="'Lista de categorias arrastáveis'"
            role="list"
          >
            @for (category of filteredCategories(); track trackByCategoryId($index, category)) {
            <div
              class="os-category-manager__item"
              [class]="getCategoryItemClasses(category)"
              [style]="getCategoryStyle(category)"
              cdkDrag
              [cdkDragDisabled]="!dragEnabled()"
              [attr.aria-label]="'Categoria ' + category.name + ', arrastar para reordenar'"
              role="listitem"
            >
              <div class="os-category-manager__item-content">
                @if (category.icon) {
                <div class="os-category-manager__item-icon">
                  <os-icon [name]="category.icon" size="md" />
                </div>
                }
                <div class="os-category-manager__item-info">
                  <h4 class="os-category-manager__item-name">{{ category.name }}</h4>
                  @if (category.description) {
                  <p class="os-category-manager__item-description">
                    {{ category.description }}
                  </p>
                  }
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
                  [attr.aria-label]="'Editar categoria ' + category.name"
                >
                  <os-icon name="edit" size="sm" [attr.aria-hidden]="'true'" />
                </os-button>
                <os-button
                  variant="danger"
                  size="small"
                  (click)="onDeleteCategory(category)"
                  [disabled]="loading()"
                  [attr.aria-label]="'Excluir categoria ' + category.name"
                >
                  <os-icon name="trash" size="sm" [attr.aria-hidden]="'true'" />
                </os-button>
              </div>
            </div>
            } @if (filteredCategories().length === 0) {
            <div class="os-category-manager__empty">
              <os-icon name="folder-open" size="lg" />
              <h3>Nenhuma categoria encontrada</h3>
              @if (searchTerm || filterType || filterStatus) {
              <p>Tente ajustar os filtros para encontrar mais categorias.</p>
              } @if (!searchTerm && !filterType && !filterStatus) {
              <p>Comece criando sua primeira categoria.</p>
              }
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./os-category-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsCategoryManagerComponent implements AfterViewInit {
  private readonly localeService = inject(LocaleService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  title = input<string>('Gerenciador de Categorias');
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  theme = input<'light' | 'dark'>('light');
  categories = input<Category[]>([]);
  loading = input<boolean>(false);
  disabled = input<boolean>(false);

  categoryAdded = output<CategoryFormData>();
  categoryUpdated = output<{ id: string; data: CategoryFormData }>();
  categoryDeleted = output<string>();
  categorySelected = output<Category>();

  showFormSignal = signal<boolean>(false);
  editingCategorySignal = signal<Category | null>(null);
  showFilterSignal = signal<boolean>(false);
  searchTermSignal = signal<string>('');
  filterTypeSignal = signal<string>('');
  filterStatusSignal = signal<string>('');

  categoryForm: FormGroup;

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

  private fb = inject(FormBuilder);
  private breakpointObserver = inject(BreakpointObserver);
  private elementRef = inject(ElementRef);

  isMobile = signal<boolean>(false);
  showColorPicker = signal<boolean>(false);
  showIconPicker = signal<boolean>(false);
  selectedColor = signal<string>('#3B82F6');
  selectedIcon = signal<string>('folder');
  dragEnabled = signal<boolean>(true);

  colorPalette = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#EC4899',
    '#6B7280',
    '#1F2937',
    '#374151',
    '#4B5563',
    '#9CA3AF',
    '#D1D5DB',
  ];

  iconOptions = [
    'folder',
    'home',
    'shopping-cart',
    'car',
    'utensils',
    'heart',
    'star',
    'gift',
    'credit-card',
    'piggy-bank',
    'chart-line',
    'wallet',
    'coins',
    'receipt',
    'calculator',
  ];

  constructor() {
    this.categoryForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          this.uniqueNameValidator.bind(this),
        ],
      ],
      description: [''],
      type: ['expense', [Validators.required]],
      color: ['#3B82F6'],
      icon: ['folder'],
      active: [true],
    });

    effect(() => {
      const isLoading = this.loading();
      if (isLoading) {
        this.categoryForm.disable();
      } else {
        this.categoryForm.enable();
      }
    });

    effect(() => {
      const nameControl = this.categoryForm.get('name');
      if (nameControl) {
        nameControl.updateValueAndValidity();
      }
    });
  }

  uniqueNameValidator(control: { value: string }): Record<string, boolean> | null {
    if (!control.value) {
      return null;
    }

    const editingCategory = this.editingCategory();
    const categories = this.categories();
    const nameLower = control.value.toLowerCase().trim();

    const duplicate = categories.find(
      (cat) =>
        cat.name.toLowerCase().trim() === nameLower &&
        (!editingCategory || cat.id !== editingCategory.id)
    );

    return duplicate ? { uniqueName: true } : null;
  }

  ngAfterViewInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile.set(result.matches);
      this.dragEnabled.set(!result.matches);
    });
  }

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

    const searchTerm = this.searchTermSignal().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm) ||
          (category.description && category.description.toLowerCase().includes(searchTerm))
      );
    }

    const filterType = this.filterTypeSignal();
    if (filterType) {
      filtered = filtered.filter((category) => category.type === filterType);
    }

    const filterStatus = this.filterStatusSignal();
    if (filterStatus) {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter((category) => category.active === isActive);
    }

    return filtered;
  });

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

  async onDeleteCategory(category: Category): Promise<void> {
    const confirmed = await this.confirmDialogService.open({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a categoria "${category.name}"? Esta ação não pode ser desfeita.`,
      variant: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (confirmed) {
      this.categoryDeleted.emit(category.id);
    }
  }

  onToggleFilter(): void {
    this.showFilterSignal.set(!this.showFilterSignal());
  }

  onSelectCategory(category: Category): void {
    this.categorySelected.emit(category);
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
    return this.localeService.formatDateShort(date);
  }

  onDragDrop(event: CdkDragDrop<Category[]>): void {
    if (event.previousContainer === event.container) {
      const categories = [...this.categories()];
      moveItemInArray(categories, event.previousIndex, event.currentIndex);

      categories.forEach((category, index) => {
        category.order = index;
      });

      this.categoryReordered.emit(categories);
    }
  }

  onColorSelect(color: string): void {
    this.selectedColor.set(color);
    this.categoryForm.patchValue({ color });
    this.showColorPicker.set(false);
  }

  onIconSelect(icon: string): void {
    this.selectedIcon.set(icon);
    this.categoryForm.patchValue({ icon });
    this.showIconPicker.set(false);
  }

  onToggleColorPicker(): void {
    this.showColorPicker.set(!this.showColorPicker());
    this.showIconPicker.set(false);
  }

  onToggleIconPicker(): void {
    this.showIconPicker.set(!this.showIconPicker());
    this.showColorPicker.set(false);
  }

  onClosePickers(): void {
    this.showColorPicker.set(false);
    this.showIconPicker.set(false);
  }

  getCategoryStyle(category: Category): Record<string, string> {
    return {
      'border-left-color': category.color || '#3B82F6',
      'border-left-width': '4px',
      'border-left-style': 'solid',
    };
  }

  categoryReordered = output<Category[]>();

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }

  trackByColor(index: number, color: string): string {
    return color;
  }

  trackByIcon(index: number, icon: string): string {
    return icon;
  }
}
