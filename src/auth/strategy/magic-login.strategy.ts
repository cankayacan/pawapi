import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { Strategy } from 'passport-custom';

import { Role } from 'src/auth/types/role';
import { EmailService } from 'src/email/email.service';

import { UserService } from '../services/user.service';
import {
  MAGIC_LINK_EMAIL_CONTENT,
  MAGIC_LINK_EMAIL_SUBJECT,
} from '../utils/email-templates';
import { JwtPayload, decodeToken, generateToken } from './token';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(
  Strategy,
  'magiclogin',
) {
  private readonly logger = new Logger(MagicLoginStrategy.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {
    super();
  }

  async authenticate(req: Request) {
    try {
      const token = (req.query.token || req.body?.token) as string;
      const payload = decodeToken(process.env.JWT_SECRET!, token) as JwtPayload;
      const user = await this.validate(payload);

      if (!user) {
        this.fail({ message: 'User not found' }, 401);
      }

      this.success(user);
    } catch (error) {
      this.error(new UnauthorizedException(error.message));
    }
  }

  async send(payload: { destination: string; roles: Role[] }) {
    console.log('sending payload ', payload);

    const code = (Math.floor(Math.random() * 90000) + 10000).toString();

    const jwt = generateToken(process.env.JWT_SECRET!, {
      ...payload,
      code,
    });

    try {
      const callbackUrl = process.env.APP_CALLBACK_URL;

      const magicLinkUrl = `${callbackUrl}?token=${jwt}`;

      await this.sendLinkEmail(payload.destination, magicLinkUrl);
      this.logger.debug(
        `Sending email to ${payload.destination} with link ${magicLinkUrl}`,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async sendLinkEmail(to: string, href: string): Promise<void> {
    await this.emailService.sendEmail({
      from: 'noreply@pawimo.com',
      to,
      subject: MAGIC_LINK_EMAIL_SUBJECT,
      html: MAGIC_LINK_EMAIL_CONTENT.replaceAll('@@magicLink@@', href),
    });
  }

  async validate({ destination }: JwtPayload) {
    return this.userService.findOneByEmail(destination);
  }
}
