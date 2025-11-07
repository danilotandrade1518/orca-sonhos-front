import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BudgetOverviewDto, BudgetParticipantDto } from '../../../../dtos/budget';
import { BudgetService } from '../budget/budget.service';
import { SharingService } from './sharing.service';
import { SharingState } from './sharing.state';

describe('SharingState', () => {
  let sharingState: SharingState;
  let sharingService: {
    addParticipant: ReturnType<typeof vi.fn>;
    removeParticipant: ReturnType<typeof vi.fn>;
  };
  let budgetService: {
    getBudgetOverview: ReturnType<typeof vi.fn>;
  };

  const mockParticipants: BudgetParticipantDto[] = [
    {
      id: 'user-1',
      name: 'Ana Silva',
      email: 'ana@example.com',
    },
    {
      id: 'user-2',
      name: 'João Silva',
      email: 'joao@example.com',
    },
  ];

  const mockBudgetOverview: BudgetOverviewDto = {
    id: 'budget-1',
    name: 'Family Budget',
    type: 'SHARED',
    participants: mockParticipants,
    totals: {
      accountsBalance: 5000.0,
      monthIncome: 3000.0,
      monthExpense: 2500.0,
      netMonth: 500.0,
    },
    accounts: [],
  };

  beforeEach(() => {
    sharingService = {
      addParticipant: vi.fn(),
      removeParticipant: vi.fn(),
    };

    budgetService = {
      getBudgetOverview: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SharingState,
        { provide: SharingService, useValue: sharingService },
        { provide: BudgetService, useValue: budgetService },
        provideZonelessChangeDetection(),
      ],
    });

    sharingState = TestBed.inject(SharingState);
  });

  it('should be created', () => {
    expect(sharingState).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty participants', () => {
      expect(sharingState.participants()).toEqual([]);
      expect(sharingState.loading()).toBeFalsy();
      expect(sharingState.error()).toBeNull();
    });

    it('should compute hasParticipants as false initially', () => {
      expect(sharingState.hasParticipants()).toBeFalsy();
    });

    it('should compute participantsCount as 0 initially', () => {
      expect(sharingState.participantsCount()).toBe(0);
    });
  });

  describe('loadParticipants', () => {
    it('should load participants successfully', async () => {
      budgetService.getBudgetOverview.mockReturnValue(of(mockBudgetOverview));

      sharingState.loadParticipants('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.participants()).toEqual(mockParticipants);
      expect(sharingState.loading()).toBeFalsy();
      expect(sharingState.error()).toBeNull();
    });

    it('should set empty array when overview is null', async () => {
      budgetService.getBudgetOverview.mockReturnValue(of(null));

      sharingState.loadParticipants('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.participants()).toEqual([]);
      expect(sharingState.loading()).toBeFalsy();
    });

    it('should handle empty participants array', async () => {
      const overviewWithoutParticipants: BudgetOverviewDto = {
        ...mockBudgetOverview,
        participants: [],
      };

      budgetService.getBudgetOverview.mockReturnValue(of(overviewWithoutParticipants));

      sharingState.loadParticipants('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.participants()).toEqual([]);
    });

    it('should handle errors when loading participants', async () => {
      const mockError = { message: 'Failed to load participants' };
      budgetService.getBudgetOverview.mockReturnValue(throwError(() => mockError));

      sharingState.loadParticipants('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.error()).toBe('Failed to load participants');
      expect(sharingState.loading()).toBeFalsy();
      expect(sharingState.participants()).toEqual([]);
    });

    it('should set loading state during request', async () => {
      budgetService.getBudgetOverview.mockReturnValue(of(mockBudgetOverview).pipe(delay(50)));

      sharingState.loadParticipants('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(sharingState.loading()).toBeTruthy();
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
  });

  describe('addParticipant', () => {
    it('should add participant successfully and reload', async () => {
      sharingService.addParticipant.mockReturnValue(of(true));
      budgetService.getBudgetOverview.mockReturnValue(of(mockBudgetOverview));

      sharingState.addParticipant('budget-1', 'user-3');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingService.addParticipant).toHaveBeenCalledWith('budget-1', 'user-3');
      expect(budgetService.getBudgetOverview).toHaveBeenCalledWith('budget-1');
      expect(sharingState.participants()).toEqual(mockParticipants);
    });

    it('should set error when add fails', async () => {
      sharingService.addParticipant.mockReturnValue(of(false));

      sharingState.addParticipant('budget-1', 'user-3');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.error()).toBe('Falha ao adicionar participante. Tente novamente.');
      expect(sharingState.loading()).toBeFalsy();
    });

    it('should handle API errors during add', async () => {
      const mockError = { message: 'User already participant' };
      sharingService.addParticipant.mockReturnValue(throwError(() => mockError));

      sharingState.addParticipant('budget-1', 'user-3');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.error()).toBe('User already participant');
      expect(sharingState.loading()).toBeFalsy();
    });
  });

  describe('removeParticipant', () => {
    beforeEach(() => {
      budgetService.getBudgetOverview.mockReturnValue(of(mockBudgetOverview));
      sharingState.loadParticipants('budget-1');
    });

    it('should remove participant successfully and reload', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      sharingService.removeParticipant.mockReturnValue(of(true));
      budgetService.getBudgetOverview.mockReturnValue(of(mockBudgetOverview));

      sharingState.removeParticipant('budget-1', 'user-2');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingService.removeParticipant).toHaveBeenCalledWith('budget-1', 'user-2');
      expect(budgetService.getBudgetOverview).toHaveBeenCalledWith('budget-1');
    });

    it('should set error when remove fails', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      sharingService.removeParticipant.mockReturnValue(of(false));

      sharingState.removeParticipant('budget-1', 'user-2');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.error()).toBe('Falha ao remover participante. Tente novamente.');
      expect(sharingState.loading()).toBeFalsy();
    });

    it('should handle API errors during remove', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const mockError = { message: 'Participant not found' };
      sharingService.removeParticipant.mockReturnValue(throwError(() => mockError));

      sharingState.removeParticipant('budget-1', 'user-2');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.error()).toBe('Participant not found');
      expect(sharingState.loading()).toBeFalsy();
    });
  });

  describe('clearParticipants', () => {
    it('should clear participants array', async () => {
      budgetService.getBudgetOverview.mockReturnValue(of(mockBudgetOverview));
      sharingState.loadParticipants('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.participants().length).toBeGreaterThan(0);

      sharingState.clearParticipants();

      expect(sharingState.participants()).toEqual([]);
    });
  });

  describe('isCreator', () => {
    beforeEach(() => {
      budgetService.getBudgetOverview.mockReturnValue(of(mockBudgetOverview));
      sharingState.loadParticipants('budget-1');
    });

    it('should return true when user is creator', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.isCreator('user-1')).toBeTruthy();
    });

    it('should return false when user is not creator', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.isCreator('user-999')).toBeFalsy();
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      budgetService.getBudgetOverview.mockReturnValue(throwError(() => ({ message: 'Test error' })));

      sharingState.loadParticipants('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.error()).toBeTruthy();

      sharingState.clearError();

      expect(sharingState.error()).toBeNull();
    });
  });

  describe('Computed Properties', () => {
    it('should compute hasParticipants correctly', async () => {
      expect(sharingState.hasParticipants()).toBeFalsy();

      budgetService.getBudgetOverview.mockReturnValue(of(mockBudgetOverview));
      sharingState.loadParticipants('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.hasParticipants()).toBeTruthy();
    });

    it('should compute participantsCount correctly', async () => {
      expect(sharingState.participantsCount()).toBe(0);

      budgetService.getBudgetOverview.mockReturnValue(of(mockBudgetOverview));
      sharingState.loadParticipants('budget-1');

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sharingState.participantsCount()).toBe(2);
    });
  });
});
