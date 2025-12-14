import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateCourseContent, useCourseContent } from '../hooks/useCourseContent';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Package,
  Presentation,
  File,
  Image,
  Loader2
} from 'lucide-react';

interface CourseContentUploadProps {
  moduleId: string | null;
  courseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

type ContentType = 'video' | 'document' | 'link' | 'quiz' | 'assignment';

const contentTypeConfig: Record<ContentType, { label: string; icon: React.ReactNode; accepts?: string }> = {
  video: { label: 'Video', icon: <Video className="h-4 w-4" />, accepts: '.mp4,.webm,.mov' },
  document: { label: 'Document', icon: <FileText className="h-4 w-4" />, accepts: '.pdf,.doc,.docx' },
  link: { label: 'Link', icon: <LinkIcon className="h-4 w-4" /> },
  quiz: { label: 'Quiz', icon: <FileText className="h-4 w-4" /> },
  assignment: { label: 'Assignment', icon: <FileText className="h-4 w-4" /> },
};

export const CourseContentUpload = ({ moduleId, courseId, onClose, onSuccess }: CourseContentUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createContentMutation = useCreateCourseContent();
  
  // Get existing content for order calculation
  const { data: existingContent } = useCourseContent(moduleId || '');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'document' as ContentType,
    contentUrl: '',
    duration: '',
  });
  
  const handleUpload = async () => {
    if (!moduleId) {
      toast({ title: 'Error', description: 'Module ID is required', variant: 'destructive' });
      return;
    }

    const order = existingContent ? existingContent.length + 1 : 1;

    try {
      let fileUrl: string | null = null;
      let fileName: string | null = null;
      let fileSize: number | null = null;

      // Mock file upload - create object URL for local preview
      if (formData.file && formData.content_type !== 'video_link') {
        // Create a local object URL for preview (in real app, this would be uploaded to server)
        fileUrl = URL.createObjectURL(formData.file);
        fileName = formData.file.name;
        fileSize = formData.file.size;
        
        // Note: In a real app, you'd upload to a server and get a permanent URL
        // For demo, we'll use a placeholder URL
        fileUrl = `https://example.com/files/${courseId}/${moduleId}/${Date.now()}_${fileName}`;
      }

      const now = new Date().toISOString();
      const newContent: CourseContent = {
        id: `content-${Date.now()}`,
        module_id: moduleId,
        title: formData.title,
        description: formData.description || null,
        content_type: formData.content_type,
        content_order: existingContent.length + 1,
        is_mandatory: formData.is_mandatory,
        is_active: true,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        video_link: formData.content_type === 'video_link' ? formData.video_link : null,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        created_at: now,
        updated_at: now,
      };

      setContentData((prev) => [...prev, newContent]);
      
      toast({ 
        title: 'Content added', 
        description: 'The content has been uploaded successfully. Note: This is a demo. File uploads are mocked.' 
      });
      resetForm();
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message || 'Failed to upload content', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      contentType: 'document',
      contentUrl: '',
      duration: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll just set the title
      // In a real app, you'd upload the file to a server first
      setFormData(prev => ({ 
        ...prev, 
        title: prev.title || file.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    
    if (formData.contentType === 'link' && !formData.contentUrl.trim()) {
      toast({ title: 'Error', description: 'Link URL is required', variant: 'destructive' });
      return;
    }
    
    handleUpload();
  };

  const currentConfig = contentTypeConfig[formData.contentType];

  return (
    <Dialog open={!!moduleId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Content</DialogTitle>
          <DialogDescription>
            Upload learning materials to this module
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content-type">Content Type *</Label>
            <Select 
              value={formData.contentType} 
              onValueChange={(value: ContentType) => {
                setFormData(prev => ({ ...prev, contentType: value, contentUrl: '' }));
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(contentTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      {config.icon}
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-title">Title *</Label>
            <Input
              id="content-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Content title"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-description">Description</Label>
            <Textarea
              id="content-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description"
              rows={2}
              maxLength={500}
            />
          </div>

          {formData.contentType === 'link' ? (
            <div className="space-y-2">
              <Label htmlFor="content-url">Content URL *</Label>
              <Input
                id="content-url"
                type="url"
                value={formData.contentUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, contentUrl: e.target.value }))}
                placeholder="https://example.com/..."
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to external content
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept={currentConfig.accepts}
                  onChange={handleFileChange}
                />
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    File upload will be implemented with backend storage
                  </p>
                  <p className="text-xs text-muted-foreground">
                    For now, use Content URL field for links
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 30"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={createContentMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={createContentMutation.isPending}>
              {createContentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Add Content
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
