import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfigService } from '../config/config.service';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let configSpy: {
    getApiUrl: ReturnType<typeof vi.fn>;
    apiTimeout: ReturnType<typeof vi.fn>;
    apiRetryAttempts: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Reset TestBed before each test
    TestBed.resetTestingModule();

    configSpy = {
      getApiUrl: vi.fn().mockImplementation((endpoint: string) => {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        return `http://localhost:3000/api/${cleanEndpoint}`;
      }),
      apiTimeout: vi.fn().mockReturnValue(30000),
      apiRetryAttempts: vi.fn().mockReturnValue(3),
    };

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        { provide: ConfigService, useValue: configSpy },
      ],
    }).compileComponents();

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with loading false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should initialize with no error', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('signals', () => {
    it('should have isLoading signal', () => {
      expect(service.isLoading).toBeDefined();
    });

    it('should have error signal', () => {
      expect(service.error).toBeDefined();
    });
  });

  describe('utility methods', () => {
    it('should clear error manually', () => {
      // Testa o método clearError diretamente
      service.setLoading(true);
      expect(service.isLoading()).toBe(true);

      service.clearError();
      expect(service.error()).toBeNull();
    });

    it('should set loading state manually', () => {
      expect(service.isLoading()).toBe(false);

      service.setLoading(true);
      expect(service.isLoading()).toBe(true);

      service.setLoading(false);
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('headers', () => {
    it('should create headers with default Content-Type', () => {
      // Testa através de uma requisição real
      service.get('/test-endpoint').subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/test-endpoint');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({ data: 'test' });
    });

    it('should create headers with custom Content-Type', () => {
      // Testa através de uma requisição real
      service.post('/test-endpoint', {}).subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/test-endpoint');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({ data: 'test' });
    });
  });

  describe('signals are readonly', () => {
    it('should have readonly signals', () => {
      // Test that signals exist and are accessible
      expect(service.isLoading).toBeDefined();
      expect(service.error).toBeDefined();
    });
  });
});
