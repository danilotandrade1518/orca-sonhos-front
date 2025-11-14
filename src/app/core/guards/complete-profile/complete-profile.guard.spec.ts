import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { completeProfileGuard } from './complete-profile.guard';
import { AuthService } from '../../services/auth/auth.service';

interface MockAuthService {
  isAuthenticated: ReturnType<typeof vi.fn>;
}

interface MockRouter {
  navigate: ReturnType<typeof vi.fn>;
}

describe('CompleteProfileGuard', () => {
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: vi.fn().mockReturnValue(false),
    };
    mockRouter = {
      navigate: vi.fn(),
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

    it('should return true and allow access', () => {
      const result = TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('should not call router navigate', () => {
      TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should call isAuthenticated method', () => {
      TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
    });

    it('should return false and deny access', () => {
      const result = TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(result).toBe(false);
    });

    it('should call router navigate to register', () => {
      TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('should call isAuthenticated method', () => {
      TestBed.runInInjectionContext(() => completeProfileGuard(mockRoute, mockState));
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });
});

