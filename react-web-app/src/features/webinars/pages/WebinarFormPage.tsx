import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Video, Calendar, Link as LinkIcon, Users, Loader2 } from 'lucide-react';
import { useCreateWebinar, useUpdateWebinar } from '../hooks/useWebinars';
import { useWebinar } from '../hooks/useWebinars';
import { useCategories } from '@/features/categories/hooks/useCategories';

const WebinarFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = !!id;

  // Fetch existing webinar if editing
  const { data: existingWebinar, isLoading: loadingWebinar } = useWebinar(id || '');
  
  // Fetch categories
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data || [];

  // Mutations
  const createMutation = useCreateWebinar();
  const updateMutation = useUpdateWebinar();

  // Initialize form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    start_time: '',
    end_time: '',
    timezone: 'UTC',
    meeting_link: '',
    meeting_id: '',
    meeting_password: '',
    max_attendees: '',
    registration_required: true,
    registration_deadline: '',
    category: '',
    target_audience: 'all',
    thumbnail_url: '',
  });

  // Populate form when editing
  useEffect(() => {
    if (existingWebinar) {
      const scheduledDate = new Date(existingWebinar.scheduledDate).toISOString().split('T')[0];
      const categoryId = typeof existingWebinar.category === 'object' 
        ? existingWebinar.category._id 
        : existingWebinar.category || '';
      
      setFormData({
        title: existingWebinar.title,
        description: existingWebinar.description || '',
        scheduled_date: scheduledDate,
        start_time: existingWebinar.startTime,
        end_time: existingWebinar.endTime || '',
        timezone: existingWebinar.timezone,
        meeting_link: existingWebinar.meetingLink || '',
        meeting_id: existingWebinar.meetingId || '',
        meeting_password: existingWebinar.meetingPassword || '',
        max_attendees: existingWebinar.maxAttendees?.toString() || '',
        registration_required: existingWebinar.registrationRequired,
        registration_deadline: existingWebinar.registrationDeadline 
          ? new Date(existingWebinar.registrationDeadline).toISOString().split('T')[0]
          : '',
        category: categoryId,
        target_audience: existingWebinar.targetAudience || 'all',
        thumbnail_url: existingWebinar.thumbnailUrl || '',
      });
    }
  }, [existingWebinar]);

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title || !formData.scheduled_date || !formData.start_time) {
      return;
    }

    if (!user?.id) {
      return;
    }

    // Format time to HH:mm:ss
    const startTime = formData.start_time.includes(':') && formData.start_time.split(':').length === 2
      ? `${formData.start_time}:00`
      : formData.start_time;
    const endTime = formData.end_time && formData.end_time.includes(':') && formData.end_time.split(':').length === 2
      ? `${formData.end_time}:00`
      : formData.end_time;

    // Combine date and time for scheduledDate
    const scheduledDateTime = new Date(`${formData.scheduled_date}T${startTime}`);
    const registrationDeadline = formData.registration_deadline
      ? new Date(`${formData.registration_deadline}T23:59:59`)
      : undefined;

    const webinarData = {
      title: formData.title,
      description: formData.description || undefined,
      host: user.id,
      category: formData.category || undefined,
      scheduledDate: scheduledDateTime.toISOString(),
      startTime,
      endTime: endTime || undefined,
      timezone: formData.timezone,
      status,
      registrationRequired: formData.registration_required,
      registrationDeadline: registrationDeadline?.toISOString(),
      maxAttendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
      meetingLink: formData.meeting_link || undefined,
      meetingId: formData.meeting_id || undefined,
      meetingPassword: formData.meeting_password || undefined,
      isRecorded: false,
      thumbnailUrl: formData.thumbnail_url || undefined,
      targetAudience: formData.target_audience || undefined,
    };

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: webinarData });
      } else {
        await createMutation.mutateAsync(webinarData);
      }
      navigate('/webinars');
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/webinars')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Webinars
      </Button>

      {loadingWebinar && isEditMode ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading webinar...</span>
        </div>
      ) : (
        <>
      <div>
        <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Webinar' : 'Create New Webinar'}</h1>
        <p className="text-muted-foreground mt-1">
          {isEditMode ? 'Update webinar details' : 'Set up a new webinar session for your employees'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Webinar Title *</Label>
              <Input
                id="title"
                placeholder="Enter webinar title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this webinar is about..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id || cat.id} value={cat._id || cat.id || ''}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience</Label>
                <Select value={formData.target_audience} onValueChange={(v) => handleChange('target_audience', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                    <SelectItem value="educator">Educators</SelectItem>
                    <SelectItem value="learner">Learners</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input
                id="thumbnail_url"
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnail_url}
                onChange={(e) => handleChange('thumbnail_url', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Date *</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => handleChange('scheduled_date', e.target.value)}
              />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(v) => handleChange('timezone', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="IST">IST (India)</SelectItem>
                  <SelectItem value="EST">EST (US Eastern)</SelectItem>
                  <SelectItem value="PST">PST (US Pacific)</SelectItem>
                  <SelectItem value="GMT">GMT (UK)</SelectItem>
                  <SelectItem value="CET">CET (Europe)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Microsoft Teams Meeting
            </CardTitle>
            <CardDescription>Paste your Teams meeting details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_link">Meeting Link</Label>
              <Input
                id="meeting_link"
                placeholder="https://teams.microsoft.com/..."
                value={formData.meeting_link}
                onChange={(e) => handleChange('meeting_link', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_id">Meeting ID (Optional)</Label>
              <Input
                id="meeting_id"
                placeholder="123 456 789"
                value={formData.meeting_id}
                onChange={(e) => handleChange('meeting_id', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_password">Passcode (Optional)</Label>
              <Input
                id="meeting_password"
                placeholder="Meeting passcode"
                value={formData.meeting_password}
                onChange={(e) => handleChange('meeting_password', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Registration Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Registration</Label>
                <p className="text-sm text-muted-foreground">Attendees must register before joining</p>
              </div>
              <Switch
                checked={formData.registration_required}
                onCheckedChange={(checked) => handleChange('registration_required', checked)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="max_attendees">Maximum Attendees</Label>
                <Input
                  id="max_attendees"
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={formData.max_attendees}
                  onChange={(e) => handleChange('max_attendees', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration_deadline">Registration Deadline</Label>
                <Input
                  id="registration_deadline"
                  type="date"
                  value={formData.registration_deadline}
                  onChange={(e) => handleChange('registration_deadline', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/webinars')}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSubmit('draft')}
          disabled={!formData.title || !formData.scheduled_date || !formData.start_time || createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save as Draft'
          )}
        </Button>
        <Button
          onClick={() => handleSubmit('published')}
          disabled={!formData.title || !formData.scheduled_date || !formData.start_time || createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            isEditMode ? 'Update Webinar' : 'Publish Webinar'
          )}
        </Button>
      </div>
        </>
      )}
    </div>
  );
};

export default WebinarFormPage;
