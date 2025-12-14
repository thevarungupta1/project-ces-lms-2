import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCourseModules, useCreateCourseModule, useUpdateCourseModule, useDeleteCourseModule } from '../hooks/useCourseModules';
import { useCourseContent, useDeleteCourseContent, useUpdateCourseContent } from '../hooks/useCourseContent';
import type { CourseModule as ApiCourseModule } from '../api/courseModule.api';
import type { CourseContent as ApiCourseContent } from '../api/courseContent.api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Plus, 
  Trash2, 
  Edit, 
  GripVertical, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Package,
  Upload,
  Eye,
  EyeOff,
  Folder,
  File,
  Presentation,
  Image
} from 'lucide-react';
import { CourseContentUpload } from './CourseContentUpload';

// Local interfaces for component usage
interface LocalCourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  module_order: number;
  is_active: boolean;
}

interface LocalCourseContent {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  content_type: string;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  video_link: string | null;
  duration_minutes: number | null;
  content_order: number;
  is_active: boolean;
  is_mandatory: boolean;
}

interface CourseModuleManagerProps {
  courseId: string;
  isEditable: boolean;
}

export const CourseModuleManager = ({ courseId, isEditable }: CourseModuleManagerProps) => {
  const { toast } = useToast();
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<LocalCourseModule | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' });
  const [contentUploadModuleId, setContentUploadModuleId] = useState<string | null>(null);

  // Fetch modules from API
  const { data: modulesData, isLoading: modulesLoading } = useCourseModules(courseId);
  
  // Mutations
  const createModuleMutation = useCreateCourseModule();
  const updateModuleMutation = useUpdateCourseModule();
  const deleteModuleMutation = useDeleteCourseModule();
  const deleteContentMutation = useDeleteCourseContent();
  const updateContentMutation = useUpdateCourseContent();

  // Fetch content for all modules (we'll fetch individually as needed)
  // For now, we'll create a map of module content
  const modules = useMemo(() => {
    if (!modulesData) return [];
    
    return modulesData
      .map(m => ({
        id: m._id || m.id || '',
        course_id: typeof m.course === 'string' ? m.course : m.course._id,
        title: m.title,
        description: m.description || null,
        module_order: m.moduleOrder,
        is_active: m.isActive,
      }))
      .sort((a, b) => a.module_order - b.module_order);
  }, [modulesData]);

  const isLoading = modulesLoading;

  // Handler functions for module operations
  const handleCreateModule = async () => {
    if (!moduleForm.title.trim()) {
      toast({ title: 'Error', description: 'Module title is required', variant: 'destructive' });
      return;
    }

    const maxOrder = modules.length > 0 
      ? Math.max(...modules.map(m => m.module_order))
      : 0;

    try {
      await createModuleMutation.mutateAsync({
        course: courseId,
        title: moduleForm.title,
        description: moduleForm.description || undefined,
        moduleOrder: maxOrder + 1,
      });
      setIsModuleDialogOpen(false);
      setModuleForm({ title: '', description: '' });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleUpdateModule = async () => {
    if (!editingModule || !moduleForm.title.trim()) {
      toast({ title: 'Error', description: 'Module title is required', variant: 'destructive' });
      return;
    }

    try {
      await updateModuleMutation.mutateAsync({
        id: editingModule.id,
        data: {
          title: moduleForm.title,
          description: moduleForm.description || undefined,
        },
      });
      setIsModuleDialogOpen(false);
      setEditingModule(null);
      setModuleForm({ title: '', description: '' });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleToggleModuleActive = async (id: string, is_active: boolean) => {
    try {
      await updateModuleMutation.mutateAsync({
        id,
        data: { isActive: is_active },
      });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteModule = async (id: string) => {
    try {
      await deleteModuleMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await deleteContentMutation.mutateAsync(contentId);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleToggleContentActive = async (id: string, is_active: boolean) => {
    try {
      await updateContentMutation.mutateAsync({
        id,
        data: { isActive: is_active },
      });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'presentation': return <Presentation className="h-4 w-4 text-orange-500" />;
      case 'document': return <File className="h-4 w-4 text-blue-500" />;
      case 'video': return <Video className="h-4 w-4 text-purple-500" />;
      case 'video_link': return <LinkIcon className="h-4 w-4 text-green-500" />;
      case 'scorm': return <Package className="h-4 w-4 text-indigo-500" />;
      case 'image': return <Image className="h-4 w-4 text-pink-500" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleOpenModuleDialog = (module?: CourseModule) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({ title: module.title, description: module.description || '' });
    } else {
      setEditingModule(null);
      setModuleForm({ title: '', description: '' });
    }
    setIsModuleDialogOpen(true);
  };

  const handleSaveModule = async () => {
    if (editingModule) {
      await handleUpdateModule();
    } else {
      await handleCreateModule();
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Course Modules & Content
            </CardTitle>
            <CardDescription>
              Organize your course content into modules
            </CardDescription>
          </div>
          {isEditable && (
            <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenModuleDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingModule ? 'Edit Module' : 'Add New Module'}</DialogTitle>
                  <DialogDescription>
                    Create a module to organize your course content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="module-title">Module Title *</Label>
                    <Input
                      id="module-title"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Introduction to the Course"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module-description">Description</Label>
                    <Textarea
                      id="module-description"
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this module"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveModule} 
                    disabled={!moduleForm.title.trim() || createModuleMutation.isPending || updateModuleMutation.isPending}
                  >
                    {createModuleMutation.isPending || updateModuleMutation.isPending 
                      ? 'Saving...' 
                      : editingModule 
                        ? 'Update Module' 
                        : 'Create Module'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {modules.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No modules yet. Add your first module to start organizing content.</p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {modules.map((module, index) => (
              <ModuleContentItem
                key={module.id}
                module={module}
                index={index}
                isEditable={isEditable}
                onEdit={() => handleOpenModuleDialog(module)}
                onToggleActive={(isActive) => handleToggleModuleActive(module.id, isActive)}
                onDelete={() => handleDeleteModule(module.id)}
                onUploadClick={() => setContentUploadModuleId(module.id)}
                onDeleteContent={handleDeleteContent}
                onToggleContentActive={handleToggleContentActive}
                getContentIcon={getContentIcon}
                formatFileSize={formatFileSize}
              />
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

// Component to fetch and display content for a single module
const ModuleContentItem = ({
  module,
  index,
  isEditable,
  onEdit,
  onToggleActive,
  onDelete,
  onUploadClick,
  onDeleteContent,
  onToggleContentActive,
  getContentIcon,
  formatFileSize,
}: {
  module: LocalCourseModule;
  index: number;
  isEditable: boolean;
  onEdit: () => void;
  onToggleActive: (isActive: boolean) => void;
  onDelete: () => void;
  onUploadClick: () => void;
  onDeleteContent: (id: string) => void;
  onToggleContentActive: (id: string, isActive: boolean) => void;
  getContentIcon: (type: string) => JSX.Element;
  formatFileSize: (bytes: number | null) => string;
}) => {
  const { data: contentData, isLoading: contentLoading } = useCourseContent(module.id);
  
  const moduleContent = useMemo(() => {
    if (!contentData) return [];
    
    return contentData
      .map(c => {
        // Map API format to local format
        const contentTypeMap: Record<string, string> = {
          'video': 'video',
          'document': 'document',
          'link': 'video_link',
          'quiz': 'quiz',
          'assignment': 'assignment',
        };
        
        return {
          id: c._id || c.id || '',
          module_id: typeof c.module === 'string' ? c.module : c.module._id,
          title: c.title,
          description: c.description || null,
          content_type: contentTypeMap[c.contentType] || c.contentType,
          file_url: c.contentUrl || null,
          file_name: null, // Not in API
          file_size: null, // Not in API
          video_link: c.contentType === 'link' ? c.contentUrl : null,
          duration_minutes: c.duration || null,
          content_order: c.order,
          is_active: c.isActive,
          is_mandatory: false, // Not in API
        };
      })
      .sort((a, b) => a.content_order - b.content_order);
  }, [contentData]);

  return (
    <AccordionItem 
      value={module.id}
      className={`border rounded-lg px-4 ${!module.is_active ? 'opacity-60' : ''}`}
    >
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3 flex-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Module {index + 1}
          </span>
          <span className="font-semibold">{module.title}</span>
          <Badge variant={module.is_active ? 'default' : 'secondary'} className="ml-2">
            {module.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant="outline" className="ml-auto">
            {contentLoading ? '...' : moduleContent.length} items
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        {module.description && (
          <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
        )}
        
        {isEditable && (
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onUploadClick}
            >
              <Upload className="h-4 w-4 mr-1" />
              Add Content
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleActive(!module.is_active)}
            >
              {module.is_active ? (
                <><EyeOff className="h-4 w-4 mr-1" /> Deactivate</>
              ) : (
                <><Eye className="h-4 w-4 mr-1" /> Activate</>
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Module</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete the module and all its content. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {contentLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">Loading content...</p>
        ) : moduleContent.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No content in this module yet.
          </p>
        ) : (
          <div className="space-y-2">
            {moduleContent.map((content) => (
              <div 
                key={content.id}
                className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${!content.is_active ? 'opacity-60' : ''}`}
              >
                {getContentIcon(content.content_type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{content.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{content.content_type.replace('_', ' ')}</span>
                    {content.file_size && (
                      <span>• {formatFileSize(content.file_size)}</span>
                    )}
                    {content.duration_minutes && (
                      <span>• {content.duration_minutes} min</span>
                    )}
                    {content.is_mandatory && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                </div>
                {isEditable && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleContentActive(content.id, !content.is_active)}
                    >
                      {content.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Content</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{content.title}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteContent(content.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
                {content.file_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={content.file_url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                )}
                {content.video_link && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={content.video_link} target="_blank" rel="noopener noreferrer">
                      Watch
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
