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

import { getHashedUsers, sampleUsers } from './users.seed';
import { sampleCategories } from './categories.seed';
import { getSampleCourses } from './courses.seed';
import { getSampleQuizzes } from './quizzes.seed';
import { getSampleGroups } from './groups.seed';
import { getSampleWebinars } from './webinars.seed';

dotenv.config();

const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
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
    console.log('✅ Existing data cleared');

    // Seed Users
    console.log('👥 Seeding users...');
    const hashedUsers = await getHashedUsers();
    const users = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${users.length} users`);

    const adminUser = users.find((u) => u.role === 'admin')!;
    const educators = users.filter((u) => u.role === 'educator');
    const learners = users.filter((u) => u.role === 'learner');

    // Seed Categories
    console.log('📁 Seeding categories...');
    const categories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${categories.length} categories`);

    // Seed Courses
    console.log('📚 Seeding courses...');
    const coursesData = getSampleCourses(
      educators.map((e) => e._id.toString()),
      categories.map((c) => c._id.toString())
    );
    const courses = await Course.insertMany(coursesData);
    console.log(`✅ Created ${courses.length} courses`);

    // Seed Course Modules
    console.log('📑 Seeding course modules...');
    const courseModules = [];
    for (const course of courses) {
      const modules = [
        {
          course: course._id,
          title: 'Introduction',
          description: 'Introduction to the course',
          moduleOrder: 1,
          isActive: true,
        },
        {
          course: course._id,
          title: 'Core Concepts',
          description: 'Core concepts and fundamentals',
          moduleOrder: 2,
          isActive: true,
        },
        {
          course: course._id,
          title: 'Advanced Topics',
          description: 'Advanced topics and best practices',
          moduleOrder: 3,
          isActive: true,
        },
      ];
      const inserted = await CourseModule.insertMany(modules);
      courseModules.push(...inserted);
    }
    console.log(`✅ Created ${courseModules.length} course modules`);

    // Seed Course Content
    console.log('📄 Seeding course content...');
    const courseContents = [];
    for (const module of courseModules) {
      const contents = [
        {
          module: module._id,
          title: 'Video Lesson',
          description: 'Watch this video to learn the concepts',
          contentType: 'video' as const,
          contentUrl: 'https://example.com/video-1',
          order: 1,
          duration: 30,
          isActive: true,
        },
        {
          module: module._id,
          title: 'Reading Material',
          description: 'Read this document for additional information',
          contentType: 'document' as const,
          contentUrl: 'https://example.com/document-1',
          order: 2,
          isActive: true,
        },
      ];
      const inserted = await CourseContent.insertMany(contents);
      courseContents.push(...inserted);
    }
    console.log(`✅ Created ${courseContents.length} course content items`);

    // Seed Quizzes
    console.log('❓ Seeding quizzes...');
    const quizzesData = getSampleQuizzes(
      courses.map((c) => c._id.toString()),
      educators.map((e) => e._id.toString())
    );
    const quizzes = await Quiz.insertMany(quizzesData);
    console.log(`✅ Created ${quizzes.length} quizzes`);

    // Seed Groups
    console.log('👥 Seeding groups...');
    const groupsData = getSampleGroups(
      adminUser._id.toString(),
      learners.map((l) => l._id.toString())
    );
    const groups = await Group.insertMany(groupsData);
    console.log(`✅ Created ${groups.length} groups`);

    // Seed Course Assignments
    console.log('📋 Seeding course assignments...');
    const courseAssignments = [];
    for (let i = 0; i < Math.min(3, courses.length); i++) {
      const assignment = {
        course: courses[i]._id,
        learner: learners[i % learners.length]._id,
        assignedBy: educators[0]._id,
        assignedAt: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'not_started' as const,
        progress: 0,
      };
      courseAssignments.push(assignment);
    }
    await CourseAssignment.insertMany(courseAssignments);
    console.log(`✅ Created ${courseAssignments.length} course assignments`);

    // Seed Quiz Assignments
    console.log('📝 Seeding quiz assignments...');
    const quizAssignments = [];
    for (let i = 0; i < Math.min(2, quizzes.length); i++) {
      const assignment = {
        quiz: quizzes[i]._id,
        learner: learners[i % learners.length]._id,
        assignedBy: educators[0]._id,
        assignedAt: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'assigned' as const,
        attemptsUsed: 0,
      };
      quizAssignments.push(assignment);
    }
    await QuizAssignment.insertMany(quizAssignments);
    console.log(`✅ Created ${quizAssignments.length} quiz assignments`);

    // Seed Webinars
    console.log('🎥 Seeding webinars...');
    const webinarsData = getSampleWebinars(educators.map((e) => e._id.toString()));
    const webinars = await Webinar.insertMany(webinarsData);
    console.log(`✅ Created ${webinars.length} webinars`);

    // Seed Webinar Registrations
    console.log('📝 Seeding webinar registrations...');
    const webinarRegistrations = [];
    for (const webinar of webinars) {
      for (let i = 0; i < Math.min(3, learners.length); i++) {
        const registration = {
          webinar: webinar._id,
          user: learners[i]._id,
          registeredAt: new Date(),
          attended: false,
        };
        webinarRegistrations.push(registration);
      }
    }
    await WebinarRegistration.insertMany(webinarRegistrations);
    console.log(`✅ Created ${webinarRegistrations.length} webinar registrations`);

    // Seed Learning Paths
    console.log('🛤️  Seeding learning paths...');
    const learningPaths = await LearningPath.insertMany([
      {
        title: 'Full Stack Developer Path',
        description: 'Complete path to become a full stack developer',
        category: categories[0]._id,
        difficultyLevel: 'Intermediate' as const,
        durationWeeks: 16,
        isActive: true,
        thumbnail: 'https://via.placeholder.com/400x300?text=Full+Stack+Path',
      },
      {
        title: 'Data Scientist Path',
        description: 'Path to become a data scientist',
        category: categories[1]._id,
        difficultyLevel: 'Advanced' as const,
        durationWeeks: 20,
        isActive: true,
        thumbnail: 'https://via.placeholder.com/400x300?text=Data+Science+Path',
      },
    ]);
    console.log(`✅ Created ${learningPaths.length} learning paths`);

    // Seed Learning Path Steps
    console.log('📌 Seeding learning path steps...');
    const learningPathSteps = [];
    for (let i = 0; i < learningPaths.length; i++) {
      const path = learningPaths[i];
      const steps = [
        {
          learningPath: path._id,
          title: 'Foundation Course',
          description: 'Complete the foundation course to start your learning journey',
          stepOrder: 1,
          stepType: 'course' as const,
          course: courses[i % courses.length]._id,
          isRequired: true,
          durationWeeks: 4,
        },
        {
          learningPath: path._id,
          title: 'Assessment Quiz',
          description: 'Test your knowledge with this quiz',
          stepOrder: 2,
          stepType: 'quiz' as const,
          quiz: quizzes[i % quizzes.length]._id,
          isRequired: true,
          durationWeeks: 1,
        },
      ];
      const inserted = await LearningPathStep.insertMany(steps);
      learningPathSteps.push(...inserted);
    }
    console.log(`✅ Created ${learningPathSteps.length} learning path steps`);

    // Seed Learning Path Enrollments
    console.log('🎓 Seeding learning path enrollments...');
    const enrollments = [];
    for (const path of learningPaths) {
      for (let i = 0; i < Math.min(2, learners.length); i++) {
        const enrollment = {
          learningPath: path._id,
          user: learners[i]._id,
          enrolledAt: new Date(),
          progress: 0,
          completedAt: null,
        };
        enrollments.push(enrollment);
      }
    }
    await LearningPathEnrollment.insertMany(enrollments);
    console.log(`✅ Created ${enrollments.length} learning path enrollments`);

    // Seed Certificate Templates
    console.log('🏆 Seeding certificate templates...');
    const certificateTemplates = await CertificateTemplate.insertMany([
      {
        name: 'Course Completion Certificate',
        description: 'Standard certificate for course completion',
        isDefault: true,
        isActive: true,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#3b82f6',
        accentColor: '#3b82f6',
        signatureName: 'CES LMS Administrator',
        signatureTitle: 'Chief Learning Officer',
        footerText: 'This certificate verifies successful completion of the course',
      },
    ]);
    console.log(`✅ Created ${certificateTemplates.length} certificate templates`);

    // Seed Issued Certificates
    console.log('📜 Seeding issued certificates...');
    const issuedCertificates = [];
    for (let i = 0; i < Math.min(2, courses.length); i++) {
      const certificate = {
        learner: learners[i]._id,
        course: courses[i]._id,
        template: certificateTemplates[0]._id,
        certificateNumber: `CERT-${Date.now()}-${i}`,
        completionDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
        issuedAt: new Date(),
      };
      issuedCertificates.push(certificate);
    }
    await IssuedCertificate.insertMany(issuedCertificates);
    console.log(`✅ Created ${issuedCertificates.length} issued certificates`);

    // Seed Announcements
    console.log('📢 Seeding announcements...');
    const announcements = await Announcement.insertMany([
      {
        title: 'Welcome to CES LMS',
        message: 'Welcome to our Learning Management System. Start exploring courses today!',
        audience: 'all' as const,
        isActive: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
      },
      {
        title: 'New Courses Available',
        message: 'Check out our new courses on web development and data science.',
        audience: 'all' as const,
        isActive: true,
        publishedAt: new Date(),
        createdBy: adminUser._id,
      },
    ]);
    console.log(`✅ Created ${announcements.length} announcements`);

    // Seed Notifications
    console.log('🔔 Seeding notifications...');
    const notifications = [];
    for (const learner of learners.slice(0, 3)) {
      const notification = {
        user: learner._id,
        title: 'New Assignment',
        message: 'You have a new course assignment',
        type: 'info' as const,
        isRead: false,
      };
      notifications.push(notification);
    }
    await Notification.insertMany(notifications);
    console.log(`✅ Created ${notifications.length} notifications`);

    // Seed Leaderboard
    console.log('🏅 Seeding leaderboard...');
    const leaderboardEntries = [];
    for (let i = 0; i < learners.length; i++) {
      const entry = {
        user: learners[i]._id,
        points: Math.floor(Math.random() * 1000) + 100,
        rank: i + 1,
        coursesCompleted: Math.floor(Math.random() * 5),
        quizzesCompleted: Math.floor(Math.random() * 10),
      };
      leaderboardEntries.push(entry);
    }
    // Sort by points descending
    leaderboardEntries.sort((a, b) => b.points - a.points);
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    await Leaderboard.insertMany(leaderboardEntries);
    console.log(`✅ Created ${leaderboardEntries.length} leaderboard entries`);

    // Seed Course Reviews
    console.log('⭐ Seeding course reviews...');
    const courseReviews = [];
    for (let i = 0; i < Math.min(3, courses.length); i++) {
      const review = {
        course: courses[i]._id,
        user: learners[i % learners.length]._id,
        rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
        comment: 'Great course! Very informative and well-structured.',
      };
      courseReviews.push(review);
    }
    await CourseReview.insertMany(courseReviews);
    console.log(`✅ Created ${courseReviews.length} course reviews`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Courses: ${courses.length}`);
    console.log(`   Course Modules: ${courseModules.length}`);
    console.log(`   Course Content: ${courseContents.length}`);
    console.log(`   Quizzes: ${quizzes.length}`);
    console.log(`   Groups: ${groups.length}`);
    console.log(`   Course Assignments: ${courseAssignments.length}`);
    console.log(`   Quiz Assignments: ${quizAssignments.length}`);
    console.log(`   Webinars: ${webinars.length}`);
    console.log(`   Webinar Registrations: ${webinarRegistrations.length}`);
    console.log(`   Learning Paths: ${learningPaths.length}`);
    console.log(`   Learning Path Steps: ${learningPathSteps.length}`);
    console.log(`   Learning Path Enrollments: ${enrollments.length}`);
    console.log(`   Certificate Templates: ${certificateTemplates.length}`);
    console.log(`   Issued Certificates: ${issuedCertificates.length}`);
    console.log(`   Announcements: ${announcements.length}`);
    console.log(`   Notifications: ${notifications.length}`);
    console.log(`   Leaderboard Entries: ${leaderboardEntries.length}`);
    console.log(`   Course Reviews: ${courseReviews.length}`);

    console.log('\n🔑 Test Credentials:');
    sampleUsers.forEach((user) => {
      console.log(`   ${user.email} / ${user.password} (${user.role})`);
    });

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seedDatabase();

