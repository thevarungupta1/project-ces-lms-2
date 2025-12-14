import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { WebinarRegistration, IWebinarRegistration } from '../../models/WebinarRegistration.model';

export class WebinarRegistrationRepository extends BaseRepository<IWebinarRegistration> {
  constructor() {
    super(WebinarRegistration);
  }

  async findByWebinar(webinarId: string) {
    return this.find({ webinar: webinarId });
  }

  async findByUser(userId: string) {
    return this.find({ user: userId });
  }

  async findByWebinarAndUser(webinarId: string, userId: string) {
    return this.findOne({ webinar: webinarId, user: userId });
  }
}

