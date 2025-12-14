import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { Leaderboard, ILeaderboard } from '../../models/Leaderboard.model';

export class LeaderboardRepository extends BaseRepository<ILeaderboard> {
  constructor() {
    super(Leaderboard);
  }

  async findTopUsers(limit: number = 10) {
    return this.find({}, { sort: { totalPoints: -1 }, limit });
  }

  async findByUser(userId: string) {
    return this.findOne({ user: userId });
  }

  async updateRanks() {
    const users = await this.find({}, { sort: { totalPoints: -1 } });
    for (let i = 0; i < users.length; i++) {
      await this.updateById(users[i]._id.toString(), { rank: i + 1 });
    }
  }
}

