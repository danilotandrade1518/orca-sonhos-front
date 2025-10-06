import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { provideRouter } from '@angular/router';

describe('errorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
