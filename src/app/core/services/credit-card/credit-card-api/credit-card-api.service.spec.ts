import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  UpdateCreditCardRequestDto,
  UpdateCreditCardResponseDto,
  DeleteCreditCardRequestDto,
  DeleteCreditCardResponseDto,
  ListCreditCardsResponseDto,
  UpdateCreditCardBillRequestDto,
  UpdateCreditCardBillResponseDto,
  DeleteCreditCardBillRequestDto,
  DeleteCreditCardBillResponseDto,
  PayCreditCardBillRequestDto,
  PayCreditCardBillResponseDto,
  ReopenCreditCardBillRequestDto,
  ReopenCreditCardBillResponseDto,
} from '../../../../../dtos/credit-card';
import { ApiService, ApiError } from '../../api/api.service';
import { AuthService } from '../../auth/auth.service';
import { CreditCardApiService } from './credit-card-api.service';

describe('CreditCardApiService', () => {
  let service: CreditCardApiService;
  let apiService: {
    getRaw: ReturnType<typeof vi.fn>;
    postRaw: ReturnType<typeof vi.fn>;
  };
  let authService: {
    user: ReturnType<typeof vi.fn>;
  };

  const mockUser = { id: 'user-1' };
  const mockCreditCardsResponse: ListCreditCardsResponseDto = {
    data: [
      {
        id: 'cc-1',
        name: 'Cartão Principal',
        limit: 500000,
        closingDay: 15,
        dueDay: 25,
        budgetId: 'budget-1',
      },
    ],
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
        CreditCardApiService,
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(CreditCardApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listCreditCards', () => {
    it('should return list of credit cards', async () => {
      apiService.getRaw.mockReturnValue(of(mockCreditCardsResponse));

      const result = await firstValueFrom(service.listCreditCards('budget-1'));

      expect(result).toEqual(mockCreditCardsResponse.data);
      expect(apiService.getRaw).toHaveBeenCalledWith('/credit-cards', {
        budgetId: 'budget-1',
      });
    });

    it('should return empty array when user is not authenticated', async () => {
      authService.user.mockReturnValue(null);

      const result = await firstValueFrom(service.listCreditCards('budget-1'));

      expect(result).toEqual([]);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });

    it('should return empty array when budgetId is missing', async () => {
      const result = await firstValueFrom(service.listCreditCards(''));

      expect(result).toEqual([]);
      expect(service.error()?.code).toBe('BAD_REQUEST');
    });

    it('should handle errors', async () => {
      const error: ApiError = {
        message: 'Server error',
        status: 500,
        code: 'INTERNAL_ERROR',
      };
      apiService.getRaw.mockReturnValue(throwError(() => error));

      const result = await firstValueFrom(service.listCreditCards('budget-1'));

      expect(result).toEqual([]);
      expect(service.error()).toEqual(error);
    });
  });

  describe('updateCreditCard', () => {
    it('should return true when response has id', async () => {
      const response: UpdateCreditCardResponseDto = {
        id: 'cc-1',
      };
      apiService.postRaw.mockReturnValue(of(response));

      const dto: UpdateCreditCardRequestDto = {
        id: 'cc-1',
        name: 'Cartão Atualizado',
        limit: 600000,
        closingDay: 20,
        dueDay: 30,
      };

      const result = await firstValueFrom(service.updateCreditCard(dto));

      expect(result).toBe(true);
      expect(apiService.postRaw).toHaveBeenCalledWith(
        '/credit-card/update-credit-card',
        dto,
      );
    });

    it('should return true when response has success', async () => {
      const response = {
        success: true,
      } as UpdateCreditCardResponseDto;
      apiService.postRaw.mockReturnValue(of(response));

      const dto: UpdateCreditCardRequestDto = {
        id: 'cc-1',
        name: 'Cartão Atualizado',
        limit: 600000,
        closingDay: 20,
        dueDay: 30,
      };

      const result = await firstValueFrom(service.updateCreditCard(dto));

      expect(result).toBe(true);
    });

    it('should return false when response has neither id nor success', async () => {
      const response = {} as UpdateCreditCardResponseDto;
      apiService.postRaw.mockReturnValue(of(response));

      const dto: UpdateCreditCardRequestDto = {
        id: 'cc-1',
        name: 'Cartão Atualizado',
        limit: 600000,
        closingDay: 20,
        dueDay: 30,
      };

      const result = await firstValueFrom(service.updateCreditCard(dto));

      expect(result).toBe(false);
    });

    it('should return false when user is not authenticated', async () => {
      authService.user.mockReturnValue(null);

      const dto: UpdateCreditCardRequestDto = {
        id: 'cc-1',
        name: 'Cartão Atualizado',
        limit: 600000,
        closingDay: 20,
        dueDay: 30,
      };

      const result = await firstValueFrom(service.updateCreditCard(dto));

      expect(result).toBe(false);
      expect(service.error()?.code).toBe('UNAUTHORIZED');
    });
  });

  describe('deleteCreditCard', () => {
    it('should return true when response has id', async () => {
      const response: DeleteCreditCardResponseDto = {
        id: 'cc-1',
      };
      apiService.postRaw.mockReturnValue(of(response));

      const dto: DeleteCreditCardRequestDto = {
        id: 'cc-1',
      };

      const result = await firstValueFrom(service.deleteCreditCard(dto));

      expect(result).toBe(true);
    });

    it('should return true when response has success', async () => {
      const response = {
        success: true,
      } as DeleteCreditCardResponseDto;
      apiService.postRaw.mockReturnValue(of(response));

      const dto: DeleteCreditCardRequestDto = {
        id: 'cc-1',
      };

      const result = await firstValueFrom(service.deleteCreditCard(dto));

      expect(result).toBe(true);
    });
  });

  describe('updateCreditCardBill', () => {
    it('should return true when response has id', async () => {
      const response: UpdateCreditCardBillResponseDto = {
        id: 'bill-1',
      };
      apiService.postRaw.mockReturnValue(of(response));

      const dto: UpdateCreditCardBillRequestDto = {
        id: 'bill-1',
        closingDate: '2025-01-15',
        dueDate: '2025-01-25',
        amount: 120000,
      };

      const result = await firstValueFrom(service.updateCreditCardBill(dto));

      expect(result).toBe(true);
    });

    it('should return true when response has success', async () => {
      const response = {
        success: true,
      } as UpdateCreditCardBillResponseDto;
      apiService.postRaw.mockReturnValue(of(response));

      const dto: UpdateCreditCardBillRequestDto = {
        id: 'bill-1',
        closingDate: '2025-01-15',
        dueDate: '2025-01-25',
        amount: 120000,
      };

      const result = await firstValueFrom(service.updateCreditCardBill(dto));

      expect(result).toBe(true);
    });
  });

  describe('deleteCreditCardBill', () => {
    it('should return true when response has id', async () => {
      const response: DeleteCreditCardBillResponseDto = {
        id: 'bill-1',
      };
      apiService.postRaw.mockReturnValue(of(response));

      const dto: DeleteCreditCardBillRequestDto = {
        id: 'bill-1',
      };

      const result = await firstValueFrom(service.deleteCreditCardBill(dto));

      expect(result).toBe(true);
    });

    it('should return true when response has success', async () => {
      const response = {
        success: true,
      } as DeleteCreditCardBillResponseDto;
      apiService.postRaw.mockReturnValue(of(response));

      const dto: DeleteCreditCardBillRequestDto = {
        id: 'bill-1',
      };

      const result = await firstValueFrom(service.deleteCreditCardBill(dto));

      expect(result).toBe(true);
    });
  });

  describe('payCreditCardBill', () => {
    it('should return true when response has id', async () => {
      const response: PayCreditCardBillResponseDto = {
        id: 'bill-1',
      };
      apiService.postRaw.mockReturnValue(of(response));

      const dto: PayCreditCardBillRequestDto = {
        creditCardBillId: 'bill-1',
        accountId: 'acc-1',
        userId: 'user-1',
        budgetId: 'budget-1',
        amount: 120000,
        paymentCategoryId: 'cat-1',
      };

      const result = await firstValueFrom(service.payCreditCardBill(dto));

      expect(result).toBe(true);
    });

    it('should return true when response has success', async () => {
      const response = {
        success: true,
      } as PayCreditCardBillResponseDto;
      apiService.postRaw.mockReturnValue(of(response));

      const dto: PayCreditCardBillRequestDto = {
        creditCardBillId: 'bill-1',
        accountId: 'acc-1',
        userId: 'user-1',
        budgetId: 'budget-1',
        amount: 120000,
        paymentCategoryId: 'cat-1',
      };

      const result = await firstValueFrom(service.payCreditCardBill(dto));

      expect(result).toBe(true);
    });
  });

  describe('reopenCreditCardBill', () => {
    it('should return true when response has id', async () => {
      const response: ReopenCreditCardBillResponseDto = {
        id: 'bill-1',
      };
      apiService.postRaw.mockReturnValue(of(response));

      const dto: ReopenCreditCardBillRequestDto = {
        creditCardBillId: 'bill-1',
        userId: 'user-1',
        budgetId: 'budget-1',
        justification: 'Erro no pagamento',
      };

      const result = await firstValueFrom(service.reopenCreditCardBill(dto));

      expect(result).toBe(true);
    });

    it('should return true when response has success', async () => {
      const response = {
        success: true,
      } as ReopenCreditCardBillResponseDto;
      apiService.postRaw.mockReturnValue(of(response));

      const dto: ReopenCreditCardBillRequestDto = {
        creditCardBillId: 'bill-1',
        userId: 'user-1',
        budgetId: 'budget-1',
        justification: 'Erro no pagamento',
      };

      const result = await firstValueFrom(service.reopenCreditCardBill(dto));

      expect(result).toBe(true);
    });
  });
});
