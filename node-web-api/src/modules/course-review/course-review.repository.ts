import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { CourseReview, ICourseReview } from '../../models/CourseReview.model';

export class CourseReviewRepository extends BaseRepository<ICourseReview> {
  constructor() {
    super(CourseReview);
  }

  async findByCourse(courseId: string) {
    return this.find({ course: courseId }, { sort: { createdAt: -1 } });
  }

  async findByUser(userId: string) {
    return this.find({ user: userId });
  }

  async findByCourseAndUser(courseId: string, userId: string) {
    return this.findOne({ course: courseId, user: userId });
  }

  async getAverageRating(courseId: string): Promise<number> {
    const reviews = await this.findByCourse(courseId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }
}

