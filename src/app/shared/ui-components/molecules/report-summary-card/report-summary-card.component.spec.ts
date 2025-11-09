import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { ReportSummaryCardComponent } from './report-summary-card.component';

describe('ReportSummaryCardComponent', () => {
  let component: ReportSummaryCardComponent;
  let fixture: ComponentFixture<ReportSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSummaryCardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default properties', () => {
    it('should have empty label by default', () => {
      expect(component.label()).toBe('');
    });

    it('should have empty value by default', () => {
      expect(component.value()).toBe('');
    });

    it('should have empty change by default', () => {
      expect(component.change()).toBe('');
    });

    it('should have neutral variant by default', () => {
      expect(component.variant()).toBe('neutral');
    });

    it('should have empty icon by default', () => {
      expect(component.icon()).toBe('');
    });

    it('should have ariaLabel null by default', () => {
      expect(component.ariaLabel()).toBeNull();
    });
  });

  describe('labelId computed', () => {
    it('should return null when label is empty', () => {
      fixture.componentRef.setInput('label', '');
      fixture.detectChanges();

      expect(component.labelId()).toBeNull();
    });

    it('should return id when label exists', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();

      const labelId = component.labelId();
      expect(labelId).toBeTruthy();
      expect(labelId).toContain('report-summary-card-');
      expect(labelId).toContain('-label');
    });
  });

  describe('cardClasses computed', () => {
    it('should include base class', () => {
      const classes = component.cardClasses();
      expect(classes).toContain('os-report-summary-card');
    });

    it('should include variant class', () => {
      fixture.componentRef.setInput('variant', 'positive');
      fixture.detectChanges();

      const classes = component.cardClasses();
      expect(classes).toContain('os-report-summary-card--positive');
    });

    it('should include negative variant class', () => {
      fixture.componentRef.setInput('variant', 'negative');
      fixture.detectChanges();

      const classes = component.cardClasses();
      expect(classes).toContain('os-report-summary-card--negative');
    });

    it('should include neutral variant class', () => {
      fixture.componentRef.setInput('variant', 'neutral');
      fixture.detectChanges();

      const classes = component.cardClasses();
      expect(classes).toContain('os-report-summary-card--neutral');
    });
  });

  describe('changeClasses computed', () => {
    it('should include base change class', () => {
      fixture.componentRef.setInput('change', '10%');
      fixture.detectChanges();

      const classes = component.changeClasses();
      expect(classes).toContain('os-report-summary-card__change');
    });

    it('should include variant class for positive', () => {
      fixture.componentRef.setInput('variant', 'positive');
      fixture.componentRef.setInput('change', '10%');
      fixture.detectChanges();

      const classes = component.changeClasses();
      expect(classes).toContain('os-report-summary-card__change--positive');
    });

    it('should include variant class for negative', () => {
      fixture.componentRef.setInput('variant', 'negative');
      fixture.componentRef.setInput('change', '-10%');
      fixture.detectChanges();

      const classes = component.changeClasses();
      expect(classes).toContain('os-report-summary-card__change--negative');
    });
  });

  describe('iconVariant computed', () => {
    it('should return success for positive variant', () => {
      fixture.componentRef.setInput('variant', 'positive');
      fixture.detectChanges();

      expect(component.iconVariant()).toBe('success');
    });

    it('should return error for negative variant', () => {
      fixture.componentRef.setInput('variant', 'negative');
      fixture.detectChanges();

      expect(component.iconVariant()).toBe('error');
    });

    it('should return default for neutral variant', () => {
      fixture.componentRef.setInput('variant', 'neutral');
      fixture.detectChanges();

      expect(component.iconVariant()).toBe('default');
    });
  });

  describe('changeIcon computed', () => {
    it('should return trending-up for positive variant', () => {
      fixture.componentRef.setInput('variant', 'positive');
      fixture.detectChanges();

      expect(component.changeIcon()).toBe('trending-up');
    });

    it('should return trending-down for negative variant', () => {
      fixture.componentRef.setInput('variant', 'negative');
      fixture.detectChanges();

      expect(component.changeIcon()).toBe('trending-down');
    });

    it('should return null for neutral variant', () => {
      fixture.componentRef.setInput('variant', 'neutral');
      fixture.detectChanges();

      expect(component.changeIcon()).toBeNull();
    });
  });

  describe('inputs', () => {
    it('should accept label input', () => {
      fixture.componentRef.setInput('label', 'Total Gastos');
      fixture.detectChanges();

      expect(component.label()).toBe('Total Gastos');
    });

    it('should accept value input', () => {
      fixture.componentRef.setInput('value', 'R$ 1.000,00');
      fixture.detectChanges();

      expect(component.value()).toBe('R$ 1.000,00');
    });

    it('should accept change input', () => {
      fixture.componentRef.setInput('change', '+10%');
      fixture.detectChanges();

      expect(component.change()).toBe('+10%');
    });

    it('should accept variant input', () => {
      fixture.componentRef.setInput('variant', 'positive');
      fixture.detectChanges();

      expect(component.variant()).toBe('positive');
    });

    it('should accept icon input', () => {
      fixture.componentRef.setInput('icon', 'wallet');
      fixture.detectChanges();

      expect(component.icon()).toBe('wallet');
    });

    it('should accept ariaLabel input', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom aria label');
      fixture.detectChanges();

      expect(component.ariaLabel()).toBe('Custom aria label');
    });
  });

  describe('rendering', () => {
    it('should render label when provided', () => {
      fixture.componentRef.setInput('label', 'Total Gastos');
      fixture.detectChanges();

      const labelElement = fixture.nativeElement.querySelector('.os-report-summary-card__label');
      expect(labelElement).toBeTruthy();
      expect(labelElement.textContent.trim()).toBe('Total Gastos');
    });

    it('should render value when provided', () => {
      fixture.componentRef.setInput('value', 'R$ 1.000,00');
      fixture.detectChanges();

      const valueElement = fixture.nativeElement.querySelector('.os-report-summary-card__value');
      expect(valueElement).toBeTruthy();
      expect(valueElement.textContent.trim()).toBe('R$ 1.000,00');
    });

    it('should render change when provided', () => {
      fixture.componentRef.setInput('change', '+10%');
      fixture.detectChanges();

      const changeElement = fixture.nativeElement.querySelector('.os-report-summary-card__change');
      expect(changeElement).toBeTruthy();
      expect(changeElement.textContent.trim()).toContain('+10%');
    });

    it('should render icon when provided', () => {
      fixture.componentRef.setInput('icon', 'wallet');
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('.os-report-summary-card__icon');
      expect(iconElement).toBeTruthy();
    });

    it('should render change icon for positive variant', () => {
      fixture.componentRef.setInput('variant', 'positive');
      fixture.componentRef.setInput('change', '+10%');
      fixture.detectChanges();

      const changeElement = fixture.nativeElement.querySelector('.os-report-summary-card__change');
      expect(changeElement).toBeTruthy();
      const iconElement = changeElement.querySelector('os-icon');
      expect(iconElement).toBeTruthy();
    });

    it('should render change icon for negative variant', () => {
      fixture.componentRef.setInput('variant', 'negative');
      fixture.componentRef.setInput('change', '-10%');
      fixture.detectChanges();

      const changeElement = fixture.nativeElement.querySelector('.os-report-summary-card__change');
      expect(changeElement).toBeTruthy();
      const iconElement = changeElement.querySelector('os-icon');
      expect(iconElement).toBeTruthy();
    });

    it('should not render change icon for neutral variant', () => {
      fixture.componentRef.setInput('variant', 'neutral');
      fixture.componentRef.setInput('change', '10%');
      fixture.detectChanges();

      const changeElement = fixture.nativeElement.querySelector('.os-report-summary-card__change');
      expect(changeElement).toBeTruthy();
      const iconElement = changeElement.querySelector('os-icon');
      expect(iconElement).toBeFalsy();
    });

    it('should apply correct variant class', () => {
      fixture.componentRef.setInput('variant', 'positive');
      fixture.detectChanges();

      const cardElement = fixture.nativeElement.querySelector('article');
      expect(cardElement.className).toContain('os-report-summary-card--positive');
    });
  });
});
