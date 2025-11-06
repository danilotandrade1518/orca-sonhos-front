import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TransferFormComponent, TransferFormData } from './transfer-form.component';
import { AccountDto } from '../../../../../dtos/account';

describe('TransferFormComponent', () => {
  let component: TransferFormComponent;
  let fixture: ComponentFixture<TransferFormComponent>;

  const mockAccounts: AccountDto[] = [
    {
      id: 'account-1',
      name: 'Conta Corrente',
      type: 'CHECKING_ACCOUNT',
      balance: 5000.0,
    },
    {
      id: 'account-2',
      name: 'Conta Poupança',
      type: 'SAVINGS_ACCOUNT',
      balance: 10000.0,
    },
    {
      id: 'account-3',
      name: 'Outra Conta',
      type: 'CHECKING_ACCOUNT',
      balance: 0,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferFormComponent, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('accounts', mockAccounts);
    fixture.componentRef.setInput('selectedBudgetId', 'budget-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should be invalid by default', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid with all required fields', () => {
      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 1000.0,
      });
      component.form.updateValueAndValidity();
      expect(component.form.valid).toBe(true);
    });

    it('should require fromAccountId', () => {
      component.form.patchValue({
        fromAccountId: '',
        toAccountId: 'account-2',
        amount: 1000.0,
      });
      component.form.updateValueAndValidity();
      expect(component.form.get('fromAccountId')?.hasError('required')).toBe(true);
    });

    it('should require toAccountId', () => {
      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: '',
        amount: 1000.0,
      });
      component.form.updateValueAndValidity();
      expect(component.form.get('toAccountId')?.hasError('required')).toBe(true);
    });

    it('should require amount', () => {
      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
      });
      const amountControl = component.form.get('amount');
      amountControl?.setValue(undefined as unknown);
      amountControl?.updateValueAndValidity();
      component.form.updateValueAndValidity();
      expect(amountControl?.hasError('required')).toBe(true);
    });

    it('should validate minimum amount', () => {
      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 0.009,
      });
      component.form.updateValueAndValidity();
      expect(component.form.get('amount')?.hasError('min')).toBe(true);
    });

    it('should validate different accounts', () => {
      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: 'account-1',
        amount: 1000.0,
      });
      component.form.updateValueAndValidity();
      expect(component.form.hasError('sameAccount')).toBe(true);
    });

    it('should validate sufficient balance', () => {
      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 6000.0,
      });
      component.form.updateValueAndValidity();
      expect(component.form.hasError('insufficientBalance')).toBe(true);
    });

    it('should allow transfer when balance is sufficient', () => {
      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 4000.0,
      });
      component.form.updateValueAndValidity();
      expect(component.form.valid).toBe(true);
    });
  });

  describe('Account Options', () => {
    it('should generate fromAccountOptions with balance', () => {
      const options = component.fromAccountOptions();
      expect(options.length).toBe(3);
      expect(options[0].value).toBe('account-1');
      expect(options[0].label).toContain('Conta Corrente');
      expect(options[0].label).toContain('Saldo');
    });

    it('should disable accounts with zero balance', () => {
      const options = component.fromAccountOptions();
      const account3Option = options.find((opt) => opt.value === 'account-3');
      expect(account3Option?.disabled).toBe(true);
    });

    it('should filter out fromAccount from toAccountOptions', () => {
      const initialOptions = component.toAccountOptions();
      expect(initialOptions.find((opt) => opt.value === 'account-1')).toBeDefined();
      expect(initialOptions.length).toBe(3);
      
      component.form.patchValue({ fromAccountId: 'account-1' });
      fixture.detectChanges();
      
      const options = component.toAccountOptions();
      
      const account1Option = options.find((opt) => opt.value === 'account-1');
      expect(account1Option).toBeUndefined();
      
      expect(options.length).toBe(2);
      const account2Option = options.find((opt) => opt.value === 'account-2');
      expect(account2Option).toBeDefined();
      expect(account2Option?.value).toBe('account-2');
    });
  });

  describe('Error Messages', () => {
    it('should return error message for required fromAccountId', () => {
      const control = component.form.get('fromAccountId');
      control?.markAsTouched();
      expect(component.getFromAccountErrorMessage()).toBe('Conta origem é obrigatória');
    });

    it('should return error message for required toAccountId', () => {
      const control = component.form.get('toAccountId');
      control?.markAsTouched();
      expect(component.getToAccountErrorMessage()).toBe('Conta destino é obrigatória');
    });

    it('should return error message for required amount', () => {
      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
      });
      const control = component.form.get('amount');
      control?.setValue(undefined as unknown);
      control?.markAsTouched();
      control?.updateValueAndValidity();
      component.form.updateValueAndValidity();
      expect(component.getAmountErrorMessage()).toBe('Valor é obrigatório');
    });

    it('should return error message for insufficient balance', () => {
      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 6000.0,
      });
      component.form.updateValueAndValidity();
      const control = component.form.get('amount');
      control?.markAsTouched();
      expect(component.getAmountErrorMessage()).toBe('Saldo insuficiente na conta origem');
    });

    it('should return helper text with available balance', () => {
      component.form.patchValue({ fromAccountId: 'account-1' });
      fixture.detectChanges();
      const helperText = component.getFromAccountHelperText();
      expect(helperText).toContain('Saldo disponível');
      expect(helperText).toContain('R$');
    });

    it('should return warning when account has no balance', () => {
      component.form.patchValue({ fromAccountId: 'account-3' });
      fixture.detectChanges();
      const helperText = component.getFromAccountHelperText();
      expect(helperText).toContain('não possui saldo disponível');
    });
  });

  describe('Form Submission', () => {
    it('should emit transferSubmit with form data', () => {
      let emittedData: TransferFormData | undefined;
      component.transferSubmit.subscribe((data) => (emittedData = data));

      component.form.patchValue({
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 1000.0,
      });
      component.form.updateValueAndValidity();

      component.onSubmit();

      expect(emittedData).toBeDefined();
      expect(emittedData?.fromAccountId).toBe('account-1');
      expect(emittedData?.toAccountId).toBe('account-2');
      expect(emittedData?.amount).toBe(1000.0);
    });

    it('should not emit when form is invalid', () => {
      const spy = vi.fn();
      component.transferSubmit.subscribe(spy);

      component.onSubmit();

      expect(spy).not.toHaveBeenCalled();
      expect(component.form.touched).toBe(true);
    });

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
});
