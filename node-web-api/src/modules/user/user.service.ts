import { ApiError } from '../../core/http/ApiError';
import { UserRepository } from './user.repository';
import { IUser } from '../../models/User.model';
import { CreateUserInput, UpdateUserInput } from '../../schemas/user.schema';
import { hashPassword } from '../../core/utils/crypto';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: CreateUserInput): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    } as any);
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async getUsers(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.userRepository.findWithPagination(
      filters,
      page,
      limit
    );
    return { data, total, page, limit };
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<IUser> {
    const user = await this.userRepository.updateById(id, data);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('User not found');
    }
    return deleted;
  }
}

