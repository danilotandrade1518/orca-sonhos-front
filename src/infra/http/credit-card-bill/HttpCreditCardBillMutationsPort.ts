import {
  CreateCreditCardBillDTO,
  DeleteCreditCardBillDTO,
  ICreditCardBillMutationsPort,
  PayCreditCardBillDTO,
  ReopenCreditCardBillDTO,
  UpdateCreditCardBillDTO,
} from '@application/ports/credit-card-bill/ICreditCardBillMutationsPort';
import { MoneyMapper } from '@models/shared/mappers/MoneyMapper';

import { HttpClient } from '../HttpClient';

export class HttpCreditCardBillMutationsPort implements ICreditCardBillMutationsPort {
  constructor(private readonly http: HttpClient) {}

  async createCreditCardBill(dto: CreateCreditCardBillDTO): Promise<void> {
    await this.http.post('/credit-card-bill/create-credit-card-bill', {
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      creditCardId: dto.creditCardId.toString(),
      dueDate: dto.dueDate.toISOString(),
    });
  }

  async updateCreditCardBill(dto: UpdateCreditCardBillDTO): Promise<void> {
    await this.http.post('/credit-card-bill/update-credit-card-bill', {
      creditCardBillId: dto.creditCardBillId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      dueDate: dto.dueDate ? dto.dueDate.toISOString() : undefined,
    });
  }

  async deleteCreditCardBill(dto: DeleteCreditCardBillDTO): Promise<void> {
    await this.http.post('/credit-card-bill/delete-credit-card-bill', {
      creditCardBillId: dto.creditCardBillId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
    });
  }

  async payCreditCardBill(dto: PayCreditCardBillDTO): Promise<void> {
    await this.http.post('/credit-card-bill/pay-credit-card-bill', {
      creditCardBillId: dto.creditCardBillId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      amount: MoneyMapper.toApi(dto.amount),
    });
  }

  async reopenCreditCardBill(dto: ReopenCreditCardBillDTO): Promise<void> {
    await this.http.post('/credit-card-bill/reopen-bill', {
      creditCardBillId: dto.creditCardBillId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
    });
  }
}
