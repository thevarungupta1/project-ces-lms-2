import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/infrastructure/database/mongo/connection';
import { User } from '../src/models/User.model';
import { Category } from '../src/models/Category.model';
import { Course } from '../src/models/Course.model';
import { Quiz } from '../src/models/Quiz.model';
import { Group } from '../src/models/Group.model';
import { Webinar } from '../src/models/Webinar.model';
import { CourseModule } from '../src/models/CourseModule.model';
import { CourseContent } from '../src/models/CourseContent.model';
import { CourseAssignment } from '../src/models/CourseAssignment.model';
import { QuizAssignment } from '../src/models/QuizAssignment.model';
import { WebinarRegistration } from '../src/models/WebinarRegistration.model';
import { LearningPath } from '../src/models/LearningPath.model';
import { LearningPathStep } from '../src/models/LearningPathStep.model';
import { LearningPathEnrollment } from '../src/models/LearningPathEnrollment.model';
import { CertificateTemplate } from '../src/models/CertificateTemplate.model';
import { IssuedCertificate } from '../src/models/IssuedCertificate.model';
import { Announcement } from '../src/models/Announcement.model';
import { Notification } from '../src/models/Notification.model';
import { Leaderboard } from '../src/models/Leaderboard.model';
import { CourseReview } from '../src/models/CourseReview.model';

dotenv.config();

const clearDatabase = async (): Promise<void> => {
  try {
    console.log('🗑️  Starting database cleanup...');

    // Connect to database
    await connectDatabase();

    // Delete all data from all collections
    console.log('Deleting all data from collections...');
    
    const results = await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Course.deleteMany({}),
      Quiz.deleteMany({}),
      Group.deleteMany({}),
      Webinar.deleteMany({}),
      CourseModule.deleteMany({}),
      CourseContent.deleteMany({}),
      CourseAssignment.deleteMany({}),
      QuizAssignment.deleteMany({}),
      WebinarRegistration.deleteMany({}),
      LearningPath.deleteMany({}),
      LearningPathStep.deleteMany({}),
      LearningPathEnrollment.deleteMany({}),
      CertificateTemplate.deleteMany({}),
      IssuedCertificate.deleteMany({}),
      Announcement.deleteMany({}),
      Notification.deleteMany({}),
      Leaderboard.deleteMany({}),
      CourseReview.deleteMany({}),
    ]);

    const collections = [
      'Users',
      'Categories',
      'Courses',
      'Quizzes',
      'Groups',
      'Webinars',
      'Course Modules',
      'Course Content',
      'Course Assignments',
      'Quiz Assignments',
      'Webinar Registrations',
      'Learning Paths',
      'Learning Path Steps',
      'Learning Path Enrollments',
      'Certificate Templates',
      'Issued Certificates',
      'Announcements',
      'Notifications',
      'Leaderboard',
      'Course Reviews',
    ];

    console.log('\n✅ Database cleared successfully!');
    console.log('\n📊 Deletion Summary:');
    results.forEach((result, index) => {
      console.log(`   ${collections[index]}: ${result.deletedCount} documents deleted`);
    });

    const totalDeleted = results.reduce((sum, result) => sum + result.deletedCount, 0);
    console.log(`\n   Total: ${totalDeleted} documents deleted`);

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

clearDatabase();

