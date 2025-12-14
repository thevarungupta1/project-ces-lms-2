import { useMemo } from 'react';
import { useAuth } from '@/app/providers';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Briefcase, Building2, Mail, TrendingUp } from 'lucide-react';
import { sampleLeaderboardEntries } from '@/data/leaderboard';

interface LeaderboardEntry {
  rank: number | null;
  total_points: number;
  learning_progress: number;
  engagement_score: number;
  performance_score: number;
}

export function LearnerProfileCard() {
  const { user, profile } = useAuth();

  const displayName = profile?.full_name || user?.email || 'Learner';
  const displayEmail = user?.email || '';
  const department = profile?.department || 'General';

  // Use local sample data instead of Supabase
  const leaderboardData = useMemo(() => {
    if (!user?.email) return null;
    const entry = sampleLeaderboardEntries.find(e => e.user_email === user.email);
    if (!entry) return null;
    return {
      rank: entry.rank,
      total_points: entry.total_points,
      learning_progress: entry.learning_progress,
      engagement_score: entry.engagement_score,
      performance_score: entry.performance_score,
    };
  }, [user?.email]);

  const loading = false;

  const getRankIcon = (rank: number | null) => {
    if (!rank) return null;
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number | null) => {
    if (!rank) return <Badge variant="outline">Unranked</Badge>;
    if (rank === 1) return <Badge className="bg-yellow-500 hover:bg-yellow-600">🏆 #1</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400 hover:bg-gray-500">🥈 #2</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600 hover:bg-amber-700">🥉 #3</Badge>;
    return <Badge variant="secondary">#{rank}</Badge>;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
      <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
      <CardContent className="relative pt-0 pb-6">
        <div className="flex flex-col items-center -mt-12 mb-4">
          <Avatar className="h-24 w-24 border-4 border-card shadow-xl">
            <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-3">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{displayName}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              {leaderboardData?.rank && getRankIcon(leaderboardData.rank)}
              {getRankBadge(leaderboardData?.rank || null)}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{displayEmail}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{department}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Learner</span>
            </div>
          </div>

          {leaderboardData && (
            <>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Performance Stats</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">{leaderboardData.total_points}</p>
                    <p className="text-xs text-muted-foreground">Total Points</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">{leaderboardData.learning_progress}%</p>
                    <p className="text-xs text-muted-foreground">Progress</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">{leaderboardData.engagement_score}%</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">{leaderboardData.performance_score}%</p>
                    <p className="text-xs text-muted-foreground">Performance</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {!leaderboardData && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Start learning to appear on the leaderboard!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

