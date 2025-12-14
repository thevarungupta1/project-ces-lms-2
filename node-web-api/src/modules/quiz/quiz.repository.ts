import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { Quiz, IQuiz } from '../../models/Quiz.model';

export class QuizRepository extends BaseRepository<IQuiz> {
  constructor() {
    super(Quiz);
  }

  async findByCourse(courseId: string) {
    return this.find({ course: courseId });
  }

  async findByCreator(createdBy: string) {
    return this.find({ createdBy });
  }

  async findActiveQuizzes() {
    return this.find({ isActive: true });
  }
}

