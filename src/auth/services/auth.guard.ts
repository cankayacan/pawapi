import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }

  handleRequest(err: Error, user: any): any {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'You are not authorized to access this resource',
        )
      );
    }
    return user;
  }
}
