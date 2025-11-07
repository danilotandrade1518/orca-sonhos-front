import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserInviteComponent } from './user-invite.component';
import { SharingService } from '@core/services/sharing/sharing.service';
import { SearchUserResponseDto } from '../../../../../dtos/budget';
import { signal } from '@angular/core';
import { OsSearchSuggestion } from '@app/shared/ui-components/molecules';

describe('UserInviteComponent', () => {
  let component: UserInviteComponent;
  let fixture: ComponentFixture<UserInviteComponent>;
  let sharingService: {
    searchUsers: ReturnType<typeof vi.fn>;
    loading: ReturnType<typeof signal<boolean>>;
  };

  const mockUsers: SearchUserResponseDto[] = [
    {
      id: 'user-1',
      name: 'Ana Silva',
      email: 'ana@example.com',
      phone: '+5511999999999',
    },
    {
      id: 'user-2',
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '+5511888888888',
    },
  ];

  beforeEach(async () => {
    const loadingSignal = signal<boolean>(false);

    sharingService = {
      searchUsers: vi.fn(),
      loading: loadingSignal,
    };

    await TestBed.configureTestingModule({
      imports: [UserInviteComponent],
      providers: [
        { provide: SharingService, useValue: sharingService },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty search value', () => {
      expect(component.searchValue()).toBe('');
      expect(component.selectedUser()).toBeNull();
      expect(component.suggestions()).toEqual([]);
      expect(component.error()).toBeNull();
    });

    it('should be enabled by default', () => {
      expect(component.disabled()).toBeFalsy();
    });

    it('should disable when disabled input is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBeTruthy();
    });
  });

  describe('Search Functionality', () => {
    it('should search users when value changes', async () => {
      sharingService.searchUsers.mockReturnValue(of(mockUsers));

      component.onSearchValueChange('ana');
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(sharingService.searchUsers).toHaveBeenCalledWith('ana');
    });

    it('should clear suggestions when search value is empty', () => {
      component.onSearchValueChange('');
      expect(component.suggestions()).toEqual([]);
      expect(component.selectedUser()).toBeNull();
      expect(sharingService.searchUsers).not.toHaveBeenCalled();
    });

    it('should clear error when search value changes', () => {
      component['_error'].set('Previous error');
      component.onSearchValueChange('ana');
      expect(component.error()).toBeNull();
    });

    it('should handle search errors', async () => {
      const errorMessage = 'Erro ao buscar usuários';
      sharingService.searchUsers.mockReturnValue(throwError(() => ({ message: errorMessage })));

      component.onSearchValueChange('ana');
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(component.error()).toBe(errorMessage);
      expect(component.suggestions()).toEqual([]);
    });

    it('should convert users to suggestions', async () => {
      sharingService.searchUsers.mockReturnValue(of(mockUsers));

      component.onSearchValueChange('ana');
      await new Promise((resolve) => setTimeout(resolve, 400));

      const suggestions = component.suggestions();
      expect(suggestions).toHaveLength(2);
      expect(suggestions[0].id).toBe('user-1');
      expect(suggestions[0].text).toBe('Ana Silva (ana@example.com)');
    });

    it('should highlight match in suggestion text', async () => {
      sharingService.searchUsers.mockReturnValue(of(mockUsers));

      component.onSearchValueChange('ana');
      await new Promise((resolve) => setTimeout(resolve, 400));

      const suggestions = component.suggestions();
      expect(suggestions[0].highlightedText).toContain('<strong>Ana</strong>');
    });
  });

  describe('User Selection', () => {
    beforeEach(async () => {
      sharingService.searchUsers.mockReturnValue(of(mockUsers));
      component.onSearchValueChange('ana');
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    it('should select user when suggestion is selected', () => {
      const suggestion = component.suggestions()[0];
      component.onSuggestionSelect(suggestion);

      expect(component.selectedUser()).toEqual(mockUsers[0]);
      expect(component.searchValue()).toBe('Ana Silva');
      expect(component.suggestions()).toEqual([]);
      expect(component.error()).toBeNull();
    });

    it('should emit userSelected when user is selected', () => {
      const spy = vi.fn();
      component.userSelected.subscribe(spy);

      const suggestion = component.suggestions()[0];
      component.onSuggestionSelect(suggestion);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('user-1');
    });

    it('should clear selection', () => {
      const suggestion = component.suggestions()[0];
      component.onSuggestionSelect(suggestion);
      expect(component.selectedUser()).toBeTruthy();

      component.clearSelection();

      expect(component.selectedUser()).toBeNull();
      expect(component.searchValue()).toBe('');
      expect(component.suggestions()).toEqual([]);
      expect(component.error()).toBeNull();
    });

    it('should emit null when selection is cleared', () => {
      const suggestion = component.suggestions()[0];
      component.onSuggestionSelect(suggestion);
      fixture.detectChanges();

      const spy = vi.fn();
      component.userSelected.subscribe(spy);

      component.clearSelection();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(null);
    });
  });

  describe('getSelectedUserId', () => {
    it('should return null when no user is selected', () => {
      expect(component.getSelectedUserId()).toBeNull();
    });

    it('should return user id when user is selected', async () => {
      sharingService.searchUsers.mockReturnValue(of(mockUsers));
      component.onSearchValueChange('ana');
      await new Promise((resolve) => setTimeout(resolve, 400));

      const suggestion = component.suggestions()[0];
      component.onSuggestionSelect(suggestion);

      expect(component.getSelectedUserId()).toBe('user-1');
    });
  });

  describe('Loading State', () => {
    it('should reflect loading state from service', () => {
      sharingService.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBeTruthy();

      sharingService.loading.set(false);
      fixture.detectChanges();
      expect(component.loading()).toBeFalsy();
    });
  });

  describe('Disabled State', () => {
    it('should disable component when disabled input is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBeTruthy();
    });

    it('should disable search when loading', () => {
      sharingService.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBeTruthy();
    });
  });

  describe('Container Classes', () => {
    it('should add loading class when loading', () => {
      sharingService.loading.set(true);
      fixture.detectChanges();
      expect(component.containerClass()).toContain('user-invite--loading');
    });

    it('should add error class when error exists', () => {
      component['_error'].set('Test error');
      fixture.detectChanges();
      expect(component.containerClass()).toContain('user-invite--error');
    });

    it('should add selected class when user is selected', () => {
      component['_selectedUser'].set(mockUsers[0]);
      fixture.detectChanges();
      expect(component.containerClass()).toContain('user-invite--selected');
    });
  });

  describe('ARIA Attributes', () => {
    it('should set aria-describedby when error exists', () => {
      component['_error'].set('Test error');
      fixture.detectChanges();
      expect(component.ariaDescribedBy()).toBe('user-invite-error');
    });

    it('should set aria-describedby when loading', () => {
      sharingService.loading.set(true);
      fixture.detectChanges();
      expect(component.ariaDescribedBy()).toBe('user-invite-loading');
    });

    it('should return null when no error or loading', () => {
      fixture.detectChanges();
      expect(component.ariaDescribedBy()).toBeNull();
    });
  });

  describe('Debounced Search', () => {
    it('should trigger search on debounced search event', async () => {
      sharingService.searchUsers.mockReturnValue(of(mockUsers));

      component.onDebouncedSearch('joao');
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(sharingService.searchUsers).toHaveBeenCalledWith('joao');
    });

    it('should clear suggestions when debounced search is empty', () => {
      component.onDebouncedSearch('');
      expect(component.suggestions()).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search results', async () => {
      sharingService.searchUsers.mockReturnValue(of([]));

      component.onSearchValueChange('nonexistent');
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(component.suggestions()).toEqual([]);
      expect(component.error()).toBeNull();
    });

    it('should handle whitespace-only search', () => {
      component.onSearchValueChange('   ');
      expect(component.suggestions()).toEqual([]);
      expect(sharingService.searchUsers).not.toHaveBeenCalled();
    });

    it('should handle selection of non-existent user', () => {
      component['_foundUsers'].set(mockUsers);
      const fakeSuggestion = { id: 'fake-id', text: 'Fake User' };

      component.onSuggestionSelect(fakeSuggestion as unknown as OsSearchSuggestion);

      expect(component.selectedUser()).toBeNull();
    });
  });
});
