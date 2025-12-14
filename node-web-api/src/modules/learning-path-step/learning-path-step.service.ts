import { ApiError } from '../../core/http/ApiError';
import { LearningPathStepRepository } from './learning-path-step.repository';
import { ILearningPathStep } from '../../models/LearningPathStep.model';
import { CreateLearningPathStepInput, UpdateLearningPathStepInput } from '../../schemas/learningPathStep.schema';
import { LearningPath } from '../../models/LearningPath.model';
import { Course } from '../../models/Course.model';
import { Webinar } from '../../models/Webinar.model';
import { Quiz } from '../../models/Quiz.model';

export class LearningPathStepService {
  private learningPathStepRepository: LearningPathStepRepository;

  constructor() {
    this.learningPathStepRepository = new LearningPathStepRepository();
  }

  async createStep(data: CreateLearningPathStepInput): Promise<ILearningPathStep> {
    // Verify learning path exists
    const learningPath = await LearningPath.findById(data.learningPath);
    if (!learningPath) {
      throw ApiError.notFound('Learning path not found');
    }

    // Verify referenced entity based on step type
    if (data.stepType === 'course' && data.course) {
      const course = await Course.findById(data.course);
      if (!course) {
        throw ApiError.notFound('Course not found');
      }
    }

    if (data.stepType === 'webinar' && data.webinar) {
      const webinar = await Webinar.findById(data.webinar);
      if (!webinar) {
        throw ApiError.notFound('Webinar not found');
      }
    }

    if (data.stepType === 'quiz' && data.quiz) {
      const quiz = await Quiz.findById(data.quiz);
      if (!quiz) {
        throw ApiError.notFound('Quiz not found');
      }
    }

    return this.learningPathStepRepository.create(data as any);
  }

  async getStepById(id: string): Promise<ILearningPathStep> {
    const step = await this.learningPathStepRepository.findById(id);
    if (!step) {
      throw ApiError.notFound('Step not found');
    }
    return step;
  }

  async getStepsByLearningPath(learningPathId: string): Promise<ILearningPathStep[]> {
    return this.learningPathStepRepository.findByLearningPath(learningPathId);
  }

  async updateStep(id: string, data: UpdateLearningPathStepInput): Promise<ILearningPathStep> {
    const step = await this.learningPathStepRepository.updateById(id, data);
    if (!step) {
      throw ApiError.notFound('Step not found');
    }
    return step;
  }

  async deleteStep(id: string): Promise<boolean> {
    const deleted = await this.learningPathStepRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Step not found');
    }
    return deleted;
  }
}

