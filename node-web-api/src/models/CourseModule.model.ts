import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseModule extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  moduleOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseModuleSchema = new Schema<ICourseModule>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
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
    moduleOrder: {
      type: Number,
      required: true,
      default: 1,
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

CourseModuleSchema.index({ course: 1, moduleOrder: 1 });

export const CourseModule = mongoose.model<ICourseModule>('CourseModule', CourseModuleSchema);

