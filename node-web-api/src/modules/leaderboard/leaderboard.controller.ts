import { Request, Response, NextFunction } from 'express';
import { LeaderboardService } from './leaderboard.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class LeaderboardController {
  private leaderboardService: LeaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService();
  }

  getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await this.leaderboardService.getLeaderboard(limit);
      res.json(ResponseBuilder.success(leaderboard));
    } catch (error) {
      next(error);
    }
  };

  getMyRanking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const ranking = await this.leaderboardService.getUserRanking(req.user.id);
      res.json(ResponseBuilder.success(ranking));
    } catch (error) {
      next(error);
    }
  };

  updateUserEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const entry = await this.leaderboardService.createOrUpdateUserEntry(userId, req.body);
      res.json(ResponseBuilder.success(entry, 'Leaderboard entry updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateRanks = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.leaderboardService.updateRanks();
      res.json(ResponseBuilder.success(null, 'Ranks updated successfully'));
    } catch (error) {
      next(error);
    }
  };
}

