import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
  TransactionResponseDto,
  TransactionListResponseDto,
  TransactionSummaryResponseDto,
} from '../../dtos/transaction';
import { PaginationDto } from '../../dtos/common';

@Injectable({
  providedIn: 'root',
})
export class TransactionApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/transactions';

  createTransaction(request: CreateTransactionRequestDto): Observable<TransactionResponseDto> {
    return this.http.post<TransactionResponseDto>(this.baseUrl, request);
  }

  getTransaction(id: string): Observable<TransactionResponseDto> {
    return this.http.get<TransactionResponseDto>(`${this.baseUrl}/${id}`);
  }

  updateTransaction(
    id: string,
    request: UpdateTransactionRequestDto
  ): Observable<TransactionResponseDto> {
    return this.http.put<TransactionResponseDto>(`${this.baseUrl}/${id}`, request);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getTransactions(pagination: PaginationDto): Observable<TransactionListResponseDto> {
    const params = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    };
    return this.http.get<TransactionListResponseDto>(this.baseUrl, { params });
  }

  getTransactionSummary(): Observable<TransactionSummaryResponseDto> {
    return this.http.get<TransactionSummaryResponseDto>(`${this.baseUrl}/summary`);
  }
}
