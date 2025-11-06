import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal.component';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AccountDto } from '../../../../../dtos/account/account-types';
import { AuthUser } from '@app/core';

describe('ConfirmDeleteModalComponent', () => {
  let component: ConfirmDeleteModalComponent;
  let fixture: ComponentFixture<ConfirmDeleteModalComponent>;
  let accountState: {
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    deleteAccount: ReturnType<typeof vi.fn>;
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
      deleteAccount: vi.fn(),
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
      imports: [ConfirmDeleteModalComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AccountState, useValue: accountState },
        { provide: BudgetSelectionService, useValue: budgetSelection },
        { provide: NotificationService, useValue: notificationService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteModalComponent);
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
      expect(config.title).toBe('Confirmar Exclusão');
      expect(config.subtitle).toBe('Esta ação não pode ser desfeita');
      expect(config.showConfirmButton).toBe(true);
      expect(config.confirmButtonText).toBe('Excluir');
    });
  });

  describe('onConfirm', () => {
    it('should call deleteAccount with correct data', () => {
      component.onConfirm();

      expect(accountState.clearError).toHaveBeenCalled();
      expect(accountState.deleteAccount).toHaveBeenCalledWith({
        userId: mockUser.id,
        accountId: 'account-1',
      });
    });

    it('should show error when account is not set', () => {
      fixture.componentRef.setInput('account', null as unknown as AccountDto);
      fixture.detectChanges();

      component.onConfirm();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados inválidos para exclusão',
        'Erro'
      );
      expect(accountState.deleteAccount).not.toHaveBeenCalled();
    });

    it('should show error when user is not authenticated', () => {
      authService.currentUser.set(null);
      fixture.detectChanges();

      component.onConfirm();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Dados inválidos para exclusão',
        'Erro'
      );
      expect(accountState.deleteAccount).not.toHaveBeenCalled();
    });
  });

  describe('onClose', () => {
    it('should clear error, reset delete initiated and emit closed', () => {
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
    it('should show success notification and close modal when delete succeeds', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      
      component['deleteInitiated'].set(true);
      component['previousLoading'].set(true);
      
      accountState.loading.set(false);
      accountState.error.set(null);
      fixture.detectChanges();

      expect(notificationService.showSuccess).toHaveBeenCalledWith('Conta excluída com sucesso!');
    });

    it('should show error notification when delete fails', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      
      component['deleteInitiated'].set(true);
      component['previousLoading'].set(true);
      
      accountState.loading.set(false);
      accountState.error.set('Erro na exclusão');
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Erro na exclusão',
        'Erro ao excluir'
      );
    });

    it('should show specific error message when account has linked transactions', () => {
      accountState.loading.set(true);
      fixture.detectChanges();
      
      component['deleteInitiated'].set(true);
      component['previousLoading'].set(true);
      
      accountState.loading.set(false);
      accountState.error.set('A conta possui transações vinculadas');
      fixture.detectChanges();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Não é possível excluir a conta. Ela possui transações vinculadas e não pode ser excluída.',
        'Erro ao excluir'
      );
    });
  });
});
