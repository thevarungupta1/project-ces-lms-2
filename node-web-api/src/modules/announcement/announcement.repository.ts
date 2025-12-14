import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { Announcement, IAnnouncement } from '../../models/Announcement.model';

export class AnnouncementRepository extends BaseRepository<IAnnouncement> {
  constructor() {
    super(Announcement);
  }

  async findByCreator(createdBy: string) {
    return this.find({ createdBy });
  }

  async findActiveAnnouncements() {
    return this.find({ isActive: true }, { sort: { createdAt: -1 } });
  }

  async findByTargetAudience(audience: string) {
    return this.find({ targetAudience: audience, isActive: true });
  }
}

