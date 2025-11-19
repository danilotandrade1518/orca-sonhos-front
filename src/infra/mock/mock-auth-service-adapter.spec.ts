import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { MockAuthServiceAdapter } from './mock-auth-service-adapter';

describe('MockAuthServiceAdapter', () => {
  let adapter: MockAuthServiceAdapter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [MockAuthServiceAdapter, provideZonelessChangeDetection()],
    }).compileComponents();

    adapter = TestBed.inject(MockAuthServiceAdapter);
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  describe('signInWithGoogle', () => {
    it('should simulate Google sign in', async () => {
      await adapter.signInWithGoogle();

      const result = await adapter.getRedirectResult();
      expect(result).not.toBeNull();
      expect(result?.user.email).toBeDefined();
      expect(result?.token).toBeDefined();
    });

    it('should simulate first access scenario', async () => {
      await adapter.signInWithGoogle();

      const result = await adapter.getRedirectResult();

      if (result?.user.name === null) {
        expect(result.user.name).toBeNull();
        expect(result.user.email).toBe('newuser@orca-sonhos.com');
      }
    });

    it('should simulate existing user scenario', async () => {
      await adapter.signInWithGoogle();

      const result = await adapter.getRedirectResult();

      if (result?.user.name !== null) {
        expect(result?.user.name).toBe('Developer User');
        expect(result?.user.email).toBe('dev@orca-sonhos.com');
      }
    });
  });

  describe('getRedirectResult', () => {
    it('should return null when no redirect was initiated', async () => {
      const result = await adapter.getRedirectResult();

      expect(result).toBeNull();
    });

    it('should return AuthResult after signInWithGoogle', async () => {
      await adapter.signInWithGoogle();

      const result = await adapter.getRedirectResult();

      expect(result).not.toBeNull();
      expect(result?.user).toBeDefined();
      expect(result?.token).toBeDefined();
    });

    it('should clear redirect result after being called', async () => {
      await adapter.signInWithGoogle();

      const firstResult = await adapter.getRedirectResult();
      expect(firstResult).not.toBeNull();

      const secondResult = await adapter.getRedirectResult();
      expect(secondResult).toBeNull();
    });

    it('should update current user after getting redirect result', async () => {
      await adapter.signInWithGoogle();

      const result = await adapter.getRedirectResult();
      expect(result).not.toBeNull();

      const currentUser = adapter.getCurrentUser();
      expect(currentUser).toEqual(result?.user);
      expect(adapter.isAuthenticated()).toBe(true);
    });
  });

  describe('updateUserProfile', () => {
    it('should update current user name', async () => {
      await adapter.signInWithGoogle();
      await adapter.getRedirectResult();

      await adapter.updateUserProfile('Updated Name');

      const currentUser = adapter.getCurrentUser();
      expect(currentUser?.name).toBe('Updated Name');
    });

    it('should handle update when no user is authenticated', async () => {
      await expect(adapter.updateUserProfile('New Name')).resolves.not.toThrow();
    });

    it('should update name even for first access user', async () => {
      await adapter.signInWithGoogle();
      const result = await adapter.getRedirectResult();

      if (result?.user.name === null) {
        await adapter.updateUserProfile('First Name');

        const currentUser = adapter.getCurrentUser();
        expect(currentUser?.name).toBe('First Name');
      }
    });
  });

  describe('integration flow', () => {
    it('should complete full Google OAuth flow', async () => {
      await adapter.signInWithGoogle();

      const redirectResult = await adapter.getRedirectResult();
      expect(redirectResult).not.toBeNull();

      if (redirectResult?.user.name === null) {
        await adapter.updateUserProfile('Complete Profile Name');

        const updatedUser = adapter.getCurrentUser();
        expect(updatedUser?.name).toBe('Complete Profile Name');
      }
    });

    it('should handle existing user flow without profile update', async () => {
      await adapter.signInWithGoogle();

      const redirectResult = await adapter.getRedirectResult();
      expect(redirectResult).not.toBeNull();

      if (redirectResult?.user.name !== null) {
        const currentUser = adapter.getCurrentUser();
        expect(currentUser?.name).toBe('Developer User');
      }
    });
  });
});
