import { DateString, DateStringHelper } from './DateString';

describe('DateString', () => {
  it('should work with DateString type', () => {
    const date: DateString = '2024-01-15T10:30:00.000Z';
    expect(date).toBe('2024-01-15T10:30:00.000Z');
  });

  it('should convert Date to DateString', () => {
    const date = new Date('2024-01-15T10:30:00.000Z');
    const dateString = DateStringHelper.fromDate(date);
    expect(dateString).toBe('2024-01-15T10:30:00.000Z');
  });

  it('should convert DateString to Date', () => {
    const dateString: DateString = '2024-01-15T10:30:00.000Z';
    const date = DateStringHelper.toDate(dateString);
    expect(date).toBeInstanceOf(Date);
    expect(date.toISOString()).toBe('2024-01-15T10:30:00.000Z');
  });

  it('should validate DateString', () => {
    expect(DateStringHelper.isValid('2024-01-15T10:30:00.000Z')).toBe(true);
    expect(DateStringHelper.isValid('invalid-date')).toBe(false);
  });

  it('should format date for display', () => {
    const dateString: DateString = '2024-01-15T10:30:00.000Z';
    const formatted = DateStringHelper.formatDate(dateString);
    expect(formatted).toBe('15/01/2024');
  });
});
