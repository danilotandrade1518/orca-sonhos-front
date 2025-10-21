import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { BudgetTrackerData, OsBudgetTrackerComponent } from './os-budget-tracker.component';

describe('OsBudgetTrackerComponent', () => {
  let component: OsBudgetTrackerComponent;
  let fixture: ComponentFixture<OsBudgetTrackerComponent>;

  const mockBudgetData: BudgetTrackerData = {
    id: 'budget-1',
    name: 'Orçamento Mensal',
    totalBudget: 5000,
    spentAmount: 3000,
    remainingAmount: 2000,
    percentage: 60,
    status: 'on-track',
    category: 'Geral',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    lastUpdated: new Date('2024-10-09'),
    monthlySpending: [
      { month: '01', year: 2024, amount: 2500, percentage: 50 },
      { month: '02', year: 2024, amount: 2800, percentage: 56 },
      { month: '03', year: 2024, amount: 3200, percentage: 64 },
      { month: '04', year: 2024, amount: 2900, percentage: 58 },
      { month: '05', year: 2024, amount: 3100, percentage: 62 },
      { month: '06', year: 2024, amount: 3000, percentage: 60 },
    ],
    trends: {
      spendingTrend: 'stable',
      projection: 3500,
      riskLevel: 'low',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsBudgetTrackerComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsBudgetTrackerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('budgetData', mockBudgetData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display budget data correctly', () => {
    const title = fixture.debugElement.query(By.css('.os-budget-tracker__title'));
    expect(title.nativeElement.textContent.trim()).toBe('Orçamento Mensal');

    const category = fixture.debugElement.query(By.css('.os-budget-tracker__category'));
    expect(category.nativeElement.textContent.trim()).toContain('Geral');
  });

  it('should display progress percentage correctly', () => {
    const progressPercentage = fixture.debugElement.query(
      By.css('.os-budget-tracker__progress-percentage')
    );
    expect(progressPercentage.nativeElement.textContent.trim()).toBe('60%');
  });

  it('should display status badge correctly', () => {
    const statusBadge = fixture.debugElement.query(By.css('os-badge'));
    expect(statusBadge).toBeTruthy();
  });

  it('should display financial amounts correctly', () => {
    const amountGroups = fixture.debugElement.queryAll(By.css('.os-budget-tracker__amount'));
    expect(amountGroups.length).toBe(3);

    const labels = fixture.debugElement.queryAll(By.css('.os-budget-tracker__amount-label'));
    expect(labels[0].nativeElement.textContent.trim()).toBe('Orçamento Total');
    expect(labels[1].nativeElement.textContent.trim()).toBe('Gasto');
    expect(labels[2].nativeElement.textContent.trim()).toBe('Restante');
  });

  it('should display trends section when showTrends is true', () => {
    fixture.componentRef.setInput('showTrends', true);
    fixture.detectChanges();

    const trendsSection = fixture.debugElement.query(By.css('.os-budget-tracker__trends'));
    expect(trendsSection).toBeTruthy();
  });

  it('should display projections section when showProjections is true', () => {
    fixture.componentRef.setInput('showProjections', true);
    fixture.detectChanges();

    const projectionsSection = fixture.debugElement.query(
      By.css('.os-budget-tracker__projections')
    );
    expect(projectionsSection).toBeTruthy();
  });

  it('should display monthly chart for detailed variant', () => {
    fixture.componentRef.setInput('variant', 'detailed');
    fixture.componentRef.setInput('showCharts', true);
    fixture.detectChanges();

    const chartSection = fixture.debugElement.query(By.css('.os-budget-tracker__chart'));
    expect(chartSection).toBeTruthy();
  });

  it('should display dates section for detailed variant', () => {
    fixture.componentRef.setInput('variant', 'detailed');
    fixture.detectChanges();

    const datesSection = fixture.debugElement.query(By.css('.os-budget-tracker__dates'));
    expect(datesSection).toBeTruthy();
  });

  it('should display compact info for compact variant', () => {
    fixture.componentRef.setInput('variant', 'compact');
    fixture.detectChanges();

    const compactInfo = fixture.debugElement.query(By.css('.os-budget-tracker__compact-info'));
    expect(compactInfo).toBeTruthy();
  });

  it('should show loading state when loading is true', () => {
    fixture.componentRef.setInput('budgetData', null);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.os-budget-tracker--loading'));
    expect(loadingElement).toBeTruthy();

    const spinner = fixture.debugElement.query(By.css('os-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should emit budgetClick event when card is clicked and clickable is true', () => {
    fixture.componentRef.setInput('clickable', true);
    vi.spyOn(component.budgetClick, 'emit');

    const card = fixture.debugElement.query(By.css('os-card'));
    card.triggerEventHandler('click', null);

    expect(component.budgetClick.emit).toHaveBeenCalledWith(mockBudgetData);
  });

  it('should emit refreshClick event when refresh button is clicked', () => {
    vi.spyOn(component.refreshClick, 'emit');

    const refreshButton = fixture.debugElement.query(By.css('.os-budget-tracker__action-btn'));
    refreshButton.triggerEventHandler('click', null);

    expect(component.refreshClick.emit).toHaveBeenCalled();
  });

  it('should emit exportClick event when export button is clicked', () => {
    vi.spyOn(component.exportClick, 'emit');

    const exportButton = fixture.debugElement.queryAll(By.css('.os-budget-tracker__action-btn'))[1];
    exportButton.triggerEventHandler('click', null);

    expect(component.exportClick.emit).toHaveBeenCalled();
  });

  it('should calculate progress percentage correctly', () => {
    expect(component.progressPercentage()).toBe(60);
  });

  it('should determine status info correctly', () => {
    const statusInfo = component.statusInfo();
    expect(statusInfo.type).toBe('success');
    expect(statusInfo.label).toBe('No Prazo');
    expect(statusInfo.icon).toBe('check_circle');
  });

  it('should determine if over budget correctly', () => {
    expect(component.isOverBudget()).toBe(false);

    fixture.componentRef.setInput('budgetData', { ...mockBudgetData, spentAmount: 6000 });
    expect(component.isOverBudget()).toBe(true);
  });

  it('should determine if completed correctly', () => {
    expect(component.isCompleted()).toBe(false);

    fixture.componentRef.setInput('budgetData', { ...mockBudgetData, status: 'completed' });
    expect(component.isCompleted()).toBe(true);
  });

  it('should calculate trend info correctly', () => {
    fixture.componentRef.setInput('showTrends', true);
    fixture.detectChanges();

    const trendInfo = component.trendInfo();
    expect(trendInfo).toBeTruthy();
    expect(trendInfo?.icon).toBe('trending_flat');
    expect(trendInfo?.label).toBe('Estável');
    expect(trendInfo?.riskLevel).toBe('low');
  });

  it('should calculate projection info correctly', () => {
    fixture.componentRef.setInput('showProjections', true);
    fixture.detectChanges();

    const projectionInfo = component.projectionInfo();
    expect(projectionInfo).toBeTruthy();
    expect(projectionInfo?.value).toBe(3500);
    expect(projectionInfo?.isOver).toBe(true);
  });

  it('should format dates correctly', () => {
    const formattedDates = component.formattedDates();
    expect(formattedDates).toBeTruthy();
    expect(formattedDates?.start).toBe('31/12/2023');
    expect(formattedDates?.end).toBe('30/12/2024');
  });

  it('should get month name correctly', () => {
    expect(component.getMonthName('01')).toBe('Jan');
    expect(component.getMonthName('12')).toBe('Dez');
  });

  it('should apply correct CSS classes based on variant and size', () => {
    fixture.componentRef.setInput('variant', 'compact');
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('os-card'));
    expect(card.nativeElement.classList.contains('os-budget-tracker--compact')).toBe(true);
    expect(card.nativeElement.classList.contains('os-budget-tracker--large')).toBe(true);
  });

  it('should handle over budget status correctly', () => {
    fixture.componentRef.setInput('budgetData', { ...mockBudgetData, status: 'over-budget' });
    fixture.detectChanges();

    const statusInfo = component.statusInfo();
    expect(statusInfo.type).toBe('error');
    expect(statusInfo.label).toBe('Acima do Orçamento');
    expect(statusInfo.icon).toBe('warning');
  });

  it('should handle under budget status correctly', () => {
    fixture.componentRef.setInput('budgetData', { ...mockBudgetData, status: 'under-budget' });
    fixture.detectChanges();

    const statusInfo = component.statusInfo();
    expect(statusInfo.type).toBe('warning');
    expect(statusInfo.label).toBe('Abaixo do Orçamento');
    expect(statusInfo.icon).toBe('info');
  });

  it('should handle completed status correctly', () => {
    fixture.componentRef.setInput('budgetData', { ...mockBudgetData, status: 'completed' });
    fixture.detectChanges();

    const statusInfo = component.statusInfo();
    expect(statusInfo.type).toBe('success');
    expect(statusInfo.label).toBe('Concluído');
    expect(statusInfo.icon).toBe('check');
  });

  it('should display monthly data correctly', () => {
    fixture.componentRef.setInput('variant', 'detailed');
    fixture.componentRef.setInput('showCharts', true);
    fixture.detectChanges();

    const monthlyData = component.monthlyData();
    expect(monthlyData.length).toBe(6);
    expect(monthlyData[0].month).toBe('01');
    expect(monthlyData[0].year).toBe(2024);
  });

  it('should handle empty budget data gracefully', () => {
    fixture.componentRef.setInput('budgetData', null);
    fixture.detectChanges();

    expect(component.progressPercentage()).toBe(0);
    expect(component.isOverBudget()).toBe(false);
    expect(component.isCompleted()).toBe(false);
  });

  it('should have proper ARIA attributes for accessibility', () => {
    const refreshButton = fixture.debugElement.query(By.css('.os-budget-tracker__action-btn'));
    expect(refreshButton.nativeElement.getAttribute('aria-label')).toBe(
      'Atualizar dados do orçamento'
    );

    const exportButton = fixture.debugElement.queryAll(By.css('.os-budget-tracker__action-btn'))[1];
    expect(exportButton.nativeElement.getAttribute('aria-label')).toBe(
      'Exportar dados do orçamento'
    );
  });

  it('should apply correct status colors', () => {
    fixture.componentRef.setInput('budgetData', { ...mockBudgetData, status: 'over-budget' });
    fixture.detectChanges();

    const statusColor = component.getStatusColor();
    expect(statusColor).toBe('var(--os-color-error)');
  });

  it('should handle different trend types correctly', () => {
    fixture.componentRef.setInput('budgetData', {
      ...mockBudgetData,
      trends: {
        spendingTrend: 'increasing',
        projection: 4000,
        riskLevel: 'high',
      },
    });
    fixture.componentRef.setInput('showTrends', true);
    fixture.detectChanges();

    const trendInfo = component.trendInfo();
    expect(trendInfo?.icon).toBe('trending_up');
    expect(trendInfo?.label).toBe('Crescendo');
    expect(trendInfo?.riskLevel).toBe('high');
  });

  it('should display chart bars with correct heights', () => {
    fixture.componentRef.setInput('variant', 'detailed');
    fixture.componentRef.setInput('showCharts', true);
    fixture.detectChanges();

    const chartBars = fixture.debugElement.queryAll(By.css('.os-budget-tracker__chart-bar-fill'));
    expect(chartBars.length).toBe(6);

    // Check if bars have correct height percentages
    chartBars.forEach((bar, index) => {
      const expectedHeight = component.monthlyData()[index].percentage;
      expect(bar.nativeElement.style.height).toBe(`${expectedHeight}%`);
    });
  });

  it('should apply high spending class for bars over 80%', () => {
    fixture.componentRef.setInput('budgetData', {
      ...mockBudgetData,
      monthlySpending: [
        { month: '01', year: 2024, amount: 4000, percentage: 85 },
        { month: '02', year: 2024, amount: 3000, percentage: 60 },
      ],
    });
    fixture.componentRef.setInput('variant', 'detailed');
    fixture.componentRef.setInput('showCharts', true);
    fixture.detectChanges();

    const chartBars = fixture.debugElement.queryAll(By.css('.os-budget-tracker__chart-bar-fill'));
    expect(
      chartBars[0].nativeElement.classList.contains('os-budget-tracker__chart-bar-fill--high')
    ).toBe(true);
    expect(
      chartBars[1].nativeElement.classList.contains('os-budget-tracker__chart-bar-fill--high')
    ).toBe(false);
  });
});
