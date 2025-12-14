import { Request, Response, NextFunction } from 'express';
import { LearningPathStepService } from './learning-path-step.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';

export class LearningPathStepController {
  private learningPathStepService: LearningPathStepService;

  constructor() {
    this.learningPathStepService = new LearningPathStepService();
  }

  createStep = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const step = await this.learningPathStepService.createStep(req.body);
      res.status(201).json(ResponseBuilder.success(step, 'Step created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getStep = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const step = await this.learningPathStepService.getStepById(id);
      res.json(ResponseBuilder.success(step));
    } catch (error) {
      next(error);
    }
  };

  getStepsByLearningPath = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { learningPathId } = req.params;
      const steps = await this.learningPathStepService.getStepsByLearningPath(learningPathId);
      res.json(ResponseBuilder.success(steps));
    } catch (error) {
      next(error);
    }
  };

  updateStep = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const step = await this.learningPathStepService.updateStep(id, req.body);
      res.json(ResponseBuilder.success(step, 'Step updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteStep = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.learningPathStepService.deleteStep(id);
      res.json(ResponseBuilder.success(null, 'Step deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

