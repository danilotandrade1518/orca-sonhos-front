import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateCreditCardRequestDto,
  UpdateCreditCardRequestDto,
  CreditCardResponseDto,
  CreditCardListResponseDto,
  CreditCardSummaryResponseDto,
} from '../../dtos/credit-card';
import { PaginationDto } from '../../dtos/common';

@Injectable({
  providedIn: 'root',
})
export class CreditCardApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/credit-cards';

  createCreditCard(request: CreateCreditCardRequestDto): Observable<CreditCardResponseDto> {
    return this.http.post<CreditCardResponseDto>(this.baseUrl, request);
  }

  getCreditCard(id: string): Observable<CreditCardResponseDto> {
    return this.http.get<CreditCardResponseDto>(`${this.baseUrl}/${id}`);
  }

  updateCreditCard(
    id: string,
    request: UpdateCreditCardRequestDto
  ): Observable<CreditCardResponseDto> {
    return this.http.put<CreditCardResponseDto>(`${this.baseUrl}/${id}`, request);
  }

  deleteCreditCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getCreditCards(pagination: PaginationDto): Observable<CreditCardListResponseDto> {
    const params = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    };
    return this.http.get<CreditCardListResponseDto>(this.baseUrl, { params });
  }

  getCreditCardSummary(): Observable<CreditCardSummaryResponseDto> {
    return this.http.get<CreditCardSummaryResponseDto>(`${this.baseUrl}/summary`);
  }
}
