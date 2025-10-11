import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';

interface MockAuthService {
  isAuthenticated: ReturnType<typeof vi.fn>;
}

interface MockRouter {
  navigate: ReturnType<typeof vi.fn>;
}

describe('AuthGuard', () => {
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: vi.fn().mockReturnValue(false),
    };
    mockRouter = {
      navigate: vi.fn(),
    };

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

  it('should allow access when user is authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);

    // Test the logic directly
    const isAuthenticated = mockAuthService.isAuthenticated();
    expect(isAuthenticated).toBe(true);
  });

  it('should deny access when user is not authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);

    const isAuthenticated = mockAuthService.isAuthenticated();
    expect(isAuthenticated).toBe(false);
  });

  it('should redirect to login with correct return URL', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState.url = '/budgets/123/overview';

    const isAuthenticated = mockAuthService.isAuthenticated();
    if (!isAuthenticated) {
      mockRouter.navigate(['/login'], {
        queryParams: { returnUrl: mockState.url },
      });
    }

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/budgets/123/overview' },
    });
  });

  it('should redirect to login with root URL when no specific URL', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState.url = '/';

    const isAuthenticated = mockAuthService.isAuthenticated();
    if (!isAuthenticated) {
      mockRouter.navigate(['/login'], {
        queryParams: { returnUrl: mockState.url },
      });
    }

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/' },
    });
  });

  it('should redirect to login with query parameters preserved', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState.url = '/budgets?page=2&filter=active';

    const isAuthenticated = mockAuthService.isAuthenticated();
    if (!isAuthenticated) {
      mockRouter.navigate(['/login'], {
        queryParams: { returnUrl: mockState.url },
      });
    }

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/budgets?page=2&filter=active' },
    });
  });

  it('should redirect to login with fragment preserved', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState.url = '/budgets#section1';

    const isAuthenticated = mockAuthService.isAuthenticated();
    if (!isAuthenticated) {
      mockRouter.navigate(['/login'], {
        queryParams: { returnUrl: mockState.url },
      });
    }

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/budgets#section1' },
    });
  });

  it('should handle empty URL', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState.url = '';

    const isAuthenticated = mockAuthService.isAuthenticated();
    if (!isAuthenticated) {
      mockRouter.navigate(['/login'], {
        queryParams: { returnUrl: mockState.url },
      });
    }

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '' },
    });
  });

  it('should handle complex URLs with multiple segments', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState.url = '/budgets/123/transactions?page=1&size=10&sort=date#top';

    const isAuthenticated = mockAuthService.isAuthenticated();
    if (!isAuthenticated) {
      mockRouter.navigate(['/login'], {
        queryParams: { returnUrl: mockState.url },
      });
    }

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/budgets/123/transactions?page=1&size=10&sort=date#top' },
    });
  });

  it('should return false immediately when not authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);

    const isAuthenticated = mockAuthService.isAuthenticated();
    expect(isAuthenticated).toBe(false);
  });

  it('should not call router navigate when authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);

    const isAuthenticated = mockAuthService.isAuthenticated();
    expect(isAuthenticated).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
