/* eslint-disable @typescript-eslint/no-explicit-any */
declare const describe: any, it: any, expect: any, jasmine: any;
import { Either } from '../../../shared/core/either/either';
import { CreateBudgetUseCase } from './create-budget-use-case';
import { NetworkError } from '../../errors';

describe('CreateBudgetUseCase', () => {
  const validRequest = {
    name: 'My Budget',
    limitInCents: 100000,
    ownerId: 'user-1'
  };

  function makePort() {
    const spy = (..._args: any[]) => { };
    (spy as any).and = { returnValue: (_v: any) => { } };
    return {
      createBudget: spy
    } as any;
  }

  it('deve criar orçamento via HTTP quando request é válido', async () => {
    const port = makePort();
    (port.createBudget as any).and.returnValue(Promise.resolve(Either.success(undefined)));
    const useCase = new CreateBudgetUseCase(port);

    const result = await useCase.execute(validRequest);

    expect(result.hasData).toBe(true);
    expect(port.createBudget).toHaveBeenCalledWith(validRequest);
  });

  it('deve propagar erro de validação do domain a partir do mapper', async () => {
    const port = makePort();
    const useCase = new CreateBudgetUseCase(port);

    const invalidRequest = { ...validRequest, name: '' };
    const result = await useCase.execute(invalidRequest as any);

    expect(result.hasError).toBe(true);
  });

  it('deve tratar erro de rede retornado pelo port HTTP', async () => {
    const port = makePort();
    (port.createBudget as any).and.returnValue(Promise.resolve(Either.error(new NetworkError('createBudget', 'offline'))));
    const useCase = new CreateBudgetUseCase(port);

    const result = await useCase.execute(validRequest);

    expect(result.hasError).toBe(true);
  });
});

