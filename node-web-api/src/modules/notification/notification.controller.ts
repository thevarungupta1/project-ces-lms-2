import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  createNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notification = await this.notificationService.createNotification(req.body);
      res.status(201).json(ResponseBuilder.success(notification, 'Notification created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const notification = await this.notificationService.getNotificationById(id);
      res.json(ResponseBuilder.success(notification));
    } catch (error) {
      next(error);
    }
  };

  getMyNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.notificationService.getNotificationsByUser(req.user.id, page, limit);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  getUnreadNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const notifications = await this.notificationService.getUnreadNotifications(req.user.id);
      res.json(ResponseBuilder.success(notifications));
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const count = await this.notificationService.getUnreadCount(req.user.id);
      res.json(ResponseBuilder.success({ count }));
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const notification = await this.notificationService.markAsRead(id);
      res.json(ResponseBuilder.success(notification, 'Notification marked as read'));
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const count = await this.notificationService.markAllAsRead(req.user.id);
      res.json(ResponseBuilder.success({ count }, `${count} notifications marked as read`));
    } catch (error) {
      next(error);
    }
  };

  deleteNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.notificationService.deleteNotification(id);
      res.json(ResponseBuilder.success(null, 'Notification deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

