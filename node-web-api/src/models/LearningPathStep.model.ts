import mongoose, { Schema, Document } from 'mongoose';

export type StepType = 'course' | 'webinar' | 'quiz' | 'resource';

export interface ILearningPathStep extends Document {
  learningPath: mongoose.Types.ObjectId;
  title: string;
  description: string;
  stepOrder: number;
  stepType: StepType;
  isRequired: boolean;
  durationWeeks: number;
  resourceLink?: string;
  course?: mongoose.Types.ObjectId;
  webinar?: mongoose.Types.ObjectId;
  quiz?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathStepSchema = new Schema<ILearningPathStep>(
  {
    learningPath: {
      type: Schema.Types.ObjectId,
      ref: 'LearningPath',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    stepOrder: {
      type: Number,
      required: true,
      default: 1,
    },
    stepType: {
      type: String,
      enum: ['course', 'webinar', 'quiz', 'resource'],
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    durationWeeks: {
      type: Number,
      required: true,
      min: 1,
    },
    resourceLink: {
      type: String,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    webinar: {
      type: Schema.Types.ObjectId,
      ref: 'Webinar',
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
    },
  },
  {
    timestamps: true,
  }
);

LearningPathStepSchema.index({ learningPath: 1, stepOrder: 1 });

export const LearningPathStep = mongoose.model<ILearningPathStep>('LearningPathStep', LearningPathStepSchema);

