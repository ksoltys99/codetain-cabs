import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import RequestWithUser from '../auth/requestWithUser.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from './role.enum';
import * as jwt from 'jsonwebtoken';

export const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();

      const decodedPayload: any = jwt.decode(request.cookies.Authentication);

      return decodedPayload.userRole === role;
    }
  }

  return mixin(RoleGuardMixin);
};
