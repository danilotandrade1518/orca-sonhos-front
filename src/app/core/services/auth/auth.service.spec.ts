import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AuthUser,
  EXTERNAL_AUTH_SERVICE_ADAPTER,
} from '../../adapters/external-auth-service.adapter';
import { MockExternalAuthServiceAdapter } from './__mocks__/external-auth-service.adapter.mock';
import { AuthService } from './auth.service';

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

      // Start the sign in process
      const signInPromise = service.signInWithEmail(email, password);

      // Check loading state immediately after starting
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

      // Start the sign out process
      const signOutPromise = service.signOut();

      // Check loading state immediately after starting
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
      const user = await service
        .signInWithEmailObservable('test@example.com', 'password')
        .toPromise();
      expect(user).toEqual({
        id: 'mock-user-id',
        email: 'test@example.com',
        name: 'Mock User',
        avatar: null,
        metadata: { provider: 'mock' },
      });
    });

    it('should return observable for sign out', async () => {
      await service.signOutObservable().toPromise();
      expect(service.user()).toBeNull();
    });
  });
});
