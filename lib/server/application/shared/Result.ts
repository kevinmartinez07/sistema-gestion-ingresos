/** Result Pattern for explicit success/error handling */
export class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: string,
    private readonly _errors?: string[]
  ) {}

  // Getters
  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value!;
  }

  get error(): string {
    return this._error || '';
  }

  get errors(): string[] {
    return this._errors || [];
  }

  // Factory methods
  static ok<U>(value: U): Result<U> {
    return new Result<U>(true, value);
  }

  static fail<U>(error: string): Result<U> {
    return new Result<U>(false, undefined, error, [error]);
  }

  static failWithErrors<U>(errors: string[]): Result<U> {
    return new Result<U>(false, undefined, errors[0], errors);
  }
}
