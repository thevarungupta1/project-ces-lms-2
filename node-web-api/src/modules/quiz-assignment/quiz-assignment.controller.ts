import { Request, Response, NextFunction } from 'express';
import { QuizAssignmentService } from './quiz-assignment.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';
import { Quiz } from '../../models/Quiz.model';

export class QuizAssignmentController {
  private quizAssignmentService: QuizAssignmentService;

  constructor() {
    this.quizAssignmentService = new QuizAssignmentService();
  }

  createAssignment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const assignment = await this.quizAssignmentService.createAssignment(req.body, req.user.id);
      res.status(201).json(ResponseBuilder.success(assignment, 'Quiz assigned successfully'));
    } catch (error) {
      next(error);
    }
  };

  assignToGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const { quizId, groupId } = req.params;
      const assignments = await this.quizAssignmentService.assignToGroup(
        quizId,
        groupId,
        req.user.id,
        req.body.dueDate
      );
      res.status(201).json(ResponseBuilder.success(assignments, 'Quiz assigned to group successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = await this.quizAssignmentService.getAssignmentById(id);
      res.json(ResponseBuilder.success(assignment));
    } catch (error) {
      next(error);
    }
  };

  getAssignments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.quiz) filters.quiz = req.query.quiz;
      if (req.query.learner) filters.learner = req.query.learner;
      if (req.query.status) filters.status = req.query.status;
      if (req.query.group) filters.group = req.query.group;

      const result = await this.quizAssignmentService.getAssignments(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  submitQuiz = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = await this.quizAssignmentService.getAssignmentById(id);
      const quiz = await Quiz.findById(assignment.quiz);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      const result = await this.quizAssignmentService.submitQuiz(id, req.body, quiz);
      res.json(ResponseBuilder.success(result, 'Quiz submitted successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = await this.quizAssignmentService.updateAssignment(id, req.body);
      res.json(ResponseBuilder.success(assignment, 'Assignment updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.quizAssignmentService.deleteAssignment(id);
      res.json(ResponseBuilder.success(null, 'Assignment deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

