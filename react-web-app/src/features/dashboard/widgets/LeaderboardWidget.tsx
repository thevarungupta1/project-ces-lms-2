import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { useLeaderboard } from '@/features/leaderboard/hooks/useLeaderboard';
import { Loader } from '@/shared/components';

interface LeaderboardEntry {
  id: string;
  user_name: string;
  user_email: string;
  total_points: number;
  rank: number | null;
}

export function LeaderboardWidget() {
  // Fetch leaderboard from API
  const { data: entriesData, isLoading: loading } = useLeaderboard(10);

  // Map API data to component format
  const entries = useMemo(() => {
    if (!entriesData) return [];
    
    return entriesData.map(entry => {
      const userName = typeof entry.user === 'object' ? entry.user.name : 'Unknown';
      const userEmail = typeof entry.user === 'object' ? entry.user.email : '';
      
      return {
        id: entry._id || entry.id || '',
        user_name: userName,
        user_email: userEmail,
        total_points: entry.totalPoints,
        rank: entry.rank || null,
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

  const getRankBadgeVariant = (rank: number | null) => {
    if (!rank) return "secondary";
    if (rank === 1) return "default";
    if (rank === 2 || rank === 3) return "secondary";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top 10 learners by total points</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size="md" text="Loading leaderboard..." />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No leaderboard entries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {getRankIcon(entry.rank) || (entry.rank ? `#${entry.rank}` : '-')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{entry.user_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {entry.user_email}
                  </p>
                </div>
                <Badge variant={getRankBadgeVariant(entry.rank)} className="font-bold">
                  {entry.total_points} pts
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

