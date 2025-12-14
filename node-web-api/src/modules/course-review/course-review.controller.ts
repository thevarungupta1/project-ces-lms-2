import { Request, Response, NextFunction } from 'express';
import { CourseReviewService } from './course-review.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class CourseReviewController {
  private courseReviewService: CourseReviewService;

  constructor() {
    this.courseReviewService = new CourseReviewService();
  }

  createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const review = await this.courseReviewService.createReview(req.body, req.user.id);
      res.status(201).json(ResponseBuilder.success(review, 'Review created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const review = await this.courseReviewService.getReviewById(id);
      res.json(ResponseBuilder.success(review));
    } catch (error) {
      next(error);
    }
  };

  getReviewsByCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.courseReviewService.getReviewsByCourse(courseId, page, limit);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  getAverageRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId } = req.params;
      const average = await this.courseReviewService.getAverageRating(courseId);
      res.json(ResponseBuilder.success({ average, courseId }));
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const { id } = req.params;
      const review = await this.courseReviewService.updateReview(id, req.body, req.user.id);
      res.json(ResponseBuilder.success(review, 'Review updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const { id } = req.params;
      await this.courseReviewService.deleteReview(id, req.user.id);
      res.json(ResponseBuilder.success(null, 'Review deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

