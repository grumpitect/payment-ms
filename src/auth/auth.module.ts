import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from '../common/guards/PoliciesGuard';
import { CaslAbilityFactory } from './casl-ability.factory';

@Global()
@Module({
  providers: [
    CaslAbilityFactory,
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [CaslAbilityFactory],
})
export class AuthModule {}
