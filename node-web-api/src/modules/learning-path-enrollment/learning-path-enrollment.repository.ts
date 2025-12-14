import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { LearningPathEnrollment, ILearningPathEnrollment } from '../../models/LearningPathEnrollment.model';

export class LearningPathEnrollmentRepository extends BaseRepository<ILearningPathEnrollment> {
  constructor() {
    super(LearningPathEnrollment);
  }

  async findByLearningPath(learningPathId: string) {
    return this.find({ learningPath: learningPathId });
  }

  async findByUser(userId: string) {
    return this.find({ user: userId });
  }

  async findByLearningPathAndUser(learningPathId: string, userId: string) {
    return this.findOne({ learningPath: learningPathId, user: userId });
  }
}

