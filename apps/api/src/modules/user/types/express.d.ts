import { User } from '../../shared/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
