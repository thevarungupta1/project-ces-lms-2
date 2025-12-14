import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface WebinarRegistration {
  _id: string;
  id?: string; // For compatibility
  webinar: string | { _id: string; title: string };
  user: string | { _id: string; name: string; email: string; department?: string };
  registeredAt: string;
  attended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebinarRegistrationInput {
  webinar: string;
}

export interface WebinarRegistrationFilters {
  page?: number;
  limit?: number;
  webinar?: string;
  user?: string;
}

export const webinarRegistrationApi = {
  /**
   * Register for a webinar
   */
  register: async (data: CreateWebinarRegistrationInput): Promise<WebinarRegistration> => {
    const response = await apiClient.post<ApiResponse<WebinarRegistration>>('/webinar-registrations', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to register for webinar');
    }
    return response.data.data;
  },

  /**
   * Get all registrations with pagination
   */
  getRegistrations: async (filters?: WebinarRegistrationFilters): Promise<PaginatedResponse<WebinarRegistration>> => {
    const response = await apiClient.get<PaginatedResponse<WebinarRegistration>>('/webinar-registrations', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch registrations');
    }
    return response.data;
  },

  /**
   * Get registration by ID
   */
  getRegistrationById: async (id: string): Promise<WebinarRegistration> => {
    const response = await apiClient.get<ApiResponse<WebinarRegistration>>(`/webinar-registrations/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch registration');
    }
    return response.data.data;
  },

  /**
   * Update attendance
   */
  updateAttendance: async (id: string, attended: boolean): Promise<WebinarRegistration> => {
    const response = await apiClient.put<ApiResponse<WebinarRegistration>>(`/webinar-registrations/${id}/attendance`, { attended });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update attendance');
    }
    return response.data.data;
  },

  /**
   * Cancel registration
   */
  cancelRegistration: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/webinar-registrations/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to cancel registration');
    }
  },
};

