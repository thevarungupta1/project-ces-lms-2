# Database Seeding

This directory contains scripts and data files for seeding the database with sample data.

## 📋 Files

- `users.seed.ts` - Sample user data (admin, educators, learners)
- `categories.seed.ts` - Sample category data
- `courses.seed.ts` - Sample course data
- `quizzes.seed.ts` - Sample quiz data with questions
- `groups.seed.ts` - Sample group data
- `webinars.seed.ts` - Sample webinar data
- `seed.ts` - Main seeding script that loads all data
- `clear.ts` - Script to clear all data from database

## 🚀 Usage

### Seed Database (Load Sample Data)

```bash
npm run seed
```

This command will:
1. Clear all existing data
2. Create sample users (admin, educators, learners)
3. Create categories, courses, quizzes, groups, webinars
4. Create course modules, content, and assignments
5. Create quiz assignments
6. Create learning paths and enrollments
7. Create certificates, announcements, notifications
8. Create leaderboard entries and course reviews

### Clear Database (Delete All Data)

```bash
npm run seed:clear
```

This command will:
1. Delete all data from all collections
2. Show a summary of deleted documents

## 🔑 Test Credentials

After seeding, you can use these credentials to login:

**Admin:**
- Email: `admin@ceslms.com`
- Password: `admin123`

**Educator:**
- Email: `educator@ceslms.com`
- Password: `educator123`

**Learner:**
- Email: `learner@ceslms.com`
- Password: `learner123`

## 📊 Sample Data Created

- **8 Users** (1 admin, 2 educators, 5 learners)
- **8 Categories**
- **8 Courses**
- **24 Course Modules** (3 per course)
- **48 Course Content Items** (2 per module)
- **3 Quizzes** with questions
- **4 Groups**
- **4 Webinars**
- **3 Course Assignments**
- **2 Quiz Assignments**
- **12 Webinar Registrations**
- **2 Learning Paths**
- **4 Learning Path Steps**
- **4 Learning Path Enrollments**
- **1 Certificate Template**
- **2 Issued Certificates**
- **2 Announcements**
- **3 Notifications**
- **5 Leaderboard Entries**
- **3 Course Reviews**

## ⚠️ Important Notes

- The seed script will **clear all existing data** before seeding
- Make sure your MongoDB connection is configured in `.env`
- The seed script uses the same database connection as the main application
- Passwords are hashed using bcrypt before being stored
- All relationships between documents are properly maintained

## 🔧 Customization

You can modify the sample data files to customize:
- Number of users
- Course content
- Quiz questions
- Group memberships
- And more...

Just edit the respective `.seed.ts` files and run `npm run seed` again.

