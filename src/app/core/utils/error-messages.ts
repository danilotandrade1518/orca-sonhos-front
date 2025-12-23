import { ApiError } from '../services/api/api.service';

export type BudgetOperation =
  | 'list'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'
  | 'addParticipant'
  | 'removeParticipant';

export function getBudgetErrorMessage(
  error: ApiError | null | undefined,
  operation: BudgetOperation
): string {
  if (!error) {
    return getDefaultErrorMessage(operation);
  }

  if (error.code) {
    const codeMessage = getMessageByErrorCode(error.code, operation);
    if (codeMessage) {
      return codeMessage;
    }
  }

  const statusMessage = getMessageByStatusAndOperation(error.status, operation);
  if (statusMessage) {
    return statusMessage;
  }

  if (error.message && error.message !== 'User not authenticated') {
    return error.message;
  }

  return getDefaultErrorMessage(operation);
}

function getDefaultErrorMessage(operation: BudgetOperation): string {
  const messages: Record<BudgetOperation, string> = {
    list: 'Não foi possível carregar a lista de orçamentos. Tente novamente.',
    get: 'Não foi possível carregar os detalhes do orçamento. Tente novamente.',
    create: 'Não foi possível criar o orçamento. Verifique os dados e tente novamente.',
    update: 'Não foi possível atualizar o orçamento. Verifique os dados e tente novamente.',
    delete: 'Não foi possível excluir o orçamento. Tente novamente.',
    addParticipant: 'Não foi possível adicionar o participante. Tente novamente.',
    removeParticipant: 'Não foi possível remover o participante. Tente novamente.',
  };

  return messages[operation];
}

function getMessageByErrorCode(
  code: string,
  operation: BudgetOperation
): string | null {
  const codeUpper = code.toUpperCase();

  if (codeUpper === 'UNAUTHORIZED' || codeUpper === 'NOT_AUTHENTICATED') {
    return 'Você precisa estar autenticado para realizar esta ação. Faça login novamente.';
  }

  if (codeUpper === 'FORBIDDEN' || codeUpper === 'ACCESS_DENIED') {
    if (operation === 'delete') {
      return 'Apenas o dono do orçamento pode excluí-lo.';
    }
    return 'Você não tem permissão para realizar esta ação.';
  }

  if (codeUpper.includes('VALIDATION') || codeUpper.includes('INVALID')) {
    if (operation === 'create' || operation === 'update') {
      return 'Dados inválidos. Verifique o nome do orçamento (mínimo 3 caracteres, máximo 100).';
    }
    return 'Dados inválidos. Verifique as informações e tente novamente.';
  }

  if (codeUpper.includes('NOT_FOUND') || codeUpper === 'BUDGET_NOT_FOUND') {
    return 'Orçamento não encontrado.';
  }

  if (codeUpper.includes('ALREADY_EXISTS') || codeUpper.includes('DUPLICATE')) {
    if (operation === 'addParticipant') {
      return 'Este usuário já é participante do orçamento.';
    }
    return 'Este orçamento já existe.';
  }

  if (
    codeUpper.includes('PERSONAL_BUDGET') ||
    codeUpper.includes('NOT_SHARED') ||
    codeUpper === 'BUDGETNOTSHAREDERROR' ||
    codeUpper.includes('BUDGET_NOT_SHARED')
  ) {
    return 'Orçamentos pessoais não permitem adicionar participantes.';
  }

  if (
    codeUpper === 'ONLYOWNERCANDELETEBUDGETERROR' ||
    codeUpper.includes('ONLY_OWNER_CAN_DELETE')
  ) {
    return 'Apenas o dono do orçamento pode excluí-lo.';
  }

  if (codeUpper.includes('HAS_TRANSACTIONS') || codeUpper.includes('HAS_ACCOUNTS')) {
    return 'Não é possível excluir um orçamento que possui contas ou transações.';
  }

  if (codeUpper.includes('OWNER_CANNOT_BE_REMOVED')) {
    return 'Não é possível remover o dono do orçamento.';
  }

  return null;
}

function getMessageByStatusAndOperation(
  status: number,
  operation: BudgetOperation
): string | null {
  switch (status) {
    case 400:
      if (operation === 'addParticipant') {
        return 'Não foi possível adicionar o participante. Verifique se o orçamento é compartilhado e se o usuário existe.';
      }
      if (operation === 'create' || operation === 'update') {
        return 'Dados inválidos. Verifique o nome do orçamento (mínimo 3 caracteres, máximo 100).';
      }
      return 'Dados inválidos. Verifique as informações enviadas.';

    case 401:
      return 'Você precisa estar autenticado para realizar esta ação. Faça login novamente.';

    case 403:
      if (operation === 'delete') {
        return 'Apenas o dono do orçamento pode excluí-lo.';
      }
      if (operation === 'addParticipant' || operation === 'removeParticipant') {
        return 'Você não tem permissão para gerenciar participantes deste orçamento.';
      }
      return 'Você não tem permissão para realizar esta ação.';

    case 404:
      if (operation === 'get' || operation === 'update' || operation === 'delete') {
        return 'Orçamento não encontrado.';
      }
      return 'Recurso não encontrado.';

    case 409:
      if (operation === 'addParticipant') {
        return 'Este usuário já é participante do orçamento.';
      }
      return 'Conflito. O recurso já existe ou está em uso.';

    case 422:
      if (operation === 'create' || operation === 'update') {
        return 'Dados inválidos. Verifique o nome do orçamento (mínimo 3 caracteres, máximo 100).';
      }
      return 'Dados inválidos. Verifique os campos obrigatórios.';

    case 500:
      return 'Erro interno do servidor. Tente novamente mais tarde.';

    default:
      return null;
  }
}
