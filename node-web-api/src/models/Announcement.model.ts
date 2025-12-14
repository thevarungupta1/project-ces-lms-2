import mongoose, { Schema, Document } from 'mongoose';

export type AnnouncementType = 'info' | 'success' | 'warning' | 'error';
export type TargetAudience = 'all' | 'learners' | 'educators' | 'managers';

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  type: AnnouncementType;
  createdBy: mongoose.Types.ObjectId;
  targetAudience?: TargetAudience;
  targetDepartments?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetAudience: {
      type: String,
      enum: ['all', 'learners', 'educators', 'managers'],
    },
    targetDepartments: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

AnnouncementSchema.index({ createdBy: 1 });
AnnouncementSchema.index({ isActive: 1 });
AnnouncementSchema.index({ createdAt: -1 });

export const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

