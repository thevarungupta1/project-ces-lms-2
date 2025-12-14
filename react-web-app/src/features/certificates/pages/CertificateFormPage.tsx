import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Award } from 'lucide-react';
import { sampleCertificateTemplates, CertificateTemplate } from '@/data/certificateTemplates';

const CertificateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  // Load templates from localStorage or use sample data
  const [templates, setTemplates] = useState<CertificateTemplate[]>(() => {
    const stored = localStorage.getItem('certificate-templates-data');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return sampleCertificateTemplates;
      }
    }
    return sampleCertificateTemplates;
  });

  // Save to localStorage whenever templates change
  useEffect(() => {
    localStorage.setItem('certificate-templates-data', JSON.stringify(templates));
  }, [templates]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    background_color: '#ffffff',
    border_color: '#1e40af',
    text_color: '#1f2937',
    accent_color: '#3b82f6',
    logo_url: '',
    signature_title: 'Program Director',
    signature_name: '',
    footer_text: 'This certificate is awarded in recognition of successful completion of the course.',
    is_active: true,
  });

  // Get existing template for edit mode
  const existingTemplate = useMemo(() => {
    if (!id) return null;
    return templates.find(t => t.id === id) || null;
  }, [id, templates]);

  useEffect(() => {
    if (existingTemplate) {
      setFormData({
        name: existingTemplate.name,
        description: existingTemplate.description || '',
        background_color: existingTemplate.background_color,
        border_color: existingTemplate.border_color,
        text_color: existingTemplate.text_color,
        accent_color: existingTemplate.accent_color,
        logo_url: existingTemplate.logo_url || '',
        signature_title: existingTemplate.signature_title,
        signature_name: existingTemplate.signature_name,
        footer_text: existingTemplate.footer_text || '',
        is_active: existingTemplate.is_active,
      });
    }
  }, [existingTemplate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    
    if (isEdit && id) {
      // Update existing template
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === id
            ? {
                ...template,
                name: formData.name,
                description: formData.description || null,
                background_color: formData.background_color,
                border_color: formData.border_color,
                text_color: formData.text_color,
                accent_color: formData.accent_color,
                logo_url: formData.logo_url || null,
                signature_title: formData.signature_title,
                signature_name: formData.signature_name,
                footer_text: formData.footer_text || null,
                is_active: formData.is_active,
                updated_at: now,
              }
            : template
        )
      );
      
      toast({
        title: 'Template updated',
        description: `${formData.name} has been updated successfully. Note: This is a demo. Changes are stored locally.`,
      });
    } else {
      // Create new template
      const newTemplate: CertificateTemplate = {
        id: `cert-temp-${Date.now()}`,
        name: formData.name,
        description: formData.description || null,
        is_default: false,
        is_active: formData.is_active,
        background_color: formData.background_color,
        border_color: formData.border_color,
        text_color: formData.text_color,
        accent_color: formData.accent_color,
        logo_url: formData.logo_url || null,
        signature_title: formData.signature_title,
        signature_name: formData.signature_name,
        footer_text: formData.footer_text || null,
        created_at: now,
        updated_at: now,
      };
      
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
      
      toast({
        title: 'Template created',
        description: `${formData.name} has been created successfully. Note: This is a demo. Changes are stored locally.`,
      });
    }
    
    navigate('/certificates');
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = false;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/certificates')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Certificates
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isEdit ? 'Edit Certificate Template' : 'Create Certificate Template'}
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your certificate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Classic Blue Certificate"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of this template"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="background_color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="background_color"
                      value={formData.background_color}
                      onChange={(e) => handleChange('background_color', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.background_color}
                      onChange={(e) => handleChange('background_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="border_color">Border Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="border_color"
                      value={formData.border_color}
                      onChange={(e) => handleChange('border_color', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.border_color}
                      onChange={(e) => handleChange('border_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text_color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="text_color"
                      value={formData.text_color}
                      onChange={(e) => handleChange('text_color', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.text_color}
                      onChange={(e) => handleChange('text_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="accent_color"
                      value={formData.accent_color}
                      onChange={(e) => handleChange('accent_color', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.accent_color}
                      onChange={(e) => handleChange('accent_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="signature_name">Signatory Name *</Label>
                  <Input
                    id="signature_name"
                    value={formData.signature_name}
                    onChange={(e) => handleChange('signature_name', e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature_title">Signatory Title *</Label>
                  <Input
                    id="signature_title"
                    value={formData.signature_title}
                    onChange={(e) => handleChange('signature_title', e.target.value)}
                    placeholder="Program Director"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_text">Footer Text</Label>
                <Textarea
                  id="footer_text"
                  value={formData.footer_text}
                  onChange={(e) => handleChange('footer_text', e.target.value)}
                  placeholder="Certificate footer message"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Saving...' : isEdit ? 'Update Template' : 'Create Template'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/certificates')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See how your certificate will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="aspect-[1.414] rounded-lg p-6 flex flex-col items-center justify-between text-center relative overflow-hidden"
              style={{ 
                backgroundColor: formData.background_color,
                border: `4px solid ${formData.border_color}`,
                color: formData.text_color,
              }}
            >
              {/* Decorative corners */}
              <div 
                className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4"
                style={{ borderColor: formData.accent_color }}
              />
              <div 
                className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4"
                style={{ borderColor: formData.accent_color }}
              />
              <div 
                className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4"
                style={{ borderColor: formData.accent_color }}
              />
              <div 
                className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4"
                style={{ borderColor: formData.accent_color }}
              />

              <div className="space-y-2">
                {formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo" className="h-10 mx-auto object-contain" />
                ) : (
                  <Award className="h-10 w-10 mx-auto" style={{ color: formData.accent_color }} />
                )}
                <p className="text-xs uppercase tracking-widest" style={{ color: formData.accent_color }}>
                  Certificate of Completion
                </p>
              </div>

              <div className="space-y-2 flex-1 flex flex-col justify-center">
                <p className="text-xs">This is to certify that</p>
                <p className="text-lg font-bold" style={{ color: formData.accent_color }}>
                  John Doe
                </p>
                <p className="text-xs">has successfully completed</p>
                <p className="text-sm font-semibold">Introduction to Project Management</p>
                <p className="text-xs">on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-1 w-full">
                <div className="w-24 h-px mx-auto" style={{ backgroundColor: formData.text_color }} />
                <p className="text-xs font-medium">{formData.signature_name || 'Signature Name'}</p>
                <p className="text-[10px]">{formData.signature_title}</p>
                {formData.footer_text && (
                  <p className="text-[8px] mt-2 px-4 opacity-70">{formData.footer_text}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CertificateForm;
