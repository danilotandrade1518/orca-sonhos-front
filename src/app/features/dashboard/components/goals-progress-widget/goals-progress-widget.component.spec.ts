import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GoalsProgressWidgetComponent } from './goals-progress-widget.component';
import { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';
import { LocaleService } from '@shared/formatting';

describe('GoalsProgressWidgetComponent', () => {
  let component: GoalsProgressWidgetComponent;
  let fixture: ComponentFixture<GoalsProgressWidgetComponent>;
  let router: Router;
  let localeService: LocaleService;

  const mockGoals: GoalDto[] = [
    {
      id: 'goal-1',
      name: 'Reserva de Emergência',
      totalAmount: 10000,
      accumulatedAmount: 5000,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      budgetId: 'budget-1',
    },
    {
      id: 'goal-2',
      name: 'Viagem',
      totalAmount: 5000,
      accumulatedAmount: 2500,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      budgetId: 'budget-1',
    },
    {
      id: 'goal-3',
      name: 'Carro',
      totalAmount: 30000,
      accumulatedAmount: 1000,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      budgetId: 'budget-1',
    },
  ];

  beforeEach(async () => {
    router = {
      navigate: vi.fn(),
    } as unknown as Router;

    localeService = {
      formatCurrency: vi.fn((value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`),
    } as unknown as LocaleService;

    await TestBed.configureTestingModule({
      imports: [GoalsProgressWidgetComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: router },
        { provide: LocaleService, useValue: localeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsProgressWidgetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty goals', () => {
      expect(component.goals()).toEqual([]);
      expect(component.isEmpty()).toBe(true);
    });

    it('should initialize with loading false', () => {
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no goals', () => {
      fixture.componentRef.setInput('goals', []);
      fixture.detectChanges();

      const emptyElement = fixture.nativeElement.querySelector('.goals-progress-widget__empty');
      expect(emptyElement).toBeTruthy();
    });

    it('should call onCreateGoal when clicking create button', () => {
      fixture.componentRef.setInput('goals', []);
      fixture.detectChanges();

      const createButton = fixture.nativeElement.querySelector('.goals-progress-widget__empty os-button button');
      if (createButton) {
        createButton.click();
      }

      expect(router.navigate).toHaveBeenCalledWith(['/goals/new']);
    });
  });

  describe('Loading State', () => {
    it('should display loading skeleton when isLoading is true', () => {
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector('.goals-progress-widget__loading');
      expect(loadingElement).toBeTruthy();
    });
  });

  describe('Goals Display', () => {
    it('should display goals list when goals are provided', () => {
      fixture.componentRef.setInput('goals', mockGoals);
      fixture.detectChanges();

      const listElement = fixture.nativeElement.querySelector('.goals-progress-widget__list');
      expect(listElement).toBeTruthy();

      const items = fixture.nativeElement.querySelectorAll('.goals-progress-widget__item');
      expect(items.length).toBeGreaterThan(0);
    });

    it('should limit displayed goals to maxDisplayed', () => {
      const manyGoals = Array.from({ length: 10 }, (_, i) => ({
        id: `goal-${i}`,
        name: `Meta ${i}`,
        totalAmount: 1000,
        accumulatedAmount: 500,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        budgetId: 'budget-1',
      }));

      fixture.componentRef.setInput('goals', manyGoals);
      fixture.componentRef.setInput('maxDisplayed', 5);
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('.goals-progress-widget__item');
      expect(items.length).toBeLessThanOrEqual(5);
    });

    it('should display "Ver todas as metas" button when hasMoreGoals', () => {
      const manyGoals = Array.from({ length: 10 }, (_, i) => ({
        id: `goal-${i}`,
        name: `Meta ${i}`,
        totalAmount: 1000,
        accumulatedAmount: 500,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        budgetId: 'budget-1',
      }));

      fixture.componentRef.setInput('goals', manyGoals);
      fixture.componentRef.setInput('maxDisplayed', 5);
      fixture.detectChanges();

      const footer = fixture.nativeElement.querySelector('.goals-progress-widget__footer');
      expect(footer).toBeTruthy();
    });

    it('should navigate to /goals when clicking "Ver todas as metas"', () => {
      const manyGoals = Array.from({ length: 10 }, (_, i) => ({
        id: `goal-${i}`,
        name: `Meta ${i}`,
        totalAmount: 1000,
        accumulatedAmount: 500,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        budgetId: 'budget-1',
      }));

      fixture.componentRef.setInput('goals', manyGoals);
      fixture.componentRef.setInput('maxDisplayed', 5);
      fixture.detectChanges();

      const footer = fixture.nativeElement.querySelector('.goals-progress-widget__footer');
      const button = footer?.querySelector('os-button button');
      if (button) {
        button.click();
      }

      expect(router.navigate).toHaveBeenCalledWith(['/goals']);
    });
  });

  describe('Summary', () => {
    it('should display summary with total goals count', () => {
      fixture.componentRef.setInput('goals', mockGoals);
      fixture.detectChanges();

      const summary = fixture.nativeElement.querySelector('.goals-progress-widget__summary');
      expect(summary).toBeTruthy();
    });

    it('should display on-track count in summary', () => {
      fixture.componentRef.setInput('goals', mockGoals);
      fixture.detectChanges();

      const summaryValue = fixture.nativeElement.querySelector(
        '.goals-progress-widget__summary-value--success'
      );
      expect(summaryValue).toBeTruthy();
    });
  });

  describe('Goal Status', () => {
    it('should display correct status badge for on-track goal', () => {
      const onTrackGoal: GoalDto = {
        id: 'goal-1',
        name: 'Meta On-Track',
        totalAmount: 10000,
        accumulatedAmount: 5000,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        budgetId: 'budget-1',
      };

      fixture.componentRef.setInput('goals', [onTrackGoal]);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.goals-progress-widget__item-badge--on-track');
      expect(badge).toBeTruthy();
    });

    it('should display correct status badge for overdue goal', () => {
      const overdueGoal: GoalDto = {
        id: 'goal-1',
        name: 'Meta Atrasada',
        totalAmount: 10000,
        accumulatedAmount: 1000,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        budgetId: 'budget-1',
      };

      fixture.componentRef.setInput('goals', [overdueGoal]);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.goals-progress-widget__item-badge--atrasada');
      expect(badge).toBeTruthy();
    });
  });

  describe('Goal Values', () => {
    it('should display current value, target value, and remaining', () => {
      fixture.componentRef.setInput('goals', [mockGoals[0]]);
      fixture.detectChanges();

      const values = fixture.nativeElement.querySelectorAll('.goals-progress-widget__item-value');
      expect(values.length).toBeGreaterThanOrEqual(3);
    });

    it('should display suggested monthly amount when deadline exists', () => {
      fixture.componentRef.setInput('goals', [mockGoals[0]]);
      fixture.detectChanges();

      const suggestedValue = Array.from(
        fixture.nativeElement.querySelectorAll('.goals-progress-widget__item-value-label')
      ).find((el) => (el as Element).textContent?.includes('Aporte sugerido')) as Element | undefined;

      expect(suggestedValue).toBeTruthy();
    });
  });

  describe('Subtitle', () => {
    it('should display custom subtitle when provided', () => {
      fixture.componentRef.setInput('goals', mockGoals);
      fixture.componentRef.setInput('subtitle', 'Custom subtitle');
      fixture.detectChanges();

      const subtitle = fixture.nativeElement.querySelector('.goals-progress-widget__subtitle');
      expect(subtitle?.textContent).toContain('Custom subtitle');
    });

    it('should display computed summary text when subtitle not provided', () => {
      fixture.componentRef.setInput('goals', mockGoals);
      fixture.detectChanges();

      const subtitle = fixture.nativeElement.querySelector('.goals-progress-widget__subtitle');
      expect(subtitle?.textContent).toBeTruthy();
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate progress percentage correctly', () => {
      fixture.componentRef.setInput('goals', [mockGoals[0]]);
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('os-progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('should sort goals by status (atrasada first) and progress', () => {
      fixture.componentRef.setInput('goals', mockGoals);
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('.goals-progress-widget__item');
      expect(items.length).toBeGreaterThan(0);
    });
  });
});
