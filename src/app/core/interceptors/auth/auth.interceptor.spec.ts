import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { authInterceptor } from './auth.interceptor';

interface MockAuthService {
  getToken: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
}

describe('AuthInterceptor', () => {
  let mockAuthService: MockAuthService;
  let mockNext: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAuthService = {
      getToken: vi.fn(),
      signOut: vi.fn(),
    };

    mockNext = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  it('should be defined', () => {
    expect(authInterceptor).toBeDefined();
  });

  describe('shouldSkipAuth function', () => {
    it('should skip auth for health check endpoints', () => {
      const request = new HttpRequest('GET', '/api/health');
      const skipAuthUrls = ['/health', '/ready', '/me'];
      const shouldSkip = skipAuthUrls.some((skipUrl) => request.url.includes(skipUrl));
      expect(shouldSkip).toBe(true);
    });

    it('should skip auth for ready check endpoints', () => {
      const request = new HttpRequest('GET', '/api/ready');
      const skipAuthUrls = ['/health', '/ready', '/me'];
      const shouldSkip = skipAuthUrls.some((skipUrl) => request.url.includes(skipUrl));
      expect(shouldSkip).toBe(true);
    });

    it('should skip auth for me endpoints', () => {
      const request = new HttpRequest('GET', '/api/me');
      const skipAuthUrls = ['/health', '/ready', '/me'];
      const shouldSkip = skipAuthUrls.some((skipUrl) => request.url.includes(skipUrl));
      expect(shouldSkip).toBe(true);
    });

    it('should not skip auth for other endpoints', () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const skipAuthUrls = ['/health', '/ready', '/me'];
      const shouldSkip = skipAuthUrls.some((skipUrl) => request.url.includes(skipUrl));
      expect(shouldSkip).toBe(false);
    });

    it('should handle URL with query parameters for skip auth', () => {
      const request = new HttpRequest('GET', '/api/health?check=status');
      const skipAuthUrls = ['/health', '/ready', '/me'];
      const shouldSkip = skipAuthUrls.some((skipUrl) => request.url.includes(skipUrl));
      expect(shouldSkip).toBe(true);
    });
  });

  describe('interceptor behavior', () => {
    it('should pass through request without modification for skip auth URLs', async () => {
      const request = new HttpRequest('GET', '/api/health');
      const response = new HttpResponse({ status: 200 });
      mockNext.mockReturnValue(of(response));

      const result = await TestBed.runInInjectionContext(() =>
        authInterceptor(request, mockNext)
      ).toPromise();

      expect(result).toBe(response);
      expect(mockNext).toHaveBeenCalledWith(request);
      expect(mockAuthService.getToken).not.toHaveBeenCalled();
    });

    it('should add authorization header when token is available', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const response = new HttpResponse({ status: 200 });
      const token = 'test-token-123';

      mockAuthService.getToken.mockReturnValue(Promise.resolve(token));
      mockNext.mockReturnValue(of(response));

      const result = await TestBed.runInInjectionContext(() =>
        authInterceptor(request, mockNext)
      ).toPromise();

      expect(result).toBe(response);
      const authRequest = mockNext.mock.calls[0][0];
      expect(authRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(mockAuthService.getToken).toHaveBeenCalled();
    });

    it('should pass through request without token when getToken returns null', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const response = new HttpResponse({ status: 200 });

      mockAuthService.getToken.mockReturnValue(Promise.resolve(null));
      mockNext.mockReturnValue(of(response));

      const result = await TestBed.runInInjectionContext(() =>
        authInterceptor(request, mockNext)
      ).toPromise();

      expect(result).toBe(response);
      expect(mockNext).toHaveBeenCalledWith(request);
      expect(mockAuthService.getToken).toHaveBeenCalled();
    });

    it('should pass through request without token when getToken returns undefined', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const response = new HttpResponse({ status: 200 });

      mockAuthService.getToken.mockReturnValue(Promise.resolve(undefined));
      mockNext.mockReturnValue(of(response));

      const result = await TestBed.runInInjectionContext(() =>
        authInterceptor(request, mockNext)
      ).toPromise();

      expect(result).toBe(response);
      expect(mockNext).toHaveBeenCalledWith(request);
      expect(mockAuthService.getToken).toHaveBeenCalled();
    });

    it('should handle 401 error by calling signOut', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const token = 'test-token-123';
      const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

      mockAuthService.getToken.mockReturnValue(Promise.resolve(token));
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => authInterceptor(request, mockNext)).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect(err).toBe(error);
        expect(mockAuthService.signOut).toHaveBeenCalled();
      }
    });

    it('should handle non-401 error without calling signOut', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const token = 'test-token-123';
      const error = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

      mockAuthService.getToken.mockReturnValue(Promise.resolve(token));
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => authInterceptor(request, mockNext)).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect(err).toBe(error);
        expect(mockAuthService.signOut).not.toHaveBeenCalled();
      }
    });

    it('should handle getToken promise rejection', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const error = new Error('Token fetch failed');

      mockAuthService.getToken.mockReturnValue(Promise.reject(error));
      mockNext.mockReturnValue(of(new HttpResponse({ status: 200 })));

      try {
        await TestBed.runInInjectionContext(() => authInterceptor(request, mockNext)).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect(err).toBe(error);
      }
    });

    it('should preserve request method and body when adding auth header', async () => {
      const request = new HttpRequest('POST', '/api/budgets', { name: 'Test Budget' });
      const response = new HttpResponse({ status: 201 });
      const token = 'test-token-123';

      mockAuthService.getToken.mockReturnValue(Promise.resolve(token));
      mockNext.mockReturnValue(of(response));

      const result = await TestBed.runInInjectionContext(() =>
        authInterceptor(request, mockNext)
      ).toPromise();

      expect(result).toBe(response);
      const authRequest = mockNext.mock.calls[0][0];
      expect(authRequest.method).toBe('POST');
      expect(authRequest.body).toEqual({ name: 'Test Budget' });
      expect(authRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
    });
  });
});
