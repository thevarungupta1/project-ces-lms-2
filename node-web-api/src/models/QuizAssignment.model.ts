import mongoose, { Schema, Document } from 'mongoose';

export type QuizAssignmentStatus = 'assigned' | 'in_progress' | 'completed';

export interface IQuizAssignment extends Document {
  quiz: mongoose.Types.ObjectId;
  learner: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  assignedAt: Date;
  dueDate?: Date;
  status: QuizAssignmentStatus;
  attemptsUsed: number;
  bestScore?: number;
  group?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuizAssignmentSchema = new Schema<IQuizAssignment>(
  {
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
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
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['assigned', 'in_progress', 'completed'],
      default: 'assigned',
    },
    attemptsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    bestScore: {
      type: Number,
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

QuizAssignmentSchema.index({ quiz: 1, learner: 1 });
QuizAssignmentSchema.index({ learner: 1, status: 1 });
QuizAssignmentSchema.index({ assignedBy: 1 });

export const QuizAssignment = mongoose.model<IQuizAssignment>('QuizAssignment', QuizAssignmentSchema);

