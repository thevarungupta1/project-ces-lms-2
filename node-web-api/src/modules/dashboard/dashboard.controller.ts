import { Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';
import { AuthRequest } from '../../core/middleware/auth';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getDashboard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      let dashboard;
      switch (req.user.role) {
        case 'admin':
          dashboard = await this.dashboardService.getAdminDashboard();
          break;
        case 'educator':
          dashboard = await this.dashboardService.getEducatorDashboard(req.user.id);
          break;
        case 'learner':
          dashboard = await this.dashboardService.getLearnerDashboard(req.user.id);
          break;
        default:
          throw new Error('Invalid user role');
      }

      res.json(ResponseBuilder.success(dashboard));
    } catch (error) {
      next(error);
    }
  };
}

