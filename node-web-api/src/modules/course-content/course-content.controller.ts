import { Request, Response, NextFunction } from 'express';
import { CourseContentService } from './course-content.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';

export class CourseContentController {
  private courseContentService: CourseContentService;

  constructor() {
    this.courseContentService = new CourseContentService();
  }

  createContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const content = await this.courseContentService.createContent(req.body);
      res.status(201).json(ResponseBuilder.success(content, 'Content created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const content = await this.courseContentService.getContentById(id);
      res.json(ResponseBuilder.success(content));
    } catch (error) {
      next(error);
    }
  };

  getContentByModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { moduleId } = req.params;
      const content = await this.courseContentService.getContentByModule(moduleId);
      res.json(ResponseBuilder.success(content));
    } catch (error) {
      next(error);
    }
  };

  updateContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const content = await this.courseContentService.updateContent(id, req.body);
      res.json(ResponseBuilder.success(content, 'Content updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.courseContentService.deleteContent(id);
      res.json(ResponseBuilder.success(null, 'Content deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

