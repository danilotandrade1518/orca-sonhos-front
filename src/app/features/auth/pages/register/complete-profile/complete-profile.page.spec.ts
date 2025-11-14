import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CompleteProfilePage } from './complete-profile.page';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { AuthUser } from '../../../../../core/adapters/external-auth-service.adapter';

describe('CompleteProfilePage', () => {
  let component: CompleteProfilePage;
  let fixture: ComponentFixture<CompleteProfilePage>;
  let authService: {
    completeProfile: ReturnType<typeof vi.fn>;
    isLoading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    user: ReturnType<typeof signal<AuthUser | null>>;
  };
  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      completeProfile: vi.fn(),
      isLoading: signal(false),
      error: signal(null),
      user: signal({
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      }),
    };

    router = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [CompleteProfilePage],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteProfilePage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as typeof authService;
    router = TestBed.inject(Router) as typeof router;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form config correctly', () => {
    const config = component.formConfig();
    expect(config.title).toBe('Complete seu perfil');
    expect(config.subtitle).toBe('Confirme seu nome para continuar');
    expect(config.showActions).toBe(false);
    expect(config.showBackButton).toBe(false);
    expect(config.showSaveButton).toBe(false);
    expect(config.showCancelButton).toBe(false);
  });

  describe('form initialization', () => {
    it('should pre-fill form with user name if available', () => {
      fixture.detectChanges();
      expect(component.form.get('name')?.value).toBe('Test User');
    });

    it('should pre-fill form with empty string if user name is null', () => {
      authService.user.set({
        id: 'test-id',
        email: 'test@example.com',
        name: null,
        avatar: null,
      });

      fixture = TestBed.createComponent(CompleteProfilePage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.form.get('name')?.value).toBe('');
    });

    it('should create form with name control', () => {
      expect(component.form.get('name')).toBeTruthy();
    });
  });

  describe('form validation', () => {
    it('should validate name field with min length', () => {
      const nameControl = component.form.get('name') as FormControl;
      nameControl.setValue('A');
      nameControl.markAsTouched();
      expect(nameControl.invalid).toBe(true);
      expect(nameControl.hasError('minlength')).toBe(true);
    });

    it('should validate name field with max length', () => {
      const nameControl = component.form.get('name') as FormControl;
      nameControl.setValue('A'.repeat(101));
      nameControl.markAsTouched();
      expect(nameControl.invalid).toBe(true);
      expect(nameControl.hasError('maxlength')).toBe(true);
    });

    it('should validate name field as required', () => {
      const nameControl = component.form.get('name') as FormControl;
      nameControl.setValue('');
      nameControl.markAsTouched();
      expect(nameControl.invalid).toBe(true);
      expect(nameControl.hasError('required')).toBe(true);
    });

    it('should accept valid name (2-100 characters)', () => {
      const nameControl = component.form.get('name') as FormControl;
      nameControl.setValue('Valid Name');
      expect(nameControl.valid).toBe(true);
    });

    it('should accept name with exactly 2 characters', () => {
      const nameControl = component.form.get('name') as FormControl;
      nameControl.setValue('AB');
      expect(nameControl.valid).toBe(true);
    });

    it('should accept name with exactly 100 characters', () => {
      const nameControl = component.form.get('name') as FormControl;
      nameControl.setValue('A'.repeat(100));
      expect(nameControl.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should call completeProfile when form is valid', async () => {
      authService.completeProfile.mockResolvedValue(undefined);
      component.form.patchValue({ name: 'Valid Name' });

      await component.onSubmit();

      expect(authService.completeProfile).toHaveBeenCalledWith('Valid Name');
    });

    it('should not call completeProfile when form is invalid', async () => {
      component.form.patchValue({ name: 'A' });
      component.form.markAllAsTouched();

      await component.onSubmit();

      expect(authService.completeProfile).not.toHaveBeenCalled();
    });

    it('should set loading state during profile update', async () => {
      authService.completeProfile.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      component.form.patchValue({ name: 'Valid Name' });

      expect(component.isLoading()).toBe(false);

      const promise = component.onSubmit();
      expect(component.isLoading()).toBe(true);

      await promise;
      expect(component.isLoading()).toBe(false);
    });

    it('should clear error before submitting', async () => {
      component.errorMessage.set('Previous error');
      authService.completeProfile.mockResolvedValue(undefined);
      component.form.patchValue({ name: 'Valid Name' });

      await component.onSubmit();

      expect(component.errorMessage()).toBeNull();
    });

    it('should set error message when completeProfile fails', async () => {
      const error = new Error('Update failed');
      authService.completeProfile.mockRejectedValue(error);
      component.form.patchValue({ name: 'Valid Name' });

      await component.onSubmit();

      expect(component.errorMessage()).toContain('Erro ao atualizar perfil');
      expect(component.isLoading()).toBe(false);
    });

    it('should handle generic error when completeProfile fails', async () => {
      authService.completeProfile.mockRejectedValue('Unknown error');
      component.form.patchValue({ name: 'Valid Name' });

      await component.onSubmit();

      expect(component.errorMessage()).toBe('Erro ao atualizar perfil. Tente novamente.');
    });

    it('should set success message after successful profile update', async () => {
      authService.completeProfile.mockResolvedValue(undefined);
      component.form.patchValue({ name: 'Valid Name' });

      await component.onSubmit();

      expect(component.successMessage()).toBe('Perfil atualizado com sucesso!');
    });

    it('should navigate to dashboard after successful profile update', async () => {
      authService.completeProfile.mockResolvedValue(undefined);
      component.form.patchValue({ name: 'Valid Name' });

      await component.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 1600));

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      component.errorMessage.set('Some error');
      component.clearError();
      expect(component.errorMessage()).toBeNull();
    });
  });

  describe('form state', () => {
    it('should reflect form validity correctly', () => {
      component.form.patchValue({ name: 'Valid Name' });
      expect(component.form.valid).toBe(true);

      component.form.patchValue({ name: 'A' });
      expect(component.form.valid).toBe(false);
    });
  });
});
