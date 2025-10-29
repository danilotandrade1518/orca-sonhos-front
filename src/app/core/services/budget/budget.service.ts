import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import {
  BudgetDto,
  BudgetOverviewDto,
  CreateBudgetRequestDto,
  CreateBudgetResponseDto,
  DeleteBudgetRequestDto,
  DeleteBudgetResponseDto,
  GetBudgetOverviewResponseDto,
  GetBudgetsResponseDto,
  UpdateBudgetRequestDto,
  UpdateBudgetResponseDto,
} from '../../../../dtos/budget';
import { ApiError, ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<ApiError | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  getBudgets(): Observable<BudgetDto[]> {
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

    return this.api.getRaw<GetBudgetsResponseDto>('/budget').pipe(
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

  getBudgetOverview(budgetId: string): Observable<BudgetOverviewDto | null> {
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

    return this.api.getRaw<GetBudgetOverviewResponseDto>(`/budget/${budgetId}/overview`).pipe(
      map((response) => {
        this._loading.set(false);
        return response.data;
      }),
      catchError((error: ApiError) => {
        this._loading.set(false);
        this._error.set(error);
        return of(null);
      })
    );
  }

  createBudget(dto: CreateBudgetRequestDto): Observable<string | null> {
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

    return this.api.postRaw<CreateBudgetResponseDto>('/budget/create-budget', dto).pipe(
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

  updateBudget(dto: UpdateBudgetRequestDto): Observable<boolean> {
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

    return this.api.postRaw<UpdateBudgetResponseDto>('/budget/update-budget', dto).pipe(
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

  deleteBudget(dto: DeleteBudgetRequestDto): Observable<boolean> {
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

    return this.api.postRaw<DeleteBudgetResponseDto>('/budget/delete-budget', dto).pipe(
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
