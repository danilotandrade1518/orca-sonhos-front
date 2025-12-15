import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import {
  AccountDto,
  CreateAccountRequestDto,
  CreateAccountResponseDto,
  DeleteAccountRequestDto,
  DeleteAccountResponseDto,
  ListAccountsResponseDto,
  ReconcileAccountRequestDto,
  ReconcileAccountResponseDto,
  TransferBetweenAccountsRequestDto,
  TransferBetweenAccountsResponseDto,
  UpdateAccountRequestDto,
  UpdateAccountResponseDto,
} from '../../../../../dtos/account';
import { ApiError, ApiService } from '../../api/api.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsApiService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<ApiError | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  listAccounts(budgetId: string): Observable<AccountDto[]> {
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

    return this.api.getRaw<ListAccountsResponseDto>('/account', { budgetId }).pipe(
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

  createAccount(dto: CreateAccountRequestDto): Observable<string | null> {
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

    return this.api.postRaw<CreateAccountResponseDto>('/account/create-account', dto).pipe(
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

  updateAccount(dto: UpdateAccountRequestDto): Observable<boolean> {
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

    return this.api.postRaw<UpdateAccountResponseDto>('/account/update-account', dto).pipe(
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

  deleteAccount(dto: DeleteAccountRequestDto): Observable<boolean> {
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

    return this.api.postRaw<DeleteAccountResponseDto>('/account/delete-account', dto).pipe(
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

  transferBetweenAccounts(dto: TransferBetweenAccountsRequestDto): Observable<boolean> {
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
      .postRaw<TransferBetweenAccountsResponseDto>('/account/transfer-between-accounts', dto)
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

  reconcileAccount(dto: ReconcileAccountRequestDto): Observable<boolean> {
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

    return this.api.postRaw<ReconcileAccountResponseDto>('/account/reconcile-account', dto).pipe(
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
