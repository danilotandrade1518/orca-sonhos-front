import { Injectable } from '@angular/core';
import {
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
  CreateGoalRequestDto,
  UpdateGoalRequestDto,
  CreateAccountRequestDto,
  UpdateAccountRequestDto,
  CreateCreditCardRequestDto,
  UpdateCreditCardRequestDto,
} from '../../dtos';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  validateCreateBudget(request: CreateBudgetRequestDto): string[] {
    const errors: string[] = [];

    if (!request.name || request.name.trim().length === 0) {
      errors.push('Budget name is required');
    }

    if (request.name && request.name.length > 100) {
      errors.push('Budget name must be less than 100 characters');
    }

    if (request.totalAmount <= 0) {
      errors.push('Total amount must be greater than 0');
    }

    if (request.startDate >= request.endDate) {
      errors.push('Start date must be before end date');
    }

    if (!request.categoryId) {
      errors.push('Category ID is required');
    }

    return errors;
  }

  validateUpdateBudget(request: UpdateBudgetRequestDto): string[] {
    const errors: string[] = [];

    if (request.name !== undefined && (!request.name || request.name.trim().length === 0)) {
      errors.push('Budget name cannot be empty');
    }

    if (request.name && request.name.length > 100) {
      errors.push('Budget name must be less than 100 characters');
    }

    if (request.totalAmount !== undefined && request.totalAmount <= 0) {
      errors.push('Total amount must be greater than 0');
    }

    if (request.startDate && request.endDate && request.startDate >= request.endDate) {
      errors.push('Start date must be before end date');
    }

    return errors;
  }

  validateCreateTransaction(request: CreateTransactionRequestDto): string[] {
    const errors: string[] = [];

    if (!request.amount || request.amount <= 0) {
      errors.push('Transaction amount must be greater than 0');
    }

    if (!request.type || !['income', 'expense', 'transfer'].includes(request.type)) {
      errors.push('Transaction type must be income, expense, or transfer');
    }

    if (
      request.description !== undefined &&
      (!request.description || request.description.trim().length === 0)
    ) {
      errors.push('Transaction description cannot be empty');
    }

    if (!request.budgetId || request.budgetId.trim().length === 0) {
      errors.push('Budget ID is required');
    }

    return errors;
  }

  validateUpdateTransaction(request: UpdateTransactionRequestDto): string[] {
    const errors: string[] = [];

    if (request.amount !== undefined && request.amount <= 0) {
      errors.push('Transaction amount must be greater than 0');
    }

    if (request.type && !['income', 'expense', 'transfer'].includes(request.type)) {
      errors.push('Transaction type must be income, expense, or transfer');
    }

    if (
      request.description !== undefined &&
      (!request.description || request.description.trim().length === 0)
    ) {
      errors.push('Transaction description cannot be empty');
    }

    return errors;
  }

  validateCreateGoal(request: CreateGoalRequestDto): string[] {
    const errors: string[] = [];

    if (!request.title || request.title.trim().length === 0) {
      errors.push('Goal title is required');
    }

    if (!request.targetAmount || request.targetAmount <= 0) {
      errors.push('Goal target amount must be greater than 0');
    }

    if (request.targetDate && request.targetDate <= new Date()) {
      errors.push('Target date must be in the future');
    }

    return errors;
  }

  validateUpdateGoal(request: UpdateGoalRequestDto): string[] {
    const errors: string[] = [];

    if (request.title !== undefined && (!request.title || request.title.trim().length === 0)) {
      errors.push('Goal title cannot be empty');
    }

    if (request.targetAmount !== undefined && request.targetAmount <= 0) {
      errors.push('Goal target amount must be greater than 0');
    }

    if (request.targetDate && request.targetDate <= new Date()) {
      errors.push('Target date must be in the future');
    }

    return errors;
  }

  validateCreateAccount(request: CreateAccountRequestDto): string[] {
    const errors: string[] = [];

    if (!request.name || request.name.trim().length === 0) {
      errors.push('Account name is required');
    }

    if (request.balance === undefined || request.balance < 0) {
      errors.push('Account balance must be 0 or greater');
    }

    if (
      request.type &&
      !['checking', 'savings', 'investment', 'credit', 'cash'].includes(request.type)
    ) {
      errors.push('Account type must be checking, savings, investment, credit, or cash');
    }

    return errors;
  }

  validateUpdateAccount(request: UpdateAccountRequestDto): string[] {
    const errors: string[] = [];

    if (request.name !== undefined && (!request.name || request.name.trim().length === 0)) {
      errors.push('Account name cannot be empty');
    }

    if (request.balance !== undefined && request.balance < 0) {
      errors.push('Account balance must be 0 or greater');
    }

    if (
      request.type &&
      !['checking', 'savings', 'investment', 'credit', 'cash'].includes(request.type)
    ) {
      errors.push('Account type must be checking, savings, investment, credit, or cash');
    }

    return errors;
  }

  validateCreateCreditCard(request: CreateCreditCardRequestDto): string[] {
    const errors: string[] = [];

    if (!request.name || request.name.trim().length === 0) {
      errors.push('Credit card name is required');
    }

    if (!request.limit || request.limit <= 0) {
      errors.push('Credit card limit must be greater than 0');
    }

    if (request.currentBalance === undefined || request.currentBalance < 0) {
      errors.push('Current balance must be 0 or greater');
    }

    if (
      request.interestRate !== undefined &&
      (request.interestRate < 0 || request.interestRate > 100)
    ) {
      errors.push('Interest rate must be between 0 and 100');
    }

    return errors;
  }

  validateUpdateCreditCard(request: UpdateCreditCardRequestDto): string[] {
    const errors: string[] = [];

    if (request.name !== undefined && (!request.name || request.name.trim().length === 0)) {
      errors.push('Credit card name cannot be empty');
    }

    if (request.limit !== undefined && request.limit <= 0) {
      errors.push('Credit card limit must be greater than 0');
    }

    if (request.currentBalance !== undefined && request.currentBalance < 0) {
      errors.push('Current balance must be 0 or greater');
    }

    if (
      request.interestRate !== undefined &&
      (request.interestRate < 0 || request.interestRate > 100)
    ) {
      errors.push('Interest rate must be between 0 and 100');
    }

    return errors;
  }
}
