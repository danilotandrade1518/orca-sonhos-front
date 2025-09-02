import {
  CreateCreditCardDTO,
  DeleteCreditCardDTO,
  ICreditCardMutationsPort,
  UpdateCreditCardDTO,
} from '@application/ports/credit-card/ICreditCardMutationsPort';

import { HttpClient } from '../HttpClient';

export class HttpCreditCardMutationsPort implements ICreditCardMutationsPort {
  constructor(private readonly http: HttpClient) {}

  async createCreditCard(dto: CreateCreditCardDTO): Promise<void> {
    await this.http.post('/credit-card/create-credit-card', {
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      name: dto.name,
    });
  }

  async updateCreditCard(dto: UpdateCreditCardDTO): Promise<void> {
    await this.http.post('/credit-card/update-credit-card', {
      creditCardId: dto.creditCardId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      name: dto.name,
    });
  }

  async deleteCreditCard(dto: DeleteCreditCardDTO): Promise<void> {
    await this.http.post('/credit-card/delete-credit-card', {
      creditCardId: dto.creditCardId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
    });
  }
}
