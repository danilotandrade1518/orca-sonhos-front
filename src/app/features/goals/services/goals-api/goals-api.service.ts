import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AddAmountToGoalDto,
  AddAmountToGoalResponseDto,
  CreateGoalDto,
  CreateGoalResponseDto,
  DeleteGoalDto,
  DeleteGoalResponseDto,
  GoalDto,
  RemoveAmountFromGoalDto,
  RemoveAmountFromGoalResponseDto,
  UpdateGoalDto,
  UpdateGoalResponseDto,
} from '../../../../../dtos/goal';
import { ApiService, ApiResponse } from '../../../../core/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class GoalsApiService {
  private readonly api = inject(ApiService);

  listByBudget(budgetId: string): Observable<ApiResponse<GoalDto[]>> {
    return this.api.get<GoalDto[]>('goals', { budgetId });
  }

  create(body: CreateGoalDto): Observable<ApiResponse<CreateGoalResponseDto>> {
    return this.api.post<CreateGoalResponseDto>('goal/create-goal', body);
  }

  update(body: UpdateGoalDto): Observable<ApiResponse<UpdateGoalResponseDto>> {
    return this.api.post<UpdateGoalResponseDto>('goal/update-goal', body);
  }

  delete(body: DeleteGoalDto): Observable<ApiResponse<DeleteGoalResponseDto>> {
    return this.api.post<DeleteGoalResponseDto>('goal/delete-goal', body);
  }

  addAmount(body: AddAmountToGoalDto): Observable<ApiResponse<AddAmountToGoalResponseDto>> {
    return this.api.post<AddAmountToGoalResponseDto>('goal/add-amount-goal', body);
  }

  removeAmount(body: RemoveAmountFromGoalDto): Observable<ApiResponse<RemoveAmountFromGoalResponseDto>> {
    return this.api.post<RemoveAmountFromGoalResponseDto>('goal/remove-amount-goal', body);
  }
}

