import { User } from '../../models/User.model';
import { Course } from '../../models/Course.model';
import { CourseAssignment } from '../../models/CourseAssignment.model';
import { QuizAssignment } from '../../models/QuizAssignment.model';
import { Webinar } from '../../models/Webinar.model';
import { LearningPathEnrollment } from '../../models/LearningPathEnrollment.model';
import { IssuedCertificate } from '../../models/IssuedCertificate.model';
import { Leaderboard } from '../../models/Leaderboard.model';

export class DashboardService {
  async getAdminDashboard() {
    const [
      totalUsers,
      totalCourses,
      totalQuizzes,
      totalWebinars,
      activeAssignments,
      completedCertificates,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      QuizAssignment.countDocuments(),
      Webinar.countDocuments({ status: 'published' }),
      CourseAssignment.countDocuments({ status: 'in_progress' }),
      IssuedCertificate.countDocuments(),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalQuizzes,
      totalWebinars,
      activeAssignments,
      completedCertificates,
    };
  }

  async getEducatorDashboard(educatorId: string) {
    const [
      myCourses,
      totalStudents,
      activeAssignments,
      completedAssignments,
    ] = await Promise.all([
      Course.countDocuments({ educator: educatorId }),
      CourseAssignment.countDocuments({ assignedBy: educatorId }),
      CourseAssignment.countDocuments({ assignedBy: educatorId, status: 'in_progress' }),
      CourseAssignment.countDocuments({ assignedBy: educatorId, status: 'completed' }),
    ]);

    return {
      myCourses,
      totalStudents,
      activeAssignments,
      completedAssignments,
    };
  }

  async getLearnerDashboard(learnerId: string) {
    const [
      enrolledCourses,
      completedCourses,
      activeQuizzes,
      upcomingWebinars,
      learningPaths,
      certificates,
      leaderboardRank,
    ] = await Promise.all([
      CourseAssignment.countDocuments({ learner: learnerId }),
      CourseAssignment.countDocuments({ learner: learnerId, status: 'completed' }),
      QuizAssignment.countDocuments({ learner: learnerId, status: 'assigned' }),
      Webinar.countDocuments({
        scheduledDate: { $gte: new Date() },
        status: 'published',
      }),
      LearningPathEnrollment.countDocuments({ user: learnerId }),
      IssuedCertificate.countDocuments({ learner: learnerId }),
      Leaderboard.findOne({ user: learnerId }).select('rank'),
    ]);

    return {
      enrolledCourses,
      completedCourses,
      activeQuizzes,
      upcomingWebinars,
      learningPaths,
      certificates,
      leaderboardRank: leaderboardRank?.rank || null,
    };
  }
}

