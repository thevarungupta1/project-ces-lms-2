import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { QuizAssignment, IQuizAssignment } from '../../models/QuizAssignment.model';

export class QuizAssignmentRepository extends BaseRepository<IQuizAssignment> {
  constructor() {
    super(QuizAssignment);
  }

  async findByQuiz(quizId: string) {
    return this.find({ quiz: quizId });
  }

  async findByLearner(learnerId: string) {
    return this.find({ learner: learnerId });
  }

  async findByLearnerAndQuiz(learnerId: string, quizId: string) {
    return this.findOne({ learner: learnerId, quiz: quizId });
  }

  async findByGroup(groupId: string) {
    return this.find({ group: groupId });
  }
}

