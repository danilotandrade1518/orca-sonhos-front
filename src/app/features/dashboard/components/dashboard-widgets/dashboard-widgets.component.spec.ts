import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardWidgetsComponent } from './dashboard-widgets.component';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { DashboardDataService } from '../../services/dashboard-data.service';
import { BudgetDto } from '../../../../../dtos/budget/budget-types';
import { WidgetConfiguration } from '../../types/dashboard.types';

describe('DashboardWidgetsComponent', () => {
  let component: DashboardWidgetsComponent;
  let fixture: ComponentFixture<DashboardWidgetsComponent>;

  const mockBudget: BudgetDto = {
    id: 'budget-1',
    name: 'Orçamento Pessoal',
    type: 'PERSONAL',
    participantsCount: 1,
  };

  const mockBudgetOverview = {
    id: 'budget-1',
    name: 'Orçamento Pessoal',
    type: 'PERSONAL' as const,
    participants: [],
    totals: {
      accountsBalance: 5000,
      monthIncome: 3000,
      monthExpense: 2000,
      netMonth: 1000,
    },
    accounts: [],
  };

  const mockWidgets: WidgetConfiguration[] = [
    {
      id: 'widget-1',
      type: 'budget-summary',
      size: 'medium',
      position: { row: 1, column: 1 },
      title: 'Resumo do Orçamento',
      enabled: true,
    },
    {
      id: 'widget-2',
      type: 'goal-progress',
      size: 'small',
      position: { row: 1, column: 2 },
      title: 'Progresso das Metas',
      enabled: true,
    },
  ];

  beforeEach(async () => {
    TestBed.resetTestingModule();

    const budgetSelectionServiceSpy = {
      selectedBudget: signal(mockBudget),
      hasSelectedBudget: signal(true),
    };

    const dashboardDataServiceSpy = {
      budgetOverview: signal(mockBudgetOverview),
      goals: signal([]),
      isLoading: signal(false),
      error: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardWidgetsComponent],
      providers: [
        { provide: BudgetSelectionService, useValue: budgetSelectionServiceSpy },
        { provide: DashboardDataService, useValue: dashboardDataServiceSpy },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display widgets when budget is selected', () => {
    fixture.componentRef.setInput('widgets', mockWidgets);
    fixture.detectChanges();

    expect(component.selectedBudget()).toEqual(mockBudget);
    expect(component.hasSelectedBudget()).toBe(true);
    expect(component.widgets()).toEqual(mockWidgets);
  });

  it('should show loading state', () => {
    const loadingServiceSpy = {
      budgetOverview: signal(mockBudgetOverview),
      goals: signal([]),
      isLoading: signal(true),
      error: signal(null),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DashboardWidgetsComponent],
      providers: [
        {
          provide: BudgetSelectionService,
          useValue: { selectedBudget: signal(mockBudget), hasSelectedBudget: signal(true) },
        },
        { provide: DashboardDataService, useValue: loadingServiceSpy },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });

  it('should show error state', () => {
    const errorServiceSpy = {
      budgetOverview: signal(mockBudgetOverview),
      goals: signal([]),
      isLoading: signal(false),
      error: signal('Erro ao carregar dados'),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DashboardWidgetsComponent],
      providers: [
        {
          provide: BudgetSelectionService,
          useValue: { selectedBudget: signal(mockBudget), hasSelectedBudget: signal(true) },
        },
        { provide: DashboardDataService, useValue: errorServiceSpy },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.hasError()).toBe(true);
    expect(component.errorMessage()).toBe('Erro ao carregar dados');
  });

  it('should show empty state when no budget selected', () => {
    const emptyBudgetServiceSpy = {
      selectedBudget: signal(null),
      hasSelectedBudget: signal(false),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DashboardWidgetsComponent],
      providers: [
        { provide: BudgetSelectionService, useValue: emptyBudgetServiceSpy },
        {
          provide: DashboardDataService,
          useValue: {
            budgetOverview: signal(mockBudgetOverview),
            goals: signal([]),
            isLoading: signal(false),
            error: signal(null),
          },
        },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.hasSelectedBudget()).toBe(false);
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1234.56);
    expect(formatted).toMatch(/R\$\s*1\.234,56/);
  });

  it('should apply correct container classes', () => {
    fixture.detectChanges();

    const containerClass = 'os-dashboard-widgets';
    expect(containerClass).toContain('os-dashboard-widgets');
  });

  it('should apply loading class when loading', () => {
    const loadingServiceSpy = {
      budgetOverview: signal(mockBudgetOverview),
      goals: signal([]),
      isLoading: signal(true),
      error: signal(null),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DashboardWidgetsComponent],
      providers: [
        {
          provide: BudgetSelectionService,
          useValue: { selectedBudget: signal(mockBudget), hasSelectedBudget: signal(true) },
        },
        { provide: DashboardDataService, useValue: loadingServiceSpy },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const osDashboardWidgetsElement =
      fixture.debugElement.nativeElement.querySelector('os-dashboard-widgets');
    expect(osDashboardWidgetsElement).toBeTruthy();
    
    const internalWidgets = osDashboardWidgetsElement.querySelector('.os-dashboard-widgets');
    expect(internalWidgets).toBeTruthy();
    expect(internalWidgets.className).toContain('os-dashboard-widgets--loading');
  });

  it('should apply error class when error', () => {
    const errorServiceSpy = {
      budgetOverview: signal(mockBudgetOverview),
      goals: signal([]),
      isLoading: signal(false),
      error: signal('Error message'),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DashboardWidgetsComponent],
      providers: [
        {
          provide: BudgetSelectionService,
          useValue: { selectedBudget: signal(mockBudget), hasSelectedBudget: signal(true) },
        },
        { provide: DashboardDataService, useValue: errorServiceSpy },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const osDashboardWidgetsElement =
      fixture.debugElement.nativeElement.querySelector('os-dashboard-widgets');
    expect(osDashboardWidgetsElement).toBeTruthy();
    
    const internalWidgets = osDashboardWidgetsElement.querySelector('.os-dashboard-widgets');
    expect(internalWidgets).toBeTruthy();
    expect(internalWidgets.className).toContain('os-dashboard-widgets--error');
  });

  it('should apply empty class when no budget selected', () => {
    const emptyBudgetServiceSpy = {
      selectedBudget: signal(null),
      hasSelectedBudget: signal(false),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DashboardWidgetsComponent],
      providers: [
        { provide: BudgetSelectionService, useValue: emptyBudgetServiceSpy },
        {
          provide: DashboardDataService,
          useValue: {
            budgetOverview: signal(mockBudgetOverview),
            goals: signal([]),
            isLoading: signal(false),
            error: signal(null),
          },
        },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const osDashboardWidgetsElement =
      fixture.debugElement.nativeElement.querySelector('os-dashboard-widgets');
    expect(osDashboardWidgetsElement).toBeTruthy();
    
    const internalWidgets = osDashboardWidgetsElement.querySelector('.os-dashboard-widgets');
    expect(internalWidgets).toBeTruthy();
    expect(internalWidgets.className).toContain('os-dashboard-widgets--empty');
  });

  it('should generate correct widget class', () => {
    const widget = mockWidgets[0];
    const widgetClass = component.widgetClass(widget);

    expect(widgetClass).toContain('os-dashboard-widgets__widget');
    expect(widgetClass).toContain('os-dashboard-widgets__widget--medium');
    expect(widgetClass).toContain('os-dashboard-widgets__widget--budget-summary');
  });

  it('should generate correct grid column for widget', () => {
    const smallWidget = { ...mockWidgets[0], size: 'small' as const };
    const mediumWidget = { ...mockWidgets[0], size: 'medium' as const };
    const largeWidget = { ...mockWidgets[0], size: 'large' as const };
    const fullWidget = { ...mockWidgets[0], size: 'full-width' as const };

    expect(component.getWidgetGridColumn(smallWidget)).toBe('span 3');
    expect(component.getWidgetGridColumn(mediumWidget)).toBe('span 6');
    expect(component.getWidgetGridColumn(largeWidget)).toBe('span 9');
    expect(component.getWidgetGridColumn(fullWidget)).toBe('span 12');
  });

  it('should generate correct grid row for widget', () => {
    const widget = mockWidgets[0];
    const gridRow = component.getWidgetGridRow(widget);

    expect(gridRow).toBe('row 1');
  });

  it('should emit retryRequested when retry is clicked', () => {
    const emitSpy = vi.spyOn(component.retryRequested, 'emit');

    component.onRetry();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit widgetClick when widget is clicked', () => {
    const emitSpy = vi.spyOn(component.widgetClick, 'emit');
    const widget = mockWidgets[0];

    component.onWidgetClick(widget);

    expect(emitSpy).toHaveBeenCalledWith(widget);
  });

  it('should show budget overview data in budget-summary widget', () => {
    fixture.componentRef.setInput('widgets', [mockWidgets[0]]);
    fixture.detectChanges();

    expect(component.budgetOverview()).toEqual(mockBudgetOverview);
  });

  it('should handle different widget types', () => {
    const allWidgetTypes: WidgetConfiguration[] = [
      {
        id: '1',
        type: 'budget-summary',
        size: 'medium',
        position: { row: 1, column: 1 },
        title: 'Budget Summary',
        enabled: true,
      },
      {
        id: '2',
        type: 'goal-progress',
        size: 'medium',
        position: { row: 1, column: 2 },
        title: 'Goal Progress',
        enabled: true,
      },
      {
        id: '3',
        type: 'transaction-list',
        size: 'medium',
        position: { row: 2, column: 1 },
        title: 'Transaction List',
        enabled: true,
      },
      {
        id: '4',
        type: 'account-balance',
        size: 'medium',
        position: { row: 2, column: 2 },
        title: 'Account Balance',
        enabled: true,
      },
      {
        id: '5',
        type: 'monthly-trends',
        size: 'medium',
        position: { row: 3, column: 1 },
        title: 'Monthly Trends',
        enabled: true,
      },
      {
        id: '6',
        type: 'quick-actions',
        size: 'medium',
        position: { row: 3, column: 2 },
        title: 'Quick Actions',
        enabled: true,
      },
    ];

    fixture.componentRef.setInput('widgets', allWidgetTypes);
    fixture.detectChanges();

    allWidgetTypes.forEach((widget) => {
      const widgetClass = component.widgetClass(widget);
      expect(widgetClass).toContain(`os-dashboard-widgets__widget--${widget.type}`);
    });
  });
});
