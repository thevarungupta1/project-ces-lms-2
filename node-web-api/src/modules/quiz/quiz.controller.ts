import { Request, Response, NextFunction } from 'express';
import { QuizService } from './quiz.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
  }

  createQuiz = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const quiz = await this.quizService.createQuiz(req.body, req.user.id);
      res.status(201).json(ResponseBuilder.success(quiz, 'Quiz created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const quiz = await this.quizService.getQuizById(id);
      res.json(ResponseBuilder.success(quiz));
    } catch (error) {
      next(error);
    }
  };

  getQuizzes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.course) filters.course = req.query.course;
      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
      if (req.query.createdBy) filters.createdBy = req.query.createdBy;

      const result = await this.quizService.getQuizzes(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  updateQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const quiz = await this.quizService.updateQuiz(id, req.body);
      res.json(ResponseBuilder.success(quiz, 'Quiz updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.quizService.deleteQuiz(id);
      res.json(ResponseBuilder.success(null, 'Quiz deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  getQuizzesByCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId } = req.params;
      const quizzes = await this.quizService.getQuizzesByCourse(courseId);
      res.json(ResponseBuilder.success(quizzes));
    } catch (error) {
      next(error);
    }
  };
}

