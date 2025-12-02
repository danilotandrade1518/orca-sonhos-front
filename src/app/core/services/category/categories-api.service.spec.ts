import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay, firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CategoryDto,
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
  DeleteCategoryRequestDto,
  DeleteCategoryResponseDto,
  ListCategoriesResponseDto,
  UpdateCategoryRequestDto,
  UpdateCategoryResponseDto,
} from '../../../../../dtos/category';
import type { ApiError } from '../api/api.service';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { CategoriesApiService } from './categories-api.service';

describe('CategoriesApiService', () => {
  let service: CategoriesApiService;
  let apiService: {
    getRaw: ReturnType<typeof vi.fn>;
    postRaw: ReturnType<typeof vi.fn>;
    loading: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    clearError: ReturnType<typeof vi.fn>;
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

  const mockCategories: CategoryDto[] = [
    {
      id: 'category-1',
      budgetId: 'budget-1',
      name: 'Alimentação',
      description: 'Gastos com alimentação',
      type: 'EXPENSE',
      kind: 'PRESET',
      color: '#FF0000',
      icon: 'restaurant',
      active: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      order: 0,
    },
    {
      id: 'category-2',
      budgetId: 'budget-1',
      name: 'Salário',
      description: 'Receitas de salário',
      type: 'INCOME',
      kind: 'PRESET',
      color: '#00FF00',
      icon: 'attach_money',
      active: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      order: 1,
    },
  ];

  const mockListResponse: ListCategoriesResponseDto = {
    data: mockCategories,
    meta: {
      count: mockCategories.length,
    },
  };

  beforeEach(() => {
    apiService = {
      getRaw: vi.fn(),
      postRaw: vi.fn(),
      loading: vi.fn(),
      error: vi.fn(),
      clearError: vi.fn(),
    };

    authService = {
      user: vi.fn(() => mockUser),
    };

    TestBed.configureTestingModule({
      providers: [
        CategoriesApiService,
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(CategoriesApiService);
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

  describe('listCategories', () => {
    it('should load categories successfully', async () => {
      apiService.getRaw.mockReturnValue(of(mockListResponse));

      const categories = await firstValueFrom(service.listCategories('budget-1'));

      expect(categories).toEqual(mockCategories);
      expect(apiService.getRaw).toHaveBeenCalledWith('/categories', { budgetId: 'budget-1' });
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should set loading to true during request', async () => {
      let loadingCheck = false;
      apiService.getRaw.mockImplementation(() => {
        loadingCheck = service.loading();
        return of(mockListResponse).pipe(delay(10));
      });

      const promise = firstValueFrom(service.listCategories('budget-1'));

      expect(service.loading()).toBe(true);
      expect(loadingCheck).toBe(true);

      await promise;
      expect(service.loading()).toBe(false);
    });

    it('should return empty array when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const categories = await firstValueFrom(service.listCategories('budget-1'));

      expect(categories).toEqual([]);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should return empty array when budgetId is not provided', async () => {
      const categories = await firstValueFrom(service.listCategories(''));

      expect(categories).toEqual([]);
      expect(service.error()?.code).toBe('BAD_REQUEST');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to load categories',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.getRaw.mockReturnValue(throwError(() => apiError));

      const categories = await firstValueFrom(service.listCategories('budget-1'));

      expect(categories).toEqual([]);
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });
  });

  describe('createCategory', () => {
    const createDto: CreateCategoryRequestDto = {
      userId: 'user-123',
      budgetId: 'budget-1',
      name: 'Nova Categoria',
      type: 'EXPENSE',
      kind: 'CUSTOM',
      description: 'Categoria customizada',
      color: '#0000FF',
      icon: 'category',
      order: 2,
    };

    const createResponse: CreateCategoryResponseDto = {
      id: 'category-new',
    };

    it('should create category successfully', async () => {
      apiService.postRaw.mockReturnValue(of(createResponse));

      const categoryId = await firstValueFrom(service.createCategory(createDto));

      expect(categoryId).toBe('category-new');
      expect(apiService.postRaw).toHaveBeenCalledWith('/categories/create-category', createDto);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should return null when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const categoryId = await firstValueFrom(service.createCategory(createDto));

      expect(categoryId).toBeNull();
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to create category',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const categoryId = await firstValueFrom(service.createCategory(createDto));

      expect(categoryId).toBeNull();
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });
  });

  describe('updateCategory', () => {
    const updateDto: UpdateCategoryRequestDto = {
      id: 'category-1',
      userId: 'user-123',
      name: 'Alimentação Atualizada',
      type: 'EXPENSE',
      kind: 'CUSTOM',
      description: 'Descrição atualizada',
      color: '#FF00FF',
      icon: 'edit',
      active: true,
      order: 1,
    };

    const updateResponse: UpdateCategoryResponseDto = {
      success: true,
    };

    it('should update category successfully', async () => {
      apiService.postRaw.mockReturnValue(of(updateResponse));

      const success = await firstValueFrom(service.updateCategory(updateDto));

      expect(success).toBe(true);
      expect(apiService.postRaw).toHaveBeenCalledWith('/categories/update-category', updateDto);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should return false when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const success = await firstValueFrom(service.updateCategory(updateDto));

      expect(success).toBe(false);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to update category',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const success = await firstValueFrom(service.updateCategory(updateDto));

      expect(success).toBe(false);
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });
  });

  describe('deleteCategory', () => {
    const deleteDto: DeleteCategoryRequestDto = {
      userId: 'user-123',
      categoryId: 'category-1',
    };

    const deleteResponse: DeleteCategoryResponseDto = {
      success: true,
    };

    it('should delete category successfully', async () => {
      apiService.postRaw.mockReturnValue(of(deleteResponse));

      const success = await firstValueFrom(service.deleteCategory(deleteDto));

      expect(success).toBe(true);
      expect(apiService.postRaw).toHaveBeenCalledWith('/categories/delete-category', deleteDto);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should return false when user is not authenticated', async () => {
      authService.user = vi.fn(() => null);

      const success = await firstValueFrom(service.deleteCategory(deleteDto));

      expect(success).toBe(false);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should handle API errors', async () => {
      const apiError: ApiError = {
        message: 'Failed to delete category',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      apiService.postRaw.mockReturnValue(throwError(() => apiError));

      const success = await firstValueFrom(service.deleteCategory(deleteDto));

      expect(success).toBe(false);
      expect(service.error()).toEqual(apiError);
      expect(service.loading()).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      service.clearError();
      expect(service.error()).toBeNull();
    });
  });
});


