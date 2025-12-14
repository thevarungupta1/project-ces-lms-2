import { ApiError } from '../../core/http/ApiError';
import { WebinarRepository } from './webinar.repository';
import { IWebinar } from '../../models/Webinar.model';
import { CreateWebinarInput, UpdateWebinarInput } from '../../schemas/webinar.schema';
import { User } from '../../models/User.model';
import { Category } from '../../models/Category.model';

export class WebinarService {
  private webinarRepository: WebinarRepository;

  constructor() {
    this.webinarRepository = new WebinarRepository();
  }

  async createWebinar(data: CreateWebinarInput): Promise<IWebinar> {
    // Verify host exists
    const host = await User.findById(data.host);
    if (!host) {
      throw ApiError.notFound('Host not found');
    }

    // Verify category if provided
    if (data.category) {
      const category = await Category.findById(data.category);
      if (!category) {
        throw ApiError.notFound('Category not found');
      }
    }

    // Validate scheduled date
    const scheduledDate = new Date(data.scheduledDate);
    if (scheduledDate < new Date()) {
      throw ApiError.badRequest('Scheduled date must be in the future');
    }

    return this.webinarRepository.create({
      ...data,
      scheduledDate,
      status: data.status || 'draft',
    } as any);
  }

  async getWebinarById(id: string): Promise<IWebinar> {
    const webinar = await this.webinarRepository.findById(id);
    if (!webinar) {
      throw ApiError.notFound('Webinar not found');
    }
    return webinar;
  }

  async getWebinars(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.webinarRepository.findWithPagination(
      filters,
      page,
      limit,
      { scheduledDate: 1 }
    );
    return { data, total, page, limit };
  }

  async updateWebinar(id: string, data: UpdateWebinarInput): Promise<IWebinar> {
    if (data.scheduledDate) {
      const scheduledDate = new Date(data.scheduledDate);
      if (scheduledDate < new Date()) {
        throw ApiError.badRequest('Scheduled date must be in the future');
      }
      data.scheduledDate = scheduledDate as any;
    }

    const webinar = await this.webinarRepository.updateById(id, data);
    if (!webinar) {
      throw ApiError.notFound('Webinar not found');
    }
    return webinar;
  }

  async deleteWebinar(id: string): Promise<boolean> {
    const deleted = await this.webinarRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Webinar not found');
    }
    return deleted;
  }

  async getUpcomingWebinars() {
    return this.webinarRepository.findUpcoming();
  }
}

