import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { EnvelopeFormComponent } from './envelope-form.component';
import { EnvelopeDto } from '../../../../../dtos/envelope';
import { EnvelopeState } from '@core/services/envelope/envelope-state/envelope.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { CategoriesApiService } from '@core/services/category/categories-api.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import { OsSelectComponent } from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import type { CategoryDto } from '../../../../../dtos/category';

describe('EnvelopeFormComponent', () => {
  let component: EnvelopeFormComponent;
  let fixture: ComponentFixture<EnvelopeFormComponent>;
  let envelopeState: {
    loading: ReturnType<typeof signal<boolean>>;
    createEnvelope: ReturnType<typeof vi.fn>;
    updateEnvelope: ReturnType<typeof vi.fn>;
  };
  let budgetSelection: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
  };
  let categoriesApi: {
    loading: ReturnType<typeof signal<boolean>>;
    listCategories: ReturnType<typeof vi.fn>;
  };
  let notificationService: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockEnvelope: EnvelopeDto = {
    id: 'envelope-1',
    budgetId: 'budget-1',
    categoryId: 'category-1',
    categoryName: 'Alimentação',
    name: 'Envelope Alimentação',
    limit: 80000,
    currentUsage: 45000,
    usagePercentage: 56.25,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
  };

  const mockCategories: CategoryDto[] = [
    {
      id: 'category-1',
      budgetId: 'budget-1',
      name: 'Alimentação',
      type: 'EXPENSE',
      active: true,
      kind: 'CUSTOM',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 'category-2',
      budgetId: 'budget-1',
      name: 'Transporte',
      type: 'EXPENSE',
      active: true,
      kind: 'CUSTOM',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    envelopeState = {
      loading: signal(false),
      createEnvelope: vi.fn(),
      updateEnvelope: vi.fn(),
    };

    budgetSelection = {
      selectedBudgetId: signal('budget-1'),
    };

    categoriesApi = {
      loading: signal(false),
      listCategories: vi.fn(() => of(mockCategories)),
    };

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        EnvelopeFormComponent,
        ReactiveFormsModule,
        OsModalTemplateComponent,
        OsFormTemplateComponent,
        OsFormFieldComponent,
        OsSelectComponent,
        OsMoneyInputComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EnvelopeState, useValue: envelopeState },
        { provide: BudgetSelectionService, useValue: budgetSelection },
        { provide: CategoriesApiService, useValue: categoriesApi },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvelopeFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form with empty values in create mode', () => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();
      component.ngOnInit();

      const form = component.form();
      expect(form).toBeTruthy();
      expect(form?.get('name')?.value).toBe('');
      expect(form?.get('categoryId')?.value).toBeNull();
      expect(form?.get('limit')?.value).toBeNull();
    });

    it('should load categories on init', async () => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();
      component.ngOnInit();

      await firstValueFrom(of(true));

      expect(categoriesApi.listCategories).toHaveBeenCalledWith('budget-1');
      expect(component.categories().length).toBe(2);
    });

    it('should populate form with envelope data in edit mode', () => {
      fixture.componentRef.setInput('mode', 'edit');
      fixture.componentRef.setInput('envelope', mockEnvelope);
      fixture.detectChanges();
      component.ngOnInit();

      const form = component.form();
      expect(form?.get('name')?.value).toBe('Envelope Alimentação');
      expect(form?.get('categoryId')?.value).toBe('category-1');
      expect(form?.get('limit')?.value).toBe(800);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();
      component.ngOnInit();
    });

    it('should validate name as required', () => {
      const nameControl = component.nameControl();
      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should validate name minLength', () => {
      const nameControl = component.nameControl();
      nameControl?.setValue('ab');
      nameControl?.updateValueAndValidity();
      nameControl?.markAsDirty();
      nameControl?.markAsTouched();

      component['_validationTrigger'].update((v) => v + 1);
      fixture.detectChanges();

      expect(nameControl?.hasError('minlength')).toBe(true);
      expect(component.getNameErrorMessage()).toBe('Nome deve ter pelo menos 3 caracteres');
    });

    it('should validate name maxLength', () => {
      const nameControl = component.nameControl();
      const longName = 'a'.repeat(101);
      nameControl?.setValue(longName);
      nameControl?.updateValueAndValidity();
      nameControl?.markAsDirty();
      nameControl?.markAsTouched();

      component['_validationTrigger'].update((v) => v + 1);
      fixture.detectChanges();

      expect(nameControl?.hasError('maxlength')).toBe(true);
      expect(component.getNameErrorMessage()).toBe('Nome deve ter no máximo 100 caracteres');
    });

    it('should validate categoryId as required', () => {
      const categoryControl = component.categoryControl();
      expect(categoryControl?.hasError('required')).toBe(true);
    });

    it('should validate limit as required', () => {
      const limitControl = component.limitControl();
      expect(limitControl?.hasError('required')).toBe(true);
      
      limitControl?.markAsDirty();
      limitControl?.markAsTouched();
      
      component['_validationTrigger'].update((v) => v + 1);
      fixture.detectChanges();

      expect(limitControl?.hasError('required')).toBe(true);
    });

    it('should validate limit min (>= 0.01)', () => {
      const limitControl = component.limitControl();
      limitControl?.setValue(0);
      limitControl?.updateValueAndValidity();
      limitControl?.markAsDirty();
      limitControl?.markAsTouched();

      component['_validationTrigger'].update((v) => v + 1);
      fixture.detectChanges();

      expect(limitControl?.hasError('min')).toBe(true);
      expect(component.getLimitErrorMessage()).toBe('Limite deve ser maior que zero');
    });
  });

  describe('Category Options', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();
      component.ngOnInit();
    });

    it('should map categories to select options', async () => {
      await firstValueFrom(of(true));

      const options = component.categoryOptions();
      expect(options.length).toBe(2);
      expect(options[0]).toEqual({ value: 'category-1', label: 'Alimentação', disabled: false });
      expect(options[1]).toEqual({ value: 'category-2', label: 'Transporte', disabled: false });
    });

    it('should filter out inactive categories', async () => {
      const inactiveCategories: CategoryDto[] = [
        ...mockCategories,
        {
          id: 'category-3',
          budgetId: 'budget-1',
          name: 'Inativa',
          type: 'EXPENSE',
          active: false,
          kind: 'CUSTOM',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];

      categoriesApi.listCategories = vi.fn(() => of(inactiveCategories));
      component.ngOnInit();

      await firstValueFrom(of(true));

      const options = component.categoryOptions();
      expect(options.length).toBe(2);
      expect(options.find((o) => o.value === 'category-3')).toBeUndefined();
    });
  });

  describe('Submit', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();
      component.ngOnInit();
    });

    it('should not submit if form is invalid', () => {
      const form = component.form();
      form?.markAllAsTouched();
      component['_validationTrigger'].update((v) => v + 1);

      component.onSubmit();

      expect(envelopeState.createEnvelope).not.toHaveBeenCalled();
    });

    it('should create envelope with correct values', async () => {
      await firstValueFrom(of(true));

      const form = component.form();
      form?.patchValue({
        name: 'Novo Envelope',
        categoryId: 'category-1',
        limit: 500.5,
      });

      component.onSubmit();

      expect(envelopeState.createEnvelope).toHaveBeenCalledWith({
        budgetId: 'budget-1',
        categoryId: 'category-1',
        name: 'Novo Envelope',
        limit: 50050,
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Envelope criado com sucesso!');
    });

    it('should update envelope in edit mode', async () => {
      fixture.componentRef.setInput('mode', 'edit');
      fixture.componentRef.setInput('envelope', mockEnvelope);
      fixture.detectChanges();
      component.ngOnInit();

      await firstValueFrom(of(true));

      const form = component.form();
      form?.patchValue({
        name: 'Envelope Atualizado',
        limit: 1000,
      });

      component.onSubmit();

      expect(envelopeState.updateEnvelope).toHaveBeenCalledWith({
        envelopeId: 'envelope-1',
        budgetId: 'budget-1',
        name: 'Envelope Atualizado',
        limit: 100000,
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Envelope atualizado com sucesso!'
      );
    });

    it('should show error if no budget is selected', async () => {
      await firstValueFrom(of(true));
      
      const form = component.form();
      form?.patchValue({
        name: 'Novo Envelope',
        categoryId: 'category-1',
        limit: 500,
      });
      
      budgetSelection.selectedBudgetId.set(null);

      component.onSubmit();

      expect(notificationService.showError).toHaveBeenCalledWith('Nenhum orçamento selecionado');
      expect(envelopeState.createEnvelope).not.toHaveBeenCalled();
    });
  });

  describe('Cancel', () => {
    it('should emit cancelled event', () => {
      const cancelledSpy = vi.fn();
      component.cancelled.subscribe(cancelledSpy);

      component.onCancel();

      expect(cancelledSpy).toHaveBeenCalled();
    });
  });

  describe('Modal Config', () => {
    it('should show create title in create mode', () => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();

      const config = component.modalConfig();
      expect(config.title).toBe('Criar Envelope');
      expect(config.confirmButtonText).toBe('Criar');
    });

    it('should show edit title in edit mode', () => {
      fixture.componentRef.setInput('mode', 'edit');
      fixture.detectChanges();

      const config = component.modalConfig();
      expect(config.title).toBe('Editar Envelope');
      expect(config.confirmButtonText).toBe('Salvar');
    });
  });
});
