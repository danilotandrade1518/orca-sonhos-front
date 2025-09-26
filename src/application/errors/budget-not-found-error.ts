import { ApplicationError } from './application-error';

/**
 * Error thrown when a budget is not found
 */
export class BudgetNotFoundError extends ApplicationError {
  constructor(budgetId: string) {
    super(
      `Budget with ID '${budgetId}' not found`,
      'BUDGET_NOT_FOUND',
      404
    );
  }
}