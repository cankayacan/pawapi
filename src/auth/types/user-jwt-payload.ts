import { Role } from 'src/auth/types/role';

export interface UserJwtPayload {
  sub: string;
  email: string;
  roles: Role[];
}
