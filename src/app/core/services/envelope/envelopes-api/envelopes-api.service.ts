import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class EnvelopesApiService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<ApiError | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  listEnvelopes(budgetId: string): Observable<EnvelopeDto[]> {
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

    return this.api.getRaw<ListEnvelopesResponseDto>('/envelopes', { budgetId }).pipe(
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

  createEnvelope(dto: CreateEnvelopeRequestDto): Observable<string | null> {
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

    return this.api.postRaw<CreateEnvelopeResponseDto>('/envelope/create-envelope', dto).pipe(
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

  updateEnvelope(dto: UpdateEnvelopeRequestDto): Observable<boolean> {
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

    return this.api.postRaw<UpdateEnvelopeResponseDto>('/envelope/update-envelope', dto).pipe(
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

  deleteEnvelope(dto: DeleteEnvelopeRequestDto): Observable<boolean> {
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

    return this.api.postRaw<DeleteEnvelopeResponseDto>('/envelope/delete-envelope', dto).pipe(
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

