import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { guestGuard } from './guest.guard';
import { AuthService } from '../../services/auth/auth.service';

interface MockAuthService {
  isAuthenticated: ReturnType<typeof vi.fn>;
}

interface MockRouter {
  navigate: ReturnType<typeof vi.fn>;
}

describe('GuestGuard', () => {
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
      mockAuthService.isAuthenticated.mockReturnValue(false);
    });

    it('should return true and allow access', () => {
      const result = TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('should not call router navigate', () => {
      TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should call isAuthenticated method', () => {
      TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.mockReturnValue(true);
    });

    it('should return false and deny access', () => {
      const result = TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(result).toBe(false);
    });

    it('should call router navigate to dashboard', () => {
      TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should call isAuthenticated method', () => {
      TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });
});
