export interface BaseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseRequestDto {
  readonly _type: 'request';
}

export interface BaseResponseDto extends BaseDto {
  readonly _type: 'response';
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationDto;
}

export interface ErrorResponseDto {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}
