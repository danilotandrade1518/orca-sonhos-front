import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide apiUrl', () => {
    expect(service.apiUrl).toBeDefined();
    expect(typeof service.apiUrl).toBe('string');
  });

  it('should provide production flag', () => {
    expect(typeof service.production).toBe('boolean');
  });

  it('should provide appName', () => {
    expect(service.appName).toBeDefined();
    expect(typeof service.appName).toBe('string');
  });

  it('should provide version', () => {
    expect(service.version).toBeDefined();
    expect(typeof service.version).toBe('string');
  });
});
