import { ApiError } from '../../core/http/ApiError';
import { WebinarRegistrationRepository } from './webinar-registration.repository';
import { IWebinarRegistration } from '../../models/WebinarRegistration.model';
import { CreateWebinarRegistrationInput } from '../../schemas/webinarRegistration.schema';
import { Webinar } from '../../models/Webinar.model';

export class WebinarRegistrationService {
  private webinarRegistrationRepository: WebinarRegistrationRepository;

  constructor() {
    this.webinarRegistrationRepository = new WebinarRegistrationRepository();
  }

  async register(data: CreateWebinarRegistrationInput, userId: string): Promise<IWebinarRegistration> {
    // Verify webinar exists
    const webinar = await Webinar.findById(data.webinar);
    if (!webinar) {
      throw ApiError.notFound('Webinar not found');
    }

    // Check if webinar is published
    if (webinar.status !== 'published') {
      throw ApiError.badRequest('Webinar is not available for registration');
    }

    // Check registration deadline
    if (webinar.registrationDeadline && new Date(webinar.registrationDeadline) < new Date()) {
      throw ApiError.badRequest('Registration deadline has passed');
    }

    // Check if already registered
    const existing = await this.webinarRegistrationRepository.findByWebinarAndUser(data.webinar, userId);
    if (existing) {
      throw ApiError.conflict('Already registered for this webinar');
    }

    // Check max attendees if set
    if (webinar.maxAttendees) {
      const registrations = await this.webinarRegistrationRepository.findByWebinar(data.webinar);
      if (registrations.length >= webinar.maxAttendees) {
        throw ApiError.badRequest('Webinar is full');
      }
    }

    return this.webinarRegistrationRepository.create({
      webinar: data.webinar,
      user: userId,
      registeredAt: new Date(),
      attended: false,
    } as any);
  }

  async getRegistrationById(id: string): Promise<IWebinarRegistration> {
    const registration = await this.webinarRegistrationRepository.findById(id);
    if (!registration) {
      throw ApiError.notFound('Registration not found');
    }
    return registration;
  }

  async getRegistrations(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.webinarRegistrationRepository.findWithPagination(
      filters,
      page,
      limit,
      { registeredAt: -1 }
    );
    return { data, total, page, limit };
  }

  async updateAttendance(id: string, attended: boolean): Promise<IWebinarRegistration> {
    const updateData: any = { attended };
    if (attended) {
      updateData.attendedAt = new Date();
    }

    const registration = await this.webinarRegistrationRepository.updateById(id, updateData);
    if (!registration) {
      throw ApiError.notFound('Registration not found');
    }
    return registration;
  }

  async cancelRegistration(id: string): Promise<boolean> {
    const deleted = await this.webinarRegistrationRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Registration not found');
    }
    return deleted;
  }
}

