import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { LearningPath, ILearningPath } from '../../models/LearningPath.model';

export class LearningPathRepository extends BaseRepository<ILearningPath> {
  constructor() {
    super(LearningPath);
  }

  async findByCategory(categoryId: string) {
    return this.find({ category: categoryId });
  }

  async findActivePaths() {
    return this.find({ isActive: true });
  }

  async findByDifficultyLevel(level: string) {
    return this.find({ difficultyLevel: level });
  }
}

