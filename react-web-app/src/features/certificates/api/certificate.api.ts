import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse } from '@/shared/api/types';

export interface IssuedCertificate {
  _id: string;
  id?: string;
  certificateNumber: string;
  learner: string | { _id: string; name: string; email: string };
  course: string | { _id: string; title: string };
  template: string | { _id: string; name: string };
  completionDate: string;
  issuedAt: string;
  issuedBy: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CertificateTemplate {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  logoUrl?: string;
  signatureTitle: string;
  signatureName: string;
  footerText?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IssueCertificateInput {
  learner: string;
  course: string;
  template: string;
  completionDate: string;
}

export interface CertificateFilters {
  page?: number;
  limit?: number;
  course?: string;
  learner?: string;
}

export const certificateApi = {
  getCertificates: async (filters?: CertificateFilters): Promise<PaginatedResponse<IssuedCertificate>> => {
    const response = await apiClient.get<PaginatedResponse<IssuedCertificate>>('/issued-certificates', { params: filters });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch certificates');
    }
    return response.data;
  },

  getCertificateById: async (id: string): Promise<IssuedCertificate> => {
    const response = await apiClient.get<ApiResponse<IssuedCertificate>>(`/issued-certificates/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch certificate');
    }
    return response.data.data;
  },

  verifyCertificate: async (certificateNumber: string): Promise<IssuedCertificate> => {
    const response = await apiClient.get<ApiResponse<IssuedCertificate>>(`/issued-certificates/verify/${certificateNumber}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to verify certificate');
    }
    return response.data.data;
  },

  issueCertificate: async (data: IssueCertificateInput): Promise<IssuedCertificate> => {
    const response = await apiClient.post<ApiResponse<IssuedCertificate>>('/issued-certificates', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to issue certificate');
    }
    return response.data.data;
  },
};

export const certificateTemplateApi = {
  getTemplates: async (): Promise<CertificateTemplate[]> => {
    const response = await apiClient.get<ApiResponse<CertificateTemplate[]>>('/certificate-templates');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch templates');
    }
    return response.data.data;
  },

  getDefaultTemplate: async (): Promise<CertificateTemplate> => {
    const response = await apiClient.get<ApiResponse<CertificateTemplate>>('/certificate-templates/default');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch default template');
    }
    return response.data.data;
  },
};

