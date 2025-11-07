import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ShareBudgetComponent } from './share-budget.component';
import { SharingState } from '@core/services/sharing/sharing.state';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { SharingService } from '@core/services/sharing/sharing.service';
import { BudgetParticipantDto } from '../../../../../dtos/budget';

describe('ShareBudgetComponent', () => {
  let component: ShareBudgetComponent;
  let fixture: ComponentFixture<ShareBudgetComponent>;
  let sharingState: {
    participants: ReturnType<typeof signal<BudgetParticipantDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadParticipants: ReturnType<typeof vi.fn>;
    addParticipant: ReturnType<typeof vi.fn>;
    clearError: ReturnType<typeof vi.fn>;
  };
  let authService: {
    currentUser: ReturnType<typeof signal<{ id: string; name: string; email: string } | null>>;
  };
  let notificationService: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let sharingService: {
    searchUsers: ReturnType<typeof vi.fn>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<unknown>>;
  };

  const mockParticipants: BudgetParticipantDto[] = [
    {
      id: 'user-1',
      name: 'Ana Silva',
      email: 'ana@example.com',
    },
    {
      id: 'user-2',
      name: 'João Silva',
      email: 'joao@example.com',
    },
  ];

  beforeEach(async () => {
    const participantsSignal = signal<BudgetParticipantDto[]>([]);
    const loadingSignal = signal<boolean>(false);
    const errorSignal = signal<string | null>(null);
    const currentUserSignal = signal<{ id: string; name: string; email: string } | null>(null);
    const sharingServiceLoadingSignal = signal<boolean>(false);
    const sharingServiceErrorSignal = signal<unknown>(null);

    sharingState = {
      participants: participantsSignal,
      loading: loadingSignal,
      error: errorSignal,
      loadParticipants: vi.fn(),
      addParticipant: vi.fn(),
      clearError: vi.fn(),
    };

    sharingService = {
      searchUsers: vi.fn(),
      loading: sharingServiceLoadingSignal,
      error: sharingServiceErrorSignal,
    };

    authService = {
      currentUser: currentUserSignal,
    };

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ShareBudgetComponent],
      providers: [
        { provide: SharingState, useValue: sharingState },
        { provide: SharingService, useValue: sharingService },
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notificationService },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareBudgetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('budgetId', 'budget-1');
    fixture.componentRef.setInput('budgetName', 'Test Budget');
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with closed modal', () => {
      expect(component.isOpen()).toBeFalsy();
    });

    it('should initialize with no selected user', () => {
      expect(component.selectedUserId()).toBeNull();
    });

    it('should reflect loading state from SharingState', () => {
      sharingState.loading.set(true);
      expect(component.loading()).toBeTruthy();
    });

    it('should reflect error state from SharingState', () => {
      sharingState.error.set('Test error');
      expect(component.error()).toBe('Test error');
    });
  });

  describe('Modal Configuration', () => {
    it('should configure modal with correct title', () => {
      const config = component.modalConfig();
      expect(config.title).toBe('Gerenciar Participantes');
    });

    it('should configure modal with budget name as subtitle', () => {
      fixture.componentRef.setInput('budgetName', 'Family Budget');
      fixture.detectChanges();
      const config = component.modalConfig();
      expect(config.subtitle).toBe('Family Budget');
    });

    it('should use default subtitle when budget name is empty', () => {
      fixture.componentRef.setInput('budgetName', '');
      fixture.detectChanges();
      const config = component.modalConfig();
      expect(config.subtitle).toBe('Adicione participantes ao orçamento');
    });

    it('should show actions buttons', () => {
      const config = component.modalConfig();
      expect(config.showActions).toBeTruthy();
      expect(config.showCancelButton).toBeTruthy();
      expect(config.showConfirmButton).toBeTruthy();
    });

    it('should set correct button texts', () => {
      const config = component.modalConfig();
      expect(config.cancelButtonText).toBe('Cancelar');
      expect(config.confirmButtonText).toBe('Adicionar');
    });

    it('should set modal size to medium', () => {
      expect(component.modalSize()).toBe('medium');
    });
  });

  describe('Modal Opening', () => {
    it('should load participants when modal opens', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      expect(sharingState.loadParticipants).toHaveBeenCalledWith('budget-1');
    });

    it('should emit opened event when modal opens', () => {
      const spy = vi.fn();
      component.opened.subscribe(spy);

      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('should clear selected user when modal closes', () => {
      component['_selectedUserId'].set('user-1');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();
      expect(component.selectedUserId()).toBeNull();
    });

    it('should clear error when modal closes', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();
      expect(sharingState.clearError).toHaveBeenCalled();
    });
  });

  describe('User Selection', () => {
    it('should update selectedUserId when user is selected', () => {
      component.onSelectedUserChange('user-1');
      expect(component.selectedUserId()).toBe('user-1');
    });

    it('should handle null user selection', () => {
      component.onSelectedUserChange(null);
      expect(component.selectedUserId()).toBeNull();
    });
  });

  describe('Add Participant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('budgetId', 'budget-1');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
    });

    it('should add participant when user is selected', () => {
      component.onSelectedUserChange('user-2');
      component.onAddParticipant();

      expect(sharingState.addParticipant).toHaveBeenCalledWith('budget-1', 'user-2');
    });

    it('should set addingParticipantId when adding', () => {
      component.onSelectedUserChange('user-2');
      component.onAddParticipant();

      expect(component['_addingParticipantId']()).toBe('user-2');
    });

    it('should show error notification when no user is selected', () => {
      component.onSelectedUserChange(null);
      component.onAddParticipant();

      expect(notificationService.showError).toHaveBeenCalledWith('Selecione um usuário para adicionar');
      expect(sharingState.addParticipant).not.toHaveBeenCalled();
    });
  });

  describe('Participant Added Effect', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('budgetId', 'budget-1');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      sharingState.participants.set(mockParticipants);
    });

    it('should show success notification when participant is added', async () => {
      component.onSelectedUserChange('user-3');
      component.onAddParticipant();

      sharingState.participants.set([...mockParticipants, { id: 'user-3', name: 'New User', email: 'new@example.com' }]);
      sharingState.loading.set(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(notificationService.showSuccess).toHaveBeenCalledWith('Participante adicionado com sucesso!');
    });

    it('should emit participantAdded when participant is added', async () => {
      const spy = vi.fn();
      component.participantAdded.subscribe(spy);

      component.onSelectedUserChange('user-3');
      component.onAddParticipant();

      sharingState.participants.set([...mockParticipants, { id: 'user-3', name: 'New User', email: 'new@example.com' }]);
      sharingState.loading.set(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(spy).toHaveBeenCalledWith('user-3');
    });

    it('should clear selectedUserId when participant is added', async () => {
      component.onSelectedUserChange('user-3');
      component.onAddParticipant();

      sharingState.participants.set([...mockParticipants, { id: 'user-3', name: 'New User', email: 'new@example.com' }]);
      sharingState.loading.set(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(component.selectedUserId()).toBeNull();
    });

    it('should clear addingParticipantId when participant is added', async () => {
      component.onSelectedUserChange('user-3');
      component.onAddParticipant();

      sharingState.participants.set([...mockParticipants, { id: 'user-3', name: 'New User', email: 'new@example.com' }]);
      sharingState.loading.set(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(component['_addingParticipantId']()).toBeNull();
    });

    it('should show error notification when add fails', async () => {
      component.onSelectedUserChange('user-3');
      component.onAddParticipant();

      sharingState.error.set('Failed to add participant');
      sharingState.loading.set(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(notificationService.showError).toHaveBeenCalledWith('Failed to add participant');
      expect(component['_addingParticipantId']()).toBeNull();
    });

    it('should not show success if participant was not actually added', async () => {
      component.onSelectedUserChange('user-3');
      component.onAddParticipant();

      sharingState.loading.set(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Participant Removed', () => {
    it('should emit participantRemoved when participant is removed', () => {
      const spy = vi.fn();
      component.participantRemoved.subscribe(spy);

      component.onParticipantRemoved('user-2');

      expect(spy).toHaveBeenCalledWith('user-2');
    });

    it('should show success notification when participant is removed', () => {
      component.onParticipantRemoved('user-2');

      expect(notificationService.showSuccess).toHaveBeenCalledWith('Participante removido com sucesso!');
    });
  });

  describe('Cancel', () => {
    it('should emit closed event when cancelled', () => {
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onCancel();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should load participants if modal is open on init', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      component.ngOnInit();

      expect(sharingState.loadParticipants).toHaveBeenCalledWith('budget-1');
    });

    it('should not load participants if modal is closed on init', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();
      sharingState.loadParticipants.mockClear();

      component.ngOnInit();

      expect(sharingState.loadParticipants).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid additions', async () => {
      fixture.componentRef.setInput('budgetId', 'budget-1');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      component.onSelectedUserChange('user-3');
      component.onAddParticipant();

      component.onSelectedUserChange('user-4');
      component.onAddParticipant();

      expect(sharingState.addParticipant).toHaveBeenCalledTimes(2);
    });

    it('should handle error state correctly', () => {
      sharingState.error.set('Network error');
      expect(component.error()).toBe('Network error');
    });

    it('should handle empty participants list', () => {
      sharingState.participants.set([]);
      expect(component.loading()).toBeFalsy();
    });
  });
});
