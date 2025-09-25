export interface PaginationQuery {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export const DEFAULT_PAGINATION: Readonly<PaginationQuery> = {
  page: 1,
  limit: 25,
  sortBy: 'createdAt',
  sortOrder: 'desc',
} as const;

export const MAX_PAGE_LIMIT = 100;

export function createPaginationMeta(
  page: number,
  limit: number,
  totalItems: number
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}