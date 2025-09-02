import { InjectionToken } from '@angular/core';
import { ICategoryMutationsPort } from '@application/ports/category/ICategoryMutationsPort';
import { ICategoryQueriesPort } from '@application/ports/category/ICategoryQueriesPort';

export const CATEGORY_MUTATIONS = new InjectionToken<ICategoryMutationsPort>('CATEGORY_MUTATIONS');
export const CATEGORY_QUERIES = new InjectionToken<ICategoryQueriesPort>('CATEGORY_QUERIES');
