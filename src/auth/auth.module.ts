import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EmailModule } from 'src/email/email.module';

import { AuthController } from './controllers/auth.controller';
import { GqlAuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MagicLoginStrategy } from './strategy/magic-login.strategy';
import { ACCESS_TOKEN_EXPIRES_IN_HOURS } from './utils/constants';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${ACCESS_TOKEN_EXPIRES_IN_HOURS}h`,
        },
      }),
      inject: [ConfigService],
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GqlAuthGuard,
    JwtStrategy,
    UserService,
    MagicLoginStrategy,
  ],
  exports: [AuthService, MagicLoginStrategy, GqlAuthGuard, UserService],
})
export class AuthModule {}
