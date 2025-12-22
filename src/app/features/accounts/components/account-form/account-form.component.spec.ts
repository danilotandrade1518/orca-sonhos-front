import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { AccountFormComponent } from './account-form.component';
import { AccountDto } from '../../../../../dtos/account/account-types';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import { OsSelectComponent } from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import { AuthUser } from '@app/core';

describe('AccountFormComponent', () => {
  let component: AccountFormComponent;
  let fixture: ComponentFixture<AccountFormComponent>;
  let accountState: {
    loading: ReturnType<typeof signal<boolean>>;
    createAccount: ReturnType<typeof vi.fn>;
    updateAccount: ReturnType<typeof vi.fn>;
  };
  let budgetSelection: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
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

  const mockAccount: AccountDto = {
    id: 'account-1',
    name: 'Conta Corrente',
    type: 'CHECKING_ACCOUNT',
    balance: 5000.0,
  };

  beforeEach(async () => {
    accountState = {
      loading: signal(false),
      createAccount: vi.fn(),
      updateAccount: vi.fn(),
    };

    budgetSelection = {
      selectedBudgetId: signal('budget-1'),
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
        AccountFormComponent,
        ReactiveFormsModule,
        OsModalTemplateComponent,
        OsFormTemplateComponent,
        OsFormFieldComponent,
        OsSelectComponent,
        OsMoneyInputComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AccountState, useValue: accountState },
        { provide: BudgetSelectionService, useValue: budgetSelection },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'create');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form with default values when no account provided', () => {
      fixture.componentRef.setInput('account', null);
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form).toBeTruthy();
      expect(form?.get('name')?.value).toBe('');
      expect(form?.get('type')?.value).toBe(null);
      expect(form?.get('initialBalance')?.value).toBe(0);
    });

    it('should initialize form with account values when account provided', () => {
      fixture.componentRef.setInput('account', mockAccount);
      fixture.componentRef.setInput('mode', 'edit');
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('name')?.value).toBe(mockAccount.name);
      expect(form?.get('type')?.value).toBe(mockAccount.type);
      
      expect(form?.get('initialBalance')?.value).toBe(mockAccount.balance / 100);
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

    it('should accept account input', () => {
      fixture.componentRef.setInput('account', mockAccount);
      fixture.detectChanges();
      expect(component.account()).toEqual(mockAccount);
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
      expect(config.title).toBe('Criar Conta');
      expect(config.confirmButtonText).toBe('Criar');
    });

    it('should compute modal config for edit mode', () => {
      fixture.componentRef.setInput('mode', 'edit');
      fixture.detectChanges();

      const config = component.modalConfig();
      expect(config.title).toBe('Editar Conta');
      expect(config.confirmButtonText).toBe('Salvar');
    });

    it('should compute type options correctly', () => {
      const options = component.typeOptions();
      expect(options).toHaveLength(6);
      expect(options[0]).toEqual({ value: 'CHECKING_ACCOUNT', label: 'Conta Corrente' });
      expect(options[1]).toEqual({ value: 'SAVINGS_ACCOUNT', label: 'Conta Poupança' });
      expect(options[5]).toEqual({ value: 'OTHER', label: 'Outros' });
    });

    it('should compute loading from AccountState', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBe(true);

      accountState.loading.set(false);
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
      nameControl?.updateValueAndValidity();
      nameControl?.markAsDirty();
      nameControl?.markAsTouched();

      component['_formValidityTick'].update((v: number) => v + 1);
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

      component['_formValidityTick'].update((v: number) => v + 1);
      fixture.detectChanges();

      expect(nameControl?.hasError('maxlength')).toBe(true);
      expect(component.getNameErrorMessage()).toBe('Nome deve ter no máximo 100 caracteres');
    });

    it('should validate type as required', () => {
      const typeControl = component.typeControl();
      expect(typeControl?.hasError('required')).toBe(true);
    });

    it('should validate initialBalance min (>= 0)', () => {
      const initialBalanceControl = component.initialBalanceControl();
      initialBalanceControl?.setValue(-100);
      initialBalanceControl?.updateValueAndValidity();
      initialBalanceControl?.markAsDirty();
      initialBalanceControl?.markAsTouched();

      component['_formValidityTick'].update((v: number) => v + 1);
      fixture.detectChanges();

      expect(initialBalanceControl?.hasError('min')).toBe(true);
      expect(component.getInitialBalanceErrorMessage()).toBe(
        'Saldo inicial deve ser maior ou igual a zero'
      );
    });

    it('should return empty error message when control is not touched', () => {
      const nameControl = component.nameControl();
      expect(nameControl?.touched).toBe(false);
      expect(component.getNameErrorMessage()).toBe('');
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

      expect(accountState.createAccount).not.toHaveBeenCalled();
      expect(accountState.updateAccount).not.toHaveBeenCalled();
    });

    it('should create account when mode is create and form is valid', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        initialBalance: 1000.0,
      });
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();

      component.onSubmit();

      expect(accountState.createAccount).toHaveBeenCalledWith({
        userId: mockUser.id,
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        budgetId: 'budget-1',
        
        initialBalance: 100000,
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Conta criada com sucesso!');
      expect(router.navigate).toHaveBeenCalledWith(['/accounts'], { replaceUrl: true });
    });

    it('should update account when mode is edit and form is valid', () => {
      fixture.componentRef.setInput('account', mockAccount);
      fixture.componentRef.setInput('mode', 'edit');
      component.ngOnInit();
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Conta Atualizada',
        type: 'SAVINGS_ACCOUNT',
        initialBalance: 6000.0,
      });
      fixture.detectChanges();

      component.onSubmit();

      expect(accountState.updateAccount).toHaveBeenCalledWith({
        id: mockAccount.id,
        userId: mockUser.id,
        name: 'Conta Atualizada',
        type: 'SAVINGS_ACCOUNT',
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Conta atualizada com sucesso!');
      expect(router.navigate).toHaveBeenCalledWith(['/accounts'], { replaceUrl: true });
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        initialBalance: 1000.0,
      });
      fixture.detectChanges();

      component.onSubmit();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Usuário ou orçamento não selecionado'
      );
      expect(accountState.createAccount).not.toHaveBeenCalled();
    });

    it('should show error when budget is not selected', () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();

      const form = component.form();
      form?.patchValue({
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        initialBalance: 1000.0,
      });
      fixture.detectChanges();

      component.onSubmit();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Usuário ou orçamento não selecionado'
      );
      expect(accountState.createAccount).not.toHaveBeenCalled();
    });

    it('should emit saved event after successful creation', () => {
      let emitted = false;
      component.saved.subscribe(() => {
        emitted = true;
      });

      const form = component.form();
      form?.patchValue({
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        initialBalance: 1000.0,
      });
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();

      component.onSubmit();

      expect(emitted).toBe(true);
    });

    it('should use initialBalance 0 when not provided', () => {
      const form = component.form();
      form?.patchValue({
        name: 'Nova Conta',
        type: 'CHECKING_ACCOUNT',
        initialBalance: null,
      });
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();

      component.onSubmit();

      expect(accountState.createAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          initialBalance: 0,
        })
      );
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
      expect(router.navigate).toHaveBeenCalledWith(['/accounts'], { replaceUrl: true });
    });
  });

  describe('Account Effect', () => {
    it('should patch form when account input changes', () => {
      component.ngOnInit();
      fixture.detectChanges();

      fixture.componentRef.setInput('account', mockAccount);
      fixture.detectChanges();

      const form = component.form();
      expect(form?.get('name')?.value).toBe(mockAccount.name);
      expect(form?.get('type')?.value).toBe(mockAccount.type);
      
      expect(form?.get('initialBalance')?.value).toBe(mockAccount.balance / 100);
    });
  });
});
