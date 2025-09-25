import { ApplicationError } from './application-error';

export class BudgetNotFoundError extends ApplicationError {
  constructor(budgetId: string, details?: Record<string, unknown>) {
    super(
      `Budget with ID '${budgetId}' was not found`,
      'BUDGET_NOT_FOUND',
      {
        budgetId,
        ...details,
      }
    );
  }
}