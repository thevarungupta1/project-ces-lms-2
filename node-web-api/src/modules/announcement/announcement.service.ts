import { ApiError } from '../../core/http/ApiError';
import { AnnouncementRepository } from './announcement.repository';
import { IAnnouncement } from '../../models/Announcement.model';
import { CreateAnnouncementInput, UpdateAnnouncementInput } from '../../schemas/announcement.schema';

export class AnnouncementService {
  private announcementRepository: AnnouncementRepository;

  constructor() {
    this.announcementRepository = new AnnouncementRepository();
  }

  async createAnnouncement(data: CreateAnnouncementInput, createdBy: string): Promise<IAnnouncement> {
    return this.announcementRepository.create({
      ...data,
      createdBy,
      type: data.type || 'info',
    } as any);
  }

  async getAnnouncementById(id: string): Promise<IAnnouncement> {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) {
      throw ApiError.notFound('Announcement not found');
    }
    return announcement;
  }

  async getAnnouncements(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.announcementRepository.findWithPagination(
      filters,
      page,
      limit,
      { createdAt: -1 }
    );
    return { data, total, page, limit };
  }

  async getActiveAnnouncements() {
    return this.announcementRepository.findActiveAnnouncements();
  }

  async updateAnnouncement(id: string, data: UpdateAnnouncementInput): Promise<IAnnouncement> {
    const announcement = await this.announcementRepository.updateById(id, data);
    if (!announcement) {
      throw ApiError.notFound('Announcement not found');
    }
    return announcement;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const deleted = await this.announcementRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Announcement not found');
    }
    return deleted;
  }
}

