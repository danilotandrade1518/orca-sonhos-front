import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Money } from '@models/shared/value-objects/Money';
import { Uuid } from '@models/shared/value-objects/Uuid';

import { HttpCreditCardBillMutationsPort } from './HttpCreditCardBillMutationsPort';

describe('HttpCreditCardBillMutationsPort (with MSW)', () => {
  const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174202');
  const creditCardId = Uuid.create('123e4567-e89b-12d3-a456-426614174207');
  const creditCardBillId = Uuid.create('123e4567-e89b-12d3-a456-426614174208');

  it('create/update/delete/pay/reopen resolve successfully', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const port = new HttpCreditCardBillMutationsPort(http);

    await expectAsync(
      port.createCreditCardBill({ userId, budgetId, creditCardId, dueDate: new Date('2025-02-10') })
    ).toBeResolved();
    await expectAsync(
      port.updateCreditCardBill({
        creditCardBillId,
        userId,
        budgetId,
        dueDate: new Date('2025-02-15'),
      })
    ).toBeResolved();
    // update without optional dueDate to cover undefined branch
    await expectAsync(
      port.updateCreditCardBill({ creditCardBillId, userId, budgetId })
    ).toBeResolved();
    await expectAsync(
      port.payCreditCardBill({ creditCardBillId, userId, budgetId, amount: Money.fromNumber(250) })
    ).toBeResolved();
    await expectAsync(
      port.reopenCreditCardBill({ creditCardBillId, userId, budgetId })
    ).toBeResolved();
    await expectAsync(
      port.deleteCreditCardBill({ creditCardBillId, userId, budgetId })
    ).toBeResolved();
  });
});
