import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // @Roles() qo'yilmagan bo'lsa - hammaga ochiq

    const { user } = context.switchToHttp().getRequest();
    // TODO: JwtStrategy orqali user.role to'g'ri kelayotganini tekshirish
    return requiredRoles.includes(user?.role);
  }
}
