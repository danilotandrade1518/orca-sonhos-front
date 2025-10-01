export type DateString = string;

export class DateStringHelper {
  static fromDate(date: Date): DateString {
    return date.toISOString();
  }

  static toDate(dateString: DateString): Date {
    return new Date(dateString);
  }

  static isValid(value: string): value is DateString {
    if (typeof value !== 'string') {
      return false;
    }

    const date = new Date(value);
    return !isNaN(date.getTime()) && date.toISOString() === value;
  }

  static format(
    dateString: DateString,
    locale: string = 'pt-BR',
    options?: Intl.DateTimeFormatOptions
  ): string {
    const date = this.toDate(dateString);
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  static formatDate(dateString: DateString, locale: string = 'pt-BR'): string {
    return this.format(dateString, locale, { dateStyle: 'short' });
  }

  static formatTime(dateString: DateString, locale: string = 'pt-BR'): string {
    return this.format(dateString, locale, { timeStyle: 'short' });
  }

  static formatDateTime(dateString: DateString, locale: string = 'pt-BR'): string {
    return this.format(dateString, locale, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  static now(): DateString {
    return this.fromDate(new Date());
  }

  static compare(a: DateString, b: DateString): number {
    const dateA = this.toDate(a);
    const dateB = this.toDate(b);

    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  }

  static isBefore(dateString: DateString, compareTo: DateString): boolean {
    return this.compare(dateString, compareTo) < 0;
  }

  static isAfter(dateString: DateString, compareTo: DateString): boolean {
    return this.compare(dateString, compareTo) > 0;
  }

  static isEqual(dateString: DateString, compareTo: DateString): boolean {
    return this.compare(dateString, compareTo) === 0;
  }
}
