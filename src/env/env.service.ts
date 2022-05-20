import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const toBoolean = (input: string) => {
  if (!input) {
    return false;
  }

  const isTrue = input.toLocaleLowerCase() === 'true';

  return isTrue;
};

interface MongoConfig {
  readonly type: 'mongodb';
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
  readonly authSource: string;
  readonly useUnifiedTopology: boolean;
  readonly autoLoadEntities: boolean;
}

interface MockUser {
  readonly id: number;
  readonly isAdmin: boolean;
}

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  readonly isProduction: boolean =
    this.configService.get<string>('NODE_ENV') === 'production';

  readonly httpPort: number = Number(
    this.configService.get<string>('HTTP_PORT'),
  );

  readonly autoSeed: boolean = toBoolean(
    this.configService.get<string>('AUTO_SEED'),
  );

  readonly shouldMockUser: boolean = toBoolean(
    this.configService.get<string>('SHOULD_MOCK_USER'),
  );

  readonly mongo: MongoConfig = {
    type: 'mongodb',
    useUnifiedTopology: true,
    autoLoadEntities: true,
    host: this.configService.get<string>('MONGO_HOST'),
    port: Number(this.configService.get<string>('MONGO_PORT')),
    database: this.configService.get<string>('MONGO_DATABASE'),
    username: this.configService.get<string>('MONGO_USERNAME'),
    password: this.configService.get<string>('MONGO_PASSWORD'),
    authSource: this.configService.get<string>('MONGO_AUTH_SOURCE'),
  };

  readonly mockUser: MockUser = {
    id: Number(this.configService.get<string>('MOCK_USER_ID')),
    isAdmin: toBoolean(this.configService.get<string>('MOCK_USER_IS_ADMIN')),
  };
}
