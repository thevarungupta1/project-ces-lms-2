import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { User, IUser } from '../../models/User.model';

export class AuthRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select('+password').exec();
  }
}

