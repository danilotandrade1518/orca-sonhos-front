/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Pagination metadata for responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Create pagination query from page and limit
 */
export function createPaginationQuery(page: number = 1, limit: number = 10): PaginationQuery {
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.max(1, Math.min(100, limit)); // Max 100 items per page
  
  return {
    page: normalizedPage,
    limit: normalizedLimit,
    offset: (normalizedPage - 1) * normalizedLimit,
  };
}

/**
 * Create pagination metadata from query and total count
 */
export function createPaginationMeta(
  query: PaginationQuery,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / query.limit);
  
  return {
    page: query.page,
    limit: query.limit,
    total,
    totalPages,
    hasNext: query.page < totalPages,
    hasPrevious: query.page > 1,
  };
}