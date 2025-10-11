import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erro de cliente: ${error.error.message}`;
      } else {
        switch (error.status) {
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
            errorMessage = `Erro ${error.status}: ${error.message}`;
        }
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        method: req.method,
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
