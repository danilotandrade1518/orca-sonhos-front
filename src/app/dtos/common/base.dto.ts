/**
 * Base DTO with common properties
 */
export interface BaseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Base request DTO
 */
export interface BaseRequestDto {
  // Common request properties can be added here
  readonly _type: 'request';
}

/**
 * Base response DTO
 */
export interface BaseResponseDto extends BaseDto {
  // Common response properties can be added here
  readonly _type: 'response';
}

/**
 * Pagination DTO
 */
export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response DTO
 */
export interface PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationDto;
}

/**
 * Error response DTO
 */
export interface ErrorResponseDto {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}
