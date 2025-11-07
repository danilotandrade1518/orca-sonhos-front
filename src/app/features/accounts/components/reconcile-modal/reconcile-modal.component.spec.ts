import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { ReconcileModalComponent } from './reconcile-modal.component';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AccountDto } from '../../../../../dtos/account/account-types';
import { AuthUser } from '@app/core';

describe('ReconcileModalComponent', () => {
  let component: ReconcileModalComponent;
  let fixture: ComponentFixture<ReconcileModalComponent>;
  let accountState: {
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    reconcileAccount: ReturnType<typeof vi.fn>;
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

  const mockAccount: AccountDto = {
    id: 'account-1',
    name: 'Conta Corrente',
    type: 'CHECKING_ACCOUNT',
    balance: 5000.0,
  };

  const mockUser: AuthUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
  };

  beforeEach(async () => {
    accountState = {
      loading: signal(false),
      error: signal(null),
      reconcileAccount: vi.fn(),
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
      imports: [ReconcileModalComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AccountState, useValue: accountState },
        { provide: BudgetSelectionService, useValue: budgetSelection },
        { provide: NotificationService, useValue: notificationService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReconcileModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('account', mockAccount);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed Properties', () => {
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
      expect(config.title).toBe('Reconciliar Conta');
      expect(config.subtitle).toBe('Informe o valor final esperado para o saldo da conta');
      expect(config.showCloseButton).toBe(true);
    });
  });

  describe('onReconcileSubmit', () => {
    it('should call reconcileAccount with correct data', () => {
      const reconcileData = {
        accountId: 'account-1',
        realBalance: 6000.0,
      };

      component.onReconcileSubmit(reconcileData);

      expect(accountState.clearError).toHaveBeenCalled();
      expect(accountState.reconcileAccount).toHaveBeenCalledWith({
        userId: mockUser.id,
        budgetId: 'budget-1',
        accountId: 'account-1',
        realBalance: 6000.0,
      });
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      const reconcileData = {
        accountId: 'account-1',
        realBalance: 6000.0,
      };

      component.onReconcileSubmit(reconcileData);

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Usuário ou orçamento não selecionado',
        'Erro'
      );
      expect(accountState.reconcileAccount).not.toHaveBeenCalled();
    });

    it('should show error when budget is not selected', () => {
      budgetSelection.selectedBudgetId.set(null);
      fixture.detectChanges();

      const reconcileData = {
        accountId: 'account-1',
        realBalance: 6000.0,
      };

      component.onReconcileSubmit(reconcileData);

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Usuário ou orçamento não selecionado',
        'Erro'
      );
      expect(accountState.reconcileAccount).not.toHaveBeenCalled();
    });
  });

  describe('onClose', () => {
    it('should clear error, reset reconcile initiated and emit closed', () => {
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
    it('should show success notification and close modal when reconcile succeeds', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      
      component['reconcileInitiated'].set(true);
      component['previousLoading'].set(true);
      
      accountState.loading.set(false);
      accountState.error.set(null);
      fixture.detectChanges();

      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Saldo reconciliado com sucesso!'
      );
    });

    it('should show error notification when reconcile fails', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      
      component['reconcileInitiated'].set(true);
      component['previousLoading'].set(true);
      
      accountState.loading.set(false);
      accountState.error.set('Erro na reconciliação');
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Erro na reconciliação',
        'Erro ao reconciliar'
      );
    });
  });
});

