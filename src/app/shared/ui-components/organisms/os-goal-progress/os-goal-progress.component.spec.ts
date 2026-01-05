import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { GoalProgressData, OsGoalProgressComponent } from './os-goal-progress.component';

describe('OsGoalProgressComponent', () => {
  let component: OsGoalProgressComponent;
  let fixture: ComponentFixture<OsGoalProgressComponent>;

  const mockGoalData: GoalProgressData = {
    id: 'goal-1',
    title: 'Viagem para Europa',
    description: 'Economizar para uma viagem de 15 dias',
    targetAmount: 15000,
    currentAmount: 7500,
    currency: 'BRL',
    deadline: new Date('2025-12-31'),
    category: 'Viagem',
    priority: 'low',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsGoalProgressComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsGoalProgressComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('goalData', mockGoalData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should accept goalData input', () => {
      expect(component.goalData()).toEqual(mockGoalData);
    });

    it('should accept variant input', () => {
      fixture.componentRef.setInput('variant', 'compact');
      expect(component.variant()).toBe('compact');
    });

    it('should accept size input', () => {
      fixture.componentRef.setInput('size', 'large');
      expect(component.size()).toBe('large');
    });

    it('should accept theme input', () => {
      fixture.componentRef.setInput('theme', 'dark');
      expect(component.theme()).toBe('dark');
    });

    it('should accept showIcon input', () => {
      fixture.componentRef.setInput('showIcon', false);
      expect(component.showIcon()).toBe(false);
    });

    it('should accept showDescription input', () => {
      fixture.componentRef.setInput('showDescription', false);
      expect(component.showDescription()).toBe(false);
    });

    it('should accept showCategory input', () => {
      fixture.componentRef.setInput('showCategory', false);
      expect(component.showCategory()).toBe(false);
    });

    it('should accept showStats input', () => {
      fixture.componentRef.setInput('showStats', false);
      expect(component.showStats()).toBe(false);
    });

    it('should accept showPercentage input', () => {
      fixture.componentRef.setInput('showPercentage', false);
      expect(component.showPercentage()).toBe(false);
    });

    it('should accept showDeadline input', () => {
      fixture.componentRef.setInput('showDeadline', false);
      expect(component.showDeadline()).toBe(false);
    });

    it('should accept showActions input', () => {
      fixture.componentRef.setInput('showActions', true);
      expect(component.showActions()).toBe(true);
    });

    it('should accept animated input', () => {
      fixture.componentRef.setInput('animated', false);
      expect(component.animated()).toBe(false);
    });

    it('should accept actions input', () => {
      const actions = [{ label: 'Edit', variant: 'primary' }];
      fixture.componentRef.setInput('actions', actions);
      expect(component.actions()).toEqual(actions);
    });

    it('should accept ariaLabel input', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom aria label');
      expect(component.ariaLabel()).toBe('Custom aria label');
    });
  });

  describe('Computed Properties', () => {
    it('should calculate progress percentage correctly', () => {
      expect(component.progressPercentage()).toBe(50);
    });

    it('should calculate progress percentage as 100 when current >= target', () => {
      const completedGoal = { ...mockGoalData, currentAmount: 20000 };
      fixture.componentRef.setInput('goalData', completedGoal);
      expect(component.progressPercentage()).toBe(100);
    });

    it('should calculate progress percentage as 0 when target is 0', () => {
      const zeroTargetGoal = { ...mockGoalData, targetAmount: 0 };
      fixture.componentRef.setInput('goalData', zeroTargetGoal);
      expect(component.progressPercentage()).toBe(0);
    });

    it('should calculate remaining amount correctly', () => {
      expect(component.remainingAmount()).toBe(7500);
    });

    it('should calculate remaining amount as 0 when current >= target', () => {
      const completedGoal = { ...mockGoalData, currentAmount: 20000 };
      fixture.componentRef.setInput('goalData', completedGoal);
      expect(component.remainingAmount()).toBe(0);
    });

    it('should detect completed goal', () => {
      const completedGoal = { ...mockGoalData, currentAmount: 20000 };
      fixture.componentRef.setInput('goalData', completedGoal);
      expect(component.isCompleted()).toBe(true);
    });

    it('should detect non-completed goal', () => {
      expect(component.isCompleted()).toBe(false);
    });

    it('should detect overdue goal', () => {
      const pastDeadline = new Date('2020-01-01');
      const overdueGoal = { ...mockGoalData, deadline: pastDeadline };
      fixture.componentRef.setInput('goalData', overdueGoal);
      expect(component.isOverdue()).toBe(true);
    });

    it('should not detect overdue for completed goal', () => {
      const pastDeadline = new Date('2020-01-01');
      const completedOverdueGoal = {
        ...mockGoalData,
        deadline: pastDeadline,
        currentAmount: 20000,
      };
      fixture.componentRef.setInput('goalData', completedOverdueGoal);
      expect(component.isOverdue()).toBe(false);
    });

    it('should generate correct goal classes', () => {
      const classes = component.goalClasses();
      expect(classes).toContain('os-goal-progress');
      expect(classes).toContain('os-goal-progress--default');
      expect(classes).toContain('os-goal-progress--medium');
      expect(classes).toContain('os-goal-progress--priority-low');
    });

    it('should generate completed classes for completed goal', () => {
      const completedGoal = { ...mockGoalData, currentAmount: 20000 };
      fixture.componentRef.setInput('goalData', completedGoal);
      const classes = component.goalClasses();
      expect(classes).toContain('os-goal-progress--completed');
    });

    it('should generate overdue classes for overdue goal', () => {
      const pastDeadline = new Date('2020-01-01');
      const overdueGoal = { ...mockGoalData, deadline: pastDeadline };
      fixture.componentRef.setInput('goalData', overdueGoal);
      const classes = component.goalClasses();
      expect(classes).toContain('os-goal-progress--overdue');
    });

    it('should generate dark theme classes', () => {
      fixture.componentRef.setInput('theme', 'dark');
      const classes = component.goalClasses();
      expect(classes).toContain('os-goal-progress--dark');
    });

    it('should return correct icon name for completed goal', () => {
      const completedGoal = { ...mockGoalData, currentAmount: 20000 };
      fixture.componentRef.setInput('goalData', completedGoal);
      expect(component.iconName()).toBe('check-circle');
    });

    it('should return correct icon name for overdue goal', () => {
      const pastDeadline = new Date('2020-01-01');
      const overdueGoal = { ...mockGoalData, deadline: pastDeadline };
      fixture.componentRef.setInput('goalData', overdueGoal);
      expect(component.iconName()).toBe('alert-circle');
    });

    it('should return default icon name for normal goal', () => {
      const futureDeadline = new Date();
      futureDeadline.setDate(futureDeadline.getDate() + 30);
      const normalGoal = {
        ...mockGoalData,
        priority: 'low',
        deadline: futureDeadline,
        currentAmount: 5000,
        targetAmount: 20000,
      };
      fixture.componentRef.setInput('goalData', normalGoal);
      fixture.detectChanges();
      expect(component.iconName()).toBe('target');
    });

    it('should return correct icon size', () => {
      fixture.componentRef.setInput('size', 'large');
      expect(component.iconSize()).toBe('lg');
    });

    it('should return success progress variant for completed goal', () => {
      const completedGoal = { ...mockGoalData, currentAmount: 20000 };
      fixture.componentRef.setInput('goalData', completedGoal);
      expect(component.progressVariant()).toBe('success');
    });

    it('should return error progress variant for overdue goal', () => {
      const pastDeadline = new Date('2020-01-01');
      const overdueGoal = { ...mockGoalData, deadline: pastDeadline, priority: 'low' };
      fixture.componentRef.setInput('goalData', overdueGoal);
      expect(component.progressVariant()).toBe('danger');
    });

    it('should return warning progress variant for high priority goal', () => {
      const futureDeadline = new Date();
      futureDeadline.setDate(futureDeadline.getDate() + 30);
      const highPriorityGoal = { ...mockGoalData, deadline: futureDeadline, priority: 'high' };
      fixture.componentRef.setInput('goalData', highPriorityGoal);
      expect(component.progressVariant()).toBe('warning');
    });

    it('should return primary progress variant for normal goal', () => {
      const futureDeadline = new Date();
      futureDeadline.setDate(futureDeadline.getDate() + 30);
      const normalGoal = { ...mockGoalData, deadline: futureDeadline, priority: 'low' };
      fixture.componentRef.setInput('goalData', normalGoal);
      expect(component.progressVariant()).toBe('primary');
    });

    it('should return correct progress size', () => {
      fixture.componentRef.setInput('size', 'small');
      expect(component.progressSize()).toBe('small');
    });

    it('should return success current amount variant for completed goal', () => {
      const completedGoal = { ...mockGoalData, currentAmount: 20000 };
      fixture.componentRef.setInput('goalData', completedGoal);
      expect(component.currentAmountVariant()).toBe('success');
    });

    it('should return error current amount variant for overdue goal', () => {
      const pastDeadline = new Date('2020-01-01');
      const overdueGoal = { ...mockGoalData, deadline: pastDeadline };
      fixture.componentRef.setInput('goalData', overdueGoal);
      expect(component.currentAmountVariant()).toBe('error');
    });

    it('should return default current amount variant for normal goal', () => {
      const futureDeadline = new Date();
      futureDeadline.setDate(futureDeadline.getDate() + 30);
      const normalGoal = { ...mockGoalData, deadline: futureDeadline, priority: 'low' };
      fixture.componentRef.setInput('goalData', normalGoal);
      expect(component.currentAmountVariant()).toBe('default');
    });

    it('should return default target amount variant', () => {
      expect(component.targetAmountVariant()).toBe('default');
    });

    it('should return correct amount size', () => {
      fixture.componentRef.setInput('size', 'large');
      expect(component.amountSize()).toBe('large');
    });

    it('should format deadline correctly for past date', () => {
      const pastDeadline = new Date('2020-01-01');
      const pastGoal = { ...mockGoalData, deadline: pastDeadline };
      fixture.componentRef.setInput('goalData', pastGoal);
      expect(component.formattedDeadline()).toBe('Vencido');
    });

    it('should format deadline correctly for today', () => {
      const today = new Date();
      const todayGoal = { ...mockGoalData, deadline: today };
      fixture.componentRef.setInput('goalData', todayGoal);
      expect(component.formattedDeadline()).toBe('Hoje');
    });

    it('should format deadline correctly for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowGoal = { ...mockGoalData, deadline: tomorrow };
      fixture.componentRef.setInput('goalData', tomorrowGoal);
      expect(component.formattedDeadline()).toBe('Amanhã');
    });

    it('should format deadline correctly for days', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const futureGoal = { ...mockGoalData, deadline: futureDate };
      fixture.componentRef.setInput('goalData', futureGoal);
      expect(component.formattedDeadline()).toBe('5 dias');
    });

    it('should format deadline correctly for weeks', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
      const futureGoal = { ...mockGoalData, deadline: futureDate };
      fixture.componentRef.setInput('goalData', futureGoal);
      expect(component.formattedDeadline()).toBe('2 semanas');
    });

    it('should format deadline correctly for months', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);
      const futureGoal = { ...mockGoalData, deadline: futureDate };
      fixture.componentRef.setInput('goalData', futureGoal);
      expect(component.formattedDeadline()).toBe('2 meses');
    });

    it('should return empty string for goal without deadline', () => {
      const noDeadlineGoal = { ...mockGoalData, deadline: undefined };
      fixture.componentRef.setInput('goalData', noDeadlineGoal);
      expect(component.formattedDeadline()).toBe('');
    });
  });

  describe('Event Handlers', () => {
    it('should emit goalClick event when onGoalClick is called', () => {
      const goalClickSpy = vi.fn();
      component.goalClick.subscribe(goalClickSpy);

      component.onGoalClick();

      expect(goalClickSpy).toHaveBeenCalledWith(mockGoalData);
    });

    it('should emit actionClick event when onActionClick is called', () => {
      const actionClickSpy = vi.fn();
      component.actionClick.subscribe(actionClickSpy);
      const action = { label: 'Edit' };

      component.onActionClick(action);

      expect(actionClickSpy).toHaveBeenCalledWith({ action, goal: mockGoalData });
    });
  });

  describe('Template Rendering', () => {
    it('should render goal title', () => {
      const titleElement = fixture.nativeElement.querySelector('.os-goal-progress__title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent).toContain('Viagem para Europa');
    });

    it('should render goal description when showDescription is true', () => {
      fixture.componentRef.setInput('showDescription', true);
      fixture.detectChanges();

      const descriptionElement = fixture.nativeElement.querySelector(
        '.os-goal-progress__description'
      );
      expect(descriptionElement).toBeTruthy();
      expect(descriptionElement.textContent).toContain('Economizar para uma viagem de 15 dias');
    });

    it('should not render goal description when showDescription is false', () => {
      fixture.componentRef.setInput('showDescription', false);
      fixture.detectChanges();

      const descriptionElement = fixture.nativeElement.querySelector(
        '.os-goal-progress__description'
      );
      expect(descriptionElement).toBeFalsy();
    });

    it('should render category when showCategory is true and category exists', () => {
      fixture.componentRef.setInput('showCategory', true);
      fixture.detectChanges();

      const categoryElement = fixture.nativeElement.querySelector(
        '.os-goal-progress__category-text'
      );
      expect(categoryElement).toBeTruthy();
      expect(categoryElement.textContent).toContain('Viagem');
    });

    it('should not render category when showCategory is false', () => {
      fixture.componentRef.setInput('showCategory', false);
      fixture.detectChanges();

      const categoryElement = fixture.nativeElement.querySelector(
        '.os-goal-progress__category-text'
      );
      expect(categoryElement).toBeFalsy();
    });

    it('should render icon when showIcon is true', () => {
      fixture.componentRef.setInput('showIcon', true);
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('os-icon');
      expect(iconElement).toBeTruthy();
    });

    it('should not render icon when showIcon is false', () => {
      fixture.componentRef.setInput('showIcon', false);
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('os-icon');
      expect(iconElement).toBeFalsy();
    });

    it('should render stats when showStats is true', () => {
      fixture.componentRef.setInput('showStats', true);
      fixture.detectChanges();

      const statsElement = fixture.nativeElement.querySelector('.os-goal-progress__stats');
      expect(statsElement).toBeTruthy();
    });

    it('should not render stats when showStats is false', () => {
      fixture.componentRef.setInput('showStats', false);
      fixture.detectChanges();

      const statsElement = fixture.nativeElement.querySelector('.os-goal-progress__stats');
      expect(statsElement).toBeFalsy();
    });

    it('should render actions when showActions is true and actions exist', () => {
      const actions = [{ label: 'Edit', variant: 'primary' }];
      fixture.componentRef.setInput('showActions', true);
      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      const actionsElement = fixture.nativeElement.querySelector('.os-goal-progress__actions');
      expect(actionsElement).toBeTruthy();
    });

    it('should not render actions when showActions is false', () => {
      fixture.componentRef.setInput('showActions', false);
      fixture.detectChanges();

      const actionsElement = fixture.nativeElement.querySelector('.os-goal-progress__actions');
      expect(actionsElement).toBeFalsy();
    });

    it('should apply correct CSS classes', () => {
      const goalElement = fixture.nativeElement.querySelector('.os-goal-progress');
      expect(goalElement.classList.contains('os-goal-progress')).toBe(true);
      expect(goalElement.classList.contains('os-goal-progress--default')).toBe(true);
      expect(goalElement.classList.contains('os-goal-progress--medium')).toBe(true);
      expect(goalElement.classList.contains('os-goal-progress--priority-low')).toBe(true);
    });

    it('should apply completed classes for completed goal', () => {
      const completedGoal = { ...mockGoalData, currentAmount: 20000 };
      fixture.componentRef.setInput('goalData', completedGoal);
      fixture.detectChanges();

      const goalElement = fixture.nativeElement.querySelector('.os-goal-progress');
      expect(goalElement.classList.contains('os-goal-progress--completed')).toBe(true);
    });

    it('should apply overdue classes for overdue goal', () => {
      const pastDeadline = new Date('2020-01-01');
      const overdueGoal = { ...mockGoalData, deadline: pastDeadline };
      fixture.componentRef.setInput('goalData', overdueGoal);
      fixture.detectChanges();

      const goalElement = fixture.nativeElement.querySelector('.os-goal-progress');
      expect(goalElement.classList.contains('os-goal-progress--overdue')).toBe(true);
    });

    it('should apply dark theme classes', () => {
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const goalElement = fixture.nativeElement.querySelector('.os-goal-progress');
      expect(goalElement.classList.contains('os-goal-progress--dark')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      fixture.detectChanges();
      
      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('role')).toBe('region');
      expect(hostElement.getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('should have correct title ID', () => {
      const titleElement = fixture.nativeElement.querySelector('.os-goal-progress__title');
      expect(titleElement.getAttribute('id')).toBeTruthy();
    });

    it('should have correct description ID when description exists', () => {
      fixture.componentRef.setInput('showDescription', true);
      fixture.detectChanges();

      const descriptionElement = fixture.nativeElement.querySelector(
        '.os-goal-progress__description'
      );
      expect(descriptionElement.getAttribute('id')).toBeTruthy();
    });
  });
});
