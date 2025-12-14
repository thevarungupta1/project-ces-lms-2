import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { CourseContent, ICourseContent } from '../../models/CourseContent.model';

export class CourseContentRepository extends BaseRepository<ICourseContent> {
  constructor() {
    super(CourseContent);
  }

  async findByModule(moduleId: string) {
    return this.find({ module: moduleId }, { sort: { order: 1 } });
  }

  async findByModuleOrdered(moduleId: string) {
    return this.find({ module: moduleId }, { sort: { order: 1 } });
  }
}

