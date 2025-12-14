import { Request, Response, NextFunction } from 'express';
import { CourseService } from './course.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';

export class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course = await this.courseService.createCourse(req.body);
      res.status(201).json(ResponseBuilder.success(course, 'Course created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const course = await this.courseService.getCourseById(id);
      res.json(ResponseBuilder.success(course));
    } catch (error) {
      next(error);
    }
  };

  getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.category) filters.category = req.query.category;
      if (req.query.status) filters.status = req.query.status;
      if (req.query.level) filters.level = req.query.level;
      if (req.query.educator) filters.educator = req.query.educator;

      const result = await this.courseService.getCourses(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const course = await this.courseService.updateCourse(id, req.body);
      res.json(ResponseBuilder.success(course, 'Course updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.courseService.deleteCourse(id);
      res.json(ResponseBuilder.success(null, 'Course deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

