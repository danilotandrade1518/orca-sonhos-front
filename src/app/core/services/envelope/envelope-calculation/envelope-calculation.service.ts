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
  
  getTotalAllocated(envelopes: EnvelopeDto[]): number {
    if (!envelopes || envelopes.length === 0) {
      return 0;
    }
    return envelopes.reduce((sum, envelope) => sum + envelope.limit, 0);
  }
  
  getTotalSpent(envelopes: EnvelopeDto[]): number {
    if (!envelopes || envelopes.length === 0) {
      return 0;
    }
    return envelopes.reduce((sum, envelope) => sum + envelope.currentUsage, 0);
  }
  
  getOverBudgetCount(envelopes: EnvelopeDto[]): number {
    if (!envelopes || envelopes.length === 0) {
      return 0;
    }
    return envelopes.filter((envelope) => envelope.usagePercentage > 100).length;
  }
  
  getNearLimitCount(envelopes: EnvelopeDto[]): number {
    if (!envelopes || envelopes.length === 0) {
      return 0;
    }
    return envelopes.filter(
      (envelope) => envelope.usagePercentage >= 80 && envelope.usagePercentage <= 100
    ).length;
  }
  
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
  
  getAggregatedData(envelopes: EnvelopeDto[]): EnvelopeAggregatedData {
    return {
      totalAllocated: this.getTotalAllocated(envelopes),
      totalSpent: this.getTotalSpent(envelopes),
      overallUsagePercentage: this.getOverallUsagePercentage(envelopes),
      overBudgetCount: this.getOverBudgetCount(envelopes),
      nearLimitCount: this.getNearLimitCount(envelopes),
    };
  }
  
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
  
  private getBudgetUsageStatus(percentage: number): HealthIndicatorStatus {
    if (percentage > 100) {
      return 'critical';
    }
    if (percentage >= 80) {
      return 'warning';
    }
    return 'healthy';
  }
  
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
