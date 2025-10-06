import { BaseRequestDto } from '@dtos/common';

export interface UpdateCategoryRequestDto extends BaseRequestDto {
  userId: string;
  categoryId: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}
