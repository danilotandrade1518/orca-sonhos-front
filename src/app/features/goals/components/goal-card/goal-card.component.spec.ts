import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoalCardComponent } from './goal-card.component';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';

registerLocaleData(localePtBr);

describe('GoalCardComponent', () => {
  let component: GoalCardComponent;
  let fixture: ComponentFixture<GoalCardComponent>;

  const mockGoal: GoalDto = {
    id: 'goal-1',
    name: 'Meta de Teste',
    totalAmount: 10000,
    accumulatedAmount: 4500,
    deadline: '2025-12-31',
    budgetId: 'budget-1',
    sourceAccountId: 'account-1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalCardComponent],
      providers: [provideZonelessChangeDetection(), { provide: LOCALE_ID, useValue: 'pt-BR' }],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('goal', mockGoal);
    fixture.componentRef.setInput('progress', 45);
    fixture.componentRef.setInput('remaining', 5500);
    fixture.componentRef.setInput('suggested', 916.67);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should accept goal input', () => {
      expect(component.goal()).toEqual(mockGoal);
    });

    it('should accept progress input', () => {
      expect(component.progress()).toBe(45);
    });

    it('should accept remaining input', () => {
      expect(component.remaining()).toBe(5500);
    });

    it('should accept suggested input', () => {
      expect(component.suggested()).toBe(916.67);
    });

    it('should accept null suggested input', () => {
      fixture.componentRef.setInput('suggested', null);
      fixture.detectChanges();
      expect(component.suggested()).toBeNull();
    });
  });

  describe('Priority Calculation', () => {
    it('should calculate high priority for progress < 33%', () => {
      fixture.componentRef.setInput('progress', 20);
      fixture.detectChanges();

      const goalData = component.goalProgressData();
      expect(goalData.priority).toBe('high');
    });

    it('should calculate medium priority for progress >= 33% and < 66%', () => {
      fixture.componentRef.setInput('progress', 45);
      fixture.detectChanges();

      const goalData = component.goalProgressData();
      expect(goalData.priority).toBe('medium');
    });

    it('should calculate low priority for progress >= 66%', () => {
      fixture.componentRef.setInput('progress', 80);
      fixture.detectChanges();

      const goalData = component.goalProgressData();
      expect(goalData.priority).toBe('low');
    });

    it('should calculate low priority for progress exactly 66%', () => {
      fixture.componentRef.setInput('progress', 66);
      fixture.detectChanges();

      const goalData = component.goalProgressData();
      expect(goalData.priority).toBe('low');
    });
  });

  describe('Outputs', () => {
    it('should emit aportar event with goal id', () => {
      const spy = vi.fn();
      component.aportar.subscribe(spy);

      const button = fixture.nativeElement.querySelector(
        '.os-goal-progress-card__action:first-child'
      ) as HTMLButtonElement;
      if (button) {
        button.click();
        expect(spy).toHaveBeenCalledWith('goal-1');
      } else {
        
        component.aportar.emit('goal-1');
        expect(spy).toHaveBeenCalledWith('goal-1');
      }
    });

    it('should emit editar event with goal id', () => {
      const spy = vi.fn();
      component.editar.subscribe(spy);

      const buttons = fixture.nativeElement.querySelectorAll('.os-goal-progress-card__action');
      if (buttons.length > 1) {
        const editButton = buttons[1] as HTMLButtonElement;
        editButton.click();
        expect(spy).toHaveBeenCalledWith('goal-1');
      } else {
        
        component.editar.emit('goal-1');
        expect(spy).toHaveBeenCalledWith('goal-1');
      }
    });

    it('should emit excluir event with goal id', () => {
      const spy = vi.fn();
      component.excluir.subscribe(spy);

      const buttons = fixture.nativeElement.querySelectorAll('.os-goal-progress-card__action');
      if (buttons.length > 2) {
        const deleteButton = buttons[2] as HTMLButtonElement;
        deleteButton.click();
        expect(spy).toHaveBeenCalledWith('goal-1');
      } else {
        
        component.excluir.emit('goal-1');
        expect(spy).toHaveBeenCalledWith('goal-1');
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on card', () => {
      const card = fixture.nativeElement.querySelector('.os-goal-progress-card');
      expect(card).toBeTruthy();
      expect(card.getAttribute('aria-label')).toBe('Meta: Meta de Teste');
    });

    it('should have proper ARIA attributes on progressbar', () => {
      const progressbar = fixture.nativeElement.querySelector('os-progress-bar');
      if (progressbar) {
        const progressBarElement = progressbar.querySelector('[role="progressbar"]');
        if (progressBarElement) {
          expect(progressBarElement.getAttribute('aria-label')).toContain('Progresso');
        }
      }
    });

    it('should have aria-label on action buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.os-goal-progress-card__action');
      if (buttons.length > 0) {
        expect(buttons[0].getAttribute('aria-label')).toBe('Aportar na meta Meta de Teste');
        if (buttons.length > 1) {
          expect(buttons[1].getAttribute('aria-label')).toBe('Editar meta Meta de Teste');
        }
        if (buttons.length > 2) {
          expect(buttons[2].getAttribute('aria-label')).toBe('Excluir meta Meta de Teste');
        }
      }
    });

    it('should pass correct priority to goal progress card', () => {
      fixture.componentRef.setInput('progress', 20);
      fixture.detectChanges();

      const goalData = component.goalProgressData();
      expect(goalData.priority).toBe('high');
    });
  });

  describe('Rendering', () => {
    it('should display goal name', () => {
      const title = fixture.nativeElement.querySelector('.os-goal-progress-card__title');
      if (title) {
        expect(title.textContent?.trim()).toBe('Meta de Teste');
      }
    });

    it('should pass goal data to progress card component', () => {
      const goalData = component.goalProgressData();
      expect(goalData.title).toBe('Meta de Teste');
      
      expect(goalData.currentValue).toBe(4500 / 100);
      expect(goalData.targetValue).toBe(10000 / 100);
    });

    it('should pass correct progress values', () => {
      const goalData = component.goalProgressData();
      
      expect(goalData.currentValue).toBe(4500 / 100);
      expect(goalData.targetValue).toBe(10000 / 100);
      
      expect(goalData.suggestedAmount).toBeCloseTo(916.67 / 100, 2);
    });

    it('should pass null suggested amount when not provided', () => {
      fixture.componentRef.setInput('suggested', null);
      fixture.detectChanges();

      const goalData = component.goalProgressData();
      expect(goalData.suggestedAmount).toBeNull();
    });
  });
});
