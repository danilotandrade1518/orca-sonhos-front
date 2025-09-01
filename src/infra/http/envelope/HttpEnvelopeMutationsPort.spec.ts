import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Money } from '@models/shared/value-objects/Money';
import { Uuid } from '@models/shared/value-objects/Uuid';

import { HttpEnvelopeMutationsPort } from './HttpEnvelopeMutationsPort';

describe('HttpEnvelopeMutationsPort (with MSW)', () => {
  const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174100');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174101');
  const envelopeId = Uuid.create('123e4567-e89b-12d3-a456-426614174102');
  const categoryId = Uuid.create('123e4567-e89b-12d3-a456-426614174103');

  it('createEnvelope posts and succeeds', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const adapter = new HttpEnvelopeMutationsPort(http);
    await expectAsync(
      adapter.createEnvelope({
        name: 'Groceries',
        monthlyLimit: Money.fromCents(1234),
        budgetId,
        categoryId,
        userId,
      })
    ).toBeResolved();
  });

  it('update/delete/add/remove/transfer resolve without error', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const adapter = new HttpEnvelopeMutationsPort(http);
    await expectAsync(
      adapter.updateEnvelope({
        envelopeId,
        userId,
        budgetId,
        name: 'New Name',
        monthlyLimit: Money.fromCents(500),
      })
    ).toBeResolved();
    await expectAsync(adapter.deleteEnvelope({ envelopeId, userId, budgetId })).toBeResolved();
    await expectAsync(
      adapter.addAmount({ envelopeId, userId, budgetId, amount: Money.fromCents(300) })
    ).toBeResolved();
    await expectAsync(
      adapter.removeAmount({ envelopeId, userId, budgetId, amount: Money.fromCents(200) })
    ).toBeResolved();
    await expectAsync(
      adapter.transferBetweenEnvelopes({
        sourceEnvelopeId: envelopeId,
        targetEnvelopeId: Uuid.create('123e4567-e89b-12d3-a456-426614174104'),
        userId,
        budgetId,
        amount: Money.fromCents(50),
      })
    ).toBeResolved();
  });

  it('updateEnvelope without monthlyLimit (undefined branch)', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const adapter = new HttpEnvelopeMutationsPort(http);
    await expectAsync(
      adapter.updateEnvelope({
        envelopeId,
        userId,
        budgetId,
        name: 'Only name change',
      })
    ).toBeResolved();
  });
});
