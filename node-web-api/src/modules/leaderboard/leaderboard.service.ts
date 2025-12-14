import { ApiError } from '../../core/http/ApiError';
import { LeaderboardRepository } from './leaderboard.repository';
import { ILeaderboard } from '../../models/Leaderboard.model';
import { UpdateLeaderboardInput } from '../../schemas/leaderboard.schema';
import { User } from '../../models/User.model';

export class LeaderboardService {
  private leaderboardRepository: LeaderboardRepository;

  constructor() {
    this.leaderboardRepository = new LeaderboardRepository();
  }

  async getLeaderboard(limit: number = 10) {
    const users = await this.leaderboardRepository.findTopUsers(limit);
    return users;
  }

  async getUserRanking(userId: string): Promise<ILeaderboard | null> {
    return this.leaderboardRepository.findByUser(userId);
  }

  async createOrUpdateUserEntry(userId: string, data: UpdateLeaderboardInput): Promise<ILeaderboard> {
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    let entry = await this.leaderboardRepository.findByUser(userId);
    
    if (entry) {
      // Update existing entry
      const updateData: any = {};
      if (data.totalPoints !== undefined) updateData.totalPoints = data.totalPoints;
      if (data.learningProgress !== undefined) updateData.learningProgress = data.learningProgress;
      if (data.engagementScore !== undefined) updateData.engagementScore = data.engagementScore;
      if (data.performanceScore !== undefined) updateData.performanceScore = data.performanceScore;
      if (data.contributions !== undefined) updateData.contributions = data.contributions;
      if (data.activitiesCompleted !== undefined) updateData.activitiesCompleted = data.activitiesCompleted;

      entry = await this.leaderboardRepository.updateById(entry._id.toString(), updateData);
      if (!entry) {
        throw ApiError.notFound('Leaderboard entry not found');
      }
    } else {
      // Create new entry
      entry = await this.leaderboardRepository.create({
        user: userId,
        totalPoints: data.totalPoints || 0,
        learningProgress: data.learningProgress || 0,
        engagementScore: data.engagementScore || 0,
        performanceScore: data.performanceScore || 0,
        contributions: data.contributions || 0,
        activitiesCompleted: data.activitiesCompleted || 0,
      } as any);
    }

    // Update ranks
    await this.leaderboardRepository.updateRanks();

    return entry;
  }

  async updateRanks(): Promise<void> {
    await this.leaderboardRepository.updateRanks();
  }
}

