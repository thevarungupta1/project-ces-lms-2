import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface IQuiz extends Document {
  title: string;
  course: mongoose.Types.ObjectId;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  attempts: number;
  createdBy: mongoose.Types.ObjectId;
  questions: IQuizQuestion[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length >= 2,
        message: 'At least 2 options are required',
      },
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const QuizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    passingScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    attempts: {
      type: Number,
      default: 3,
      min: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: {
      type: [QuizQuestionSchema],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

QuizSchema.index({ course: 1 });
QuizSchema.index({ createdBy: 1 });
QuizSchema.index({ isActive: 1 });

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);

