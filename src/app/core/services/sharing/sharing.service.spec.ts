import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';

import {
  AddParticipantResponseDto,
  RemoveParticipantResponseDto,
  SearchUserResponseDto,
} from '../../../../dtos/budget';
import { ApiError, ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { SharingService } from './sharing.service';

describe('SharingService', () => {
  let service: SharingService;
  let apiService: {
    getRaw: ReturnType<typeof vi.fn>;
    postRaw: ReturnType<typeof vi.fn>;
  };
  let authService: {
    user: ReturnType<typeof signal<{ id: string; email: string; name: string; avatar: null } | null>>;
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
  };

  const mockSearchUsers: SearchUserResponseDto[] = [
    {
      id: 'user-1',
      name: 'Ana Silva',
      email: 'ana@example.com',
      phone: '+5511999999999',
    },
    {
      id: 'user-2',
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '+5511888888888',
    },
  ];

  beforeEach(() => {
    apiService = {
      getRaw: vi.fn(),
      postRaw: vi.fn(),
    };

    authService = {
      user: signal(mockUser),
    };

    TestBed.configureTestingModule({
      providers: [
        SharingService,
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(SharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addParticipant', () => {
    it('should add participant and return true when user is authenticated', () => {
      const mockResponse: AddParticipantResponseDto = {
        success: true,
        participantId: 'user-1',
      };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.addParticipant('budget-1', 'user-1').subscribe((success) => {
        expect(success).toBeTruthy();
        expect(apiService.postRaw).toHaveBeenCalledWith('/budget/add-participant', {
          budgetId: 'budget-1',
          participantId: 'user-1',
        });
      });
    });

    it('should return false and set error when user is not authenticated', () => {
      authService.user.set(null);

      service.addParticipant('budget-1', 'user-1').subscribe((success) => {
        expect(success).toBeFalsy();
        expect(service.error()).toEqual({
          message: 'Você precisa estar autenticado para realizar esta ação. Faça login novamente.',
          status: 401,
          code: 'UNAUTHORIZED',
        });
      });
    });

    it('should handle API errors', () => {
      const mockError: ApiError = {
        message: 'Failed to add participant',
        status: 500,
        code: 'SERVER_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => mockError));

      service.addParticipant('budget-1', 'user-1').subscribe((success) => {
        expect(success).toBeFalsy();
        expect(service.error()).toEqual({
          ...mockError,
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
        });
      });
    });
  });

  describe('removeParticipant', () => {
    it('should remove participant and return true when user is authenticated', () => {
      const mockResponse: RemoveParticipantResponseDto = {
        success: true,
      };

      apiService.postRaw.mockReturnValue(of(mockResponse));

      service.removeParticipant('budget-1', 'user-1').subscribe((success) => {
        expect(success).toBeTruthy();
        expect(apiService.postRaw).toHaveBeenCalledWith('/budget/remove-participant', {
          budgetId: 'budget-1',
          participantId: 'user-1',
        });
      });
    });

    it('should return false and set error when user is not authenticated', () => {
      authService.user.set(null);

      service.removeParticipant('budget-1', 'user-1').subscribe((success) => {
        expect(success).toBeFalsy();
        expect(service.error()).toEqual({
          message: 'Você precisa estar autenticado para realizar esta ação. Faça login novamente.',
          status: 401,
          code: 'UNAUTHORIZED',
        });
      });
    });

    it('should handle API errors', () => {
      const mockError: ApiError = {
        message: 'Failed to remove participant',
        status: 500,
        code: 'SERVER_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => mockError));

      service.removeParticipant('budget-1', 'user-1').subscribe((success) => {
        expect(success).toBeFalsy();
        expect(service.error()).toEqual({
          ...mockError,
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
        });
      });
    });
  });

  describe('searchUsers', () => {
    it('should return users when user is authenticated and query is provided', () => {
      apiService.getRaw.mockReturnValue(of(mockSearchUsers));

      service.searchUsers('ana').subscribe((users) => {
        expect(users).toEqual(mockSearchUsers);
        expect(apiService.getRaw).toHaveBeenCalledWith('/users/search', { query: 'ana' });
      });
    });

    it('should return empty array when query is empty', () => {
      service.searchUsers('').subscribe((users) => {
        expect(users).toEqual([]);
        expect(apiService.getRaw).not.toHaveBeenCalled();
      });
    });

    it('should trim query before searching', () => {
      apiService.getRaw.mockReturnValue(of(mockSearchUsers));

      service.searchUsers('  ana  ').subscribe((users) => {
        expect(users).toEqual(mockSearchUsers);
        expect(apiService.getRaw).toHaveBeenCalledWith('/users/search', { query: 'ana' });
      });
    });

    it('should return empty array and set error when user is not authenticated', () => {
      authService.user.set(null);

      service.searchUsers('ana').subscribe((users) => {
        expect(users).toEqual([]);
        expect(service.error()).toEqual({
          message: 'User not authenticated',
          status: 401,
          code: 'UNAUTHORIZED',
        });
      });
    });

    it('should handle API errors', () => {
      const mockError: ApiError = {
        message: 'Failed to search users',
        status: 500,
        code: 'SERVER_ERROR',
      };

      apiService.getRaw.mockReturnValue(throwError(() => mockError));

      service.searchUsers('ana').subscribe((users) => {
        expect(users).toEqual([]);
        expect(service.error()).toEqual(mockError);
      });
    });

    it('should handle non-array responses', () => {
      apiService.getRaw.mockReturnValue(of(null as unknown as SearchUserResponseDto[]));

      service.searchUsers('ana').subscribe((users) => {
        expect(users).toEqual([]);
      });
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const mockError: ApiError = {
        message: 'Test error',
        status: 500,
        code: 'ERROR',
      };

      apiService.getRaw.mockReturnValue(throwError(() => mockError));

      service.searchUsers('test').subscribe(() => {
        expect(service.error()).toEqual(mockError);

        service.clearError();

        expect(service.error()).toBeNull();
      });
    });
  });

  describe('loading state', () => {
    it('should set loading to true during request', () => {
      apiService.postRaw.mockReturnValue(of({ success: true }));

      service.addParticipant('budget-1', 'user-1').subscribe();

      expect(service.loading()).toBeFalsy();
    });
  });
});
