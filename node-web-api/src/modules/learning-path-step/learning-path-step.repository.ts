import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { LearningPathStep, ILearningPathStep } from '../../models/LearningPathStep.model';

export class LearningPathStepRepository extends BaseRepository<ILearningPathStep> {
  constructor() {
    super(LearningPathStep);
  }

  async findByLearningPath(learningPathId: string) {
    return this.find({ learningPath: learningPathId }, { sort: { stepOrder: 1 } });
  }
}

