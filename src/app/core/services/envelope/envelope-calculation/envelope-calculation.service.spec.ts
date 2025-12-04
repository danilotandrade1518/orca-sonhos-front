import { beforeEach, describe, expect, it } from 'vitest';

import { EnvelopeCalculationService } from './envelope-calculation.service';
import { EnvelopeDto } from '../../../../../dtos/envelope';

describe('EnvelopeCalculationService', () => {
  let service: EnvelopeCalculationService;

  const mockEnvelopes: EnvelopeDto[] = [
    {
      id: 'envelope-1',
      budgetId: 'budget-1',
      categoryId: 'category-1',
      categoryName: 'Alimentação',
      name: 'Envelope Alimentação',
      limit: 80000,
      currentUsage: 45000,
      usagePercentage: 56.25,
      active: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-12-03T00:00:00Z',
    },
    {
      id: 'envelope-2',
      budgetId: 'budget-1',
      categoryId: 'category-2',
      categoryName: 'Transporte',
      name: 'Envelope Transporte',
      limit: 30000,
      currentUsage: 35000,
      usagePercentage: 116.67,
      active: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-12-03T00:00:00Z',
    },
    {
      id: 'envelope-3',
      budgetId: 'budget-1',
      categoryId: 'category-3',
      categoryName: 'Lazer',
      name: 'Envelope Lazer',
      limit: 50000,
      currentUsage: 40000,
      usagePercentage: 80,
      active: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-12-03T00:00:00Z',
    },
  ];

  beforeEach(() => {
    service = new EnvelopeCalculationService();
  });

  describe('getTotalAllocated', () => {
    it('should return 0 for empty array', () => {
      expect(service.getTotalAllocated([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(service.getTotalAllocated(null as unknown as EnvelopeDto[])).toBe(0);
      expect(service.getTotalAllocated(undefined as unknown as EnvelopeDto[])).toBe(0);
    });

    it('should calculate total allocated correctly', () => {
      const result = service.getTotalAllocated(mockEnvelopes);
      expect(result).toBe(160000);
    });

    it('should handle single envelope', () => {
      const result = service.getTotalAllocated([mockEnvelopes[0]]);
      expect(result).toBe(80000);
    });
  });

  describe('getTotalSpent', () => {
    it('should return 0 for empty array', () => {
      expect(service.getTotalSpent([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(service.getTotalSpent(null as unknown as EnvelopeDto[])).toBe(0);
      expect(service.getTotalSpent(undefined as unknown as EnvelopeDto[])).toBe(0);
    });

    it('should calculate total spent correctly', () => {
      const result = service.getTotalSpent(mockEnvelopes);
      expect(result).toBe(120000);
    });

    it('should handle single envelope', () => {
      const result = service.getTotalSpent([mockEnvelopes[0]]);
      expect(result).toBe(45000);
    });
  });

  describe('getOverBudgetCount', () => {
    it('should return 0 for empty array', () => {
      expect(service.getOverBudgetCount([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(service.getOverBudgetCount(null as unknown as EnvelopeDto[])).toBe(0);
      expect(service.getOverBudgetCount(undefined as unknown as EnvelopeDto[])).toBe(0);
    });

    it('should count envelopes over budget correctly', () => {
      const result = service.getOverBudgetCount(mockEnvelopes);
      expect(result).toBe(1);
    });

    it('should return 0 when no envelopes are over budget', () => {
      const envelopes = mockEnvelopes.filter((e) => e.usagePercentage <= 100);
      const result = service.getOverBudgetCount(envelopes);
      expect(result).toBe(0);
    });
  });

  describe('getNearLimitCount', () => {
    it('should return 0 for empty array', () => {
      expect(service.getNearLimitCount([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(service.getNearLimitCount(null as unknown as EnvelopeDto[])).toBe(0);
      expect(service.getNearLimitCount(undefined as unknown as EnvelopeDto[])).toBe(0);
    });

    it('should count envelopes near limit correctly (80-100%)', () => {
      const result = service.getNearLimitCount(mockEnvelopes);
      expect(result).toBe(1);
    });

    it('should not count envelopes below 80%', () => {
      const envelopes = [mockEnvelopes[0]];
      const result = service.getNearLimitCount(envelopes);
      expect(result).toBe(0);
    });

    it('should not count envelopes over 100%', () => {
      const envelopes = [mockEnvelopes[1]];
      const result = service.getNearLimitCount(envelopes);
      expect(result).toBe(0);
    });
  });

  describe('getOverallUsagePercentage', () => {
    it('should return 0 for empty array', () => {
      expect(service.getOverallUsagePercentage([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(service.getOverallUsagePercentage(null as unknown as EnvelopeDto[])).toBe(0);
      expect(service.getOverallUsagePercentage(undefined as unknown as EnvelopeDto[])).toBe(0);
    });

    it('should return 0 when total allocated is 0', () => {
      const envelopes: EnvelopeDto[] = [
        {
          ...mockEnvelopes[0],
          limit: 0,
        },
      ];
      const result = service.getOverallUsagePercentage(envelopes);
      expect(result).toBe(0);
    });

    it('should calculate overall usage percentage correctly', () => {
      const result = service.getOverallUsagePercentage(mockEnvelopes);
      expect(result).toBe(75);
    });

    it('should handle single envelope', () => {
      const result = service.getOverallUsagePercentage([mockEnvelopes[0]]);
      expect(result).toBe(56.25);
    });

    it('should handle percentage over 100%', () => {
      const envelopes: EnvelopeDto[] = [
        {
          ...mockEnvelopes[0],
          limit: 10000,
          currentUsage: 15000,
          usagePercentage: 150,
        },
      ];
      const result = service.getOverallUsagePercentage(envelopes);
      expect(result).toBe(150);
    });
  });

  describe('getAggregatedData', () => {
    it('should return aggregated data correctly', () => {
      const result = service.getAggregatedData(mockEnvelopes);
      expect(result).toEqual({
        totalAllocated: 160000,
        totalSpent: 120000,
        overallUsagePercentage: 75,
        overBudgetCount: 1,
        nearLimitCount: 1,
      });
    });

    it('should return zeros for empty array', () => {
      const result = service.getAggregatedData([]);
      expect(result).toEqual({
        totalAllocated: 0,
        totalSpent: 0,
        overallUsagePercentage: 0,
        overBudgetCount: 0,
        nearLimitCount: 0,
      });
    });
  });

  describe('calculateBudgetUsageIndicator', () => {
    it('should return null for empty array', () => {
      const result = service.calculateBudgetUsageIndicator([]);
      expect(result).toBeNull();
    });

    it('should return null for null/undefined', () => {
      expect(service.calculateBudgetUsageIndicator(null as unknown as EnvelopeDto[])).toBeNull();
      expect(
        service.calculateBudgetUsageIndicator(undefined as unknown as EnvelopeDto[])
      ).toBeNull();
    });

    it('should calculate healthy status when usage < 80%', () => {
      const envelopes: EnvelopeDto[] = [
        {
          ...mockEnvelopes[0],
          limit: 100000,
          currentUsage: 50000,
          usagePercentage: 50,
        },
      ];
      const result = service.calculateBudgetUsageIndicator(envelopes);
      expect(result).not.toBeNull();
      expect(result?.status).toBe('healthy');
      expect(result?.percentage).toBe(50);
      expect(result?.label).toBe('Uso de Orçamento e Envelopes');
    });

    it('should calculate warning status when usage between 80-100%', () => {
      const envelopes: EnvelopeDto[] = [
        {
          ...mockEnvelopes[0],
          limit: 100000,
          currentUsage: 90000,
          usagePercentage: 90,
        },
      ];
      const result = service.calculateBudgetUsageIndicator(envelopes);
      expect(result).not.toBeNull();
      expect(result?.status).toBe('warning');
      expect(result?.percentage).toBe(90);
    });

    it('should calculate critical status when usage > 100%', () => {
      const envelopes: EnvelopeDto[] = [
        {
          ...mockEnvelopes[1],
          limit: 100000,
          currentUsage: 120000,
          usagePercentage: 120,
        },
      ];
      const result = service.calculateBudgetUsageIndicator(envelopes);
      expect(result).not.toBeNull();
      expect(result?.status).toBe('critical');
      expect(result?.percentage).toBe(120);
    });

    it('should calculate correctly with multiple envelopes', () => {
      const result = service.calculateBudgetUsageIndicator(mockEnvelopes);
      expect(result).not.toBeNull();
      expect(result?.percentage).toBe(75);
      expect(result?.status).toBe('healthy');
    });
  });
});
