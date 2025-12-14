import { Router } from 'express';
import { LeaderboardController } from './leaderboard.controller';
import { authenticate, authorize } from '../../core/middleware/auth';

const router = Router();
const leaderboardController = new LeaderboardController();

// Public routes
router.get('/', leaderboardController.getLeaderboard);

// Protected routes
router.get('/me', authenticate, leaderboardController.getMyRanking);
router.put('/user/:userId', authenticate, authorize('admin'), leaderboardController.updateUserEntry);
router.put('/update-ranks', authenticate, authorize('admin'), leaderboardController.updateRanks);

export default router;

