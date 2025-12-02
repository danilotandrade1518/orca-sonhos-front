import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { completeProfileGuard } from './complete-profile.guard';
import { AuthService } from '../../services/auth/auth.service';

interface MockAuthService {
  isAuthenticated: ReturnType<typeof vi.fn>;
  waitForAuthStateReady: ReturnType<typeof vi.fn>;
}

interface MockRouter {
  navigate: ReturnType<typeof vi.fn>;
  createUrlTree: ReturnType<typeof vi.fn>;
}

describe('CompleteProfileGuard', () => {
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
      createUrlTree: vi.fn(),
    };

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {
      url: '/register/complete-profile',
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
    expect(completeProfileGuard).toBeDefined();
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.mockReturnValue(true);
    });

    it('should return true and allow access', async () => {
      const result = await TestBed.runInInjectionContext(() =>
        completeProfileGuard(mockRoute, mockState)
      );
      expect(result).toBe(true);
    });

    it('should not call router navigate', async () => {
      await TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should call isAuthenticated method', async () => {
      await TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
    });

    it('should return url tree and deny access', async () => {
      const urlTree = {} as unknown;
      mockRouter.createUrlTree.mockReturnValue(urlTree);

      const result = await TestBed.runInInjectionContext(() =>
        completeProfileGuard(mockRoute, mockState)
      );

      expect(result).toBe(urlTree);
    });

    it('should call router createUrlTree to register', async () => {
      await TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/auth']);
    });

    it('should call isAuthenticated method', async () => {
      await TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });
});
