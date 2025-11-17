import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterPage } from './register.page';
import { CompleteProfilePage } from './complete-profile/complete-profile.page';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { EXTERNAL_AUTH_SERVICE_ADAPTER } from '../../../../core/adapters/external-auth-service.adapter';
import { MockExternalAuthServiceAdapter } from '../../../../core/services/auth/__mocks__/external-auth-service.adapter.mock';
import { AuthUser } from '../../../../core/adapters/external-auth-service.adapter';

describe('Register Flow Integration', () => {
  let registerFixture: ComponentFixture<RegisterPage>;
  let completeProfileFixture: ComponentFixture<CompleteProfilePage>;
  let authService: AuthService;
  let mockAdapter: MockExternalAuthServiceAdapter;
  let router: Router;

  beforeEach(async () => {
    mockAdapter = new MockExternalAuthServiceAdapter();

    await TestBed.configureTestingModule({
      imports: [RegisterPage, CompleteProfilePage],
      providers: [
        AuthService,
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: EXTERNAL_AUTH_SERVICE_ADAPTER, useValue: mockAdapter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
              paramMap: new Map(),
            },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true as never);

    registerFixture = TestBed.createComponent(RegisterPage);
    completeProfileFixture = TestBed.createComponent(CompleteProfilePage);
    authService = TestBed.inject(AuthService);
  });

  describe('First Access Flow', () => {
    it('should complete full flow: register → Google → redirect → complete profile → dashboard', async () => {
      const registerComponent = registerFixture.componentInstance;
      const completeProfileComponent = completeProfileFixture.componentInstance;

      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: null,
        avatar: null,
      };

      mockAdapter.getRedirectResult = async () => ({
        user: mockUser,
        token: 'mock-token',
      });

      await mockAdapter.signInWithGoogle();

      const redirectResult = await authService.handleRedirectResult();
      expect(redirectResult).not.toBeNull();
      expect(redirectResult?.isFirstAccess).toBe(true);

      if (redirectResult?.isFirstAccess) {
        await registerComponent['handleRedirectResult']();
        expect(router.navigate).toHaveBeenCalledWith(['/register/complete-profile']);

        completeProfileComponent.form.patchValue({ name: 'Complete Name' });

        await completeProfileComponent.onSubmit();

        expect(authService.user()?.name).toBe('Complete Name');
        expect(completeProfileComponent.successMessage()).toBeTruthy();

        await new Promise((resolve) => setTimeout(resolve, 1600));
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      }
    });

    it('should handle first access with null displayName', async () => {
      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: null,
        avatar: null,
      };

      mockAdapter.getRedirectResult = async () => ({
        user: mockUser,
        token: 'mock-token',
      });

      await mockAdapter.signInWithGoogle();
      const result = await authService.handleRedirectResult();

      expect(result?.isFirstAccess).toBe(true);
      expect(result?.user.name).toBeNull();
    });

    it('should handle first access with empty displayName', async () => {
      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: '',
        avatar: null,
      };

      mockAdapter.getRedirectResult = async () => ({
        user: mockUser,
        token: 'mock-token',
      });

      await mockAdapter.signInWithGoogle();
      const result = await authService.handleRedirectResult();

      expect(result?.isFirstAccess).toBe(true);
    });
  });

  describe('Existing User Flow', () => {
    it('should complete flow: register → Google → redirect → dashboard (no profile completion)', async () => {
      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Existing User',
        avatar: null,
      };

      mockAdapter.getRedirectResult = async () => ({
        user: mockUser,
        token: 'mock-token',
      });

      await mockAdapter.signInWithGoogle();
      const result = await authService.handleRedirectResult();

      expect(result?.isFirstAccess).toBe(false);
      expect(result?.user.name).toBe('Existing User');
      expect(authService.user()?.name).toBe('Existing User');
    });

    it('should redirect existing user directly to dashboard', async () => {
      const registerComponent = registerFixture.componentInstance;

      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Existing User',
        avatar: null,
      };

      mockAdapter.getRedirectResult = async () => ({
        user: mockUser,
        token: 'mock-token',
      });

      await mockAdapter.signInWithGoogle();
      await registerComponent['handleRedirectResult']();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(router.navigate).not.toHaveBeenCalledWith(['/register/complete-profile']);
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle error during Google sign in', async () => {
      const registerComponent = registerFixture.componentInstance;

      mockAdapter.signInWithGoogle = async () => {
        throw new Error('Google auth failed');
      };

      await registerComponent.onSignInWithGoogle();

      expect(registerComponent.errorMessage()).toBeTruthy();
      expect(registerComponent.isLoading()).toBe(false);
    });

    it('should handle error during redirect result processing', async () => {
      const registerComponent = registerFixture.componentInstance;

      mockAdapter.getRedirectResult = async () => {
        throw new Error('Redirect failed');
      };

      await registerComponent['handleRedirectResult']();

      expect(registerComponent.errorMessage()).toBeTruthy();
      expect(registerComponent.isProcessingRedirect()).toBe(false);
    });

    it('should handle error during profile completion', async () => {
      const completeProfileComponent = completeProfileFixture.componentInstance;

      mockAdapter.updateUserProfile = async () => {
        throw new Error('Update failed');
      };

      completeProfileComponent.form.patchValue({ name: 'Valid Name' });
      await completeProfileComponent.onSubmit();

      expect(completeProfileComponent.errorMessage()).toBeTruthy();
      expect(completeProfileComponent.isLoading()).toBe(false);
    });
  });

  describe('Loading States', () => {
    it('should manage loading states throughout the flow', async () => {
      const registerComponent = registerFixture.componentInstance;

      expect(registerComponent.isLoading()).toBe(false);
      expect(registerComponent.isProcessingRedirect()).toBe(false);

      const signInPromise = registerComponent.onSignInWithGoogle();
      expect(registerComponent.isLoading()).toBe(true);

      await signInPromise;
      expect(registerComponent.isLoading()).toBe(false);

      const redirectPromise = registerComponent['handleRedirectResult']();
      expect(registerComponent.isProcessingRedirect()).toBe(true);

      await redirectPromise;
      expect(registerComponent.isProcessingRedirect()).toBe(false);
    });

    it('should manage loading state during profile completion', async () => {
      const completeProfileComponent = completeProfileFixture.componentInstance;

      expect(completeProfileComponent.isLoading()).toBe(false);

      completeProfileComponent.form.patchValue({ name: 'Valid Name' });
      const submitPromise = completeProfileComponent.onSubmit();

      expect(completeProfileComponent.isLoading()).toBe(true);

      await submitPromise;
      expect(completeProfileComponent.isLoading()).toBe(false);
    });
  });

  describe('State Management', () => {
    it('should update AuthService state correctly throughout flow', async () => {
      expect(authService.user()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);

      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
        avatar: null,
      };

      mockAdapter.getRedirectResult = async () => ({
        user: mockUser,
        token: 'mock-token',
      });

      await mockAdapter.signInWithGoogle();
      await authService.handleRedirectResult();

      expect(authService.user()).toEqual(mockUser);
      expect(authService.isAuthenticated()).toBe(true);

      await authService.completeProfile('Updated Name');

      expect(authService.user()?.name).toBe('Updated Name');
    });
  });
});
