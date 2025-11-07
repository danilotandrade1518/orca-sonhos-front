import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { TransferModalComponent } from './transfer-modal.component';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AccountDto } from '../../../../../dtos/account/account-types';
import { AuthUser } from '@app/core';

describe('TransferModalComponent', () => {
  let component: TransferModalComponent;
  let fixture: ComponentFixture<TransferModalComponent>;
  let accountState: {
    accountsByBudgetId: ReturnType<typeof signal<AccountDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    transferBetweenAccounts: ReturnType<typeof vi.fn>;
    clearError: ReturnType<typeof vi.fn>;
  };
  let budgetSelection: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
  };
  let notificationService: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let authService: {
    currentUser: ReturnType<typeof signal<AuthUser | null>>;
  };

  const mockAccounts: AccountDto[] = [
    {
      id: 'account-1',
      name: 'Conta Corrente',
      type: 'CHECKING_ACCOUNT',
      balance: 5000.0,
    },
    {
      id: 'account-2',
      name: 'Conta Poupança',
      type: 'SAVINGS_ACCOUNT',
      balance: 10000.0,
    },
  ];

  const mockUser: AuthUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
  };

  beforeEach(async () => {
    accountState = {
      accountsByBudgetId: signal(mockAccounts),
      loading: signal(false),
      error: signal(null),
      transferBetweenAccounts: vi.fn(),
      clearError: vi.fn(),
    };

    budgetSelection = {
      selectedBudgetId: signal('budget-1'),
    };

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    authService = {
      currentUser: signal(mockUser),
    };

    await TestBed.configureTestingModule({
      imports: [TransferModalComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AccountState, useValue: accountState },
        { provide: BudgetSelectionService, useValue: budgetSelection },
        { provide: NotificationService, useValue: notificationService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed Properties', () => {
    it('should compute accounts from AccountState', () => {
      expect(component.accounts()).toEqual(mockAccounts);
    });

    it('should compute isProcessing from AccountState loading', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      expect(component.isProcessing()).toBe(true);

      accountState.loading.set(false);
      fixture.detectChanges();
      expect(component.isProcessing()).toBe(false);
    });

    it('should compute modalConfig correctly', () => {
      const config = component.modalConfig();
      expect(config.title).toBe('Transferir entre Contas');
      expect(config.subtitle).toBe('Selecione as contas origem e destino e o valor a transferir');
      expect(config.showCloseButton).toBe(true);
    });
  });

  describe('onTransferSubmit', () => {
    it('should call transferBetweenAccounts with correct data', () => {
      const transferData = {
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 1000.0,
      };

      component.onTransferSubmit(transferData);

      expect(accountState.clearError).toHaveBeenCalled();
      expect(accountState.transferBetweenAccounts).toHaveBeenCalledWith({
        userId: mockUser.id,
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 1000.0,
      });
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const transferData = {
        fromAccountId: 'account-1',
        toAccountId: 'account-2',
        amount: 1000.0,
      };

      component.onTransferSubmit(transferData);

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Usuário não autenticado',
        'Erro'
      );
      expect(accountState.transferBetweenAccounts).not.toHaveBeenCalled();
    });
  });

  describe('onClose', () => {
    it('should clear error, reset transfer initiated and emit closed', () => {
      let emitted = false;
      component.closed.subscribe(() => {
        emitted = true;
      });

      component.onClose();

      expect(accountState.clearError).toHaveBeenCalled();
      expect(emitted).toBe(true);
    });
  });

  describe('Success Effect', () => {
    it('should show success notification and close modal when transfer succeeds', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      
      component['transferInitiated'].set(true);
      component['previousLoading'].set(true);
      
      accountState.loading.set(false);
      accountState.error.set(null);
      fixture.detectChanges();

      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Transferência realizada com sucesso!'
      );
    });

    it('should show error notification when transfer fails', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      
      component['transferInitiated'].set(true);
      component['previousLoading'].set(true);
      
      accountState.loading.set(false);
      accountState.error.set('Erro na transferência');
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Erro na transferência',
        'Erro ao transferir'
      );
    });
  });
});

