import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/app/providers';
import { toast } from 'sonner';
import { UserX, Loader2 } from 'lucide-react';
import { useWebinar } from '../hooks/useWebinars';
import { useWebinarRegistrations } from '../hooks/useWebinarRegistrations';
import { useRegisterForWebinar, useCancelWebinarRegistration } from '../hooks/useWebinarRegistrations';
import { useUpdateWebinar, useDeleteWebinar } from '../hooks/useWebinars';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, Video, Calendar, Clock, Users, ExternalLink, 
  PlayCircle, Mail, Edit, Trash2, UserCheck, Send 
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { WebinarEmailDialog } from '@/components/WebinarEmailDialog';

interface Webinar {
  id: string;
  title: string;
  description: string | null;
  host_id: string;
  host_name: string;
  host_email: string | null;
  scheduled_date: string;
  start_time: string;
  end_time: string | null;
  timezone: string;
  meeting_link: string | null;
  meeting_id: string | null;
  meeting_password: string | null;
  recording_url: string | null;
  recording_duration_minutes: number | null;
  status: string;
  max_attendees: number | null;
  is_recorded: boolean;
  registration_required: boolean;
  registration_deadline: string | null;
  category: string | null;
  target_audience: string | null;
  thumbnail_url: string | null;
}

interface Registration {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  department: string | null;
  status: string;
  attended: boolean;
  registered_at: string;
}

const WebinarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, role } = useAuth();
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const displayName = profile?.full_name || user?.email || '';
  const department = profile?.department || null;

  const isAdmin = role === 'admin';
  const isEducator = role === 'educator';
  const isLearner = role === 'learner';
  const canManage = isAdmin || isEducator;

  // Fetch webinar from API
  const { data: webinarData, isLoading: loadingWebinar } = useWebinar(id || '');
  
  // Fetch registrations
  const { data: registrationsResponse, isLoading: loadingRegistrations } = useWebinarRegistrations(
    id ? { webinar: id } : undefined
  );

  // Mutations
  const registerMutation = useRegisterForWebinar();
  const unregisterMutation = useCancelWebinarRegistration();
  const updateStatusMutation = useUpdateWebinar();
  const deleteMutation = useDeleteWebinar();

  // Check if user is registered
  const isUserRegistered = useMemo(() => {
    if (!user?.id || !registrationsResponse?.data) return false;
    return registrationsResponse.data.some(reg => {
      const userId = typeof reg.user === 'object' ? reg.user._id : reg.user;
      return userId === user.id;
    });
  }, [user?.id, registrationsResponse]);

  // Map API data to component format
  const webinar = useMemo(() => {
    if (!webinarData) return null;
    
    const hostName = typeof webinarData.host === 'object' ? webinarData.host.name : 'Unknown';
    const hostEmail = typeof webinarData.host === 'object' ? webinarData.host.email : '';
    
    return {
      id: webinarData._id || webinarData.id || '',
      title: webinarData.title,
      description: webinarData.description || null,
      host_id: typeof webinarData.host === 'object' ? webinarData.host._id : webinarData.host,
      host_name: hostName,
      host_email: hostEmail,
      scheduled_date: webinarData.scheduledDate,
      start_time: webinarData.startTime,
      end_time: webinarData.endTime || null,
      timezone: webinarData.timezone,
      meeting_link: webinarData.meetingLink || null,
      meeting_id: webinarData.meetingId || null,
      meeting_password: webinarData.meetingPassword || null,
      recording_url: webinarData.recordingUrl || null,
      recording_duration_minutes: webinarData.recordingDurationMinutes || null,
      status: webinarData.status,
      max_attendees: webinarData.maxAttendees || null,
      is_recorded: webinarData.isRecorded,
      registration_required: webinarData.registrationRequired,
      registration_deadline: webinarData.registrationDeadline || null,
      category: typeof webinarData.category === 'object' ? webinarData.category.name : webinarData.category || null,
      target_audience: webinarData.targetAudience || null,
      thumbnail_url: webinarData.thumbnailUrl || null,
    };
  }, [webinarData]);

  // Map registrations to component format
  const registrations = useMemo(() => {
    if (!registrationsResponse?.data) return [];
    
    return registrationsResponse.data.map(reg => {
      const userName = typeof reg.user === 'object' ? reg.user.name : 'Unknown';
      const userEmail = typeof reg.user === 'object' ? reg.user.email : '';
      const userDept = typeof reg.user === 'object' ? reg.user.department : null;
      
      return {
        id: reg._id || reg.id || '',
        user_id: typeof reg.user === 'object' ? reg.user._id : reg.user,
        user_name: userName,
        user_email: userEmail,
        department: userDept,
        status: 'registered',
        attended: reg.attended,
        registered_at: reg.registeredAt,
      };
    }).sort((a, b) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime());
  }, [registrationsResponse]);

  const isLoading = loadingWebinar || loadingRegistrations;

  // Handle registration
  const handleRegister = async () => {
    if (!id) return;
    try {
      await registerMutation.mutateAsync({ webinar: id });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  // Handle unregistration
  const handleUnregister = async () => {
    if (!id || !user?.id) return;
    const userRegistration = registrationsResponse?.data?.find(reg => {
      const userId = typeof reg.user === 'object' ? reg.user._id : reg.user;
      return userId === user.id;
    });
    
    if (userRegistration) {
      try {
        await unregisterMutation.mutateAsync(userRegistration._id || userRegistration.id || '');
      } catch (error) {
        // Error is handled by the mutation hook
      }
    }
  };

  // Handle status update
  const handleStatusUpdate = async (status: 'draft' | 'published' | 'completed' | 'cancelled') => {
    if (!id) return;
    try {
      await updateStatusMutation.mutateAsync({ id, data: { status } });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this webinar?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      navigate('/webinars');
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading webinar...</span>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Webinar not found</h2>
        <Button onClick={() => navigate('/webinars')} className="mt-4">
          Back to Webinars
        </Button>
      </div>
    );
  }

  const isLive = webinar.status === 'live' || (webinar.status === 'published' && isToday(new Date(webinar.scheduled_date)));
  const isPastWebinar = isPast(new Date(webinar.scheduled_date)) && !isToday(new Date(webinar.scheduled_date));
  const spotsRemaining = webinar.max_attendees ? webinar.max_attendees - registrations.length : null;
  const isUpcoming = webinar.status === 'published' && !isPastWebinar && !isLive;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/webinars')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Webinars
      </Button>

      {webinar.thumbnail_url && (
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <img 
            src={webinar.thumbnail_url} 
            alt={webinar.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex gap-2 mb-3">
              {isLive && (
                <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">Live Now</Badge>
              )}
              {webinar.category && (
                <Badge variant="secondary">{webinar.category}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{webinar.title}</h1>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {!webinar.thumbnail_url && (
            <Card>
              <CardHeader>
                <div className="flex gap-2 mb-2">
                  {isLive && (
                    <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">Live Now</Badge>
                  )}
                  <Badge variant={webinar.status === 'published' ? 'default' : 'secondary'}>
                    {webinar.status}
                  </Badge>
                </div>
                <CardTitle className="text-3xl">{webinar.title}</CardTitle>
              </CardHeader>
            </Card>
          )}

          <Tabs defaultValue="about" className="w-full">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              {canManage && <TabsTrigger value="registrations">Registrations ({registrations.length})</TabsTrigger>}
              {canManage && <TabsTrigger value="emails">Email Marketing</TabsTrigger>}
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {webinar.description || 'No description provided.'}
                  </p>
                </CardContent>
              </Card>

              {webinar.recording_url && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5" />
                      Recording Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <a href={webinar.recording_url} target="_blank" rel="noopener noreferrer">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Watch Recording
                      </a>
                    </Button>
                    {webinar.recording_duration_minutes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Duration: {webinar.recording_duration_minutes} minutes
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {canManage && (
              <TabsContent value="registrations">
                <Card>
                  <CardHeader>
                    <CardTitle>Registered Attendees</CardTitle>
                    <CardDescription>
                      {registrations.length} people registered
                      {webinar.max_attendees && ` / ${webinar.max_attendees} max`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {registrations.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No registrations yet.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {registrations.map((reg) => (
                            <div
                              key={reg.id}
                              className="flex items-center justify-between p-3 rounded-lg border"
                            >
                              <div>
                                <p className="font-medium">{reg.user_name}</p>
                                <p className="text-sm text-muted-foreground">{reg.user_email}</p>
                                {reg.department && (
                                  <Badge variant="outline" className="mt-1">{reg.department}</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {reg.attended && (
                                  <Badge className="bg-green-500">
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    Attended
                                  </Badge>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(reg.registered_at), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {canManage && (
              <TabsContent value="emails">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Campaigns
                    </CardTitle>
                    <CardDescription>
                      Send promotional emails to employees about this webinar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={() => setShowEmailDialog(true)}>
                      <Send className="mr-2 h-4 w-4" />
                      Create Email Campaign
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Note: Email sending requires Resend API integration. Contact your administrator to set this up.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webinar Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{format(new Date(webinar.scheduled_date), 'EEEE, MMMM d, yyyy')}</p>
                  <p className="text-sm text-muted-foreground">
                    {webinar.start_time?.slice(0, 5)} - {webinar.end_time?.slice(0, 5) || 'TBD'} ({webinar.timezone})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Host</p>
                  <p className="text-sm text-muted-foreground">{webinar.host_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{registrations.length} Registered</p>
                  {spotsRemaining !== null && (
                    <p className="text-sm text-muted-foreground">{spotsRemaining} spots remaining</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              {isLearner && isUpcoming && webinar.registration_required && (
                <>
                  {isUserRegistered ? (
                    <div className="space-y-2">
                      <Badge className="bg-green-500 w-full justify-center py-2">
                        <UserCheck className="h-4 w-4 mr-2" />
                        You're Registered!
                      </Badge>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => unregisterMutation.mutate()}
                        disabled={unregisterMutation.isPending}
                      >
                        {unregisterMutation.isPending ? (
                          'Unregistering...'
                        ) : (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Unregister
                          </>
                        )}
                      </Button>
                      {webinar.meeting_link && (isLive || isToday(new Date(webinar.scheduled_date))) && (
                        <Button className="w-full" asChild>
                          <a href={webinar.meeting_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Join on Teams
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleRegister}
                      disabled={registerMutation.isPending || (spotsRemaining !== null && spotsRemaining <= 0) || (webinar.registration_deadline && isPast(new Date(webinar.registration_deadline)))}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : spotsRemaining !== null && spotsRemaining <= 0 ? (
                        'Full'
                      ) : webinar.registration_deadline && isPast(new Date(webinar.registration_deadline)) ? (
                        'Deadline Passed'
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Register Now
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
              {!isLearner && !canManage && !isPastWebinar && (
                <>
                  {isUserRegistered ? (
                    <div className="text-center py-2">
                      <Badge className="bg-green-500 mb-2">You're Registered!</Badge>
                      {webinar.meeting_link && (isLive || isToday(new Date(webinar.scheduled_date))) && (
                        <Button className="w-full mt-2" asChild>
                          <a href={webinar.meeting_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Join on Teams
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleRegister}
                      disabled={registerMutation.isPending || (spotsRemaining !== null && spotsRemaining <= 0)}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Register Now'
                      )}
                    </Button>
                  )}
                </>
              )}

              {canManage && (
                <>
                  {webinar.meeting_link && (
                    <Button className="w-full" asChild>
                      <a href={webinar.meeting_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in Teams
                      </a>
                    </Button>
                  )}
                  <Button className="w-full" variant="outline" asChild>
                    <Link to={`/webinars/${id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Webinar
                    </Link>
                  </Button>
                  {webinar.status === 'draft' && (
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={() => handleStatusUpdate('published')}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Publish Webinar'
                      )}
                    </Button>
                  )}
                  {webinar.status === 'published' && (
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={() => handleStatusUpdate('published')}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Start Live Session'
                      )}
                    </Button>
                  )}
                  {webinar.status === 'live' && (
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={() => handleStatusUpdate('completed')}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'End Session'
                      )}
                    </Button>
                  )}
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Webinar
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <WebinarEmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        webinarId={webinar.id}
        webinarTitle={webinar.title}
      />
    </div>
  );
};

export default WebinarDetailPage;
