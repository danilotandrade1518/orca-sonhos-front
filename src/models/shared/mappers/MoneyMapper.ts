import { Money } from '../value-objects/Money';

// Helpers to convert Money <-> API (cents as integer)
export const MoneyMapper = {
  toApi(amount: Money | null | undefined): number | null {
    if (!amount) return null;
    return amount.toCents();
  },
  fromApi(cents: number | null | undefined): Money | null {
    if (cents == null) return null;
    return Money.fromCents(cents);
  },
};
