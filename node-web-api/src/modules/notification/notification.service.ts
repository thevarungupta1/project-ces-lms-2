import { ApiError } from '../../core/http/ApiError';
import { NotificationRepository } from './notification.repository';
import { INotification } from '../../models/Notification.model';
import { CreateNotificationInput } from '../../schemas/notification.schema';
import { User } from '../../models/User.model';

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async createNotification(data: CreateNotificationInput): Promise<INotification> {
    // Verify user exists
    const user = await User.findById(data.user);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return this.notificationRepository.create({
      ...data,
      type: data.type || 'info',
      read: false,
    } as any);
  }

  async getNotificationById(id: string): Promise<INotification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw ApiError.notFound('Notification not found');
    }
    return notification;
  }

  async getNotificationsByUser(userId: string, page: number = 1, limit: number = 20) {
    const filters = { user: userId };
    const { data, total } = await this.notificationRepository.findWithPagination(
      filters,
      page,
      limit,
      { createdAt: -1 }
    );
    return { data, total, page, limit };
  }

  async getUnreadNotifications(userId: string) {
    return this.notificationRepository.findUnreadByUser(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.countUnreadByUser(userId);
  }

  async markAsRead(id: string): Promise<INotification> {
    const notification = await this.notificationRepository.updateById(id, { read: true });
    if (!notification) {
      throw ApiError.notFound('Notification not found');
    }
    return notification;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const unreadNotifications = await this.notificationRepository.findUnreadByUser(userId);
    let count = 0;
    for (const notification of unreadNotifications) {
      await this.notificationRepository.updateById(notification._id.toString(), { read: true });
      count++;
    }
    return count;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const deleted = await this.notificationRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Notification not found');
    }
    return deleted;
  }
}

