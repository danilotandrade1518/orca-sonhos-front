import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoalCardComponent } from './goal-card.component';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';

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
      providers: [provideZonelessChangeDetection()],
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

  describe('Threshold Class', () => {
    it('should return danger for progress < 33%', () => {
      fixture.componentRef.setInput('progress', 20);
      fixture.detectChanges();
      expect(component.thresholdClass()).toBe('danger');
    });

    it('should return warning for progress >= 33% and < 66%', () => {
      fixture.componentRef.setInput('progress', 45);
      fixture.detectChanges();
      expect(component.thresholdClass()).toBe('warning');
    });

    it('should return success for progress >= 66%', () => {
      fixture.componentRef.setInput('progress', 80);
      fixture.detectChanges();
      expect(component.thresholdClass()).toBe('success');
    });

    it('should return success for progress exactly 66%', () => {
      fixture.componentRef.setInput('progress', 66);
      fixture.detectChanges();
      expect(component.thresholdClass()).toBe('success');
    });
  });

  describe('Outputs', () => {
    it('should emit aportar event with goal id', () => {
      const spy = vi.fn();
      component.aportar.subscribe(spy);

      const button = fixture.nativeElement.querySelector(
        '.os-goal-card__action:first-child'
      ) as HTMLButtonElement;
      button.click();

      expect(spy).toHaveBeenCalledWith('goal-1');
    });

    it('should emit editar event with goal id', () => {
      const spy = vi.fn();
      component.editar.subscribe(spy);

      const buttons = fixture.nativeElement.querySelectorAll(
        '.os-goal-card__action'
      );
      const editButton = buttons[1] as HTMLButtonElement;
      editButton.click();

      expect(spy).toHaveBeenCalledWith('goal-1');
    });

    it('should emit excluir event with goal id', () => {
      const spy = vi.fn();
      component.excluir.subscribe(spy);

      const buttons = fixture.nativeElement.querySelectorAll(
        '.os-goal-card__action'
      );
      const deleteButton = buttons[2] as HTMLButtonElement;
      deleteButton.click();

      expect(spy).toHaveBeenCalledWith('goal-1');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on article', () => {
      const article = fixture.nativeElement.querySelector('article');
      expect(article.getAttribute('aria-label')).toBe('Meta de Teste');
    });

    it('should have proper ARIA attributes on progressbar', () => {
      const progressbar = fixture.nativeElement.querySelector(
        '[role="progressbar"]'
      );
      expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
      expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
      expect(progressbar.getAttribute('aria-valuenow')).toBe('45');
      expect(progressbar.getAttribute('aria-label')).toContain('Progresso');
    });

    it('should have aria-label on action buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll(
        '.os-goal-card__action'
      );
      expect(buttons[0].getAttribute('aria-label')).toBe(
        'Aportar na meta Meta de Teste'
      );
      expect(buttons[1].getAttribute('aria-label')).toBe(
        'Editar meta Meta de Teste'
      );
      expect(buttons[2].getAttribute('aria-label')).toBe(
        'Excluir meta Meta de Teste'
      );
    });

    it('should apply threshold class to progress bar fill', () => {
      fixture.componentRef.setInput('progress', 20);
      fixture.detectChanges();

      const fill = fixture.nativeElement.querySelector(
        '.os-goal-card__progress-bar-fill'
      );
      expect(fill.classList.contains('os-goal-card__progress-bar-fill--danger')).toBe(true);
    });
  });

  describe('Rendering', () => {
    it('should display goal name', () => {
      const title = fixture.nativeElement.querySelector('.os-goal-card__title');
      expect(title.textContent.trim()).toBe('Meta de Teste');
    });

    it('should display progress percentage', () => {
      const progressValue = fixture.nativeElement.querySelector(
        '.os-goal-card__progress-value'
      );
      expect(progressValue.textContent).toContain('45');
    });

    it('should display accumulated amount', () => {
      const accumulated = fixture.nativeElement.querySelectorAll(
        '.os-goal-card__value-text'
      )[0];
      expect(accumulated.textContent).toContain('4.500');
    });

    it('should display remaining amount', () => {
      const remaining = fixture.nativeElement.querySelectorAll(
        '.os-goal-card__value-text'
      )[1];
      expect(remaining.textContent).toContain('5.500');
    });

    it('should display suggested amount when available', () => {
      const suggested = fixture.nativeElement.querySelectorAll(
        '.os-goal-card__value-text'
      )[2];
      expect(suggested.textContent).toContain('916');
    });

    it('should display dash when suggested is null', () => {
      fixture.componentRef.setInput('suggested', null);
      fixture.detectChanges();

      const suggested = fixture.nativeElement.querySelectorAll(
        '.os-goal-card__value-text'
      )[2];
      expect(suggested.textContent.trim()).toBe('—');
    });
  });
});
