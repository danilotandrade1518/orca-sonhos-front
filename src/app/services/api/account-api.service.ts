import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateAccountRequestDto,
  UpdateAccountRequestDto,
  ReconcileAccountRequestDto,
  TransferBetweenAccountsRequestDto,
  AccountResponseDto,
  AccountListResponseDto,
} from '../../dtos/account';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private readonly http = inject(HttpClient);

  // Commands (POST endpoints)
  createAccount(request: CreateAccountRequestDto): Observable<AccountResponseDto> {
    return this.http.post<AccountResponseDto>('/account/create-account', request);
  }

  updateAccount(request: UpdateAccountRequestDto): Observable<AccountResponseDto> {
    return this.http.post<AccountResponseDto>('/account/update-account', request);
  }

  reconcileAccount(request: ReconcileAccountRequestDto): Observable<void> {
    return this.http.post<void>('/account/reconcile-account', request);
  }

  transferBetweenAccounts(request: TransferBetweenAccountsRequestDto): Observable<void> {
    return this.http.post<void>('/account/transfer-between-accounts', request);
  }

  // Queries (GET endpoints)
  getAccount(accountId: string): Observable<AccountResponseDto> {
    return this.http.get<AccountResponseDto>(`/account/${accountId}`);
  }

  listAccounts(budgetId: string): Observable<AccountListResponseDto> {
    return this.http.get<AccountListResponseDto>(`/account/list-accounts?budgetId=${budgetId}`);
  }
}
