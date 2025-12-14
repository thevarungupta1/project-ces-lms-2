import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface Webinar {
  _id: string;
  id?: string; // For compatibility
  title: string;
  description?: string;
  host: string | { _id: string; name: string; email: string };
  category?: string | { _id: string; name: string };
  scheduledDate: string;
  startTime: string;
  endTime?: string;
  timezone: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  registrationRequired: boolean;
  registrationDeadline?: string;
  maxAttendees?: number;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  isRecorded: boolean;
  recordingUrl?: string;
  recordingDurationMinutes?: number;
  thumbnailUrl?: string;
  targetAudience?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebinarInput {
  title: string;
  description?: string;
  host: string;
  category?: string;
  scheduledDate: string;
  startTime: string;
  endTime?: string;
  timezone?: string;
  status?: 'draft' | 'published' | 'completed' | 'cancelled';
  registrationRequired?: boolean;
  registrationDeadline?: string;
  maxAttendees?: number;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  isRecorded?: boolean;
  thumbnailUrl?: string;
  targetAudience?: string;
}

export interface UpdateWebinarInput {
  title?: string;
  description?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  status?: 'draft' | 'published' | 'completed' | 'cancelled';
  registrationRequired?: boolean;
  registrationDeadline?: string;
  maxAttendees?: number;
  meetingLink?: string;
  meetingPassword?: string;
  isRecorded?: boolean;
  recordingUrl?: string;
  thumbnailUrl?: string;
}

export interface WebinarFilters {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'completed' | 'cancelled';
  host?: string;
  category?: string;
}

export const webinarApi = {
  /**
   * Get all webinars with pagination
   */
  getWebinars: async (filters?: WebinarFilters): Promise<PaginatedResponse<Webinar>> => {
    const response = await apiClient.get<PaginatedResponse<Webinar>>('/webinars', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch webinars');
    }
    return response.data;
  },

  /**
   * Get upcoming webinars
   */
  getUpcomingWebinars: async (): Promise<Webinar[]> => {
    const response = await apiClient.get<ApiResponse<Webinar[]>>('/webinars/upcoming');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch upcoming webinars');
    }
    return response.data.data;
  },

  /**
   * Get webinar by ID
   */
  getWebinarById: async (id: string): Promise<Webinar> => {
    const response = await apiClient.get<ApiResponse<Webinar>>(`/webinars/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch webinar');
    }
    return response.data.data;
  },

  /**
   * Create new webinar
   */
  createWebinar: async (data: CreateWebinarInput): Promise<Webinar> => {
    const response = await apiClient.post<ApiResponse<Webinar>>('/webinars', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create webinar');
    }
    return response.data.data;
  },

  /**
   * Update webinar
   */
  updateWebinar: async (id: string, data: UpdateWebinarInput): Promise<Webinar> => {
    const response = await apiClient.put<ApiResponse<Webinar>>(`/webinars/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update webinar');
    }
    return response.data.data;
  },

  /**
   * Delete webinar
   */
  deleteWebinar: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/webinars/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete webinar');
    }
  },
};

