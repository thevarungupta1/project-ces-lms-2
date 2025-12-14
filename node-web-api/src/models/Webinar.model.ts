import mongoose, { Schema, Document } from 'mongoose';

export type WebinarStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export interface IWebinar extends Document {
  title: string;
  description?: string;
  host: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  scheduledDate: Date;
  startTime: string;
  endTime?: string;
  timezone: string;
  status: WebinarStatus;
  registrationRequired: boolean;
  registrationDeadline?: Date;
  maxAttendees?: number;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  isRecorded: boolean;
  recordingUrl?: string;
  recordingDurationMinutes?: number;
  thumbnailUrl?: string;
  targetAudience?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebinarSchema = new Schema<IWebinar>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'completed', 'cancelled'],
      default: 'draft',
    },
    registrationRequired: {
      type: Boolean,
      default: false,
    },
    registrationDeadline: {
      type: Date,
    },
    maxAttendees: {
      type: Number,
      min: 1,
    },
    meetingLink: {
      type: String,
    },
    meetingId: {
      type: String,
    },
    meetingPassword: {
      type: String,
    },
    isRecorded: {
      type: Boolean,
      default: false,
    },
    recordingUrl: {
      type: String,
    },
    recordingDurationMinutes: {
      type: Number,
    },
    thumbnailUrl: {
      type: String,
    },
    targetAudience: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

WebinarSchema.index({ host: 1 });
WebinarSchema.index({ scheduledDate: 1 });
WebinarSchema.index({ status: 1 });
WebinarSchema.index({ category: 1 });

export const Webinar = mongoose.model<IWebinar>('Webinar', WebinarSchema);

