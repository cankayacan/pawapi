import { SetMetadata } from '@nestjs/common';

export const HAS_ROLES_KEY = 'hasRoles';
export const HasRoles = (...roles: string[]) =>
  SetMetadata(HAS_ROLES_KEY, roles);
