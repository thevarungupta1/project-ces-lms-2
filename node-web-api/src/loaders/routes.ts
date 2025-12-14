import { Application } from 'express';
import { env } from '../config/env';

// Import routes
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import courseRoutes from '../modules/course/course.routes';
import categoryRoutes from '../modules/category/category.routes';
import quizRoutes from '../modules/quiz/quiz.routes';
import quizAssignmentRoutes from '../modules/quiz-assignment/quiz-assignment.routes';
import courseModuleRoutes from '../modules/course-module/course-module.routes';
import courseContentRoutes from '../modules/course-content/course-content.routes';
import courseAssignmentRoutes from '../modules/course-assignment/course-assignment.routes';
import webinarRoutes from '../modules/webinar/webinar.routes';
import webinarRegistrationRoutes from '../modules/webinar-registration/webinar-registration.routes';
import groupRoutes from '../modules/group/group.routes';
import learningPathRoutes from '../modules/learning-path/learning-path.routes';
import learningPathStepRoutes from '../modules/learning-path-step/learning-path-step.routes';
import learningPathEnrollmentRoutes from '../modules/learning-path-enrollment/learning-path-enrollment.routes';
import certificateTemplateRoutes from '../modules/certificate-template/certificate-template.routes';
import issuedCertificateRoutes from '../modules/issued-certificate/issued-certificate.routes';
import announcementRoutes from '../modules/announcement/announcement.routes';
import notificationRoutes from '../modules/notification/notification.routes';
import leaderboardRoutes from '../modules/leaderboard/leaderboard.routes';
import courseReviewRoutes from '../modules/course-review/course-review.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

export const setupRoutes = (app: Application): void => {
  const apiPrefix = `/api/${env.apiVersion}`;

  // Core API routes
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/users`, userRoutes);
  app.use(`${apiPrefix}/courses`, courseRoutes);
  app.use(`${apiPrefix}/categories`, categoryRoutes);

  // Course-related routes
  app.use(`${apiPrefix}/course-modules`, courseModuleRoutes);
  app.use(`${apiPrefix}/course-content`, courseContentRoutes);
  app.use(`${apiPrefix}/course-assignments`, courseAssignmentRoutes);
  app.use(`${apiPrefix}/course-reviews`, courseReviewRoutes);

  // Quiz routes
  app.use(`${apiPrefix}/quizzes`, quizRoutes);
  app.use(`${apiPrefix}/quiz-assignments`, quizAssignmentRoutes);

  // Webinar routes
  app.use(`${apiPrefix}/webinars`, webinarRoutes);
  app.use(`${apiPrefix}/webinar-registrations`, webinarRegistrationRoutes);

  // Group routes
  app.use(`${apiPrefix}/groups`, groupRoutes);

  // Learning Path routes
  app.use(`${apiPrefix}/learning-paths`, learningPathRoutes);
  app.use(`${apiPrefix}/learning-path-steps`, learningPathStepRoutes);
  app.use(`${apiPrefix}/learning-path-enrollments`, learningPathEnrollmentRoutes);

  // Certificate routes
  app.use(`${apiPrefix}/certificate-templates`, certificateTemplateRoutes);
  app.use(`${apiPrefix}/issued-certificates`, issuedCertificateRoutes);

  // Communication routes
  app.use(`${apiPrefix}/announcements`, announcementRoutes);
  app.use(`${apiPrefix}/notifications`, notificationRoutes);

  // Analytics routes
  app.use(`${apiPrefix}/leaderboard`, leaderboardRoutes);
  app.use(`${apiPrefix}/dashboard`, dashboardRoutes);
};

