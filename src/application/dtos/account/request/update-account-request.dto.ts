export interface UpdateAccountRequestDto {
  id: string;
  userId: string;
  name?: string;
  description?: string;
  initialBalance?: number;
}
