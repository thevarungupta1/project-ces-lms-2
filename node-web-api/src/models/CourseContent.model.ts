import mongoose, { Schema, Document } from 'mongoose';

export type ContentType = 'video' | 'document' | 'link' | 'quiz' | 'assignment';

export interface ICourseContent extends Document {
  module: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  contentType: ContentType;
  contentUrl?: string;
  contentText?: string;
  order: number;
  duration?: number; // in minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseContentSchema = new Schema<ICourseContent>(
  {
    module: {
      type: Schema.Types.ObjectId,
      ref: 'CourseModule',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    contentType: {
      type: String,
      enum: ['video', 'document', 'link', 'quiz', 'assignment'],
      required: true,
    },
    contentUrl: {
      type: String,
    },
    contentText: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
    duration: {
      type: Number,
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

CourseContentSchema.index({ module: 1, order: 1 });

export const CourseContent = mongoose.model<ICourseContent>('CourseContent', CourseContentSchema);

