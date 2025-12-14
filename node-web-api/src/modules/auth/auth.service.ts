import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../../core/http/ApiError';
import { hashPassword, comparePassword } from '../../core/utils/crypto';
import { AuthRepository } from './auth.repository';
import { IUser } from '../../models/User.model';
import { LoginInput, RegisterInput } from '../../schemas/auth.schema';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterInput): Promise<{ user: IUser; tokens: AuthTokens }> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await this.authRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || 'learner',
    } as any);

    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  async login(data: LoginInput): Promise<{ user: IUser; tokens: AuthTokens }> {
    const user = await this.authRepository.findByEmailWithPassword(data.email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is inactive');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret) as {
        id: string;
        email: string;
        role: string;
      };

      const user = await this.authRepository.findById(decoded.id);
      if (!user || !user.isActive) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw ApiError.unauthorized('Invalid refresh token');
    }
  }

  private generateTokens(user: IUser): AuthTokens {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn as string,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiresIn as string,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }
}

