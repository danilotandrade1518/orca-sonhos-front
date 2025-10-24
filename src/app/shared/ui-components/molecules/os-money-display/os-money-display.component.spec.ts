import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsMoneyDisplayComponent } from './os-money-display.component';

describe('OsMoneyDisplayComponent', () => {
  let component: OsMoneyDisplayComponent;
  let fixture: ComponentFixture<OsMoneyDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsMoneyDisplayComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsMoneyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Value Display', () => {
    it('should display zero by default', () => {
      expect(component.value()).toBe(0);
    });

    it('should display positive values', () => {
      fixture.componentRef.setInput('value', 1234.56);
      fixture.detectChanges();

      expect(component.formattedValue()).toBe('1.234,56');
    });

    it('should display negative values', () => {
      fixture.componentRef.setInput('value', -1234.56);
      fixture.detectChanges();

      expect(component.formattedValue()).toBe('-1.234,56');
    });

    it('should display zero values', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.detectChanges();

      expect(component.formattedValue()).toBe('0,00');
    });
  });

  describe('Currency', () => {
    it('should use BRL by default', () => {
      expect(component.currency()).toBe('BRL');
    });

    it('should display R$ for BRL', () => {
      fixture.componentRef.setInput('currency', 'BRL');
      fixture.detectChanges();

      expect(component.currencySymbol()).toBe('R$');
    });

    it('should display $ for USD', () => {
      fixture.componentRef.setInput('currency', 'USD');
      fixture.detectChanges();

      expect(component.currencySymbol()).toBe('$');
    });

    it('should display € for EUR', () => {
      fixture.componentRef.setInput('currency', 'EUR');
      fixture.detectChanges();

      expect(component.currencySymbol()).toBe('€');
    });

    it('should display £ for GBP', () => {
      fixture.componentRef.setInput('currency', 'GBP');
      fixture.detectChanges();

      expect(component.currencySymbol()).toBe('£');
    });

    it('should hide currency when showCurrency is false', () => {
      fixture.componentRef.setInput('showCurrency', false);
      fixture.detectChanges();

      expect(component.currencySymbol()).toBe('');
    });
  });

  describe('Variant', () => {
    it('should apply default variant by default', () => {
      expect(component.variant()).toBe('default');
    });

    it('should apply success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.componentRef.setInput('autoVariant', false);
      fixture.detectChanges();

      const displayElement = fixture.nativeElement.querySelector('.os-money-display');
      expect(displayElement.classList.contains('os-money-display--success')).toBe(true);
    });

    it('should apply warning variant', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.componentRef.setInput('autoVariant', false);
      fixture.detectChanges();

      const displayElement = fixture.nativeElement.querySelector('.os-money-display');
      expect(displayElement.classList.contains('os-money-display--warning')).toBe(true);
    });

    it('should apply error variant', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.componentRef.setInput('autoVariant', false);
      fixture.detectChanges();

      const displayElement = fixture.nativeElement.querySelector('.os-money-display');
      expect(displayElement.classList.contains('os-money-display--error')).toBe(true);
    });

    it('should apply info variant', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.componentRef.setInput('autoVariant', false);
      fixture.detectChanges();

      const displayElement = fixture.nativeElement.querySelector('.os-money-display');
      expect(displayElement.classList.contains('os-money-display--info')).toBe(true);
    });
  });

  describe('Size', () => {
    it('should apply md size by default', () => {
      expect(component.size()).toBe('md');
    });

    it('should apply xs size', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();

      const displayElement = fixture.nativeElement.querySelector('.os-money-display');
      expect(displayElement.classList.contains('os-money-display--xs')).toBe(true);
    });

    it('should apply sm size', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      const displayElement = fixture.nativeElement.querySelector('.os-money-display');
      expect(displayElement.classList.contains('os-money-display--sm')).toBe(true);
    });

    it('should apply lg size', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      const displayElement = fixture.nativeElement.querySelector('.os-money-display');
      expect(displayElement.classList.contains('os-money-display--lg')).toBe(true);
    });

    it('should apply xl size', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();

      const displayElement = fixture.nativeElement.querySelector('.os-money-display');
      expect(displayElement.classList.contains('os-money-display--xl')).toBe(true);
    });
  });

  describe('Precision', () => {
    it('should use 2 decimal places by default', () => {
      expect(component.precision()).toBe(2);
    });

    it('should format with custom precision', () => {
      fixture.componentRef.setInput('value', 1234.5678);
      fixture.componentRef.setInput('precision', 3);
      fixture.detectChanges();

      expect(component.formattedValue()).toBe('1.234,568');
    });

    it('should format with zero decimal places', () => {
      fixture.componentRef.setInput('value', 1234.56);
      fixture.componentRef.setInput('precision', 0);
      fixture.detectChanges();

      expect(component.formattedValue()).toBe('1.235');
    });
  });

  describe('Locale', () => {
    it('should use pt-BR by default', () => {
      expect(component.locale()).toBe('pt-BR');
    });

    it('should format with different locale', () => {
      fixture.componentRef.setInput('value', 1234.56);
      fixture.componentRef.setInput('locale', 'en-US');
      fixture.detectChanges();

      expect(component.formattedValue()).toBe('1,234.56');
    });
  });

  describe('Template Rendering', () => {
    it('should render currency and value elements', () => {
      fixture.componentRef.setInput('value', 1234.56);
      fixture.componentRef.setInput('currency', 'BRL');
      fixture.detectChanges();

      const currencyElement = fixture.nativeElement.querySelector('.os-money-display__currency');
      const valueElement = fixture.nativeElement.querySelector('.os-money-display__value');

      expect(currencyElement).toBeTruthy();
      expect(valueElement).toBeTruthy();
      expect(currencyElement.textContent).toBe('R$');
      expect(valueElement.textContent).toBe('1.234,56');
    });

    it('should not render currency when showCurrency is false', () => {
      fixture.componentRef.setInput('showCurrency', false);
      fixture.detectChanges();

      const currencyElement = fixture.nativeElement.querySelector('.os-money-display__currency');
      expect(currencyElement.textContent).toBe('');
    });
  });

  describe('Auto Variant', () => {
    it('should use positive variant for positive values when autoVariant is true', () => {
      fixture.componentRef.setInput('value', 100);
      fixture.componentRef.setInput('autoVariant', true);
      fixture.detectChanges();

      expect(component.effectiveVariant()).toBe('positive');
    });

    it('should use negative variant for negative values when autoVariant is true', () => {
      fixture.componentRef.setInput('value', -100);
      fixture.componentRef.setInput('autoVariant', true);
      fixture.detectChanges();

      expect(component.effectiveVariant()).toBe('negative');
    });

    it('should use neutral variant for zero values when autoVariant is true', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.componentRef.setInput('autoVariant', true);
      fixture.detectChanges();

      expect(component.effectiveVariant()).toBe('neutral');
    });

    it('should use manual variant when autoVariant is false', () => {
      fixture.componentRef.setInput('value', 100);
      fixture.componentRef.setInput('autoVariant', false);
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();

      expect(component.effectiveVariant()).toBe('error');
    });
  });

  describe('Large Value Highlighting', () => {
    it('should highlight large values by default', () => {
      fixture.componentRef.setInput('value', 15000);
      fixture.detectChanges();

      expect(component.isLargeValue()).toBe(true);
      expect(component.effectiveSize()).toBe('xl');
    });

    it('should not highlight large values when highlightLarge is false', () => {
      fixture.componentRef.setInput('value', 15000);
      fixture.componentRef.setInput('highlightLarge', false);
      fixture.detectChanges();

      expect(component.isLargeValue()).toBe(false);
      expect(component.effectiveSize()).toBe('md');
    });

    it('should use custom threshold for large values', () => {
      fixture.componentRef.setInput('value', 5000);
      fixture.componentRef.setInput('largeThreshold', 3000);
      fixture.detectChanges();

      expect(component.isLargeValue()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have default role', () => {
      expect(component.role()).toBe('text');
    });

    it('should set custom role', () => {
      fixture.componentRef.setInput('role', 'status');
      fixture.detectChanges();

      expect(component.role()).toBe('status');
    });

    it('should set aria-label', () => {
      fixture.componentRef.setInput('ariaLabel', 'Total de receitas');
      fixture.detectChanges();

      expect(component.ariaLabel()).toBe('Total de receitas');
    });

    it('should set aria-describedby', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'money-description');
      fixture.detectChanges();

      expect(component.ariaDescribedBy()).toBe('money-description');
    });

    it('should hide currency from screen readers when showCurrency is false', () => {
      fixture.componentRef.setInput('showCurrency', false);
      fixture.detectChanges();

      const currencyElement = fixture.nativeElement.querySelector('.os-money-display__currency');
      expect(currencyElement.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      fixture.componentRef.setInput('value', 999999999.99);
      fixture.detectChanges();

      expect(component.formattedValue()).toBe('999.999.999,99');
    });

    it('should handle very small numbers', () => {
      fixture.componentRef.setInput('value', 0.01);
      fixture.detectChanges();

      expect(component.formattedValue()).toBe('0,01');
    });

    it('should handle invalid locale gracefully', () => {
      fixture.componentRef.setInput('value', 1234.56);
      fixture.componentRef.setInput('locale', 'invalid-locale');
      fixture.detectChanges();

      expect(component.formattedValue()).toBe('1.234,56');
    });
  });
});
