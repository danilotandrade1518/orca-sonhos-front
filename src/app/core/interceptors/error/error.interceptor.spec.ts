import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../../services/notification/notification.service';

describe('ErrorInterceptor', () => {
  let mockNext: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let mockNotificationService: {
    showError: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mockNext = vi.fn();
    mockNotificationService = {
      showError: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: NotificationService, useValue: mockNotificationService },
      ],
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

      const result = await TestBed.runInInjectionContext(() =>
        errorInterceptor(request, mockNext)
      ).toPromise();
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
        await TestBed.runInInjectionContext(() => errorInterceptor(request, mockNext)).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Dados inválidos. Verifique as informações enviadas.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 400,
          message: 'Dados inválidos. Verifique as informações enviadas.',
          url: '/api/budgets',
          method: 'GET',
        });
        expect(mockNotificationService.showError).toHaveBeenCalledWith(
          'Dados inválidos. Verifique as informações enviadas.',
          'Dados Inválidos'
        );
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
        await TestBed.runInInjectionContext(() => errorInterceptor(request, mockNext)).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Não autorizado. Faça login novamente.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 401,
          message: 'Não autorizado. Faça login novamente.',
          url: '/api/budgets',
          method: 'GET',
        });
        expect(mockNotificationService.showError).toHaveBeenCalledWith(
          'Não autorizado. Faça login novamente.',
          'Não Autorizado'
        );
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
        await TestBed.runInInjectionContext(() => errorInterceptor(request, mockNext)).toPromise();
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
        expect(mockNotificationService.showError).toHaveBeenCalledWith(
          'Acesso negado. Você não tem permissão para esta ação.',
          'Acesso Negado'
        );
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
        await TestBed.runInInjectionContext(() => errorInterceptor(request, mockNext)).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Recurso não encontrado.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 404,
          message: 'Recurso não encontrado.',
          url: '/api/budgets/999',
          method: 'GET',
        });
        expect(mockNotificationService.showError).toHaveBeenCalledWith(
          'Recurso não encontrado.',
          'Não Encontrado'
        );
      }
    });

    it('should handle 500 Internal Server Error', async () => {
      const request = new HttpRequest('POST', '/api/budgets', {});
      const error = new HttpErrorResponse({
        error: { message: 'Internal Server Error' },
        status: 500,
        statusText: 'Internal Server Error',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => errorInterceptor(request, mockNext)).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe(
          'Erro interno do servidor. Tente novamente mais tarde.'
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 500,
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
          url: '/api/budgets',
          method: 'POST',
        });
        expect(mockNotificationService.showError).toHaveBeenCalledWith(
          'Erro interno do servidor. Tente novamente mais tarde.',
          'Erro do Servidor'
        );
      }
    });

    it('should handle unknown status codes', async () => {
      const request = new HttpRequest('GET', '/api/unknown');
      const error = new HttpErrorResponse({
        error: { message: 'Unknown Error' },
        status: 999,
        statusText: 'Unknown Error',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => errorInterceptor(request, mockNext)).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe(
          'Erro 999: Http failure response for (unknown url): 999 Unknown Error'
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 999,
          message: 'Erro 999: Http failure response for (unknown url): 999 Unknown Error',
          url: '/api/unknown',
          method: 'GET',
        });
        expect(mockNotificationService.showError).toHaveBeenCalledWith(
          'Erro 999: Http failure response for (unknown url): 999 Unknown Error',
          'Erro'
        );
      }
    });

    it('should handle error with no status', async () => {
      const request = new HttpRequest('GET', '/api/network-error');
      const error = new HttpErrorResponse({
        error: new ErrorEvent('Network error', {
          message: 'Network connection failed',
        }),
        status: 0,
        statusText: 'Unknown Error',
      });
      mockNext.mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => errorInterceptor(request, mockNext)).toPromise();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Erro de cliente: Network connection failed');
        expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', {
          status: 0,
          message: 'Erro de cliente: Network connection failed',
          url: '/api/network-error',
          method: 'GET',
        });
        expect(mockNotificationService.showError).toHaveBeenCalledWith(
          'Erro de cliente: Network connection failed',
          'Erro de Rede'
        );
      }
    });
  });
});
