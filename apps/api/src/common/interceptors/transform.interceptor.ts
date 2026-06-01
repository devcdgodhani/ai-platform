import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import type { ApiResponse } from '@ai-platform/shared-types';

/**
 * Wraps all successful responses in ApiResponse<T>.
 * Applied globally — controllers return plain data, interceptor wraps it.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const requestId = uuid();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}
