import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface Group {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  members: string[] | Array<{ _id: string; name: string; email: string }>;
  createdBy: string | { _id: string; name: string; email: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupInput {
  name: string;
  description?: string;
  members?: string[];
  isActive?: boolean;
}

export interface UpdateGroupInput {
  name?: string;
  description?: string;
  members?: string[];
  isActive?: boolean;
}

export interface GroupFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  createdBy?: string;
}

export const groupApi = {
  getGroups: async (filters?: GroupFilters): Promise<PaginatedResponse<Group>> => {
    const response = await apiClient.get<PaginatedResponse<Group>>('/groups', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch groups');
    }
    return response.data;
  },

  getGroupById: async (id: string): Promise<Group> => {
    const response = await apiClient.get<ApiResponse<Group>>(`/groups/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch group');
    }
    return response.data.data;
  },

  createGroup: async (data: CreateGroupInput): Promise<Group> => {
    const response = await apiClient.post<ApiResponse<Group>>('/groups', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create group');
    }
    return response.data.data;
  },

  updateGroup: async (id: string, data: UpdateGroupInput): Promise<Group> => {
    const response = await apiClient.put<ApiResponse<Group>>(`/groups/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update group');
    }
    return response.data.data;
  },

  deleteGroup: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/groups/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete group');
    }
  },

  addMember: async (groupId: string, memberId: string): Promise<Group> => {
    const response = await apiClient.post<ApiResponse<Group>>(`/groups/${groupId}/members/${memberId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to add member');
    }
    return response.data.data;
  },

  removeMember: async (groupId: string, memberId: string): Promise<Group> => {
    const response = await apiClient.delete<ApiResponse<Group>>(`/groups/${groupId}/members/${memberId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to remove member');
    }
    return response.data.data;
  },
};

