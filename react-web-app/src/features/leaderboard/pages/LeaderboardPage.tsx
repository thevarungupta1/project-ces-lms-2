import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { PageLoader } from '@/shared/components';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  total_points: number;
  learning_progress: number;
  engagement_score: number;
  performance_score: number;
  contributions: number;
  activities_completed: number;
  rank: number | null;
  created_at: string;
  updated_at: string;
}

export default function Leaderboard() {

  // Fetch leaderboard from API
  const { data: entriesData, isLoading: loading } = useLeaderboard(100);

  // Map API data to component format
  const entries = useMemo(() => {
    if (!entriesData) return [];
    
    return entriesData.map(entry => {
      const userName = typeof entry.user === 'object' ? entry.user.name : 'Unknown';
      const userEmail = typeof entry.user === 'object' ? entry.user.email : '';
      
      return {
        id: entry._id || entry.id || '',
        user_id: typeof entry.user === 'object' ? entry.user._id : entry.user,
        user_name: userName,
        user_email: userEmail,
        total_points: entry.totalPoints,
        learning_progress: entry.learningProgress,
        engagement_score: entry.engagementScore,
        performance_score: entry.performanceScore,
        contributions: entry.contributions,
        activities_completed: entry.activitiesCompleted,
        rank: entry.rank || null,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
      };
    }).sort((a, b) => {
      if (a.rank === null && b.rank === null) return 0;
      if (a.rank === null) return 1;
      if (b.rank === null) return -1;
      return a.rank - b.rank;
    });
  }, [entriesData]);

  const getRankIcon = (rank: number | null) => {
    if (!rank) return null;
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  if (loading) {
    return <PageLoader text="Loading leaderboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Leaderboard Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage learner rankings and gamification scores
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard Rankings</CardTitle>
          <CardDescription>
            {entries.length} learners ranked by total points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Learner</TableHead>
                <TableHead className="text-right">Total Points</TableHead>
                <TableHead className="text-right">Progress</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
                <TableHead className="text-right">Performance</TableHead>
                <TableHead className="text-right">Contributions</TableHead>
                <TableHead className="text-right">Activities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                      <span>#{entry.rank || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{entry.user_name}</p>
                      <p className="text-sm text-muted-foreground">{entry.user_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="font-bold">
                      {entry.total_points}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{entry.learning_progress}</TableCell>
                  <TableCell className="text-right">{entry.engagement_score}</TableCell>
                  <TableCell className="text-right">{entry.performance_score}</TableCell>
                  <TableCell className="text-right">{entry.contributions}</TableCell>
                  <TableCell className="text-right">{entry.activities_completed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
