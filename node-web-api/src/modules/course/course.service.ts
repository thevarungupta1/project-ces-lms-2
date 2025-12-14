import { ApiError } from '../../core/http/ApiError';
import { CourseRepository } from './course.repository';
import { ICourse } from '../../models/Course.model';
import { CreateCourseInput, UpdateCourseInput } from '../../schemas/course.schema';
import { User } from '../../models/User.model';
import { Category } from '../../models/Category.model';

export class CourseService {
  private courseRepository: CourseRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
  }

  async createCourse(data: CreateCourseInput): Promise<ICourse> {
    // Verify educator exists
    const educator = await User.findById(data.educator);
    if (!educator) {
      throw ApiError.notFound('Educator not found');
    }

    // Verify category exists
    const category = await Category.findById(data.category);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    return this.courseRepository.create(data as any);
  }

  async getCourseById(id: string): Promise<ICourse> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }
    return course;
  }

  async getCourses(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.courseRepository.findWithPagination(
      filters,
      page,
      limit,
      { createdAt: -1 }
    );
    return { data, total, page, limit };
  }

  async updateCourse(id: string, data: UpdateCourseInput): Promise<ICourse> {
    if (data.category) {
      const category = await Category.findById(data.category);
      if (!category) {
        throw ApiError.notFound('Category not found');
      }
    }

    const course = await this.courseRepository.updateById(id, data);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }
    return course;
  }

  async deleteCourse(id: string): Promise<boolean> {
    const deleted = await this.courseRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Course not found');
    }
    return deleted;
  }
}

