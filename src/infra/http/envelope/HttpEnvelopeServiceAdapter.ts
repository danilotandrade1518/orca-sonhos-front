import { HttpClient } from '../HttpClient';
import { MoneyMapper } from '@models/shared/mappers/MoneyMapper';
import {
  AddAmountEnvelopeDTO,
  CreateEnvelopeDTO,
  DeleteEnvelopeDTO,
  IEnvelopeServicePort,
  RemoveAmountEnvelopeDTO,
  TransferBetweenEnvelopesDTO,
  UpdateEnvelopeDTO,
} from '@application/ports/envelope/IEnvelopeServicePort';

export class HttpEnvelopeServiceAdapter implements IEnvelopeServicePort {
  constructor(private readonly http: HttpClient) {}

  async createEnvelope(dto: CreateEnvelopeDTO): Promise<void> {
    await this.http.post('/envelope/create-envelope', {
      name: dto.name,
      monthlyLimit: MoneyMapper.toApi(dto.monthlyLimit),
      budgetId: dto.budgetId.toString(),
      categoryId: dto.categoryId.toString(),
      userId: dto.userId.toString(),
    });
  }

  async updateEnvelope(dto: UpdateEnvelopeDTO): Promise<void> {
    await this.http.post('/envelope/update-envelope', {
      envelopeId: dto.envelopeId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      name: dto.name,
      monthlyLimit: dto.monthlyLimit ? MoneyMapper.toApi(dto.monthlyLimit) : undefined,
    });
  }

  async deleteEnvelope(dto: DeleteEnvelopeDTO): Promise<void> {
    await this.http.post('/envelope/delete-envelope', {
      envelopeId: dto.envelopeId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
    });
  }

  async addAmount(dto: AddAmountEnvelopeDTO): Promise<void> {
    await this.http.post('/envelope/add-amount-envelope', {
      envelopeId: dto.envelopeId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      amount: MoneyMapper.toApi(dto.amount),
    });
  }

  async removeAmount(dto: RemoveAmountEnvelopeDTO): Promise<void> {
    await this.http.post('/envelope/remove-amount-envelope', {
      envelopeId: dto.envelopeId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      amount: MoneyMapper.toApi(dto.amount),
    });
  }

  async transferBetweenEnvelopes(dto: TransferBetweenEnvelopesDTO): Promise<void> {
    await this.http.post('/envelope/transfer-between-envelopes', {
      sourceEnvelopeId: dto.sourceEnvelopeId.toString(),
      targetEnvelopeId: dto.targetEnvelopeId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      amount: MoneyMapper.toApi(dto.amount),
    });
  }
}
