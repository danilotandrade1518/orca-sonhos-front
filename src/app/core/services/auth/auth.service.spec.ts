import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no authenticated user', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should set authenticated user after login', async () => {
    await service.login('test@example.com', 'password');

    expect(service.currentUser()).not.toBeNull();
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()?.email).toBe('test@example.com');
  });

  it('should clear user after logout', async () => {
    await service.login('test@example.com', 'password');
    await service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should clear session', () => {
    service.clearSession();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
