import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { IssuedCertificate, IIssuedCertificate } from '../../models/IssuedCertificate.model';

export class IssuedCertificateRepository extends BaseRepository<IIssuedCertificate> {
  constructor() {
    super(IssuedCertificate);
  }

  async findByCourse(courseId: string) {
    return this.find({ course: courseId });
  }

  async findByLearner(learnerId: string) {
    return this.find({ learner: learnerId });
  }

  async findByCertificateNumber(certificateNumber: string) {
    return this.findOne({ certificateNumber });
  }

  async findByCourseAndLearner(courseId: string, learnerId: string) {
    return this.findOne({ course: courseId, learner: learnerId });
  }
}

