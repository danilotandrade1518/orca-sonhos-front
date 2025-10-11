import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';

import { ConfigService } from '../config/config.service';
import { NotificationService } from '../notification/notification.service';

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: {
    count?: number;
    page?: number;
    pageSize?: number;
    hasNext?: boolean;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly notificationService = inject(NotificationService);

  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<ApiError | null>(null);

  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  private get timeout(): number {
    return this.configService.apiTimeout();
  }

  private get retryAttempts(): number {
    return this.configService.apiRetryAttempts();
  }

  private createHeaders(additionalHeaders?: Record<string, string>): HttpHeaders {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };

    return new HttpHeaders(headers);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const apiError: ApiError = {
      message: error.message || 'Erro desconhecido',
      status: error.status,
      code: error.error?.code,
    };

    this._error.set(apiError);
    return throwError(() => apiError);
  }

  private executeRequest<T>(request: Observable<T>, showLoading = true): Observable<T> {
    if (showLoading) {
      this._isLoading.set(true);
      this.notificationService.setLoading(true);
    }

    return request.pipe(
      timeout(this.timeout),
      retry(this.retryAttempts),
      catchError((error) => {
        this._isLoading.set(false);
        this.notificationService.setLoading(false);
        return this.handleError(error);
      }),
      map((response) => {
        this._isLoading.set(false);
        this.notificationService.setLoading(false);
        this._error.set(null);
        return response;
      })
    );
  }

  get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Observable<ApiResponse<T>> {
    const url = this.configService.getApiUrl(endpoint);
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    const headers = this.createHeaders();

    const request = this.http.get<ApiResponse<T>>(url, {
      params: httpParams,
      headers,
    });

    return this.executeRequest(request);
  }

  post<T>(
    endpoint: string,
    body: unknown,
    params?: Record<string, string | number | boolean>
  ): Observable<ApiResponse<T>> {
    const url = this.configService.getApiUrl(endpoint);
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    const headers = this.createHeaders();

    const request = this.http.post<ApiResponse<T>>(url, body, {
      params: httpParams,
      headers,
    });

    return this.executeRequest(request);
  }

  put<T>(
    endpoint: string,
    body: unknown,
    params?: Record<string, string | number | boolean>
  ): Observable<ApiResponse<T>> {
    const url = this.configService.getApiUrl(endpoint);
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    const headers = this.createHeaders();

    const request = this.http.put<ApiResponse<T>>(url, body, {
      params: httpParams,
      headers,
    });

    return this.executeRequest(request);
  }

  patch<T>(
    endpoint: string,
    body: unknown,
    params?: Record<string, string | number | boolean>
  ): Observable<ApiResponse<T>> {
    const url = this.configService.getApiUrl(endpoint);
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    const headers = this.createHeaders();

    const request = this.http.patch<ApiResponse<T>>(url, body, {
      params: httpParams,
      headers,
    });

    return this.executeRequest(request);
  }

  delete<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Observable<ApiResponse<T>> {
    const url = this.configService.getApiUrl(endpoint);
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    const headers = this.createHeaders();

    const request = this.http.delete<ApiResponse<T>>(url, {
      params: httpParams,
      headers,
    });

    return this.executeRequest(request);
  }

  getRaw<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const url = this.configService.getApiUrl(endpoint);
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    const headers = this.createHeaders();

    const request = this.http.get<T>(url, {
      params: httpParams,
      headers,
    });

    return this.executeRequest(request);
  }

  postRaw<T>(
    endpoint: string,
    body: unknown,
    params?: Record<string, string | number | boolean>
  ): Observable<T> {
    const url = this.configService.getApiUrl(endpoint);
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    const headers = this.createHeaders();

    const request = this.http.post<T>(url, body, {
      params: httpParams,
      headers,
    });

    return this.executeRequest(request);
  }

  clearError(): void {
    this._error.set(null);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }
}
