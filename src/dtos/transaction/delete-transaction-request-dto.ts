export interface DeleteTransactionRequestDto {
  userId: string;
  id: string;
}

export interface DeleteTransactionResponseDto {
  success: boolean;
}
