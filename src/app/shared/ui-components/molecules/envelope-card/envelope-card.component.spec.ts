import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EnvelopeCardComponent } from './envelope-card.component';
import { EnvelopeDto } from '@dtos/envelope';

describe('EnvelopeCardComponent', () => {
  let component: EnvelopeCardComponent;
  let fixture: ComponentFixture<EnvelopeCardComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvelopeCardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvelopeCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('envelope', mockEnvelope);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display envelope name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.os-envelope-card__name');
    expect(nameElement?.textContent?.trim()).toBe('Envelope Alimentação');
  });

  it('should display category name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const categoryElement = compiled.querySelector('.os-envelope-card__category');
    expect(categoryElement?.textContent?.trim()).toBe('Alimentação');
  });

  it('should display progress bar with correct percentage', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const progressBar = compiled.querySelector('os-progress-bar');
    expect(progressBar).toBeTruthy();
  });

  it('should display percentage text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const percentageElement = compiled.querySelector('.os-envelope-card__percentage');
    expect(percentageElement?.textContent?.trim()).toContain('56.3%');
  });

  it('should display spent and limit values', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const moneyDisplays = compiled.querySelectorAll('os-money-display');
    expect(moneyDisplays.length).toBe(2);
  });

  it('should emit edit event when edit button is clicked', () => {
    const emitSpy = vi.spyOn(component.edit, 'emit');

    const compiled = fixture.nativeElement as HTMLElement;
    const editButton = compiled.querySelector('os-edit-button');
    expect(editButton).toBeTruthy();

    component.onEdit();
    expect(emitSpy).toHaveBeenCalledWith(mockEnvelope);
  });

  it('should emit delete event when delete button is clicked', () => {
    const emitSpy = vi.spyOn(component.delete, 'emit');

    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButton = compiled.querySelector('os-delete-button');
    expect(deleteButton).toBeTruthy();

    component.onDelete();
    expect(emitSpy).toHaveBeenCalledWith(mockEnvelope);
  });

  describe('computed signals', () => {
    it('should compute isOverBudget correctly when usage > 100%', () => {
      const overBudgetEnvelope: EnvelopeDto = {
        ...mockEnvelope,
        usagePercentage: 120,
      };
      fixture.componentRef.setInput('envelope', overBudgetEnvelope);
      fixture.detectChanges();

      expect(component.isOverBudget()).toBe(true);
    });

    it('should compute isOverBudget correctly when usage <= 100%', () => {
      expect(component.isOverBudget()).toBe(false);
    });

    it('should compute isNearLimit correctly when usage >= 80% and <= 100%', () => {
      const nearLimitEnvelope: EnvelopeDto = {
        ...mockEnvelope,
        usagePercentage: 85,
      };
      fixture.componentRef.setInput('envelope', nearLimitEnvelope);
      fixture.detectChanges();

      expect(component.isNearLimit()).toBe(true);
    });

    it('should compute isNearLimit correctly when usage < 80%', () => {
      expect(component.isNearLimit()).toBe(false);
    });

    it('should compute progressVariant as success when usage < 80%', () => {
      expect(component.progressVariant()).toBe('success');
    });

    it('should compute progressVariant as warning when usage >= 80% and <= 100%', () => {
      const nearLimitEnvelope: EnvelopeDto = {
        ...mockEnvelope,
        usagePercentage: 85,
      };
      fixture.componentRef.setInput('envelope', nearLimitEnvelope);
      fixture.detectChanges();

      expect(component.progressVariant()).toBe('warning');
    });

    it('should compute progressVariant as danger when usage > 100%', () => {
      const overBudgetEnvelope: EnvelopeDto = {
        ...mockEnvelope,
        usagePercentage: 120,
      };
      fixture.componentRef.setInput('envelope', overBudgetEnvelope);
      fixture.detectChanges();

      expect(component.progressVariant()).toBe('danger');
    });

    it('should compute statusLabel correctly', () => {
      expect(component.statusLabel()).toBe('Dentro do limite');

      const nearLimitEnvelope: EnvelopeDto = {
        ...mockEnvelope,
        usagePercentage: 85,
      };
      fixture.componentRef.setInput('envelope', nearLimitEnvelope);
      fixture.detectChanges();
      expect(component.statusLabel()).toBe('Próximo do limite');

      const overBudgetEnvelope: EnvelopeDto = {
        ...mockEnvelope,
        usagePercentage: 120,
      };
      fixture.componentRef.setInput('envelope', overBudgetEnvelope);
      fixture.detectChanges();
      expect(component.statusLabel()).toBe('Limite excedido');
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on card', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const card = compiled.querySelector('os-card');
      expect(card?.getAttribute('ariaLabel')).toBeTruthy();
    });

    it('should have descriptive aria-label text', () => {
      const ariaLabel = component.ariaLabelText();
      expect(ariaLabel).toContain('Envelope');
      expect(ariaLabel).toContain('Envelope Alimentação');
      expect(ariaLabel).toContain('Alimentação');
    });
  });
});

