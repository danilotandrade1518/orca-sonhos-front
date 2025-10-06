import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../config/config.service';

export interface ApiRequestOptions {
  headers?: HttpHeaders | Record<string, string>;
  params?: HttpParams | Record<string, string | number | boolean>;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    return firstValueFrom(this.http.get<T>(url, options));
  }

  post<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    return firstValueFrom(this.http.post<T>(url, body, options));
  }

  put<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    return firstValueFrom(this.http.put<T>(url, body, options));
  }

  patch<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    return firstValueFrom(this.http.patch<T>(url, body, options));
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    return firstValueFrom(this.http.delete<T>(url, options));
  }

  private buildUrl(endpoint: string): string {
    const baseUrl = this.config.apiUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${baseUrl}/${cleanEndpoint}`;
  }
}
