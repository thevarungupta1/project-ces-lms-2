import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { Course, ICourse } from '../../models/Course.model';

export class CourseRepository extends BaseRepository<ICourse> {
  constructor() {
    super(Course);
  }

  async findByEducator(educatorId: string) {
    return this.find({ educator: educatorId });
  }

  async findByCategory(categoryId: string) {
    return this.find({ category: categoryId });
  }

  async searchCourses(searchTerm: string, filter: any = {}) {
    const searchFilter = {
      ...filter,
      $text: { $search: searchTerm },
    };
    return this.find(searchFilter);
  }
}

