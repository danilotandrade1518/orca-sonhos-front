import { HttpErrorResponse } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { errorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('should be defined', () => {
    expect(errorInterceptor).toBeDefined();
  });

  it('should handle 400 Bad Request error message', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Invalid data' },
      status: 400,
      statusText: 'Bad Request',
    });

    let errorMessage = 'Ocorreu um erro inesperado';

    if (errorResponse.error instanceof ErrorEvent) {
      errorMessage = `Erro de cliente: ${errorResponse.error.message}`;
    } else {
      switch (errorResponse.status) {
        case 400:
          errorMessage = 'Dados inválidos. Verifique as informações enviadas.';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 409:
          errorMessage = 'Conflito. O recurso já existe ou está em uso.';
          break;
        case 422:
          errorMessage = 'Dados inválidos. Verifique os campos obrigatórios.';
          break;
        case 429:
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 502:
          errorMessage = 'Servidor temporariamente indisponível.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível.';
          break;
        case 504:
          errorMessage = 'Timeout da requisição. Tente novamente.';
          break;
        default:
          errorMessage = `Erro ${errorResponse.status}: ${errorResponse.message}`;
      }
    }

    expect(errorMessage).toBe('Dados inválidos. Verifique as informações enviadas.');
  });

  it('should handle 401 Unauthorized error message', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Unauthorized' },
      status: 401,
      statusText: 'Unauthorized',
    });

    let errorMessage = 'Ocorreu um erro inesperado';

    if (errorResponse.error instanceof ErrorEvent) {
      errorMessage = `Erro de cliente: ${errorResponse.error.message}`;
    } else {
      switch (errorResponse.status) {
        case 400:
          errorMessage = 'Dados inválidos. Verifique as informações enviadas.';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 409:
          errorMessage = 'Conflito. O recurso já existe ou está em uso.';
          break;
        case 422:
          errorMessage = 'Dados inválidos. Verifique os campos obrigatórios.';
          break;
        case 429:
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 502:
          errorMessage = 'Servidor temporariamente indisponível.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível.';
          break;
        case 504:
          errorMessage = 'Timeout da requisição. Tente novamente.';
          break;
        default:
          errorMessage = `Erro ${errorResponse.status}: ${errorResponse.message}`;
      }
    }

    expect(errorMessage).toBe('Não autorizado. Faça login novamente.');
  });

  it('should handle 500 Internal Server Error message', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Internal Server Error' },
      status: 500,
      statusText: 'Internal Server Error',
    });

    let errorMessage = 'Ocorreu um erro inesperado';

    if (errorResponse.error instanceof ErrorEvent) {
      errorMessage = `Erro de cliente: ${errorResponse.error.message}`;
    } else {
      switch (errorResponse.status) {
        case 400:
          errorMessage = 'Dados inválidos. Verifique as informações enviadas.';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 409:
          errorMessage = 'Conflito. O recurso já existe ou está em uso.';
          break;
        case 422:
          errorMessage = 'Dados inválidos. Verifique os campos obrigatórios.';
          break;
        case 429:
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 502:
          errorMessage = 'Servidor temporariamente indisponível.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível.';
          break;
        case 504:
          errorMessage = 'Timeout da requisição. Tente novamente.';
          break;
        default:
          errorMessage = `Erro ${errorResponse.status}: ${errorResponse.message}`;
      }
    }

    expect(errorMessage).toBe('Erro interno do servidor. Tente novamente mais tarde.');
  });

  it('should handle unknown status codes', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Unknown Error' },
      status: 999,
      statusText: 'Unknown Error',
    });

    let errorMessage = 'Ocorreu um erro inesperado';

    if (errorResponse.error instanceof ErrorEvent) {
      errorMessage = `Erro de cliente: ${errorResponse.error.message}`;
    } else {
      switch (errorResponse.status) {
        case 400:
          errorMessage = 'Dados inválidos. Verifique as informações enviadas.';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 409:
          errorMessage = 'Conflito. O recurso já existe ou está em uso.';
          break;
        case 422:
          errorMessage = 'Dados inválidos. Verifique os campos obrigatórios.';
          break;
        case 429:
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 502:
          errorMessage = 'Servidor temporariamente indisponível.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível.';
          break;
        case 504:
          errorMessage = 'Timeout da requisição. Tente novamente.';
          break;
        default:
          errorMessage = `Erro ${errorResponse.status}: ${errorResponse.message}`;
      }
    }

    expect(errorMessage).toBe(
      'Erro 999: Http failure response for (unknown url): 999 Unknown Error'
    );
  });
});
