import { InjectionToken } from '@angular/core';
import { IBudgetMutationsPort } from '@application/ports/budget/IBudgetMutationsPort';
import { IBudgetQueriesPort } from '@application/ports/budget/IBudgetQueriesPort';

export const BUDGET_MUTATIONS = new InjectionToken<IBudgetMutationsPort>('BUDGET_MUTATIONS');
export const BUDGET_QUERIES = new InjectionToken<IBudgetQueriesPort>('BUDGET_QUERIES');
