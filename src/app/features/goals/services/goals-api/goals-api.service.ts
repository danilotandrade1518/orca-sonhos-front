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
    return this.api.get<GoalDto[]>('goal', { budgetId });
  }

  create(body: CreateGoalDto): Observable<CreateGoalResponseDto> {
    return this.api.postRaw<CreateGoalResponseDto>('goal/create-goal', body);
  }

  update(body: UpdateGoalDto): Observable<UpdateGoalResponseDto> {
    return this.api.postRaw<UpdateGoalResponseDto>('goal/update-goal', body);
  }

  delete(body: DeleteGoalDto): Observable<DeleteGoalResponseDto> {
    return this.api.postRaw<DeleteGoalResponseDto>('goal/delete-goal', body);
  }

  addAmount(body: AddAmountToGoalDto): Observable<AddAmountToGoalResponseDto> {
    return this.api.postRaw<AddAmountToGoalResponseDto>('goal/add-amount-goal', body);
  }

  removeAmount(
    body: RemoveAmountFromGoalDto
  ): Observable<RemoveAmountFromGoalResponseDto> {
    return this.api.postRaw<RemoveAmountFromGoalResponseDto>('goal/remove-amount-goal', body);
  }
}
