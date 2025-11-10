import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(() => {
    service = new LocaleService();
  });

  describe('formatCurrency', () => {
    it('should format currency in pt-BR locale', () => {
      const result = service.formatCurrency(1234.56, 'BRL');
      expect(result).toBe('R$\u00A01.234,56');
    });

    it('should format currency with custom options', () => {
      const result = service.formatCurrency(1234.5, 'BRL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(result).toBe('R$\u00A01.234,50');
    });

    it('should handle zero value', () => {
      const result = service.formatCurrency(0, 'BRL');
      expect(result).toBe('R$\u00A00,00');
    });

    it('should handle negative values', () => {
      const result = service.formatCurrency(-1234.56, 'BRL');
      expect(result).toBe('-R$\u00A01.234,56');
    });

    it('should fallback to toFixed on error', () => {
      const originalNumberFormat = Intl.NumberFormat;
      const mockNumberFormat = vi.fn().mockImplementation(() => {
        throw new Error('Format error');
      });

      Object.defineProperty(globalThis, 'Intl', {
        value: {
          ...Intl,
          NumberFormat: mockNumberFormat,
        },
        writable: true,
        configurable: true,
      });

      const result = service.formatCurrency(1234.56, 'BRL');
      expect(result).toBe('1234.56');

      Object.defineProperty(globalThis, 'Intl', {
        value: {
          ...Intl,
          NumberFormat: originalNumberFormat,
        },
        writable: true,
        configurable: true,
      });
    });
  });

  describe('formatNumber', () => {
    it('should format number in pt-BR locale', () => {
      const result = service.formatNumber(1234.56);
      expect(result).toBe('1.234,56');
    });

    it('should format number with custom precision', () => {
      const result = service.formatNumber(1234.5, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      expect(result).toBe('1.235');
    });
  });

  describe('formatDate', () => {
    it('should format date in pt-BR locale', () => {
      const date = new Date(2024, 0, 15);
      const result = service.formatDate(date);
      expect(result).toMatch(/15\/01\/2024/);
    });

    it('should format date with custom options', () => {
      const date = new Date(2024, 0, 15);
      const result = service.formatDate(date, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      expect(result).toContain('2024');
      expect(result).toMatch(/\d{2}\/\d{2}\/2024|janeiro|Janeiro|15 de janeiro de 2024/);
    });

    it('should handle string date', () => {
      const result = service.formatDate('2024-01-15');
      expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
    });

    it('should handle number timestamp', () => {
      const timestamp = new Date(2024, 0, 15).getTime();
      const result = service.formatDate(timestamp);
      expect(result).toMatch(/15\/01\/2024/);
    });
  });

  describe('formatDateShort', () => {
    it('should format date in short format', () => {
      const date = new Date(2024, 0, 15);
      const result = service.formatDateShort(date);
      expect(result).toMatch(/15\/01\/2024/);
    });
  });

  describe('formatDateLong', () => {
    it('should format date in long format', () => {
      const date = new Date(2024, 0, 15);
      const result = service.formatDateLong(date);
      expect(result).toContain('2024');
      expect(result).toMatch(/\d{2}\/\d{2}\/2024|janeiro|Janeiro|15 de janeiro de 2024/);
    });
  });

  describe('formatDateTime', () => {
    it('should format date with time', () => {
      const date = new Date(2024, 0, 15, 14, 30);
      const result = service.formatDateTime(date);
      expect(result).toMatch(/15\/01\/2024/);
      expect(result).toMatch(/\d{2}\/\d{2}\/2024|\d{2}:\d{2}/);
    });
  });

  describe('locale management', () => {
    it('should set and get current locale', () => {
      service.setLocale('en-US');
      expect(service.currentLocale()).toBe('en-US');
    });

    it('should set and get default currency', () => {
      service.setDefaultCurrency('USD');
      expect(service.defaultCurrency()).toBe('USD');
    });
  });
});
