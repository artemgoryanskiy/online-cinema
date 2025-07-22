import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from '../user.schema';

interface RequestWithUser {
  user: UserEntity;
}

type TypeData = keyof UserEntity;

export const CurrentUser = createParamDecorator(
  (
    data: TypeData,
    ctx: ExecutionContext,
  ): UserEntity | UserEntity[TypeData] => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    return data ? user[data] : user;
  },
);
