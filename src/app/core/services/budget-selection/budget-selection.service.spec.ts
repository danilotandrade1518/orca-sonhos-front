import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { BudgetDto } from '../../../../dtos/budget/budget-types';
import { BudgetSelectionService } from './budget-selection.service';

describe('BudgetSelectionService', () => {
  let service: BudgetSelectionService;

  const mockBudget: BudgetDto = {
    id: 'budget-1',
    name: 'Orçamento Pessoal',
    type: 'PERSONAL',
    participantsCount: 1,
  };

  const mockBudgets: BudgetDto[] = [
    mockBudget,
    {
      id: 'budget-2',
      name: 'Orçamento Familiar',
      type: 'SHARED',
      participantsCount: 2,
    },
  ];

  beforeEach(async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    service = TestBed.inject(BudgetSelectionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with no selected budget', () => {
      expect(service.selectedBudget()).toBeNull();
    });

    it('should initialize with empty available budgets', () => {
      expect(service.availableBudgets()).toEqual([]);
    });

    it('should initialize with loading false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should initialize with no error', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('computed signals', () => {
    it('should have hasSelectedBudget as false when no budget selected', () => {
      expect(service.hasSelectedBudget()).toBe(false);
    });

    it('should have hasSelectedBudget as true when budget selected', () => {
      service.setSelectedBudget(mockBudget);
      expect(service.hasSelectedBudget()).toBe(true);
    });

    it('should have hasAvailableBudgets as false when no budgets available', () => {
      expect(service.hasAvailableBudgets()).toBe(false);
    });

    it('should have hasAvailableBudgets as true when budgets available', () => {
      service.setAvailableBudgets(mockBudgets);
      expect(service.hasAvailableBudgets()).toBe(true);
    });

    it('should return selected budget id', () => {
      service.setSelectedBudget(mockBudget);
      expect(service.selectedBudgetId()).toBe('budget-1');
    });

    it('should return null for selected budget id when no budget selected', () => {
      expect(service.selectedBudgetId()).toBeNull();
    });

    it('should return selected budget name', () => {
      service.setSelectedBudget(mockBudget);
      expect(service.selectedBudgetName()).toBe('Orçamento Pessoal');
    });

    it('should return default name when no budget selected', () => {
      expect(service.selectedBudgetName()).toBe('Nenhum orçamento selecionado');
    });
  });

  describe('budget selection', () => {
    it('should set selected budget', () => {
      service.setSelectedBudget(mockBudget);
      expect(service.selectedBudget()).toEqual(mockBudget);
    });

    it('should clear error when setting selected budget', () => {
      service.setError('Some error');
      service.setSelectedBudget(mockBudget);
      expect(service.error()).toBeNull();
    });

    it('should set available budgets', () => {
      service.setAvailableBudgets(mockBudgets);
      expect(service.availableBudgets()).toEqual(mockBudgets);
    });

    it('should clear error when setting available budgets', () => {
      service.setError('Some error');
      service.setAvailableBudgets(mockBudgets);
      expect(service.error()).toBeNull();
    });

    it('should select budget by id when budget exists', () => {
      service.setAvailableBudgets(mockBudgets);
      const result = service.selectBudgetById('budget-1');
      expect(result).toBe(true);
      expect(service.selectedBudget()).toEqual(mockBudget);
    });

    it('should return false when selecting budget by id that does not exist', () => {
      service.setAvailableBudgets(mockBudgets);
      
      service.selectBudgetById('budget-1');
      const initialBudget = service.selectedBudget();
      const result = service.selectBudgetById('non-existent');
      expect(result).toBe(false);
      
      expect(service.selectedBudget()).toEqual(initialBudget);
    });

    it('should clear selection', () => {
      service.setSelectedBudget(mockBudget);
      service.clearSelection();
      expect(service.selectedBudget()).toBeNull();
    });
  });

  describe('loading and error states', () => {
    it('should set loading state', () => {
      service.setLoading(true);
      expect(service.isLoading()).toBe(true);
    });

    it('should set error', () => {
      service.setError('Test error');
      expect(service.error()).toBe('Test error');
    });

    it('should clear error', () => {
      service.setError('Test error');
      service.clearError();
      expect(service.error()).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      service.setSelectedBudget(mockBudget);
      service.setAvailableBudgets(mockBudgets);
      service.setLoading(true);
      service.setError('Test error');

      service.reset();

      expect(service.selectedBudget()).toBeNull();
      expect(service.availableBudgets()).toEqual([]);
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toBeNull();
    });
  });

  describe('budgetSelection computed', () => {
    it('should return complete budget selection state', () => {
      service.setSelectedBudget(mockBudget);
      service.setAvailableBudgets(mockBudgets);
      service.setLoading(true);

      const selection = service.budgetSelection();

      expect(selection.selectedBudgetId).toBe('budget-1');
      expect(selection.availableBudgets).toEqual(mockBudgets);
      expect(selection.isLoading).toBe(true);
      expect(selection.error).toBeNull();
    });
  });
});
