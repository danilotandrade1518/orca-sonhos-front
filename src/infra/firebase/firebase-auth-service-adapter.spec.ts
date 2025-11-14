import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  updateProfile,
  UserCredential,
  User,
} from '@angular/fire/auth';

import { FirebaseAuthServiceAdapter } from './firebase-auth-service-adapter';
import { Auth } from '@angular/fire/auth';
import { AuthResult, AuthUser } from '../../app/core/adapters/external-auth-service.adapter';

vi.mock('@angular/fire/auth', () => ({
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({})),
  updateProfile: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}));

describe('FirebaseAuthServiceAdapter', () => {
  let adapter: FirebaseAuthServiceAdapter;
  let mockAuth: any;

  beforeEach(async () => {
    mockAuth = {
      currentUser: null,
    };

    await TestBed.configureTestingModule({
      providers: [
        FirebaseAuthServiceAdapter,
        { provide: Auth, useValue: mockAuth },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    adapter = TestBed.inject(FirebaseAuthServiceAdapter);
  });

  describe('signInWithGoogle', () => {
    it('should call signInWithRedirect with GoogleAuthProvider', async () => {
      await adapter.signInWithGoogle();

      expect(signInWithRedirect).toHaveBeenCalledWith(
        mockAuth,
        expect.any(GoogleAuthProvider)
      );
    });

    it('should handle errors when signInWithRedirect fails', async () => {
      const error = new Error('Redirect failed');
      vi.mocked(signInWithRedirect).mockRejectedValueOnce(error);

      await expect(adapter.signInWithGoogle()).rejects.toThrow('Redirect failed');
    });
  });

  describe('getRedirectResult', () => {
    it('should return null when no redirect result', async () => {
      vi.mocked(getRedirectResult).mockResolvedValueOnce(null);

      const result = await adapter.getRedirectResult();

      expect(result).toBeNull();
    });

    it('should return AuthResult when redirect result exists', async () => {
      const mockUser = {
        uid: 'user-123',
        email: 'user@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        getIdToken: vi.fn().mockResolvedValue('mock-token'),
      } as unknown as User;

      const mockUserCredential = {
        user: mockUser,
      } as UserCredential;

      vi.mocked(getRedirectResult).mockResolvedValueOnce(mockUserCredential);

      const result = await adapter.getRedirectResult();

      expect(result).not.toBeNull();
      expect(result?.user.id).toBe('user-123');
      expect(result?.user.email).toBe('user@example.com');
      expect(result?.user.name).toBe('Test User');
      expect(result?.user.avatar).toBe('https://example.com/photo.jpg');
      expect(result?.token).toBe('mock-token');
    });

    it('should return AuthResult with null displayName for first access', async () => {
      const mockUser = {
        uid: 'user-123',
        email: 'user@example.com',
        displayName: null,
        photoURL: null,
        getIdToken: vi.fn().mockResolvedValue('mock-token'),
      } as unknown as User;

      const mockUserCredential = {
        user: mockUser,
      } as UserCredential;

      vi.mocked(getRedirectResult).mockResolvedValueOnce(mockUserCredential);

      const result = await adapter.getRedirectResult();

      expect(result).not.toBeNull();
      expect(result?.user.name).toBeNull();
    });

    it('should handle errors when getRedirectResult fails', async () => {
      const error = new Error('Failed to get redirect result');
      vi.mocked(getRedirectResult).mockRejectedValueOnce(error);

      await expect(adapter.getRedirectResult()).rejects.toThrow('Failed to get redirect result');
    });
  });

  describe('updateUserProfile', () => {
    it('should call updateProfile with current user and name', async () => {
      const mockUser = {
        uid: 'user-123',
        email: 'user@example.com',
        displayName: 'Old Name',
      } as unknown as User;

      mockAuth.currentUser = mockUser;

      await adapter.updateUserProfile('New Name');

      expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'New Name' });
    });

    it('should throw error when no user is authenticated', async () => {
      mockAuth.currentUser = null;

      await expect(adapter.updateUserProfile('New Name')).rejects.toThrow(
        'Nenhum usuário autenticado'
      );
    });

    it('should handle errors when updateProfile fails', async () => {
      const mockUser = {
        uid: 'user-123',
        email: 'user@example.com',
      } as unknown as User;

      mockAuth.currentUser = mockUser;

      const error = new Error('Update failed');
      vi.mocked(updateProfile).mockRejectedValueOnce(error);

      await expect(adapter.updateUserProfile('New Name')).rejects.toThrow('Update failed');
    });
  });
});

