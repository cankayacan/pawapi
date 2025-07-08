import { Role } from 'src/auth/types/role';

export interface AuthCallbackResponseDto {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: Date;
  roles: Role[];
}
