import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Calendar, Clock, Users, Plus, Search, ExternalLink, PlayCircle, UserCheck, Loader2 } from 'lucide-react';
import { format, isPast, isToday, isFuture } from 'date-fns';
import { useWebinars } from '../hooks/useWebinars';
import type { Webinar } from '../api/webinar.api';

const WebinarsPage = () => {
  const { role, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const isAdmin = role === 'admin';
  const isEducator = role === 'educator';
  const isLearner = role === 'learner';
  const canManage = isAdmin || isEducator;

  // Fetch webinars from API
  const filters = useMemo(() => {
    const f: { status?: string; host?: string } = {};
    if (statusFilter !== 'all') {
      f.status = statusFilter;
    }
    if (isEducator && user?.id) {
      f.host = user.id;
    }
    return f;
  }, [statusFilter, isEducator, user?.id]);

  const { data: webinarsResponse, isLoading } = useWebinars(filters);

  // Map API response to component format
  const webinars = useMemo(() => {
    if (!webinarsResponse?.data) return [];
    
    return webinarsResponse.data.map(w => {
      const hostName = typeof w.host === 'object' ? w.host.name : 'Unknown';
      const categoryName = typeof w.category === 'object' ? w.category.name : w.category || null;
      
      return {
        id: w._id || w.id || '',
        title: w.title,
        description: w.description,
        host_name: hostName,
        scheduled_date: w.scheduledDate,
        start_time: w.startTime,
        end_time: w.endTime,
        status: w.status,
        max_attendees: w.maxAttendees,
        recording_url: w.recordingUrl,
        thumbnail_url: w.thumbnailUrl,
        category: categoryName,
        meeting_link: w.meetingLink,
        registration_required: w.registrationRequired,
        registration_deadline: w.registrationDeadline,
      };
    }).sort((a, b) => 
      new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    );
  }, [webinarsResponse]);

  // TODO: Fetch registration counts from API when webinar registration API is available
  const registrationCounts: Record<string, number> = {};
  
  // TODO: Check user registrations from API
  const isUserRegistered = (webinarId: string): boolean => {
    // Placeholder until registration API is available
    return false;
  };

  const filteredWebinars = useMemo(() => {
    return webinars.filter((webinar) => {
      const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.host_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (statusFilter === 'all') return matchesSearch;
      return matchesSearch && webinar.status === statusFilter;
    });
  }, [webinars, searchTerm, statusFilter]);

  const upcomingWebinars = useMemo(() => 
    filteredWebinars.filter(
      (w) => w.status === 'published' && isFuture(new Date(w.scheduled_date))
    ), [filteredWebinars]
  );
  
  const liveWebinars = useMemo(() => 
    filteredWebinars.filter(
      (w) => w.status === 'published' && isToday(new Date(w.scheduled_date))
    ), [filteredWebinars]
  );
  
  const pastWebinars = useMemo(() => 
    filteredWebinars.filter(
      (w) => w.status === 'completed' || (w.status === 'published' && isPast(new Date(w.scheduled_date)) && !isToday(new Date(w.scheduled_date)))
    ), [filteredWebinars]
  );
  
  const draftWebinars = useMemo(() => 
    filteredWebinars.filter((w) => w.status === 'draft'), 
    [filteredWebinars]
  );

  const getStatusBadge = (status: string, date: string) => {
    if (status === 'live' || (status === 'published' && isToday(new Date(date)))) {
      return <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">Live Now</Badge>;
    }
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500 hover:bg-green-600">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  interface LocalWebinar {
    id: string;
    title: string;
    description?: string;
    host_name: string;
    scheduled_date: string;
    start_time?: string;
    end_time?: string;
    status: string;
    max_attendees?: number;
    recording_url?: string;
    thumbnail_url?: string;
    category: string | null;
    meeting_link?: string;
    registration_required: boolean;
    registration_deadline?: string;
  }

  const WebinarCard = ({ webinar }: { webinar: LocalWebinar }) => {
    const isRegistered = isUserRegistered(webinar.id);
    const isUpcoming = webinar.status === 'published' && isFuture(new Date(webinar.scheduled_date));
    const spotsRemaining = webinar.max_attendees 
      ? webinar.max_attendees - (registrationCounts[webinar.id] || 0)
      : null;

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        {webinar.thumbnail_url && (
          <div className="relative h-40 overflow-hidden">
            <img 
              src={webinar.thumbnail_url} 
              alt={webinar.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {webinar.recording_url && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="h-12 w-12 text-white" />
              </div>
            )}
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(webinar.status, webinar.scheduled_date)}
                {/* Show registration status for learners - aligned with status badge */}
                {isLearner && isUpcoming && !isPast(new Date(webinar.scheduled_date)) && webinar.registration_required && isRegistered && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Registered
                  </Badge>
                )}
              </div>
              <CardTitle className="line-clamp-2 mt-2">{webinar.title}</CardTitle>
            </div>
          </div>
          <CardDescription className="line-clamp-2">{webinar.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(webinar.scheduled_date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{webinar.start_time?.slice(0, 5)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{registrationCounts[webinar.id] || 0} registered</span>
              {webinar.max_attendees && (
                <span className="text-xs">({spotsRemaining} spots left)</span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Host: {webinar.host_name}</p>
          
          <div className="flex gap-2">
            <Button asChild className="flex-1" variant={isLearner && isUpcoming ? "outline" : "default"}>
              <Link to={`/webinars/${webinar.id}`}>
                View Details
              </Link>
            </Button>
            {webinar.meeting_link && (webinar.status === 'live' || isToday(new Date(webinar.scheduled_date))) && isRegistered && (
              <Button variant="outline" size="icon" asChild>
                <a href={webinar.meeting_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Webinars</h1>
          <p className="text-muted-foreground mt-1">
            {canManage ? 'Manage and conduct live webinars' : 'Join live sessions and watch recordings'}
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link to="/webinars/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Webinar
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search webinars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                {canManage && <SelectItem value="draft">Draft</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingWebinars.length})
          </TabsTrigger>
          {liveWebinars.length > 0 && (
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Live ({liveWebinars.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="recordings" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Recordings ({pastWebinars.length})
          </TabsTrigger>
          {canManage && (
            <TabsTrigger value="drafts" className="flex items-center gap-2">
              Drafts ({draftWebinars.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading webinars...</span>
            </div>
          ) : upcomingWebinars.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No upcoming webinars</h3>
                <p className="text-muted-foreground">
                  {canManage ? 'Create a new webinar to get started.' : 'Check back later for new sessions.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingWebinars.map((webinar) => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveWebinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recordings" className="mt-6">
          {pastWebinars.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <PlayCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No recordings available</h3>
                <p className="text-muted-foreground">Past webinar recordings will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastWebinars.map((webinar) => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </div>
          )}
        </TabsContent>

        {canManage && (
          <TabsContent value="drafts" className="mt-6">
            {draftWebinars.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No draft webinars</h3>
                  <p className="text-muted-foreground">Draft webinars will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {draftWebinars.map((webinar) => (
                  <WebinarCard key={webinar.id} webinar={webinar} />
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default WebinarsPage;
