import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateCreditCardBillRequestDto,
  UpdateCreditCardBillRequestDto,
  PayCreditCardBillRequestDto,
  ReopenCreditCardBillRequestDto,
  CreditCardBillResponseDto,
  CreditCardBillListResponseDto,
} from '../../dtos/credit-card-bill';

@Injectable({
  providedIn: 'root',
})
export class CreditCardBillApiService {
  private readonly http = inject(HttpClient);

  // Commands (POST endpoints)
  createCreditCardBill(
    request: CreateCreditCardBillRequestDto
  ): Observable<CreditCardBillResponseDto> {
    return this.http.post<CreditCardBillResponseDto>(
      '/credit-card-bill/create-credit-card-bill',
      request
    );
  }

  updateCreditCardBill(
    request: UpdateCreditCardBillRequestDto
  ): Observable<CreditCardBillResponseDto> {
    return this.http.post<CreditCardBillResponseDto>(
      '/credit-card-bill/update-credit-card-bill',
      request
    );
  }

  payCreditCardBill(request: PayCreditCardBillRequestDto): Observable<void> {
    return this.http.post<void>('/credit-card-bill/pay-credit-card-bill', request);
  }

  reopenCreditCardBill(request: ReopenCreditCardBillRequestDto): Observable<void> {
    return this.http.post<void>('/credit-card-bill/reopen-credit-card-bill', request);
  }

  // Queries (GET endpoints)
  getCreditCardBill(billId: string): Observable<CreditCardBillResponseDto> {
    return this.http.get<CreditCardBillResponseDto>(`/credit-card-bill/${billId}`);
  }

  listCreditCardBills(creditCardId: string): Observable<CreditCardBillListResponseDto> {
    return this.http.get<CreditCardBillListResponseDto>(
      `/credit-card-bill/list-credit-card-bills?creditCardId=${creditCardId}`
    );
  }
}
