import { InjectionToken } from '@angular/core';
import { IGoalMutationsPort } from '@application/ports/goal/IGoalMutationsPort';

export const GOAL_MUTATIONS = new InjectionToken<IGoalMutationsPort>('GOAL_MUTATIONS');
