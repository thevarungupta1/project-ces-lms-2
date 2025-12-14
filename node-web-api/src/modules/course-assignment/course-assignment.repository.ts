import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { CourseAssignment, ICourseAssignment } from '../../models/CourseAssignment.model';

export class CourseAssignmentRepository extends BaseRepository<ICourseAssignment> {
  constructor() {
    super(CourseAssignment);
  }

  async findByCourse(courseId: string) {
    return this.find({ course: courseId });
  }

  async findByLearner(learnerId: string) {
    return this.find({ learner: learnerId });
  }

  async findByLearnerAndCourse(learnerId: string, courseId: string) {
    return this.findOne({ learner: learnerId, course: courseId });
  }

  async findByGroup(groupId: string) {
    return this.find({ group: groupId });
  }

  async findByStatus(status: string) {
    return this.find({ status });
  }
}

