import { BaseRequestDto } from '@dtos/common';

export interface CreateCategoryRequestDto extends BaseRequestDto {
  userId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}
