import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
  BudgetResponseDto,
  BudgetListResponseDto,
  BudgetSummaryResponseDto,
} from '../../dtos/budget';
import { PaginationDto } from '../../dtos/common';

@Injectable({
  providedIn: 'root',
})
export class BudgetApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/budgets';

  createBudget(request: CreateBudgetRequestDto): Observable<BudgetResponseDto> {
    return this.http.post<BudgetResponseDto>(this.baseUrl, request);
  }

  getBudget(id: string): Observable<BudgetResponseDto> {
    return this.http.get<BudgetResponseDto>(`${this.baseUrl}/${id}`);
  }

  updateBudget(id: string, request: UpdateBudgetRequestDto): Observable<BudgetResponseDto> {
    return this.http.put<BudgetResponseDto>(`${this.baseUrl}/${id}`, request);
  }

  deleteBudget(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBudgets(pagination: PaginationDto): Observable<BudgetListResponseDto> {
    const params = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    };
    return this.http.get<BudgetListResponseDto>(this.baseUrl, { params });
  }

  getBudgetSummary(): Observable<BudgetSummaryResponseDto> {
    return this.http.get<BudgetSummaryResponseDto>(`${this.baseUrl}/summary`);
  }
}
