import { Role } from './role';

export interface RequestWithUser extends Request {
  user: { id: string; email: string; roles: Role[] };
}
