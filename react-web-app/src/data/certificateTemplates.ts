export interface CertificateTemplate {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
  background_color: string;
  text_color: string;
  border_color: string;
  accent_color: string;
  logo_url: string | null;
  signature_name: string;
  signature_title: string;
  footer_text: string | null;
  created_at: string;
  updated_at: string;
}

export const sampleCertificateTemplates: CertificateTemplate[] = [
  {
    id: 'cert-temp-1',
    name: 'Classic Blue',
    description: 'Professional blue certificate template',
    is_default: true,
    is_active: true,
    background_color: '#ffffff',
    text_color: '#1e293b',
    border_color: '#3b82f6',
    accent_color: '#3b82f6',
    logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80',
    signature_name: 'Sarah Johnson',
    signature_title: 'Chief Learning Officer',
    footer_text: 'This certificate verifies successful completion of the course.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cert-temp-2',
    name: 'Elegant Gold',
    description: 'Premium gold-themed certificate',
    is_default: false,
    is_active: true,
    background_color: '#fefce8',
    text_color: '#78350f',
    border_color: '#f59e0b',
    accent_color: '#f59e0b',
    logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80',
    signature_name: 'Sarah Johnson',
    signature_title: 'Chief Learning Officer',
    footer_text: 'This certificate verifies successful completion of the course.',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
  },
  {
    id: 'cert-temp-3',
    name: 'Modern Minimalist',
    description: 'Clean and modern certificate design',
    is_default: false,
    is_active: true,
    background_color: '#ffffff',
    text_color: '#0f172a',
    border_color: '#6366f1',
    accent_color: '#6366f1',
    logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80',
    signature_name: 'Sarah Johnson',
    signature_title: 'Chief Learning Officer',
    footer_text: 'This certificate verifies successful completion of the course.',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
];

