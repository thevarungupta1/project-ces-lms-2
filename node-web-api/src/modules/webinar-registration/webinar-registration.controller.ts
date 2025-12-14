import { Request, Response, NextFunction } from 'express';
import { WebinarRegistrationService } from './webinar-registration.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class WebinarRegistrationController {
  private webinarRegistrationService: WebinarRegistrationService;

  constructor() {
    this.webinarRegistrationService = new WebinarRegistrationService();
  }

  register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const registration = await this.webinarRegistrationService.register(req.body, req.user.id);
      res.status(201).json(ResponseBuilder.success(registration, 'Registered for webinar successfully'));
    } catch (error) {
      next(error);
    }
  };

  getRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const registration = await this.webinarRegistrationService.getRegistrationById(id);
      res.json(ResponseBuilder.success(registration));
    } catch (error) {
      next(error);
    }
  };

  getRegistrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.webinar) filters.webinar = req.query.webinar;
      if (req.query.user) filters.user = req.query.user;

      const result = await this.webinarRegistrationService.getRegistrations(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  updateAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { attended } = req.body;
      const registration = await this.webinarRegistrationService.updateAttendance(id, attended);
      res.json(ResponseBuilder.success(registration, 'Attendance updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  cancelRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.webinarRegistrationService.cancelRegistration(id);
      res.json(ResponseBuilder.success(null, 'Registration cancelled successfully'));
    } catch (error) {
      next(error);
    }
  };
}

