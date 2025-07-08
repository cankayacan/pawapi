import {
  ConflictException,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Role } from 'src/auth/types/role';

import { AuthCallbackResponseDto } from '../dto/auth-callback-response.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { MagicLoginStrategy } from '../strategy/magic-login.strategy';
import { ErrorCode } from '../types/error-code';
import { UserJwtPayload } from '../types/user-jwt-payload';
import {
  ACCESS_TOKEN_EXPIRES_IN_HOURS,
  REFRESH_TOKEN_EXPIRES_IN_DAYS,
} from '../utils/constants';
import { UserService } from './user.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private magicLoginStrategy: MagicLoginStrategy,
  ) {}

  async login(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const result = await this.magicLoginStrategy.send({
      destination: email,
      roles: user.roles as Role[],
    });

    return result;
  }

  async register(user: CreateUserDto, roles: Role[]) {
    try {
      const createdUser = await this.userService.create(user);

      // No need for this as we are not allowing login
      // TODO: enable this when we have the apps ready
      // & change the email content for users registering via web
      // await this.magicLoginStrategy.send({
      //   destination: user.email,
      //   roles,
      // });

      return createdUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException({
          errorCode: ErrorCode.USER_DUPLICATE,
          message: 'User with this email or mobile number already exists',
        });
      }
      throw error;
    }
  }

  generateTokens(user: {
    id: string;
    email: string;
    roles: Role[];
  }): AuthCallbackResponseDto {
    const payload: UserJwtPayload = {
      sub: user.id.toString(),
      email: user.email,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${ACCESS_TOKEN_EXPIRES_IN_HOURS}h`,
    });

    const expiresInDate = new Date();
    expiresInDate.setHours(
      expiresInDate.getHours() + ACCESS_TOKEN_EXPIRES_IN_HOURS,
    );

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
    });

    return {
      accessToken: accessToken,
      expiresIn: expiresInDate,
      refreshToken: refreshToken,
      userId: user.id.toString(),
      roles: user.roles,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthCallbackResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findOneByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException();
      }

      return this.generateTokens({
        id: user.id,
        email: user.email,
        roles: user.roles as Role[],
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
