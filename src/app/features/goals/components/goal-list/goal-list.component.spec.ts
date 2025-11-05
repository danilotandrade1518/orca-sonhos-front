import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoalListComponent } from './goal-list.component';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';

describe('GoalListComponent', () => {
  let component: GoalListComponent;
  let fixture: ComponentFixture<GoalListComponent>;

  const mockGoals: GoalDto[] = [
    {
      id: 'goal-1',
      name: 'Meta 1',
      totalAmount: 10000,
      accumulatedAmount: 5000,
      deadline: '2025-12-31',
      budgetId: 'budget-1',
      sourceAccountId: 'account-1',
    },
    {
      id: 'goal-2',
      name: 'Meta 2',
      totalAmount: 5000,
      accumulatedAmount: 2500,
      deadline: null,
      budgetId: 'budget-1',
      sourceAccountId: 'account-2',
    },
  ];

  const mockProgressById = vi.fn((id: string) => {
    if (id === 'goal-1') return 50;
    if (id === 'goal-2') return 50;
    return 0;
  });

  const mockRemainingById = vi.fn((id: string) => {
    if (id === 'goal-1') return 5000;
    if (id === 'goal-2') return 2500;
    return 0;
  });

  const mockSuggestedById = vi.fn((id: string) => {
    if (id === 'goal-1') return 500;
    if (id === 'goal-2') return null;
    return null;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalListComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('goals', mockGoals);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('progressById', mockProgressById);
    fixture.componentRef.setInput('remainingById', mockRemainingById);
    fixture.componentRef.setInput('suggestedById', mockSuggestedById);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('States', () => {
    it('should display loading state', () => {
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const skeleton = fixture.nativeElement.querySelector('.os-goal-list__skeleton');
      expect(skeleton).toBeTruthy();
    });

    it('should display empty state when no goals', () => {
      fixture.componentRef.setInput('goals', []);
      fixture.componentRef.setInput('isLoading', false);
      fixture.detectChanges();

      const empty = fixture.nativeElement.querySelector('.os-goal-list__empty');
      expect(empty).toBeTruthy();
      expect(empty.textContent).toContain('Nenhuma meta encontrada');
    });

    it('should display error state', () => {
      fixture.componentRef.setInput('error', 'Erro ao carregar metas');
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('.os-goal-list__error');
      expect(error).toBeTruthy();
      expect(error.textContent).toContain('Erro ao carregar metas');
    });

    it('should display goals when available', () => {
      const cards = fixture.nativeElement.querySelectorAll('os-goal-card');
      expect(cards.length).toBe(2);
    });
  });

  describe('Outputs', () => {
    it('should emit create event', () => {
      const spy = vi.fn();
      component.create.subscribe(spy);

      const button = fixture.nativeElement.querySelector(
        '.os-goal-list__empty button'
      ) as HTMLButtonElement;
      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should emit aportar event', () => {
      const spy = vi.fn();
      component.aportar.subscribe(spy);

      const cards = fixture.nativeElement.querySelectorAll('os-goal-card');
      const firstCard = cards[0];
      firstCard.dispatchEvent(new CustomEvent('aportar', { detail: 'goal-1' }));

      expect(spy).toHaveBeenCalledWith('goal-1');
    });

    it('should emit editar event', () => {
      const spy = vi.fn();
      component.editar.subscribe(spy);

      const cards = fixture.nativeElement.querySelectorAll('os-goal-card');
      const firstCard = cards[0];
      firstCard.dispatchEvent(new CustomEvent('editar', { detail: 'goal-1' }));

      expect(spy).toHaveBeenCalledWith('goal-1');
    });

    it('should emit excluir event', () => {
      const spy = vi.fn();
      component.excluir.subscribe(spy);

      const cards = fixture.nativeElement.querySelectorAll('os-goal-card');
      const firstCard = cards[0];
      firstCard.dispatchEvent(new CustomEvent('excluir', { detail: 'goal-1' }));

      expect(spy).toHaveBeenCalledWith('goal-1');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on section', () => {
      const section = fixture.nativeElement.querySelector('section');
      expect(section.getAttribute('role')).toBe('region');
      expect(section.getAttribute('aria-label')).toBe('Lista de metas');
    });

    it('should have live region for loading', () => {
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const liveRegion = fixture.nativeElement.querySelector('.os-goal-list__live');
      expect(liveRegion.getAttribute('role')).toBe('status');
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    });

    it('should have alert role for error', () => {
      fixture.componentRef.setInput('error', 'Erro');
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('.os-goal-list__error');
      expect(error.getAttribute('role')).toBe('alert');
      expect(error.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('Data passing', () => {
    it('should pass correct props to goal cards', () => {
      const cards = fixture.nativeElement.querySelectorAll('os-goal-card');
      expect(cards.length).toBe(2);

      const firstCard = cards[0];
      expect(firstCard.getAttribute('ng-reflect-goal')).toBeTruthy();
      expect(firstCard.getAttribute('ng-reflect-progress')).toBe('50');
      expect(firstCard.getAttribute('ng-reflect-remaining')).toBe('5000');
    });
  });
});
