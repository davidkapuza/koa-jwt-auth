export default class ApiError extends Error {
  private _statusCode: number;
  private _errors?: string[] = [];

  constructor(statusCode: number, message: string, errors?: string[]) {
    super(message);
    this._statusCode = statusCode;
    this._errors = errors;
  }

  get statusCode() {
    return this._statusCode;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Unauthorized");
  }

  static BadRequest(message: string, errors: string[] = []) {
    return new ApiError(400, message, errors);
  }

  toObject(): Object {
    return {
      statusCode: this._statusCode,
      message: this.message,
      errors: this._errors,
    };
  }
}
