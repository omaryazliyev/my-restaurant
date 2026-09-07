import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Foydalanish: @CurrentUser() user  (controller metodida)
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
