import { InjectionToken } from '@angular/core';
import { IAccountMutationsPort } from '@application/ports/account/IAccountMutationsPort';

export const ACCOUNT_MUTATIONS = new InjectionToken<IAccountMutationsPort>('ACCOUNT_MUTATIONS');
