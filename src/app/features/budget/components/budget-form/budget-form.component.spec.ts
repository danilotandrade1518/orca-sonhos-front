import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { BudgetFormComponent } from './budget-form.component';
import { BudgetDto } from '../../../../../dtos/budget';
import { BudgetState } from '@core/services/budget/budget.state';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import { OsDropdownComponent } from '@shared/ui-components/molecules/os-dropdown/os-dropdown.component';
import { AuthUser } from '@app/core';

describe('BudgetFormComponent', () => {
  let component: BudgetFormComponent;
  let fixture: ComponentFixture<BudgetFormComponent>;
  let budgetState: {
    loading: ReturnType<typeof signal<boolean>>;
    createBudget: ReturnType<typeof vi.fn>;
    updateBudget: ReturnType<typeof vi.fn>;
  };
  let authService: {
    currentUser: ReturnType<typeof signal<AuthUser | null>>;
  };
  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let notificationService: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockUser: AuthUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
  };

  const mockBudget: BudgetDto = {
    id: 'budget-1',
    name: 'Test Budget',
    type: 'PERSONAL',
    participantsCount: 1,
  };

  beforeEach(async () => {
    budgetState = {
      loading: signal(false),
      createBudget: vi.fn(),
      updateBudget: vi.fn(),
    };

    authService = {
      currentUser: signal(mockUser),
    };

    router = {
      navigate: vi.fn(),
    };

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        BudgetFormComponent,
        ReactiveFormsModule,
        OsModalTemplateComponent,
        OsFormTemplateComponent,
        OsFormFieldComponent,
        OsDropdownComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: BudgetState, useValue: budgetState },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'create');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form with default values when no budget provided', () => {
      fixture.componentRef.setInput('budget', null);
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form).toBeTruthy();
      expect(form?.get('name')?.value).toBe('');
      expect(form?.get('type')?.value).toBe('PERSONAL');
    });

    it('should initialize form with budget values when budget provided', () => {
      fixture.componentRef.setInput('budget', mockBudget);
      fixture.componentRef.setInput('mode', 'edit');
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('name')?.value).toBe(mockBudget.name);
      expect(form?.get('type')?.value).toBe(mockBudget.type);
    });
  });

  describe('Inputs', () => {
    it('should have default mode as create', () => {
      expect(component.mode()).toBe('create');
    });

    it('should accept mode input', () => {
      fixture.componentRef.setInput('mode', 'edit');
      fixture.detectChanges();
      expect(component.mode()).toBe('edit');
    });

    it('should accept budget input', () => {
      fixture.componentRef.setInput('budget', mockBudget);
      fixture.detectChanges();
      expect(component.budget()).toEqual(mockBudget);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should compute modal config for create mode', () => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();

      const config = component.modalConfig();
      expect(config.title).toBe('Criar Orçamento');
      expect(config.confirmButtonText).toBe('Criar');
    });

    it('should compute modal config for edit mode', () => {
      fixture.componentRef.setInput('mode', 'edit');
      fixture.detectChanges();

      const config = component.modalConfig();
      expect(config.title).toBe('Editar Orçamento');
      expect(config.confirmButtonText).toBe('Salvar');
    });

    it('should compute type options correctly', () => {
      const options = component.typeOptions();
      expect(options).toHaveLength(2);
      expect(options[0]).toEqual({ value: 'PERSONAL', label: 'Pessoal' });
      expect(options[1]).toEqual({ value: 'SHARED', label: 'Compartilhado' });
    });

    it('should compute loading from BudgetState', () => {
      budgetState.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBe(true);

      budgetState.loading.set(false);
      fixture.detectChanges();
      expect(component.loading()).toBe(false);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should validate name as required', () => {
      const nameControl = component.nameControl();
      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should validate name minLength', () => {
      const nameControl = component.nameControl();
      nameControl?.setValue('ab');
      nameControl?.markAsDirty();
      nameControl?.markAsTouched();
      fixture.detectChanges();

      expect(nameControl?.hasError('minlength')).toBe(true);
      expect(nameControl?.touched).toBe(true);
      expect(nameControl?.dirty).toBe(true);
      expect(nameControl?.invalid).toBe(true);
    });

    it('should validate name maxLength', () => {
      const nameControl = component.nameControl();
      const longName = 'a'.repeat(101);
      nameControl?.setValue(longName);
      nameControl?.markAsDirty();
      nameControl?.markAsTouched();
      fixture.detectChanges();

      expect(nameControl?.hasError('maxlength')).toBe(true);
      expect(nameControl?.touched).toBe(true);
      expect(nameControl?.dirty).toBe(true);
      expect(nameControl?.invalid).toBe(true);
    });

    it('should validate type as required', () => {
      const typeControl = component.typeControl();
      expect(typeControl?.hasError('required')).toBe(false);
    });

    it('should return empty error message when control is not touched', () => {
      const nameControl = component.nameControl();
      expect(nameControl?.touched).toBe(false);
      expect(component.getNameErrorMessage()).toBe('');
    });
  });

  describe('onTypeChange', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should update type control value', () => {
      const typeControl = component.typeControl();
      component.onTypeChange('SHARED');
      fixture.detectChanges();

      expect(typeControl?.value).toBe('SHARED');
      expect(typeControl?.touched).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not submit when form is invalid', () => {
      const form = component.form();
      form?.get('name')?.setValue('');
      form?.markAllAsTouched();
      fixture.detectChanges();

      component.onSubmit();

      expect(budgetState.createBudget).not.toHaveBeenCalled();
      expect(budgetState.updateBudget).not.toHaveBeenCalled();
    });

    it('should create budget when mode is create and form is valid', () => {
      const form = component.form();
      form?.patchValue({
        name: 'New Budget',
        type: 'PERSONAL',
      });
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();

      component.onSubmit();

      expect(budgetState.createBudget).toHaveBeenCalledWith('New Budget', 'PERSONAL', mockUser.id);
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Orçamento criado com sucesso!');
      expect(router.navigate).toHaveBeenCalledWith(['/budgets']);
    });

    it('should update budget when mode is edit and form is valid', () => {
      fixture.componentRef.setInput('budget', mockBudget);
      fixture.componentRef.setInput('mode', 'edit');
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Updated Budget',
        type: 'SHARED',
      });
      fixture.detectChanges();

      component.onSubmit();

      expect(budgetState.updateBudget).toHaveBeenCalledWith(
        mockUser.id,
        mockBudget.id,
        'Updated Budget'
      );
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Orçamento atualizado com sucesso!'
      );
      expect(router.navigate).toHaveBeenCalledWith(['/budgets']);
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'New Budget',
        type: 'PERSONAL',
      });
      fixture.detectChanges();

      component.onSubmit();

      expect(notificationService.showError).toHaveBeenCalledWith('Usuário não autenticado');
      expect(budgetState.createBudget).not.toHaveBeenCalled();
    });

    it('should emit saved event after successful creation', () => {
      let emitted = false;
      component.saved.subscribe(() => {
        emitted = true;
      });

      const form = component.form();
      form?.patchValue({
        name: 'New Budget',
        type: 'PERSONAL',
      });
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();

      component.onSubmit();

      expect(emitted).toBe(true);
    });
  });

  describe('onCancel', () => {
    it('should emit cancelled event', () => {
      let emitted = false;
      component.cancelled.subscribe(() => {
        emitted = true;
      });

      component.onCancel();

      expect(emitted).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/budgets']);
    });
  });

  describe('Budget Effect', () => {
    it('should patch form when budget input changes', () => {
      component.ngOnInit();
      fixture.detectChanges();

      fixture.componentRef.setInput('budget', mockBudget);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('name')?.value).toBe(mockBudget.name);
      expect(form?.get('type')?.value).toBe(mockBudget.type);
    });
  });
});
