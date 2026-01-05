import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GoalsApiService } from './goals-api.service';
import { ApiService } from '../../../../core/services/api/api.service';
import type {
  AddAmountToGoalDto,
  CreateGoalDto,
  DeleteGoalDto,
  ListGoalsResponseDto,
  RemoveAmountFromGoalDto,
  UpdateGoalDto,
} from '../../../../../dtos/goal';

describe('GoalsApiService', () => {
  let service: GoalsApiService;
  let apiService: ApiService;

  beforeEach(() => {
    const apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
      postRaw: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        GoalsApiService,
        { provide: ApiService, useValue: apiServiceMock },
      ],
    });

    service = TestBed.inject(GoalsApiService);
    apiService = TestBed.inject(ApiService);
  });

  describe('listByBudget', () => {
    it('should call api.get with correct parameters', () => {
      const budgetId = 'budget-1';
      const mockResponse: ListGoalsResponseDto = {
        data: [],
        meta: { count: 0 },
      };

      vi.mocked(apiService.get).mockReturnValue(of(mockResponse));

      service.listByBudget(budgetId).subscribe();

      expect(apiService.get).toHaveBeenCalledWith('goal', { budgetId });
    });
  });

  describe('create', () => {
    it('should call api.postRaw with correct parameters', () => {
      const createDto: CreateGoalDto = {
        name: 'Viagem',
        totalAmount: 15000,
        budgetId: 'budget-1',
        sourceAccountId: 'account-1',
      };
      const mockResponse = { id: 'goal-1' };

      vi.mocked(apiService.postRaw).mockReturnValue(of(mockResponse));

      service.create(createDto).subscribe();

      expect(apiService.postRaw).toHaveBeenCalledWith('goal/create-goal', createDto);
    });
  });

  describe('update', () => {
    it('should call api.postRaw with correct parameters', () => {
      const updateDto: UpdateGoalDto = {
        id: 'goal-1',
        name: 'Viagem Atualizada',
        totalAmount: 18000,
      };
      const mockResponse = { id: 'goal-1' };

      vi.mocked(apiService.postRaw).mockReturnValue(of(mockResponse));

      service.update(updateDto).subscribe();

      expect(apiService.postRaw).toHaveBeenCalledWith('goal/update-goal', updateDto);
    });
  });

  describe('delete', () => {
    it('should call api.postRaw with correct parameters', () => {
      const deleteDto: DeleteGoalDto = { id: 'goal-1' };
      const mockResponse = { id: 'goal-1' };

      vi.mocked(apiService.postRaw).mockReturnValue(of(mockResponse));

      service.delete(deleteDto).subscribe();

      expect(apiService.postRaw).toHaveBeenCalledWith('goal/delete-goal', deleteDto);
    });
  });

  describe('addAmount', () => {
    it('should call api.postRaw with correct parameters', () => {
      const addAmountDto: AddAmountToGoalDto = {
        id: 'goal-1',
        amount: 1000,
      };
      const mockResponse = { id: 'goal-1' };

      vi.mocked(apiService.postRaw).mockReturnValue(of(mockResponse));

      service.addAmount(addAmountDto).subscribe();

      expect(apiService.postRaw).toHaveBeenCalledWith('goal/add-amount-goal', addAmountDto);
    });
  });

  describe('removeAmount', () => {
    it('should call api.postRaw with correct parameters', () => {
      const removeAmountDto: RemoveAmountFromGoalDto = {
        id: 'goal-1',
        amount: 500,
      };
      const mockResponse = { id: 'goal-1' };

      vi.mocked(apiService.postRaw).mockReturnValue(of(mockResponse));

      service.removeAmount(removeAmountDto).subscribe();

      expect(apiService.postRaw).toHaveBeenCalledWith('goal/remove-amount-goal', removeAmountDto);
    });
  });
});
