import { AccountRequestMapper } from './account-request-mapper';
import { ValidationError } from '../../../errors';
import { AccountType } from '../../../../models/shared/enums/account-type';
import {
  CreateAccountRequestDto,
  UpdateAccountRequestDto,
  DeleteAccountRequestDto,
  ReconcileAccountRequestDto,
  TransferBetweenAccountsRequestDto,
} from '../../../dtos/account';

describe('AccountRequestMapper', () => {
  describe('fromCreateRequestToAccount', () => {
    it('should convert valid CreateAccountRequestDto to Account model', () => {
      const dto: CreateAccountRequestDto = {
        userId: 'user-123',
        name: 'Test Account',
        type: AccountType.CHECKING,
        budgetId: 'budget-123',
        initialBalance: 1000,
        description: 'Test description',
      };

      const result = AccountRequestMapper.fromCreateRequestToAccount(dto);

      expect(result.hasData).toBe(true);
      expect(result.data?.name).toBe('Test Account');
      expect(result.data?.type).toBe(AccountType.CHECKING);
      expect(result.data?.budgetId).toBe('budget-123');
      expect(result.data?.balance.valueInCents).toBe(1000);
      expect(result.data?.description).toBe('Test description');
    });

    it('should handle optional fields correctly', () => {
      const dto: CreateAccountRequestDto = {
        userId: 'user-123',
        name: 'Test Account',
        type: AccountType.CHECKING,
        budgetId: 'budget-123',
      };

      const result = AccountRequestMapper.fromCreateRequestToAccount(dto);

      expect(result.hasData).toBe(true);
      expect(result.data?.balance.valueInCents).toBe(0);
      expect(result.data?.description).toBe('');
    });

    it('should return validation error when Account model creation fails', () => {
      const dto: CreateAccountRequestDto = {
        userId: 'user-123',
        name: '',
        type: AccountType.CHECKING,
        budgetId: 'budget-123',
      };

      const result = AccountRequestMapper.fromCreateRequestToAccount(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Account creation failed');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = AccountRequestMapper.fromCreateRequestToAccount(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('validateUpdateRequest', () => {
    it('should validate valid UpdateAccountRequestDto', () => {
      const dto: UpdateAccountRequestDto = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Updated Account',
        description: 'Updated description',
        initialBalance: 2000,
      };

      const result = AccountRequestMapper.validateUpdateRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should validate partial UpdateAccountRequestDto', () => {
      const dto: UpdateAccountRequestDto = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Updated Account',
      };

      const result = AccountRequestMapper.validateUpdateRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error when id is missing', () => {
      const dto = {
        userId: 'user-123',
        name: 'Updated Account',
      } as UpdateAccountRequestDto;

      const result = AccountRequestMapper.validateUpdateRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Account ID is required');
    });

    it('should return validation error when userId is missing', () => {
      const dto = {
        id: 'account-123',
        name: 'Updated Account',
      } as UpdateAccountRequestDto;

      const result = AccountRequestMapper.validateUpdateRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('User ID is required');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = AccountRequestMapper.validateUpdateRequest(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('validateDeleteRequest', () => {
    it('should validate valid DeleteAccountRequestDto', () => {
      const dto: DeleteAccountRequestDto = {
        id: 'account-123',
        userId: 'user-123',
      };

      const result = AccountRequestMapper.validateDeleteRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error when id is empty', () => {
      const dto: DeleteAccountRequestDto = {
        id: '   ',
        userId: 'user-123',
      };

      const result = AccountRequestMapper.validateDeleteRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Account ID is required');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = AccountRequestMapper.validateDeleteRequest(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('validateReconcileRequest', () => {
    it('should validate valid ReconcileAccountRequestDto', () => {
      const dto: ReconcileAccountRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-123',
        accountId: 'account-123',
        realBalance: 1500,
      };

      const result = AccountRequestMapper.validateReconcileRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error when realBalance is not a number', () => {
      const dto = {
        userId: 'user-123',
        budgetId: 'budget-123',
        accountId: 'account-123',
        realBalance: 'invalid',
      } as any;

      const result = AccountRequestMapper.validateReconcileRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Real balance is required and must be a number');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = AccountRequestMapper.validateReconcileRequest(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('validateTransferRequest', () => {
    it('should validate valid TransferBetweenAccountsRequestDto', () => {
      const dto: TransferBetweenAccountsRequestDto = {
        userId: 'user-123',
        fromAccountId: 'account-123',
        toAccountId: 'account-456',
        amount: 500,
        description: 'Transfer description',
      };

      const result = AccountRequestMapper.validateTransferRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error when amount is not positive', () => {
      const dto: TransferBetweenAccountsRequestDto = {
        userId: 'user-123',
        fromAccountId: 'account-123',
        toAccountId: 'account-456',
        amount: -100,
        description: 'Transfer description',
      };

      const result = AccountRequestMapper.validateTransferRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain(
        'Amount is required and must be a positive number'
      );
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = AccountRequestMapper.validateTransferRequest(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('normalizeUpdateRequest', () => {
    it('should trim whitespace from all string fields', () => {
      const dto: UpdateAccountRequestDto = {
        id: '  account-123  ',
        userId: '  user-123  ',
        name: '  Updated Account  ',
        description: '  Updated description  ',
      };

      const result = AccountRequestMapper.normalizeUpdateRequest(dto);

      expect(result.id).toBe('account-123');
      expect(result.userId).toBe('user-123');
      expect(result.name).toBe('Updated Account');
      expect(result.description).toBe('Updated description');
    });
  });

  describe('normalizeDeleteRequest', () => {
    it('should trim whitespace from all string fields', () => {
      const dto: DeleteAccountRequestDto = {
        id: '  account-123  ',
        userId: '  user-123  ',
      };

      const result = AccountRequestMapper.normalizeDeleteRequest(dto);

      expect(result.id).toBe('account-123');
      expect(result.userId).toBe('user-123');
    });
  });

  describe('normalizeReconcileRequest', () => {
    it('should trim whitespace from all string fields', () => {
      const dto: ReconcileAccountRequestDto = {
        userId: '  user-123  ',
        budgetId: '  budget-123  ',
        accountId: '  account-123  ',
        realBalance: 1500,
      };

      const result = AccountRequestMapper.normalizeReconcileRequest(dto);

      expect(result.userId).toBe('user-123');
      expect(result.budgetId).toBe('budget-123');
      expect(result.accountId).toBe('account-123');
      expect(result.realBalance).toBe(1500);
    });
  });

  describe('normalizeTransferRequest', () => {
    it('should trim whitespace from all string fields', () => {
      const dto: TransferBetweenAccountsRequestDto = {
        userId: '  user-123  ',
        fromAccountId: '  account-123  ',
        toAccountId: '  account-456  ',
        amount: 500,
        description: '  Transfer description  ',
      };

      const result = AccountRequestMapper.normalizeTransferRequest(dto);

      expect(result.userId).toBe('user-123');
      expect(result.fromAccountId).toBe('account-123');
      expect(result.toAccountId).toBe('account-456');
      expect(result.amount).toBe(500);
      expect(result.description).toBe('Transfer description');
    });
  });
});
