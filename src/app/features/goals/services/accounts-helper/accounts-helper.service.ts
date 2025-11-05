import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AccountDto } from '../../../../../dtos/budget/budget-types';
import { ApiService, ApiResponse } from '../../../../core/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsHelperService {
  private readonly api = inject(ApiService);

  private readonly _accounts = signal<AccountDto[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly accounts = this._accounts.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  loadAccounts(budgetId: string): Observable<AccountDto[]> {
    if (!budgetId) {
      this._error.set('budgetId é obrigatório');
      return of([]);
    }

    this._isLoading.set(true);
    this._error.set(null);

    return this.api.get<AccountDto[]>('accounts', { budgetId }).pipe(
      map((response: ApiResponse<AccountDto[]>) => {
        const accounts = response.data || [];
        this._accounts.set(accounts);
        this._isLoading.set(false);
        return accounts;
      }),
      catchError((error) => {
        this._error.set(error?.message || 'Erro ao carregar contas');
        this._isLoading.set(false);
        return of([]);
      })
    );
  }

  getAccountById(accountId: string): AccountDto | undefined {
    return this._accounts().find((account) => account.id === accountId);
  }

  clear(): void {
    this._accounts.set([]);
    this._error.set(null);
  }
}
