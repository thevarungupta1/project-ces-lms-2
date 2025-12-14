import { ApiError } from '../../core/http/ApiError';
import { CourseContentRepository } from './course-content.repository';
import { ICourseContent } from '../../models/CourseContent.model';
import { CreateCourseContentInput, UpdateCourseContentInput } from '../../schemas/courseContent.schema';
import { CourseModule } from '../../models/CourseModule.model';

export class CourseContentService {
  private courseContentRepository: CourseContentRepository;

  constructor() {
    this.courseContentRepository = new CourseContentRepository();
  }

  async createContent(data: CreateCourseContentInput): Promise<ICourseContent> {
    // Verify module exists
    const module = await CourseModule.findById(data.module);
    if (!module) {
      throw ApiError.notFound('Module not found');
    }

    // Validate content based on type
    if (data.contentType === 'video' || data.contentType === 'document' || data.contentType === 'link') {
      if (!data.contentUrl) {
        throw ApiError.badRequest(`${data.contentType} requires contentUrl`);
      }
    }

    if (data.contentType === 'quiz' || data.contentType === 'assignment') {
      // These might reference other entities
    }

    return this.courseContentRepository.create(data as any);
  }

  async getContentById(id: string): Promise<ICourseContent> {
    const content = await this.courseContentRepository.findById(id);
    if (!content) {
      throw ApiError.notFound('Content not found');
    }
    return content;
  }

  async getContentByModule(moduleId: string): Promise<ICourseContent[]> {
    return this.courseContentRepository.findByModule(moduleId);
  }

  async updateContent(id: string, data: UpdateCourseContentInput): Promise<ICourseContent> {
    const content = await this.courseContentRepository.updateById(id, data);
    if (!content) {
      throw ApiError.notFound('Content not found');
    }
    return content;
  }

  async deleteContent(id: string): Promise<boolean> {
    const deleted = await this.courseContentRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Content not found');
    }
    return deleted;
  }
}

