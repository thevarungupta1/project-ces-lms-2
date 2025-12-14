import { Request, Response, NextFunction } from 'express';
import { WebinarService } from './webinar.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';

export class WebinarController {
  private webinarService: WebinarService;

  constructor() {
    this.webinarService = new WebinarService();
  }

  createWebinar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const webinar = await this.webinarService.createWebinar(req.body);
      res.status(201).json(ResponseBuilder.success(webinar, 'Webinar created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getWebinar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const webinar = await this.webinarService.getWebinarById(id);
      res.json(ResponseBuilder.success(webinar));
    } catch (error) {
      next(error);
    }
  };

  getWebinars = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.host) filters.host = req.query.host;
      if (req.query.category) filters.category = req.query.category;
      if (req.query.status) filters.status = req.query.status;

      const result = await this.webinarService.getWebinars(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  getUpcomingWebinars = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const webinars = await this.webinarService.getUpcomingWebinars();
      res.json(ResponseBuilder.success(webinars));
    } catch (error) {
      next(error);
    }
  };

  updateWebinar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const webinar = await this.webinarService.updateWebinar(id, req.body);
      res.json(ResponseBuilder.success(webinar, 'Webinar updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteWebinar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.webinarService.deleteWebinar(id);
      res.json(ResponseBuilder.success(null, 'Webinar deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

