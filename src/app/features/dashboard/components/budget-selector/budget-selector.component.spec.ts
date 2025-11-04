import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BudgetDto } from '../../../../../dtos/budget/budget-types';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { BudgetSelectorComponent } from './budget-selector.component';

describe('BudgetSelectorComponent', () => {
  let component: BudgetSelectorComponent;
  let fixture: ComponentFixture<BudgetSelectorComponent>;
  let budgetSelectionService: BudgetSelectionService;

  const mockBudgets: BudgetDto[] = [
    {
      id: '1',
      name: 'Orçamento Pessoal',
      type: 'PERSONAL',
      participantsCount: 1,
    },
    {
      id: '2',
      name: 'Orçamento Família',
      type: 'SHARED',
      participantsCount: 3,
    },
  ];

  const mockSelectedBudget: BudgetDto = mockBudgets[0];

  beforeEach(async () => {
    TestBed.resetTestingModule();

    const budgetSelectionServiceSpy = {
      setSelectedBudget: vi.fn(),
      setLoading: vi.fn(),
      setAvailableBudgets: vi.fn(),
      selectedBudgetId: signal('1'),
      availableBudgets: signal(mockBudgets),
      isLoading: signal(false),
      hasAvailableBudgets: signal(true),
      selectedBudget: signal(mockSelectedBudget),
    };

    await TestBed.configureTestingModule({
      imports: [BudgetSelectorComponent],
      providers: [
        { provide: BudgetSelectionService, useValue: budgetSelectionServiceSpy },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetSelectorComponent);
    component = fixture.componentInstance;
    budgetSelectionService = TestBed.inject(BudgetSelectionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display dropdown with available budgets', () => {
    fixture.detectChanges();

    const budgetOptions = component.budgetOptions();
    expect(budgetOptions.length).toBe(2);
    expect(budgetOptions[0]).toEqual({
      id: '1',
      name: 'Orçamento Pessoal',
      description: '',
      isActive: true,
      isShared: false,
      participants: 1,
      lastModified: undefined,
      balance: undefined,
    });
    expect(budgetOptions[1]).toEqual({
      id: '2',
      name: 'Orçamento Família',
      description: '',
      isActive: true,
      isShared: true,
      participants: 3,
      lastModified: undefined,
      balance: undefined,
    });
  });

  it('should show selected budget ID', () => {
    expect(component.selectedBudgetId()).toBe('1');
  });

  it('should show available budgets', () => {
    expect(component.availableBudgets()).toEqual(mockBudgets);
  });

  it('should show loading state', () => {
    const loadingServiceSpy = {
      setSelectedBudget: vi.fn(),
      setLoading: vi.fn(),
      setAvailableBudgets: vi.fn(),
      selectedBudgetId: signal('1'),
      availableBudgets: signal(mockBudgets),
      isLoading: signal(true),
      hasAvailableBudgets: signal(true),
      selectedBudget: signal(mockSelectedBudget),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [BudgetSelectorComponent],
      providers: [
        { provide: BudgetSelectionService, useValue: loadingServiceSpy },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(BudgetSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });

  it('should show has available budgets', () => {
    expect(component.hasAvailableBudgets()).toBe(true);
  });

  it('should show selected budget', () => {
    expect(component.selectedBudget()).toEqual(mockSelectedBudget);
  });

  it('should call setSelectedBudget when budget is selected', () => {
    component.onBudgetSelected({
      id: '2',
      name: 'Orçamento Família',
      isActive: true,
      isShared: true,
      participants: 3,
    });

    expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledWith(mockBudgets[1]);
  });

  it('should emit budgetSelected when budget is selected', () => {
    const emitSpy = vi.spyOn(component.budgetSelected, 'emit');

    component.onBudgetSelected({
      id: '2',
      name: 'Orçamento Família',
      isActive: true,
      isShared: true,
      participants: 3,
    });

    expect(emitSpy).toHaveBeenCalledWith(mockBudgets[1]);
  });

  it('should call setSelectedBudget when option is selected', () => {
    const option = {
      id: '2',
      name: 'Orçamento Família',
      isActive: true,
      isShared: true,
      participants: 3,
    };

    component.onBudgetSelected(option);

    expect(budgetSelectionService.setSelectedBudget).toHaveBeenCalledWith(mockBudgets[1]);
  });

  it('should emit budgetSelected when option is selected', () => {
    const emitSpy = vi.spyOn(component.budgetSelected, 'emit');
    const option = {
      id: '2',
      name: 'Orçamento Família',
      isActive: true,
      isShared: true,
      participants: 3,
    };

    component.onBudgetSelected(option);

    expect(emitSpy).toHaveBeenCalledWith(mockBudgets[1]);
  });

  it('should not call setSelectedBudget when budget is not found', () => {
    component.onBudgetSelected({
      id: '999',
      name: 'Budget Not Found',
      isActive: true,
      isShared: false,
      participants: 1,
    });

    expect(budgetSelectionService.setSelectedBudget).not.toHaveBeenCalled();
  });

  it('should not emit budgetSelected when budget is not found', () => {
    const emitSpy = vi.spyOn(component.budgetSelected, 'emit');

    component.onBudgetSelected({
      id: '999',
      name: 'Budget Not Found',
      isActive: true,
      isShared: false,
      participants: 1,
    });

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should apply correct container classes', () => {
    fixture.detectChanges();

    const containerClass = 'os-budget-selector';
    expect(containerClass).toContain('os-budget-selector');
    expect(containerClass).not.toContain('os-budget-selector--medium');
  });

  it('should apply loading class when loading', () => {
    const loadingServiceSpy = {
      setSelectedBudget: vi.fn(),
      setLoading: vi.fn(),
      setAvailableBudgets: vi.fn(),
      selectedBudgetId: signal('1'),
      availableBudgets: signal(mockBudgets),
      isLoading: signal(true),
      hasAvailableBudgets: signal(true),
      selectedBudget: signal(mockSelectedBudget),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [BudgetSelectorComponent],
      providers: [
        { provide: BudgetSelectionService, useValue: loadingServiceSpy },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(BudgetSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const osBudgetSelectorElement =
      fixture.debugElement.nativeElement.querySelector('os-budget-selector');
    expect(osBudgetSelectorElement).toBeTruthy();
    
    const internalSelector = osBudgetSelectorElement.querySelector('.os-budget-selector');
    expect(internalSelector).toBeTruthy();
    expect(internalSelector.className).toContain('os-budget-selector--loading');
  });
  
});
