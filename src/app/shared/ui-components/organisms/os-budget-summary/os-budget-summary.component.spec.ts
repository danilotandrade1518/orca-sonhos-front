import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { OsBudgetSummaryComponent, BudgetSummaryData } from './os-budget-summary.component';

describe('OsBudgetSummaryComponent', () => {
  let component: OsBudgetSummaryComponent;
  let fixture: ComponentFixture<OsBudgetSummaryComponent>;

  const mockBudgetData: BudgetSummaryData = {
    id: 'budget-1',
    name: 'Orçamento Mensal',
    totalBudget: 5000,
    spentAmount: 3000,
    remainingAmount: 2000,
    percentage: 60,
    status: 'on-track',
    category: 'Pessoal',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    lastUpdated: new Date('2024-01-15'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsBudgetSummaryComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsBudgetSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('budgetData', mockBudgetData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should accept budgetData input', () => {
      expect(component.budgetData()).toEqual(mockBudgetData);
    });

    it('should set default variant to default', () => {
      expect(component.variant()).toBe('default');
    });

    it('should set default size to medium', () => {
      expect(component.size()).toBe('medium');
    });

    it('should set default showProgress to true', () => {
      expect(component.showProgress()).toBe(true);
    });

    it('should set default showStatus to true', () => {
      expect(component.showStatus()).toBe(true);
    });

    it('should set default showDates to false', () => {
      expect(component.showDates()).toBe(false);
    });

    it('should set default clickable to false', () => {
      expect(component.clickable()).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('should calculate progress percentage correctly', () => {
      expect(component.progressPercentage()).toBe(60);
    });

    it('should clamp progress percentage between 0 and 100', () => {
      const overBudgetData = { ...mockBudgetData, percentage: 150 };
      fixture.componentRef.setInput('budgetData', overBudgetData);
      expect(component.progressPercentage()).toBe(100);

      const negativeData = { ...mockBudgetData, percentage: -10 };
      fixture.componentRef.setInput('budgetData', negativeData);
      expect(component.progressPercentage()).toBe(0);
    });

    it('should determine status info correctly for on-track', () => {
      const statusInfo = component.statusInfo();
      expect(statusInfo.type).toBe('success');
      expect(statusInfo.label).toBe('No Prazo');
      expect(statusInfo.icon).toBe('check_circle');
    });

    it('should determine status info correctly for over-budget', () => {
      const overBudgetData = { ...mockBudgetData, status: 'over-budget' as const };
      fixture.componentRef.setInput('budgetData', overBudgetData);
      const statusInfo = component.statusInfo();
      expect(statusInfo.type).toBe('error');
      expect(statusInfo.label).toBe('Acima do Orçamento');
      expect(statusInfo.icon).toBe('warning');
    });

    it('should determine status info correctly for under-budget', () => {
      const underBudgetData = { ...mockBudgetData, status: 'under-budget' as const };
      fixture.componentRef.setInput('budgetData', underBudgetData);
      const statusInfo = component.statusInfo();
      expect(statusInfo.type).toBe('warning');
      expect(statusInfo.label).toBe('Abaixo do Orçamento');
      expect(statusInfo.icon).toBe('info');
    });

    it('should determine status info correctly for completed', () => {
      const completedData = { ...mockBudgetData, status: 'completed' as const };
      fixture.componentRef.setInput('budgetData', completedData);
      const statusInfo = component.statusInfo();
      expect(statusInfo.type).toBe('success');
      expect(statusInfo.label).toBe('Concluído');
      expect(statusInfo.icon).toBe('check');
    });

    it('should determine if over budget correctly', () => {
      expect(component.isOverBudget()).toBe(false);

      const overBudgetData = { ...mockBudgetData, spentAmount: 6000 };
      fixture.componentRef.setInput('budgetData', overBudgetData);
      expect(component.isOverBudget()).toBe(true);
    });

    it('should determine if completed correctly', () => {
      expect(component.isCompleted()).toBe(false);

      const completedData = { ...mockBudgetData, status: 'completed' as const };
      fixture.componentRef.setInput('budgetData', completedData);
      expect(component.isCompleted()).toBe(true);
    });

    it('should format dates correctly when showDates is true', () => {
      fixture.componentRef.setInput('showDates', true);
      const formattedDates = component.formattedDates();

      expect(formattedDates).toBeTruthy();
      expect(formattedDates?.start).toBe('31/12/2023');
      expect(formattedDates?.end).toBe('30/01/2024');
      expect(formattedDates?.lastUpdated).toBe('14/01/2024');
    });

    it('should return null for formattedDates when showDates is false', () => {
      expect(component.formattedDates()).toBeNull();
    });
  });

  describe('Methods', () => {
    it('should handle card click when clickable is true', () => {
      fixture.componentRef.setInput('clickable', true);
      
      expect(() => component.onCardClick()).not.toThrow();
    });

    it('should not handle card click when clickable is false', () => {
      fixture.componentRef.setInput('clickable', false);
      
      expect(() => component.onCardClick()).not.toThrow();
    });

    it('should return correct status color for success', () => {
      const color = component.getStatusColor();
      expect(color).toBe('var(--os-color-success)');
    });

    it('should return correct status color for error', () => {
      const errorData = { ...mockBudgetData, status: 'over-budget' as const };
      fixture.componentRef.setInput('budgetData', errorData);

      const color = component.getStatusColor();
      expect(color).toBe('var(--os-color-error)');
    });
  });

  describe('Template Rendering', () => {
    it('should render budget data when provided', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.os-budget-summary__title').textContent).toContain(
        'Orçamento Mensal'
      );
    });

    it('should not render when budgetData is null', () => {
      fixture.componentRef.setInput('budgetData', null);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.os-budget-summary')).toBeNull();
    });

    it('should apply correct CSS classes for variant', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.os-budget-summary--compact')).toBeTruthy();
    });

    it('should apply correct CSS classes for size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.os-budget-summary--large')).toBeTruthy();
    });

    it('should show progress section when showProgress is true', () => {
      fixture.componentRef.setInput('showProgress', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.os-budget-summary__progress')).toBeTruthy();
    });

    it('should hide progress section when showProgress is false', () => {
      fixture.componentRef.setInput('showProgress', false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.os-budget-summary__progress')).toBeNull();
    });

    it('should show status badge when showStatus is true', () => {
      fixture.componentRef.setInput('showStatus', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('os-badge')).toBeTruthy();
    });

    it('should hide status badge when showStatus is false', () => {
      fixture.componentRef.setInput('showStatus', false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('os-badge')).toBeNull();
    });

    it('should show dates section for detailed variant when showDates is true', () => {
      fixture.componentRef.setInput('variant', 'detailed');
      fixture.componentRef.setInput('showDates', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.os-budget-summary__dates')).toBeTruthy();
    });

    it('should show compact info for compact variant', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.os-budget-summary__compact-info')).toBeTruthy();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle different screen sizes', () => {
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.os-budget-summary')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null budgetData gracefully', () => {
      fixture.componentRef.setInput('budgetData', null);
      fixture.detectChanges();

      expect(component.progressPercentage()).toBe(0);
      expect(component.isOverBudget()).toBe(false);
      expect(component.isCompleted()).toBe(false);
    });

    it('should handle zero values correctly', () => {
      const zeroData = { ...mockBudgetData, totalBudget: 0, spentAmount: 0, percentage: 0 };
      fixture.componentRef.setInput('budgetData', zeroData);

      expect(component.progressPercentage()).toBe(0);
      expect(component.isOverBudget()).toBe(false);
    });

    it('should handle negative remaining amount', () => {
      const negativeData = { ...mockBudgetData, spentAmount: 6000, remainingAmount: -1000 };
      fixture.componentRef.setInput('budgetData', negativeData);

      expect(component.isOverBudget()).toBe(true);
    });
  });

  describe('New Features', () => {
    describe('Chart Data', () => {
      it('should calculate chart data correctly', () => {
        fixture.componentRef.setInput('showChart', true);
        const chartData = component.chartData();

        expect(chartData).toBeTruthy();
        expect(chartData?.spent.value).toBe(3000);
        expect(chartData?.remaining.value).toBe(2000);
        expect(chartData?.spent.percentage).toBe(60);
        expect(chartData?.remaining.percentage).toBe(40);
      });

      it('should return null when showChart is false', () => {
        fixture.componentRef.setInput('showChart', false);
        expect(component.chartData()).toBeNull();
      });

      it('should handle over-budget chart data', () => {
        const overBudgetData = { ...mockBudgetData, spentAmount: 6000, remainingAmount: -1000 };
        fixture.componentRef.setInput('budgetData', overBudgetData);
        fixture.componentRef.setInput('showChart', true);

        const chartData = component.chartData();
        expect(chartData?.overBudget.value).toBe(1000);
        expect(chartData?.remaining.value).toBe(0);
      });
    });

    describe('Aria Label', () => {
      it('should generate effective aria label from data', () => {
        const ariaLabel = component.effectiveAriaLabel();
        expect(ariaLabel).toContain('Orçamento Mensal');
        expect(ariaLabel).toContain('60%');
        expect(ariaLabel).toContain('on-track');
      });

      it('should use custom aria label when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom Budget Summary');
        expect(component.effectiveAriaLabel()).toBe('Custom Budget Summary');
      });

      it('should return default label when no data', () => {
        fixture.componentRef.setInput('budgetData', null);
        expect(component.effectiveAriaLabel()).toBe('Resumo de orçamento');
      });
    });

    describe('Card Classes', () => {
      it('should generate correct card classes', () => {
        const classes = component.cardClasses();
        expect(classes).toContain('os-budget-summary');
        expect(classes).toContain('os-budget-summary--default');
        expect(classes).toContain('os-budget-summary--medium');
      });

      it('should include clickable class when clickable', () => {
        fixture.componentRef.setInput('clickable', true);
        const classes = component.cardClasses();
        expect(classes).toContain('os-budget-summary--clickable');
      });

      it('should include loading class when loading', () => {
        fixture.componentRef.setInput('loading', true);
        const classes = component.cardClasses();
        expect(classes).toContain('os-budget-summary--loading');
      });

      it('should include animated class when animated', () => {
        fixture.componentRef.setInput('animated', true);
        const classes = component.cardClasses();
        expect(classes).toContain('os-budget-summary--animated');
      });
    });

    describe('Chart Methods', () => {
      it('should return correct chart type for compact variant', () => {
        fixture.componentRef.setInput('variant', 'compact');
        expect(component.getChartType()).toBe('pie');
      });

      it('should return correct chart type for default variant', () => {
        fixture.componentRef.setInput('variant', 'default');
        expect(component.getChartType()).toBe('bar');
      });

      it('should emit chart click event', () => {
        const emitSpy = vi.spyOn(component.chartClicked, 'emit');
        component.onChartClick('pie');
        expect(emitSpy).toHaveBeenCalledWith({ type: 'pie', data: mockBudgetData });
      });
    });

    describe('Total Highlight', () => {
      it('should return highlight class when highlightTotals is true', () => {
        fixture.componentRef.setInput('highlightTotals', true);
        expect(component.getTotalHighlightClass()).toBe('os-budget-summary__total--highlighted');
      });

      it('should return empty string when highlightTotals is false', () => {
        fixture.componentRef.setInput('highlightTotals', false);
        expect(component.getTotalHighlightClass()).toBe('');
      });
    });

    describe('Output Events', () => {
      it('should emit cardClicked when card is clicked and clickable', () => {
        const emitSpy = vi.spyOn(component.cardClicked, 'emit');
        fixture.componentRef.setInput('clickable', true);
        component.onCardClick();
        expect(emitSpy).toHaveBeenCalledWith(mockBudgetData);
      });

      it('should not emit cardClicked when not clickable', () => {
        const emitSpy = vi.spyOn(component.cardClicked, 'emit');
        fixture.componentRef.setInput('clickable', false);
        component.onCardClick();
        expect(emitSpy).not.toHaveBeenCalled();
      });
    });

    describe('Loading State', () => {
      it('should show loading state when loading is true', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.os-budget-summary__loading')).toBeTruthy();
        expect(compiled.querySelector('.os-budget-summary__skeleton')).toBeTruthy();
      });

      it('should not show loading state when loading is false', () => {
        fixture.componentRef.setInput('loading', false);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.os-budget-summary__loading')).toBeNull();
      });
    });

    describe('Chart Rendering', () => {
      it('should show chart when showChart is true', () => {
        fixture.componentRef.setInput('showChart', true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.os-budget-summary__chart')).toBeTruthy();
      });

      it('should not show chart when showChart is false', () => {
        fixture.componentRef.setInput('showChart', false);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.os-budget-summary__chart')).toBeNull();
      });

      it('should show pie chart for compact variant', () => {
        fixture.componentRef.setInput('variant', 'compact');
        fixture.componentRef.setInput('showChart', true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.os-budget-summary__pie-chart')).toBeTruthy();
        expect(compiled.querySelector('.os-budget-summary__bar-chart')).toBeNull();
      });

      it('should show bar chart for default variant', () => {
        fixture.componentRef.setInput('variant', 'default');
        fixture.componentRef.setInput('showChart', true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.os-budget-summary__bar-chart')).toBeTruthy();
        expect(compiled.querySelector('.os-budget-summary__pie-chart')).toBeNull();
      });
    });

    describe('Accessibility', () => {
      it('should have correct ARIA attributes', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const card = compiled.querySelector('os-card');

        expect(card.getAttribute('role')).toBe('region');
        expect(card.getAttribute('aria-label')).toContain('Orçamento Mensal');
      });

      it('should have chart toggle with correct ARIA label', () => {
        fixture.componentRef.setInput('showChart', true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        const toggle = compiled.querySelector('.os-budget-summary__chart-toggle');
        expect(toggle.getAttribute('aria-label')).toBe('Alternar tipo de gráfico');
      });

      it('should have loading state with correct ARIA attributes', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        const loading = compiled.querySelector('.os-budget-summary__loading');
        expect(loading.getAttribute('aria-live')).toBe('polite');
        expect(loading.getAttribute('aria-label')).toBe('Carregando dados do orçamento');
      });
    });
  });
});
