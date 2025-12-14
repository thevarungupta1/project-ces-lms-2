import { ApiError } from '../../core/http/ApiError';
import { LearningPathRepository } from './learning-path.repository';
import { ILearningPath } from '../../models/LearningPath.model';
import { CreateLearningPathInput, UpdateLearningPathInput } from '../../schemas/learningPath.schema';
import { Category } from '../../models/Category.model';

export class LearningPathService {
  private learningPathRepository: LearningPathRepository;

  constructor() {
    this.learningPathRepository = new LearningPathRepository();
  }

  async createLearningPath(data: CreateLearningPathInput): Promise<ILearningPath> {
    // Verify category exists
    const category = await Category.findById(data.category);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    return this.learningPathRepository.create(data as any);
  }

  async getLearningPathById(id: string): Promise<ILearningPath> {
    const learningPath = await this.learningPathRepository.findById(id);
    if (!learningPath) {
      throw ApiError.notFound('Learning path not found');
    }
    return learningPath;
  }

  async getLearningPaths(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.learningPathRepository.findWithPagination(
      filters,
      page,
      limit,
      { createdAt: -1 }
    );
    return { data, total, page, limit };
  }

  async updateLearningPath(id: string, data: UpdateLearningPathInput): Promise<ILearningPath> {
    const learningPath = await this.learningPathRepository.updateById(id, data);
    if (!learningPath) {
      throw ApiError.notFound('Learning path not found');
    }
    return learningPath;
  }

  async deleteLearningPath(id: string): Promise<boolean> {
    const deleted = await this.learningPathRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Learning path not found');
    }
    return deleted;
  }
}

