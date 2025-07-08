import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RequestWithUser } from 'src/auth/types/request-with-user';

import { AuthCallbackResponseDto } from '../dto/auth-callback-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    await this.authService.login(loginRequestDto.email);
  }

  @UseGuards(AuthGuard('magiclogin'))
  @Get('callback')
  callback(@Req() req: RequestWithUser): AuthCallbackResponseDto {
    // req.user is set by the MagicLoginStrategy.validate method
    return this.authService.generateTokens(req.user);
  }

  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthCallbackResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
