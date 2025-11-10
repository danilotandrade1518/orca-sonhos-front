import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService, CurrencyCode, CurrencyFormatOptions } from './locale.service';

@Pipe({
  name: 'osCurrency',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  private readonly localeService = inject(LocaleService);

  transform(
    value: number | null | undefined,
    currency: CurrencyCode = 'BRL',
    options?: CurrencyFormatOptions
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return this.localeService.formatCurrency(0, currency, options);
    }

    return this.localeService.formatCurrency(value, currency, options);
  }
}
