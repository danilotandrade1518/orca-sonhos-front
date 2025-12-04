import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EnvelopeDto } from '../../../../../dtos/envelope';
import { BudgetSelectionService } from '../../budget-selection/budget-selection.service';
import { EnvelopesApiService } from '../envelopes-api/envelopes-api.service';
import { EnvelopeState } from './envelope.state';

describe('EnvelopeState', () => {
  let envelopeState: EnvelopeState;
  let envelopesApiService: {
    listEnvelopes: ReturnType<typeof vi.fn>;
    createEnvelope: ReturnType<typeof vi.fn>;
    updateEnvelope: ReturnType<typeof vi.fn>;
    deleteEnvelope: ReturnType<typeof vi.fn>;
  };
  let budgetSelectionService: {
    selectedBudgetId: ReturnType<typeof vi.fn>;
  };

  const mockEnvelopes: EnvelopeDto[] = [
    {
      id: 'envelope-1',
      name: 'Alimentação',
      budgetId: 'budget-1',
      categoryId: 'category-groceries',
      categoryName: 'Alimentação',
      limit: 80000,
      currentUsage: 45000,
      usagePercentage: 56.25,
      active: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-12-03T00:00:00Z',
    },
    {
      id: 'envelope-2',
      name: 'Transporte',
      budgetId: 'budget-1',
      categoryId: 'category-transport',
      categoryName: 'Transporte',
      limit: 30000,
      currentUsage: 35000,
      usagePercentage: 116.67,
      active: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-12-03T00:00:00Z',
    },
    {
      id: 'envelope-3',
      name: 'Lazer',
      budgetId: 'budget-1',
      categoryId: 'category-leisure',
      categoryName: 'Lazer',
      limit: 50000,
      currentUsage: 40000,
      usagePercentage: 80.0,
      active: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-12-03T00:00:00Z',
    },
  ];

  beforeEach(() => {
    envelopesApiService = {
      listEnvelopes: vi.fn(),
      createEnvelope: vi.fn(),
      updateEnvelope: vi.fn(),
      deleteEnvelope: vi.fn(),
    };

    budgetSelectionService = {
      selectedBudgetId: vi.fn(() => 'budget-1'),
    };

    TestBed.configureTestingModule({
      providers: [
        EnvelopeState,
        { provide: EnvelopesApiService, useValue: envelopesApiService },
        { provide: BudgetSelectionService, useValue: budgetSelectionService },
        provideZonelessChangeDetection(),
      ],
    });

    envelopeState = TestBed.inject(EnvelopeState);
  });

  it('should be created', () => {
    expect(envelopeState).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty envelopes', () => {
      expect(envelopeState.envelopes()).toEqual([]);
      expect(envelopeState.loading()).toBeFalsy();
      expect(envelopeState.error()).toBeNull();
    });

    it('should compute hasEnvelopes as false initially', () => {
      expect(envelopeState.hasEnvelopes()).toBeFalsy();
    });

    it('should compute envelopesCount as 0 initially', () => {
      expect(envelopeState.envelopesCount()).toBe(0);
    });

    it('should compute envelopesByBudgetId as empty when no budget selected', () => {
      budgetSelectionService.selectedBudgetId = vi.fn(() => null);
      expect(envelopeState.envelopesByBudgetId()).toEqual([]);
    });
  });

  describe('loadEnvelopes', () => {
    it('should load envelopes successfully', async () => {
      envelopesApiService.listEnvelopes.mockReturnValue(of(mockEnvelopes));

      envelopeState.loadEnvelopes();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(envelopeState.envelopes()).toEqual(mockEnvelopes);
      expect(envelopeState.loading()).toBeFalsy();
      expect(envelopeState.error()).toBeNull();
    });

    it('should set loading to true during load', async () => {
      envelopesApiService.listEnvelopes.mockReturnValue(of(mockEnvelopes).pipe(delay(100)));

      envelopeState.loadEnvelopes();

      expect(envelopeState.loading()).toBeTruthy();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(envelopeState.loading()).toBeFalsy();
    });

    it('should not load if already loading', () => {
      envelopesApiService.listEnvelopes.mockReturnValue(of(mockEnvelopes).pipe(delay(100)));

      envelopeState.loadEnvelopes();
      envelopeState.loadEnvelopes();

      expect(envelopesApiService.listEnvelopes).toHaveBeenCalledTimes(1);
    });

    it('should handle load errors', async () => {
      const error = { message: 'Failed to load envelopes' };
      envelopesApiService.listEnvelopes.mockReturnValue(throwError(() => error));

      envelopeState.loadEnvelopes();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(envelopeState.error()).toBe('Failed to load envelopes');
      expect(envelopeState.loading()).toBeFalsy();
    });

    it('should handle missing budget', () => {
      budgetSelectionService.selectedBudgetId = vi.fn(() => null);

      envelopeState.loadEnvelopes();

      expect(envelopeState.error()).toBe('Nenhum orçamento selecionado');
      expect(envelopeState.envelopes()).toEqual([]);
    });
  });

  describe('Computed Signals', () => {
    beforeEach(async () => {
      envelopesApiService.listEnvelopes.mockReturnValue(of(mockEnvelopes));
      envelopeState.loadEnvelopes();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it('should compute hasEnvelopes correctly', () => {
      expect(envelopeState.hasEnvelopes()).toBeTruthy();
    });

    it('should compute envelopesCount correctly', () => {
      expect(envelopeState.envelopesCount()).toBe(3);
    });

    it('should compute overBudgetEnvelopes correctly', () => {
      const overBudget = envelopeState.overBudgetEnvelopes();
      expect(overBudget.length).toBe(1);
      expect(overBudget[0].id).toBe('envelope-2');
    });

    it('should compute nearLimitEnvelopes correctly', () => {
      const nearLimit = envelopeState.nearLimitEnvelopes();
      expect(nearLimit.length).toBe(1);
      expect(nearLimit[0].id).toBe('envelope-3');
    });

    it('should compute totalAllocated correctly', () => {
      expect(envelopeState.totalAllocated()).toBe(160000);
    });

    it('should compute totalSpent correctly', () => {
      expect(envelopeState.totalSpent()).toBe(120000);
    });
  });

  describe('createEnvelope', () => {
    it('should create envelope and reload list', async () => {
      const createDto = {
        budgetId: 'budget-1',
        categoryId: 'category-new',
        name: 'Novo Envelope',
        limit: 40000,
      };

      envelopesApiService.createEnvelope.mockReturnValue(of('envelope-new'));
      envelopesApiService.listEnvelopes.mockReturnValue(of(mockEnvelopes));

      envelopeState.createEnvelope(createDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(envelopesApiService.createEnvelope).toHaveBeenCalledWith(createDto);
      expect(envelopesApiService.listEnvelopes).toHaveBeenCalled();
    });

    it('should handle create errors', async () => {
      const createDto = {
        budgetId: 'budget-1',
        categoryId: 'category-new',
        name: 'Novo Envelope',
        limit: 40000,
      };

      envelopesApiService.createEnvelope.mockReturnValue(of(null));

      envelopeState.createEnvelope(createDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(envelopeState.error()).toBe('Falha ao criar envelope');
    });
  });

  describe('updateEnvelope', () => {
    it('should update envelope and reload list', async () => {
      const updateDto = {
        envelopeId: 'envelope-1',
        budgetId: 'budget-1',
        name: 'Envelope Atualizado',
        limit: 90000,
      };

      envelopesApiService.updateEnvelope.mockReturnValue(of(true));
      envelopesApiService.listEnvelopes.mockReturnValue(of(mockEnvelopes));

      envelopeState.updateEnvelope(updateDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(envelopesApiService.updateEnvelope).toHaveBeenCalledWith(updateDto);
      expect(envelopesApiService.listEnvelopes).toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      const updateDto = {
        envelopeId: 'envelope-1',
        budgetId: 'budget-1',
        name: 'Envelope Atualizado',
      };

      envelopesApiService.updateEnvelope.mockReturnValue(of(false));

      envelopeState.updateEnvelope(updateDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(envelopeState.error()).toBe('Falha ao atualizar envelope');
    });
  });

  describe('deleteEnvelope', () => {
    it('should delete envelope and reload list', async () => {
      const deleteDto = {
        envelopeId: 'envelope-1',
        budgetId: 'budget-1',
      };

      envelopesApiService.deleteEnvelope.mockReturnValue(of(true));
      envelopesApiService.listEnvelopes.mockReturnValue(of(mockEnvelopes));

      envelopeState.deleteEnvelope(deleteDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(envelopesApiService.deleteEnvelope).toHaveBeenCalledWith(deleteDto);
      expect(envelopesApiService.listEnvelopes).toHaveBeenCalled();
    });

    it('should handle delete errors', async () => {
      const deleteDto = {
        envelopeId: 'envelope-1',
        budgetId: 'budget-1',
      };

      envelopesApiService.deleteEnvelope.mockReturnValue(of(false));

      envelopeState.deleteEnvelope(deleteDto);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(envelopeState.error()).toBe('Falha ao excluir envelope');
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      envelopeState.clearError();
      expect(envelopeState.error()).toBeNull();
    });
  });
});

