import { ApiError } from '../../core/http/ApiError';
import { LearningPathEnrollmentRepository } from './learning-path-enrollment.repository';
import { ILearningPathEnrollment } from '../../models/LearningPathEnrollment.model';
import { CreateLearningPathEnrollmentInput } from '../../schemas/learningPathEnrollment.schema';
import { LearningPath } from '../../models/LearningPath.model';
import { LearningPathStep } from '../../models/LearningPathStep.model';

export class LearningPathEnrollmentService {
  private learningPathEnrollmentRepository: LearningPathEnrollmentRepository;

  constructor() {
    this.learningPathEnrollmentRepository = new LearningPathEnrollmentRepository();
  }

  async enroll(data: CreateLearningPathEnrollmentInput, userId: string): Promise<ILearningPathEnrollment> {
    // Verify learning path exists and is active
    const learningPath = await LearningPath.findById(data.learningPath);
    if (!learningPath) {
      throw ApiError.notFound('Learning path not found');
    }
    if (!learningPath.isActive) {
      throw ApiError.badRequest('Learning path is not active');
    }

    // Check if already enrolled
    const existing = await this.learningPathEnrollmentRepository.findByLearningPathAndUser(data.learningPath, userId);
    if (existing) {
      throw ApiError.conflict('Already enrolled in this learning path');
    }

    // Get first step
    const firstStep = await LearningPathStep.findOne({ learningPath: data.learningPath }).sort({ stepOrder: 1 });

    return this.learningPathEnrollmentRepository.create({
      learningPath: data.learningPath,
      user: userId,
      enrolledAt: new Date(),
      startedAt: new Date(),
      progress: 0,
      currentStep: firstStep?._id,
    } as any);
  }

  async getEnrollmentById(id: string): Promise<ILearningPathEnrollment> {
    const enrollment = await this.learningPathEnrollmentRepository.findById(id);
    if (!enrollment) {
      throw ApiError.notFound('Enrollment not found');
    }
    return enrollment;
  }

  async getEnrollments(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.learningPathEnrollmentRepository.findWithPagination(
      filters,
      page,
      limit,
      { enrolledAt: -1 }
    );
    return { data, total, page, limit };
  }

  async updateProgress(id: string, progress: number, currentStep?: string): Promise<ILearningPathEnrollment> {
    const updateData: any = { progress };
    
    if (currentStep) {
      const step = await LearningPathStep.findById(currentStep);
      if (!step) {
        throw ApiError.notFound('Step not found');
      }
      updateData.currentStep = currentStep;
    }

    if (progress === 100) {
      updateData.completedAt = new Date();
    }

    const enrollment = await this.learningPathEnrollmentRepository.updateById(id, updateData);
    if (!enrollment) {
      throw ApiError.notFound('Enrollment not found');
    }
    return enrollment;
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    const deleted = await this.learningPathEnrollmentRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Enrollment not found');
    }
    return deleted;
  }
}

