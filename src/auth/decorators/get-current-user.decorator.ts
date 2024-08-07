import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { ValidRoles } from "../enums/valid-roles.enum";

export const GetCurrentUser = createParamDecorator(
    (roles: ValidRoles[], context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        const user = request.user;

        if(!user) {
            throw new InternalServerErrorException('User not found in the request - (Are we using @AuthGuard?)');
        }

        if(roles && user.roles.some(role => !roles.includes(role as ValidRoles))) {
            throw new ForbiddenException('User does not have the required roles');
        }

        return user;
    },
);