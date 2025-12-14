import { Request, Response, NextFunction } from 'express';
import { LearningPathService } from './learning-path.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';

export class LearningPathController {
  private learningPathService: LearningPathService;

  constructor() {
    this.learningPathService = new LearningPathService();
  }

  createLearningPath = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const learningPath = await this.learningPathService.createLearningPath(req.body);
      res.status(201).json(ResponseBuilder.success(learningPath, 'Learning path created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getLearningPath = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const learningPath = await this.learningPathService.getLearningPathById(id);
      res.json(ResponseBuilder.success(learningPath));
    } catch (error) {
      next(error);
    }
  };

  getLearningPaths = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.category) filters.category = req.query.category;
      if (req.query.difficultyLevel) filters.difficultyLevel = req.query.difficultyLevel;
      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

      const result = await this.learningPathService.getLearningPaths(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  updateLearningPath = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const learningPath = await this.learningPathService.updateLearningPath(id, req.body);
      res.json(ResponseBuilder.success(learningPath, 'Learning path updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteLearningPath = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.learningPathService.deleteLearningPath(id);
      res.json(ResponseBuilder.success(null, 'Learning path deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

