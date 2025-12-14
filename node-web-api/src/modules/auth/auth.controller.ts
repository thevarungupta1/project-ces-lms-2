import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { ApiError } from '../../core/http/ApiError';
import { LoginInput, RegisterInput } from '../../schemas/auth.schema';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: RegisterInput = req.body;
      const result = await this.authService.register(data);

      const userResponse = {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        avatar: result.user.avatar,
        department: result.user.department,
        joinedDate: result.user.joinedDate,
      };

      res.status(201).json(
        ResponseBuilder.success(
          { user: userResponse, ...result.tokens },
          'User registered successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: LoginInput = req.body;
      const result = await this.authService.login(data);

      const userResponse = {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        avatar: result.user.avatar,
        department: result.user.department,
        joinedDate: result.user.joinedDate,
      };

      res.json(
        ResponseBuilder.success(
          { user: userResponse, ...result.tokens },
          'Login successful'
        )
      );
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw ApiError.badRequest('Refresh token is required');
      }

      const tokens = await this.authService.refreshToken(refreshToken);

      res.json(ResponseBuilder.success(tokens, 'Token refreshed successfully'));
    } catch (error) {
      next(error);
    }
  };
}

