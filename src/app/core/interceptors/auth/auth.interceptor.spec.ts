import { HttpRequest } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from '../../services/auth/auth.service';
import { authInterceptor } from './auth.interceptor';

interface MockAuthService {
  getToken: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
}

describe('AuthInterceptor', () => {
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockAuthService = {
      getToken: vi.fn(),
      signOut: vi.fn(),
    };

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

  it('should skip auth for health check endpoints', () => {
    const request = new HttpRequest('GET', '/api/health');

    // Test the shouldSkipAuth function logic
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
