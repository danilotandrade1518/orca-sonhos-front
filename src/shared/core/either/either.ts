export class Either<E, D> {
  private _data: D | undefined;
  private _errors: E[] = [];

  addError(error: E) {
    this._errors.push(error);
  }

  addManyErrors(errors: E[]) {
    errors.forEach((error) => this.addError(error));
  }

  setData(data: D) {
    this._data = data;
  }

  get hasError(): boolean {
    return this._errors.length > 0;
  }

  get hasData(): boolean {
    return !this.hasError && this._data !== undefined;
  }

  get data() {
    if (this.hasError || !this.hasData) return null;
    return this._data;
  }

  get errors() {
    return this._errors;
  }

  static success<E, D>(data?: D): Either<E, D> {
    const either = new Either<E, D>();
    either.setData(data as D);
    return either;
  }

  static error<E, D>(error: E): Either<E, D> {
    const either = new Either<E, D>();
    either.addError(error);
    return either;
  }

  static errors<E, D>(errors: E[]): Either<E, D> {
    const either = new Either<E, D>();
    either.addManyErrors(errors);
    return either;
  }
}
