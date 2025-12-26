import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { BudgetCardComponent } from './budget-card.component';
import { BudgetDto } from '../../../../../dtos/budget';
import { OsEntityCardComponent } from '@shared/ui-components/organisms/os-entity-card/os-entity-card.component';

describe('BudgetCardComponent', () => {
  let component: BudgetCardComponent;
  let fixture: ComponentFixture<BudgetCardComponent>;

  const mockBudget: BudgetDto = {
    id: 'budget-1',
    name: 'Personal Budget',
    type: 'PERSONAL',
    participantsCount: 1,
  };

  const mockSharedBudget: BudgetDto = {
    id: 'budget-2',
    name: 'Family Budget',
    type: 'SHARED',
    participantsCount: 3,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCardComponent, OsEntityCardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('budget', mockBudget);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should accept budget input', () => {
      expect(component.budget()).toEqual(mockBudget);
    });

    it('should have default values for optional inputs', () => {
      expect(component.selected()).toBe(false);
      expect(component.disabled()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.showActions()).toBe(true);
      expect(component.variant()).toBe('default');
      expect(component.size()).toBe('medium');
    });

    it('should accept custom inputs', () => {
      fixture.componentRef.setInput('selected', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('showActions', false);
      fixture.componentRef.setInput('variant', 'elevated');
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      expect(component.selected()).toBe(true);
      expect(component.disabled()).toBe(true);
      expect(component.loading()).toBe(true);
      expect(component.showActions()).toBe(false);
      expect(component.variant()).toBe('elevated');
      expect(component.size()).toBe('large');
    });
  });

  describe('Rendering', () => {
    it('should render budget name', () => {
      const nameElement = fixture.nativeElement.querySelector('.os-entity-card__title');
      expect(nameElement).toBeTruthy();
      expect(nameElement.textContent.trim()).toBe(mockBudget.name);
    });

    it('should render budget type badge for PERSONAL', () => {
      const typeElement = fixture.nativeElement.querySelector('.budget-card__type');
      expect(typeElement).toBeTruthy();
      expect(typeElement.textContent.trim()).toBe('Pessoal');
      expect(typeElement.classList.contains('budget-card__type--personal')).toBe(true);
    });

    it('should render budget type badge for SHARED', () => {
      fixture.componentRef.setInput('budget', mockSharedBudget);
      fixture.detectChanges();

      const typeElement = fixture.nativeElement.querySelector('.budget-card__type');
      expect(typeElement).toBeTruthy();
      expect(typeElement.textContent.trim()).toBe('Compartilhado');
      expect(typeElement.classList.contains('budget-card__type--shared')).toBe(true);
    });

    it('should render participants count', () => {
      const participantsElement = fixture.nativeElement.querySelector('.os-entity-card__meta-text');
      expect(participantsElement).toBeTruthy();
      expect(participantsElement.textContent.trim()).toBe('1 participante');
    });

    it('should render plural participants count', () => {
      fixture.componentRef.setInput('budget', mockSharedBudget);
      fixture.detectChanges();

      const participantsElement = fixture.nativeElement.querySelector('.os-entity-card__meta-text');
      expect(participantsElement).toBeTruthy();
      expect(participantsElement.textContent.trim()).toBe('3 participantes');
    });

    it('should render action buttons when showActions is true', () => {
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const actionsContainer = fixture.nativeElement.querySelector('.os-entity-card__actions');
      expect(actionsContainer).toBeTruthy();
    });

    it('should not render action buttons when showActions is false', () => {
      fixture.componentRef.setInput('showActions', false);
      fixture.detectChanges();

      const actionsContainer = fixture.nativeElement.querySelector('.os-entity-card__actions');
      expect(actionsContainer).toBeFalsy();
    });
  });

  describe('Computed Properties', () => {
    it('should compute ariaLabel from budget name', () => {
      expect(component.ariaLabel()).toBe(`Orçamento ${mockBudget.name}`);
    });
  });

  describe('Outputs', () => {
    it('should emit cardClick with budget id when card is clicked', () => {
      let emittedValue = '';
      component.cardClick.subscribe((value) => {
        emittedValue = value;
      });

      component.onCardClick();

      expect(emittedValue).toBe(mockBudget.id);
    });

    it('should emit editClick with budget id when edit button is clicked', () => {
      let emittedValue = '';
      component.editClick.subscribe((value) => {
        emittedValue = value;
      });

      component.onEdit();

      expect(emittedValue).toBe(mockBudget.id);
    });

    it('should emit deleteClick with budget id when delete button is clicked', () => {
      let emittedValue = '';
      component.deleteClick.subscribe((value) => {
        emittedValue = value;
      });

      component.onDelete();

      expect(emittedValue).toBe(mockBudget.id);
    });
  });

  describe('Accessibility', () => {
    it('should have aria label computed from budget name', () => {
      const ariaLabel = component.ariaLabel();
      expect(ariaLabel).toBe(`Orçamento ${mockBudget.name}`);
      expect(ariaLabel).toContain(mockBudget.name);
    });
  });
});
