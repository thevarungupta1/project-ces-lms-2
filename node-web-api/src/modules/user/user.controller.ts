import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      const userResponse = this.formatUserResponse(user);

      res.status(201).json(ResponseBuilder.success(userResponse, 'User created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      const userResponse = this.formatUserResponse(user);

      res.json(ResponseBuilder.success(userResponse));
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.role) filters.role = req.query.role;
      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
      if (req.query.search) {
        // Handle search separately
      }

      const result = await this.userService.getUsers(page, limit, filters);
      const usersResponse = result.data.map((user) => this.formatUserResponse(user));

      res.json(
        ResponseBuilder.paginated(usersResponse, result.page, result.limit, result.total)
      );
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.updateUser(id, req.body);
      const userResponse = this.formatUserResponse(user);

      res.json(ResponseBuilder.success(userResponse, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);

      res.json(ResponseBuilder.success(null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const user = await this.userService.getUserById(req.user.id);
      const userResponse = this.formatUserResponse(user);

      res.json(ResponseBuilder.success(userResponse));
    } catch (error) {
      next(error);
    }
  };

  private formatUserResponse(user: any) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      department: user.department,
      isActive: user.isActive,
      joinedDate: user.joinedDate,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

