import { Request, Response, NextFunction } from 'express';
import { GroupService } from './group.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class GroupController {
  private groupService: GroupService;

  constructor() {
    this.groupService = new GroupService();
  }

  createGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const group = await this.groupService.createGroup(req.body, req.user.id);
      res.status(201).json(ResponseBuilder.success(group, 'Group created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const group = await this.groupService.getGroupById(id);
      res.json(ResponseBuilder.success(group));
    } catch (error) {
      next(error);
    }
  };

  getGroups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
      if (req.query.createdBy) filters.createdBy = req.query.createdBy;

      const result = await this.groupService.getGroups(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  updateGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const group = await this.groupService.updateGroup(id, req.body);
      res.json(ResponseBuilder.success(group, 'Group updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.groupService.deleteGroup(id);
      res.json(ResponseBuilder.success(null, 'Group deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, memberId } = req.params;
      const group = await this.groupService.addMember(id, memberId);
      res.json(ResponseBuilder.success(group, 'Member added successfully'));
    } catch (error) {
      next(error);
    }
  };

  removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, memberId } = req.params;
      const group = await this.groupService.removeMember(id, memberId);
      res.json(ResponseBuilder.success(group, 'Member removed successfully'));
    } catch (error) {
      next(error);
    }
  };
}

