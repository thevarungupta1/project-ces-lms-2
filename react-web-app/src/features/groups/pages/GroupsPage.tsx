import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Users as UsersIcon, Calendar, User } from 'lucide-react';
import { useGroups } from '../hooks/useGroups';
import { Loader } from '@/shared/components';

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch groups from API
  const { data: groupsResponse, isLoading: loadingGroups } = useGroups({ isActive: true });
  const groups = groupsResponse?.data || [];

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const name = group.name.toLowerCase();
      const description = (group.description || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || description.includes(search);
    });
  }, [groups, searchTerm]);

  // Calculate stats
  const totalMembers = useMemo(() => {
    return groups.reduce((acc, group) => {
      const memberCount = Array.isArray(group.members) 
        ? group.members.length 
        : (typeof group.members === 'object' ? group.members.length : 0);
      return acc + memberCount;
    }, 0);
  }, [groups]);

  const avgGroupSize = groups.length > 0 ? Math.round(totalMembers / groups.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Groups</h1>
          <p className="text-muted-foreground mt-1.5">
            Organize users into groups for easier management
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/groups/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <UsersIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loadingGroups ? (
              <Loader size="md" />
            ) : (
              <div className="text-2xl font-bold">{groups.length}</div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loadingGroups ? (
              <Loader size="md" />
            ) : (
              <div className="text-2xl font-bold">{totalMembers}</div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Group Size</CardTitle>
            <UsersIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loadingGroups ? (
              <Loader size="md" />
            ) : (
              <div className="text-2xl font-bold">{avgGroupSize}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No groups found</p>
            </CardContent>
          </Card>
        ) : (
          filteredGroups.map((group) => (
            <Card key={group.id} className="group hover:border-primary/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">{group.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {group.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span>{group.memberCount} members</span>
                    </div>
                    <Badge variant="outline">{group.memberCount > 20 ? 'Large' : group.memberCount > 10 ? 'Medium' : 'Small'}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created {new Date(group.createdDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>by {group.createdBy}</span>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/groups/${group.id}`}>
                        View Group
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Groups;
