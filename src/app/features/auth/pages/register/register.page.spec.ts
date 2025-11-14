import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

import { RegisterPage } from './register.page';
import { AuthService } from '../../../../core/services/auth/auth.service';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'signInWithGoogle',
      'handleRedirectResult',
    ], {
      isLoading: signal(false),
      error: signal(null),
      user: signal(null),
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form config correctly', () => {
    const config = component.formConfig();
    expect(config.title).toBe('Bem-vindo ao OrçaSonhos');
    expect(config.subtitle).toBe('Transforme seus sonhos em metas alcançáveis');
    expect(config.showActions).toBe(false);
  });

  it('should call signInWithGoogle when button is clicked', async () => {
    authService.signInWithGoogle.and.returnValue(Promise.resolve());

    await component.onSignInWithGoogle();

    expect(authService.signInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('should set error message when signInWithGoogle fails', async () => {
    const error = new Error('Authentication failed');
    authService.signInWithGoogle.and.returnValue(Promise.reject(error));

    await component.onSignInWithGoogle();

    expect(component.errorMessage()).toContain('Erro ao autenticar');
  });

  it('should clear error message', () => {
    component.errorMessage.set('Some error');
    component.clearError();
    expect(component.errorMessage()).toBeNull();
  });
});

