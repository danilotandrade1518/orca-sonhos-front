import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateAccountRequestDto,
  UpdateAccountRequestDto,
  AccountResponseDto,
  AccountListResponseDto,
  AccountSummaryResponseDto,
} from '../../dtos/account';
import { PaginationDto } from '../../dtos/common';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/accounts';

  createAccount(request: CreateAccountRequestDto): Observable<AccountResponseDto> {
    return this.http.post<AccountResponseDto>(this.baseUrl, request);
  }

  getAccount(id: string): Observable<AccountResponseDto> {
    return this.http.get<AccountResponseDto>(`${this.baseUrl}/${id}`);
  }

  updateAccount(id: string, request: UpdateAccountRequestDto): Observable<AccountResponseDto> {
    return this.http.put<AccountResponseDto>(`${this.baseUrl}/${id}`, request);
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAccounts(pagination: PaginationDto): Observable<AccountListResponseDto> {
    const params = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    };
    return this.http.get<AccountListResponseDto>(this.baseUrl, { params });
  }

  getAccountSummary(): Observable<AccountSummaryResponseDto> {
    return this.http.get<AccountSummaryResponseDto>(`${this.baseUrl}/summary`);
  }
}
