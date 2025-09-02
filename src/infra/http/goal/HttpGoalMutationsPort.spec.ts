import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Money } from '@models/shared/value-objects/Money';
import { Uuid } from '@models/shared/value-objects/Uuid';

import { HttpGoalMutationsPort } from './HttpGoalMutationsPort';

describe('HttpGoalMutationsPort (with MSW)', () => {
  const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174202');
  const goalId = Uuid.create('123e4567-e89b-12d3-a456-426614174209');

  it('create/update/delete/add-amount resolve successfully', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const port = new HttpGoalMutationsPort(http);

    await expectAsync(
      port.createGoal({ userId, budgetId, name: 'Trip', target: Money.fromNumber(1000) })
    ).toBeResolved();
    await expectAsync(
      port.updateGoal({
        goalId,
        userId,
        budgetId,
        name: 'Trip 2026',
        target: Money.fromNumber(1200),
      })
    ).toBeResolved();
    // update without optional target
    await expectAsync(
      port.updateGoal({ goalId, userId, budgetId, name: 'Trip 2027' })
    ).toBeResolved();
    await expectAsync(
      port.addAmount({ goalId, userId, budgetId, amount: Money.fromNumber(100) })
    ).toBeResolved();
    await expectAsync(port.deleteGoal({ goalId, userId, budgetId })).toBeResolved();
  });
});
