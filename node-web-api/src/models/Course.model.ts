import mongoose, { Schema, Document } from 'mongoose';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'active' | 'draft' | 'archived';

export interface ICourse extends Document {
  title: string;
  description: string;
  educator: mongoose.Types.ObjectId;
  duration: string;
  level: CourseLevel;
  enrolledCount: number;
  category: mongoose.Types.ObjectId;
  status: CourseStatus;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
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
    educator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'draft',
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

CourseSchema.index({ educator: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ title: 'text', description: 'text' });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);

