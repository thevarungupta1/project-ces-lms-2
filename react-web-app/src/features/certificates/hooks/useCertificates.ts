import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateApi, certificateTemplateApi, IssueCertificateInput, CertificateFilters } from '../api/certificate.api';
import { toast } from 'sonner';

export const useCertificates = (filters?: CertificateFilters) => {
  return useQuery({
    queryKey: ['certificates', filters],
    queryFn: () => certificateApi.getCertificates(filters),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCertificate = (id: string) => {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: () => certificateApi.getCertificateById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useIssueCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IssueCertificateInput) => certificateApi.issueCertificate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate issued successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to issue certificate');
    },
  });
};

export const useCertificateTemplates = () => {
  return useQuery({
    queryKey: ['certificate-templates'],
    queryFn: () => certificateTemplateApi.getTemplates(),
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDefaultCertificateTemplate = () => {
  return useQuery({
    queryKey: ['certificate-template', 'default'],
    queryFn: () => certificateTemplateApi.getDefaultTemplate(),
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

