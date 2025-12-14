import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { sampleIssuedCertificates } from '@/data/issuedCertificates';
import { sampleCertificateTemplates, CertificateTemplate } from '@/data/certificateTemplates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Award, Plus, Trash2, Edit, Eye, Star, Download, FileText, Calendar, User, GraduationCap, Sparkles, CheckCircle2, MoreVertical } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CertificateTemplate {
  id: string;
  name: string;
  description: string | null;
  background_color: string;
  border_color: string;
  text_color: string;
  accent_color: string;
  logo_url: string | null;
  signature_title: string;
  signature_name: string;
  footer_text: string | null;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
}

interface IssuedCertificate {
  id: string;
  certificate_number: string;
  learner_name: string;
  learner_email: string;
  course_title: string;
  completion_date: string;
  issued_at: string;
}

const Certificates = () => {
  const { role, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('templates');
  const isAdminOrEducator = role === 'admin' || role === 'educator';

  // Load templates from localStorage or use sample data
  const [templatesData, setTemplatesData] = useState<CertificateTemplate[]>(() => {
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

  // Sync with localStorage on mount and focus
  useEffect(() => {
    const syncTemplates = () => {
      const stored = localStorage.getItem('certificate-templates-data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTemplatesData((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
              return parsed;
            }
            return prev;
          });
        } catch {
          // Ignore parse errors
        }
      }
    };

    syncTemplates();
    window.addEventListener('focus', syncTemplates);
    window.addEventListener('storage', syncTemplates);

    return () => {
      window.removeEventListener('focus', syncTemplates);
      window.removeEventListener('storage', syncTemplates);
    };
  }, []);

  // Use local data from localStorage or sample data
  const templates: CertificateTemplate[] = templatesData;

  // Use local sample data and filter by user for learners
  const allIssuedCertificates = useMemo(() => {
    if (isAdminOrEducator) {
      // Admins and educators see all certificates
      return sampleIssuedCertificates.map(cert => ({
        id: cert.id,
        certificate_number: cert.certificate_number,
        learner_name: cert.learner_name,
        learner_email: cert.learner_email,
        course_title: cert.course_title,
        completion_date: cert.completion_date,
        issued_at: cert.issued_at,
      }));
    } else {
      // Learners only see their own certificates
      return sampleIssuedCertificates
        .filter(cert => cert.learner_email === user?.email)
        .map(cert => ({
          id: cert.id,
          certificate_number: cert.certificate_number,
          learner_name: cert.learner_name,
          learner_email: cert.learner_email,
          course_title: cert.course_title,
          completion_date: cert.completion_date,
          issued_at: cert.issued_at,
        }));
    }
  }, [isAdminOrEducator, user?.email]);

  const issuedCertificates = allIssuedCertificates;

  const templatesLoading = false;
  const certificatesLoading = false;

  const handleDeleteTemplate = (id: string) => {
    setTemplatesData((prev) => prev.filter(t => t.id !== id));
    toast({
      title: 'Template deleted',
      description: 'Note: This is a demo. Changes are stored locally.',
    });
  };

  const handleSetDefault = (id: string) => {
    setTemplatesData((prev) =>
      prev.map(t => ({
        ...t,
        is_default: t.id === id,
        updated_at: new Date().toISOString(),
      }))
    );
    toast({
      title: 'Default updated',
      description: 'Note: This is a demo. Changes are stored locally.',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Certificates</h1>
          </div>
          <p className="text-muted-foreground ml-12">
            {isAdminOrEducator 
              ? 'Manage certificate templates and view issued certificates'
              : 'View and download your earned certificates'}
          </p>
        </div>
        {isAdminOrEducator && (
          <Button asChild size="lg" className="shadow-md">
            <Link to="/certificates/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Link>
          </Button>
        )}
      </div>

      {isAdminOrEducator ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 p-1">
            <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-background">
              <FileText className="h-4 w-4" />
              Templates
              <Badge variant="secondary" className="ml-1">
                {templates.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="issued" className="gap-2 data-[state=active]:bg-background">
              <Award className="h-4 w-4" />
              Issued Certificates
              <Badge variant="secondary" className="ml-1">
                {issuedCertificates.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-6">
            {templatesLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-40 bg-muted" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30"
                  >
                    <div 
                      className="h-40 relative flex items-center justify-center overflow-hidden"
                      style={{ 
                        backgroundColor: template.background_color,
                        borderBottom: `4px solid ${template.border_color}` 
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5" />
                      <Award 
                        className="h-20 w-20 relative z-10 group-hover:scale-110 transition-transform duration-300" 
                        style={{ color: template.accent_color }}
                      />
                      {template.is_default && (
                        <Badge className="absolute top-3 right-3 shadow-lg bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Default
                        </Badge>
                      )}
                      {!template.is_active && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Badge variant="secondary" className="shadow-lg">Inactive</Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="bg-gradient-to-b from-card to-muted/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                            {template.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mt-1.5 text-sm">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={template.is_active ? 'default' : 'secondary'}
                          className="shrink-0"
                        >
                          {template.is_active ? (
                            <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                          ) : (
                            'Inactive'
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm" asChild className="flex-1 min-w-[100px]">
                          <Link to={`/certificates/preview/${template.id}`}>
                            <Eye className="h-4 w-4 mr-1.5" />
                            Preview
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="flex-1 min-w-[100px]">
                          <Link to={`/certificates/edit/${template.id}`}>
                            <Edit className="h-4 w-4 mr-1.5" />
                            Edit
                          </Link>
                        </Button>
                        {!template.is_default && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon" className="h-9 w-9">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleSetDefault(template.id)}
                              >
                                <Star className="h-4 w-4 mr-2" />
                                Set as Default
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Template
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!templatesLoading && templates.length === 0 && (
              <Card className="py-16 border-dashed">
                <CardContent className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No templates yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Create your first certificate template to get started. Templates define the design and layout of certificates.
                    </p>
                  </div>
                  <Button asChild size="lg" className="mt-4">
                    <Link to="/certificates/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Template
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="issued" className="mt-6">
            {certificatesLoading ? (
              <Card className="animate-pulse">
                <CardContent className="h-40" />
              </Card>
            ) : issuedCertificates.length > 0 ? (
              <Card className="shadow-md">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Issued Certificates
                  </CardTitle>
                  <CardDescription>
                    View and manage all certificates issued to learners
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Certificate #</TableHead>
                          <TableHead className="font-semibold">Learner</TableHead>
                          <TableHead className="font-semibold">Course</TableHead>
                          <TableHead className="font-semibold">Completion Date</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {issuedCertificates.map((cert) => (
                          <TableRow key={cert.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-mono text-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{cert.certificate_number}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium">{cert.learner_name}</div>
                                  <div className="text-sm text-muted-foreground">{cert.learner_email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{cert.course_title}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{new Date(cert.completion_date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/certificates/view/${cert.id}`}>
                                  <Eye className="h-4 w-4 mr-1.5" />
                                  View
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="py-16 border-dashed">
                <CardContent className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No certificates issued</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Certificates will appear here when learners complete courses and earn their certificates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div>
          {certificatesLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-muted" />
                </Card>
              ))}
            </div>
          ) : issuedCertificates.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {issuedCertificates.map((cert) => (
                <Card 
                  key={cert.id} 
                  className="group hover:border-primary/50 hover:shadow-xl transition-all duration-300 border-2 overflow-hidden"
                >
                  <div className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    <Award className="h-16 w-16 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-3 right-3">
                      <Badge variant="default" className="shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Earned
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="bg-gradient-to-b from-card to-muted/30">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {cert.course_title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Completed {new Date(cert.completion_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                        <FileText className="h-3 w-3" />
                        <span>{cert.certificate_number}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex gap-2">
                      <Button className="flex-1" asChild>
                        <Link to={`/certificates/view/${cert.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Certificate
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/certificates/view/${cert.id}`}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-16 border-dashed">
              <CardContent className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No certificates yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Complete courses to earn certificates. Your achievements will be displayed here once you finish a course.
                  </p>
                </div>
                <Button variant="outline" asChild className="mt-4">
                  <Link to="/courses">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Browse Courses
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Certificates;
