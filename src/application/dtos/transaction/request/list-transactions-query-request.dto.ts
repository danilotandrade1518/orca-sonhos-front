export interface ListTransactionsQueryRequestDto {
  budgetId: string;
  accountId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}
