import mongoose, { Schema, Document } from 'mongoose';

export type AssignmentStatus = 'not_started' | 'in_progress' | 'completed';

export interface ICourseAssignment extends Document {
  course: mongoose.Types.ObjectId;
  learner: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  assignedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;
  status: AssignmentStatus;
  progress: number; // 0-100
  group?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CourseAssignmentSchema = new Schema<ICourseAssignment>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    learner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
  },
  {
    timestamps: true,
  }
);

CourseAssignmentSchema.index({ course: 1, learner: 1 });
CourseAssignmentSchema.index({ learner: 1, status: 1 });
CourseAssignmentSchema.index({ assignedBy: 1 });

export const CourseAssignment = mongoose.model<ICourseAssignment>('CourseAssignment', CourseAssignmentSchema);

