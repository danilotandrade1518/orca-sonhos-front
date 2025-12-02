export interface DeleteCategoryRequestDto {
  userId: string;
  categoryId: string;
}

export interface DeleteCategoryResponseDto {
  id: string;
  traceId: string;
}
