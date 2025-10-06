import { Injectable } from '@angular/core';
import { CreateEnvelopeRequestDto, UpdateEnvelopeRequestDto } from '../../dtos/envelope';
import {
  CreateCreditCardBillRequestDto,
  UpdateCreditCardBillRequestDto,
} from '../../dtos/credit-card-bill';
import { CreateCategoryRequestDto, UpdateCategoryRequestDto } from '../../dtos/category';
import { CreateGoalRequestDto, UpdateGoalRequestDto } from '../../dtos/goal';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  validateCreateEnvelope(dto: CreateEnvelopeRequestDto): string[] {
    const errors: string[] = [];

    if (!dto.userId || dto.userId.trim() === '') {
      errors.push('userId is required');
    }

    if (!dto.budgetId || dto.budgetId.trim() === '') {
      errors.push('budgetId is required');
    }

    if (!dto.name || dto.name.trim() === '') {
      errors.push('name is required');
    }

    if (dto.amount === undefined || dto.amount === null || dto.amount < 0) {
      errors.push('amount must be a positive number');
    }

    return errors;
  }

  validateUpdateEnvelope(dto: UpdateEnvelopeRequestDto): string[] {
    const errors: string[] = [];

    if (!dto.userId || dto.userId.trim() === '') {
      errors.push('userId is required');
    }

    if (!dto.envelopeId || dto.envelopeId.trim() === '') {
      errors.push('envelopeId is required');
    }

    if (dto.amount !== undefined && dto.amount < 0) {
      errors.push('amount must be a positive number');
    }

    return errors;
  }

  validateCreateCreditCardBill(dto: CreateCreditCardBillRequestDto): string[] {
    const errors: string[] = [];

    if (!dto.userId || dto.userId.trim() === '') {
      errors.push('userId is required');
    }

    if (!dto.creditCardId || dto.creditCardId.trim() === '') {
      errors.push('creditCardId is required');
    }

    if (dto.amount === undefined || dto.amount === null || dto.amount <= 0) {
      errors.push('amount must be a positive number');
    }

    if (!dto.dueDate || !(dto.dueDate instanceof Date)) {
      errors.push('dueDate is required and must be a valid date');
    }

    return errors;
  }

  validateUpdateCreditCardBill(dto: UpdateCreditCardBillRequestDto): string[] {
    const errors: string[] = [];

    if (!dto.userId || dto.userId.trim() === '') {
      errors.push('userId is required');
    }

    if (!dto.billId || dto.billId.trim() === '') {
      errors.push('billId is required');
    }

    if (dto.amount !== undefined && dto.amount <= 0) {
      errors.push('amount must be a positive number');
    }

    return errors;
  }

  validateCreateCategory(dto: CreateCategoryRequestDto): string[] {
    const errors: string[] = [];

    if (!dto.userId || dto.userId.trim() === '') {
      errors.push('userId is required');
    }

    if (!dto.name || dto.name.trim() === '') {
      errors.push('name is required');
    }

    return errors;
  }

  validateUpdateCategory(dto: UpdateCategoryRequestDto): string[] {
    const errors: string[] = [];

    if (!dto.userId || dto.userId.trim() === '') {
      errors.push('userId is required');
    }

    if (!dto.categoryId || dto.categoryId.trim() === '') {
      errors.push('categoryId is required');
    }

    return errors;
  }

  validateCreateGoal(dto: CreateGoalRequestDto): string[] {
    const errors: string[] = [];

    if (!dto.userId || dto.userId.trim() === '') {
      errors.push('userId is required');
    }

    if (!dto.budgetId || dto.budgetId.trim() === '') {
      errors.push('budgetId is required');
    }

    if (!dto.title || dto.title.trim() === '') {
      errors.push('title is required');
    }

    if (dto.targetAmount === undefined || dto.targetAmount === null || dto.targetAmount <= 0) {
      errors.push('targetAmount must be a positive number');
    }

    if (!dto.targetDate || !(dto.targetDate instanceof Date)) {
      errors.push('targetDate is required and must be a valid date');
    }

    if (!dto.categoryId || dto.categoryId.trim() === '') {
      errors.push('categoryId is required');
    }

    return errors;
  }

  validateUpdateGoal(dto: UpdateGoalRequestDto): string[] {
    const errors: string[] = [];

    if (!dto.userId || dto.userId.trim() === '') {
      errors.push('userId is required');
    }

    if (!dto.goalId || dto.goalId.trim() === '') {
      errors.push('goalId is required');
    }

    if (dto.targetAmount !== undefined && dto.targetAmount <= 0) {
      errors.push('targetAmount must be a positive number');
    }

    return errors;
  }
}
