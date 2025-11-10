import { Injectable, signal } from '@angular/core';

export type Locale = 'pt-BR' | 'en-US';
export type CurrencyCode = 'BRL' | 'USD' | 'EUR' | 'GBP';

export interface DateFormatOptions {
  day?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'short' | 'long';
  year?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
}

export interface CurrencyFormatOptions {
  style?: 'currency' | 'decimal';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private readonly _currentLocale = signal<Locale>('pt-BR');
  private readonly _defaultCurrency = signal<CurrencyCode>('BRL');

  readonly currentLocale = this._currentLocale.asReadonly();
  readonly defaultCurrency = this._defaultCurrency.asReadonly();

  setLocale(locale: Locale): void {
    this._currentLocale.set(locale);
  }

  setDefaultCurrency(currency: CurrencyCode): void {
    this._defaultCurrency.set(currency);
  }

  formatCurrency(
    value: number,
    currency: CurrencyCode = this._defaultCurrency(),
    options: CurrencyFormatOptions = {}
  ): string {
    const locale = this._currentLocale();
    const {
      style = 'currency',
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
    } = options;

    try {
      return new Intl.NumberFormat(locale, {
        style,
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(value);
    } catch {
      return value.toFixed(maximumFractionDigits);
    }
  }

  formatNumber(
    value: number,
    options: Omit<CurrencyFormatOptions, 'style'> = {}
  ): string {
    const locale = this._currentLocale();
    const {
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
    } = options;

    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(value);
    } catch {
      return value.toFixed(maximumFractionDigits);
    }
  }

  formatDate(
    date: Date | string | number,
    options: DateFormatOptions = {}
  ): string {
    const locale = this._currentLocale();
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    const formatOptions: Intl.DateTimeFormatOptions = {
      ...defaultOptions,
      ...options,
    };

    try {
      return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
    } catch {
      return dateObj.toLocaleDateString();
    }
  }

  formatDateShort(date: Date | string | number): string {
    return this.formatDate(date, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatDateLong(date: Date | string | number): string {
    return this.formatDate(date, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  formatDateTime(date: Date | string | number): string {
    return this.formatDate(date, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

