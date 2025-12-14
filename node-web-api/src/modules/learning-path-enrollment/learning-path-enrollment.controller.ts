import { Request, Response, NextFunction } from 'express';
import { LearningPathEnrollmentService } from './learning-path-enrollment.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class LearningPathEnrollmentController {
  private learningPathEnrollmentService: LearningPathEnrollmentService;

  constructor() {
    this.learningPathEnrollmentService = new LearningPathEnrollmentService();
  }

  enroll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const enrollment = await this.learningPathEnrollmentService.enroll(req.body, req.user.id);
      res.status(201).json(ResponseBuilder.success(enrollment, 'Enrolled in learning path successfully'));
    } catch (error) {
      next(error);
    }
  };

  getEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const enrollment = await this.learningPathEnrollmentService.getEnrollmentById(id);
      res.json(ResponseBuilder.success(enrollment));
    } catch (error) {
      next(error);
    }
  };

  getEnrollments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.learningPath) filters.learningPath = req.query.learningPath;
      if (req.query.user) filters.user = req.query.user;

      const result = await this.learningPathEnrollmentService.getEnrollments(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  updateProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { progress, currentStep } = req.body;
      const enrollment = await this.learningPathEnrollmentService.updateProgress(id, progress, currentStep);
      res.json(ResponseBuilder.success(enrollment, 'Progress updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.learningPathEnrollmentService.deleteEnrollment(id);
      res.json(ResponseBuilder.success(null, 'Enrollment cancelled successfully'));
    } catch (error) {
      next(error);
    }
  };
}

