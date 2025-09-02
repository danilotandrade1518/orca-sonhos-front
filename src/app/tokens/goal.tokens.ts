import { InjectionToken } from '@angular/core';
import { IGoalMutationsPort } from '@application/ports/goal/IGoalMutationsPort';
import { IGoalQueriesPort } from '@application/ports/goal/IGoalQueriesPort';

export const GOAL_MUTATIONS = new InjectionToken<IGoalMutationsPort>('GOAL_MUTATIONS');
export const GOAL_QUERIES = new InjectionToken<IGoalQueriesPort>('GOAL_QUERIES');
