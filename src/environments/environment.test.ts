import { Environment } from './environment.interface';
import { describe, it, expect } from 'vitest';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3001',
  version: '1.0.0-test',
  debug: true,
  enableLogging: true,
  authBypass: true,
  firebase: {
    apiKey: 'AIzaSyCkQKwFo-txr5p7v_rMM56Tznj4V8vA9tc',
    authDomain: 'orca-sonhos.firebaseapp.com',
    projectId: 'orca-sonhos',
    storageBucket: 'orca-sonhos.firebasestorage.app',
    messagingSenderId: '211253976316',
    appId: '1:211253976316:web:7d7981947785a2fa400b79',
  },
  features: {
    offlineMode: false,
    analytics: false,
    errorReporting: false,
  },
};

describe('Environment Test Configuration', () => {
  it('should export test environment configuration', () => {
    expect(environment).toBeDefined();
    expect(environment.production).toBe(false);
    expect(environment.apiUrl).toBe('http://localhost:3001');
  });
});
