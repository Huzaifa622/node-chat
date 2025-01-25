interface IApiError {
  statusCode: any;
  message: string;
  errors: string[];
  stack?: string;
  success: boolean;
}

class ApiError extends Error implements IApiError {
  statusCode: number;
  message: string;
  errors: string[];
  stack?: string;
  success: boolean;
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: string[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
