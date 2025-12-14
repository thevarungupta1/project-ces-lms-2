import { Request, Response, NextFunction } from 'express';
import { CourseAssignmentService } from './course-assignment.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class CourseAssignmentController {
  private courseAssignmentService: CourseAssignmentService;

  constructor() {
    this.courseAssignmentService = new CourseAssignmentService();
  }

  createAssignment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const assignment = await this.courseAssignmentService.createAssignment(req.body, req.user.id);
      res.status(201).json(ResponseBuilder.success(assignment, 'Course assigned successfully'));
    } catch (error) {
      next(error);
    }
  };

  assignToGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const { courseId, groupId } = req.params;
      const assignments = await this.courseAssignmentService.assignToGroup(
        courseId,
        groupId,
        req.user.id,
        req.body.dueDate
      );
      res.status(201).json(ResponseBuilder.success(assignments, 'Course assigned to group successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = await this.courseAssignmentService.getAssignmentById(id);
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

      if (req.query.course) filters.course = req.query.course;
      if (req.query.learner) filters.learner = req.query.learner;
      if (req.query.status) filters.status = req.query.status;
      if (req.query.group) filters.group = req.query.group;

      const result = await this.courseAssignmentService.getAssignments(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  updateProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { progress, status } = req.body;
      const assignment = await this.courseAssignmentService.updateProgress(id, progress, status);
      res.json(ResponseBuilder.success(assignment, 'Progress updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = await this.courseAssignmentService.updateAssignment(id, req.body);
      res.json(ResponseBuilder.success(assignment, 'Assignment updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.courseAssignmentService.deleteAssignment(id);
      res.json(ResponseBuilder.success(null, 'Assignment deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

