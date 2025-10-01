import { GoalStatus, GoalStatusHelper } from './GoalStatus';

describe('GoalStatus', () => {
  it('should work with GoalStatus', () => {
    const status: GoalStatus = 'active';
    expect(status).toBe('active');
  });

  it('should validate GoalStatus', () => {
    expect(GoalStatusHelper.isValid('active')).toBe(true);
    expect(GoalStatusHelper.isValid('INVALID')).toBe(false);
  });

  it('should check if status allows contributions', () => {
    expect(GoalStatusHelper.canContribute('active')).toBe(true);
    expect(GoalStatusHelper.canContribute('completed')).toBe(false);
  });
});
