import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';

interface MockAuthService {
  isAuthenticated: ReturnType<typeof vi.fn>;
  waitForAuthStateReady: ReturnType<typeof vi.fn>;
}

interface MockRouter {
  navigate: ReturnType<typeof vi.fn>;
}

describe('AuthGuard', () => {
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: vi.fn().mockReturnValue(false),
      waitForAuthStateReady: vi.fn().mockResolvedValue(undefined),
    };
    mockRouter = {
      navigate: vi.fn(),
    };

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {
      url: '/dashboard',
      root: {} as ActivatedRouteSnapshot,
    } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.mockReturnValue(true);
    });

    it('should return true and allow access', async () => {
      const result = await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('should not call router navigate', async () => {
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should call isAuthenticated method', async () => {
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
    });

    it('should return false and deny access', async () => {
      const result = await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(false);
    });

    it('should call router navigate to register', async () => {
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: mockState.url },
      });
    });

    it('should call isAuthenticated method', async () => {
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe('URL handling for redirects', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
    });

    it('should redirect to login with correct return URL for simple path', async () => {
      mockState.url = '/budget/123/overview';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '/budget/123/overview' },
      });
    });

    it('should redirect to login with root URL when no specific URL', async () => {
      mockState.url = '/';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '/' },
      });
    });

    it('should redirect to login with query parameters preserved', async () => {
      mockState.url = '/budget?page=2&filter=active';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '/budget?page=2&filter=active' },
      });
    });

    it('should redirect to login with fragment preserved', async () => {
      mockState.url = '/budget#section1';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '/budget#section1' },
      });
    });

    it('should handle empty URL', async () => {
      mockState.url = '';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '' },
      });
    });

    it('should handle complex URLs with multiple segments', async () => {
      mockState.url = '/budget/123/transactions?page=1&size=10&sort=date#top';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '/budget/123/transactions?page=1&size=10&sort=date#top' },
      });
    });

    it('should handle URLs with special characters', async () => {
      mockState.url = '/budget/search?q=test%20query&category=expense';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '/budget/search?q=test%20query&category=expense' },
      });
    });

    it('should handle URLs with multiple query parameters', async () => {
      mockState.url = '/reports/monthly?year=2024&month=1&format=pdf&download=true';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '/reports/monthly?year=2024&month=1&format=pdf&download=true' },
      });
    });

    it('should handle URLs with nested paths', async () => {
      mockState.url = '/admin/users/123/edit?tab=permissions';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '/admin/users/123/edit?tab=permissions' },
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null state URL', async () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      mockState.url = null as unknown as string;
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: null },
      });
    });

    it('should handle undefined state URL', async () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      mockState.url = undefined as unknown as string;
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: undefined },
      });
    });

    it('should handle very long URLs', async () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      const longUrl =
        '/very/long/path/with/many/segments/and/parameters?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5';
      mockState.url = longUrl;
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: longUrl },
      });
    });

    it('should handle URLs with encoded characters', async () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      mockState.url = '/search?q=hello%20world&category=test%20category';
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register'], {
        queryParams: { returnUrl: '/search?q=hello%20world&category=test%20category' },
      });
    });
  });

  describe('service integration', () => {
    it('should call isAuthenticated exactly once per guard execution', async () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);
      await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(mockAuthService.isAuthenticated).toHaveBeenCalledTimes(1);
    });

    it('should handle isAuthenticated throwing an error', async () => {
      mockAuthService.isAuthenticated.mockImplementation(() => {
        throw new Error('Auth service error');
      });

      await expect(
        TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState))
      ).rejects.toThrow('Auth service error');
    });

    it('should handle isAuthenticated returning different types', async () => {
      mockAuthService.isAuthenticated.mockReturnValue('truthy string');
      const result = await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(true);

      mockAuthService.isAuthenticated.mockReturnValue(0);
      const result2 = await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result2).toBe(false);

      mockAuthService.isAuthenticated.mockReturnValue(null);
      const result3 = await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result3).toBe(false);

      mockAuthService.isAuthenticated.mockReturnValue(undefined);
      const result4 = await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result4).toBe(false);
    });
  });
});
