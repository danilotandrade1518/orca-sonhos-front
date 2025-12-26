import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import {
  AddParticipantRequestDto,
  AddParticipantResponseDto,
  RemoveParticipantRequestDto,
  RemoveParticipantResponseDto,
  SearchUserResponseDto,
} from '../../../../dtos/budget';
import { ApiError, ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { getBudgetErrorMessage } from '../../utils/error-messages';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<ApiError | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  addParticipant(budgetId: string, participantId: string): Observable<boolean> {
    const user = this.auth.user();

    if (!user) {
      const error: ApiError = {
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      };
      this._error.set({
        ...error,
        message: getBudgetErrorMessage(error, 'addParticipant'),
      });
      return of(false);
    }

    this._loading.set(true);
    this._error.set(null);

    const dto: AddParticipantRequestDto = {
      budgetId,
      participantId,
    };

    return this.api.postRaw<AddParticipantResponseDto>('/budget/add-participant', dto).pipe(
      map((response) => {
        this._loading.set(false);
        // Back-end real retorna `{ id, traceId }` (sem `success`).
        // Mocks legados podem retornar `{ success: true }`.
        return Boolean(response?.success ?? response?.id);
      }),
      catchError((error: ApiError) => {
        this._loading.set(false);
        this._error.set({
          ...error,
          message: getBudgetErrorMessage(error, 'addParticipant'),
        });
        return of(false);
      })
    );
  }

  removeParticipant(budgetId: string, participantId: string): Observable<boolean> {
    const user = this.auth.user();

    if (!user) {
      const error: ApiError = {
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      };
      this._error.set({
        ...error,
        message: getBudgetErrorMessage(error, 'removeParticipant'),
      });
      return of(false);
    }

    this._loading.set(true);
    this._error.set(null);

    const dto: RemoveParticipantRequestDto = {
      budgetId,
      participantId,
    };

    return this.api.postRaw<RemoveParticipantResponseDto>('/budget/remove-participant', dto).pipe(
      map((response) => {
        this._loading.set(false);
        // Back-end real retorna `{ id, traceId }` (sem `success`).
        // Mocks legados podem retornar `{ success: true }`.
        return Boolean(response?.success ?? response?.id);
      }),
      catchError((error: ApiError) => {
        this._loading.set(false);
        this._error.set({
          ...error,
          message: getBudgetErrorMessage(error, 'removeParticipant'),
        });
        return of(false);
      })
    );
  }

  searchUsers(query: string): Observable<SearchUserResponseDto[]> {
    const user = this.auth.user();

    if (!user) {
      this._error.set({
        message: 'User not authenticated',
        status: 401,
        code: 'UNAUTHORIZED',
      });
      return of([]);
    }

    if (!query || query.trim().length === 0) {
      return of([]);
    }

    this._loading.set(true);
    this._error.set(null);

    return this.api.getRaw<SearchUserResponseDto[]>('/users/search', { query: query.trim() }).pipe(
      map((response) => {
        this._loading.set(false);
        return Array.isArray(response) ? response : [];
      }),
      catchError((error: ApiError) => {
        this._loading.set(false);
        this._error.set(error);
        return of([]);
      })
    );
  }

  clearError(): void {
    this._error.set(null);
  }
}
