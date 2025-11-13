import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService, DateFormatOptions } from './locale.service';

@Pipe({
  name: 'osDate',
  standalone: true,
})
export class DatePipe implements PipeTransform {
  private readonly localeService = inject(LocaleService);

  transform(
    value: Date | string | number | null | undefined,
    options?: DateFormatOptions
  ): string {
    if (!value) {
      return '';
    }

    return this.localeService.formatDate(value, options);
  }
}
