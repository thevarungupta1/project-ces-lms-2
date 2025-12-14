import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, Download } from 'lucide-react';
import { sampleCertificateTemplates } from '@/data/certificateTemplates';
import { sampleIssuedCertificates } from '@/data/issuedCertificates';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CertificateTemplate {
  id: string;
  name: string;
  background_color: string;
  border_color: string;
  text_color: string;
  accent_color: string;
  logo_url: string | null;
  signature_title: string;
  signature_name: string;
  footer_text: string | null;
}

interface IssuedCertificate {
  id: string;
  certificate_number: string;
  learner_name: string;
  course_title: string;
  completion_date: string;
  template_id: string;
}

const CertificatePreview = () => {
  const { id, certId } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);
  const isViewingIssued = !!certId;

  // Use local sample data instead of Supabase
  const template = useMemo(() => {
    if (!id || isViewingIssued) return null;
    return sampleCertificateTemplates.find(t => t.id === id) || null;
  }, [id, isViewingIssued]);

  const issuedCert = useMemo(() => {
    if (!certId) return null;
    return sampleIssuedCertificates.find(c => c.id === certId) || null;
  }, [certId]);

  const issuedTemplate = useMemo(() => {
    if (!issuedCert?.template_id) return null;
    return sampleCertificateTemplates.find(t => t.id === issuedCert.template_id) || null;
  }, [issuedCert?.template_id]);

  const activeTemplate = isViewingIssued ? issuedTemplate : template;
  const learnerName = issuedCert?.learner_name || 'John Doe';
  const courseTitle = issuedCert?.course_title || 'Sample Course';
  const completionDate = issuedCert?.completion_date 
    ? new Date(issuedCert.completion_date).toLocaleDateString() 
    : new Date().toLocaleDateString();
  const certificateNumber = issuedCert?.certificate_number || 'CERT-PREVIEW-001';

  const isLoading = false;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      // Show loading state
      const button = document.querySelector('[data-download-button]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="mr-2">Generating PDF...</span>';
      }

      // Capture the certificate element as canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: activeTemplate?.background_color || '#ffffff',
      });

      // Calculate dimensions (A4 aspect ratio)
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [imgWidth, imgHeight],
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Generate filename
      const filename = `Certificate_${certificateNumber}_${learnerName.replace(/\s+/g, '_')}.pdf`;
      
      // Download PDF
      pdf.save(filename);

      // Reset button
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Download PDF';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      // Reset button on error
      const button = document.querySelector('[data-download-button]') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Download PDF';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="animate-pulse">
          <CardContent className="h-[600px]" />
        </Card>
      </div>
    );
  }

  if (!activeTemplate) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/certificates')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Certificates
        </Button>
        <Card className="py-12">
          <CardContent className="text-center">
            <h3 className="text-lg font-semibold mb-2">Template not found</h3>
            <p className="text-muted-foreground">
              The certificate template you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/certificates')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Certificates
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDownloadPDF}
          data-download-button
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card>
        <CardContent className="p-8">
          <div 
            ref={certificateRef}
            className="aspect-[1.414] rounded-lg p-12 flex flex-col items-center justify-between text-center relative overflow-hidden print:shadow-none"
            style={{ 
              backgroundColor: activeTemplate.background_color,
              border: `6px solid ${activeTemplate.border_color}`,
              color: activeTemplate.text_color,
            }}
          >
            {/* Decorative corners */}
            <div 
              className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4"
              style={{ borderColor: activeTemplate.accent_color }}
            />
            <div 
              className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4"
              style={{ borderColor: activeTemplate.accent_color }}
            />
            <div 
              className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4"
              style={{ borderColor: activeTemplate.accent_color }}
            />
            <div 
              className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4"
              style={{ borderColor: activeTemplate.accent_color }}
            />

            {/* Header */}
            <div className="space-y-4">
              {activeTemplate.logo_url ? (
                <img src={activeTemplate.logo_url} alt="Logo" className="h-16 mx-auto object-contain" />
              ) : (
                <Award className="h-16 w-16 mx-auto" style={{ color: activeTemplate.accent_color }} />
              )}
              <h1 
                className="text-2xl md:text-3xl font-bold uppercase tracking-[0.3em]"
                style={{ color: activeTemplate.accent_color }}
              >
                Certificate of Completion
              </h1>
            </div>

            {/* Body */}
            <div className="space-y-6 flex-1 flex flex-col justify-center py-8">
              <p className="text-lg">This is to certify that</p>
              <p 
                className="text-3xl md:text-4xl font-bold"
                style={{ color: activeTemplate.accent_color }}
              >
                {learnerName}
              </p>
              <p className="text-lg">has successfully completed the course</p>
              <p className="text-xl md:text-2xl font-semibold">
                {courseTitle}
              </p>
              <p className="text-base">
                on <span className="font-medium">{completionDate}</span>
              </p>
            </div>

            {/* Footer */}
            <div className="space-y-4 w-full">
              <div className="flex justify-center gap-16">
                <div className="text-center">
                  <div 
                    className="w-32 h-px mx-auto mb-2"
                    style={{ backgroundColor: activeTemplate.text_color }}
                  />
                  <p className="font-semibold">{activeTemplate.signature_name}</p>
                  <p className="text-sm opacity-80">{activeTemplate.signature_title}</p>
                </div>
              </div>
              
              {activeTemplate.footer_text && (
                <p className="text-xs mt-6 px-8 opacity-70 max-w-lg mx-auto">
                  {activeTemplate.footer_text}
                </p>
              )}
              
              <p className="text-xs opacity-50 font-mono">
                Certificate ID: {certificateNumber}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificatePreview;
