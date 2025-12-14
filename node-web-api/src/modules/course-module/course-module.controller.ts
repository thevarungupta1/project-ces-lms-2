import { Request, Response, NextFunction } from 'express';
import { CourseModuleService } from './course-module.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';

export class CourseModuleController {
  private courseModuleService: CourseModuleService;

  constructor() {
    this.courseModuleService = new CourseModuleService();
  }

  createModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const module = await this.courseModuleService.createModule(req.body);
      res.status(201).json(ResponseBuilder.success(module, 'Module created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const module = await this.courseModuleService.getModuleById(id);
      res.json(ResponseBuilder.success(module));
    } catch (error) {
      next(error);
    }
  };

  getModulesByCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId } = req.params;
      const modules = await this.courseModuleService.getModulesByCourse(courseId);
      res.json(ResponseBuilder.success(modules));
    } catch (error) {
      next(error);
    }
  };

  updateModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const module = await this.courseModuleService.updateModule(id, req.body);
      res.json(ResponseBuilder.success(module, 'Module updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.courseModuleService.deleteModule(id);
      res.json(ResponseBuilder.success(null, 'Module deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

