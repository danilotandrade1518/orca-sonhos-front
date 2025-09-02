import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Uuid } from '@models/shared/value-objects/Uuid';

import { HttpCategoryMutationsPort } from './HttpCategoryMutationsPort';

describe('HttpCategoryMutationsPort (with MSW)', () => {
  const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174202');
  const categoryId = Uuid.create('123e4567-e89b-12d3-a456-426614174206');

  it('create/update/delete resolve successfully', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const port = new HttpCategoryMutationsPort(http);

    await expectAsync(port.createCategory({ userId, budgetId, name: 'Utilities' })).toBeResolved();
    await expectAsync(
      port.updateCategory({ categoryId, userId, budgetId, name: 'Utilities & Bills' })
    ).toBeResolved();
    await expectAsync(port.deleteCategory({ categoryId, userId, budgetId })).toBeResolved();
  });
});
