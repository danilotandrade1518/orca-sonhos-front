import { InjectionToken } from '@angular/core';
import { ICategoryMutationsPort } from '@application/ports/category/ICategoryMutationsPort';

export const CATEGORY_MUTATIONS = new InjectionToken<ICategoryMutationsPort>('CATEGORY_MUTATIONS');
