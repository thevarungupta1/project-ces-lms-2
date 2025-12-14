import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Megaphone, Calendar, Eye } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'maintenance';
  targetAudience: string[];
  publishedBy: string;
  publishedDate: string;
  expiryDate?: string;
  views: number;
  thumbnail?: string;
}

const sampleAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New Course Launch: Advanced Data Science',
    content: 'We are excited to announce the launch of our new Advanced Data Science course. Enrollment is now open!',
    type: 'general',
    targetAudience: ['all'],
    publishedBy: 'Sarah Johnson',
    publishedDate: '2024-01-15',
    views: 234,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    id: '2',
    title: 'System Maintenance Scheduled',
    content: 'The LMS will undergo scheduled maintenance on January 20, 2024, from 2:00 AM to 4:00 AM EST. The system will be unavailable during this time.',
    type: 'urgent',
    targetAudience: ['all'],
    publishedBy: 'Admin',
    publishedDate: '2024-01-14',
    expiryDate: '2024-01-21',
    views: 456,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },
  {
    id: '3',
    title: 'Quarterly Learning Excellence Awards',
    content: 'Nominations are now open for the Q1 Learning Excellence Awards. Recognize outstanding learners and educators in your department.',
    type: 'event',
    targetAudience: ['admin', 'educator'],
    publishedBy: 'HR Team',
    publishedDate: '2024-01-12',
    expiryDate: '2024-03-31',
    views: 189,
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
  },
  {
    id: '4',
    title: 'New Features: Interactive Quizzes',
    content: 'Educators can now create interactive quizzes with multimedia support, timer settings, and instant feedback options.',
    type: 'general',
    targetAudience: ['educator'],
    publishedBy: 'Product Team',
    publishedDate: '2024-01-10',
    views: 312,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  },
];

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredAnnouncements = sampleAnnouncements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || announcement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'destructive';
      case 'event':
        return 'default';
      case 'maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Announcements</h1>
          <p className="text-muted-foreground mt-1.5">
            Create and manage platform-wide announcements
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/announcements/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Announcement
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('all')}
              >
                All
              </Button>
              <Button
                variant={typeFilter === 'urgent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('urgent')}
              >
                Urgent
              </Button>
              <Button
                variant={typeFilter === 'event' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('event')}
              >
                Events
              </Button>
              <Button
                variant={typeFilter === 'general' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('general')}
              >
                General
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="grid gap-4">
        {filteredAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No announcements found</p>
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="group hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg">
              <div className="flex flex-col md:flex-row">
                {announcement.thumbnail && (
                  <div className="relative md:w-72 h-48 md:h-auto overflow-hidden flex-shrink-0">
                    <img 
                      src={announcement.thumbnail} 
                      alt={announcement.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
                  </div>
                )}
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getTypeBadgeVariant(announcement.type)} className="capitalize">
                            {announcement.type}
                          </Badge>
                          {announcement.expiryDate && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{announcement.title}</CardTitle>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/announcements/${announcement.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {announcement.content}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Published by:</span>
                        <span>{announcement.publishedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(announcement.publishedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{announcement.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Target:</span>
                        <span className="capitalize">{announcement.targetAudience.join(', ')}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
