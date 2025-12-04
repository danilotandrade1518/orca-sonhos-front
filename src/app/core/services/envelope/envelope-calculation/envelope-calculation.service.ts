import { Injectable } from '@angular/core';

import { EnvelopeDto } from '../../../../../dtos/envelope';
import { BudgetUsageIndicator, HealthIndicatorStatus } from '../../../../features/dashboard/types/dashboard.types';

export interface EnvelopeAggregatedData {
  totalAllocated: number;
  totalSpent: number;
  overallUsagePercentage: number;
  overBudgetCount: number;
  nearLimitCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class EnvelopeCalculationService {
  /**
   * Calcula o total alocado (soma dos limites) de todos os envelopes
   * @param envelopes Array de envelopes
   * @returns Total alocado em centavos
   */
  getTotalAllocated(envelopes: EnvelopeDto[]): number {
    if (!envelopes || envelopes.length === 0) {
      return 0;
    }
    return envelopes.reduce((sum, envelope) => sum + envelope.limit, 0);
  }

  /**
   * Calcula o total gasto (soma dos usos) de todos os envelopes
   * @param envelopes Array de envelopes
   * @returns Total gasto em centavos
   */
  getTotalSpent(envelopes: EnvelopeDto[]): number {
    if (!envelopes || envelopes.length === 0) {
      return 0;
    }
    return envelopes.reduce((sum, envelope) => sum + envelope.currentUsage, 0);
  }

  /**
   * Conta quantos envelopes excederam o limite (usagePercentage > 100)
   * @param envelopes Array de envelopes
   * @returns Número de envelopes estourados
   */
  getOverBudgetCount(envelopes: EnvelopeDto[]): number {
    if (!envelopes || envelopes.length === 0) {
      return 0;
    }
    return envelopes.filter((envelope) => envelope.usagePercentage > 100).length;
  }

  /**
   * Conta quantos envelopes estão próximos do limite (80% <= usagePercentage <= 100%)
   * @param envelopes Array de envelopes
   * @returns Número de envelopes próximos do limite
   */
  getNearLimitCount(envelopes: EnvelopeDto[]): number {
    if (!envelopes || envelopes.length === 0) {
      return 0;
    }
    return envelopes.filter(
      (envelope) => envelope.usagePercentage >= 80 && envelope.usagePercentage <= 100
    ).length;
  }

  /**
   * Calcula o percentual geral de uso dos envelopes
   * @param envelopes Array de envelopes
   * @returns Percentual geral de uso (0-100+)
   */
  getOverallUsagePercentage(envelopes: EnvelopeDto[]): number {
    if (!envelopes || envelopes.length === 0) {
      return 0;
    }

    const totalAllocated = this.getTotalAllocated(envelopes);
    if (totalAllocated === 0) {
      return 0;
    }

    const totalSpent = this.getTotalSpent(envelopes);
    return (totalSpent / totalAllocated) * 100;
  }

  /**
   * Retorna dados agregados de envelopes para cálculo de indicadores
   * @param envelopes Array de envelopes
   * @returns Dados agregados (total alocado, total gasto, percentual geral, contagens)
   */
  getAggregatedData(envelopes: EnvelopeDto[]): EnvelopeAggregatedData {
    return {
      totalAllocated: this.getTotalAllocated(envelopes),
      totalSpent: this.getTotalSpent(envelopes),
      overallUsagePercentage: this.getOverallUsagePercentage(envelopes),
      overBudgetCount: this.getOverBudgetCount(envelopes),
      nearLimitCount: this.getNearLimitCount(envelopes),
    };
  }

  /**
   * Calcula o BudgetUsageIndicator a partir dos envelopes
   * @param envelopes Array de envelopes
   * @returns BudgetUsageIndicator com status, label e description
   */
  calculateBudgetUsageIndicator(envelopes: EnvelopeDto[]): BudgetUsageIndicator | null {
    if (!envelopes || envelopes.length === 0) {
      return null;
    }

    const percentage = this.getOverallUsagePercentage(envelopes);
    const status = this.getBudgetUsageStatus(percentage);
    const label = 'Uso de Orçamento e Envelopes';
    const description = this.getBudgetUsageDescription(percentage, status);

    return {
      value: percentage,
      percentage,
      status,
      label,
      description,
    };
  }

  /**
   * Determina o status do uso de orçamento baseado no percentual
   * @param percentage Percentual de uso (0-100+)
   * @returns Status do indicador
   */
  private getBudgetUsageStatus(percentage: number): HealthIndicatorStatus {
    if (percentage > 100) {
      return 'critical';
    }
    if (percentage >= 80) {
      return 'warning';
    }
    return 'healthy';
  }

  /**
   * Gera descrição do uso de orçamento baseado no percentual e status
   * @param percentage Percentual de uso
   * @param status Status do indicador
   * @returns Descrição formatada
   */
  private getBudgetUsageDescription(percentage: number, status: HealthIndicatorStatus): string {
    if (status === 'critical') {
      return `${percentage.toFixed(1)}% do orçamento utilizado (limite excedido)`;
    }
    if (status === 'warning') {
      return `${percentage.toFixed(1)}% do orçamento utilizado (próximo do limite)`;
    }
    return `${percentage.toFixed(1)}% do orçamento utilizado`;
  }
}

