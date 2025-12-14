import mongoose, { Schema, Document } from 'mongoose';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ILearningPath extends Document {
  title: string;
  description: string;
  category: mongoose.Types.ObjectId;
  difficultyLevel: DifficultyLevel;
  durationWeeks: number;
  isActive: boolean;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathSchema = new Schema<ILearningPath>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    difficultyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    durationWeeks: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

LearningPathSchema.index({ category: 1 });
LearningPathSchema.index({ isActive: 1 });

export const LearningPath = mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);

