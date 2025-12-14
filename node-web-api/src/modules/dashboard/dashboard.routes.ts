import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../core/middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

// Protected routes
router.get('/', authenticate, dashboardController.getDashboard);

export default router;

