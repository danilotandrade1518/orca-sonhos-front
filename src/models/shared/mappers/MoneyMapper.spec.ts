import { MoneyMapper } from './MoneyMapper';
import { Money } from '../value-objects/Money';

describe('MoneyMapper', () => {
  it('toApi/fromApi roundtrip', () => {
    const m = Money.fromCents(1234);
    const api = MoneyMapper.toApi(m);
    expect(api).toBe(1234);
    const back = MoneyMapper.fromApi(api!);
    expect(back?.toCents()).toBe(1234);
  });

  it('handles null/undefined gracefully', () => {
    expect(MoneyMapper.toApi(null as unknown as Money)).toBeNull();
    expect(MoneyMapper.fromApi(null as unknown as number)).toBeNull();
    expect(MoneyMapper.toApi(undefined as unknown as Money)).toBeNull();
    expect(MoneyMapper.fromApi(undefined as unknown as number)).toBeNull();
  });
});
