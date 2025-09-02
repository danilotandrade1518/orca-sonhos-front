import { InjectionToken } from '@angular/core';
import { IAccountMutationsPort } from '@application/ports/account/IAccountMutationsPort';
import { IAccountQueriesPort } from '@application/ports/account/IAccountQueriesPort';

export const ACCOUNT_MUTATIONS = new InjectionToken<IAccountMutationsPort>('ACCOUNT_MUTATIONS');
export const ACCOUNT_QUERIES = new InjectionToken<IAccountQueriesPort>('ACCOUNT_QUERIES');
