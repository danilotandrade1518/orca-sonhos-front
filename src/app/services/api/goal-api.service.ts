import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateGoalRequestDto,
  UpdateGoalRequestDto,
  GoalResponseDto,
  GoalListResponseDto,
  GoalSummaryResponseDto,
} from '../../dtos/goal';
import { PaginationDto } from '../../dtos/common';

@Injectable({
  providedIn: 'root',
})
export class GoalApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/goals';

  createGoal(request: CreateGoalRequestDto): Observable<GoalResponseDto> {
    return this.http.post<GoalResponseDto>(this.baseUrl, request);
  }

  getGoal(id: string): Observable<GoalResponseDto> {
    return this.http.get<GoalResponseDto>(`${this.baseUrl}/${id}`);
  }

  updateGoal(id: string, request: UpdateGoalRequestDto): Observable<GoalResponseDto> {
    return this.http.put<GoalResponseDto>(`${this.baseUrl}/${id}`, request);
  }

  deleteGoal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getGoals(pagination: PaginationDto): Observable<GoalListResponseDto> {
    const params = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    };
    return this.http.get<GoalListResponseDto>(this.baseUrl, { params });
  }

  getGoalSummary(): Observable<GoalSummaryResponseDto> {
    return this.http.get<GoalSummaryResponseDto>(`${this.baseUrl}/summary`);
  }
}
