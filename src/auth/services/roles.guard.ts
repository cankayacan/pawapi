// roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { HAS_ROLES_KEY } from '../utils/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      HAS_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const user = this.getUserFromContext(context);

    if (!user || !user.roles) {
      return false;
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    return hasRole;
  }

  private getUserFromContext(context: ExecutionContext): any {
    const contextType = context.getType<string>();

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest();
      return request.user;
    } else if (contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req.user;
    }

    return null;
  }
}
