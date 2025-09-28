export interface UpdateGoalRequestDto {
  id: string;
  name?: string;
  totalAmount?: number;
  deadline?: string;
  description?: string;
}
