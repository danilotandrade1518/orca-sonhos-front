import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';

import { CollaborationDashboardComponent } from './collaboration-dashboard.component';
import { SharingState } from '@core/services/sharing/sharing.state';
import { AuthService } from '@core/services/auth/auth.service';
import { BudgetParticipantDto } from '../../../../../dtos/budget';

describe('CollaborationDashboardComponent', () => {
  let component: CollaborationDashboardComponent;
  let fixture: ComponentFixture<CollaborationDashboardComponent>;
  let sharingState: {
    participants: ReturnType<typeof signal<BudgetParticipantDto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    removeParticipant: ReturnType<typeof vi.fn>;
  };
  let authService: {
    currentUser: ReturnType<typeof signal<{ id: string; name: string; email: string } | null>>;
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
    {
      id: 'user-3',
      name: 'Maria Santos',
      email: 'maria@example.com',
    },
  ];

  const mockCurrentUser = {
    id: 'user-1',
    name: 'Ana Silva',
    email: 'ana@example.com',
  };

  beforeEach(async () => {
    const participantsSignal = signal<BudgetParticipantDto[]>([]);
    const loadingSignal = signal<boolean>(false);
    const errorSignal = signal<string | null>(null);
    const currentUserSignal = signal<{ id: string; name: string; email: string } | null>(null);

    sharingState = {
      participants: participantsSignal,
      loading: loadingSignal,
      error: errorSignal,
      removeParticipant: vi.fn(),
    };

    authService = {
      currentUser: currentUserSignal,
    };

    await TestBed.configureTestingModule({
      imports: [CollaborationDashboardComponent],
      providers: [
        { provide: SharingState, useValue: sharingState },
        { provide: AuthService, useValue: authService },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollaborationDashboardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('budgetId', 'budget-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty participants', () => {
      expect(component.participants()).toEqual([]);
      expect(component.participantsCount()).toBe(0);
      expect(component.loading()).toBeFalsy();
      expect(component.error()).toBeNull();
    });

    it('should have no removing participant initially', () => {
      expect(component.removingParticipantId()).toBeNull();
    });
  });

  describe('Participants Display', () => {
    beforeEach(() => {
      sharingState.participants.set(mockParticipants);
    });

    it('should display all participants', () => {
      expect(component.participants()).toEqual(mockParticipants);
      expect(component.participantsCount()).toBe(3);
    });

    it('should compute participants count correctly', () => {
      expect(component.participantsCount()).toBe(3);
    });

    it('should update when participants change', () => {
      const newParticipants = [mockParticipants[0]];
      sharingState.participants.set(newParticipants);
      expect(component.participantsCount()).toBe(1);
    });
  });

  describe('Loading State', () => {
    it('should reflect loading state from SharingState', () => {
      sharingState.loading.set(true);
      expect(component.loading()).toBeTruthy();

      sharingState.loading.set(false);
      expect(component.loading()).toBeFalsy();
    });
  });

  describe('Error State', () => {
    it('should reflect error state from SharingState', () => {
      sharingState.error.set('Failed to load participants');
      expect(component.error()).toBe('Failed to load participants');

      sharingState.error.set(null);
      expect(component.error()).toBeNull();
    });
  });

  describe('isCreator', () => {
    beforeEach(() => {
      sharingState.participants.set(mockParticipants);
    });

    it('should return true when participantId matches creatorId input', () => {
      fixture.componentRef.setInput('creatorId', 'user-1');
      fixture.detectChanges();
      expect(component.isCreator('user-1')).toBeTruthy();
      expect(component.isCreator('user-2')).toBeFalsy();
    });

    it('should return true when participantId matches current user', () => {
      authService.currentUser.set(mockCurrentUser);
      fixture.componentRef.setInput('creatorId', null);
      fixture.detectChanges();
      expect(component.isCreator('user-1')).toBeTruthy();
      expect(component.isCreator('user-2')).toBeFalsy();
    });

    it('should return false when no creatorId and no current user', () => {
      fixture.componentRef.setInput('creatorId', null);
      fixture.detectChanges();
      authService.currentUser.set(null);
      expect(component.isCreator('user-1')).toBeFalsy();
    });

    it('should prioritize creatorId input over current user', () => {
      fixture.componentRef.setInput('creatorId', 'user-2');
      fixture.detectChanges();
      authService.currentUser.set(mockCurrentUser);
      expect(component.isCreator('user-2')).toBeTruthy();
      expect(component.isCreator('user-1')).toBeFalsy();
    });
  });

  describe('getInitial', () => {
    it('should return first letter for single name', () => {
      expect(component.getInitial('Ana')).toBe('A');
    });

    it('should return first letters for full name', () => {
      expect(component.getInitial('Ana Silva')).toBe('AS');
      expect(component.getInitial('João Pedro Santos')).toBe('JS');
    });

    it('should handle empty string', () => {
      expect(component.getInitial('')).toBe('?');
    });

    it('should handle whitespace', () => {
      expect(component.getInitial('   ')).toBe('?');
    });

    it('should trim whitespace', () => {
      expect(component.getInitial('  Ana Silva  ')).toBe('AS');
    });
  });

  describe('getParticipantAriaLabel', () => {
    beforeEach(() => {
      sharingState.participants.set(mockParticipants);
    });

    it('should include creator text when participant is creator', () => {
      fixture.componentRef.setInput('creatorId', 'user-1');
      fixture.detectChanges();
      const label = component.getParticipantAriaLabel(mockParticipants[0]);
      expect(label).toContain('Criador');
      expect(label).toContain('Ana Silva');
      expect(label).toContain('ana@example.com');
    });

    it('should not include creator text when participant is not creator', () => {
      fixture.componentRef.setInput('creatorId', 'user-1');
      fixture.detectChanges();
      const label = component.getParticipantAriaLabel(mockParticipants[1]);
      expect(label).not.toContain('Criador');
      expect(label).toContain('João Silva');
      expect(label).toContain('joao@example.com');
    });
  });

  describe('onRemoveParticipant', () => {
    beforeEach(() => {
      sharingState.participants.set(mockParticipants);
      fixture.componentRef.setInput('budgetId', 'budget-1');
      fixture.detectChanges();
    });

    it('should call removeParticipant on SharingState', () => {
      fixture.componentRef.setInput('creatorId', 'user-1');
      fixture.detectChanges();
      component.onRemoveParticipant('user-2');

      expect(sharingState.removeParticipant).toHaveBeenCalledWith('budget-1', 'user-2', 'user-1');
    });

    it('should set removingParticipantId when removing', () => {
      fixture.componentRef.setInput('creatorId', 'user-1');
      fixture.detectChanges();
      component.onRemoveParticipant('user-2');

      expect(component.removingParticipantId()).toBe('user-2');
    });

    it('should not remove creator', () => {
      fixture.componentRef.setInput('creatorId', 'user-1');
      fixture.detectChanges();
      component.onRemoveParticipant('user-1');

      expect(sharingState.removeParticipant).not.toHaveBeenCalled();
    });

    it('should not remove when current user is creator', () => {
      authService.currentUser.set(mockCurrentUser);
      fixture.componentRef.setInput('creatorId', null);
      fixture.detectChanges();
      component.onRemoveParticipant('user-1');

      expect(sharingState.removeParticipant).not.toHaveBeenCalled();
    });
  });

  describe('Participant Removal Effect', () => {
    beforeEach(() => {
      sharingState.participants.set(mockParticipants);
      fixture.componentRef.setInput('budgetId', 'budget-1');
      fixture.detectChanges();
    });

    it('should emit participantRemoved when removal completes successfully', async () => {
      const spy = vi.fn();
      component.participantRemoved.subscribe(spy);

      fixture.componentRef.setInput('creatorId', 'user-1');
      fixture.detectChanges();
      component.onRemoveParticipant('user-2');

      expect(component.removingParticipantId()).toBe('user-2');

      sharingState.loading.set(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(spy).toHaveBeenCalledWith('user-2');
      expect(component.removingParticipantId()).toBeNull();
    });

    it('should clear removingParticipantId when loading completes', async () => {
      fixture.componentRef.setInput('creatorId', 'user-1');
      fixture.detectChanges();
      component.onRemoveParticipant('user-2');

      expect(component.removingParticipantId()).toBe('user-2');

      sharingState.loading.set(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(component.removingParticipantId()).toBeNull();
    });
  });

  describe('Container Classes', () => {
    it('should add loading class when loading', () => {
      sharingState.loading.set(true);
      expect(component.containerClass()).toContain('collaboration-dashboard--loading');
    });

    it('should add error class when error exists', () => {
      sharingState.error.set('Test error');
      expect(component.containerClass()).toContain('collaboration-dashboard--error');
    });

    it('should add empty class when no participants', () => {
      sharingState.participants.set([]);
      expect(component.containerClass()).toContain('collaboration-dashboard--empty');
    });

    it('should not add empty class when participants exist', () => {
      sharingState.participants.set(mockParticipants);
      expect(component.containerClass()).not.toContain('collaboration-dashboard--empty');
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no participants', () => {
      sharingState.participants.set([]);
      expect(component.participants().length).toBe(0);
    });
  });

  describe('Error State', () => {
    it('should show error message when error exists', () => {
      sharingState.error.set('Failed to load participants');
      expect(component.error()).toBe('Failed to load participants');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null creatorId gracefully', () => {
      fixture.componentRef.setInput('creatorId', null);
      fixture.detectChanges();
      authService.currentUser.set(null);
      expect(component.isCreator('user-1')).toBeFalsy();
    });

    it('should handle removing participant while another is being removed', () => {
      fixture.componentRef.setInput('creatorId', 'user-1');
      fixture.detectChanges();
      component.onRemoveParticipant('user-2');
      expect(component.removingParticipantId()).toBe('user-2');

      component.onRemoveParticipant('user-3');
      expect(component.removingParticipantId()).toBe('user-3');
    });
  });
});
