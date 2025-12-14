import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { CourseModule, ICourseModule } from '../../models/CourseModule.model';

export class CourseModuleRepository extends BaseRepository<ICourseModule> {
  constructor() {
    super(CourseModule);
  }

  async findByCourse(courseId: string) {
    return this.find({ course: courseId }, { sort: { moduleOrder: 1 } });
  }

  async findByCourseOrdered(courseId: string) {
    return this.find({ course: courseId }, { sort: { moduleOrder: 1 } });
  }
}

