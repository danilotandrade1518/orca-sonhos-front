import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { GoalTrackerData, OsGoalTrackerComponent } from './os-goal-tracker.component';

describe('OsGoalTrackerComponent', () => {
  let component: OsGoalTrackerComponent;
  let fixture: ComponentFixture<OsGoalTrackerComponent>;

  const mockGoalData: GoalTrackerData = {
    id: '1',
    title: 'Viagem para Europa',
    description: 'Economizar para uma viagem de 3 meses pela Europa',
    targetAmount: 50000,
    currentAmount: 15000,
    currency: 'BRL',
    deadline: new Date('2025-12-31'), 
    startDate: new Date('2024-01-01'),
    lastUpdated: new Date('2024-06-15'),
    status: 'active',
    priority: 'high',
    category: 'Viagem',
    monthlyContribution: 5000,
    progressHistory: [
      {
        date: new Date('2024-06-15'),
        amount: 15000,
        percentage: 30,
        note: 'Depósito inicial',
      },
      {
        date: new Date('2024-05-15'),
        amount: 10000,
        percentage: 20,
        note: 'Bônus salarial',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsGoalTrackerComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsGoalTrackerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('goalData', mockGoalData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have default values', () => {
      expect(component.variant()).toBe('default');
      expect(component.size()).toBe('medium');
      expect(component.theme()).toBe('light');
      expect(component.showTimeline()).toBe(true);
      expect(component.showHistory()).toBe(true);
      expect(component.showContribution()).toBe(true);
      expect(component.showStatus()).toBe(true);
      expect(component.loading()).toBe(false);
      expect(component.clickable()).toBe(false);
    });

    it('should accept custom values', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.componentRef.setInput('showTimeline', false);
      fixture.componentRef.setInput('showHistory', false);
      fixture.componentRef.setInput('showContribution', false);
      fixture.componentRef.setInput('showStatus', false);
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      expect(component.variant()).toBe('compact');
      expect(component.size()).toBe('large');
      expect(component.theme()).toBe('dark');
      expect(component.showTimeline()).toBe(false);
      expect(component.showHistory()).toBe(false);
      expect(component.showContribution()).toBe(false);
      expect(component.showStatus()).toBe(false);
      expect(component.loading()).toBe(true);
      expect(component.clickable()).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    it('should calculate progress percentage correctly', () => {
      expect(component.progressPercentage()).toBe(30);
    });

    it('should calculate remaining amount correctly', () => {
      expect(component.remainingAmount()).toBe(35000);
    });

    it('should identify completed goals', () => {
      const completedData = { ...mockGoalData, currentAmount: 50000 };
      fixture.componentRef.setInput('goalData', completedData);
      fixture.detectChanges();
      expect(component.isCompleted()).toBe(true);
    });

    it('should identify overdue goals', () => {
      const overdueData = {
        ...mockGoalData,
        deadline: new Date('2023-12-31'),
        status: 'active' as const,
      };
      fixture.componentRef.setInput('goalData', overdueData);
      fixture.detectChanges();
      expect(component.isOverdue()).toBe(true);
    });

    it('should provide correct status info for active goals', () => {
      const statusInfo = component.statusInfo();
      expect(statusInfo.type).toBe('success');
      expect(statusInfo.label).toBe('Ativo');
      expect(statusInfo.icon).toBe('play_circle');
    });

    it('should provide correct status info for completed goals', () => {
      const completedData = { ...mockGoalData, status: 'completed' as const };
      fixture.componentRef.setInput('goalData', completedData);
      fixture.detectChanges();
      const statusInfo = component.statusInfo();
      expect(statusInfo.type).toBe('success');
      expect(statusInfo.label).toBe('Concluído');
      expect(statusInfo.icon).toBe('check_circle');
    });

    it('should provide correct priority info', () => {
      const priorityInfo = component.priorityInfo();
      expect(priorityInfo.type).toBe('error');
      expect(priorityInfo.label).toBe('Alta');
      expect(priorityInfo.color).toBe('var(--os-color-error)');
    });

    it('should provide timeline info when enabled', () => {
      const timelineInfo = component.timelineInfo();
      expect(timelineInfo).toBeTruthy();
      
      expect(timelineInfo!.start).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(timelineInfo!.deadline).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(timelineInfo!.lastUpdated).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should provide recent history when enabled', () => {
      const recentHistory = component.recentHistory();
      expect(recentHistory.length).toBe(2);
      
      expect(recentHistory[0].amount).toBe(10000); 
      expect(recentHistory[1].amount).toBe(15000); 
    });

    it('should provide contribution info when enabled', () => {
      const contributionInfo = component.contributionInfo();
      expect(contributionInfo).toBeTruthy();
      expect(contributionInfo!.monthly).toBe(5000);
      expect(contributionInfo!.monthsNeeded).toBe(7);
      expect(contributionInfo!.isFeasible).toBe(true);
    });
  });

  describe('Size Mappings', () => {
    it('should map progress size correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.progressSize()).toBe('small');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.progressSize()).toBe('medium');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.progressSize()).toBe('large');
    });

    it('should map icon size correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('sm');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('md');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('lg');
    });

    it('should map badge size correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.badgeSize()).toBe('sm');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.badgeSize()).toBe('md');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.badgeSize()).toBe('lg');
    });

    it('should map money size correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.moneySize()).toBe('small');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.moneySize()).toBe('medium');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.moneySize()).toBe('large');
    });
  });

  describe('Progress Variant', () => {
    it('should return success variant for completed goals', () => {
      const completedData = { ...mockGoalData, status: 'completed' as const };
      fixture.componentRef.setInput('goalData', completedData);
      fixture.detectChanges();
      expect(component.progressVariant()).toBe('success');
    });

    it('should return danger variant for overdue goals', () => {
      const overdueData = {
        ...mockGoalData,
        deadline: new Date('2023-12-31'),
        status: 'active' as const,
      };
      fixture.componentRef.setInput('goalData', overdueData);
      fixture.detectChanges();
      expect(component.progressVariant()).toBe('danger');
    });

    it('should return warning variant for high priority goals', () => {
      
      expect(component.progressVariant()).toBe('warning');
    });

    it('should return primary variant for normal goals', () => {
      const normalData = { ...mockGoalData, priority: 'low' as const };
      fixture.componentRef.setInput('goalData', normalData);
      fixture.detectChanges();
      expect(component.progressVariant()).toBe('primary');
    });
  });

  describe('Methods', () => {
    it('should calculate days remaining correctly', () => {
      const daysRemaining = component.getDaysRemaining();
      expect(daysRemaining).toBeGreaterThan(0); 
    });

    it('should format history date correctly', () => {
      const formattedDate = component.formatHistoryDate(new Date('2024-06-15'));
      
      expect(formattedDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should return correct status color', () => {
      const statusColor = component.getStatusColor();
      expect(statusColor).toBe('var(--os-color-success)');
    });
  });

  describe('Event Handlers', () => {
    it('should emit goalClick when card is clicked and clickable is true', () => {
      vi.spyOn(component.goalClick, 'emit');
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
      component.onCardClick();
      expect(component.goalClick.emit).toHaveBeenCalledWith(mockGoalData);
    });

    it('should not emit goalClick when clickable is false', () => {
      vi.spyOn(component.goalClick, 'emit');
      fixture.componentRef.setInput('clickable', false);
      fixture.detectChanges();
      component.onCardClick();
      expect(component.goalClick.emit).not.toHaveBeenCalled();
    });

    it('should emit refreshClick when refresh is clicked', () => {
      vi.spyOn(component.refreshClick, 'emit');
      component.onRefreshClick();
      expect(component.refreshClick.emit).toHaveBeenCalled();
    });

    it('should emit actionClick with correct action and goal', () => {
      vi.spyOn(component.actionClick, 'emit');
      component.onActionClick('pause');
      expect(component.actionClick.emit).toHaveBeenCalledWith({
        action: 'pause',
        goal: mockGoalData,
      });
    });
  });

  describe('Template Rendering', () => {
    it('should render loading state when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const loadingElement = fixture.debugElement.query(By.css('.os-goal-tracker__loading'));
      expect(loadingElement).toBeTruthy();
    });

    it('should render goal data when not loading', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('.os-goal-tracker__title'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent).toContain('Viagem para Europa');
    });

    it('should render empty state when no goal data', () => {
      fixture.componentRef.setInput('goalData', null);
      fixture.detectChanges();

      const emptyElement = fixture.debugElement.query(By.css('.os-goal-tracker__empty'));
      expect(emptyElement).toBeTruthy();
    });

    it('should apply correct CSS classes based on variant', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const cardElement = fixture.debugElement.query(By.css('.os-goal-tracker__card'));
      expect(cardElement.nativeElement.classList).toContain('os-goal-tracker__card');
    });

    it('should apply correct CSS classes based on size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const trackerElement = fixture.debugElement.query(By.css('.os-goal-tracker'));
      expect(trackerElement.nativeElement.classList).toContain('os-goal-tracker--large');
    });

    it('should apply correct CSS classes based on theme', () => {
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const trackerElement = fixture.debugElement.query(By.css('.os-goal-tracker'));
      expect(trackerElement.nativeElement.classList).toContain('os-goal-tracker--dark');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const trackerElement = fixture.debugElement.query(By.css('.os-goal-tracker'));
      
      expect(trackerElement).toBeTruthy();
    });

    it('should have proper button labels', () => {
      const actionButtons = fixture.debugElement.queryAll(By.css('.os-goal-tracker__action'));
      actionButtons.forEach((button) => {
        expect(button.nativeElement.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      const trackerElement = fixture.debugElement.query(By.css('.os-goal-tracker'));
      expect(trackerElement.nativeElement.classList).toContain('os-goal-tracker');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null goal data gracefully', () => {
      fixture.componentRef.setInput('goalData', null);
      fixture.detectChanges();
      expect(component.progressPercentage()).toBe(0);
      expect(component.remainingAmount()).toBe(0);
      expect(component.isCompleted()).toBe(false);
      expect(component.isOverdue()).toBe(false);
    });

    it('should handle zero target amount', () => {
      const zeroTargetData = { ...mockGoalData, targetAmount: 0 };
      fixture.componentRef.setInput('goalData', zeroTargetData);
      fixture.detectChanges();
      expect(component.progressPercentage()).toBe(0);
    });

    it('should handle negative remaining amount', () => {
      const overTargetData = { ...mockGoalData, currentAmount: 60000 };
      fixture.componentRef.setInput('goalData', overTargetData);
      fixture.detectChanges();
      expect(component.remainingAmount()).toBe(0);
    });

    it('should handle goals without deadline', () => {
      const noDeadlineData = { ...mockGoalData, deadline: undefined };
      fixture.componentRef.setInput('goalData', noDeadlineData);
      fixture.detectChanges();
      expect(component.isOverdue()).toBe(false);
      expect(component.getDaysRemaining()).toBe(0);
    });

    it('should handle goals without monthly contribution', () => {
      const noContributionData = { ...mockGoalData, monthlyContribution: undefined };
      fixture.componentRef.setInput('goalData', noContributionData);
      fixture.detectChanges();
      expect(component.contributionInfo()).toBeNull();
    });

    it('should handle empty progress history', () => {
      const noHistoryData = { ...mockGoalData, progressHistory: [] };
      fixture.componentRef.setInput('goalData', noHistoryData);
      fixture.detectChanges();
      expect(component.recentHistory().length).toBe(0);
    });
  });
});
