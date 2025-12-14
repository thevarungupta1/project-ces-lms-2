import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { User, IUser } from '../../models/User.model';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async searchUsers(searchTerm: string, filter: any = {}) {
    const searchRegex = { $regex: searchTerm, $options: 'i' };
    const searchFilter = {
      ...filter,
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
      ],
    };
    return this.find(searchFilter);
  }
}

