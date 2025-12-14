import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from './announcement.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class AnnouncementController {
  private announcementService: AnnouncementService;

  constructor() {
    this.announcementService = new AnnouncementService();
  }

  createAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const announcement = await this.announcementService.createAnnouncement(req.body, req.user.id);
      res.status(201).json(ResponseBuilder.success(announcement, 'Announcement created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const announcement = await this.announcementService.getAnnouncementById(id);
      res.json(ResponseBuilder.success(announcement));
    } catch (error) {
      next(error);
    }
  };

  getAnnouncements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
      if (req.query.targetAudience) filters.targetAudience = req.query.targetAudience;

      const result = await this.announcementService.getAnnouncements(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  getActiveAnnouncements = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const announcements = await this.announcementService.getActiveAnnouncements();
      res.json(ResponseBuilder.success(announcements));
    } catch (error) {
      next(error);
    }
  };

  updateAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const announcement = await this.announcementService.updateAnnouncement(id, req.body);
      res.json(ResponseBuilder.success(announcement, 'Announcement updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.announcementService.deleteAnnouncement(id);
      res.json(ResponseBuilder.success(null, 'Announcement deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

