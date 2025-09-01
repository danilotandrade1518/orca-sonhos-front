import { InjectionToken } from '@angular/core';
import { IBudgetMutationsPort } from '@application/ports/budget/IBudgetMutationsPort';

export const BUDGET_MUTATIONS = new InjectionToken<IBudgetMutationsPort>('BUDGET_MUTATIONS');
