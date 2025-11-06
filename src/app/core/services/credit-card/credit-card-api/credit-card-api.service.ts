import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import {
  CreditCardBillDto,
  CreditCardDto,
  CreateCreditCardBillRequestDto,
  CreateCreditCardBillResponseDto,
  CreateCreditCardRequestDto,
  CreateCreditCardResponseDto,
  DeleteCreditCardBillRequestDto,
  DeleteCreditCardBillResponseDto,
  DeleteCreditCardRequestDto,
  DeleteCreditCardResponseDto,
  ListCreditCardBillsResponseDto,
  ListCreditCardsResponseDto,
  PayCreditCardBillRequestDto,
  PayCreditCardBillResponseDto,
  ReopenCreditCardBillRequestDto,
  ReopenCreditCardBillResponseDto,
  UpdateCreditCardBillRequestDto,
  UpdateCreditCardBillResponseDto,
  UpdateCreditCardRequestDto,
  UpdateCreditCardResponseDto,
} from '../../../../../dtos/credit-card';
import { ApiError, ApiService } from '../../api/api.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardApiService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<ApiError | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  listCreditCards(budgetId: string): Observable<CreditCardDto[]> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of([]);
    }

    if (!budgetId) {
      this._error.set({
        message: 'budgetId is required',
        status: 400,
        code: 'BAD_REQUEST',
      });
      return of([]);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api.getRaw<ListCreditCardsResponseDto>('/credit-cards', { budgetId }).pipe(
      map((response) => {
        this._loading.set(false);
        return response.data;
      }),
      catchError((error: ApiError) => {
        this._loading.set(false);
        this._error.set(error);
        return of([]);
      })
    );
  }

  createCreditCard(dto: CreateCreditCardRequestDto): Observable<string | null> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of(null);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api
      .postRaw<CreateCreditCardResponseDto>('/credit-card/create-credit-card', dto)
      .pipe(
        map((response) => {
          this._loading.set(false);
          return response.id;
        }),
        catchError((error: ApiError) => {
          this._loading.set(false);
          this._error.set(error);
          return of(null);
        })
      );
  }

  updateCreditCard(dto: UpdateCreditCardRequestDto): Observable<boolean> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of(false);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api
      .postRaw<UpdateCreditCardResponseDto>('/credit-card/update-credit-card', dto)
      .pipe(
        map((response) => {
          this._loading.set(false);
          return response.success;
        }),
        catchError((error: ApiError) => {
          this._loading.set(false);
          this._error.set(error);
          return of(false);
        })
      );
  }

  deleteCreditCard(dto: DeleteCreditCardRequestDto): Observable<boolean> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of(false);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api
      .postRaw<DeleteCreditCardResponseDto>('/credit-card/delete-credit-card', dto)
      .pipe(
        map((response) => {
          this._loading.set(false);
          return response.success;
        }),
        catchError((error: ApiError) => {
          this._loading.set(false);
          this._error.set(error);
          return of(false);
        })
      );
  }

  listCreditCardBills(
    creditCardId?: string,
    budgetId?: string
  ): Observable<CreditCardBillDto[]> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of([]);
    }

    this._loading.set(true);
    this._error.set(null);

    const params: Record<string, string> = {};
    if (creditCardId) {
      params['creditCardId'] = creditCardId;
    }
    if (budgetId) {
      params['budgetId'] = budgetId;
    }

    return this.api.getRaw<ListCreditCardBillsResponseDto>('/credit-card-bills', params).pipe(
      map((response) => {
        this._loading.set(false);
        return response.data;
      }),
      catchError((error: ApiError) => {
        this._loading.set(false);
        this._error.set(error);
        return of([]);
      })
    );
  }

  createCreditCardBill(dto: CreateCreditCardBillRequestDto): Observable<string | null> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of(null);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api
      .postRaw<CreateCreditCardBillResponseDto>('/credit-card-bill/create-credit-card-bill', dto)
      .pipe(
        map((response) => {
          this._loading.set(false);
          return response.id;
        }),
        catchError((error: ApiError) => {
          this._loading.set(false);
          this._error.set(error);
          return of(null);
        })
      );
  }

  updateCreditCardBill(dto: UpdateCreditCardBillRequestDto): Observable<boolean> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of(false);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api
      .postRaw<UpdateCreditCardBillResponseDto>('/credit-card-bill/update-credit-card-bill', dto)
      .pipe(
        map((response) => {
          this._loading.set(false);
          return response.success;
        }),
        catchError((error: ApiError) => {
          this._loading.set(false);
          this._error.set(error);
          return of(false);
        })
      );
  }

  deleteCreditCardBill(dto: DeleteCreditCardBillRequestDto): Observable<boolean> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of(false);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api
      .postRaw<DeleteCreditCardBillResponseDto>('/credit-card-bill/delete-credit-card-bill', dto)
      .pipe(
        map((response) => {
          this._loading.set(false);
          return response.success;
        }),
        catchError((error: ApiError) => {
          this._loading.set(false);
          this._error.set(error);
          return of(false);
        })
      );
  }

  payCreditCardBill(dto: PayCreditCardBillRequestDto): Observable<boolean> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of(false);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api
      .postRaw<PayCreditCardBillResponseDto>('/credit-card-bill/pay-credit-card-bill', dto)
      .pipe(
        map((response) => {
          this._loading.set(false);
          return response.success;
        }),
        catchError((error: ApiError) => {
          this._loading.set(false);
          this._error.set(error);
          return of(false);
        })
      );
  }

  reopenCreditCardBill(dto: ReopenCreditCardBillRequestDto): Observable<boolean> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of(false);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api
      .postRaw<ReopenCreditCardBillResponseDto>(
        '/credit-card-bill/reopen-credit-card-bill',
        dto
      )
      .pipe(
        map((response) => {
          this._loading.set(false);
          return response.success;
        }),
        catchError((error: ApiError) => {
          this._loading.set(false);
          this._error.set(error);
          return of(false);
        })
      );
  }

  clearError(): void {
    this._error.set(null);
  }
}
