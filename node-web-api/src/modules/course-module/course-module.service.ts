import { ApiError } from '../../core/http/ApiError';
import { CourseModuleRepository } from './course-module.repository';
import { ICourseModule } from '../../models/CourseModule.model';
import { CreateCourseModuleInput, UpdateCourseModuleInput } from '../../schemas/courseModule.schema';
import { Course } from '../../models/Course.model';

export class CourseModuleService {
  private courseModuleRepository: CourseModuleRepository;

  constructor() {
    this.courseModuleRepository = new CourseModuleRepository();
  }

  async createModule(data: CreateCourseModuleInput): Promise<ICourseModule> {
    // Verify course exists
    const course = await Course.findById(data.course);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    return this.courseModuleRepository.create(data as any);
  }

  async getModuleById(id: string): Promise<ICourseModule> {
    const module = await this.courseModuleRepository.findById(id);
    if (!module) {
      throw ApiError.notFound('Module not found');
    }
    return module;
  }

  async getModulesByCourse(courseId: string): Promise<ICourseModule[]> {
    return this.courseModuleRepository.findByCourse(courseId);
  }

  async updateModule(id: string, data: UpdateCourseModuleInput): Promise<ICourseModule> {
    const module = await this.courseModuleRepository.updateById(id, data);
    if (!module) {
      throw ApiError.notFound('Module not found');
    }
    return module;
  }

  async deleteModule(id: string): Promise<boolean> {
    const deleted = await this.courseModuleRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Module not found');
    }
    return deleted;
  }
}

