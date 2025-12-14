import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { Webinar, IWebinar } from '../../models/Webinar.model';

export class WebinarRepository extends BaseRepository<IWebinar> {
  constructor() {
    super(Webinar);
  }

  async findByHost(hostId: string) {
    return this.find({ host: hostId });
  }

  async findByCategory(categoryId: string) {
    return this.find({ category: categoryId });
  }

  async findByStatus(status: string) {
    return this.find({ status });
  }

  async findUpcoming() {
    const now = new Date();
    return this.find({
      scheduledDate: { $gte: now },
      status: 'published',
    });
  }
}

