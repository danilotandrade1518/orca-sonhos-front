import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  CreateTransactionRequestDto,
  CreateTransactionResponseDto,
  DeleteTransactionRequestDto,
  DeleteTransactionResponseDto,
  ListTransactionsResponseDto,
  UpdateTransactionRequestDto,
  UpdateTransactionResponseDto,
} from '../../../../dtos/transaction';
import { ApiService, ApiError } from '../../../core/services/api/api.service';
import { TransactionsApiService } from './transactions-api.service';

describe('TransactionsApiService', () => {
  let service: TransactionsApiService;
  let apiService: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
  };

  const mockTransactionsResponse: ListTransactionsResponseDto = {
    data: [
      {
        id: 'transaction-1',
        description: 'Compra no supermercado',
        amount: 150.5,
        type: 'EXPENSE',
        accountId: 'account-1',
        categoryId: 'category-1',
        budgetId: 'budget-1',
        transactionDate: '2024-01-15T10:00:00Z',
      },
      {
        id: 'transaction-2',
        description: 'Salário',
        amount: 5000.0,
        type: 'INCOME',
        accountId: 'account-1',
        categoryId: 'category-2',
        budgetId: 'budget-1',
        transactionDate: '2024-01-01T10:00:00Z',
      },
    ],
    meta: {
      hasNext: true,
      page: 1,
      pageSize: 20,
    },
  };

  beforeEach(() => {
    apiService = {
      get: vi.fn(),
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransactionsApiService,
        { provide: ApiService, useValue: apiService },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(TransactionsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should list transactions with minimal params', async () => {
      const params = { budgetId: 'budget-1' };
      apiService.get.mockReturnValue(of(mockTransactionsResponse));

      const response = await firstValueFrom(service.list(params));
      expect(response).toEqual(mockTransactionsResponse);
      expect(apiService.get).toHaveBeenCalledWith('transactions?budgetId=budget-1');
    });

    it('should list transactions with pagination params', async () => {
      const params = {
        budgetId: 'budget-1',
        page: 2,
        pageSize: 10,
      };
      apiService.get.mockReturnValue(of(mockTransactionsResponse));

      const response = await firstValueFrom(service.list(params));
      expect(response).toEqual(mockTransactionsResponse);
      expect(apiService.get).toHaveBeenCalledWith(
        'transactions?budgetId=budget-1&page=2&pageSize=10'
      );
    });

    it('should list transactions with all filters', async () => {
      const params = {
        budgetId: 'budget-1',
        page: 1,
        pageSize: 20,
        accountId: 'account-1',
        categoryId: 'category-1',
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      } as const;
      apiService.get.mockReturnValue(of(mockTransactionsResponse));

      const response = await firstValueFrom(service.list(params));
      expect(response).toEqual(mockTransactionsResponse);
      expect(apiService.get).toHaveBeenCalledWith(
        'transactions?budgetId=budget-1&page=1&pageSize=20&accountId=account-1&categoryId=category-1&dateFrom=2024-01-01&dateTo=2024-01-31'
      );
    });

    it('should handle API errors', async () => {
      const params = { budgetId: 'budget-1' };
      const mockError: ApiError = {
        message: 'Failed to fetch transactions',
        status: 500,
        code: 'SERVER_ERROR',
      };
      apiService.get.mockReturnValue(throwError(() => mockError));

      await expect(firstValueFrom(service.list(params))).rejects.toEqual(mockError);
    });
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const request: CreateTransactionRequestDto = {
        userId: 'user-1',
        description: 'Nova transação',
        amount: 100.0,
        type: 'EXPENSE',
        accountId: 'account-1',
        categoryId: 'category-1',
        budgetId: 'budget-1',
      } as unknown as CreateTransactionRequestDto;

      const mockResponse: CreateTransactionResponseDto = {
        id: 'transaction-new',
      } as unknown as CreateTransactionResponseDto;

      apiService.post.mockReturnValue(of(mockResponse));

      const response = await firstValueFrom(service.create(request));
      expect(response).toEqual(mockResponse);
      expect(apiService.post).toHaveBeenCalledWith('transaction/create-transaction', request);
    });

    it('should create a transaction with transactionDate', async () => {
      const request: CreateTransactionRequestDto = {
        userId: 'user-1',
        description: 'Nova transação',
        amount: 100.0,
        type: 'INCOME',
        accountId: 'account-1',
        categoryId: 'category-1',
        budgetId: 'budget-1',
        transactionDate: '2024-01-15T10:00:00Z',
      } as unknown as CreateTransactionRequestDto;

      const mockResponse: CreateTransactionResponseDto = {
        id: 'transaction-new',
      } as unknown as CreateTransactionResponseDto;

      apiService.post.mockReturnValue(of(mockResponse));

      const response = await firstValueFrom(service.create(request));
      expect(response).toEqual(mockResponse);
      expect(apiService.post).toHaveBeenCalledWith('transaction/create-transaction', request);
    });

    it('should handle API errors on create', async () => {
      const request: CreateTransactionRequestDto = {
        userId: 'user-1',
        description: 'Nova transação',
        amount: 100.0,
        type: 'EXPENSE',
        accountId: 'account-1',
        categoryId: 'category-1',
        budgetId: 'budget-1',
      } as unknown as CreateTransactionRequestDto;

      const mockError: ApiError = {
        message: 'Failed to create transaction',
        status: 400,
        code: 'VALIDATION_ERROR',
      };
      apiService.post.mockReturnValue(throwError(() => mockError));

      await expect(firstValueFrom(service.create(request))).rejects.toEqual(mockError);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const request: UpdateTransactionRequestDto = {
        userId: 'user-1',
        id: 'transaction-1',
        description: 'Transação atualizada',
        amount: 200.0,
        type: 'EXPENSE',
        accountId: 'account-1',
        categoryId: 'category-1',
        budgetId: 'budget-1',
      } as unknown as UpdateTransactionRequestDto;

      const mockResponse: UpdateTransactionResponseDto = {
        success: true,
      } as unknown as UpdateTransactionResponseDto;

      apiService.post.mockReturnValue(of(mockResponse));

      const response = await firstValueFrom(service.update(request));
      expect(response).toEqual(mockResponse);
      expect(apiService.post).toHaveBeenCalledWith('transaction/update-transaction', request);
    });

    it('should handle API errors on update', async () => {
      const request: UpdateTransactionRequestDto = {
        userId: 'user-1',
        id: 'transaction-1',
        description: 'Transação atualizada',
        amount: 200.0,
        type: 'EXPENSE',
        accountId: 'account-1',
        categoryId: 'category-1',
        budgetId: 'budget-1',
      } as unknown as UpdateTransactionRequestDto;

      const mockError: ApiError = {
        message: 'Transaction not found',
        status: 404,
        code: 'NOT_FOUND',
      };
      apiService.post.mockReturnValue(throwError(() => mockError));

      await expect(firstValueFrom(service.update(request))).rejects.toEqual(mockError);
    });
  });

  describe('delete', () => {
    it('should delete a transaction', async () => {
      const request: DeleteTransactionRequestDto = {
        userId: 'user-1',
        id: 'transaction-1',
      } as unknown as DeleteTransactionRequestDto;

      const mockResponse: DeleteTransactionResponseDto = {
        success: true,
      } as unknown as DeleteTransactionResponseDto;

      apiService.post.mockReturnValue(of(mockResponse));

      const response = await firstValueFrom(service.delete(request));
      expect(response).toEqual(mockResponse);
      expect(apiService.post).toHaveBeenCalledWith('transaction/delete-transaction', request);
    });

    it('should handle API errors on delete', async () => {
      const request: DeleteTransactionRequestDto = {
        userId: 'user-1',
        id: 'transaction-1',
      } as unknown as DeleteTransactionRequestDto;

      const mockError: ApiError = {
        message: 'Transaction not found',
        status: 404,
        code: 'NOT_FOUND',
      };
      apiService.post.mockReturnValue(throwError(() => mockError));

      await expect(firstValueFrom(service.delete(request))).rejects.toEqual(mockError);
    });
  });

  describe('cancelScheduled', () => {
    it('should cancel a scheduled transaction', async () => {
      const request = {
        userId: 'user-1',
        budgetId: 'budget-1',
        transactionId: 'transaction-1',
        cancellationReason: 'Cancelado pelo usuário',
      } as const;

      const mockResponse: UpdateTransactionResponseDto = {
        success: true,
      } as unknown as UpdateTransactionResponseDto;

      apiService.post.mockReturnValue(of(mockResponse));

      const response = await firstValueFrom(service.cancelScheduled(request));
      expect(response).toEqual(mockResponse);
      expect(apiService.post).toHaveBeenCalledWith(
        'transaction/cancel-scheduled-transaction',
        request
      );
    });

    it('should handle API errors on cancelScheduled', async () => {
      const request = {
        userId: 'user-1',
        budgetId: 'budget-1',
        transactionId: 'transaction-1',
        cancellationReason: 'Cancelado pelo usuário',
      } as const;

      const mockError: ApiError = {
        message: 'Transaction not found or not scheduled',
        status: 400,
        code: 'INVALID_STATE',
      };
      apiService.post.mockReturnValue(throwError(() => mockError));

      await expect(firstValueFrom(service.cancelScheduled(request))).rejects.toEqual(mockError);
    });
  });

  describe('markLate', () => {
    it('should mark a transaction as late', async () => {
      const request = {
        transactionId: 'transaction-1',
      } as const;

      const mockResponse: UpdateTransactionResponseDto = {
        success: true,
      } as unknown as UpdateTransactionResponseDto;

      apiService.post.mockReturnValue(of(mockResponse));

      const response = await firstValueFrom(service.markLate(request));
      expect(response).toEqual(mockResponse);
      expect(apiService.post).toHaveBeenCalledWith('transaction/mark-transaction-late', request);
    });

    it('should handle API errors on markLate', async () => {
      const request = {
        transactionId: 'transaction-1',
      } as const;

      const mockError: ApiError = {
        message: 'Transaction not found',
        status: 404,
        code: 'NOT_FOUND',
      };
      apiService.post.mockReturnValue(throwError(() => mockError));

      await expect(firstValueFrom(service.markLate(request))).rejects.toEqual(mockError);
    });
  });
});
