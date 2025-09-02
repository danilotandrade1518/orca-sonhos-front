import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Uuid } from '@models/shared/value-objects/Uuid';

import { HttpCreditCardMutationsPort } from './HttpCreditCardMutationsPort';

describe('HttpCreditCardMutationsPort (with MSW)', () => {
  const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174202');
  const creditCardId = Uuid.create('123e4567-e89b-12d3-a456-426614174207');

  it('create/update/delete resolve successfully', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const port = new HttpCreditCardMutationsPort(http);

    await expectAsync(port.createCreditCard({ userId, budgetId, name: 'Visa' })).toBeResolved();
    await expectAsync(
      port.updateCreditCard({ creditCardId, userId, budgetId, name: 'Visa Platinum' })
    ).toBeResolved();
    await expectAsync(port.deleteCreditCard({ creditCardId, userId, budgetId })).toBeResolved();
  });
});
