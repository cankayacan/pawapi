import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

import { ErrorCode } from '../types/error-code';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    console.log('exception', exception);

    let errorCode = ErrorCode.INVALID_REQUEST;
    if (exceptionResponse instanceof Object) {
      errorCode =
        (exceptionResponse as any).errorCode ?? ErrorCode.INVALID_REQUEST;
    }

    response.status(status).json({
      errorCode,
      message: (exceptionResponse as any).message,
    });
  }
}
