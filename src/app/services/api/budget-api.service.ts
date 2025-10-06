import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
  DeleteBudgetRequestDto,
  AddParticipantRequestDto,
  RemoveParticipantRequestDto,
  BudgetResponseDto,
  BudgetListResponseDto,
  BudgetOverviewResponseDto,
} from '../../dtos/budget';

@Injectable({
  providedIn: 'root',
})
export class BudgetApiService {
  private readonly http = inject(HttpClient);

  // Commands (POST endpoints)
  createBudget(request: CreateBudgetRequestDto): Observable<BudgetResponseDto> {
    return this.http.post<BudgetResponseDto>('/budget/create-budget', request);
  }

  updateBudget(request: UpdateBudgetRequestDto): Observable<BudgetResponseDto> {
    return this.http.post<BudgetResponseDto>('/budget/update-budget', request);
  }

  deleteBudget(request: DeleteBudgetRequestDto): Observable<void> {
    return this.http.post<void>('/budget/delete-budget', request);
  }

  addParticipant(request: AddParticipantRequestDto): Observable<void> {
    return this.http.post<void>('/budget/add-participant', request);
  }

  removeParticipant(request: RemoveParticipantRequestDto): Observable<void> {
    return this.http.post<void>('/budget/remove-participant', request);
  }

  // Queries (GET endpoints)
  getBudgetOverview(budgetId: string): Observable<BudgetOverviewResponseDto> {
    return this.http.get<BudgetOverviewResponseDto>(`/budget/budget-overview?budgetId=${budgetId}`);
  }

  listBudgets(userId: string): Observable<BudgetListResponseDto> {
    return this.http.get<BudgetListResponseDto>(`/budget/list-budgets?userId=${userId}`);
  }
}
