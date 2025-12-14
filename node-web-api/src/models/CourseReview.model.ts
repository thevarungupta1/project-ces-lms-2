import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseReview extends Document {
  course: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseReviewSchema = new Schema<ICourseReview>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CourseReviewSchema.index({ course: 1, user: 1 }, { unique: true });
CourseReviewSchema.index({ course: 1 });

export const CourseReview = mongoose.model<ICourseReview>('CourseReview', CourseReviewSchema);

