import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';

const envName = process.env.NODE_ENV || 'development'; // use development environment name for local development

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      // in this array, files which go first take precedece
      // use ".env.local" file to set any local specific environemnt variables
      envFilePath: ['envs/.env.local', `envs/.env.${envName}`],
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
