import { TRole } from '../auth.interface';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';

export const Auth = (role: TRole = 'user') =>
  applyDecorators(
    role === 'admin' ? UseGuards(JwtGuard, AdminGuard) : UseGuards(JwtGuard),
  );
