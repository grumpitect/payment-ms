import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';
import { DiscountModule } from './modules/discount/discount.module';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './database/seeders/seeder.module';

@Module({
  imports: [
    EnvModule,
    AuthModule,
    DiscountModule,
    SeederModule,
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => env.mongo,
    }),
  ],
})
export class AppModule {}
