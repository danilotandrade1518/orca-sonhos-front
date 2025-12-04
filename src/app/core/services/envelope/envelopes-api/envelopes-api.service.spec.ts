import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay, firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CreateEnvelopeRequestDto,
  CreateEnvelopeResponseDto,
  DeleteEnvelopeRequestDto,
  DeleteEnvelopeResponseDto,
  EnvelopeDto,
  ListEnvelopesResponseDto,
  UpdateEnvelopeRequestDto,
  UpdateEnvelopeResponseDto,
} from '../../../../../dtos/envelope';
import { ApiError, ApiService } from '../../api/api.service';
import { AuthService } from '../../auth/auth.service';
import { EnvelopesApiService } from './envelopes-api.service';

describe('EnvelopesApiService', () => {
  let service: EnvelopesApiService;
  let apiService: {
    getRaw: ReturnType<typeof vi.fn>;
    postRaw: ReturnType<typeof vi.fn>;
  };
  let authService: {
    user: ReturnType<typeof vi.fn>;
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
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
  ];

  const mockListResponse: ListEnvelopesResponseDto = {
    data: mockEnvelopes,
    meta: {
      count: mockEnvelopes.length,
    },
  };

  beforeEach(() => {
    apiService = {
      getRaw: vi.fn(),
      postRaw: vi.fn(),
    };

    authService = {
      user: vi.fn(() => mockUser),
    };

    TestBed.configureTestingModule({
      providers: [
        EnvelopesApiService,
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(EnvelopesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with loading false', () => {
      expect(service.loading()).toBe(false);
    });

    it('should initialize with error null', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('listEnvelopes', () => {
    it('should list envelopes successfully', async () => {
      apiService.getRaw.mockReturnValue(of(mockListResponse));

      const result = await firstValueFrom(service.listEnvelopes('budget-1'));

      expect(result).toEqual(mockEnvelopes);
      expect(apiService.getRaw).toHaveBeenCalledWith('/envelopes', { budgetId: 'budget-1' });
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should handle unauthenticated user', async () => {
      authService.user = vi.fn(() => null);

      const result = await firstValueFrom(service.listEnvelopes('budget-1'));

      expect(result).toEqual([]);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle missing budgetId', async () => {
      const result = await firstValueFrom(service.listEnvelopes(''));

      expect(result).toEqual([]);
      expect(service.error()?.code).toBe('BAD_REQUEST');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to load envelopes',
        status: 500,
        code: 'INTERNAL_ERROR',
      };
      apiService.getRaw.mockReturnValue(throwError(() => apiError));

      const result = await firstValueFrom(service.listEnvelopes('budget-1'));

      expect(result).toEqual([]);
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });
  });

  describe('createEnvelope', () => {
    const createDto: CreateEnvelopeRequestDto = {
      budgetId: 'budget-1',
      categoryId: 'category-groceries',
      name: 'Novo Envelope',
      limit: 50000,
    };

    it('should create envelope successfully', async () => {
      const response: CreateEnvelopeResponseDto = { id: 'envelope-new' };
      apiService.postRaw.mockReturnValue(of(response));

      const result = await firstValueFrom(service.createEnvelope(createDto));

      expect(result).toBe('envelope-new');
      expect(apiService.postRaw).toHaveBeenCalledWith('/envelope/create-envelope', createDto);
      expect(service.loading()).toBe(false);
    });

    it('should handle unauthenticated user', async () => {
      authService.user = vi.fn(() => null);

      const result = await firstValueFrom(service.createEnvelope(createDto));

      expect(result).toBeNull();
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to create envelope',
        status: 400,
        code: 'BAD_REQUEST',
      };
      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const result = await firstValueFrom(service.createEnvelope(createDto));

      expect(result).toBeNull();
      expect(service.error()).toEqual(apiError);
    });
  });

  describe('updateEnvelope', () => {
    const updateDto: UpdateEnvelopeRequestDto = {
      envelopeId: 'envelope-1',
      budgetId: 'budget-1',
      name: 'Envelope Atualizado',
      limit: 60000,
    };

    it('should update envelope successfully', async () => {
      const response: UpdateEnvelopeResponseDto = { success: true };
      apiService.postRaw.mockReturnValue(of(response));

      const result = await firstValueFrom(service.updateEnvelope(updateDto));

      expect(result).toBe(true);
      expect(apiService.postRaw).toHaveBeenCalledWith('/envelope/update-envelope', updateDto);
    });

    it('should handle unauthenticated user', async () => {
      authService.user = vi.fn(() => null);

      const result = await firstValueFrom(service.updateEnvelope(updateDto));

      expect(result).toBe(false);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to update envelope',
        status: 404,
        code: 'NOT_FOUND',
      };
      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const result = await firstValueFrom(service.updateEnvelope(updateDto));

      expect(result).toBe(false);
      expect(service.error()).toEqual(apiError);
    });
  });

  describe('deleteEnvelope', () => {
    const deleteDto: DeleteEnvelopeRequestDto = {
      envelopeId: 'envelope-1',
      budgetId: 'budget-1',
    };

    it('should delete envelope successfully', async () => {
      const response: DeleteEnvelopeResponseDto = { success: true };
      apiService.postRaw.mockReturnValue(of(response));

      const result = await firstValueFrom(service.deleteEnvelope(deleteDto));

      expect(result).toBe(true);
      expect(apiService.postRaw).toHaveBeenCalledWith('/envelope/delete-envelope', deleteDto);
    });

    it('should handle unauthenticated user', async () => {
      authService.user = vi.fn(() => null);

      const result = await firstValueFrom(service.deleteEnvelope(deleteDto));

      expect(result).toBe(false);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to delete envelope',
        status: 500,
        code: 'INTERNAL_ERROR',
      };
      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const result = await firstValueFrom(service.deleteEnvelope(deleteDto));

      expect(result).toBe(false);
      expect(service.error()).toEqual(apiError);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      service.clearError();
      expect(service.error()).toBeNull();
    });
  });
});

