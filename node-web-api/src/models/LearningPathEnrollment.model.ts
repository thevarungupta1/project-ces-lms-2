import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningPathEnrollment extends Document {
  learningPath: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // 0-100
  currentStep?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathEnrollmentSchema = new Schema<ILearningPathEnrollment>(
  {
    learningPath: {
      type: Schema.Types.ObjectId,
      ref: 'LearningPath',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrolledAt: {
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
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currentStep: {
      type: Schema.Types.ObjectId,
      ref: 'LearningPathStep',
    },
  },
  {
    timestamps: true,
  }
);

LearningPathEnrollmentSchema.index({ learningPath: 1, user: 1 }, { unique: true });
LearningPathEnrollmentSchema.index({ user: 1 });

export const LearningPathEnrollment = mongoose.model<ILearningPathEnrollment>('LearningPathEnrollment', LearningPathEnrollmentSchema);

