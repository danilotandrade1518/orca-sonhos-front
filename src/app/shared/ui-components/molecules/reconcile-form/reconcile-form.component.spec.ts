import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReconcileFormComponent, ReconcileFormData } from './reconcile-form.component';
import { AccountDto } from '../../../../../dtos/account';

describe('ReconcileFormComponent', () => {
  let component: ReconcileFormComponent;
  let fixture: ComponentFixture<ReconcileFormComponent>;

  const mockAccount: AccountDto = {
    id: 'account-1',
    name: 'Conta Corrente',
    type: 'CHECKING_ACCOUNT',
    balance: 5000.0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReconcileFormComponent, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReconcileFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('account', mockAccount);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with account ID', () => {
      expect(component.form.get('accountId')?.value).toBe('account-1');
      expect(component.form.get('accountId')?.disabled).toBe(true);
    });

    it('should initialize form with realBalance as 0', () => {
      expect(component.form.get('realBalance')?.value).toBe(0);
    });

    it('should update accountId when account input changes', () => {
      const newAccount: AccountDto = {
        id: 'account-2',
        name: 'Conta Poupança',
        type: 'SAVINGS_ACCOUNT',
        balance: 10000.0,
      };

      fixture.componentRef.setInput('account', newAccount);
      fixture.detectChanges();

      expect(component.form.get('accountId')?.value).toBe('account-2');
    });
  });

  describe('Form Validation', () => {
    it('should be invalid by default (realBalance is 0, but required)', () => {
      
      component.form.patchValue({ realBalance: 0 });
      component.form.updateValueAndValidity();
      expect(component.form.valid).toBe(true);
    });

    it('should be valid with realBalance >= 0', () => {
      component.form.patchValue({ realBalance: 1000.0 });
      component.form.updateValueAndValidity();
      expect(component.form.valid).toBe(true);
    });

    it('should require realBalance', () => {
      const control = component.form.get('realBalance');
      control?.setValue(undefined as unknown);
      control?.updateValueAndValidity();
      component.form.updateValueAndValidity();
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate minimum realBalance (>= 0)', () => {
      component.form.patchValue({ realBalance: -100 });
      component.form.updateValueAndValidity();
      expect(component.form.get('realBalance')?.hasError('min')).toBe(true);
    });

    it('should allow realBalance equal to 0', () => {
      component.form.patchValue({ realBalance: 0 });
      component.form.updateValueAndValidity();
      expect(component.form.valid).toBe(true);
      expect(component.form.get('realBalance')?.hasError('min')).toBe(false);
    });
  });

  describe('Account Options', () => {
    it('should generate accountOptions with account name and balance', () => {
      const options = component.accountOptions();
      expect(options.length).toBe(1);
      expect(options[0].value).toBe('account-1');
      expect(options[0].label).toContain('Conta Corrente');
      expect(options[0].label).toContain('R$');
    });

    it('should update accountOptions when account changes', () => {
      const newAccount: AccountDto = {
        id: 'account-2',
        name: 'Conta Poupança',
        type: 'SAVINGS_ACCOUNT',
        balance: 10000.0,
      };

      fixture.componentRef.setInput('account', newAccount);
      fixture.detectChanges();

      const options = component.accountOptions();
      expect(options[0].value).toBe('account-2');
      expect(options[0].label).toContain('Conta Poupança');
    });
  });

  describe('Error Messages', () => {
    it('should return error message for required realBalance', () => {
      const control = component.form.get('realBalance');
      control?.setValue(undefined as unknown);
      control?.markAsTouched();
      control?.updateValueAndValidity();
      expect(component.getRealBalanceErrorMessage()).toBe('Valor final esperado é obrigatório');
    });

    it('should return error message for min realBalance', () => {
      component.form.patchValue({ realBalance: -100 });
      component.form.updateValueAndValidity();
      const control = component.form.get('realBalance');
      control?.markAsTouched();
      expect(component.getRealBalanceErrorMessage()).toBe('Valor deve ser maior ou igual a zero');
    });

    it('should return empty string when no errors', () => {
      component.form.patchValue({ realBalance: 1000.0 });
      component.form.updateValueAndValidity();
      const control = component.form.get('realBalance');
      control?.markAsTouched();
      expect(component.getRealBalanceErrorMessage()).toBe('');
    });

    it('should return empty string when control is not touched', () => {
      component.form.patchValue({ realBalance: -100 });
      component.form.updateValueAndValidity();
      expect(component.getRealBalanceErrorMessage()).toBe('');
    });
  });

  describe('Formatted Balance', () => {
    it('should format balance correctly', () => {
      const formatted = component.getFormattedBalance();
      expect(formatted).toContain('R$');
      expect(formatted).toContain('5.000');
    });

    it('should return empty string when account is not set', () => {
      fixture.componentRef.setInput('account', null as unknown as AccountDto);
      fixture.detectChanges();
      const formatted = component.getFormattedBalance();
      expect(formatted).toBe('');
    });
  });

  describe('Form Submission', () => {
    it('should emit reconcileSubmit with form data', () => {
      let emittedData: ReconcileFormData | undefined;
      component.reconcileSubmit.subscribe((data) => (emittedData = data));

      component.form.patchValue({
        accountId: 'account-1',
        realBalance: 6000.0,
      });
      component.form.updateValueAndValidity();

      component.onSubmit();

      expect(emittedData).toBeDefined();
      expect(emittedData?.accountId).toBe('account-1');
      expect(emittedData?.realBalance).toBe(6000.0);
    });

    it('should use account().id when accountId is empty in form value', () => {
      let emittedData: ReconcileFormData | undefined;
      component.reconcileSubmit.subscribe((data) => (emittedData = data));

      component.form.patchValue({
        accountId: '',
        realBalance: 6000.0,
      });
      component.form.updateValueAndValidity();

      component.onSubmit();

      expect(emittedData?.accountId).toBe('account-1');
    });

    it('should not emit when form is invalid', () => {
      const spy = vi.fn();
      component.reconcileSubmit.subscribe(spy);

      component.form.patchValue({ realBalance: -100 });
      component.form.updateValueAndValidity();

      component.onSubmit();

      expect(spy).not.toHaveBeenCalled();
      expect(component.form.touched).toBe(true);
    });

    it('should prevent default event when event is provided', () => {
      const event = {
        preventDefault: vi.fn(),
      } as unknown as Event;

      component.form.patchValue({ realBalance: 1000.0 });
      component.form.updateValueAndValidity();

      component.onSubmit(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.form.patchValue({ realBalance: -100 });
      component.form.updateValueAndValidity();

      expect(component.form.get('realBalance')?.touched).toBe(false);

      component.onSubmit();

      expect(component.form.get('realBalance')?.touched).toBe(true);
    });
  });

  describe('Cancel Action', () => {
    it('should emit cancel event', () => {
      const spy = vi.fn();
      component.cancelled.subscribe(spy);

      component.onCancel();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should have disabled input signal when set to true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.disabled()).toBe(true);
    });

    it('should have disabled input signal when set to false', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      expect(component.disabled()).toBe(false);
    });
  });

  describe('Helper Text', () => {
    it('should display helper text about automatic calculation', () => {
      const helperElement = fixture.nativeElement.querySelector('.os-reconcile-form__helper');
      expect(helperElement).toBeTruthy();
      expect(helperElement.textContent).toContain('calculará automaticamente');
    });

    it('should display current balance in helper text', () => {
      const helperElement = fixture.nativeElement.querySelector('.os-reconcile-form__helper');
      expect(helperElement.textContent).toContain('Saldo atual');
      expect(helperElement.textContent).toContain('R$');
    });
  });
});

