import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreditCardCardComponent } from './credit-card-card.component';
import { CreditCardDto } from '../../../../../dtos/credit-card/credit-card-types';
import { EXTERNAL_AUTH_SERVICE_ADAPTER } from '../../../../core/adapters/external-auth-service.adapter';
import { MockExternalAuthServiceAdapter } from '../../../../core/services/auth/__mocks__/external-auth-service.adapter.mock';

describe('CreditCardCardComponent', () => {
  let component: CreditCardCardComponent;
  let fixture: ComponentFixture<CreditCardCardComponent>;

  const mockCreditCard: CreditCardDto = {
    id: '1',
    name: 'Cartão Nubank',
    limit: 500000,
    closingDay: 10,
    dueDay: 20,
    budgetId: 'budget-1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardCardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        {
          provide: EXTERNAL_AUTH_SERVICE_ADAPTER,
          useValue: new MockExternalAuthServiceAdapter(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCardCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('creditCard', mockCreditCard);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display credit card name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.os-credit-card-card__name');
    expect(nameElement?.textContent?.trim()).toBe('Cartão Nubank');
  });

  it('should display credit card limit', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const limitElement = compiled.querySelector('os-money-display');
    expect(limitElement).toBeTruthy();
  });

  it('should display closing day', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const closingDayElement = compiled.querySelector('.os-credit-card-card__info-value');
    expect(closingDayElement?.textContent).toContain('10');
  });

  it('should display due day', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const infoValues = compiled.querySelectorAll('.os-credit-card-card__info-value');
    expect(infoValues[1]?.textContent).toContain('20');
  });

  it('should emit edit event when edit button is clicked', () => {
    fixture.componentRef.setInput('actions', { edit: true, delete: false });
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.edit, 'emit');
    component.onEdit();

    expect(emitSpy).toHaveBeenCalledWith(mockCreditCard);
  });

  it('should emit delete event when delete button is clicked', () => {
    fixture.componentRef.setInput('actions', { edit: false, delete: true });
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.delete, 'emit');
    component.onDelete();

    expect(emitSpy).toHaveBeenCalledWith(mockCreditCard);
  });

  it('should not show actions when actions input is undefined', () => {
    fixture.componentRef.setInput('actions', undefined);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const actionsElement = compiled.querySelector('.os-credit-card-card__actions');
    expect(actionsElement).toBeFalsy();
  });

  it('should show edit button when actions.edit is true', () => {
    fixture.componentRef.setInput('actions', { edit: true, delete: false });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const editButton = compiled.querySelector('os-edit-button');
    expect(editButton).toBeTruthy();
  });

  it('should show delete button when actions.delete is true', () => {
    fixture.componentRef.setInput('actions', { edit: false, delete: true });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButton = compiled.querySelector('os-delete-button');
    expect(deleteButton).toBeTruthy();
  });

  it('should generate correct aria-label', () => {
    const ariaLabel = component.ariaLabelText();
    expect(ariaLabel).toContain('Cartão Nubank');
    expect(ariaLabel).toContain('R$');
    expect(ariaLabel).toContain('10');
    expect(ariaLabel).toContain('20');
  });

  it('should generate correct limit aria-label', () => {
    const limitAriaLabel = component.getLimitAriaLabel();
    expect(limitAriaLabel).toContain('Cartão Nubank');
    expect(limitAriaLabel).toContain('R$');
  });

  it('should not emit edit when credit card is null', () => {
    fixture.componentRef.setInput('creditCard', null as unknown);

    const emitSpy = vi.spyOn(component.edit, 'emit');
    component.onEdit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit delete when credit card is null', () => {
    fixture.componentRef.setInput('creditCard', null as unknown);

    const emitSpy = vi.spyOn(component.delete, 'emit');
    component.onDelete();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should display credit card type', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const typeElement = compiled.querySelector('.os-credit-card-card__type');
    expect(typeElement?.textContent?.trim()).toBe('Cartão de Crédito');
  });

  it('should handle zero limit correctly', () => {
    const cardWithZeroLimit: CreditCardDto = {
      ...mockCreditCard,
      limit: 0,
    };
    fixture.componentRef.setInput('creditCard', cardWithZeroLimit);
    fixture.detectChanges();

    const limitAriaLabel = component.getLimitAriaLabel();
    expect(limitAriaLabel).toContain('0,00');
    expect(limitAriaLabel).toContain('R$');
  });
});
