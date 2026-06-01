import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import type { ApiResponse } from '@ai-platform/shared-types';
import { ErrorCode } from '@ai-platform/shared-types';
import { createLogger } from '@ai-platform/logger';

const logger = createLogger('api:exception-filter');

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{ status: (code: number) => { send: (body: unknown) => void } }>();
    const request = ctx.getRequest<{ method: string; url: string }>();

    const requestId = uuid();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorCode.INTERNAL_ERROR;
    let message = 'Internal server error';
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as Record<string, unknown>)['message'] as string ?? exception.message;

      code = this.mapHttpStatusToErrorCode(status);
      details = typeof exceptionResponse === 'object' ? exceptionResponse : undefined;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    logger.error(
      { requestId, status, method: request.method, url: request.url, err: exception },
      'Request failed',
    );

    const body: ApiResponse<never> = {
      success: false,
      error: { code, message, details, requestId },
      meta: { requestId, timestamp: new Date().toISOString() },
    };

    response.status(status).send(body);
  }

  private mapHttpStatusToErrorCode(status: number): ErrorCode {
    const map: Record<number, ErrorCode> = {
      400: ErrorCode.VALIDATION_ERROR,
      401: ErrorCode.UNAUTHORIZED,
      403: ErrorCode.FORBIDDEN,
      404: ErrorCode.NOT_FOUND,
      409: ErrorCode.CONFLICT,
      429: ErrorCode.AI_RATE_LIMITED,
      503: ErrorCode.SERVICE_UNAVAILABLE,
    };
    return map[status] ?? ErrorCode.INTERNAL_ERROR;
  }
}
