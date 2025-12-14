import { ApiError } from '../../core/http/ApiError';
import { CourseReviewRepository } from './course-review.repository';
import { ICourseReview } from '../../models/CourseReview.model';
import { CreateCourseReviewInput, UpdateCourseReviewInput } from '../../schemas/courseReview.schema';
import { Course } from '../../models/Course.model';

export class CourseReviewService {
  private courseReviewRepository: CourseReviewRepository;

  constructor() {
    this.courseReviewRepository = new CourseReviewRepository();
  }

  async createReview(data: CreateCourseReviewInput, userId: string): Promise<ICourseReview> {
    // Verify course exists
    const course = await Course.findById(data.course);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    // Check if user already reviewed this course
    const existing = await this.courseReviewRepository.findByCourseAndUser(data.course, userId);
    if (existing) {
      throw ApiError.conflict('You have already reviewed this course');
    }

    return this.courseReviewRepository.create({
      ...data,
      user: userId,
    } as any);
  }

  async getReviewById(id: string): Promise<ICourseReview> {
    const review = await this.courseReviewRepository.findById(id);
    if (!review) {
      throw ApiError.notFound('Review not found');
    }
    return review;
  }

  async getReviewsByCourse(courseId: string, page: number = 1, limit: number = 10) {
    const filters = { course: courseId };
    const { data, total } = await this.courseReviewRepository.findWithPagination(
      filters,
      page,
      limit,
      { createdAt: -1 }
    );
    return { data, total, page, limit };
  }

  async getAverageRating(courseId: string): Promise<number> {
    return this.courseReviewRepository.getAverageRating(courseId);
  }

  async updateReview(id: string, data: UpdateCourseReviewInput, userId: string): Promise<ICourseReview> {
    const review = await this.courseReviewRepository.findById(id);
    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    // Verify user owns the review
    if (review.user.toString() !== userId) {
      throw ApiError.forbidden('You can only update your own reviews');
    }

    const updated = await this.courseReviewRepository.updateById(id, data);
    if (!updated) {
      throw ApiError.notFound('Review not found');
    }
    return updated;
  }

  async deleteReview(id: string, userId: string): Promise<boolean> {
    const review = await this.courseReviewRepository.findById(id);
    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    // Verify user owns the review or is admin
    if (review.user.toString() !== userId) {
      throw ApiError.forbidden('You can only delete your own reviews');
    }

    const deleted = await this.courseReviewRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Review not found');
    }
    return deleted;
  }
}

