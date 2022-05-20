import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AppAbility,
  CaslAbilityFactory,
} from '../../auth/casl-ability.factory';
import { EnvService } from '../../env/env.service';
import { CHECK_POLICIES_KEY } from '../decorators/CheckPolicies';
import { User } from '../types/user';

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private env: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    let user: User;
    if (this.env.shouldMockUser) {
      user = this.env.mockUser;
    } else {
      const { user: contextUser } = context.switchToHttp().getRequest();
      user = contextUser;
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    // this is here to force developers to put this Guard on every route
    if (!policyHandlers.length) {
      throw new UnauthorizedException();
    }

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
