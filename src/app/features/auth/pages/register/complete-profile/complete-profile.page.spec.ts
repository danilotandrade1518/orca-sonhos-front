import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CompleteProfilePage } from './complete-profile.page';
import { AuthService } from '../../../../../core/services/auth/auth.service';

describe('CompleteProfilePage', () => {
  let component: CompleteProfilePage;
  let fixture: ComponentFixture<CompleteProfilePage>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['completeProfile'], {
      isLoading: signal(false),
      error: signal(null),
      user: signal({
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      }),
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CompleteProfilePage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteProfilePage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form config correctly', () => {
    const config = component.formConfig();
    expect(config.title).toBe('Complete seu perfil');
    expect(config.subtitle).toBe('Confirme seu nome para continuar');
    expect(config.showActions).toBe(false);
  });

  it('should pre-fill form with user name if available', () => {
    fixture.detectChanges();
    expect(component.form.get('name')?.value).toBe('Test User');
  });

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

  it('should call completeProfile when form is valid', async () => {
    authService.completeProfile.and.returnValue(Promise.resolve());
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

  it('should set error message when completeProfile fails', async () => {
    const error = new Error('Update failed');
    authService.completeProfile.and.returnValue(Promise.reject(error));
    component.form.patchValue({ name: 'Valid Name' });

    await component.onSubmit();

    expect(component.errorMessage()).toContain('Erro ao atualizar perfil');
  });

  it('should navigate to dashboard after successful profile update', async () => {
    authService.completeProfile.and.returnValue(Promise.resolve());
    component.form.patchValue({ name: 'Valid Name' });

    await component.onSubmit();

    await new Promise((resolve) => setTimeout(resolve, 1600));

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should clear error message', () => {
    component.errorMessage.set('Some error');
    component.clearError();
    expect(component.errorMessage()).toBeNull();
  });
});

