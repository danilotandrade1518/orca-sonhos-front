import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountsHelperService } from './accounts-helper.service';
import { ApiService } from '../../../../core/services/api/api.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';

describe('AccountsHelperService', () => {
  let service: AccountsHelperService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountsHelperService, ApiService, ConfigService, NotificationService],
    });
    service = TestBed.inject(AccountsHelperService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadAccounts', () => {
    it('should load accounts successfully', () => {
      const budgetId = 'budget-1';
      const mockAccounts = [
        { id: 'account-1', name: 'Conta Corrente', type: 'CHECKING_ACCOUNT' as const, balance: 1000 },
        { id: 'account-2', name: 'Poupança', type: 'SAVINGS_ACCOUNT' as const, balance: 2000 },
      ];

      service.loadAccounts(budgetId).subscribe((accounts) => {
        expect(accounts).toEqual(mockAccounts);
        expect(service.accounts()).toEqual(mockAccounts);
        expect(service.isLoading()).toBe(false);
        expect(service.error()).toBeNull();
      });

      const req = httpMock.expectOne((request) => request.url.includes('accounts'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('budgetId')).toBe(budgetId);
      req.flush({ data: mockAccounts });
    });

    it('should handle error when loading accounts', () => {
      const budgetId = 'budget-1';

      service.loadAccounts(budgetId).subscribe((accounts) => {
        expect(accounts).toEqual([]);
        expect(service.error()).toBeTruthy();
        expect(service.isLoading()).toBe(false);
      });

      const req = httpMock.expectOne((request) => request.url.includes('accounts'));
      req.error(new ErrorEvent('Network error'), { status: 500 });
    });

    it('should return empty array if budgetId is not provided', () => {
      service.loadAccounts('').subscribe((accounts) => {
        expect(accounts).toEqual([]);
        expect(service.error()).toBeTruthy();
      });
    });
  });

  describe('getAccountById', () => {
    it('should return account by id', () => {
      const mockAccounts = [
        { id: 'account-1', name: 'Conta Corrente', type: 'CHECKING_ACCOUNT' as const, balance: 1000 },
        { id: 'account-2', name: 'Poupança', type: 'SAVINGS_ACCOUNT' as const, balance: 2000 },
      ];

      service.loadAccounts('budget-1').subscribe(() => {
        const account = service.getAccountById('account-1');
        expect(account).toEqual(mockAccounts[0]);
      });

      const req = httpMock.expectOne((request) => request.url.includes('accounts'));
      req.flush({ data: mockAccounts });
    });

    it('should return undefined if account not found', () => {
      const mockAccounts = [
        { id: 'account-1', name: 'Conta Corrente', type: 'CHECKING_ACCOUNT' as const, balance: 1000 },
      ];

      service.loadAccounts('budget-1').subscribe(() => {
        const account = service.getAccountById('account-999');
        expect(account).toBeUndefined();
      });

      const req = httpMock.expectOne((request) => request.url.includes('accounts'));
      req.flush({ data: mockAccounts });
    });
  });

  describe('clear', () => {
    it('should clear accounts and error', () => {
      const mockAccounts = [
        { id: 'account-1', name: 'Conta Corrente', type: 'CHECKING_ACCOUNT' as const, balance: 1000 },
      ];

      service.loadAccounts('budget-1').subscribe(() => {
        service.clear();
        expect(service.accounts()).toEqual([]);
        expect(service.error()).toBeNull();
      });

      const req = httpMock.expectOne((request) => request.url.includes('accounts'));
      req.flush({ data: mockAccounts });
    });
  });
});
