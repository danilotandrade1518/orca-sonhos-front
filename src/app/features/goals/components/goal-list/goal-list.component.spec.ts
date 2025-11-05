import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoalListComponent } from './goal-list.component';
import { GoalCardComponent } from '../goal-card/goal-card.component';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';

registerLocaleData(localePtBr);

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
      providers: [
        provideZonelessChangeDetection(),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
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
      fixture.componentRef.setInput('goals', []);
      fixture.componentRef.setInput('isLoading', false);
      fixture.detectChanges();

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

      const cardDebugElement = fixture.debugElement.query(By.directive(GoalCardComponent));
      const cardComponent = cardDebugElement.componentInstance as GoalCardComponent;
      cardComponent.aportar.emit('goal-1');

      expect(spy).toHaveBeenCalledWith('goal-1');
    });

    it('should emit editar event', () => {
      const spy = vi.fn();
      component.editar.subscribe(spy);

      const cardDebugElement = fixture.debugElement.query(By.directive(GoalCardComponent));
      const cardComponent = cardDebugElement.componentInstance as GoalCardComponent;
      cardComponent.editar.emit('goal-1');

      expect(spy).toHaveBeenCalledWith('goal-1');
    });

    it('should emit excluir event', () => {
      const spy = vi.fn();
      component.excluir.subscribe(spy);

      const cardDebugElement = fixture.debugElement.query(By.directive(GoalCardComponent));
      const cardComponent = cardDebugElement.componentInstance as GoalCardComponent;
      cardComponent.excluir.emit('goal-1');

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
      const cardDebugElements = fixture.debugElement.queryAll(By.directive(GoalCardComponent));
      expect(cardDebugElements.length).toBe(2);

      const firstCardComponent = cardDebugElements[0].componentInstance as GoalCardComponent;
      expect(firstCardComponent.goal()).toEqual(mockGoals[0]);
      expect(firstCardComponent.progress()).toBe(50);
      expect(firstCardComponent.remaining()).toBe(5000);
    });
  });
});
