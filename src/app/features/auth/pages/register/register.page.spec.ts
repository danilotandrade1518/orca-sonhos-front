import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterPage } from './register.page';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AuthUser } from '../../../../core/adapters/external-auth-service.adapter';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authService: {
    signInWithGoogle: ReturnType<typeof vi.fn>;
    handleRedirectResult: ReturnType<typeof vi.fn>;
    isLoading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    user: ReturnType<typeof signal<AuthUser | null>>;
  };
  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      signInWithGoogle: vi.fn(),
      handleRedirectResult: vi.fn(),
      isLoading: signal(false),
      error: signal(null),
      user: signal(null),
    };

    router = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as typeof authService;
    router = TestBed.inject(Router) as typeof router;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form config correctly', () => {
    const config = component.formConfig();
    expect(config.title).toBe('Bem-vindo ao OrçaSonhos');
    expect(config.subtitle).toBe('Transforme seus sonhos em metas alcançáveis');
    expect(config.showActions).toBe(false);
    expect(config.showBackButton).toBe(false);
    expect(config.showSaveButton).toBe(false);
    expect(config.showCancelButton).toBe(false);
  });

  describe('onSignInWithGoogle', () => {
    it('should call signInWithGoogle when button is clicked', async () => {
      authService.signInWithGoogle.mockResolvedValue(undefined);

      await component.onSignInWithGoogle();

      expect(authService.signInWithGoogle).toHaveBeenCalledTimes(1);
    });

    it('should set loading state during sign in', async () => {
      authService.signInWithGoogle.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      expect(component.isLoading()).toBe(false);

      const promise = component.onSignInWithGoogle();
      expect(component.isLoading()).toBe(true);

      await promise;
      expect(component.isLoading()).toBe(false);
    });

    it('should clear error before attempting sign in', async () => {
      component.errorMessage.set('Previous error');
      authService.signInWithGoogle.mockResolvedValue(undefined);

      await component.onSignInWithGoogle();

      expect(component.errorMessage()).toBeNull();
    });

    it('should set error message when signInWithGoogle fails', async () => {
      const error = new Error('Authentication failed');
      authService.signInWithGoogle.mockRejectedValue(error);

      await component.onSignInWithGoogle();

      expect(component.errorMessage()).toContain('Erro ao autenticar');
      expect(component.isLoading()).toBe(false);
    });

    it('should handle generic error when signInWithGoogle fails', async () => {
      authService.signInWithGoogle.mockRejectedValue('Unknown error');

      await component.onSignInWithGoogle();

      expect(component.errorMessage()).toBe('Erro ao autenticar com Google. Tente novamente.');
    });
  });

  describe('handleRedirectResult', () => {
    it('should handle redirect result for first access', async () => {
      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: null,
        avatar: null,
      };

      authService.handleRedirectResult.mockResolvedValue({
        isFirstAccess: true,
        user: mockUser,
      });

      await component['handleRedirectResult']();

      expect(router.navigate).toHaveBeenCalledWith(['/register/complete-profile']);
      expect(component.isProcessingRedirect()).toBe(false);
    });

    it('should handle redirect result for existing user', async () => {
      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Existing User',
        avatar: null,
      };

      authService.handleRedirectResult.mockResolvedValue({
        isFirstAccess: false,
        user: mockUser,
      });

      await component['handleRedirectResult']();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(component.isProcessingRedirect()).toBe(false);
    });

    it('should not navigate when no redirect result', async () => {
      authService.handleRedirectResult.mockResolvedValue(null);

      await component['handleRedirectResult']();

      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.isProcessingRedirect()).toBe(false);
    });

    it('should set processing state during redirect handling', async () => {
      authService.handleRedirectResult.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(null), 100))
      );

      expect(component.isProcessingRedirect()).toBe(false);

      const promise = component['handleRedirectResult']();
      expect(component.isProcessingRedirect()).toBe(true);

      await promise;
      expect(component.isProcessingRedirect()).toBe(false);
    });

    it('should handle errors during redirect handling', async () => {
      const error = new Error('Redirect failed');
      authService.handleRedirectResult.mockRejectedValue(error);

      await component['handleRedirectResult']();

      expect(component.errorMessage()).toContain('Erro ao processar autenticação');
      expect(component.isProcessingRedirect()).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      component.errorMessage.set('Some error');
      component.clearError();
      expect(component.errorMessage()).toBeNull();
    });
  });

  describe('component initialization', () => {
    it('should call handleRedirectResult after render', async () => {
      const handleRedirectSpy = vi.spyOn(component as any, 'handleRedirectResult');
      authService.handleRedirectResult.mockResolvedValue(null);

      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(handleRedirectSpy).toHaveBeenCalled();
    });
  });
});
