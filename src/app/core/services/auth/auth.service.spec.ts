import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AuthUser,
  EXTERNAL_AUTH_SERVICE_ADAPTER,
} from '../../adapters/external-auth-service.adapter';
import { MockExternalAuthServiceAdapter } from './__mocks__/external-auth-service.adapter.mock';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockAdapter: MockExternalAuthServiceAdapter;

  beforeEach(async () => {
    mockAdapter = new MockExternalAuthServiceAdapter();

    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: EXTERNAL_AUTH_SERVICE_ADAPTER, useValue: mockAdapter },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Authentication State', () => {
    it('should initialize with no user', () => {
      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBeFalsy();
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should update user state when adapter notifies', () => {
      const mockUser: AuthUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
        metadata: { provider: 'test' },
      };

      mockAdapter.simulateAuthStateChange(mockUser);

      expect(service.user()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBeTruthy();
      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should clear user state when adapter notifies null', () => {
      const mockUser: AuthUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      };

      mockAdapter.simulateAuthStateChange(mockUser);
      expect(service.user()).toEqual(mockUser);

      mockAdapter.simulateAuthStateChange(null);
      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBeFalsy();
    });
  });

  describe('Sign In', () => {
    it('should sign in successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const result = await service.signInWithEmail(email, password);

      expect(result).toEqual({
        id: 'mock-user-id',
        email: 'test@example.com',
        name: 'Mock User',
        avatar: null,
        metadata: { provider: 'mock' },
      });
      expect(service.user()).toEqual(result);
      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should handle sign in errors', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';

      mockAdapter.signIn = () => Promise.reject(new Error('Invalid credentials'));

      try {
        await service.signInWithEmail(email, password);
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toBe('Invalid credentials');
        expect(service.error()).toBe('Invalid credentials');
      }
    });

    it('should set loading state during sign in', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      expect(service.isLoading()).toBeFalsy();

      const signInPromise = service.signInWithEmail(email, password);

      expect(service.isLoading()).toBeTruthy();

      await signInPromise;
      expect(service.isLoading()).toBeFalsy();
    });
  });

  describe('Sign Out', () => {
    it('should sign out successfully', async () => {
      const mockUser: AuthUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      };

      mockAdapter.setMockUser(mockUser);
      expect(service.user()).toEqual(mockUser);

      await service.signOut();

      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should handle sign out errors', async () => {
      mockAdapter.signOut = () => Promise.reject(new Error('Sign out failed'));

      try {
        await service.signOut();
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toBe('Sign out failed');
        expect(service.error()).toBe('Sign out failed');
      }
    });

    it('should set loading state during sign out', async () => {
      expect(service.isLoading()).toBeFalsy();

      const signOutPromise = service.signOut();

      expect(service.isLoading()).toBeTruthy();

      await signOutPromise;
      expect(service.isLoading()).toBeFalsy();
    });
  });

  describe('Token Management', () => {
    it('should get token', async () => {
      mockAdapter.setMockToken('test-token');
      const token = await service.getToken();
      expect(token).toBe('test-token');
    });

    it('should refresh token', async () => {
      const refreshedToken = await service.refreshToken();
      expect(refreshedToken).toBe('refreshed-mock-token');
    });
  });

  describe('User Information', () => {
    it('should get current user ID', () => {
      const mockUser: AuthUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      };

      mockAdapter.setMockUser(mockUser);
      expect(service.getCurrentUserId()).toBe('test-id');
    });

    it('should get current user email', () => {
      const mockUser: AuthUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      };

      mockAdapter.setMockUser(mockUser);
      expect(service.getCurrentUserEmail()).toBe('test@example.com');
    });

    it('should return null for user info when not authenticated', () => {
      mockAdapter.setMockUser(null);
      expect(service.getCurrentUserId()).toBeNull();
      expect(service.getCurrentUserEmail()).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should clear error', () => {
      service.clearError();
      expect(service.error()).toBeNull();
    });

    it('should set error message on sign in failure', async () => {
      mockAdapter.signIn = () => Promise.reject(new Error('Network error'));

      try {
        await service.signInWithEmail('test@example.com', 'password');
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toBe('Network error');
        expect(service.error()).toBe('Network error');
      }
    });

    it('should set generic error message for unknown errors', async () => {
      mockAdapter.signIn = () => Promise.reject('Unknown error');

      try {
        await service.signInWithEmail('test@example.com', 'password');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBe('Unknown error');
        expect(service.error()).toBe('Erro ao fazer login');
      }
    });
  });

  describe('Observable Methods', () => {
    it('should return observable for sign in', async () => {
      const user = await firstValueFrom(
        service.signInWithEmailObservable('test@example.com', 'password')
      );

      expect(user).toEqual({
        id: 'mock-user-id',
        email: 'test@example.com',
        name: 'Mock User',
        avatar: null,
        metadata: { provider: 'mock' },
      });
    });

    it('should return observable for sign out', async () => {
      await firstValueFrom(service.signOutObservable());
      expect(service.user()).toBeNull();
    });
  });

  describe('Google OAuth', () => {
    describe('signInWithGoogle', () => {
      it('should call adapter signInWithGoogle', async () => {
        const signInWithGoogleSpy = vi.spyOn(mockAdapter, 'signInWithGoogle');

        await service.signInWithGoogle();

        expect(signInWithGoogleSpy).toHaveBeenCalled();
      });

      it('should set loading state during sign in', async () => {
        expect(service.isLoading()).toBeFalsy();

        const signInPromise = service.signInWithGoogle();

        expect(service.isLoading()).toBeTruthy();

        await signInPromise;
        expect(service.isLoading()).toBeFalsy();
      });

      it('should handle errors when signInWithGoogle fails', async () => {
        mockAdapter.signInWithGoogle = () => Promise.reject(new Error('Google auth failed'));

        try {
          await service.signInWithGoogle();
          fail('Should have thrown an error');
        } catch (error) {
          expect((error as Error).message).toBe('Google auth failed');
          expect(service.error()).toBe('Google auth failed');
        }
      });

      it('should clear error before attempting sign in', async () => {
        mockAdapter.signInWithGoogle = () => Promise.reject(new Error('Test error'));

        try {
          await service.signInWithGoogle();
        } catch {
          expect(service.error()).toBe('Test error');
        }

        mockAdapter.signInWithGoogle = () => Promise.resolve();
        await service.signInWithGoogle();

        expect(service.error()).toBeNull();
      });
    });

    describe('handleRedirectResult', () => {
      it('should return null when no redirect result', async () => {
        mockAdapter.getRedirectResult = () => Promise.resolve(null);

        const result = await service.handleRedirectResult();

        expect(result).toBeNull();
        expect(service.isLoading()).toBeFalsy();
      });

      it('should detect first access when displayName is null', async () => {
        const mockUser: AuthUser = {
          id: 'user-123',
          email: 'user@example.com',
          name: null,
          avatar: null,
        };

        mockAdapter.getRedirectResult = () =>
          Promise.resolve({
            user: mockUser,
            token: 'mock-token',
          });

        const result = await service.handleRedirectResult();

        expect(result).not.toBeNull();
        expect(result?.isFirstAccess).toBe(true);
        expect(result?.user).toEqual(mockUser);
        expect(service.user()).toEqual(mockUser);
      });

      it('should detect first access when displayName is empty string', async () => {
        const mockUser: AuthUser = {
          id: 'user-123',
          email: 'user@example.com',
          name: '',
          avatar: null,
        };

        mockAdapter.getRedirectResult = () =>
          Promise.resolve({
            user: mockUser,
            token: 'mock-token',
          });

        const result = await service.handleRedirectResult();

        expect(result).not.toBeNull();
        expect(result?.isFirstAccess).toBe(true);
      });

      it('should detect existing user when displayName is filled', async () => {
        const mockUser: AuthUser = {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Existing User',
          avatar: null,
        };

        mockAdapter.getRedirectResult = () =>
          Promise.resolve({
            user: mockUser,
            token: 'mock-token',
          });

        const result = await service.handleRedirectResult();

        expect(result).not.toBeNull();
        expect(result?.isFirstAccess).toBe(false);
        expect(result?.user).toEqual(mockUser);
        expect(service.user()).toEqual(mockUser);
      });

      it('should set loading state during redirect handling', async () => {
        mockAdapter.getRedirectResult = () => Promise.resolve(null);

        expect(service.isLoading()).toBeFalsy();

        const handlePromise = service.handleRedirectResult();

        expect(service.isLoading()).toBeTruthy();

        await handlePromise;
        expect(service.isLoading()).toBeFalsy();
      });

      it('should handle errors when getRedirectResult fails', async () => {
        mockAdapter.getRedirectResult = () => Promise.reject(new Error('Redirect failed'));

        try {
          await service.handleRedirectResult();
          fail('Should have thrown an error');
        } catch (error) {
          expect((error as Error).message).toBe('Redirect failed');
          expect(service.error()).toBe('Redirect failed');
        }
      });

      it('should update user state after successful redirect', async () => {
        const mockUser: AuthUser = {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Test User',
          avatar: null,
        };

        mockAdapter.getRedirectResult = () =>
          Promise.resolve({
            user: mockUser,
            token: 'mock-token',
          });

        await service.handleRedirectResult();

        expect(service.user()).toEqual(mockUser);
        expect(service.isAuthenticated()).toBeTruthy();
      });
    });

    describe('completeProfile', () => {
      it('should call adapter updateUserProfile', async () => {
        const mockUser: AuthUser = {
          id: 'user-123',
          email: 'user@example.com',
          name: null,
          avatar: null,
        };

        mockAdapter.setMockUser(mockUser);
        const updateProfileSpy = vi.spyOn(mockAdapter, 'updateUserProfile');

        await service.completeProfile('New Name');

        expect(updateProfileSpy).toHaveBeenCalledWith('New Name');
      });

      it('should update user state after profile completion', async () => {
        const mockUser: AuthUser = {
          id: 'user-123',
          email: 'user@example.com',
          name: null,
          avatar: null,
        };

        mockAdapter.setMockUser(mockUser);

        await service.completeProfile('Complete Name');

        expect(service.user()?.name).toBe('Complete Name');
      });

      it('should set loading state during profile update', async () => {
        const mockUser: AuthUser = {
          id: 'user-123',
          email: 'user@example.com',
          name: null,
          avatar: null,
        };

        mockAdapter.setMockUser(mockUser);

        expect(service.isLoading()).toBeFalsy();

        const completePromise = service.completeProfile('New Name');

        expect(service.isLoading()).toBeTruthy();

        await completePromise;
        expect(service.isLoading()).toBeFalsy();
      });

      it('should handle errors when updateUserProfile fails', async () => {
        const mockUser: AuthUser = {
          id: 'user-123',
          email: 'user@example.com',
          name: null,
          avatar: null,
        };

        mockAdapter.setMockUser(mockUser);
        mockAdapter.updateUserProfile = () => Promise.reject(new Error('Update failed'));

        try {
          await service.completeProfile('New Name');
          fail('Should have thrown an error');
        } catch (error) {
          expect((error as Error).message).toBe('Update failed');
          expect(service.error()).toBe('Update failed');
        }
      });

      it('should preserve other user properties when updating name', async () => {
        const mockUser: AuthUser = {
          id: 'user-123',
          email: 'user@example.com',
          name: null,
          avatar: 'https://example.com/avatar.jpg',
          metadata: { provider: 'google' },
        };

        mockAdapter.setMockUser(mockUser);

        await service.completeProfile('New Name');

        const updatedUser = service.user();
        expect(updatedUser?.name).toBe('New Name');
        expect(updatedUser?.id).toBe('user-123');
        expect(updatedUser?.email).toBe('user@example.com');
        expect(updatedUser?.avatar).toBe('https://example.com/avatar.jpg');
      });
    });
  });
});
