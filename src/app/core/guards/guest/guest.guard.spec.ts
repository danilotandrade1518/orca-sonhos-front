import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { guestGuard } from './guest.guard';
import { AuthService } from '../../services/auth/auth.service';

describe('GuestGuard', () => {
  let mockAuthService: {
    waitForAuthStateReady: ReturnType<typeof vi.fn>;
    getCurrentUser: ReturnType<typeof vi.fn>;
  };
  let mockRouter: {
    createUrlTree: ReturnType<typeof vi.fn>;
  };
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {
      waitForAuthStateReady: vi.fn().mockResolvedValue(undefined),
      getCurrentUser: vi.fn().mockReturnValue(null),
    };
    mockRouter = {
      createUrlTree: vi.fn().mockReturnValue({} as UrlTree),
    };

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {
      url: '/register',
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
    expect(guestGuard).toBeDefined();
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockAuthService.getCurrentUser.mockReturnValue(null);
    });

    it('should return true and allow access', async () => {
      const result = await TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('should not create url tree', async () => {
      await TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    });

    it('should await auth state readiness', async () => {
      await TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(mockAuthService.waitForAuthStateReady).toHaveBeenCalled();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockAuthService.getCurrentUser.mockReturnValue({
        id: 'user-1',
        email: 'dev@orca.com',
        name: 'Dev User',
        avatar: null,
      });
    });

    it('should redirect to dashboard when user has display name', async () => {
      const tree = {} as UrlTree;
      mockRouter.createUrlTree.mockReturnValue(tree);

      const result = await TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));

      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
      expect(result).toBe(tree);
    });

    it('should redirect to complete profile when user has no name', async () => {
      const tree = {} as UrlTree;
      mockRouter.createUrlTree.mockReturnValue(tree);
      mockAuthService.getCurrentUser.mockReturnValue({
        id: 'user-2',
        email: 'first@orca.com',
        name: '',
        avatar: null,
      });

      const result = await TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));

      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/auth/complete-profile']);
      expect(result).toBe(tree);
    });
  });
});
