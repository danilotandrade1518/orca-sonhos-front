import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateEnvelopeRequestDto,
  UpdateEnvelopeRequestDto,
  AddAmountToEnvelopeRequestDto,
  RemoveAmountFromEnvelopeRequestDto,
  TransferBetweenEnvelopesRequestDto,
  EnvelopeResponseDto,
  EnvelopeListResponseDto,
} from '../../dtos/envelope';

@Injectable({
  providedIn: 'root',
})
export class EnvelopeApiService {
  private readonly http = inject(HttpClient);

  // Commands (POST endpoints)
  createEnvelope(request: CreateEnvelopeRequestDto): Observable<EnvelopeResponseDto> {
    return this.http.post<EnvelopeResponseDto>('/envelope/create-envelope', request);
  }

  updateEnvelope(request: UpdateEnvelopeRequestDto): Observable<EnvelopeResponseDto> {
    return this.http.post<EnvelopeResponseDto>('/envelope/update-envelope', request);
  }

  addAmountToEnvelope(request: AddAmountToEnvelopeRequestDto): Observable<void> {
    return this.http.post<void>('/envelope/add-amount-to-envelope', request);
  }

  removeAmountFromEnvelope(request: RemoveAmountFromEnvelopeRequestDto): Observable<void> {
    return this.http.post<void>('/envelope/remove-amount-from-envelope', request);
  }

  transferBetweenEnvelopes(request: TransferBetweenEnvelopesRequestDto): Observable<void> {
    return this.http.post<void>('/envelope/transfer-between-envelopes', request);
  }

  // Queries (GET endpoints)
  getEnvelope(envelopeId: string): Observable<EnvelopeResponseDto> {
    return this.http.get<EnvelopeResponseDto>(`/envelope/${envelopeId}`);
  }

  listEnvelopes(budgetId: string): Observable<EnvelopeListResponseDto> {
    return this.http.get<EnvelopeListResponseDto>(`/envelope/list-envelopes?budgetId=${budgetId}`);
  }
}
