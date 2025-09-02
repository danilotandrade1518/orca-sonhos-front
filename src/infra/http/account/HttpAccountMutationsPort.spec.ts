import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Money } from '@models/shared/value-objects/Money';
import { Uuid } from '@models/shared/value-objects/Uuid';

import { HttpAccountMutationsPort } from './HttpAccountMutationsPort';

describe('HttpAccountMutationsPort (with MSW)', () => {
  const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174202');
  const accountId = Uuid.create('123e4567-e89b-12d3-a456-426614174204');
  const anotherAccountId = Uuid.create('123e4567-e89b-12d3-a456-426614174205');

  it('create/update/delete/reconcile/transfer resolve successfully', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const port = new HttpAccountMutationsPort(http);

    await expectAsync(port.createAccount({ userId, budgetId, name: 'Checking' })).toBeResolved();
    await expectAsync(
      port.updateAccount({ accountId, userId, budgetId, name: 'Checking Plus' })
    ).toBeResolved();
    await expectAsync(
      port.reconcileAccount({
        accountId,
        userId,
        budgetId,
        balance: Money.fromNumber(123.45),
        statementDate: new Date('2025-01-31'),
      })
    ).toBeResolved();
    await expectAsync(
      port.transferBetweenAccounts({
        sourceAccountId: accountId,
        targetAccountId: anotherAccountId,
        userId,
        budgetId,
        amount: Money.fromNumber(50),
      })
    ).toBeResolved();
    await expectAsync(port.deleteAccount({ accountId, userId, budgetId })).toBeResolved();
  });
});
