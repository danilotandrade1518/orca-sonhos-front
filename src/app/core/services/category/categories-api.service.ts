import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

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
import { ApiError, ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<ApiError | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  listCategories(budgetId: string): Observable<CategoryDto[]> {
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

    return this.api.getRaw<ListCategoriesResponseDto>('/categories', { budgetId }).pipe(
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

  createCategory(dto: CreateCategoryRequestDto): Observable<string | null> {
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

    return this.api.postRaw<CreateCategoryResponseDto>('/categories/create-category', dto).pipe(
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

  updateCategory(dto: UpdateCategoryRequestDto): Observable<boolean> {
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

    return this.api.postRaw<UpdateCategoryResponseDto>('/categories/update-category', dto).pipe(
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

  deleteCategory(dto: DeleteCategoryRequestDto): Observable<boolean> {
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

    return this.api.postRaw<DeleteCategoryResponseDto>('/categories/delete-category', dto).pipe(
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


