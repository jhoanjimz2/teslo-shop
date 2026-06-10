
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard }                  from '@nestjs/passport';
import { ValidRoles }                 from '../interfaces';
import { UserRoleGuard }              from '../guards';
import { RoleProtected }              from './';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
  );
}
