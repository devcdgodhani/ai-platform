import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { UserProfile } from '@ai-platform/shared-types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserProfile => {
    const request = ctx.switchToHttp().getRequest<{ user: UserProfile }>();
    return request.user;
  },
);
