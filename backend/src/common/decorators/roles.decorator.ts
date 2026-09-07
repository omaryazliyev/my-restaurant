import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Foydalanish: @Roles('ADMIN')  yoki  @Roles('ADMIN', 'CLIENT')
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
