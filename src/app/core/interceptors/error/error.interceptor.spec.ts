import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { errorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let mockNext: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mockNext = vi.fn();

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(errorInterceptor).toBeDefined();
  });

  describe('successful requests', () => {
    it('should pass through successful responses without modification', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const response = { status: 200, data: 'success' };
      mockNext.mockReturnValue(of(response));

      const result = await errorInterceptor(request, mockNext).toPromise();
      expect(result).toBe(response);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request error', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const error = new HttpErrorResponse({
        error: { message: 'Invalid data' },
        status: 400,
        statusText: 'Bad Request',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await errorInterceptor(request, mockNext).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Dados inválidos. Verifique as informações enviadas.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 400,
          message: 'Dados inválidos. Verifique as informações enviadas.',
          url: '/api/budgets',
          method: 'GET',
        });
      }
    });

    it('should handle 401 Unauthorized error', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const error = new HttpErrorResponse({
        error: { message: 'Unauthorized' },
        status: 401,
        statusText: 'Unauthorized',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await errorInterceptor(request, mockNext).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Não autorizado. Faça login novamente.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 401,
          message: 'Não autorizado. Faça login novamente.',
          url: '/api/budgets',
          method: 'GET',
        });
      }
    });

    it('should handle 403 Forbidden error', async () => {
      const request = new HttpRequest('GET', '/api/budgets/123');
      const error = new HttpErrorResponse({
        error: { message: 'Forbidden' },
        status: 403,
        statusText: 'Forbidden',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await errorInterceptor(request, mockNext).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe(
          'Acesso negado. Você não tem permissão para esta ação.'
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 403,
          message: 'Acesso negado. Você não tem permissão para esta ação.',
          url: '/api/budgets/123',
          method: 'GET',
        });
      }
    });

    it('should handle 404 Not Found error', async () => {
      const request = new HttpRequest('GET', '/api/budgets/999');
      const error = new HttpErrorResponse({
        error: { message: 'Not Found' },
        status: 404,
        statusText: 'Not Found',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await errorInterceptor(request, mockNext).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Recurso não encontrado.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 404,
          message: 'Recurso não encontrado.',
          url: '/api/budgets/999',
          method: 'GET',
        });
      }
    });

    it('should handle 500 Internal Server Error', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const error = new HttpErrorResponse({
        error: { message: 'Internal Server Error' },
        status: 500,
        statusText: 'Internal Server Error',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await errorInterceptor(request, mockNext).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe(
          'Erro interno do servidor. Tente novamente mais tarde.'
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 500,
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
          url: '/api/budgets',
          method: 'GET',
        });
      }
    });

    it('should handle unknown status codes', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const error = new HttpErrorResponse({
        error: { message: 'Unknown Error' },
        status: 999,
        statusText: 'Unknown Error',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await errorInterceptor(request, mockNext).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe(
          'Erro 999: Http failure response for (unknown url): 999 Unknown Error'
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 999,
          message: 'Erro 999: Http failure response for (unknown url): 999 Unknown Error',
          url: '/api/budgets',
          method: 'GET',
        });
      }
    });

    it('should handle error with no status', async () => {
      const request = new HttpRequest('GET', '/api/budgets');
      const error = new HttpErrorResponse({
        error: { message: 'Network Error' },
        status: 0,
        statusText: 'Unknown Error',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await errorInterceptor(request, mockNext).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe(
          'Erro 0: Http failure response for (unknown url): 0 Unknown Error'
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 0,
          message: 'Erro 0: Http failure response for (unknown url): 0 Unknown Error',
          url: '/api/budgets',
          method: 'GET',
        });
      }
    });
  });
});
