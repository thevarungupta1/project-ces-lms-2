import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { Notification, INotification } from '../../models/Notification.model';

export class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(Notification);
  }

  async findByUser(userId: string) {
    return this.find({ user: userId }, { sort: { createdAt: -1 } });
  }

  async findUnreadByUser(userId: string) {
    return this.find({ user: userId, read: false }, { sort: { createdAt: -1 } });
  }

  async countUnreadByUser(userId: string): Promise<number> {
    return this.count({ user: userId, read: false });
  }
}

