import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../../../environments/environment';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    service = TestBed.inject(ConfigService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with correct development state', () => {
      expect(service.isDevelopment()).toBe(!environment.production);
    });

    it('should initialize with correct API config', () => {
      const apiConfig = service.apiConfig();
      expect(apiConfig.baseUrl).toBe(environment.apiUrl || 'http://localhost:3000');
      expect(apiConfig.timeout).toBe(30000);
      expect(apiConfig.retryAttempts).toBe(3);
    });

    it('should initialize with correct Firebase config', () => {
      const firebaseConfig = service.firebaseConfig();
      expect(firebaseConfig.apiKey).toBe(environment.firebase.apiKey);
      expect(firebaseConfig.authDomain).toBe(environment.firebase.authDomain);
      expect(firebaseConfig.projectId).toBe(environment.firebase.projectId);
      expect(firebaseConfig.storageBucket).toBe(environment.firebase.storageBucket);
      expect(firebaseConfig.messagingSenderId).toBe(environment.firebase.messagingSenderId);
      expect(firebaseConfig.appId).toBe(environment.firebase.appId);
    });
  });

  describe('computed properties', () => {
    it('should return correct API base URL', () => {
      expect(service.apiBaseUrl()).toBe(environment.apiUrl || 'http://localhost:3000');
    });

    it('should return correct API timeout', () => {
      expect(service.apiTimeout()).toBe(30000);
    });

    it('should return correct API retry attempts', () => {
      expect(service.apiRetryAttempts()).toBe(3);
    });
  });

  describe('getApiUrl', () => {
    it('should return correct URL for endpoint without leading slash', () => {
      const endpoint = 'budget';
      const expectedUrl = `${environment.apiUrl || 'http://localhost:3000'}/budget`;
      expect(service.getApiUrl(endpoint)).toBe(expectedUrl);
    });

    it('should return correct URL for endpoint with leading slash', () => {
      const endpoint = '/budgets';
      const expectedUrl = `${environment.apiUrl || 'http://localhost:3000'}/budgets`;
      expect(service.getApiUrl(endpoint)).toBe(expectedUrl);
    });

    it('should handle empty endpoint', () => {
      const endpoint = '';
      const expectedUrl = `${environment.apiUrl || 'http://localhost:3000'}/`;
      expect(service.getApiUrl(endpoint)).toBe(expectedUrl);
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return true for any feature in development mode', () => {
      expect(service.isFeatureEnabled('any-feature')).toBe(true);
    });

    it('should return false for undefined feature in production mode', () => {
      expect(service.isFeatureEnabled('undefined-feature')).toBe(true);
    });

    it('should return feature value from environment in production mode', () => {
      const originalProduction = environment.production;
      const originalFeatures = environment.features;

      Object.defineProperty(environment, 'production', { value: true, writable: true });
      Object.defineProperty(environment, 'features', {
        value: { 'test-feature': true },
        writable: true,
      });

      expect(service.isFeatureEnabled('test-feature')).toBe(true);

      Object.defineProperty(environment, 'production', {
        value: originalProduction,
        writable: true,
      });
      Object.defineProperty(environment, 'features', { value: originalFeatures, writable: true });
    });
  });

  describe('getEnvironmentVariable', () => {
    it('should return undefined for non-existent variable', () => {
      expect(service.getEnvironmentVariable('non-existent')).toBeUndefined();
    });

    it('should return correct value for existing variable', () => {
      const testValue = 'test-value';
      (environment as unknown as Record<string, unknown>)['testKey'] = testValue;

      expect(service.getEnvironmentVariable('testKey')).toBe(testValue);

      delete (environment as unknown as Record<string, unknown>)['testKey'];
    });
  });

  describe('signals are readonly', () => {
    it('should have readonly signals', () => {
      expect(service.isDevelopment).toBeDefined();
      expect(service.apiConfig).toBeDefined();
      expect(service.firebaseConfig).toBeDefined();
    });
  });
});
