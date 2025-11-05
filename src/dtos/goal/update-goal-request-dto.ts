export interface UpdateGoalDto {
  id: string;
  name: string;
  totalAmount: number;
  deadline?: string;
}

export interface UpdateGoalResponseDto {
  success: boolean;
}
