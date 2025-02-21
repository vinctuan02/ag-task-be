import { HttpException, HttpStatus } from "@nestjs/common";

export class ErrorDetail {
  key: string;
  message: string;

  constructor(key: string, message: string) {
    this.key = key;
    this.message = message;
  }
}

export class ErrorResDto extends HttpException {
  statusCode: number;
  message: string;
  errorType?: string;
  errors?: ErrorDetail[];

  constructor(
    statusCode: number,
    message?: string,
    errorType?: string,
    errors?: ErrorDetail[]
  ) {

    const response = {
      statusCode,
      message: message || HttpStatus[statusCode] || 'Error',
      errorType,
      errors,
    };

    super(response, statusCode);

    this.statusCode = statusCode;
    this.message = response.message;
    this.errorType = errorType;
    this.errors = errors;
  }
}
