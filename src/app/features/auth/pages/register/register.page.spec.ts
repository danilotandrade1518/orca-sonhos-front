import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, Event as RouterEvent } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterPage } from './register.page';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AuthUser } from '../../../../core/adapters/external-auth-service.adapter';
import { environment } from '../../../../../environments/environment';

describe.skip('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authService: {
    signInWithGoogle: ReturnType<typeof vi.fn>;
    waitForAuthStateReady: ReturnType<typeof vi.fn>;
    getCurrentUser: ReturnType<typeof vi.fn>;
  };
  let router: Partial<Router>;

  beforeEach(async () => {
    environment.authBypass = false;
    authService = {
      signInWithGoogle: vi.fn(),
      waitForAuthStateReady: vi.fn().mockResolvedValue(undefined),
      getCurrentUser: vi.fn().mockReturnValue(null),
    };

    router = {
      navigate: vi.fn().mockResolvedValue(true),
      createUrlTree: vi.fn().mockReturnValue({}),
      serializeUrl: vi.fn().mockReturnValue('/test'),
      events: of({}) as Observable<RouterEvent>,
    } as Partial<Router>;

    const testModule = TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: {} },
        provideZonelessChangeDetection(),
      ],
    });

    TestBed.overrideComponent(RegisterPage, {
      set: {
        styles: [''],
      } as never,
    });

    await testModule.compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    environment.authBypass = true;
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

  describe('handlePostAuthNavigation', () => {
    it('should not navigate when there is no user', async () => {
      authService.getCurrentUser.mockReturnValue(null);

      await (
        component as unknown as { handlePostAuthNavigation: () => Promise<void> }
      ).handlePostAuthNavigation();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to complete-profile when user has no name', async () => {
      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: '',
        avatar: null,
      };

      authService.getCurrentUser.mockReturnValue(mockUser);

      await (
        component as unknown as { handlePostAuthNavigation: () => Promise<void> }
      ).handlePostAuthNavigation();

      expect(router.navigate).toHaveBeenCalledWith(['/register/complete-profile']);
    });

    it('should navigate to dashboard when user has a name', async () => {
      const mockUser: AuthUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Existing User',
        avatar: null,
      };

      authService.getCurrentUser.mockReturnValue(mockUser);

      await (
        component as unknown as { handlePostAuthNavigation: () => Promise<void> }
      ).handlePostAuthNavigation();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
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
      const handleNavSpy = vi.spyOn(
        component as unknown as { handlePostAuthNavigation: () => Promise<void> },
        'handlePostAuthNavigation'
      );

      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(handleNavSpy).toHaveBeenCalled();
    });
  });
});
