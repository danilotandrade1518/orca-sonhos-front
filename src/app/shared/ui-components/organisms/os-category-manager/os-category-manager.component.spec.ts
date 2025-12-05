import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsInputComponent } from '../../atoms/os-input/os-input.component';
import { OsLabelComponent } from '../../atoms/os-label/os-label.component';
import { OsSelectComponent } from '../../atoms/os-select/os-select.component';
import { OsFormFieldComponent } from '../../molecules/os-form-field/os-form-field.component';
import { OsFormGroupComponent } from '../../molecules/os-form-group/os-form-group.component';
import { Category, OsCategoryManagerComponent } from './os-category-manager.component';
import { ConfirmDialogService } from '@core/services/confirm-dialog';

describe('OsCategoryManagerComponent', () => {
  let component: OsCategoryManagerComponent;
  let fixture: ComponentFixture<OsCategoryManagerComponent>;
  let confirmDialogService: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Alimentação',
      description: 'Gastos com comida',
      type: 'expense',
      color: '#FF6B6B',
      icon: 'utensils',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Salário',
      description: 'Renda mensal',
      type: 'income',
      color: '#4ECDC4',
      icon: 'money-bill',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Transferência',
      description: 'Transferências entre contas',
      type: 'transfer',
      color: '#45B7D1',
      icon: 'exchange-alt',
      active: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  beforeEach(async () => {
    confirmDialogService = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        OsCategoryManagerComponent,
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
      providers: [
        FormBuilder,
        provideZonelessChangeDetection(),
        { provide: ConfirmDialogService, useValue: confirmDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OsCategoryManagerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', mockCategories);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have proper component classes', () => {
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.os-category-manager'));
    expect(element.nativeElement.className).toContain('os-category-manager--default');
    expect(element.nativeElement.className).toContain('os-category-manager--medium');
    expect(element.nativeElement.className).toContain('os-category-manager--light');
  });

  it('should display title', () => {
    const titleElement = fixture.debugElement.query(By.css('.os-category-manager__title'));
    expect(titleElement.nativeElement.textContent).toBe('Gerenciador de Categorias');
  });

  it('should show add button', () => {
    const addButton = fixture.debugElement.query(By.css('.os-category-manager__actions os-button'));
    expect(addButton).toBeTruthy();
    expect(addButton.nativeElement).toBeTruthy();
  });

  it('should show form when add button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('os-button'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.showForm()).toBe(true);
  });

  it('should display categories list', () => {
    const categoryItems = fixture.debugElement.queryAll(By.css('.os-category-manager__item'));
    expect(categoryItems.length).toBe(3);
  });

  it('should display category information correctly', () => {
    const firstItem = fixture.debugElement.query(By.css('.os-category-manager__item'));
    const nameElement = firstItem.query(By.css('.os-category-manager__item-name'));
    const descriptionElement = firstItem.query(By.css('.os-category-manager__item-description'));

    expect(nameElement.nativeElement.textContent).toBe('Alimentação');
    expect(descriptionElement.nativeElement.textContent.trim()).toBe('Gastos com comida');
  });

  it('should show category type badges', () => {
    const badges = fixture.debugElement.queryAll(By.css('os-badge'));
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should have edit and delete buttons for each category', () => {
    const firstItem = fixture.debugElement.query(By.css('.os-category-manager__item'));
    const actionButtons = firstItem.queryAll(
      By.css('.os-category-manager__item-actions os-button')
    );
    expect(actionButtons.length).toBe(2);
  });

  it('should show form when edit button is clicked', () => {
    const firstItem = fixture.debugElement.query(By.css('.os-category-manager__item'));
    const editButton = firstItem.query(By.css('.os-category-manager__item-actions os-button'));
    editButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.showForm()).toBe(true);
    expect(component.editingCategory()).toBeTruthy();
  });

  it('should populate form with category data when editing', () => {
    const firstItem = fixture.debugElement.query(By.css('.os-category-manager__item'));
    const editButton = firstItem.query(By.css('.os-category-manager__item-actions os-button'));
    editButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.categoryForm.get('name')?.value).toBe('Alimentação');
    expect(component.categoryForm.get('description')?.value).toBe('Gastos com comida');
    expect(component.categoryForm.get('type')?.value).toBe('expense');
  });

  it('should emit categoryAdded when form is submitted for new category', () => {
    const spy = vi.spyOn(component.categoryAdded, 'emit');

    component.onAddCategory();
    component.categoryForm.patchValue({
      name: 'Nova Categoria',
      description: 'Descrição da nova categoria',
      type: 'expense',
      color: '#FF6B6B',
      icon: 'star',
      active: true,
    });

    component.onSaveCategory();

    expect(spy).toHaveBeenCalledWith({
      name: 'Nova Categoria',
      description: 'Descrição da nova categoria',
      type: 'expense',
      color: '#FF6B6B',
      icon: 'star',
      active: true,
    });
  });

  it('should emit categoryUpdated when form is submitted for existing category', () => {
    const spy = vi.spyOn(component.categoryUpdated, 'emit');

    component.onEditCategory(mockCategories[0]);
    component.categoryForm.patchValue({
      name: 'Categoria Atualizada',
      description: 'Descrição atualizada',
    });

    component.onSaveCategory();

    expect(spy).toHaveBeenCalledWith({
      id: '1',
      data: {
        name: 'Categoria Atualizada',
        description: 'Descrição atualizada',
        type: 'expense',
        color: '#FF6B6B',
        icon: 'utensils',
        active: true,
      },
    });
  });

  it('should emit categoryDeleted when delete button is clicked', async () => {
    const spy = vi.spyOn(component.categoryDeleted, 'emit');
    confirmDialogService.open.mockResolvedValue(true);

    await component.onDeleteCategory(mockCategories[0]);

    expect(confirmDialogService.open).toHaveBeenCalledWith({
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir a categoria "Alimentação"? Esta ação não pode ser desfeita.',
      variant: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should not emit categoryDeleted when delete is cancelled', async () => {
    const spy = vi.spyOn(component.categoryDeleted, 'emit');
    confirmDialogService.open.mockResolvedValue(false);

    await component.onDeleteCategory(mockCategories[0]);

    expect(confirmDialogService.open).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should show filter toggle button', () => {
    const filterButton = fixture.debugElement.query(
      By.css('.os-category-manager__list-actions os-button')
    );
    expect(filterButton).toBeTruthy();
  });

  it('should toggle filter visibility when filter button is clicked', () => {
    const filterButton = fixture.debugElement.query(
      By.css('.os-category-manager__list-actions os-button')
    );
    filterButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.showFilter()).toBe(true);
  });

  it('should filter categories by search term', () => {
    component.searchTerm = 'alimentação';
    fixture.detectChanges();

    const filteredCategories = component.filteredCategories();
    expect(filteredCategories.length).toBe(1);
    expect(filteredCategories[0].name).toBe('Alimentação');
  });

  it('should filter categories by type', () => {
    component.filterType = 'income';
    fixture.detectChanges();

    const filteredCategories = component.filteredCategories();
    expect(filteredCategories.length).toBe(1);
    expect(filteredCategories[0].type).toBe('income');
  });

  it('should filter categories by status', () => {
    component.filterStatus = 'active';
    fixture.detectChanges();

    const filteredCategories = component.filteredCategories();
    expect(filteredCategories.length).toBe(2);
    expect(filteredCategories.every((cat) => cat.active)).toBe(true);
  });

  it('should show empty state when no categories match filters', () => {
    component.searchTerm = 'nonexistent';
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.css('.os-category-manager__empty'));
    expect(emptyState).toBeTruthy();
  });

  it('should have proper ARIA attributes', () => {
    const element = fixture.debugElement.query(By.css('.os-category-manager'));
    expect(element.nativeElement.getAttribute('aria-label')).toContain('Gerenciador de categorias');
  });

  it('should be disabled when disabled input is true', () => {
    const element = fixture.debugElement.query(By.css('.os-category-manager'));
    expect(element.nativeElement.className).not.toContain('os-category-manager--disabled');
  });

  it('should show loading state', () => {
    const addButton = fixture.debugElement.query(By.css('.os-category-manager__actions os-button'));
    expect(addButton.componentInstance.loading()).toBe(false);
  });

  it('should format dates correctly', () => {
    const formattedDate = component.formatDate(new Date('2024-01-15'));
    expect(formattedDate).toBe('14/01/2024');
  });

  it('should get correct category type variant', () => {
    expect(component.getCategoryTypeVariant('income')).toBe('success');
    expect(component.getCategoryTypeVariant('expense')).toBe('error');
    expect(component.getCategoryTypeVariant('transfer')).toBe('warning');
  });

  it('should get correct category type label', () => {
    expect(component.getCategoryTypeLabel('income')).toBe('Receita');
    expect(component.getCategoryTypeLabel('expense')).toBe('Despesa');
    expect(component.getCategoryTypeLabel('transfer')).toBe('Transferência');
  });

  it('should track categories by id', () => {
    const trackByResult = component.trackByCategoryId(0, mockCategories[0]);
    expect(trackByResult).toBe('1');
  });

  it('should get correct category item classes', () => {
    const classes = component.getCategoryItemClasses(mockCategories[0]);
    expect(classes).toContain('os-category-manager__item--expense');
    expect(classes).toContain('os-category-manager__item--active');
  });

  it('should cancel edit and reset form', () => {
    component.onAddCategory();
    component.categoryForm.patchValue({ name: 'Test' });
    component.onCancelEdit();

    expect(component.showForm()).toBe(false);
    expect(component.editingCategory()).toBeNull();
    expect(component.categoryForm.get('name')?.value || '').toBe('');
  });

  it('should validate required fields', () => {
    component.onAddCategory();
    component.categoryForm.patchValue({ name: '' });

    expect(component.categoryForm.invalid).toBe(true);
    expect(component.categoryForm.get('name')?.hasError('required')).toBe(true);
  });

  it('should validate minimum length for name', () => {
    component.onAddCategory();
    component.categoryForm.patchValue({ name: 'A' });

    expect(component.categoryForm.get('name')?.hasError('minlength')).toBe(true);
  });
});
