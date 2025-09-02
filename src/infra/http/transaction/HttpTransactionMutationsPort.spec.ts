import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Money } from '@models/shared/value-objects/Money';
import { Uuid } from '@models/shared/value-objects/Uuid';

import { HttpTransactionMutationsPort } from './HttpTransactionMutationsPort';

describe('HttpTransactionMutationsPort (with MSW)', () => {
  const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174202');
  const accountId = Uuid.create('123e4567-e89b-12d3-a456-426614174204');
  const categoryId = Uuid.create('123e4567-e89b-12d3-a456-426614174206');
  const transactionId = Uuid.create('123e4567-e89b-12d3-a456-426614174210');

  it('create/update/delete/mark-late/cancel resolve successfully', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const port = new HttpTransactionMutationsPort(http);

    await expectAsync(
      port.createTransaction({
        userId,
        budgetId,
        accountId,
        categoryId,
        description: 'Groceries',
        amount: Money.fromNumber(75.5),
        transactionDate: new Date('2025-03-01'),
      })
    ).toBeResolved();
    await expectAsync(
      port.updateTransaction({
        transactionId,
        userId,
        budgetId,
        description: 'Supermarket',
        amount: Money.fromNumber(80),
        transactionDate: new Date('2025-03-02'),
      })
    ).toBeResolved();
    // update with only description to cover optional branches
    await expectAsync(
      port.updateTransaction({ transactionId, userId, budgetId, description: 'Note only' })
    ).toBeResolved();
    await expectAsync(
      port.markTransactionLate({
        transactionId,
        userId,
        budgetId,
        lateDate: new Date('2025-03-10'),
      })
    ).toBeResolved();
    await expectAsync(
      port.cancelScheduledTransaction({ transactionId, userId, budgetId })
    ).toBeResolved();
    await expectAsync(port.deleteTransaction({ transactionId, userId, budgetId })).toBeResolved();
  });
});
