import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../../services/notification/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado';
      let errorTitle = 'Erro';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erro de cliente: ${error.error.message}`;
        errorTitle = 'Erro de Rede';
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Dados inválidos. Verifique as informações enviadas.';
            errorTitle = 'Dados Inválidos';
            break;
          case 401:
            errorMessage = 'Não autorizado. Faça login novamente.';
            errorTitle = 'Não Autorizado';
            break;
          case 403:
            errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
            errorTitle = 'Acesso Negado';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado.';
            errorTitle = 'Não Encontrado';
            break;
          case 409:
            errorMessage = 'Conflito. O recurso já existe ou está em uso.';
            errorTitle = 'Conflito';
            break;
          case 422:
            errorMessage = 'Dados inválidos. Verifique os campos obrigatórios.';
            errorTitle = 'Validação';
            break;
          case 429:
            errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
            errorTitle = 'Muitas Tentativas';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
            errorTitle = 'Erro do Servidor';
            break;
          case 502:
            errorMessage = 'Servidor temporariamente indisponível.';
            errorTitle = 'Servidor Indisponível';
            break;
          case 503:
            errorMessage = 'Serviço temporariamente indisponível.';
            errorTitle = 'Serviço Indisponível';
            break;
          case 504:
            errorMessage = 'Timeout da requisição. Tente novamente.';
            errorTitle = 'Timeout';
            break;
          default:
            errorMessage = `Erro ${error.status}: ${error.message}`;
            errorTitle = 'Erro';
        }
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        method: req.method,
      });

      notificationService.showError(errorMessage, errorTitle);

      return throwError(() => new Error(errorMessage));
    })
  );
};
