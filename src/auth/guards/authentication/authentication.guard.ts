import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthType } from 'src/auth/enums/auth-type-enum';
import { AccessTokenGuard } from '../access-token.guard';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  // This is a placeholder for the actual authentication logic.
  private static readonly defaultAuthType = AuthType.Bearer;

  //
  private authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;

  constructor(
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly reflector: Reflector, // This is used to read the metadata set by the @Auth decorator, which specifies the required authentication types for a route. Reflector allows the guard to determine which authentication guards to apply based on the route's metadata.
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(this.authTypeGuardMap);

    // get all and override means that it will look for the metadata in the current route handler and if it doesn't find it, it will look for it in the controller level. If it still doesn't find it, it will return the default auth type which is Bearer.
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      // [context.getHandler(), context.getClass()] means that it will look for the metadata in the current route handler and if it doesn't find it, it will look for it in the controller level. If it still doesn't find it, it will return the default auth type which is Bearer.
      [context.getHandler(), context.getClass()],
      // If there is no metadata found, it will return the default auth type which is Bearer.
    ) ?? [AuthenticationGuard.defaultAuthType];

    // .flat() is used to flatten the array of guards in case there are multiple auth types specified for a route. For example, if a route has both Bearer and None auth types, it will return an array of guards [AccessTokenGuard, { canActivate: () => true }], and .flat() will flatten it to [AccessTokenGuard, { canActivate: () => true }]. // If there is only one auth type specified, it will return an array with a single guard, and .flat() will not change it.
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    console.log('Resolved Guards:', guards);

    let error = new UnauthorizedException();

    for (const instance of guards) {
      console.log('Running Guard:', instance);

      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      console.log('Result:', canActivate);

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
