import { HttpBudgetMutationsPort } from './HttpBudgetMutationsPort';
import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Uuid } from '@models/shared/value-objects/Uuid';

describe('HttpBudgetMutationsPort (with MSW)', () => {
  const ownerUserId = Uuid.create('123e4567-e89b-12d3-a456-426614174200');
  const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174202');
  const participantUserId = Uuid.create('123e4567-e89b-12d3-a456-426614174203');

  it('create/update/delete/add/remove resolve successfully', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const port = new HttpBudgetMutationsPort(http);

    await expectAsync(
      port.createBudget({ ownerUserId, name: 'Home', shared: true })
    ).toBeResolved();
    await expectAsync(port.updateBudget({ budgetId, userId, name: 'Home 2025' })).toBeResolved();
    await expectAsync(port.addParticipant({ budgetId, userId, participantUserId })).toBeResolved();
    await expectAsync(
      port.removeParticipant({ budgetId, userId, participantUserId })
    ).toBeResolved();
    await expectAsync(port.deleteBudget({ budgetId, userId })).toBeResolved();
  });
});
