import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../common/types/action';
import { Subject } from '../common/types/subject';
import { User } from '../common/types/user';

export type AppAbility = Ability<[Action, Subject]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subject]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.isAdmin) {
      can(Action.Manage, Subject.All); // read-write access to everything
    } else {
      can(Action.Read, Subject.All); // read-only access to everything
    }

    return build();
  }
}
