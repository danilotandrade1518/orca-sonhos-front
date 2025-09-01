// Simple UUID value object with basic validation
export class Uuid {
  private constructor(private readonly _value: string) {}

  static create(value: string): Uuid {
    if (!Uuid.isValid(value)) throw new Error('Invalid UUID');
    return new Uuid(value);
  }

  static isValid(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    // Accept any RFC4122-like UUID format
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return re.test(value);
  }

  toString(): string {
    return this._value;
  }
}
